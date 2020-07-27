import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/core/services/report.service';
import { ReportIDS, AccountType } from 'src/app/core/model/report-response.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ACCOUNT_IDS, LOCALE, TIMEZONEAFX, TIMEZONESERVER } from 'src/app/core/constant/authen-constant';
import { JAPAN_FORMATDATE, EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import moment from 'moment-timezone';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { BsLocaleService, defineLocale, jaLocale, ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
declare var $: any;
defineLocale('ja', jaLocale);

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  @ViewChild('pdfViewer', { static: true }) public pdfViewer;
  @ViewChild('pdfModal', { static: true }) pdfModal: ModalDirective;
  currentPage: number;
  pageSize: number;
  totalItem: number;
  tab: string;
  listReport: Array<ReportIDS>;
  searchForm: FormGroup;
  listTradingAccount: Array<AccountType>;
  tradingAccount: AccountType;
  listTotalItem: Array<number> = [10, 20, 30];
  recordFrom: number;
  recordTo: number;
  showErrorDate: boolean;
  totalPage: number;
  locale: string;
  formatDateYear: string;
  formatDateHour: string;
  timeZone: string;
  isOpenPdf: boolean;
  TABS = {
    ALL: { name: 'ALL', value: '' },
    DAILY: { name: 'DAILY', value: 'd' },
    YEARLY: { name: 'YEARLY', value: 'y' },
  };

  DURATION = {
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
  };
  language;

  constructor(private reportservice: ReportService,
              private spinnerService: Ng4LoadingSpinnerService,
              private localeService: BsLocaleService,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.isOpenPdf = false;
    this.language = LANGUAGLE;
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateYear = EN_FORMATDATE;
      this.formatDateHour = EN_FORMATDATE_HH_MM;
      $('body').removeClass('jp');
      this.localeService.use('en');
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateYear = JAPAN_FORMATDATE;
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
      this.localeService.use('ja');
      $('body').addClass('jp');
    }
    this.currentPage = 1;
    this.pageSize = 10;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.tradingAccount = this.listTradingAccount[0];
    }
    this.initSearchForm();
    this.getReport(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
      this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      tradingAccount: new FormControl(this.listTradingAccount ? this.tradingAccount.account_id : null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null)
    });
    this.setDate(this.DURATION.YEAR);
  }

  getReport(accountNumber: number, pageNumber: number, pageSize: number, type?: string, dateFrom?: string, dateTo?: string) {
    this.spinnerService.show();
    this.checkTab(type);
    this.reportservice.getReport(accountNumber, pageSize, pageNumber, type, dateFrom, dateTo).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listReport = response.data.results;
        this.totalItem = response.data.count;
        this.totalPage = (this.totalItem / pageSize) * 10;
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listReport.length - 1);
        this.listReport.forEach(item => {
          item.create_date += TIMEZONESERVER;
          item.create_date = moment(item.create_date).tz(this.timeZone).format(this.formatDateYear);
          if (item.file_name.includes(']_')) {
            item.file_name = item.file_name.split('.')[0].split('_')[2] + '_' + item.file_name.split('.')[0].split('_')[3];
          } else {
            item.file_name = item.file_name.split('.')[0].split('_')[1] + '_' + item.file_name.split('.')[0].split('_')[2];
          }
          item.report_date = moment((new Date(item.report_date)).toDateString()).format(this.formatDateYear);
        });
      }
    });
  }

  searchReport() {
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

  checkTab(type: string, callSearh?: string) {
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
      if (this.locale === LANGUAGLE.japan) {
        return date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0];
      } else if (this.locale === LANGUAGLE.english) {
        return date.split('/')[0] + '-' + date.split('/')[1] + '-' + date.split('/')[2];
      }
    }
    return null;
  }

  changeReadStatus(id: number) {
    const param = {
      report_id : id
    };
    this.spinnerService.show();
    this.reportservice.changeReadStatus(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.searchReport();
      }
    });
  }

  openPDF(item: ReportIDS) {
    if (this.isOpenPdf === true) {
      return;
    }
    this.isOpenPdf = true;
    if (item.file_type === 'pdf') {
      this.spinnerService.show();
      this.reportservice.downLoadReportFile(item.id).pipe(take(1)).subscribe(response => {
        const file = new Blob([response], {
          type: 'application/pdf',
        });
        this.pdfViewer.pdfSrc = file; // pdfSrc can be Blob or Uint8Array
        this.pdfViewer.refresh();
        // $('#modal-2').modal('show');
        this.pdfModal.show();
        this.spinnerService.hide();
        this.isOpenPdf = false;
      },
      () => {
        this.spinnerService.hide();
        this.isOpenPdf = false;
      });
      if (!item.read_flg) {
        this.changeReadStatus(item.id);
      }
    }
  }
  downLoadFile(item: ReportIDS) {
    this.spinnerService.show();
    this.reportservice.downLoadReportFile(item.id).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
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

  changeTradingAccount() {
    this.tradingAccount = this.listTradingAccount.find((account: AccountType) =>
    this.searchForm.controls.tradingAccount.value === account.account_id);
    this.searchReport();
  }
}
