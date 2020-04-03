import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionModel } from 'src/app/core/model/withdraw-request-response.model';
import { JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { PAYMENTMETHOD, TYPEOFTRANHISTORY, STATUSTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
declare var $: any;
import moment from 'moment-timezone';
import { LOCALE, TIMEZONEAFX, TIMEZONESERVER } from 'src/app/core/constant/authen-constant';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.css']
})
export class ListTransactionComponent implements OnInit, OnChanges {
  @Input() accountID: string;
  @Input() tranType: string;

  titleTransaction: string;
  listTransaction: Array<TransactionModel>;
  transactionDetail: TransactionModel;
  locale: string;
  formatDateHour: string;
  timeZone: string;
  transactionStatus;
  typeTranHistory;
  paymentMethod;

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router) { }

  ngOnInit() {
    this.typeTranHistory = TYPEOFTRANHISTORY;
    this.transactionStatus = STATUSTRANHISTORY;
    this.paymentMethod = PAYMENTMETHOD;
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === 'en') {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === 'jp') {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
  }

  ngOnChanges(): void {
    if (this.accountID) {
      this.getTranHistory(Number(this.accountID.split('-')[1]), 1, 5, this.tranType);
    }
  }

  getTranHistory(accountNumber: number, pageSize: number, pageNumber: number, type?: string, dateFrom?: string, dateTo?: string) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwHistory(accountNumber, pageNumber, pageSize, type, dateFrom, dateTo).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listTransaction = response.data.results;
        this.listTransaction.forEach(item => {
          item.create_date += TIMEZONESERVER;
          item.create_date =
          // moment(new Date(item.create_date).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })).format(this.formatDateHour);
          moment(item.create_date).tz(this.timeZone).format(this.formatDateHour);
          item.funding_type = this.checkType(item.funding_type);
          item.method = this.checkPaymentMedthod(item.method);
        });
      }
    });
  }

  openDetail(tranId: number) {
    this.withdrawRequestService.getDetailTranHistory(tranId).subscribe(response => {
      if (response.meta.code === 200) {
        this.transactionDetail = response.data;
        this.transactionDetail.create_date += TIMEZONESERVER;
        this.transactionDetail.create_date = moment(this.transactionDetail.create_date).tz(this.timeZone).format(this.formatDateHour);
        this.transactionDetail.method = this.checkPaymentMedthod(this.transactionDetail.method);
        this.transactionDetail.funding_type = this.checkType(this.transactionDetail.funding_type);
        $('#tran_detail').modal('show');
      }
    });
  }

  checkPaymentMedthod(type: string) {
    if (type === PAYMENTMETHOD.QUICKDEPOSIT.key) {
      return PAYMENTMETHOD.QUICKDEPOSIT.name;
    }
    if (type === PAYMENTMETHOD.BANKTRANSFER.key) {
      return PAYMENTMETHOD.BANKTRANSFER.name;
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

  // goToHistory() {
  //   this.router.navigate(['/manage/withdrawHistory']);
  // }

}
