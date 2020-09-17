import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TransactionModel, BankInforModel, TransferResulteModel } from 'src/app/core/model/withdraw-request-response.model';
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
  selector: 'app-transfer-history',
  templateUrl: './transfer-history.component.html',
  styleUrls: ['./transfer-history.component.scss']
})
export class TransferHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('tranModal', { static: true }) tranModal: TransacstionModalComponent;
  @ViewChild('depositTab', { static: true }) depositTab: ElementRef;
  @ViewChild('withdrawTab', { static: true }) withdrawTab: ElementRef;
  @ViewChild('dp', {static: true}) pickerFrom: BsDatepickerDirective;
  @ViewChild('dp2', {static: true}) pickerTo: BsDatepickerDirective;
  listTranTransfer: Array<TransferResulteModel>;
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
    this.typeTranHistory = TYPEOFTRANHISTORY;
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
    if (this.listTradingAccount) {
      this.tradingAccount = this.listTradingAccount[0];
    }
    this.initSearchForm();
    if (!this.querytab && this.searchForm.controls.tradingAccount.value) {
      this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize,
        this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
    }
  }


  ngAfterViewInit(): void {
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

  getTranHistory(accountNumber: number,
                 pageNumber: number, pageSize: number, dateFrom?: string, dateTo?: string, statusSearch?: string) {
    this.spinnerService.show();
    this.withdrawRequestService.getInternalHistory(accountNumber, pageSize, pageNumber, dateFrom,
      dateTo, statusSearch).pipe(take(1)).subscribe(response => {
        this.spinnerService.hide();
        if (response.meta.code === 200) {
          this.listTranTransfer = response.data.results;
          this.totalItem = response.data.count;
          this.totalPage = (response.data.count / pageSize) * 10;
          this.listTranTransfer.forEach(item => {
            item.create_date += TIMEZONESERVER;
            item.create_date = moment(item.create_date).tz(this.timeZone).format(this.formatDateHour);
            // item.method = this.globalService.checkPaymentMedthod(item.method);
          });
          this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
          this.recordTo = this.recordFrom + (this.listTranTransfer.length - 1);
        }
        console.log('listTranTransfer ', this.listTranTransfer);
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
    this.getTranHistory(accounID, this.currentPage, this.pageSize,
      this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value),
      this.statusSearch);
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

  onValueChangeFrom(event) {
    this.showErrorDate = false;
    if ((new Date(event).getTime()) >
      new Date(this.searchForm.controls.toDate.value).getTime()) {
      this.showErrorDate = true;
    }
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
        this.tranModal.open(this.tranHistoryDetail, this.tradingAccount.value);
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
      this.formatDate(this.searchForm.controls.toDate.value), this.statusSearch).pipe(take(1)).subscribe(response => {
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
