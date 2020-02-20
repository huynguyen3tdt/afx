import { Component, OnInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
// import { ACCOUNT_TYPE } from 'src/app/core/constant/authen-constant';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { BankInforModel, Mt5Model, TransactionModel } from 'src/app/core/model/withdraw-request-response.model';
declare var $: any;

@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.css']
})
export class WithdrawRequestComponent implements OnInit {

  mt5Infor: Mt5Model;
  accountType;
  bankInfor: BankInforModel;
  listDwAmount;
  withdrawForm: FormGroup;
  isSubmitted: boolean;
  listDwHistory;
  transactionDetail: TransactionModel;

  constructor(private withdrawRequestService: WithdrawRequestService, ) { }

  ngOnInit() {
    this.initWithdrawForm();
    this.getMt5Infor();
    this.getBankInfor();
    this.getDwAmount();
    this.getDwHistory();
  }

  initWithdrawForm() {
    this.withdrawForm = new FormGroup({
      amount: new FormControl('', requiredInput),
      wholeMoney: new FormControl(false),
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.withdrawForm.invalid) {
      return;
    }
    const param = {
      account_id: '1234',
      amount: this.withdrawForm.controls.amount.value,
      currency: 'JPY'
    };
    this.withdrawRequestService.postWithdraw(param).subscribe(response => {
      if (response.meta.code === 200) { }
    });
  }

  getMt5Infor() {
    this.withdrawRequestService.getmt5Infor().subscribe(response => {
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        // this.accountType = localStorage.getItem(ACCOUNT_TYPE);
      }
    });
  }
  getBankInfor() {
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.bankInfor = response.data;
      }
    });
  }
  getDwAmount() {
    this.withdrawRequestService.getDwAmount().subscribe(response => {
      if (response.meta.code === 200) {
        this.listDwAmount = response.data;

        this.withdrawForm.controls.amount.setValue(this.listDwAmount.withdraw_amount.toString());
      }
    });
  }
  getDwHistory() {
    this.withdrawRequestService.getDwHistory().subscribe(response => {
      if (response.meta.code === 200) {
        this.listDwHistory = response.data.results;

      }
    });
  }
  onRefesh() {
    this.getMt5Infor();
  }

  openDetailTransaction(item) {
    this.transactionDetail = item;
    $('#detai_transaction').modal('show');
  }

  showConfirm() {
    $('#withdraw_confirm').modal('show');
  }
}
