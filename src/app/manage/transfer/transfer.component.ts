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
import { MIN_WITHDRAW, TIMEZONEAFX, LOCALE, ACCOUNT_IDS, MARGIN_CALL, TIMEZONESERVER } from 'src/app/core/constant/authen-constant';
import moment from 'moment-timezone';
import { EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { AccountType } from 'src/app/core/model/report-response.model';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { ModalDirective } from 'ngx-bootstrap';
import { ListTransactionComponent } from '../list-transaction/list-transaction.component';
import { TYPEOFTRANHISTORY, STATUSTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
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
  @Output() emitTabFromDeposit: EventEmitter<string> = new EventEmitter<string>();
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
  equityEstimate: number;
  marginLevelEstimate: number;
  marginCall: number;
  transferValue: number;
  newDate: string;
  transferStatus;
  transferResult: TransferResulteModel;
  disabledTransfer: boolean;
  transactionType: string;

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService,
              private depositService: DepositService,
              private toastr: ToastrService,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.minWithdraw = Number(localStorage.getItem(MIN_WITHDRAW));
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
      this.sentAccountID = this.tradingSentAccount.account_id;
      this.tradingReceiveAccount = this.listTradingAccount[1];
      this.receiveAccountID = this.tradingReceiveAccount.account_id;
    }
    this.minWithdraw = Number(localStorage.getItem(MIN_WITHDRAW));
    this.initTransferForm();
    if (this.sentAccountID) {
      this.getMt5Infor(Number(this.sentAccountID), 'sent');
    }
    setTimeout(() => {
      if (this.receiveAccountID) {
        this.getMt5Infor(Number(this.receiveAccountID), 'receive');
      }
    }, 500);
  }

  getMt5Infor(accountId, type) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
        if (this.mt5Infor.free_margin < this.minWithdraw) {
          this.mt5Infor.free_margin = 0;
        }
        if (type === 'sent') {
          this.sentAccountInfo = this.mt5Infor;
        } else {
          this.receiveAccountInfo = this.mt5Infor;
        }
        this.lastestTime = moment(this.mt5Infor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
      }
    });
  }

  initTransferForm() {
    this.transferForm = new FormGroup({
      amount: new FormControl(numeral(10000).format('0,0'), requiredInput),
      wholeMoney: new FormControl(false),
    });
    this.transferForm.controls.amount.valueChanges.subscribe((val) => {
      this.changeWithdraw();
    });
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
    this.equityEstimate = Math.floor(this.equity - this.transferValue);
    this.marginLevelEstimate = this.globalService.calculateMarginLevel(this.equityEstimate, this.usedMargin);
    if (this.marginLevelEstimate <= this.marginCall && this.marginLevelEstimate > 0) {
      this.errMessage = true;
    }
  }

  changeTradingAccount(type) {
    if (type === 'sent') {
      this.tradingSentAccount = this.listTradingAccount.find((account: AccountType) =>
      this.sentAccountID === account.account_id);
      this.getMt5Infor(Number(this.sentAccountID), 'sent');
    } else {
      this.tradingReceiveAccount = this.listTradingAccount.find((account: AccountType) =>
       this.receiveAccountID === account.account_id);
      this.getMt5Infor(Number(this.receiveAccountID), 'receive');
    }
    if (this.sentAccountID === this.receiveAccountID || this.sentAccountInfo.currency !== this.receiveAccountInfo.currency) {
      this.disabledTransfer = true;
    } else {
      this.disabledTransfer = false;
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
    if (!this.checkValidateWithDrawal()) {
      return;
    }
    this.modalTransferConfirm.show();
    this.newDate = moment(new Date()).tz(this.timeZone).format(this.formatDateHour);
  }

  cancelWithDraw() {
    this.modalTransferConfirm.hide();
    this.transferForm.controls.amount.setValue(0);
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
    this.getMt5Infor(Number(this.sentAccountID), 'sent');
    this.getMt5Infor(Number(this.receiveAccountID), 'receive');
    this.transferForm.controls.amount.setValue(0);
  }

  getTabFromList(event) {
    this.emitTabFromDeposit.emit(event);
  }
}
