import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
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
import {
  MIN_WITHDRAW,
  ACCOUNT_IDS,
  LOCALE,
  TIMEZONEAFX,
  MIN_DEPOST,
  MAX_WITHDRAW,
  TIMEZONESERVER,
  TIMEOUT_TOAST,
  TYPE_ERROR_TOAST_EN,
  MARGIN_CALL,
  ERROR_TIME_CLOSING_EN,
  ERROR_TIME_CLOSING_JP
} from './../../core/constant/authen-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DepositService } from 'src/app/core/services/deposit.service';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { ListTransactionComponent } from '../list-transaction/list-transaction.component';
import * as moment from 'moment-timezone';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { ModalDepositWithdrawComponent } from '../modal-deposit-withdraw/modal-deposit-withdraw.component';
declare var $: any;
const numeral = require('numeral');

@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.scss']
})
export class WithdrawRequestComponent implements OnInit, OnDestroy {
  @ViewChild('listTran', { static: false }) listTran: ListTransactionComponent;
  @ViewChild('modalWithdrawConfirm', { static: true }) modalWithdrawConfirm: ModalDirective;
  @ViewChild('modalWithdrawResult', { static: true }) modalWithdrawResult: ModalDirective;
  @ViewChild('modalRuleWithdraw', { static: false }) modalRuleWithdraw: ModalDepositWithdrawComponent;
  @Output() emitTabFromWithDraw = new EventEmitter<{tab: string, accountID: string}>();
  mt5Infor: Mt5Model;
  accountType;
  bankInfor: BankInforModel;
  listDwAmount: WithdrawAmountModel;
  withdrawForm: FormGroup;
  isSubmitted: boolean;
  listDwHistory;
  transactionDetail: TransactionModel;
  minWithdraw: number;
  depositValue: number;
  minWithdrawError: boolean;
  maxWithdrawError: boolean;
  equityEstimate: number;
  marginLevelEstimate: number;
  errMessage: boolean;
  accountID: string;
  account: string;
  equity: number;
  usedMargin: number;
  listTradingAccount: Array<AccountType>;
  transactionWithdraw: postWithdrawModel;
  newDate: string;
  listBankTranfer: Array<DepositModel>;
  transactionType: string;
  statusSearch: string;
  formatDateYear: string;
  formatDateHour: string;
  locale: string;
  latestTime: string;
  withdrawAmountError: boolean;
  withdrawFee: number;
  totalAmount: number;
  timeZone: string;
  language;
  tradingAccount: AccountType;
  checkWithdrawal: boolean;
  minWithDraw: number;
  maxWithDraw: number;
  // withdrawAmount
  marginCall: number;
  minDeposit: number;
  intervalResetMt5Info;
  freeMargin: number;

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService,
              private depositService: DepositService,
              private toastr: ToastrService,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('???????????????MT5 Mypage');
    this.language = LANGUAGLE;
    this.withdrawFee = 0;
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.minWithDraw = Number(localStorage.getItem(MIN_WITHDRAW));
    this.minDeposit = Number(localStorage.getItem(MIN_DEPOST));
    this.maxWithDraw = Number(localStorage.getItem(MAX_WITHDRAW));
    this.locale = localStorage.getItem(LOCALE);
    this.marginCall = Number(localStorage.getItem(MARGIN_CALL));
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
      this.tradingAccount = this.listTradingAccount[0];
      this.accountID = this.tradingAccount.account_id;
    }
    this.minWithdraw = Number(localStorage.getItem(MIN_WITHDRAW));
    this.initWithdrawForm();
    if (this.accountID) {
      this.getMt5Infor(Number(this.accountID));
      this.getDwAmount(Number(this.accountID));
      this.autoRefreshMt5Info();
    }
    this.getBankInfor();
  }

  initWithdrawForm() {
    this.withdrawForm = new FormGroup({
      amount: new FormControl(numeral(10000).format('0,0'), requiredInput),
      wholeMoney: new FormControl(false),
    });
    this.totalAmount = numeral(this.withdrawForm.controls.amount.value).value() - this.withdrawFee;
    this.withdrawForm.controls.amount.valueChanges.subscribe((val) => {
      this.changeWithdraw();
    });
    this.withdrawForm.controls.wholeMoney.valueChanges.subscribe(value => {
      if (value) {
        this.mt5Infor.free_margin = this.freeMargin;
      } else if (!value && this.mt5Infor.free_margin < this.minWithdraw) {
        this.mt5Infor.free_margin = 0;
      }
    });
  }

  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        this.freeMargin = this.mt5Infor.free_margin;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
        this.latestTime = moment(this.mt5Infor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
      }
      this.calculateWithdraw();
    });
  }

  autoRefreshMt5Info() {
    this.intervalResetMt5Info = setInterval(() => {
      this.onRefresh();
    }, 60000);
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
      }
    });
  }

  changeWithdraw() {
   this.errMessage = false;
   if (!this.checkValidateWithdrawal()) {
     return;
   }
   this.totalAmount = numeral(this.withdrawForm.controls.amount.value).value() - this.withdrawFee;
   this.calculateWithdraw();
  }

  calculateWithdraw() {
    this.errMessage = false;
    this.equityEstimate = Math.floor(this.equity - numeral(this.withdrawForm.controls.amount.value).value());
    this.marginLevelEstimate = this.globalService.calculateMarginLevel(this.equityEstimate, this.usedMargin);
    if (this.marginLevelEstimate <= this.marginCall && this.marginLevelEstimate > 0) {
      this.errMessage = true;
    }
  }

  onRefresh() {
    this.getMt5Infor(Number(this.accountID));
    this.listTran.ngOnChanges();
  }

  showConfirm() {
    if (!this.checkValidateWithdrawal()) {
      return;
    }
    this.modalWithdrawConfirm.show();
    this.newDate = moment(new Date()).tz(this.timeZone).format(this.formatDateHour);
    this.getDepositBank();
  }

  getAllFreeMargin() {
    this.withdrawAmountError = false;
    this.calculateWithdraw();
    if (this.withdrawForm.controls.wholeMoney.value) {
      $('#amount').attr('disabled', true);
      this.withdrawForm.controls.amount.setValue(numeral(this.freeMargin));
    } else {
      this.checkValidateWithdrawal();
      $('#amount').attr('disabled', false);
    }
  }

  changeTradingAccount() {
    this.tradingAccount = this.listTradingAccount.find((account: AccountType) => this.accountID === account.account_id);
    this.accountID = this.tradingAccount.account_id;
    this.getMt5Infor(Number(this.accountID));
    this.getDwAmount(Number(this.accountID));
  }

  sendConfirm() {
    let messageErr;
    let messageErrTimeClosing;
    let typeErr;
    this.checkWithdrawal = true;
    this.modalWithdrawConfirm.hide();
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    const param = {
      amount: this.depositValue,
      account_id: this.accountID,
      currency: this.tradingAccount.currency,
      withdraw_all_flg: this.withdrawForm.controls.wholeMoney.value
    };
    if (this.locale === LANGUAGLE.english) {
      messageErr = 'There are some problems so we cannot send you email. Please contact us for more details.';
      messageErrTimeClosing = ERROR_TIME_CLOSING_EN;
      typeErr = TYPE_ERROR_TOAST_EN;
    } else {
      messageErr = '???????????????????????????????????????????????????????????? ?????????????????????????????????????????????';
      messageErrTimeClosing = ERROR_TIME_CLOSING_JP;
      typeErr = TYPE_ERROR_TOAST_EN;
    }
    this.spinnerService.show();
    this.withdrawRequestService.postWithdraw(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.transactionWithdraw = response.data;
        this.transactionWithdraw.create_date =
        moment(this.transactionWithdraw.create_date + TIMEZONESERVER).tz(this.timeZone).format(this.formatDateHour);
        this.getMt5Infor(Number(this.accountID));
        this.resetAmountwithDraw();
      } else if (response.meta.code === 409) {
        this.transactionWithdraw = response.data;
        this.transactionWithdraw.create_date =
        moment(this.transactionWithdraw.create_date + TIMEZONESERVER).tz(this.timeZone).format(this.formatDateHour);
        this.getMt5Infor(Number(this.accountID));
        this.checkWithdrawal = false;
        this.resetAmountwithDraw();
      } else if (response.meta.code === 403) {
        this.toastr.error(messageErr, typeErr, {
          timeOut: TIMEOUT_TOAST
        });
      } else if (response.meta.code === 500) {
        this.toastr.error(messageErrTimeClosing, typeErr, {
          timeOut: TIMEOUT_TOAST
        });
      }
    });
  }

  resetAmountwithDraw() {
    this.withdrawForm.controls.amount.setValue(numeral(this.minWithDraw).format('0,0'));
    this.changeWithdraw();
    if (this.withdrawForm.controls.wholeMoney.value === true) {
      this.withdrawForm.controls.wholeMoney.setValue(false);
      this.getAllFreeMargin();
    }
    this.modalWithdrawResult.show();
    this.listTran.ngOnChanges();
    this.withdrawForm.controls.amount.setValue(0);
    this.minWithdrawError = false;
    this.totalAmount = 0;
  }
  checkValidateWithdrawal() {
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    this.minWithdrawError = this.depositValue < this.minWithdraw && this.withdrawForm.controls.wholeMoney.value === false;
    this.maxWithdrawError = this.depositValue > this.maxWithDraw;
    this.withdrawAmountError = this.mt5Infor.free_margin < this.depositValue;

    return !(this.minWithdrawError || this.withdrawAmountError || this.maxWithdrawError);
  }

  openModal() {
    this.modalRuleWithdraw.open();
  }

  cancelWithDraw() {
    this.modalWithdrawConfirm.hide();
    this.withdrawForm.controls.amount.setValue(0);
    this.minWithdrawError = false;
    this.totalAmount = 0;
  }

  getTabFromList(event) {
    this.emitTabFromWithDraw.emit({tab: event, accountID: this.accountID});
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalResetMt5Info);
  }
}
