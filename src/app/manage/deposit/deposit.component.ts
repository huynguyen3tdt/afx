import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { DepositService } from 'src/app/core/services/deposit.service';
import { element } from 'protractor';
import { MIN_DEPOST, ACCOUNT_IDS, LOCALE, FXNAME1, TIMEZONEAFX, TIMEZONESERVER } from 'src/app/core/constant/authen-constant';
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
const numeral = require('numeral');
declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  @ViewChild('listTran', { static: false }) listTran: ListTransactionComponent;
  @ViewChild('BJPSystem', { static: true }) BJPSystem: ElementRef;
  constructor(private depositService: DepositService,
              private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private globalService: GlobalService) { }

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
  customerName: string;
  timeZone: string;
  bankCode: string;
  language;
  traddingAccount: AccountType;

  ngOnInit() {
    this.showInforBank('ufj_bank');
    this.language = LANGUAGLE;
    this.locale = localStorage.getItem(LOCALE);
    this.customerName = localStorage.getItem(FXNAME1);
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
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
      this.traddingAccount = this.listTradingAccount[0];
      this.accountID = this.traddingAccount.value;
    }
    this.minDeposit = localStorage.getItem(MIN_DEPOST);
    if (this.accountID) {
      this.getMt5Infor(Number(this.accountID.split('-')[1]));
      this.getDwAmount(Number(this.accountID.split('-')[1]));
      this.remark = this.accountID.split('-')[1];
    }
    this.initDepositAmountForm();
    this.initDepositTransactionForm();
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
    this.depositService.getBankCompany().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listBankTranfer = response.data;
        // if (this.listBankTranfer.length > 0) {
        //   this.showInforBank(`bank_${this.listBankTranfer[0].id}`);
        // }
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
        this.lastestTime = moment(this.mt5Infor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
        if (this.mt5Infor.free_margin < Number(this.minDeposit)) {
          this.mt5Infor.free_margin = 0;
        }
        this.spinnerService.hide();
      }
      this.calculateDeposit();
      this.calculateDepositAmount();
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

  // showInforBank(index) {
  //   setTimeout(() => {
  //     const listTab = [];
  //     // tslint:disable-next-line: no-shadowed-variable
  //     this.listBankTranfer.forEach(element => {
  //       listTab.push(`bank_${element.id}`);
  //     });
  //     // tslint:disable-next-line: no-shadowed-variable
  //     listTab.forEach(element => {
  //       if (index === element) {
  //         $(`a#${element}`).addClass('selected');
  //         $(`div#${element}`).show();
  //       } else {
  //         $(`a#${element}`).removeClass('selected');
  //         $(`div#${element}`).hide();
  //       }
  //     });
  //   }, 50);

  // }
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
    if (this.depositTransactionForm.invalid) {
      return;
    }
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    if (this.depositValue < 1000) {
      this.depositError = true;
      return;
    }
    const param = {
      currency: this.traddingAccount.currency,
      amount: numeral(this.depositTransactionForm.controls.deposit.value).value(),
      account_id: Number(this.accountID.split('-')[1])
    };
    this.spinnerService.show();
    this.depositService.billingSystem(param).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.controlNo = response.data.id.toString();
        this.remark = this.accountID.split('-')[1];
        this.listTran.ngOnChanges();
        setTimeout(() => {
          this.BJPSystem.nativeElement.click();
        }, 100);
      }
    });
  }
  changeDeposit(event: any) {
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    if (this.depositValue < Number(this.minDeposit)) {
      this.depositError = true;
      return;
    }
    this.depositError = false;
    this.totalAmount = this.depositFee + this.depositValue;
    this.calculateDeposit();
  }
  changeDepositCal(event: any) {
    this.depositAmount = numeral(this.depositAmountForm.controls.deposit.value).value();
    if (this.depositAmount < Number(this.minDeposit)) {
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
    if (this.marginLevelEstimate <= 120 && this.marginLevelEstimate > 0) {
      this.errMessageQuickDeposit = true;
    }
  }
  calculateDepositAmount() {
    this.errMessageBankTran = false;
    this.equityDeposit = Math.floor(this.equity + numeral(this.depositAmountForm.controls.deposit.value).value());
    this.marginLevelEstimateBank = this.globalService.calculateMarginLevel(this.equityDeposit, this.usedMargin);
    if (this.marginLevelEstimateBank <= 120 && this.marginLevelEstimateBank > 0) {
      this.errMessageBankTran = true;
    }
  }
  onRefesh() {
    this.getMt5Infor(Number(this.accountID.split('-')[1]));
  }

  changeAccountId() {
    this.traddingAccount = this.listTradingAccount.find((account: AccountType) => this.accountID === account.value);
    this.accountID = this.traddingAccount.value;
    this.getMt5Infor(Number(this.accountID.split('-')[1]));
    this.getDwAmount(Number(this.accountID.split('-')[1]));
    this.remark = this.accountID.split('-')[1];
  }

  changeBankDeposit() {
    this.bankCode = this.depositTransactionForm.controls.bankCode.value;
  }
}
