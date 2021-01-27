import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TransactionModel, BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ACCOUNT_IDS, LOCALE, TIMEZONEAFX, TIMEZONESERVER } from 'src/app/core/constant/authen-constant';
import { JAPAN_FORMATDATE, JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import {
  PAYMENTMETHOD,
  TYPEOFTRANHISTORY,
  STATUSTRANHISTORY
} from 'src/app/core/constant/payment-method-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment-timezone';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { TransacstionModalComponent } from '../transacstion-modal/transacstion-modal.component';
import { defineLocale, jaLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService, BsDatepickerDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
declare var $: any;
defineLocale('ja', jaLocale);

@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.scss']
})
export class WithdrawHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('tranModal', { static: true }) tranModal: TransacstionModalComponent;
  @ViewChild('depositTab', { static: true }) depositTab: ElementRef;
  @ViewChild('withdrawTab', { static: true }) withdrawTab: ElementRef;
  @ViewChild('dp', {static: true}) pickerFrom: BsDatepickerDirective;
  @ViewChild('dp2', {static: true}) pickerTo: BsDatepickerDirective;
  @Input() filterDepositHistory: boolean;
  @Input() filterWithDrawHistory: boolean;
  @Input() detaiWithdrawFlag: boolean;
  @Input() accountID: string;
  listBankInfor: BankInforModel;
  listDwHistory: Array<TransactionModel>;
  listReport: Array<TransactionModel>;
  searchForm: FormGroup;
  isSubmitted;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  listTradingAccount: Array<AccountType>;
  tradingAccount: AccountType;
  showErrorDate: boolean;
  recordFrom: number;
  recordTo: number;
  currentPage: number;
  pageSize: number;
  totalItem: number;
  tab: string;
  statusWithdrawal: string;
  tranHistoryDetail: TransactionModel;
  listTotalItem: Array<number> = [10, 20, 30];
  totalPage: number;
  STATUS: SelectItem[];
  withdrawId: string;
  depositId: string;
  querytab: string;
  queryStatus: string;
  statusSearch: string;
  formatDateYear: string;
  formatDateHour: string;
  locale: string;
  timeZone: string;
  transactionStatus;
  typeTranHistory;
  paymentMethod;
  defaultLabel: string;
  language;
  TABS = {
    ALL: { name: 'ALL', value: '0' },
    DEPOSIT: { name: 'DEPOSIT', value: 'd' },
    WITHDRAWAL: { name: 'WITHDRAWAL', value: 'w' },
  };
  DURATION = {
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
  };
  // STATUS = ['Complete', 'Pending', 'In process', 'Cancel'];
  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              private localeService: BsLocaleService,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.language = LANGUAGLE;
    this.transactionStatus = STATUSTRANHISTORY;
    this.paymentMethod = PAYMENTMETHOD;
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateYear = EN_FORMATDATE;
      this.formatDateHour = EN_FORMATDATE_HH_MM;
      this.defaultLabel = 'All';
      $('body').removeClass('jp');
      this.localeService.use('en');
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateYear = JAPAN_FORMATDATE;
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
      this.defaultLabel = 'すべて';
      this.localeService.use('ja');
      $('body').addClass('jp');
    }
    this.initStatus();
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(res => {
      this.querytab = res.tab;
    });
    this.currentPage = 1;
    this.pageSize = 10;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    const allTradingAcount: AccountType = {
      account_id: 'all',
      account_type: 0,
      currency: '0',
      value: this.locale === LANGUAGLE.english ? 'All' : 'すべて'
    };
    this.listTradingAccount.unshift(allTradingAcount);
    if (this.listTradingAccount) {
      this.tradingAccount = this.listTradingAccount[0];
      if (this.querytab) {
        this.tradingAccount.account_id = this.accountID;
      }
    }
    this.initSearchForm();
    // if (!this.querytab && this.searchForm.controls.tradingAccount.value) {
    //   this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
    //     this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
    // }
    this.initSearch();
  }


  ngAfterViewInit(): void {
  }

  initSearch() {
    if (this.accountID) {
      this.searchForm.controls.tradingAccount.setValue(this.accountID);
    }
    if (this.filterDepositHistory) {
      this.searchForm.controls.type.setValue(this.TABS.DEPOSIT.value);
      this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.DEPOSIT.value,
        this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
    } else if (this.filterWithDrawHistory) {
      this.searchForm.controls.type.setValue(this.TABS.WITHDRAWAL.value);
      this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.WITHDRAWAL.value,
        this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
    } else if (this.detaiWithdrawFlag) {
      if (this.locale === LANGUAGLE.english) {
        this.searchForm.controls.status.setValue([{ id: 3, name: 'In-progress' }]);
      } else {
        this.searchForm.controls.status.setValue([{ id: 3, name: '処理中' }]);
      }
      this.searchForm.controls.type.setValue(this.TABS.WITHDRAWAL.value);
      this.changeStatus();
    } else if (!this.querytab && this.searchForm.controls.tradingAccount.value) {
      this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
        this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
    }
  }

  initStatus() {
    if (this.locale === LANGUAGLE.english) {
      this.STATUS = [
        { label: 'In-progress', value: { id: 3, name: 'In-progress' } },
        { label: 'Completed', value: { id: 1, name: 'Completed' } },
        { label: 'Cancel', value: { id: 2, name: 'Cancel' } },
      ];
    } else {
      this.STATUS = [
        { label: '処理中', value: { id: 3, name: '処理中' } },
        { label: '完了', value: { id: 1, name: '完了' } },
        { label: 'キャンセル', value: { id: 2, name: 'キャンセル' } },
      ];
    }
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      tradingAccount: new FormControl(this.listTradingAccount ? this.listTradingAccount[0].account_id : null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      status: new FormControl([]),
      type: new FormControl(this.TABS.ALL.value)
    });
    this.setDate(this.DURATION.YEAR);
  }

  getTranHistory(accountNumber: string,
                 pageNumber: number, pageSize: number, type?: string, dateFrom?: string, dateTo?: string, statusSearch?: string) {
    this.spinnerService.show();
    this.checkTab(type);
    this.withdrawRequestService.getDwHistory(accountNumber, pageSize, pageNumber, type, dateFrom,
      dateTo, statusSearch).pipe(take(1)).subscribe(response => {
        this.spinnerService.hide();
        if (response.meta.code === 200) {
          this.listReport = response.data.results;
          this.totalItem = response.data.count;
          this.totalPage = (response.data.count / pageSize) * 10;
          this.listReport.forEach(item => {
            item.create_date += TIMEZONESERVER;
            item.create_date = moment(item.create_date).tz(this.timeZone).format(this.formatDateHour);
            item.funding_type = this.globalService.checkType(item.funding_type);
            item.method = this.globalService.checkPaymentMedthod(item.method);
            item.img_account_type = this.globalService.convertTypeToImg(item.trading_account_id.toString());
          });
          this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
          this.recordTo = this.recordFrom + (this.listReport.length - 1);
        }
      });
  }

  searchTranHistory() {
    this.showErrorDate = false;
    let accounID;
    if (this.searchForm.controls.fromDate.value !== null && this.searchForm.controls.fromDate.value.toString().indexOf('/') === -1) {
      this.searchForm.controls.fromDate.setValue(moment(new Date(this.searchForm.controls.fromDate.value)).format(this.formatDateYear));
    }
    if (this.searchForm.controls.toDate.value !== null && this.searchForm.controls.toDate.value.toString().indexOf('/') === -1) {
      this.searchForm.controls.toDate.setValue(moment(new Date(this.searchForm.controls.toDate.value)).format(this.formatDateYear));
    }
    if (moment(this.searchForm.controls.fromDate.value) > moment(this.searchForm.controls.toDate.value)) {
      this.showErrorDate = true;
      return;
    }
    if (this.searchForm.controls.tradingAccount.value) {
      accounID = this.searchForm.controls.tradingAccount.value;
    }
    switch (this.tab) {
      case this.TABS.ALL.name:
        this.getTranHistory(accounID, this.currentPage, this.pageSize, this.TABS.ALL.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value),
          this.statusSearch);
        break;
      case this.TABS.DEPOSIT.name:
        this.getTranHistory(accounID, this.currentPage, this.pageSize, this.TABS.DEPOSIT.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value),
          this.statusSearch);
        break;
      case this.TABS.WITHDRAWAL.name:
        this.getTranHistory(accounID, this.currentPage, this.pageSize, this.TABS.WITHDRAWAL.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value),
          this.statusSearch);
        break;
    }
    if (this.querytab) {
      this.getTranHistory(accounID, this.currentPage, this.pageSize, this.TABS.WITHDRAWAL.value,
         this.formatDate(this.searchForm.controls.fromDate.value),
         this.formatDate(this.searchForm.controls.toDate.value), this.STATUS[0].value.id); // id status = 3 (In Progress)
    }
  }

  setDate(duration: string) {
    this.searchForm.controls.toDate.setValue(moment((new Date()).toDateString()).format(this.formatDateYear));
    switch (duration) {
      case this.DURATION.DAY:
        this.searchForm.controls.fromDate.setValue(moment((new Date()).toDateString()).format(this.formatDateYear));
        break;
      case this.DURATION.MONTH:
        // tslint:disable-next-line: max-line-length
        this.searchForm.controls.fromDate.setValue(moment(new Date()).add(-((new Date()).getDate() - 1), 'days').format(this.formatDateYear));
        break;
      case this.DURATION.YEAR:
        this.searchForm.controls.fromDate.setValue(moment(new Date(new Date().getFullYear(), 0, 1)).format(this.formatDateYear));
        break;
    }
    this.searchTranHistory();
  }

  pageChanged(event) {
    this.currentPage = event.page;
    this.searchTranHistory();
  }

  changeTotalItem(event) {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    this.searchTranHistory();
  }

  checkTab(type: string, callSearh?: string) {
    switch (type) {
      case this.TABS.ALL.value:
        this.tab = this.TABS.ALL.name;
        break;
      case this.TABS.DEPOSIT.value:
        this.tab = this.TABS.DEPOSIT.name;
        break;
      case this.TABS.WITHDRAWAL.value:
        this.tab = this.TABS.WITHDRAWAL.name;
        break;
    }
    if (callSearh) {
      if (this.querytab === 'detailwithdrawal') {
        this.searchTranHistory();
        this.querytab = '';
      } else {
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchForm.controls.status.setValue([]);
        this.statusSearch = '';
        this.searchTranHistory();
      }
    }
  }

  changeType(type) {
    switch (type) {
      case this.TABS.ALL.value:
        this.checkTab(this.TABS.ALL.value, 'call');
        break;
      case this.TABS.DEPOSIT.value:
        this.checkTab(this.TABS.DEPOSIT.value, 'call');
        break;
      case this.TABS.WITHDRAWAL.value:
        this.checkTab(this.TABS.WITHDRAWAL.value, 'call');
        break;
    }
  }

  onValueChangeFrom(event) {
    this.showErrorDate = false;
    if ((new Date(event).getTime()) >
      new Date(this.searchForm.controls.toDate.value).getTime()) {
      this.showErrorDate = true;
    }
    // if (moment(this.searchForm.controls.fromDate.value) > moment(this.searchForm.controls.toDate.value)) {
    //   this.showErrorDate = true;
    // }
  }

  onValueChangeTo(event) {
    this.showErrorDate = false;
    if ((new Date(this.searchForm.controls.fromDate.value).getTime()) >
      new Date(event).getTime()) {
      this.showErrorDate = true;
    }
    // if (moment(this.searchForm.controls.fromDate.value) > moment(this.searchForm.controls.toDate.value)) {
    //   this.showErrorDate = true;
    // }
  }

  openDetail(tranId: number) {
    this.spinnerService.show();
    this.withdrawRequestService.getDetailTranHistory(tranId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.tranHistoryDetail = response.data;
        this.tranHistoryDetail.create_date += TIMEZONESERVER;
        this.tranHistoryDetail.create_date = moment(this.tranHistoryDetail.create_date).tz(this.timeZone).format(this.formatDateHour);
        this.tranHistoryDetail.method = this.globalService.checkPaymentMedthod(this.tranHistoryDetail.method);
        this.tranHistoryDetail.funding_type = this.globalService.checkType(this.tranHistoryDetail.funding_type);
        this.tranModal.open(this.tranHistoryDetail, this.tradingAccount.value, 'dw');
        // $('#tran_detail').modal('show');
      }
    });
  }

  formatDate(date: string) {
    if (date) {
      if (this.locale === LANGUAGLE.japan) {
        return date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0];
      } else if (this.locale === LANGUAGLE.english) {
        return date.split('/')[0] + '-' + date.split('/')[1] + '-' + date.split('/')[2];
      }
    }
    return null;
  }

  changeStatus() {
    this.statusSearch = '';
    this.currentPage = 1;
    this.searchForm.controls.status.value.forEach(item => {
      this.statusSearch += item.id + ',';
    });
    this.searchTranHistory();
  }

  exportToCSV() {
    const accounID = this.searchForm.controls.tradingAccount.value;
    let tabValue;
    switch (this.tab) {
      case this.TABS.ALL.name:
        tabValue = this.TABS.ALL.value;
        break;
      case this.TABS.DEPOSIT.name:
        tabValue = this.TABS.DEPOSIT.value;
        break;
      case this.TABS.WITHDRAWAL.name:
        tabValue = this.TABS.WITHDRAWAL.value;
        break;
    }
    this.spinnerService.show();
    this.withdrawRequestService.exportHistoryToCsv(accounID, tabValue,
      this.formatDate(this.searchForm.controls.fromDate.value),
      this.formatDate(this.searchForm.controls.toDate.value), this.statusSearch, false).pipe(take(1)).subscribe(response => {
        this.spinnerService.hide();
        const file = new Blob([response], {
          type: 'text/csv',
        });
        let fileName;
        if (this.locale === LANGUAGLE.english) {
          fileName = `History(${this.searchForm.controls.fromDate.value}-${this.searchForm.controls.toDate.value}).csv`;
        } else {
          fileName = `入出金履歴(${this.searchForm.controls.fromDate.value}-${this.searchForm.controls.toDate.value}).csv`;
        }
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file, fileName);
          return;
        } else {
          const fileURL = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
        }
      });
  }

  changeTradingAccount() {
    this.tradingAccount = this.listTradingAccount.find((account: AccountType) =>
    this.searchForm.controls.tradingAccount.value === account.account_id);
    this.searchTranHistory();
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
        if (type === 'From') {
          (this.pickerFrom as any)._datepickerRef.instance.daySelectHandler(cell);
        } else {
          (this.pickerTo as any)._datepickerRef.instance.daySelectHandler(cell);
        }
      }

      return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
  }

}
