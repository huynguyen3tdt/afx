import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountType } from 'src/app/core/model/report-response.model';
import { passwordValidation } from 'src/app/core/helper/custom-validate.helper';
import { LOCALE, FONTSIZE_AFX } from 'src/app/core/constant/authen-constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { TranslateService } from '@ngx-translate/core';
import { AuthenService } from 'src/app/core/services/authen.service';
import { UserService } from 'src/app/core/services/user.service';
import { take } from 'rxjs/operators';
import { ResetPasswordParam } from 'src/app/core/model/user.model';
import { MailFlagModel } from 'src/app/core/model/mail-flag.model';
declare var $: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  settingForm: FormGroup;
  countries = ['Vietnamese', 'English'];
  language: string;
  listTradingAccount: Array<AccountType>;
  accountID: number;
  isSubmittedSetting: boolean;
  errorMessage: boolean;
  invalidPassword: boolean;
  successPassword: boolean;
  mailFlag: MailFlagModel;

  constructor(private spinnerService: Ng4LoadingSpinnerService,
              private translate: TranslateService,
              private userService: UserService,
              private authenService: AuthenService) { }

  ngOnInit() {
    this.initSettingForm();
    this.openSetting();
    this.getMailFlag();
  }

  initSettingForm() {
    this.settingForm = new FormGroup({
      current_password: new FormControl('', [passwordValidation]),
      new_password: new FormControl('', [passwordValidation]),
      confirm_password: new FormControl('', [passwordValidation]),
      language: new FormControl(),
      marginCallMail: new FormControl(false),
      lossCutMail: new FormControl(false)
    });
    this.settingForm.controls.language.setValue(localStorage.getItem(LOCALE));
  }

  getMailFlag() {
    this.spinnerService.show();
    this.authenService.getMailFlag().subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.mailFlag = response.data;
        this.settingForm.controls.marginCallMail.setValue(this.mailFlag.margincall_email_flg);
        this.settingForm.controls.lossCutMail.setValue(this.mailFlag.losscut_email_flg);
      }
    });
  }

  changeLang(language) {
    this.translate.use(language);
    localStorage.setItem(LOCALE, language);
    const param = {
      lang: language
    };
    this.userService.changeLanguage(param).pipe(take(1)).subscribe();
  }

  settingSave() {
    this.isSubmittedSetting = true;
    this.successPassword = false;
    this.invalidPassword = false;
    if (this.settingForm.invalid) {
      this.errorMessage = false;
      return;
    }
    if (this.settingForm.controls.new_password.value !== this.settingForm.controls.confirm_password.value) {
      return;
    }
    if (this.settingForm.controls.current_password.value === this.settingForm.controls.confirm_password.value
      && this.settingForm.controls.new_password.value === this.settingForm.controls.confirm_password.value) {
      return;
    }
    const param: ResetPasswordParam = {
      new_password: this.settingForm.controls.confirm_password.value,
      old_password: this.settingForm.controls.current_password.value,
    };
    this.spinnerService.show();
    this.authenService.changePassword(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.successPassword = true;
        this.initSettingForm();
        this.isSubmittedSetting = false;
        this.invalidPassword = false;
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

  changeMailFlag() {
    const param: MailFlagModel = {
      losscut_email_flg: this.settingForm.controls.lossCutMail.value,
      margincall_email_flg: this.settingForm.controls.marginCallMail.value
    };
    this.spinnerService.show();
    this.authenService.updateMailFlag(param).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.mailFlag = response.data;
      }
      this.settingForm.controls.marginCallMail.setValue(this.mailFlag.margincall_email_flg);
      this.settingForm.controls.lossCutMail.setValue(this.mailFlag.losscut_email_flg);
    });
  }
}
