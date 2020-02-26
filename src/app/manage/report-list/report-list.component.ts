import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/core/services/report.service';
import { ReportIDS } from 'src/app/core/model/report-response.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ACCOUNT_TYPE } from 'src/app/core/constant/authen-constant';
import * as moment from 'moment';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  currentPage: number;
  pageSize: number;
  totalItem: number;
  tab: string;
  listReport: Array<ReportIDS>;
  searchForm: FormGroup;
  tradingAccount: number;
  listTradingAccount: Array<number> = [];
  listTotalItem: Array<number> = [10, 20, 30];
  recordFrom: number;
  recordTo: number;

  TABS = {
    ALL: { name: 'ALL', value: -1 },
    DAILY: { name: 'DAILY', value: 0 },
    YEARLY: { name: 'YEARLY', value: 1 },
  };

  DURATION = {
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
  };

  constructor(private reportservice: ReportService, ) { }

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.tradingAccount = Number(localStorage.getItem(ACCOUNT_TYPE));
    this.listTradingAccount.push(Number(localStorage.getItem(ACCOUNT_TYPE)));
    this.initSearchForm();
    this.getReport(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
      this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      tradingAccount: new FormControl(this.listTradingAccount[0]),
      fromDate: new FormControl(null),
      toDate: new FormControl(null)
    });
  }

  getReport(accountNumber: number, pageSize: number, pageNumber: number, type?: number, dateFrom?: string, dateTo?: string) {
    this.checkTab(type);
    this.reportservice.getReport(accountNumber, pageNumber, pageSize, type, dateFrom, dateTo).subscribe(response => {
      if (response.meta.code === 200) {
        this.listReport = response.data.results;
        this.totalItem = response.data.count;
        this.listReport.forEach(item => {
          item.created_date = moment(item.created_date).format('YYYY/MM/DD');
        });
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listReport.length - 1);
      }
    });
  }

  searchReport() {
    if (this.searchForm.controls.fromDate.value !== null && this.searchForm.controls.fromDate.value.toString().indexOf('/') === -1) {
      this.searchForm.controls.fromDate.setValue(moment(new Date(this.searchForm.controls.fromDate.value)).format('DD/MM/YYYY'));
    }
    if (this.searchForm.controls.toDate.value !== null && this.searchForm.controls.toDate.value.toString().indexOf('/') === -1) {
      this.searchForm.controls.toDate.setValue(moment(new Date(this.searchForm.controls.toDate.value)).format('DD/MM/YYYY'));
    }
    switch (this.tab) {
      case this.TABS.ALL.name:
        this.getReport(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
        break;
      case this.TABS.DAILY.name:
        this.getReport(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.DAILY.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
        break;
      case this.TABS.YEARLY.name:
        this.getReport(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.YEARLY.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
        break;
    }
  }

  pageChanged(event) {
    this.currentPage = event.page;
    this.searchReport();
  }

  changeTotalItem(event) {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    this.searchReport();
  }

  checkTab(type: number) {
    switch (type) {
      case this.TABS.ALL.value:
        this.tab = this.TABS.ALL.name;
        break;
      case this.TABS.DAILY.value:
        this.tab = this.TABS.DAILY.name;
        break;
      case this.TABS.YEARLY.value:
        this.tab = this.TABS.YEARLY.name;
        break;
    }
  }

  setDate(duration: string) {
    this.searchForm.controls.toDate.setValue(moment((new Date()).toDateString()).format('DD/MM/YYYY'));
    switch (duration) {
      case this.DURATION.DAY:
        this.searchForm.controls.fromDate.setValue(moment(new Date()).add(-7, 'days').format('DD/MM/YYYY'));
        break;
      case this.DURATION.MONTH:
        this.searchForm.controls.fromDate.setValue(moment(new Date()).add(-30, 'days').format('DD/MM/YYYY'));
        break;
      case this.DURATION.YEAR:
        this.searchForm.controls.fromDate.setValue(moment(new Date()).add(-1, 'years').format('DD/MM/YYYY'));
        break;
    }
  }

  formatDate(date: string) {
    if (date) {
      return date.split('/')[0] + '-' + date.split('/')[1] + '-' + date.split('/')[2];
    }
    return null;
  }
}
