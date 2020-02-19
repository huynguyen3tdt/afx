import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
declare var $: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  depositAmountForm: FormGroup;
  depositTransactionForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.showInforBank('ufj_bank');
    this.initDepositAmountForm();
    this.initDepositTransactionForm();
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

}
