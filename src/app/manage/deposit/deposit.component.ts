import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { DepositService } from 'src/app/core/services/deposit.service';
import { element } from 'protractor';
import { MIN_DEPOST, ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { WithdrawRequestService } from './../../core/services/withdraw-request.service';
import { Mt5Model, TransactionModel } from 'src/app/core/model/withdraw-request-response.model';
import { AccountType } from 'src/app/core/model/report-response.model';
import { GlobalService } from 'src/app/core/services/global.service';
import { JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
declare var $: any;
import * as moment from 'moment';
import { PaymentMethod, TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  constructor(private depositService: DepositService,
              private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router) { }

  depositAmountForm: FormGroup;
  depositTransactionForm: FormGroup;
  listBankTranfer: Array<DepositModel>;
  minDeposit: string;
  mt5Infor: Mt5Model;
  equity: number;
  usedMargin: number;
  isSubmitted: boolean;
  equityEstimate: number;
  equityDeposit: number;
  marginLevelEstimate: number;
  marginLevelEstimateBank: number;
  errMessageQuickDeposit: boolean;
  errMessageBankTran: boolean;
  depositError: boolean;
  bankError: boolean;
  depositValue: number;
  depositAmount: number;
  listTradingAccount: Array<AccountType>;
  accountID: string;
  listDeposit: Array<TransactionModel>;
  depositTranDetail: TransactionModel;

  ngOnInit() {
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = this.listTradingAccount[0].value;
    }
    this.minDeposit = localStorage.getItem(MIN_DEPOST);
    if (this.accountID) {
      this.getTranHistory(Number(this.accountID.split('-')[1]), 1, 2, 1);
      this.getMt5Infor(Number(this.accountID.split('-')[1]));
    }
    this.initDepositAmountForm();
    this.initDepositTransactionForm();
    // this.getDepositBank();
  }

  initDepositAmountForm() {
    const numeral = require('numeral');
    this.depositAmountForm = new FormGroup({
      deposit: new FormControl(numeral(10000).format('0,0'), requiredInput)
    });
  }

  initDepositTransactionForm() {
    const numeral = require('numeral');
    this.depositTransactionForm = new FormGroup({
      deposit: new FormControl(numeral(10000).format('0,0'), requiredInput)
    });
  }

  getDepositBank() {
    this.spinnerService.show();
    this.depositService.getDepositBank().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listBankTranfer = response.data;
        this.listBankTranfer.forEach(item => {
          item.id = item.id;
          item.name = item.name;
          item.fx_logo_path = item.fx_logo_path;
          item.acc_number = item.acc_number;
          item.acc_holder_name = item.acc_holder_name;
          item.branch_name = item.branch_name;
          item.branch_code = item.branch_code;
          item.fx_acc_type = item.fx_acc_type;
          item.bic = item.bic;
          item.currency = item.currency;
        });
        if (this.listBankTranfer.length > 0) {
          this.showInforBank(`bank_${this.listBankTranfer[0].id}`);
        }
      }
    });
  }

  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).subscribe(response => {
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
        this.spinnerService.hide();
      }
      this.countDeposit();
      this.countDepositAmount();
    });
  }

  getTranHistory(accountNumber: number, pageSize: number, pageNumber: number, type?: number, dateFrom?: string, dateTo?: string) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwHistory(accountNumber, pageNumber, pageSize, type, dateFrom, dateTo).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listDeposit = response.data.results;
        this.listDeposit.forEach(item => {
          item.create_date = moment(item.create_date).format(JAPAN_FORMATDATE_HH_MM);
          item.funding_type = this.checkType(item.funding_type);
          item.method = this.checkPaymentMedthod(item.method);
        });
      }
    });
  }

  openDetail(tranId: number) {
    this.withdrawRequestService.getDetailTranHistory(tranId).subscribe(response => {
      if (response.meta.code === 200) {
        this.depositTranDetail = response.data;
        this.depositTranDetail.create_date = moment(this.depositTranDetail.create_date).format(JAPAN_FORMATDATE_HH_MM);
        this.depositTranDetail.method = this.checkPaymentMedthod(this.depositTranDetail.method);
        this.depositTranDetail.funding_type = this.checkType(this.depositTranDetail.funding_type);
        $('#tran_detail').modal('show');
      }
    });
  }

  goToHistory() {
    this.router.navigate(['/manage/withdrawHistory']);
  }

  checkPaymentMedthod(type: string) {
    if (type === PaymentMethod.QUICKDEPOSIT.key) {
      return PaymentMethod.QUICKDEPOSIT.name;
    }
    if (type === PaymentMethod.BANKTRANSFER.key) {
      return PaymentMethod.BANKTRANSFER.name;
    }
    return '';
  }
  checkType(type: string) {
    if (type === TYPEOFTRANHISTORY.DEPOSIT.key) {
      return TYPEOFTRANHISTORY.DEPOSIT.name;
    }
    if (type === TYPEOFTRANHISTORY.WITHDRAWAL.key) {
      return TYPEOFTRANHISTORY.WITHDRAWAL.name;
    }
    return '';
  }

  showInforBank(index) {
    setTimeout(() => {
      const listTab = [];
      // tslint:disable-next-line: no-shadowed-variable
      this.listBankTranfer.forEach(element => {
        listTab.push(`bank_${element.id}`);
      });
      // tslint:disable-next-line: no-shadowed-variable
      listTab.forEach(element => {
        if (index === element) {
          $(`a#${element}`).addClass('selected');
          $(`div#${element}`).show();
        } else {
          $(`a#${element}`).removeClass('selected');
          $(`div#${element}`).hide();
        }
      });
    }, 50);

  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.depositTransactionForm.invalid) {
      return;
    }
  }
  changeDeposit(event: any) {
    const numeral = require('numeral');
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    if (this.depositValue < 10000) {
      this.depositError = true;
      return;
    }
    this.depositError = false;
    this.countDeposit();
  }
  changeDepositCal(event: any) {
    const numeral = require('numeral');
    this.depositAmount = numeral(this.depositAmountForm.controls.deposit.value).value();
    if (this.depositAmount < 10000) {
      this.bankError = true;
      return;
    }
    this.bankError = false;
    this.countDepositAmount();
  }
  countDeposit() {
    const numeral = require('numeral');
    this.errMessageQuickDeposit = false;
    this.equityEstimate = Math.floor(this.equity + numeral(this.depositTransactionForm.controls.deposit.value).value());
    this.marginLevelEstimate = Math.floor((this.equityEstimate / this.usedMargin) * 100);
    if (this.marginLevelEstimate <= 100) {
      this.errMessageQuickDeposit = true;
    }
  }
  countDepositAmount() {
    const numeral = require('numeral');
    this.errMessageBankTran = false;
    this.equityDeposit = Math.floor(this.equity + numeral(this.depositAmountForm.controls.deposit.value).value());
    this.marginLevelEstimateBank = Math.floor((this.equityDeposit / this.usedMargin) * 100);
    if (this.marginLevelEstimateBank <= 100) {
      this.errMessageBankTran = true;
    }
  }
  onRefesh() {
    this.getMt5Infor(Number(this.accountID.split('-')[1]));
  }
}
