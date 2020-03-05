import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/core/services/report.service';
import { ReportIDS, AccountType } from 'src/app/core/model/report-response.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import * as moment from 'moment';
import { GlobalService } from 'src/app/core/services/global.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare var $: any;

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  @ViewChild('pdfViewer', { static: false }) public pdfViewer;
  currentPage: number;
  pageSize: number;
  totalItem: number;
  tab: string;
  listReport: Array<ReportIDS>;
  searchForm: FormGroup;
  tradingAccount: number;
  listTradingAccount: Array<AccountType>;
  listTotalItem: Array<number> = [10, 20, 30];
  recordFrom: number;
  recordTo: number;
  showErrorDate: boolean;

  TABS = {
    ALL: { name: 'ALL', value: 0 },
    DAILY: { name: 'DAILY', value: 1 },
    YEARLY: { name: 'YEARLY', value: 2 },
  };

  DURATION = {
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
  };

  constructor(private reportservice: ReportService,
              private spinnerService: Ng4LoadingSpinnerService, ) { }

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.initSearchForm();
    this.getReport(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
      this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      tradingAccount: new FormControl(this.listTradingAccount ? this.listTradingAccount[0].account_id : null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null)
    });
    this.setDate(this.DURATION.YEAR);
  }

  getReport(accountNumber: number, pageSize: number, pageNumber: number, type?: number, dateFrom?: string, dateTo?: string) {
    this.spinnerService.show();
    this.checkTab(type);
    this.reportservice.getReport(accountNumber, pageNumber, pageSize, type, dateFrom, dateTo).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listReport = response.data.results;
        this.totalItem = response.data.count;
        this.listReport.forEach(item => {
          item.create_date = moment(item.create_date).format(JAPAN_FORMATDATE);
        });
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listReport.length - 1);
      }
    });
  }

  searchReport() {
    this.showErrorDate = false;
    if (this.searchForm.controls.fromDate.value !== null && this.searchForm.controls.fromDate.value.toString().indexOf('/') === -1) {
      this.searchForm.controls.fromDate.setValue(moment(new Date(this.searchForm.controls.fromDate.value)).format(JAPAN_FORMATDATE));
    }
    if (this.searchForm.controls.toDate.value !== null && this.searchForm.controls.toDate.value.toString().indexOf('/') === -1) {
      this.searchForm.controls.toDate.setValue(moment(new Date(this.searchForm.controls.toDate.value)).format(JAPAN_FORMATDATE));
    }
    if (moment(this.searchForm.controls.fromDate.value) > moment(this.searchForm.controls.toDate.value)) {
      this.showErrorDate = true;
      return;
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

  checkTab(type: number, callSearh?: string) {
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
    if (callSearh) {
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchReport();
    }
  }

  setDate(duration: string) {
    this.searchForm.controls.toDate.setValue(moment((new Date()).toDateString()).format(JAPAN_FORMATDATE));
    switch (duration) {
      case this.DURATION.DAY:
        this.searchForm.controls.fromDate.setValue(moment((new Date()).toDateString()).format(JAPAN_FORMATDATE));
        break;
      case this.DURATION.MONTH:
        this.searchForm.controls.fromDate.setValue(moment(new Date()).add(-((new Date()).getDate() - 1), 'days').format(JAPAN_FORMATDATE));
        break;
      case this.DURATION.YEAR:
        this.searchForm.controls.fromDate.setValue(moment(new Date(new Date().getFullYear(), 0, 1)).format(JAPAN_FORMATDATE));
        break;
    }
    this.searchReport();
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
  }

  formatDate(date: string) {
    if (date) {
      return date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0];
    }
    return null;
  }

  changeReadStatus(id: number) {
    const param = {
      report_id : id
    };
    this.reportservice.changeReadStatus(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.searchReport();
      }
    });
  }

  openPDF(item: ReportIDS) {
    if (item.file_type === 'pdf') {
      this.reportservice.downLoadReportFile(item.id).subscribe(response => {
        const file = new Blob([response], {
          type: 'application/pdf',
        });
        this.pdfViewer.pdfSrc = file; // pdfSrc can be Blob or Uint8Array
        this.pdfViewer.refresh();
        $('#modal-2').modal('show');
      });
      this.changeReadStatus(item.id);
    }
  }
  downLoadFile(item: ReportIDS) {
    this.reportservice.downLoadReportFile(item.id).subscribe(response => {
      let file;
      if (item.file_type === 'pdf') {
        file = new Blob([response], {
          type: 'application/pdf',
        });
      } else {
        file = new Blob([response], {
          type: 'text/csv',
        });
      }
      const fileURL = URL.createObjectURL(file);
      const a = document.createElement('a');
      let fileName;
      if (item.file_type === 'pdf') {
        fileName = item.file_name;
      } else {
        fileName = `${item.file_name}.csv`;
      }
      a.href = fileURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      this.changeReadStatus(item.id);
    });
  }
}
