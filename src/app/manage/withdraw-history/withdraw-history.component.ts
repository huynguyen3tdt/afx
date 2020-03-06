import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TransactionModel, BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import * as moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { JAPAN_FORMATDATE, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import {
  PaymentMethod,
  TYPEOFTRANHISTORY,
  STATUSTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
declare var $: any;

@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.css']
})
export class WithdrawHistoryComponent implements OnInit, AfterViewInit {
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
  tranHistoryDetail: TransactionModel;
  listTotalItem: Array<number> = [10, 20, 30];
  TABS = {
    ALL: { name: 'ALL', value: 0 },
    DEPOSIT: { name: 'DEPOSIT', value: 1 },
    WITHDRAWAL: { name: 'WITHDRAWAL', value: 2 },
  };
  DURATION = {
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
  };
  STATUS = ['Complete', 'Pending', 'In process', 'Cancel'];

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.initSearchForm();
    this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
      this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
  }

  ngAfterViewInit(): void {
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      tradingAccount: new FormControl(this.listTradingAccount ? this.listTradingAccount[0].account_id : null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null)
    });
    this.setDate(this.DURATION.YEAR);
  }

  getTranHistory(accountNumber: number, pageSize: number, pageNumber: number, type?: number, dateFrom?: string, dateTo?: string) {
    this.spinnerService.show();
    this.checkTab(type);
    this.withdrawRequestService.getDwHistory(accountNumber, pageNumber, pageSize, type, dateFrom, dateTo).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listReport = response.data.results;
        this.totalItem = response.data.count;
        this.listReport.forEach(item => {
          item.create_date = moment(item.create_date).format(JAPAN_FORMATDATE_HH_MM);
          item.funding_type = this.checkType(item.funding_type);
          item.method = this.checkPaymentMedthod(item.method);
        });
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listReport.length - 1);
      }
    });
  }

  searchTranHistory() {
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
        this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
        break;
      case this.TABS.DEPOSIT.name:
        this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.DEPOSIT.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
        break;
      case this.TABS.WITHDRAWAL.name:
        this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.WITHDRAWAL.value,
          this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
        break;
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

  checkTab(type: number, callSearh?: string) {
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
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchTranHistory();
    }
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

  openDetail(tranId: number) {
    this.withdrawRequestService.getDetailTranHistory(tranId).subscribe(response => {
      if (response.meta.code === 200) {
        this.tranHistoryDetail = response.data;
        this.tranHistoryDetail.create_date = moment(this.tranHistoryDetail.create_date).format(JAPAN_FORMATDATE_HH_MM);
        this.tranHistoryDetail.method = this.checkPaymentMedthod(this.tranHistoryDetail.method);
        this.tranHistoryDetail.funding_type = this.checkType(this.tranHistoryDetail.funding_type);
        $('#tran_detail').modal('show');
      }
    });
  }

  formatDate(date: string) {
    if (date) {
      return date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0];
    }
    return null;
  }

  checkPaymentMedthod(type: string) {
    if (type === PaymentMethod.QUICKDEPOSIT.key) {
      return PaymentMethod.QUICKDEPOSIT.name;
    }
    if (type === PaymentMethod.BANKTRANSFER.key) {
      return PaymentMethod.BANKTRANSFER.name;
    }
    return '';
  }
  checkType(type: string) {
    if (type === TYPEOFTRANHISTORY.DEPOSIT.key) {
      return TYPEOFTRANHISTORY.DEPOSIT.name;
    }
    if (type === TYPEOFTRANHISTORY.WITHDRAWAL.key) {
      return TYPEOFTRANHISTORY.WITHDRAWAL.name;
    }
    return '';
  }

  checkStatus(status: number) {
    if (status === STATUSTRANHISTORY.COMPLETE.key) {
      return STATUSTRANHISTORY.COMPLETE.name;
    }
    if (status === STATUSTRANHISTORY.CANCEL.key) {
      return STATUSTRANHISTORY.CANCEL.name;
    }
    if (status === STATUSTRANHISTORY.PENDING.key) {
      return STATUSTRANHISTORY.PENDING.name;
    }
    return null;
  }
}
