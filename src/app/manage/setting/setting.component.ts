import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountType } from 'src/app/core/model/report-response.model';
import { passwordValidation } from 'src/app/core/helper/custom-validate.helper';
import { LOCALE, FONTSIZE_AFX } from 'src/app/core/constant/authen-constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TranslateService } from '@ngx-translate/core';
import { AuthenService } from 'src/app/core/services/authen.service';
import { UserService } from 'src/app/core/services/user.service';
declare var $: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  changePassForm: FormGroup;
  countries = ['Vietnamese', 'English'];
  language: string;
  listTradingAccount: Array<AccountType>;
  accountID: number;
  isSubmittedSetting: boolean;
  errorMessage: boolean;
  invalidPassword: boolean;
  successPassword: boolean;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
              private translate: TranslateService,
              private userService: UserService,
              private authenService: AuthenService) { }

  ngOnInit() {
    this.initSettingForm();
    this.openSetting();
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
    this.invalidPassword = false;
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
    this.spinnerService.show();
    this.authenService.changePassword(param).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.successPassword = true;
      } else if (response.meta.code === 103) {
        this.invalidPassword = true;
      }
    });
  }

  openSetting() {
    const fontSizeCurrent = localStorage.getItem(FONTSIZE_AFX);
    $(`#${fontSizeCurrent}`).addClass('active');
    this.invalidPassword = false;
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
