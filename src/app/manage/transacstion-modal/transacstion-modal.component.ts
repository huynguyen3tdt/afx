import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { TransactionModel } from 'src/app/core/model/withdraw-request-response.model';
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
  transactionStatus;
  typeTranHistory;
  paymentMethod;
  accounID: string;
  constructor() { }

  ngOnInit() {
    this.typeTranHistory = TYPEOFTRANHISTORY;
    this.transactionStatus = STATUSTRANHISTORY;
    this.paymentMethod = PAYMENTMETHOD;
  }

  open(tranDetal: TransactionModel, accounID: string) {
    this.transactionDetail = tranDetal;
    this.accounID = accounID;
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

}
