import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  requiredInput,
  fullSizeHiraganaValidation,
  halfSizeNumberValidation,
  fullWidthRequired,
  bankAccountValidation
} from 'src/app/core/helper/custom-validate.helper';
import { BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import { BankModel, SearchHiraModel, BranchModel } from 'src/app/core/model/bank-response.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  MizuhoBank,
  RakutenBank,
  SumitomoMitsuiBank,
  MitsubishiUFJBank,
  PayPayBank,
  JapanPostBank
} from 'src/app/core/constant/japan-constant';
import { take } from 'rxjs/operators';
import { IS_COMPANY } from 'src/app/core/constant/authen-constant';
import { ModalDirective } from 'ngx-bootstrap';
declare var $: any;

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.scss']
})
export class BankInfoComponent implements OnInit {
  @ViewChild('bankModal', { static: false }) bankModal: ModalDirective;
  branchForm: FormGroup;
  bankAccountForm: FormGroup;
  bankForm: FormGroup;
  bankAccount: boolean;
  editBank: boolean;
  bankInfor: BankInforModel;
  showBank: boolean;
  showBranch: boolean;
  showChangeBank: boolean;
  firstChar: string;
  bankSearch: Array<BankModel>;
  characBank = [];
  listHira: SearchHiraModel[];
  listHiraBranch: SearchHiraModel[];
  characBranch = [];
  branchSearch: Array<BranchModel>;
  currentBank: BankModel;
  currentBranch: BranchModel;
  isCompany: string;

  constructor(private spinnerService: Ng4LoadingSpinnerService,
              private withdrawRequestService: WithdrawRequestService,
              private userService: UserService) { }

  ngOnInit() {
    this.initHiraCode();
    this.initBankForm();
    this.initBranchForm();
    this.initBankAccountForm();
    this.getBankInfor();
    this.bankAccount = true;
    this.editBank = false;
    this.isCompany = localStorage.getItem(IS_COMPANY);
  }

  initBankForm() {
    this.bankForm = new FormGroup({
      bank_name: new FormControl('', fullSizeHiraganaValidation),
      bank_code: new FormControl('', halfSizeNumberValidation)
    });
  }

  initBranchForm() {
    this.branchForm = new FormGroup({
      branch_name: new FormControl('', fullSizeHiraganaValidation),
      branch_code: new FormControl('', halfSizeNumberValidation)
    });
  }

  initBankAccountForm() {
    this.bankAccountForm = new FormGroup({
      beneficiary_bank: new FormControl('', requiredInput),
      bank_branch: new FormControl('', requiredInput),
      bank_account_type: new FormControl('sa'),
      bank_account_number: new FormControl('', bankAccountValidation),
      account_holder: new FormControl('', fullWidthRequired)
    });
  }

