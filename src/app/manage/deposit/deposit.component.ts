import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { DepositService } from 'src/app/core/services/deposit.service';
import {
  MIN_DEPOST,
  ACCOUNT_IDS,
  LOCALE,
  TIMEZONEAFX,
  TIMEZONESERVER,
  MARGIN_CALL,
  TYPE_ERROR_TOAST_EN,
  TYPE_ERROR_TOAST_JP,
  TIMEOUT_TOAST,
  ERROR_TIME_CLOSING_EN,
  ERROR_TIME_CLOSING_JP,
  ERROR_MIN_DEPOSIT_EN,
  ERROR_MAX_DEPOSIT_EN,
  ERROR_MIN_DEPOSIT_JP,
  ERROR_MAX_DEPOSIT_JP,
  MIN_WITHDRAW,
  IS_COMPANY} from 'src/app/core/constant/authen-constant';
import { WithdrawRequestService } from './../../core/services/withdraw-request.service';
import { Mt5Model, TransactionModel, WithdrawAmountModel } from 'src/app/core/model/withdraw-request-response.model';
import { AccountType } from 'src/app/core/model/report-response.model';
import { GlobalService } from 'src/app/core/services/global.service';
import { JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ListTransactionComponent } from '../list-transaction/list-transaction.component';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
import { AppSettings } from 'src/app/core/services/api.setting';
import { PORTAL_CODE, SHOP_CODE } from 'src/app/core/constant/bjp-constant';
import { ModalDirective, BsDatepickerDirective } from 'ngx-bootstrap';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MAX_DEPOSIT } from './../../core/constant/authen-constant';
const numeral = require('numeral');
import { ModalDepositWithdrawComponent } from '../modal-deposit-withdraw/modal-deposit-withdraw.component';
import { UserService } from 'src/app/core/services/user.service';
import { UserModel, CorporateModel } from 'src/app/core/model/user.model';
declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
  @ViewChild('listTran', { static: false }) listTran: ListTransactionComponent;
  @ViewChild('BJPSystem', { static: true }) BJPSystem: ElementRef;
  @ViewChild('modalRuleDeposit', { static: false }) modalRuleDeposit: ModalDepositWithdrawComponent;
  @ViewChild('dp', {static: true}) picker: BsDatepickerDirective;
  @Output() emitTabFromDeposit = new EventEmitter<{tab: string, accountID: number}>();
  @Output() emitAccountID: EventEmitter<string> = new EventEmitter<string>();
  depositAmountForm: FormGroup;
  depositTransactionForm: FormGroup;
  listBankTranfer: Array<DepositModel>;
  minDeposit: number;
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
  bankTransferError: boolean;
  depositValue: number;
  depositAmount: number;
  listTradingAccount: Array<AccountType>;
  accountID: string;
  listDeposit: Array<TransactionModel>;
  depositTranDetail: TransactionModel;
  listDwAmount: WithdrawAmountModel;
  transactionType: string;
  formatDateYear: string;
  formatDateHour: string;
  locale: string;
  lastestTime: string;
  controlNo: string;
  tranAmount;
  totalAmount: number;
  depositFee: number;
  remark: string;
  timeZone: string;
  bankCode: string;
  language;
  tradingAccount: AccountType;
  marginCall: number;
  isSending: boolean;
  bjpSystem: string;
  apiPostBack: string;
  portalCode: string;
  shopCode: string;
  showUFJBank: boolean;
  kessaiFlag: string;
  maxDeposit: number;
  minWithDraw: number;
  isCompany: string;
  userInfor: UserModel;
  corporateInfor: CorporateModel;

  constructor(private depositService: DepositService,
              private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService,
              private envConfigService: EnvConfigService,
              private titleService: Title,
              private toastr: ToastrService,
              private userService: UserService) { }

  ngOnInit() {
    this.isCompany = localStorage.getItem(IS_COMPANY);
    this.showUFJBank = this.envConfigService.getUFJ() === '1';
    this.kessaiFlag = 'OB';
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.initBjpSystem();
    this.language = LANGUAGLE;
    this.locale = localStorage.getItem(LOCALE);
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.marginCall = Number(localStorage.getItem(MARGIN_CALL));
    this.isSending = false;
    this.depositFee = 0;
    if (this.locale === LANGUAGLE.english) {
      this.formatDateYear = EN_FORMATDATE;
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateYear = JAPAN_FORMATDATE;
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.transactionType = TYPEOFTRANHISTORY.DEPOSIT.key;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.tradingAccount = this.listTradingAccount[0];
      this.accountID = this.tradingAccount.account_id;
    }
    this.minDeposit = Number(localStorage.getItem(MIN_DEPOST));
    this.minWithDraw = Number(localStorage.getItem(MIN_WITHDRAW));
    this.maxDeposit = Number(localStorage.getItem(MAX_DEPOSIT));
    if (this.accountID) {
      this.getMt5Infor(Number(this.accountID));
      this.getDwAmount(Number(this.accountID));
      this.remark = this.accountID;
    }
    this.initDepositAmountForm();
    this.initDepositTransactionForm();
  }

  getUserInfo() {
    this.spinnerService.show();
    if (this.isCompany === 'false') {
      this.userService.getUserInfor().pipe(take(1)).subscribe(response => {
        this.spinnerService.hide();
        if (response.meta.code === 200) {
          this.userInfor = response.data;
          this.depositAmountForm.controls.cusName.setValue(this.userInfor.name);
        }
      });
    } else {
      this.userService.getCorporateInfor().pipe(take(1)).subscribe(response => {
        this.spinnerService.hide();
        if (response.meta.code === 200) {
          this.corporateInfor = response.data;
          this.depositAmountForm.controls.cusName.setValue(this.corporateInfor.pic.info.value.fx_name1);
        }
      });
    }
  }

  initBjpSystem() {
    this.bjpSystem = this.envConfigService.getBJPSystem();
    this.apiPostBack = this.envConfigService.getConfig() + '/' + AppSettings.API_POST_BACK_BJP;
    this.portalCode = PORTAL_CODE;
    this.shopCode = SHOP_CODE;
  }

  initDepositAmountForm() {
    this.depositAmountForm = new FormGroup({
      deposit: new FormControl(numeral(10000).format('0,0'), requiredInput),
      cusName: new FormControl('', requiredInput),
      bankName: new FormControl('', requiredInput),
      dateTime: new FormControl('', requiredInput),
      tradingAcount: new FormControl('', requiredInput)
    });
    this.depositAmountForm.controls.deposit.valueChanges.subscribe((value) => {
      this.changeDepositCal();
    });
    this.depositAmountForm.controls.dateTime.setValue(moment((new Date()).toDateString()).format(this.formatDateHour));
    if (this.accountID) {
      this.tradingAccount = this.listTradingAccount.find((account: AccountType) => this.accountID === account.account_id);
      this.depositAmountForm.controls.tradingAcount.setValue(this.tradingAccount.value);
    }
    this.getUserInfo();
  }

  initDepositTransactionForm() {
    this.depositTransactionForm = new FormGroup({
      deposit: new FormControl(numeral(10000).format('0,0'), requiredInput),
      bankCode: new FormControl('0033', requiredInput)
    });
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    this.totalAmount = this.depositFee + this.depositValue;
    this.bankCode = this.depositTransactionForm.controls.bankCode.value;
    this.depositTransactionForm.controls.deposit.valueChanges.subscribe((value) => {
      this.changeDeposit();
    });
  }

  getBankCompany() {
    this.spinnerService.show();
    this.depositService.getBankCompany().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.listBankTranfer = response.data;
        setTimeout(() => {
          const bank = this.listBankTranfer.find((item: DepositModel) => item.name === '三菱ＵＦＪ');
          this.showInforBank('三菱ＵＦＪ', bank);
        }, 50);
      }
    });
  }

  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
        this.lastestTime = moment(this.mt5Infor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
        if (this.mt5Infor.free_margin < this.minDeposit) {
          this.mt5Infor.free_margin = 0;
        }
      }
      this.calculateDeposit();
      this.calculateDepositAmount();
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

  showInforBank(bankName: string, bank?: DepositModel) {
    const listTab = ['三菱ＵＦＪ', 'みずほ', '三井住友', 'ゆうちょ', 'ジャパンネット', '楽天'];
    // tslint:disable-next-line:no-shadowed-variable
    listTab.forEach(element => {
      if (bankName === element) {
        $(`a#${element}`).addClass('selected');
        $(`div#${element}`).show();
      } else {
        $(`a#${element}`).removeClass('selected');
        $(`div#${element}`).hide();
      }
    });
    this.depositAmountForm.controls.bankName.setValue(bankName);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.depositTransactionForm.invalid || this.isSending) {
      return;
    }
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    if (this.depositValue < this.minDeposit) {
      this.depositError = true;
      return;
    }
    let messageErr;
    let messageErrMinDeposit;
    let messageErrMaxDeposit;
    let typeErr;
    if (this.locale === LANGUAGLE.english) {
      messageErr = ERROR_TIME_CLOSING_EN;
      typeErr = TYPE_ERROR_TOAST_EN;
      messageErrMinDeposit = ERROR_MIN_DEPOSIT_EN;
      messageErrMaxDeposit = ERROR_MAX_DEPOSIT_EN;
    } else {
      messageErr = ERROR_TIME_CLOSING_JP;
      typeErr = TYPE_ERROR_TOAST_JP;
      messageErrMinDeposit = ERROR_MIN_DEPOSIT_JP;
      messageErrMaxDeposit = ERROR_MAX_DEPOSIT_JP;
    }
    this.isSending = true;
    const param = {
      currency: this.tradingAccount.currency,
      amount: numeral(this.depositTransactionForm.controls.deposit.value).value(),
      account_id: Number(this.accountID),
      bank_code: this.bankCode
    };
    this.spinnerService.show();
    this.depositService.billingSystem(param).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.controlNo = response.data.id.toString();
        this.remark = this.accountID;
        this.listTran.ngOnChanges();
        setTimeout(() => {
          this.BJPSystem.nativeElement.click();
        }, 100);
      } else {
        if (response.meta.code === 500) {
          this.toastr.error(messageErr, typeErr, {
            timeOut: TIMEOUT_TOAST
          });
        }
        if (response.meta.code === 600) {
          this.toastr.error(messageErrMinDeposit + this.minDeposit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'), typeErr, {
            timeOut: TIMEOUT_TOAST
          });
        }
        if (response.meta.code === 601) {
          this.toastr.error(messageErrMaxDeposit + this.maxDeposit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'), typeErr, {
            timeOut: TIMEOUT_TOAST
          });
        }
        this.isSending = false;
        this.spinnerService.hide();
      }
    });
  }

  changeDeposit() {
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    if (this.depositValue < this.minDeposit) {
      this.depositError = true;
      return;
    }
    this.depositError = false;
    this.totalAmount = this.depositFee + this.depositValue;
    this.calculateDeposit();
  }

  changeDepositCal() {
    this.depositAmount = numeral(this.depositAmountForm.controls.deposit.value).value();
    if (this.depositAmount < this.minDeposit) {
      this.bankTransferError = true;
      return;
    }
    this.bankTransferError = false;
    this.calculateDepositAmount();
  }

  calculateDeposit() {
    this.errMessageQuickDeposit = false;
    this.equityEstimate = Math.floor(this.equity + numeral(this.depositTransactionForm.controls.deposit.value).value());
    this.marginLevelEstimate = this.globalService.calculateMarginLevel(this.equityEstimate, this.usedMargin);
    if (this.marginLevelEstimate <= this.marginCall && this.marginLevelEstimate > 0) {
      this.errMessageQuickDeposit = true;
    }
  }

  calculateDepositAmount() {
    this.errMessageBankTran = false;
    this.equityDeposit = Math.floor(this.equity + numeral(this.depositAmountForm.controls.deposit.value).value());
    this.marginLevelEstimateBank = this.globalService.calculateMarginLevel(this.equityDeposit, this.usedMargin);
    if (this.marginLevelEstimateBank <= this.marginCall && this.marginLevelEstimateBank > 0) {
      this.errMessageBankTran = true;
    }
  }

  onRefesh() {
    this.getMt5Infor(Number(this.accountID));
  }

  changeTradingAccount() {
    this.tradingAccount = this.listTradingAccount.find((account: AccountType) => this.accountID === account.account_id);
    this.accountID = this.tradingAccount.account_id;
    this.depositAmountForm.controls.tradingAcount.setValue(this.tradingAccount.value);
    this.getMt5Infor(Number(this.accountID));
    this.getDwAmount(Number(this.accountID));
    this.remark = this.accountID;
  }

  changeBankDeposit() {
    this.bankCode = this.depositTransactionForm.controls.bankCode.value;
  }

  openModal() {
    this.modalRuleDeposit.open();
  }

  getTabFromList(event) {
    this.emitTabFromDeposit.emit({tab: event, accountID: Number(this.accountID)});
  }

  onSubmitBankTransfer() {
    if (this.depositAmountForm.invalid || this.bankTransferError) {
      return;
    }
    console.log(this.depositAmountForm.value);
  }

  onShowPicker(event, type) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
      const { cell, isHovered } = hoverEvent;

      if ((isHovered &&
        !!navigator.platform &&
        /iPad|iPhone|iPod/.test(navigator.platform)) &&
        'ontouchstart' in window
      ) {
        (this.picker as any)._datepickerRef.instance.daySelectHandler(cell);
      }

      return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
  }
}
