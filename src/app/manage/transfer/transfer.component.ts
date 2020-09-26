import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global.service';
import { DepositService } from 'src/app/core/services/deposit.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { Mt5Model, TransferModel, TransferResulteModel } from 'src/app/core/model/withdraw-request-response.model';
import { MIN_WITHDRAW, TIMEZONEAFX, LOCALE, ACCOUNT_IDS, MARGIN_CALL, MAX_WITHDRAW } from 'src/app/core/constant/authen-constant';
import moment from 'moment-timezone';
import { EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { AccountType } from 'src/app/core/model/report-response.model';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput, transferValidation } from 'src/app/core/helper/custom-validate.helper';
import { ModalDirective } from 'ngx-bootstrap';
import { ListTransactionComponent } from '../list-transaction/list-transaction.component';
import { TYPEOFTRANHISTORY, STATUSTRANHISTORY, TRADING_TYPE } from 'src/app/core/constant/payment-method-constant';
declare var $: any;
const numeral = require('numeral');
@Component({
  selector: 'app-tranfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  @ViewChild('modalTransferConfirm', { static: true }) modalTransferConfirm: ModalDirective;
  @ViewChild('modalTransferResult', { static: true }) modalTransferResult: ModalDirective;
  @ViewChild('listTran', { static: false }) listTran: ListTransactionComponent;
  @Output() emitTabFromTranser = new EventEmitter<{tab: string, accountID: number}>();
  transferForm: FormGroup;
  mt5Infor: Mt5Model;
  sentAccountInfo: Mt5Model;
  receiveAccountInfo: Mt5Model;
  equity: number;
  usedMargin: number;
  minWithdraw: number;
  lastestTime: string;
  timeZone: string;
  formatDateHour: string;
  formatDateYear: string;
  locale: string;
  listTradingAccount: Array<AccountType>;
  tradingSentAccount: AccountType;
  tradingReceiveAccount: AccountType;
  sentAccountID: string;
  receiveAccountID: string;
  language;
  transferAmountError: boolean;
  errMessage: boolean;
  marginLevelEstimateSend: number;
  marginLevelEstimateReceive: number;
  marginCall: number;
  transferValue: number;
  newDate: string;
  transferStatus;
  transferResult: TransferResulteModel;
  disabledTransfer: boolean;
  transactionType: string;
  accountType;
  sentType: string;
  receiveType: string;
  minWithDraw: number;
  maxWithDraw: number;

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService,
              private depositService: DepositService,
              private toastr: ToastrService,
              private titleService: Title) { }

  ngOnInit() {
    this.accountType = TRADING_TYPE;
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.minWithdraw = Number(localStorage.getItem(MIN_WITHDRAW));
    this.maxWithDraw = Number(localStorage.getItem(MAX_WITHDRAW));
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    this.language = LANGUAGLE;
    this.transferStatus = STATUSTRANHISTORY;
    this.marginCall = Number(localStorage.getItem(MARGIN_CALL));
    this.transactionType = TYPEOFTRANHISTORY.INTERNALTRANSFER.key;
    if (this.locale === LANGUAGLE.english) {
      this.formatDateYear = EN_FORMATDATE;
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateYear = JAPAN_FORMATDATE;
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount.length > 1) {
      this.tradingSentAccount = this.listTradingAccount[0];
      // this.sentAccountID = this.tradingSentAccount.account_id;
      // this.sentType = this.sentAccountID.substring(this.sentAccountID.length - 2, this.sentAccountID.length);
      this.tradingReceiveAccount = this.listTradingAccount[1];
      // this.receiveAccountID = this.tradingReceiveAccount.account_id;
      // this.receiveType = this.receiveAccountID.substring(this.sentAccountID.length - 2, this.receiveAccountID.length);
    }
    this.minWithdraw = Number(localStorage.getItem(MIN_WITHDRAW));
    this.initTransferForm();
    this.disabledTransfer = true;
    this.sentAccountID = '';
    this.receiveAccountID = '';
    // if (this.sentAccountID) {
    //   this.getMt5Infor(Number(this.sentAccountID), 'sent');
    // }
    // if (this.receiveAccountID) {
    //     this.getMt5Infor(Number(this.receiveAccountID), 'receive');
    //   }
  }

  getMt5Infor(accountId, type) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        // this.equity = this.mt5Infor.equity;
        // this.usedMargin = this.mt5Infor.used_margin;
        if (this.mt5Infor.free_margin < this.minWithdraw) {
          this.mt5Infor.free_margin = 0;
        }
        if (type === 'sent') {
          this.sentAccountInfo = this.mt5Infor;
          this.marginLevelEstimateSend = this.sentAccountInfo.margin_level;
        } else {
          this.receiveAccountInfo = this.mt5Infor;
          this.marginLevelEstimateReceive = this.receiveAccountInfo.margin_level;
        }
        if (this.sentAccountID && this.receiveAccountID) {
          if (this.sentAccountID === this.receiveAccountID || this.sentAccountInfo.currency !== this.receiveAccountInfo.currency) {
            this.disabledTransfer = true;
          } else {
            this.disabledTransfer = false;
          }
        } else {
          this.disabledTransfer = true;
        }
        this.lastestTime = moment(this.mt5Infor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
      }
    });
  }

  initTransferForm() {
    this.transferForm = new FormGroup({
      amount: new FormControl(numeral(0).format('0,0'), transferValidation),
      wholeMoney: new FormControl(false),
    });
    this.transferForm.controls.amount.valueChanges.subscribe((val) => {
      this.changeWithdraw();
    });
    this.transferValue = numeral(this.transferForm.controls.amount.value).value();
  }

  changeWithdraw() {
    this.errMessage = false;
    if (!this.checkValidateWithDrawal()) {
      return;
    }
    this.calculateWithdraw();
   }

  getAllFreeMargin() {
    if (this.transferForm.controls.wholeMoney.value === true) {
      $('#sendAmount').attr('disabled', true);
      this.transferAmountError = false;
      this.transferForm.controls.amount.setValue(numeral(this.sentAccountInfo.free_margin).format('0,0'));
      this.checkValidateWithDrawal();
    } else {
      $('#sendAmount').attr('disabled', false);
    }
    this.calculateWithdraw();
  }

  checkValidateWithDrawal() {
    this.transferValue = numeral(this.transferForm.controls.amount.value).value();
    this.transferAmountError = this.sentAccountInfo.free_margin < this.transferValue;
    if (this.transferAmountError) {
      return false;
    } else {
      return true;
    }
  }

  calculateWithdraw() {
    this.errMessage = false;
    this.marginLevelEstimateSend =
    this.globalService.calculateMarginLevel(Math.floor(this.sentAccountInfo.equity - this.transferValue), this.sentAccountInfo.used_margin);

    this.marginLevelEstimateReceive =
    this.globalService.calculateMarginLevel(Math.floor(this.receiveAccountInfo.equity - this.transferValue),
    this.receiveAccountInfo.used_margin);

    if ((this.marginLevelEstimateSend <= this.marginCall && this.marginLevelEstimateSend > 0) ||
    (this.marginLevelEstimateReceive <= this.marginCall && this.marginLevelEstimateReceive > 0)) {
      this.errMessage = true;
    }
  }

  changeTradingAccount(type) {
    if (type === 'sent') {
      this.tradingSentAccount = this.listTradingAccount.find((account: AccountType) =>
      this.sentAccountID === account.account_id);
      this.sentType = this.sentAccountID.substring(this.sentAccountID.length - 2, this.sentAccountID.length);
      this.getMt5Infor(Number(this.sentAccountID), 'sent');
    } else {
      this.tradingReceiveAccount = this.listTradingAccount.find((account: AccountType) =>
       this.receiveAccountID === account.account_id);
      this.receiveType = this.receiveAccountID.substring(this.receiveAccountID.length - 2, this.receiveAccountID.length);
      this.getMt5Infor(Number(this.receiveAccountID), 'receive');
    }
  }

  onRefesh(type) {
    if (type === 'sent') {
      this.getMt5Infor(Number(this.sentAccountID), 'sent');
    } else {
      this.getMt5Infor(Number(this.receiveAccountID), 'receive');
    }
  }

  showConfirm() {
    if (!this.sentAccountID || !this.receiveAccountID) {
      return;
    }
    if (!this.checkValidateWithDrawal() || this.transferForm.invalid) {
      return;
    }
    this.modalTransferConfirm.show();
    this.newDate = moment(new Date()).tz(this.timeZone).format(this.formatDateHour);
  }

  cancelWithDraw() {
    this.modalTransferConfirm.hide();
    this.transferForm.controls.amount.setValue(numeral(0).format('0,0'));
  }

  sendConfirm() {
    const param: TransferModel = {
      from_account_id: Number(this.tradingSentAccount.account_id),
      to_account_id: Number(this.tradingReceiveAccount.account_id),
      amount: this.transferValue,
      device_type: ''
    };
    this.spinnerService.show();
    this.withdrawRequestService.postTransfer(param).subscribe(response => {
      this.spinnerService.hide();
      this.transferResult = response.data;
      if (response.meta.code !== 500) {
        if (this.transferResult) {
          this.transferResult.create_date =
          moment(this.transferResult.create_date).tz(this.timeZone).format(this.formatDateHour);
          this.modalTransferResult.show();
        }
      }
      this.resetTransferAmount();
    }
    );
  }

  resetTransferAmount() {
    this.modalTransferConfirm.hide();
    if (this.transferForm.controls.wholeMoney.value === true) {
      this.transferForm.controls.wholeMoney.setValue(false);
      this.getAllFreeMargin();
    }
    this.getMt5Infor(Number(this.sentAccountID), 'sent');
    this.getMt5Infor(Number(this.receiveAccountID), 'receive');
    this.transferForm.controls.amount.setValue(numeral(0).format('0,0'));
    this.listTran.ngOnChanges();
  }

  getTabFromList(event) {
    this.emitTabFromTranser.emit({tab: event, accountID: Number(this.sentAccountID)});
  }
}