  getBankInfor() {
    this.spinnerService.show();
    this.withdrawRequestService.getBankInfor().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.bankInfor = response.data;
      }
    });
  }

  getAllCharacBank() {
    this.spinnerService.show();
    this.userService.getAllCharacBank().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.characBank = response.data;
        this.characBank.forEach(item => {
          // tslint:disable-next-line: no-shadowed-variable
          this.listHira.forEach(element => {
            if (element.key_kata === item) {
              element.class = 'btn btn-sm btn-character active';
            }
          });
        });
      }
    });
  }
  getAllCharacBranch(bic: string) {
    this.initHiraCode();
    this.spinnerService.show();
    this.userService.getAllCharacBranch(bic).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.characBranch = response.data;
        this.characBranch.forEach(item => {
          // tslint:disable-next-line: no-shadowed-variable
          this.listHiraBranch.forEach(element => {
            if (element.key_kata === item) {
              element.class = 'btn btn-sm btn-character active';
            }
          });
        });
      }
    });
  }
  searchBank(firstChar: string, name: string, bic: string) {
    this.spinnerService.show();
    this.userService.getSearchBank(firstChar, name, bic).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.bankSearch = response.data;
      }
    });
  }
  searchBranch(bic: string, firstChar: string, branName: string, branchCode: string) {
    this.spinnerService.show();
    this.userService.getSearchBranch(bic, firstChar, branName, branchCode).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.branchSearch = response.data;
      }
    });
  }

  editBankAccount() {
    this.editBank = true;
    this.bankAccount = false;
    if (this.bankForm) {
      this.bankAccountForm.controls.beneficiary_bank.setValue(this.bankInfor.name);
      this.bankAccountForm.controls.bank_branch.setValue(this.bankInfor.branch_name);
      this.bankAccountForm.controls.bank_account_type.setValue(this.bankInfor.fx_acc_type.toString());
      this.bankAccountForm.controls.bank_account_number.setValue(this.bankInfor.acc_number);
      this.bankAccountForm.controls.account_holder.setValue(this.bankInfor.acc_holder_name);
    }
  }
  showBankInfor(type: number, bankName?: string) {
    this.initHiraCode();
    this.bankSearch = [];
    this.branchSearch = [];
    if (type === 1) {
      // $('#modal-select-bank').modal('show');
      this.bankModal.show();
      switch (bankName) {
        case MizuhoBank.name:
          this.currentBank = MizuhoBank;
          break;
        case RakutenBank.name:
          this.currentBank = RakutenBank;
          break;
        case SumitomoMitsuiBank.name:
          this.currentBank = SumitomoMitsuiBank;
          break;
        case MitsubishiUFJBank.name:
          this.currentBank = MitsubishiUFJBank;
          break;
        case PayPayBank.name:
          this.currentBank = PayPayBank;
          break;
        case JapanPostBank.name:
          this.currentBank = JapanPostBank;
          break;
      }
      this.showBank = false;
      this.showBranch = true;
      this.getAllCharacBranch(this.currentBank.bic);
    } else if (type === 2) {
      // $('#modal-select-bank').modal('show');
      this.bankModal.show();
      this.showBank = true;
      this.showBranch = false;
      this.getAllCharacBank();
    }

  }

  changeBank() {
    this.initHiraCode();
    this.showBank = true;
    this.showBranch = false;
    this.getAllCharacBank();
  }
  saveBankAccount() {
    if (this.bankAccountForm.invalid) {
      return;
    }
    const param = {
      branch_id: this.bankInfor.branch_id,
      acc_number: this.bankAccountForm.controls.bank_account_number.value,
      bic: this.bankInfor.bic,
      fx_acc_type: this.bankAccountForm.controls.bank_account_type.value.toString(),
      acc_holder_name: this.bankAccountForm.controls.account_holder.value.trim()
    };
    this.spinnerService.show();
    this.userService.changeBank(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.cancelBankAccount();
      }
    });
  }
  cancelBankAccount() {
    this.editBank = false;
    this.bankAccount = true;
    this.getBankInfor();
  }

  changeHira(item) {
    // tslint:disable-next-line: no-shadowed-variable
    this.listHira.forEach(element => {
      if (element.class !== 'btn btn-sm btn-character disabled') {
        if (element.key_hira === item.key_hira) {
          element.class = 'btn btn-sm btn-character choose';
        } else {
          element.class = 'btn btn-sm btn-character active';
        }
      }
    });
    this.searchBank(item.key_kata, '', '');
  }

  changeHiraBranch(item) {
    // tslint:disable-next-line: no-shadowed-variable
    this.listHiraBranch.forEach(element => {
      if (element.class !== 'btn btn-sm btn-character disabled') {
        if (element.key_hira === item.key_hira) {
          element.class = 'btn btn-sm btn-character choose';
        } else {
          element.class = 'btn btn-sm btn-character active';
        }
      }
    });
    this.searchBranch(this.currentBank.bic, item.key_kata, '', '');
  }

  searchBranchSubmit(type: number) {
    if (type === 1) {
      this.searchBranch(this.currentBank.bic, '', this.upperCaseHira(this.branchForm.controls.branch_name.value), '');
    }
    if (type === 2) {
      this.searchBranch(this.currentBank.bic, '', '', this.branchForm.controls.branch_code.value);
    }
  }

  searchBankSubmit(type: number) {
    if (type === 1) {
      this.searchBank('', this.upperCaseHira(this.bankForm.controls.bank_name.value), '');
    }
    if (type === 2) {
      this.searchBank('', '', this.bankForm.controls.bank_code.value);
    }
  }

  selectBank(item: BankModel) {
    this.showBank = false;
    this.showBranch = true;
    this.currentBank = item;
    this.getAllCharacBranch(this.currentBank.bic);
    this.branchSearch = [];
  }

  selectBranch(item: BranchModel) {
    // $('#modal-select-bank').modal('hide');
    this.bankModal.hide();
    this.currentBranch = item;
    this.bankInfor.branch_id = this.currentBranch.id;
    this.bankInfor.bank_id = this.currentBank.id;
    this.bankInfor.bic = this.currentBank.bic;
    this.bankAccountForm.controls.beneficiary_bank.setValue(this.currentBank.name);
    this.bankAccountForm.controls.bank_branch.setValue(this.currentBranch.branch_name);
  }

  initHiraCode() {
    this.listHira = [
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' }
    ];
    this.listHiraBranch = [
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' },
      { key_hira: '???', key_kata: '???', class: 'btn btn-sm btn-character disabled' }
    ];
  }

  upperCaseHira(searchHira: string) {
    const listUpperHira = [{key: '???', value: '???'}, {key: '???', value: '???'}, {key: '???', value: '???'}, {key: '???', value: '???'}];
    listUpperHira.forEach(item => {
      if (searchHira.indexOf(item.key) > -1) {
        searchHira = searchHira.replace(item.key, item.value);
      }
    });
    return searchHira;
  }
}
