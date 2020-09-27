import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { TransactionModel, TransferResulteModel } from 'src/app/core/model/withdraw-request-response.model';
import { ModalDirective } from 'ngx-bootstrap';
import { TYPEOFTRANHISTORY, STATUSTRANHISTORY, PAYMENTMETHOD } from 'src/app/core/constant/payment-method-constant';
import { GlobalService } from 'src/app/core/services/global.service';

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
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.typeTranHistory = TYPEOFTRANHISTORY;
    this.transactionStatus = STATUSTRANHISTORY;
    this.paymentMethod = PAYMENTMETHOD;
  }

  open(tranDetal: TransactionModel, accounID: string, tranType: string) {
    this.transactionDetail = tranDetal;
    this.transactionDetail.img_account_type = this.globalService.convertTypeToImg(this.transactionDetail.trading_account_id.toString());
    this.accounID = accounID;
    this.tranType = tranType;
    this.modal.show();
  }

  openTransfer(tranDetail: TransferResulteModel, tranType: string) {
    this.transferTransactionDetail = tranDetail;
    this.transferTransactionDetail.img_send_type =
    this.globalService.convertTypeToImg(this.transferTransactionDetail.from_trading_account_id.toString());
    this.transferTransactionDetail.img_receive_type =
    this.globalService.convertTypeToImg(this.transferTransactionDetail.to_trading_account_id.toString());
    this.tranType = tranType;
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

}
