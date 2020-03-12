import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionModel } from 'src/app/core/model/withdraw-request-response.model';
import { JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { PaymentMethod, TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
declare var $: any;
import * as moment from 'moment';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.css']
})
export class ListTransactionComponent implements OnInit, OnChanges {
  @Input() accountID: string;
  @Input() tranType: number;

  titleTransaction: string;
  listTransaction: Array<TransactionModel>;
  transactionDetail: TransactionModel;

  constructor(private withdrawRequestService: WithdrawRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.accountID) {
      this.getTranHistory(Number(this.accountID.split('-')[1]), 1, 2, this.tranType);
    }
  }

  getTranHistory(accountNumber: number, pageSize: number, pageNumber: number, type?: number, dateFrom?: string, dateTo?: string) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwHistory(accountNumber, pageNumber, pageSize, type, dateFrom, dateTo).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.listTransaction = response.data.results;
        this.listTransaction.forEach(item => {
          item.create_date = moment(item.create_date).format(JAPAN_FORMATDATE_HH_MM);
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
        this.transactionDetail.create_date = moment(this.transactionDetail.create_date).format(JAPAN_FORMATDATE_HH_MM);
        this.transactionDetail.method = this.checkPaymentMedthod(this.transactionDetail.method);
        this.transactionDetail.funding_type = this.checkType(this.transactionDetail.funding_type);
        $('#tran_detail').modal('show');
      }
    });
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

  // goToHistory() {
  //   this.router.navigate(['/manage/withdrawHistory']);
  // }

}
