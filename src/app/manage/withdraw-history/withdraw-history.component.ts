import { Component, OnInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TransactionModel, BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import * as moment from 'moment';
import { ACCOUNT_ID } from 'src/app/core/constant/authen-constant';
import { JAPAN_FORMATDATE, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import {
  PaymentMethod,
  PaymentMethodValue,
  TYPEOFTRANHISTORY,
  TYPEOFTRANHISTORYVALUE,
  STATUSTRANHISTORY,
  STATUSTRANHISTORYVALUE } from 'src/app/core/constant/method-enum';
declare var $: any;

@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.css']
})
export class WithdrawHistoryComponent implements OnInit {
  listBankInfor: BankInforModel;
  listDwHistory: Array<TransactionModel>;
  listReport: Array<TransactionModel>;
  searchForm: FormGroup;
  isSubmitted;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  listTradingAccount: Array<number> = [];
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

  constructor(private withdrawRequestService: WithdrawRequestService, ) { }

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.listTradingAccount.push(Number(localStorage.getItem(ACCOUNT_ID)));
    this.initSearchForm();
    this.getTranHistory(this.searchForm.controls.tradingAccount.value, this.currentPage, this.pageSize, this.TABS.ALL.value,
      this.formatDate(this.searchForm.controls.fromDate.value), this.formatDate(this.searchForm.controls.toDate.value));
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      tradingAccount: new FormControl(this.listTradingAccount[0]),
      fromDate: new FormControl(null),
      toDate: new FormControl(null)
    });
    this.setDate(this.DURATION.YEAR);
  }

  getTranHistory(accountNumber: number, pageSize: number, pageNumber: number, type?: number, dateFrom?: string, dateTo?: string) {
    this.checkTab(type);
    this.withdrawRequestService.getDwHistory(accountNumber, pageNumber, pageSize, type, dateFrom, dateTo).subscribe(response => {
      if (response.meta.code === 200) {
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
    console.log('11111 ', tranId);
    this.withdrawRequestService.getDetailTranHistory(tranId).subscribe(response => {
      console.log('responseee ', response);
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
    if (type === PaymentMethod.QUICKDEPOSIT) {
      return PaymentMethodValue.QUICKDEPOSIT;
    }
    if (type === PaymentMethod.BANKTRANSFER) {
      return PaymentMethodValue.BANKTRANSFER;
    }
    return '';
  }
  checkType(type: string) {
    if (type === TYPEOFTRANHISTORY.DEPOSIT) {
      return TYPEOFTRANHISTORYVALUE.DEPOSIT;
    }
    if (type === TYPEOFTRANHISTORY.WITHDRAWAL) {
      return TYPEOFTRANHISTORYVALUE.WITHDRAWAL;
    }
    return '';
  }

  checkStatus(status: number) {
    if (status === STATUSTRANHISTORY.COMPLETE) {
      return STATUSTRANHISTORYVALUE.COMPLETE;
    }
    if (status === STATUSTRANHISTORY.CANCEL) {
      return STATUSTRANHISTORYVALUE.CANCEL;
    }
    if (status === STATUSTRANHISTORY.PENDING) {
      return STATUSTRANHISTORYVALUE.PENDING;
    }
    return null;
  }
}
