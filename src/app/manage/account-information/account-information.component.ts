import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model, WithdrawAmountModel, BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import { UserService } from './../../core/services/user.service';
import { UserModel, CorporateResponse, CorporateModel, AddressModel } from 'src/app/core/model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { IS_COMPANY, ACCOUNT_IDS, FONTSIZE_AFX, LOCALE } from 'src/app/core/constant/authen-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { passwordValidation,
         requiredInput,
         emailValidation,
         validationPhoneNumber,
         salaryInput } from 'src/app/core/helper/custom-validate.helper';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchHiraModel, BankModel, BranchModel } from 'src/app/core/model/bank-response.model';
import {
  MizuhoBank,
  RakutenBank,
  SumitomoMitsuiBank,
  MitsubishiUFJBank,
  JapanNetBank,
  JapanPostBank
} from 'src/app/core/constant/japan-constant';
import { EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import * as moment from 'moment';
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
    private globalService: GlobalService
  ) { }
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
  branchForm: FormGroup;
  bankAccountForm: FormGroup;
  bankForm: FormGroup;
  countries = ['Vietnamese', 'English'];
  postcode: any;
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
  bankInfor: BankInforModel;
  showBank: boolean;
  showBranch: boolean;
  showChangeBank: boolean;
  firstChar: string;
  name: string;
  bic: string;
  bankSearch: Array<BankModel>;
  characBank = [];
  listHira: SearchHiraModel[];
  listHiraBranch: SearchHiraModel[];
  characBranch = [];
  branchSearch: Array<BranchModel>;
  currentBank: BankModel;
  currentBranch: BranchModel;
  isSubmittedUser: boolean;
  isSubmittedCor: boolean;
  listAddressCor: AddressModel;
  listAddressUser: AddressModel;
  locale: string;
  formatDateHour: string;
  lastestTime: string;

  ngOnInit() {
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === 'en') {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === 'jp') {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.initHiraCode();
    this.isCompany = localStorage.getItem(IS_COMPANY);
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = Number(this.listTradingAccount[0].account_id);
    }
    this.initUserForm();
    this.initCorporateForm();
    this.initSettingForm();
    this.initBankForm();
    this.initBranchForm();
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
      postCode: new FormControl('', salaryInput),
      searchPrefe: new FormControl('', requiredInput),
      searchCountry: new FormControl('', requiredInput),
      house_numb: new FormControl('', requiredInput),
      name_build: new FormControl(''),
      email: new FormControl('', emailValidation),
      phone: new FormControl('', [requiredInput, validationPhoneNumber]),
    });
  }
  initCorporateForm() {
    this.corporateForm = new FormGroup({
      cor_postcode: new FormControl('', salaryInput),
      cor_prefec: new FormControl('', requiredInput),
      cor_district: new FormControl('', requiredInput),
      cor_house: new FormControl('', requiredInput),
      cor_build: new FormControl(''),
      cor_phone: new FormControl('', [requiredInput, validationPhoneNumber]),
      cor_fax: new FormControl('', requiredInput),
      person_bod: new FormControl('', requiredInput),
      person_pic: new FormControl('', requiredInput),
      per_picname: new FormControl('', requiredInput),
      person_picname: new FormControl('', requiredInput),
      person_phone: new FormControl('', [requiredInput, validationPhoneNumber]),
      person_email: new FormControl('', emailValidation),
    });
  }
  initSettingForm() {
    this.changePassForm = new FormGroup({
      current_password: new FormControl('', [passwordValidation]),
      new_password: new FormControl('', [passwordValidation]),
      confirm_password: new FormControl('', [passwordValidation]),
      language: new FormControl(),
    });
    this.changePassForm.controls.language.setValue(localStorage.getItem(LOCALE));
  }
  changeLang(event) {
    this.translate.use(event);
    localStorage.setItem(LOCALE, event);
  }

  initBankForm() {
    this.bankForm = new FormGroup({
      bank_name: new FormControl(''),
      bank_code: new FormControl('')
    });
  }

  initBranchForm() {
    this.branchForm = new FormGroup({
      branch_name: new FormControl(''),
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
        // this.county = response.data.address.value.street;
        this.userForm.controls.postCode.setValue(this.userInfor.zip.value);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.city);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.street);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.street2);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.mobile);
        this.userInfor.fx_gender = this.globalService.checkGender(this.userInfor.fx_gender);
      }
    });
  }

  getCorporateInfor() {
    this.spinnerService.show();
    this.userService.getCorporateInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.corporateInfor = response.data;
        this.corporateForm.controls.cor_prefec.setValue(this.corporateInfor.corporation.address.value.city);
        this.corporateForm.controls.cor_district.setValue(this.corporateInfor.corporation.address.value.street);
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
        this.corporateInfor.pic.fx_gender.value = this.globalService.checkGender(this.corporateInfor.pic.fx_gender.value);
      }
    });
  }
  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.accountInfor = response.data;
        this.lastestTime = moment(this.accountInfor.lastest_time).format(this.formatDateHour);
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

  getBankInfor() {
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      this.spinnerService.show();
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.bankInfor = response.data;
      }
    });
  }

  userSubmit() {
    this.isSubmittedUser = true;
    if (this.userForm.invalid) {
      return;
    }
    $('#modal-confirm').modal('show');
  }
  changeUser() {
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
  // postNo
  changeAddress(type: number) {
    if (type === 1) {
      const postNo = this.userForm.controls.postCode.value;
      this.userService.getAddress(postNo).subscribe(response => {
        if (response.meta.code === 200) {
          this.listAddressUser = response.data;
          this.userForm.controls.postCode.setValue(this.listAddressUser.postno);
          this.userForm.controls.searchPrefe.setValue(this.listAddressUser.prefecture);
          this.userForm.controls.searchCountry.setValue(this.listAddressUser.city + this.listAddressUser.town);
          this.userForm.controls.house_numb.setValue(this.listAddressUser.old_postcode);
          this.userForm.controls.name_build.setValue(this.listAddressUser.city);
        }
      });
    } else if (type === 2) {
      const postNo = this.corporateForm.controls.cor_postcode.value;
      this.userService.getAddress(postNo).subscribe(response => {
        if (response.meta.code === 200) {
          this.listAddressCor = response.data;
          this.corporateForm.controls.cor_postcode.setValue(this.listAddressCor.postno);
          this.corporateForm.controls.cor_district.setValue(this.listAddressCor.city + this.listAddressCor.town);
          this.corporateForm.controls.cor_build.setValue(this.listAddressCor.city);
          this.corporateForm.controls.cor_house.setValue(this.listAddressCor.old_postcode);
          this.corporateForm.controls.cor_prefec.setValue(this.listAddressCor.prefecture);
        }
      });
    }
  }
  SaveCor() {
    this.isSubmittedCor = true;
    if (this.corporateForm.invalid) {
      return;
    } else {
      $('#modal-corporation').modal('show');
    }

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
        fx_gender: this.globalService.convertGender(this.corporateInfor.pic.fx_gender.value),
        email: this.corporateForm.controls.person_email.value,
        mobile: this.corporateForm.controls.person_phone.value,
        function: this.corporateForm.controls.person_pic.value,
        fx_dept: this.corporateForm.controls.person_bod.value
      }
    };
    this.userService.changeCorporation(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.showSaveCor = false;
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

  getAllCharacBank() {
    this.userService.getAllCharacBank().subscribe(response => {
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
    this.userService.getAllCharacBranch(bankId).subscribe(response => {
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
    this.bankAccountForm.controls.beneficiary_bank.setValue(this.bankInfor.name);
    this.bankAccountForm.controls.bank_branch.setValue(this.bankInfor.branch_name);
    this.bankAccountForm.controls.bank_account_type.setValue(this.bankInfor.fx_acc_type.toString());
    this.bankAccountForm.controls.bank_account_number.setValue(this.bankInfor.acc_number);
  }
  showBankInfor(type: number, bankName?: string) {
    this.initHiraCode();
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
    const param = {
      branch_id: this.currentBranch.id,
      acc_number: this.bankAccountForm.controls.bank_account_number.value,
      bank_id: this.currentBank.id,
      fx_acc_type: this.bankAccountForm.controls.bank_account_type.value.toString(),
    };
    this.userService.changeBank(param).subscribe(response => {
      if (response.meta.code === 200) {

      }
    });
  }
  cancelBankAccount() {
    this.editBank = false;
    this.bankAccount = true;
    this.getBankInfor();
  }

  openSetting() {
    const fontSizeCurrent = localStorage.getItem(FONTSIZE_AFX);
    $(`#${fontSizeCurrent}`).addClass('active');
  }

  changeFontSize(fontsize: string) {
    const listFontSize = ['font-size-sm', 'font-size-md', 'font-size-lg'];
    // tslint:disable-next-line: no-shadowed-variable
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
    this.branchSearch = null;
  }
  selectBranch(item: BranchModel) {
    $('#modal-select-bank').modal('hide');
    this.currentBranch = item;
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
      { key_hira: 'ら', key_kata: 'ｻ', class: 'btn btn-sm btn-character disabled' },
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
      { key_hira: 'ら', key_kata: 'ｻ', class: 'btn btn-sm btn-character disabled' },
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
