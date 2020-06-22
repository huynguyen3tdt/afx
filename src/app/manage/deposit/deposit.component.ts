import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { DepositService } from 'src/app/core/services/deposit.service';
import { MIN_DEPOST, ACCOUNT_IDS, LOCALE, TIMEZONEAFX, TIMEZONESERVER, MARGIN_CALL } from 'src/app/core/constant/authen-constant';
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
import { ModalDirective } from 'ngx-bootstrap';
import { Title } from '@angular/platform-browser';
const numeral = require('numeral');
declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
  @ViewChild('listTran', { static: false }) listTran: ListTransactionComponent;
  @ViewChild('BJPSystem', { static: true }) BJPSystem: ElementRef;
  @ViewChild('ruleModal', { static: true }) ruleModal: ModalDirective;
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
  bankError: boolean;
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
  constructor(private depositService: DepositService,
              private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService,
              private envConfigService: EnvConfigService,
              private titleService: Title) { }

  ngOnInit() {
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
    if (this.accountID) {
      this.getMt5Infor(Number(this.accountID));
      this.getDwAmount(Number(this.accountID));
      this.remark = this.accountID;
    }
    this.initDepositAmountForm();
    this.initDepositTransactionForm();
  }

  initBjpSystem() {
    this.bjpSystem = this.envConfigService.getBJPSystem();
    this.apiPostBack = this.envConfigService.getConfig() + '/' + AppSettings.API_POST_BACK_BJP;
    this.portalCode = PORTAL_CODE;
    this.shopCode = SHOP_CODE;
  }

  initDepositAmountForm() {
    this.depositAmountForm = new FormGroup({
      deposit: new FormControl(numeral(10000).format('0,0'), requiredInput)
    });
  }

  initDepositTransactionForm() {
    this.depositTransactionForm = new FormGroup({
      deposit: new FormControl(numeral(10000).format('0,0'), requiredInput),
      bankCode: new FormControl('0008', requiredInput)
    });
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    this.totalAmount = this.depositFee + this.depositValue;

  }

  getBankCompany() {
    this.spinnerService.show();
    this.depositService.getBankCompany().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.listBankTranfer = response.data;
        setTimeout(() => {
          this.showInforBank('ufj_bank');
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

  showInforBank(bank: string) {
    const listTab = ['ufj_bank', 'mizuho_bank', 'sm_bank', 'jpb_bank', 'jn_bank', 'rakuten_bank'];
    // tslint:disable-next-line:no-shadowed-variable
    listTab.forEach(element => {
      if (bank === element) {
        $(`a#${element}`).addClass('selected');
        $(`div#${element}`).show();
      } else {
        $(`a#${element}`).removeClass('selected');
        $(`div#${element}`).hide();
      }
    });
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
    this.isSending = true;
    const param = {
      currency: this.tradingAccount.currency,
      amount: numeral(this.depositTransactionForm.controls.deposit.value).value(),
      account_id: Number(this.accountID)
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
        this.isSending = false;
        this.spinnerService.hide();
      }
    });
  }

  changeDeposit(event: any) {
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    if (this.depositValue < this.minDeposit) {
      this.depositError = true;
      return;
    }
    this.depositError = false;
    this.totalAmount = this.depositFee + this.depositValue;
    this.calculateDeposit();
  }

  changeDepositCal(event: any) {
    this.depositAmount = numeral(this.depositAmountForm.controls.deposit.value).value();
    if (this.depositAmount < this.minDeposit) {
      this.bankError = true;
      return;
    }
    this.bankError = false;
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
    this.tradingAccount = this.listTradingAccount.find((account: AccountType) => this.accountID === account.value);
    this.accountID = this.tradingAccount.value;
    this.getMt5Infor(Number(this.accountID));
    this.getDwAmount(Number(this.accountID));
    this.remark = this.accountID;
  }

  changeBankDeposit() {
    this.bankCode = this.depositTransactionForm.controls.bankCode.value;
  }
}
