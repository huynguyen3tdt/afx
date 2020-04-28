import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput, fullSizeHiraganaValidation, halfSizeNumberValidation } from 'src/app/core/helper/custom-validate.helper';
import { BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import { BankModel, SearchHiraModel, BranchModel } from 'src/app/core/model/bank-response.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import {
  MizuhoBank,
  RakutenBank,
  SumitomoMitsuiBank,
  MitsubishiUFJBank,
  JapanNetBank,
  JapanPostBank
} from 'src/app/core/constant/japan-constant';
declare var $: any;

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.scss']
})
export class BankInfoComponent implements OnInit {
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
      bank_account_number: new FormControl('', requiredInput),
    });
  }

  getBankInfor() {
    this.spinnerService.show();
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.bankInfor = response.data;
      }
    });
  }

  getAllCharacBank() {
    this.spinnerService.show();
    this.userService.getAllCharacBank().subscribe(response => {
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
  getAllCharacBranch(bankId: number) {
    this.initHiraCode();
    this.spinnerService.show();
    this.userService.getAllCharacBranch(bankId).subscribe(response => {
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
    this.userService.getSearchBank(firstChar, name, bic).subscribe(response => {
      if (response.meta.code === 200) {
        this.bankSearch = response.data;
      }
    });
  }
  searchBranch(bankId: number, firstChar: string, branName: string, branchCode: string) {
    this.userService.getSearchBranch(bankId, firstChar, branName, branchCode).subscribe(response => {
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
    }
  }
  showBankInfor(type: number, bankName?: string) {
    this.initHiraCode();
    this.bankSearch = [];
    this.branchSearch = [];
    if (type === 1) {
      $('#modal-select-bank').modal('show');
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
        case JapanNetBank.name:
          this.currentBank = JapanNetBank;
          break;
        case JapanPostBank.name:
          this.currentBank = JapanPostBank;
          break;
      }
      this.showBank = false;
      this.showBranch = true;
      this.getAllCharacBranch(this.currentBank.id);
    } else if (type === 2) {
      $('#modal-select-bank').modal('show');
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
      bank_id: this.bankInfor.bank_id,
      fx_acc_type: this.bankAccountForm.controls.bank_account_type.value.toString(),
    };
    this.spinnerService.show();
    this.userService.changeBank(param).subscribe(response => {
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
    this.searchBranch(this.currentBank.id, item.key_kata, '', '');
  }

  searchBranchSubmit(type: number) {
    if (type === 1) {
      this.searchBranch(this.currentBank.id, '', this.branchForm.controls.branch_name.value, '');
    }
    if (type === 2) {
      this.searchBranch(this.currentBank.id, '', '', this.branchForm.controls.branch_code.value);
    }
  }

  searchBankSubmit(type: number) {
    if (type === 1) {
      this.searchBank('', this.bankForm.controls.bank_name.value, '');
    }
    if (type === 2) {
      this.searchBank('', '', this.bankForm.controls.bank_code.value);
    }
  }

  selectBank(item: BankModel) {
    this.showBank = false;
    this.showBranch = true;
    this.currentBank = item;
    this.getAllCharacBranch(this.currentBank.id);
    this.branchSearch = [];
  }

  selectBranch(item: BranchModel) {
    $('#modal-select-bank').modal('hide');
    this.currentBranch = item;
    this.bankInfor.branch_id = this.currentBranch.id;
    this.bankInfor.bank_id = this.currentBank.id;
    this.bankAccountForm.controls.beneficiary_bank.setValue(this.currentBank.name);
    this.bankAccountForm.controls.bank_branch.setValue(this.currentBranch.branch_name);
  }

  initHiraCode() {
    this.listHira = [
      { key_hira: 'あ', key_kata: 'ｱ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'か', key_kata: 'ｶ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'さ', key_kata: 'ｻ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'た', key_kata: 'ﾀ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'な', key_kata: 'ﾅ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'は', key_kata: 'ﾊ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ま', key_kata: 'ﾏ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'や', key_kata: 'ﾔ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ら', key_kata: 'ﾗ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'わ', key_kata: 'ﾜ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'い', key_kata: 'ｲ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'き', key_kata: 'ｷ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'し', key_kata: 'ｼ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ち', key_kata: 'ﾁ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'に', key_kata: 'ﾆ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ひ', key_kata: 'ﾋ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'み', key_kata: 'ﾐ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'り', key_kata: 'ﾘ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'う', key_kata: 'ｳ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'く', key_kata: 'ｸ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'す', key_kata: 'ｽ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'つ', key_kata: 'ﾂ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ぬ', key_kata: 'ﾇ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ふ', key_kata: 'ﾌ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'む', key_kata: 'ﾑ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ゆ', key_kata: 'ﾕ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'る', key_kata: 'ﾙ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'を', key_kata: 'ｦ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'え', key_kata: 'ｴ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'け', key_kata: 'ｹ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'せ', key_kata: 'ｾ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'て', key_kata: 'ﾃ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ね', key_kata: 'ﾈ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'へ', key_kata: 'ﾍ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'め', key_kata: 'ﾒ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'れ', key_kata: 'ﾚ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'お', key_kata: 'ｵ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'こ', key_kata: 'ｺ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'そ', key_kata: 'ｿ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'と', key_kata: 'ﾄ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'の', key_kata: 'ﾉ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ほ', key_kata: 'ﾎ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'も', key_kata: 'ﾓ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'よ', key_kata: 'ﾖ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ろ', key_kata: 'ﾛ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ん', key_kata: 'ﾝ', class: 'btn btn-sm btn-character disabled' }
    ];
    this.listHiraBranch = [
      { key_hira: 'あ', key_kata: 'ｱ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'か', key_kata: 'ｶ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'さ', key_kata: 'ｻ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'た', key_kata: 'ﾀ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'な', key_kata: 'ﾅ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'は', key_kata: 'ﾊ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ま', key_kata: 'ﾏ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'や', key_kata: 'ﾔ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ら', key_kata: 'ﾗ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'わ', key_kata: 'ﾜ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'い', key_kata: 'ｲ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'き', key_kata: 'ｷ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'し', key_kata: 'ｼ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ち', key_kata: 'ﾁ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'に', key_kata: 'ﾆ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ひ', key_kata: 'ﾋ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'み', key_kata: 'ﾐ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'り', key_kata: 'ﾘ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'う', key_kata: 'ｳ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'く', key_kata: 'ｸ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'す', key_kata: 'ｽ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'つ', key_kata: 'ﾂ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ぬ', key_kata: 'ﾇ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ふ', key_kata: 'ﾌ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'む', key_kata: 'ﾑ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ゆ', key_kata: 'ﾕ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'る', key_kata: 'ﾙ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'を', key_kata: 'ｦ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'え', key_kata: 'ｴ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'け', key_kata: 'ｹ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'せ', key_kata: 'ｾ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'て', key_kata: 'ﾃ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ね', key_kata: 'ﾈ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'へ', key_kata: 'ﾍ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'め', key_kata: 'ﾒ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'れ', key_kata: 'ﾚ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: ' ', key_kata: ' ', class: 'btn-none' },
      { key_hira: 'お', key_kata: 'ｵ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'こ', key_kata: 'ｺ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'そ', key_kata: 'ｿ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'と', key_kata: 'ﾄ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'の', key_kata: 'ﾉ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ほ', key_kata: 'ﾎ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'も', key_kata: 'ﾓ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'よ', key_kata: 'ﾖ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ろ', key_kata: 'ﾛ', class: 'btn btn-sm btn-character disabled' },
      { key_hira: 'ん', key_kata: 'ﾝ', class: 'btn btn-sm btn-character disabled' }
    ];
  }

}
