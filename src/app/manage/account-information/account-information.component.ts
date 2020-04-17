import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model, WithdrawAmountModel, BankInforModel } from 'src/app/core/model/withdraw-request-response.model';
import { UserService } from './../../core/services/user.service';
import { UserModel, CorporateModel, AddressModel } from 'src/app/core/model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { IS_COMPANY, ACCOUNT_IDS, FONTSIZE_AFX, LOCALE, TIMEZONEAFX } from 'src/app/core/constant/authen-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { passwordValidation,
         requiredInput,
         emailValidation,
         validationPhoneNumber,
         postCodevalidation} from 'src/app/core/helper/custom-validate.helper';
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
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import moment from 'moment-timezone';
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
  // name: string;
  // bic: string;
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
  timeZone: string;
  STATUS_INFO = {
    approve: 'A',
    inProgress: 'P'
  };
  TAB = {
    accountInfo: 'accountInfo',
    userInfo: 'userInfo',
    corpInfo: 'corpInfo',
    withDrawal: 'withDrawal',
    setting: 'setting'
  };

  showTabCorpInfo: boolean;
  showTabUserInfo: boolean;

  ngOnInit() {
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.initHiraCode();
    this.isCompany = localStorage.getItem(IS_COMPANY);
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = Number(this.listTradingAccount[0].account_id);
    }
    this.initUserForm();
    this.initSettingForm();
    this.initBankForm();
    this.initBranchForm();
    this.initBankAccountForm();
    this.bankAccount = true;
    this.editBank = false;
    this.getMt5Infor(this.accountID);
    this.getWithDrawAmount(this.accountID);
    if (this.isCompany === 'false') {
      this.getUserInfo();
    }
    this.getBankInfor();
  }

  changeTab(type: string) {
    switch (type) {
      case this.TAB.accountInfo:
        this.getMt5Infor(this.accountID);
        this.showTabCorpInfo = false;
        this.showTabUserInfo = false;
        break;
      case this.TAB.userInfo:
        this.showTabUserInfo = true;
        break;
      case this.TAB.corpInfo:
        console.log('in in inininin');
        this.showTabCorpInfo = true;
        break;
      case this.TAB.withDrawal:
        break;
      case this.TAB.setting:
        break;
    }
  }

  initUserForm() {
    this.userForm = new FormGroup({
      postCode: new FormControl('', postCodevalidation),
      searchPrefe: new FormControl('', requiredInput),
      searchCountry: new FormControl('', requiredInput),
      house_numb: new FormControl('', requiredInput),
      name_build: new FormControl(''),
      email: new FormControl('', emailValidation),
      phone: new FormControl('', validationPhoneNumber),
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

  changeLang(language) {
    this.translate.use(language);
    localStorage.setItem(LOCALE, language);
    const param = {
      lang: language
    };
    this.userService.changeLanguage(param).subscribe(response => {
    });
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
      beneficiary_bank: new FormControl('', requiredInput),
      bank_branch: new FormControl('', requiredInput),
      bank_account_type: new FormControl('sa'),
      bank_account_number: new FormControl('', requiredInput),
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
        this.userForm.controls.name_build.setValue(this.userInfor.address.value.fx_street3);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.mobile);
        this.userInfor.fx_gender = this.globalService.checkGender(this.userInfor.fx_gender);
      }
    });
  }

  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.accountInfor = response.data;
        this.lastestTime = moment(this.accountInfor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
      }
    });
  }

  getWithDrawAmount(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwAmount(accountId).subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.withdrawAmount = response.data;
        if (!this.withdrawAmount.withdraw_amount_pending || this.withdrawAmount.withdraw_amount_pending === null) {
          this.withdrawAmount.withdraw_amount_pending = 0;
        }
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
    // if (this.bankForm) {
    //   this.bankAccountForm.controls.beneficiary_bank.setValue(this.bankInfor.name);
    //   this.bankAccountForm.controls.bank_branch.setValue(this.bankInfor.branch_name);
    //   this.bankAccountForm.controls.bank_account_type.setValue(this.bankInfor.fx_acc_type.toString());
    //   this.bankAccountForm.controls.bank_account_number.setValue(this.bankInfor.acc_number);
    // }
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
    if (this.bankAccountForm.invalid) {
      return;
    }
    const param = {
      branch_id: this.currentBranch.id,
      acc_number: this.bankAccountForm.controls.bank_account_number.value,
      bank_id: this.currentBank.id,
      fx_acc_type: this.bankAccountForm.controls.bank_account_type.value.toString(),
    };
    this.userService.changeBank(param).subscribe(response => {
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

  settingSave() {
    this.isSubmittedSetting = true;
    this.successPassword = false;
    this.errorPassword = false;
    if (this.changePassForm.invalid) {
      this.errorMessage = false;
      return;
    }
    if (this.changePassForm.controls.new_password.value !== this.changePassForm.controls.confirm_password.value) {
      return;
    }
    if (this.changePassForm.controls.current_password.value === this.changePassForm.controls.confirm_password.value
      && this.changePassForm.controls.new_password.value === this.changePassForm.controls.confirm_password.value) {
      return;
    }
    const param = {
      new_password: this.changePassForm.controls.confirm_password.value,
      old_password: this.changePassForm.controls.current_password.value,
    };
    this.authenService.changePassword(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.successPassword = true;
      } else if (response.meta.code === 103) {
        this.errorPassword = true;
      }
    });
  }

  openSetting() {
    const fontSizeCurrent = localStorage.getItem(FONTSIZE_AFX);
    $(`#${fontSizeCurrent}`).addClass('active');
    this.initSettingForm();
    this.errorPassword = false;
    this.isSubmittedSetting = false;
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
