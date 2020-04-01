import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionModel } from 'src/app/core/model/withdraw-request-response.model';
import { JAPAN_FORMATDATE_HH_MM, EN_FORMATDATE, EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { PaymentMethod, TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
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

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router) { }

  ngOnInit() {
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
        console.log('transactionDetailll ', this.transactionDetail);
        $('#tran_detail').modal('show');
      }
    });
  }

  // goToHistory() {
  //   this.router.navigate(['/manage/withdrawHistory']);
  // }

}
