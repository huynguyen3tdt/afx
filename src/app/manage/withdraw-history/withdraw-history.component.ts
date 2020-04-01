import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TransactionModel, BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ACCOUNT_IDS, LOCALE, TIMEZONEAFX, TIMEZONESERVER } from 'src/app/core/constant/authen-constant';
import { JAPAN_FORMATDATE, JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import {
  PaymentMethod,
  TYPEOFTRANHISTORY,
  STATUSTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import {SelectItem} from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment-timezone';
declare var $: any;

@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.css']
})
export class WithdrawHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('depositTab', { static: true }) depositTab: ElementRef;
  @ViewChild('withdrawTab', { static: true }) withdrawTab: ElementRef;


  listBankInfor: BankInforModel;
  listDwHistory: Array<TransactionModel>;
  listReport: Array<TransactionModel>;
  searchForm: FormGroup;
  isSubmitted;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  listTradingAccount: Array<AccountType>;
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
              private activatedRoute: ActivatedRoute) {
                this.STATUS = [
                  {label: 'New', value: {id: 4, name: 'New'}},
                  {label: 'In-process', value: {id: 3, name: 'In-process'}},
                  {label: 'Complete', value: {id: 1, name: 'Complete'}},
                  {label: 'Cancel', value: {id: 2, name: 'Cancel'}},
              ];
               }

  ngOnInit() {
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === 'en') {
      this.formatDateYear = EN_FORMATDATE;
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === 'jp') {
      this.formatDateYear = JAPAN_FORMATDATE;
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.activatedRoute.queryParams.subscribe(res => {
      this.querytab = res.tab;
    });
    this.currentPage = 1;
    this.pageSize = 10;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.initSearchForm();
    if (!this.querytab) {
      this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
        this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
    }
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.querytab === this.TABS.DEPOSIT.name) {
        this.depositTab.nativeElement.click();
      }
      if (this.querytab === this.TABS.WITHDRAWAL.name) {
        this.withdrawTab.nativeElement.click();
      }
      if (this.querytab === 'detailwithdrawal') {
        this.searchForm.controls.status.setValue([{id: 4, name: 'New'}, {id: 3, name: 'In-process'}]);
        this.changeStatus();
        this.withdrawTab.nativeElement.click();
      }
    }, 100);
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      tradingAccount: new FormControl(this.listTradingAccount ? this.listTradingAccount[0].account_id : null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
      status: new FormControl([])
    });
    this.setDate(this.DURATION.YEAR);
  }

  getTranHistory(accountNumber: number,
                 pageNumber: number, pageSize: number, type?: string, dateFrom?: string, dateTo?: string, statusSearch?: string) {
    this.spinnerService.show();
    this.checkTab(type);
    this.withdrawRequestService.getDwHistory(accountNumber, pageSize, pageNumber, type, dateFrom,
      dateTo, statusSearch).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listReport = response.data.results;
        this.totalItem = response.data.count;
        this.totalPage = (response.data.count / pageSize) * 10;
        this.listReport.forEach(item => {
          item.create_date += TIMEZONESERVER;
          item.create_date = moment(item.create_date).tz(this.timeZone).format(this.formatDateHour);
        });
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listReport.length - 1);
      }
    });
  }

  searchTranHistory() {
    this.showErrorDate = false;
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
    // if (this.showErrorDate === true) {
    //   return;
    // }
    switch (this.tab) {
      case this.TABS.ALL.name:
        this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value),
          this.statusSearch);
        break;
      case this.TABS.DEPOSIT.name:
        this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.DEPOSIT.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value),
          this.statusSearch);
        break;
      case this.TABS.WITHDRAWAL.name:
        this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.WITHDRAWAL.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value),
          this.statusSearch);
        break;
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
    this.withdrawRequestService.getDetailTranHistory(tranId).subscribe(response => {
      if (response.meta.code === 200) {
        this.tranHistoryDetail = response.data;
        this.tranHistoryDetail.create_date += TIMEZONESERVER;
        this.tranHistoryDetail.create_date = moment(this.tranHistoryDetail.create_date).tz(this.timeZone).format(this.formatDateHour);
        $('#tran_detail').modal('show');
      }
    });
  }

  formatDate(date: string) {
    if (date) {
      if (this.locale === 'jp') {
        return date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0];
      } else if (this.locale === 'en') {
        return date.split('/')[0] + '-' + date.split('/')[1] + '-' + date.split('/')[2];
      }
    }
    return null;
  }

  changeStatus() {
    this.statusSearch = '';
    this.currentPage = 1;
    this.searchForm.controls.status.value.forEach(item => {
      this.statusSearch += item.id + '+';
    });
    this.searchTranHistory();
  }
}
