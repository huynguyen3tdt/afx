import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import {DepositService} from '../../core/services/deposit.service';
import {DepositModel} from '../../core/model/deposit-response.model';
declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  depositAmountForm: FormGroup;
  depositTransactionForm: FormGroup;
  listBankTranfer: Array<DepositModel> = [];
  constructor(private depositService: DepositService) { }

  ngOnInit() {
    this.showInforBank('ufj_bank');
    this.initDepositAmountForm();
    this.initDepositTransactionForm();
    this.getDepositBank();
  }

  initDepositAmountForm() {
    this.depositAmountForm = new FormGroup ({
      deposit: new FormControl('', requiredInput)
    });
  }

  initDepositTransactionForm() {
    this.depositTransactionForm = new FormGroup({
      deposit: new FormControl('', requiredInput)
    });
  }

  showInforBank(bank: string) {
    const listTab = ['ufj_bank', 'mizuho_bank', 'sm_bank', 'jpb_bank', 'jn_bank', 'rakuten_bank'];
    listTab.forEach(element => {
      if (bank === element) {
        $(`a#${element}`).addClass('selected');
        $(`div#${element}`).show();
      } else {
        $(`a#${element}`).removeClass('selected');
        $(`div#${element}`).hide();
      }
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
      }
    });
  }
}
