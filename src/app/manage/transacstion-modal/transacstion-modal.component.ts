import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { TransactionModel, TransferResulteModel } from 'src/app/core/model/withdraw-request-response.model';
import { ModalDirective } from 'ngx-bootstrap';
import { TYPEOFTRANHISTORY, STATUSTRANHISTORY, PAYMENTMETHOD } from 'src/app/core/constant/payment-method-constant';

@Component({
  selector: 'app-transacstion-modal',
  templateUrl: './transacstion-modal.component.html',
  styleUrls: ['./transacstion-modal.component.scss']
})
export class TransacstionModalComponent implements OnInit {
  @ViewChild('tranModal', { static: true }) modal: ModalDirective;
  transactionDetail: TransactionModel;
  transferTransactionDetail: TransferResulteModel;
  transactionStatus;
  typeTranHistory;
  paymentMethod;
  accounID: string;
  tranType: string;
  constructor() { }

  ngOnInit() {
    this.typeTranHistory = TYPEOFTRANHISTORY;
    this.transactionStatus = STATUSTRANHISTORY;
    this.paymentMethod = PAYMENTMETHOD;
  }

  open(tranDetal: TransactionModel, accounID: string, tranType: string) {
    this.transactionDetail = tranDetal;
    this.accounID = accounID;
    this.tranType = tranType;
    this.modal.show();
  }

  openTransfer(tranDetail: TransferResulteModel, tranType: string) {
    this.transferTransactionDetail = tranDetail;
    this.tranType = tranType;
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

}
