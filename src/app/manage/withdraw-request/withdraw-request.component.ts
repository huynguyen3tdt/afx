import { Component, OnInit, ViewChild } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
// import { ACCOUNT_TYPE, TIMEZONEAFX } from 'src/app/core/constant/authen-constant';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import {
  BankInforModel,
  Mt5Model,
  TransactionModel,
  WithdrawAmountModel,
  postWithdrawModel
} from 'src/app/core/model/withdraw-request-response.model';
import { MIN_WITHDRAW, ACCOUNT_IDS, LOCALE, TIMEZONEAFX, MIN_DEPOST } from './../../core/constant/authen-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DepositService } from 'src/app/core/services/deposit.service';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { ListTransactionComponent } from '../list-transaction/list-transaction.component';
import moment from 'moment-timezone';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
declare var $: any;
const numeral = require('numeral');

@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.scss']
})
export class WithdrawRequestComponent implements OnInit {
  @ViewChild('listTran', { static: false }) listTran: ListTransactionComponent;
  @ViewChild('modalWithdrawConfirm', { static: true }) modalWithdrawConfirm: ModalDirective;
  @ViewChild('modalWithdrawResult', { static: true }) modalWithdrawResult: ModalDirective;
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
  withdrawAmountError: boolean;
  withdrawFee: number;
  totalAmount: number;
  timeZone: string;
  language;
  traddingAccount: AccountType;
  checkWithDrawal: boolean;
  minDeposit: string;
  // withdrawAmount
  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService,
              private depositService: DepositService) { }

  ngOnInit() {
    this.language = LANGUAGLE;
    this.withdrawFee = 0;
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.minDeposit = localStorage.getItem(MIN_DEPOST);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateYear = EN_FORMATDATE;
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateYear = JAPAN_FORMATDATE;
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.transactionType = TYPEOFTRANHISTORY.WITHDRAWAL.key;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.traddingAccount = this.listTradingAccount[0];
      this.accountID = this.traddingAccount.value;
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
    this.withdrawForm = new FormGroup({
      amount: new FormControl(numeral(10000).format('0,0'), requiredInput),
      wholeMoney: new FormControl(false),
    });
    this.totalAmount = numeral(this.withdrawForm.controls.amount.value).value() - this.withdrawFee;
  }


  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
        if (this.mt5Infor.free_margin < Number(this.minWithdraw)) {
          this.mt5Infor.free_margin = 0;
        }
        this.lastestTime = moment(this.mt5Infor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
      }
      this.calculateWithdraw();
    });
  }
  getBankInfor() {
    this.spinnerService.show();
    this.withdrawRequestService.getBankInfor().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.bankInfor = response.data;
      }
    });
  }
  getDwAmount(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwAmount(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.listDwAmount = response.data;
      }
    });
  }
  getDepositBank() {
    this.spinnerService.show();
    this.depositService.getDepositBank().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.listBankTranfer = response.data;
        this.listBankTranfer.forEach(item => {
          item.branch_code = item.branch_code;
        });
      }
    });
  }

  changeWithdraw(event: any) {
   this.errMessage = false;
   if (this.checkValidateWithDrawal() === false) {
     return;
   }
   this.totalAmount = numeral(this.withdrawForm.controls.amount.value).value() - this.withdrawFee;
   this.calculateWithdraw();
  }

  calculateWithdraw() {
    this.errMessage = false;
    this.equityEstimate = Math.floor(this.equity - numeral(this.withdrawForm.controls.amount.value).value());
    this.marginLevelEstimate = this.globalService.calculateMarginLevel(this.equityEstimate, this.usedMargin);
    if (this.marginLevelEstimate <= 120 && this.marginLevelEstimate > 0) {
      this.errMessage = true;
    }
  }
  onRefesh() {
    this.getMt5Infor(Number(this.accountID.split('-')[1]));
  }

  showConfirm() {
    if (this.checkValidateWithDrawal() === false) {
      return;
    }
    this.modalWithdrawConfirm.show();
    this.newDate = moment(new Date()).format(this.formatDateHour);
    this.getDepositBank();
  }

  changeAmount() {
    if (this.withdrawForm.controls.wholeMoney.value === true) {
      $('#amount').attr('disabled', true);
      this.withdrawAmountError = false;
      this.withdrawForm.controls.amount.setValue(numeral(this.mt5Infor.free_margin).format('0,0'));
      this.checkValidateWithDrawal();
    } else {
      $('#amount').attr('disabled', false);
    }
    this.calculateWithdraw();
  }

  changeAccount() {
    this.traddingAccount = this.listTradingAccount.find((account: AccountType) => this.accountID === account.value);
    this.accountID = this.traddingAccount.value;
    this.getMt5Infor(Number(this.accountID.split('-')[1]));
    this.getDwAmount(Number(this.accountID.split('-')[1]));
  }

  sendConfirm() {
    this.checkWithDrawal = true;
    this.modalWithdrawConfirm.hide();
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    const param = {
      amount: this.depositValue,
      account_id: this.accountID.split('-')[1],
      currency: this.traddingAccount.currency
    };
    this.spinnerService.show();
    this.withdrawRequestService.postWithdraw(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.listWithdrawRequest = response.data;
        this.getMt5Infor(Number(this.accountID.split('-')[1]));
        this.listTran.ngOnChanges();
      } else if (response.meta.code === 409) {
        this.checkWithDrawal = false;
      }
      this.modalWithdrawResult.show();
    });
  }

  checkValidateWithDrawal() {
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    if (this.depositValue < Number(this.minWithdraw)) {
      this.withdrawError = true;
    } else {
      this.withdrawError = false;
    }
    if (this.mt5Infor.free_margin < this.depositValue) {
      this.withdrawAmountError = true;
    } else {
      this.withdrawAmountError = false;
    }
    if (this.withdrawError === true || this.withdrawAmountError === true) {
      return false;
    } else {
      return true;
    }
  }
}
