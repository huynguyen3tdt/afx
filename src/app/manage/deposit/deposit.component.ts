import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { DepositModel } from 'src/app/core/model/deposit-response.model';
import { DepositService } from 'src/app/core/services/deposit.service';
import { element } from 'protractor';
import { MIN_DEPOST } from 'src/app/core/constant/authen-constant';
import { WithdrawRequestService } from './../../core/services/withdraw-request.service';
import { Mt5Model } from 'src/app/core/model/withdraw-request-response.model';
declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  constructor(private depositService: DepositService,
              private withdrawRequestService: WithdrawRequestService) { }
  depositAmountForm: FormGroup;
  depositTransactionForm: FormGroup;
  listBankTranfer: Array<DepositModel>;
  minDeposit: string;
  mt5Infor: Mt5Model;
  equity: number;
  usedMargin: number;
  isSubmitted: boolean;
  equityEstimate: number;
  equityDeposit: number;
  marginLevelEstimate: number;
  marginLevelEstimateBank: number;
  errMessageQuickDeposit: boolean;
  errMessageBankTran: boolean;
  depositError: boolean;
  bankError: boolean;
  depositValue: number;
  depositAmount: number;



  ngOnInit() {
    this.minDeposit = localStorage.getItem(MIN_DEPOST);
    this.initDepositAmountForm();
    this.initDepositTransactionForm();
    this.getDepositBank();
    this.getMt5Infor();
    this.countDeposit();
    this.countDepositAmount();
  }

  initDepositAmountForm() {
    this.depositAmountForm = new FormGroup({
      deposit: new FormControl('', requiredInput)
    });
  }

  initDepositTransactionForm() {
    this.depositTransactionForm = new FormGroup({
      deposit: new FormControl('', requiredInput)
    });
  }

  getDepositBank() {
    this.depositService.getDepositBank().subscribe(response => {
      if (response.meta.code === 200) {
        this.listBankTranfer = response.data;
        this.listBankTranfer.forEach(item => {
          item.id = item.id;
          item.name = item.name;
          item.fx_logo_path = item.fx_logo_path;
          item.acc_number = item.acc_number;
          item.acc_holder_name = item.acc_holder_name;
          item.branch_name = item.branch_name;
          item.branch_code = item.branch_code;
          item.fx_acc_type = item.fx_acc_type;
          item.bic = item.bic;
          item.currency = item.currency;
        });
        if (this.listBankTranfer.length > 0) {
          this.showInforBank(`bank_${this.listBankTranfer[0].id}`);
        }
      }
    });
  }

  getMt5Infor() {
    this.withdrawRequestService.getmt5Infor().subscribe(response => {
      if (response.meta.code === 200) {
        this.mt5Infor = response.data;
        this.equity = this.mt5Infor.equity;
        this.usedMargin = this.mt5Infor.used_margin;
      }
    });
  }

  showInforBank(index) {
    setTimeout(() => {
      const listTab = [];
      // tslint:disable-next-line: no-shadowed-variable
      this.listBankTranfer.forEach(element => {
        listTab.push(`bank_${element.id}`);
      });
      // tslint:disable-next-line: no-shadowed-variable
      listTab.forEach(element => {
        if (index === element) {
          $(`a#${element}`).addClass('selected');
          $(`div#${element}`).show();
        } else {
          $(`a#${element}`).removeClass('selected');
          $(`div#${element}`).hide();
        }
      });
    }, 50);

  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.depositTransactionForm.invalid) {
      return;
    }
  }
  changeDeposit(event: any) {
    const numeral = require('numeral');
    this.depositValue = numeral(this.depositTransactionForm.controls.deposit.value).value();
    if (this.depositValue < 10000) {
      this.depositError = false;
      return;
    }
    this.depositError = true;
    this.countDeposit();
  }
  changeDepositCal(event: any) {
    const numeral = require('numeral');
    this.depositAmount = numeral(this.depositAmountForm.controls.deposit.value).value();
    if (this.depositAmount < 10000) {
      this.bankError = false;
      return;
    }
    this.bankError = true;
    this.countDepositAmount();
  }
  countDeposit() {
    this.errMessageQuickDeposit = true;
    this.equityEstimate = Math.floor(10 + this.depositValue);
    this.marginLevelEstimate = Math.floor(((10 + this.equityEstimate) / 2000) * 100);
    if (this.marginLevelEstimate <= 100) {
      this.errMessageQuickDeposit = false;
    }
  }
  countDepositAmount() {
    this.errMessageBankTran = true;
    this.equityDeposit = Math.floor(10 + this.depositAmount);
    this.marginLevelEstimateBank = Math.floor(((10 + this.equityDeposit) / 2000) * 100);
    if (this.marginLevelEstimateBank <= 100) {
      this.errMessageBankTran = false;
    }
  }
}
