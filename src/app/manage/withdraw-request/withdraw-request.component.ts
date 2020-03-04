import { Component, OnInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
// import { ACCOUNT_TYPE } from 'src/app/core/constant/authen-constant';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { BankInforModel, Mt5Model, TransactionModel } from 'src/app/core/model/withdraw-request-response.model';
import { MIN_WITHDRAW, ACCOUNT_IDS } from './../../core/constant/authen-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
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
  minWithdraw: string;
  depositValue: number;
  withdrawError: boolean;
  equityEstimate: number;
  marginLevelEstimate: number;
  errMessage: boolean;
  accountID: number;
  equity: number;
  usedMargin: number;
  listTradingAccount: Array<AccountType>;


  constructor(private withdrawRequestService: WithdrawRequestService
              ) { }

  ngOnInit() {
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = Number(this.listTradingAccount[0].account_id);
    }

    this.minWithdraw = localStorage.getItem(MIN_WITHDRAW);
    this.initWithdrawForm();
    this.getMt5Infor(this.accountID);
    this.getBankInfor();
    this.getDwAmount(this.accountID);
    this.getDwHistory();

  }

  initWithdrawForm() {
    const numeral = require('numeral');
    this.withdrawForm = new FormGroup({
      amount: new FormControl(numeral(10000).format('0,0'), requiredInput),
      wholeMoney: new FormControl(false),
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.withdrawForm.invalid) {
      return;
    }
    const param = {
      ACCOUNT_IDS: '1234',
      amount: this.withdrawForm.controls.amount.value,
      currency: 'JPY'
    };
    this.withdrawRequestService.postWithdraw(param).subscribe(response => {
      if (response.meta.code === 200) { }
    });
  }

  getMt5Infor(accountId) {
    this.withdrawRequestService.getmt5Infor(accountId).subscribe(response => {
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
      }
      this.countWithdraw();
    });
  }
  getBankInfor() {
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.bankInfor = response.data;

      }
    });
  }
  getDwAmount(accountId) {
    this.withdrawRequestService.getDwAmount(accountId).subscribe(response => {
      if (response.meta.code === 200) {
        this.listDwAmount = response.data;

        this.withdrawForm.controls.amount.setValue(this.listDwAmount.withdraw_amount.toString());
      }
    });
  }
  getDwHistory() {
    // this.withdrawRequestService.getDwHistory().subscribe(response => {
    //   if (response.meta.code === 200) {
    //     this.listDwHistory = response.data.results;

    //   }
    // });
  }

  changeWithdtaw(event: any) {
    const numeral = require('numeral');
    this.depositValue = numeral(this.withdrawForm.controls.amount.value).value();
    if (this.depositValue < 10000) {
      this.withdrawError = true;
      return;
    }
    this.withdrawError = false;
    this.countWithdraw();
  }
  countWithdraw() {
    const numeral = require('numeral');
    this.errMessage = false;
    this.equityEstimate = Math.floor(this.equity - numeral(this.withdrawForm.controls.amount.value).value());
    this.marginLevelEstimate = Math.floor((this.equityEstimate / this.usedMargin) * 100);
    if (this.marginLevelEstimate <= 100) {
      this.errMessage = true;
    }
  }
  onRefesh() {
    this.getMt5Infor(this.accountID);
  }

  openDetailTransaction(item) {
    this.transactionDetail = item;
    $('#detai_transaction').modal('show');
  }

  showConfirm() {
    $('#withdraw_confirm').modal('show');
  }
}
