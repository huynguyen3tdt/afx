import { Component, OnInit, ViewChild } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
// import { ACCOUNT_TYPE } from 'src/app/core/constant/authen-constant';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import {
  BankInforModel,
  Mt5Model,
  TransactionModel,
  WithdrawAmountModel,
  postWithdrawModel
} from 'src/app/core/model/withdraw-request-response.model';
import { MIN_WITHDRAW, ACCOUNT_IDS, LOCALE } from './../../core/constant/authen-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { PaymentMethod, TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DepositService } from 'src/app/core/services/deposit.service';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { ListTransactionComponent } from '../list-transaction/list-transaction.component';
declare var $: any;
import * as moment from 'moment';

@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.css']
})
export class WithdrawRequestComponent implements OnInit {
  @ViewChild('listTran', { static: true }) listTran: ListTransactionComponent;

  mt5Infor: Mt5Model;
  accountType;
  bankInfor: BankInforModel;
  listDwAmount: WithdrawAmountModel;
  withdrawForm: FormGroup;
  isSubmitted: boolean;
  listDwHistory;
  transactionDetail: TransactionModel;
  minWithdraw: string;
  depositValue: number;
  withdrawError: boolean;
  equityEstimate: number;
  marginLevelEstimate: number;
  errMessage: boolean;
  accountID: string;
  account: string;
  equity: number;
  usedMargin: number;
  listTradingAccount: Array<AccountType>;
  listWithdraw: Array<TransactionModel>;
  listWithdrawRequest: postWithdrawModel;
  withdrawTranDetail: TransactionModel;
  newDate: string;
  listBankTranfer: Array<DepositModel>;
  transactionType: string;
  statusSearch: string;
  formatDateYear: string;
  formatDateHour: string;
  locale: string;
  lastestTime: string;
  freeMargin: number;
  withdrawAmount: boolean;
  withdrawableAmount: number;
  withdrawFee: number;
  totalAmount;

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService,
              private depositService: DepositService) { }

  ngOnInit() {
    this.withdrawFee = 0;
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === 'en') {
      this.formatDateYear = EN_FORMATDATE;
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === 'jp') {
      this.formatDateYear = JAPAN_FORMATDATE;
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.transactionType = TYPEOFTRANHISTORY.WITHDRAWAL.key;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = this.listTradingAccount[0].value;
      this.account = this.listTradingAccount[0].account_id;
    }
    this.minWithdraw = localStorage.getItem(MIN_WITHDRAW);
    this.initWithdrawForm();
    if (this.accountID) {
      this.getMt5Infor(Number(this.accountID.split('-')[1]));
      this.getDwAmount(Number(this.accountID.split('-')[1]));
    }
    this.getBankInfor();
  }

  initWithdrawForm() {
    const numeral = require('numeral');
    this.withdrawForm = new FormGroup({
      amount: new FormControl(numeral(10000).format('0,0'), requiredInput),
      wholeMoney: new FormControl(false),
    });
    this.totalAmount = numeral(this.withdrawForm.controls.amount.value).value() - this.withdrawFee;
  }


  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.mt5Infor = response.data;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
        this.lastestTime = moment(this.mt5Infor.lastest_time).format(this.formatDateHour);
      }
      this.countWithdraw();
    });
  }
  getBankInfor() {
    this.spinnerService.show();
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.bankInfor = response.data;

      }
    });
  }
  getDwAmount(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwAmount(accountId).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listDwAmount = response.data;
      }
    });
  }
  getDepositBank() {
    this.spinnerService.show();
    this.depositService.getDepositBank().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listBankTranfer = response.data;
        this.listBankTranfer.forEach(item => {
          item.branch_code = item.branch_code;
        });
      }
    });
  }

  changeWithdtaw(event: any) {
    const numeral = require('numeral');
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    if (this.depositValue < 10000) {
      this.withdrawError = true;
      return;
    }
    this.totalAmount = numeral(this.withdrawForm.controls.amount.value).value() - this.withdrawFee;
    this.withdrawError = false;
    this.countWithdraw();
  }
  countWithdraw() {
    const numeral = require('numeral');
    this.errMessage = false;
    this.equityEstimate = Math.floor(this.equity - numeral(this.withdrawForm.controls.amount.value).value());
    this.marginLevelEstimate = this.globalService.calculateMarginLevel(this.equityEstimate, this.usedMargin);
    if (this.marginLevelEstimate <= 100) {
      this.errMessage = true;
    }
  }
  onRefesh() {
    this.getMt5Infor(Number(this.accountID.split('-')[1]));
  }

  openDetailTransaction(item) {
    this.transactionDetail = item;
    $('#detai_transaction').modal('show');
  }

  showConfirm() {
    this.withdrawAmount = false;
    const numeral = require('numeral');
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    this.withdrawableAmount = numeral(this.mt5Infor.free_margin).value();
    if (this.depositValue < numeral(this.minWithdraw).value()) {
      this.withdrawError = true;
      return;
    }
    if (this.withdrawableAmount < this.depositValue) {
      this.withdrawAmount = true;
      return;
    }

    $('#modal-withdraw-confirm').modal('show');
    this.newDate = moment(new Date()).format(this.formatDateHour);
    this.getDepositBank();
  }
  changeAmount() {
    if (this.withdrawForm.controls.wholeMoney.value === true) {
      $('#amount').attr('disabled', true);
      this.withdrawAmount = false;
      const numeral = require('numeral');
      this.freeMargin = numeral(this.withdrawForm.controls.amount.value).value();
    } else {
      $('#amount').attr('disabled', false);
    }
  }
  sendConfirm() {
    $('#modal_withdraw').modal('show');
    $('#modal-withdraw-confirm').modal('hide');
    const numeral = require('numeral');
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    const param = {
      amount: this.depositValue,
      account_id: this.account,
      currency: 'JPY'
    };
    this.withdrawRequestService.postWithdraw(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.listWithdrawRequest = response.data;

        this.listTran.ngOnChanges();

      }
    });
  }
}
