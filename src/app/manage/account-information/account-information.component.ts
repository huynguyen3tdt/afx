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
import { passwordValidation} from 'src/app/core/helper/custom-validate.helper';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
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

  changePassForm: FormGroup;
  branchForm: FormGroup;
  bankAccountForm: FormGroup;
  bankForm: FormGroup;
  countries = ['Vietnamese', 'English'];
  isCompany: string;
  language: string;
  listTradingAccount: Array<AccountType>;
  accountID: number;
  isSubmittedSetting: boolean;
  errorMessage: boolean;
  oldPassword: string;
  errorPassword: boolean;
  successPassword: boolean;

  locale: string;
  formatDateHour: string;
  lastestTime: string;
  timeZone: string;
  TAB = {
    accountInfo: 'accountInfo',
    userInfo: 'userInfo',
    corpInfo: 'corpInfo',
    withDrawal: 'withDrawal',
    setting: 'setting'
  };

  showTabCorpInfo: boolean;
  showTabUserInfo: boolean;
  showTabMt5: boolean;
  showTabSetting: boolean;
  showTabWithDrawal: boolean;

  ngOnInit() {
    this.showTabMt5 = true;
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.isCompany = localStorage.getItem(IS_COMPANY);
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));

    this.initSettingForm();
  }

  changeTab(type: string) {
    if (this.TAB.accountInfo === type) {
      this.showTabMt5 = true;
    } else {
      this.showTabMt5 = false;
    }
    if (this.TAB.userInfo === type) {
      this.showTabUserInfo = true;
    } else {
      this.showTabUserInfo = false;
    }
    if (this.TAB.corpInfo === type) {
      this.showTabCorpInfo = true;
    } else {
      this.showTabCorpInfo = false;
    }
    if (this.TAB.withDrawal === type) {
      this.showTabWithDrawal = true;
    } else {
      this.showTabWithDrawal = false;
    }
    if (this.TAB.setting === type) {
      this.showTabSetting = true;
    } else {
      this.showTabSetting = false;
    }
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
}
