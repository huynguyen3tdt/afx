import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model, WithdrawAmountModel } from 'src/app/core/model/withdraw-request-response.model';
import { UserService } from './../../core/services/user.service';
import { UserModel, CorporateResponse, CorporateModel } from 'src/app/core/model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { IS_COMPANY, ACCOUNT_IDS, FONTSIZE_AFX } from 'src/app/core/constant/authen-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { passwordValidation } from 'src/app/core/helper/custom-validate.helper';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BankInforModel } from './../../core/model/withdraw-request-response.model';
declare var $: any;


@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {


  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private translate: TranslateService,
    private withdrawRequestService: WithdrawRequestService,
    private userService: UserService,
    private authenService: AuthenService,
  ) {
  }
  accountInfor: Mt5Model;
  withdrawAmount: WithdrawAmountModel;
  editAddress: boolean;
  editEmail: boolean;
  editPhone: boolean;
  editCorAddress: boolean;
  editCorPhone: boolean;
  editCorFax: boolean;
  editPersonBod: boolean;
  editPersonPic: boolean;
  editPersonPicname: boolean;
  editPersonPhone: boolean;
  editPersonEmail: boolean;
  // editLanguage: boolean;
  userInfor: UserModel;
  corporateInfor: CorporateModel;
  userForm: FormGroup;
  corporateForm: FormGroup;
  changePassForm: FormGroup;
  branchNameForm: FormGroup;
  branchCodeForm: FormGroup;
  bankAccountForm: FormGroup;
  countries = ['Vietnamese', 'English'];
  postcode: any;
  isSubmitted: boolean;
  prefecture: any;
  county: any;
  showSave = false;
  showSaveCor = false;
  typeUser: string;
  corPrefecture: any;
  corDistrict: any;
  test: any;
  isCompany: string;
  isUser: string;
  language: string;
  listTradingAccount: Array<AccountType>;
  accountID: number;
  isSubmittedSetting: boolean;
  errorMessage: boolean;
  oldPassword: string;
  errorPassword: boolean;
  successPassword: boolean;
  bankAccount: boolean;
  editBank: boolean;


  ngOnInit() {
    this.isCompany = localStorage.getItem(IS_COMPANY);
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = Number(this.listTradingAccount[0].account_id);
    }
    this.initUserForm();
    this.initCorporateForm();
    this.initSettingForm();
    this.initBranchNameForm();
    this.initBranchCodeForm();
    this.initBankAccountForm();
    this.bankAccount = true;
    this.editBank = false;
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    this.editCorAddress = false;
    this.editCorPhone = false;
    this.editCorFax = false;
    this.editPersonBod = false;
    this.editPersonPic = false;
    this.editPersonPicname = false;
    this.editPersonPhone = false;
    this.editPersonEmail = false;
    this.getMt5Infor(this.accountID);
    this.getWithDrawAmount(this.accountID);

  }

  initUserForm() {
    this.userForm = new FormGroup({
      postCode: new FormControl(),
      searchPrefe: new FormControl(),
      searchCountry: new FormControl(),
      house_numb: new FormControl(),
      name_build: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
    });
  }
  initCorporateForm() {
    this.corporateForm = new FormGroup({
      cor_postcode: new FormControl(),
      cor_prefec: new FormControl(),
      cor_district: new FormControl(),
      cor_house: new FormControl(),
      cor_build: new FormControl(),
      cor_phone: new FormControl(),
      cor_fax: new FormControl(),
      person_bod: new FormControl(),
      person_pic: new FormControl(),
      per_picname: new FormControl(),
      person_picname: new FormControl(),
      person_phone: new FormControl(),
      person_email: new FormControl(),
    });
  }
  initSettingForm() {
    this.changePassForm = new FormGroup({
      current_password: new FormControl('', [passwordValidation]),
      new_password: new FormControl('', [passwordValidation]),
      confirm_password: new FormControl('', [passwordValidation]),
      language: new FormControl(),
    });
    this.changePassForm.controls.language.setValue(localStorage.getItem('locale'));
  }
  changeLang(event) {
    this.translate.use(event);
    localStorage.setItem('locale', event);
  }

  initBranchNameForm() {
    this.branchNameForm = new FormGroup({
      branch_name: new FormControl('')
    });
  }
  initBranchCodeForm() {
    this.branchCodeForm = new FormGroup({
      branch_code: new FormControl('')
    });
  }
  initBankAccountForm() {
    this.bankAccountForm = new FormGroup({
      beneficiary_bank: new FormControl(''),
      bank_branch: new FormControl(''),
      bank_account_type: new FormControl(),
      bank_account_number: new FormControl(''),
    });
  }

  getUserInfo() {
    this.userService.getUserInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.userInfor = response.data;
        this.prefecture = response.data.address.value.city;
        this.county = response.data.address.value.street;
        this.userForm.controls.postCode.setValue(this.userInfor.zip.value);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.city);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.street);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.street2);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.mobile);
      }
    });
  }

  getCorporateInfor() {
    this.spinnerService.show();
    this.userService.getCorporateInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.corporateInfor = response.data;
        this.corPrefecture = this.corporateInfor.corporation.address.value.city;
        this.corDistrict = this.corporateInfor.corporation.address.value.street;
        this.corporateForm.controls.cor_postcode.setValue(this.corporateInfor.corporation.zip.value);
        this.corporateForm.controls.cor_house.setValue(this.corporateInfor.corporation.address.value.street2);
        this.corporateForm.controls.cor_build.setValue(this.corporateInfor.corporation.address.value.fx_street3);
        this.corporateForm.controls.cor_phone.setValue(this.corporateInfor.corporation.mobile);
        this.corporateForm.controls.cor_fax.setValue(this.corporateInfor.corporation.fx_fax.value);
        this.corporateForm.controls.person_bod.setValue(this.corporateInfor.pic.fx_dept);
        this.corporateForm.controls.person_pic.setValue(this.corporateInfor.pic.function);
        this.corporateForm.controls.per_picname.setValue(this.corporateInfor.pic.name);
        this.corporateForm.controls.person_picname.setValue(this.corporateInfor.pic.fx_name1);
        this.corporateForm.controls.person_phone.setValue(this.corporateInfor.pic.mobile);
        this.corporateForm.controls.person_email.setValue(this.corporateInfor.pic.email.value);
      }
    });
  }
  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.accountInfor = response.data;
      }
    });
  }

  getWithDrawAmount(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwAmount(accountId).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.withdrawAmount = response.data;
      }
    });
  }

  changeUser() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    const param = {
      zip: this.userForm.controls.postCode.value,
      address: {
        city: this.userForm.controls.searchPrefe.value,
        street: this.userForm.controls.searchCountry.value,
        street2: this.userForm.controls.house_numb.value,
        fx_street3: this.userForm.controls.name_build.value,
      },
      email: this.userForm.controls.email.value,
      mobile: this.userForm.controls.phone.value,
      lang: ''
    };
    this.userService.updateUser(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.showSave = false;
        this.editAddress = false;
        this.editEmail = false;
        this.editPhone = false;
        this.getUserInfo();

      }
    });

  }

  showEditField(field: string) {
    this.showSave = true;
    switch (field) {
      case 'address':
        this.editAddress = true;
        break;
      case 'email':
        this.editEmail = true;
        break;
      case 'phone':
        this.editPhone = true;
        break;
    }
  }

  cancelEdit(field: string) {
    this.showSave = false;
    switch (field) {
      case 'address':
        this.editAddress = false;
        break;
      case 'email':
        this.editEmail = false;
        break;
      case 'phone':
        this.editPhone = false;
        break;
    }

  }
  showEditFieldCor(field: string) {
    this.showSaveCor = true;
    switch (field) {
      case 'cor-address':
        this.editCorAddress = true;
        break;
      case 'cor-phone':
        this.editCorPhone = true;
        break;
      case 'cor-fax':
        this.editCorFax = true;
        break;
      case 'department':
        this.editPersonBod = true;
        break;
      case 'pic-position':
        this.editPersonPic = true;
        break;
      case 'pic-name':
        this.editPersonPicname = true;
        break;
      case 'p-phone':
        this.editPersonPhone = true;
        break;
      case 'p-email':
        this.editPersonEmail = true;
        break;
    }
  }
  cancelEditCor(field: string) {
    this.showSaveCor = false;
    switch (field) {
      case 'cor-address':
        this.editCorAddress = false;
        break;
      case 'cor-phone':
        this.editCorPhone = false;
        break;
      case 'cor-fax':
        this.editCorFax = false;
        break;
      case 'department':
        this.editPersonBod = false;
        break;
      case 'pic-position':
        this.editPersonPic = false;
        break;
      case 'pic-name':
        this.editPersonPicname = false;
        break;
      case 'p-phone':
        this.editPersonPhone = false;
        break;
      case 'p-email':
        this.editPersonEmail = false;
        break;
    }
  }
  settingSave() {
    this.isSubmittedSetting = true;
    if (this.changePassForm.invalid) {
      this.errorMessage = false;
      return;
    }
    if (this.changePassForm.controls.new_password.value === this.changePassForm.controls.confirm_password.value) {
      this.errorMessage = false;
    } else {
      this.errorMessage = true;
      return;
    }
    const param = {
      new_password: this.changePassForm.controls.confirm_password.value,
      old_password: this.changePassForm.controls.current_password.value,
    };
    this.authenService.changePassword(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.successPassword = true;
      } else {
        this.errorPassword = true;
      }
    });
  }
  SaveCor() {
    $('#modal-corporation').modal('show');
  }
  updateCorporate() {
    const param = {
      corporation: {
        zip: this.corporateForm.controls.cor_postcode.value,
        address: {
          city: this.corporateForm.controls.cor_prefec.value,
          street: this.corporateForm.controls.cor_district.value,
          street2: this.corporateForm.controls.cor_house.value,
          fx_street3: this.corporateForm.controls.cor_build.value,
        },
        mobile: this.corporateForm.controls.cor_phone.value,
        fx_fax: this.corporateForm.controls.cor_fax.value,
        lang: '',
      },
      pic: {
        name: this.corporateForm.controls.per_picname.value,
        fx_name1: this.corporateForm.controls.person_picname.value,
        fx_gender: this.corporateInfor.pic.fx_gender.value,
        email: this.corporateForm.controls.person_email.value,
        mobile: this.corporateForm.controls.person_phone.value,
        function: this.corporateForm.controls.person_pic.value,
        fx_dept: this.corporateForm.controls.person_bod.value
      }
    };
    this.userService.changeCorporation(param).subscribe( response => {
      if (response.meta.code === 200) {
        this.editCorAddress = false;
        this.editCorPhone = false;
        this.editCorFax = false;
        this.editPersonBod = false;
        this.editPersonPic = false;
        this.editPersonPicname = false;
        this.editPersonPhone = false;
        this.editPersonEmail = false;
        this.getCorporateInfor();
      }
    });
  }
  editBankAccount() {
    this.editBank = true;
    this.bankAccount = false;

  }
  showBankInfor() {
    $('#modal-select-bank').modal('show');
  }
  saveBankAccount() {

  }
  cancelBankAccount() {
    this.editBank = false;
    this.bankAccount = true;
  }

  openSetting() {
   const fontSizeCurrent = localStorage.getItem(FONTSIZE_AFX);
   $(`#${fontSizeCurrent}`).addClass('active');
  }

  changeFontSize(fontsize: string) {
    const listFontSize = ['font-size-sm', 'font-size-md', 'font-size-lg'];
    console.log('fonrtSizeee ', fontsize);
    listFontSize.forEach(element => {
      if (fontsize === element) {
        $(`#${element}`).addClass('active');
        $('body').addClass(element);
        localStorage.setItem(FONTSIZE_AFX, element);
      } else {
        $(`#${element}`).removeClass('active');
        $('body').removeClass(element);
      }
    });
  }

}
