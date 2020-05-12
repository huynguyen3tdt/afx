import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import {
  USERNAME_LOGIN,
  PASSWORD_LOGIN,
  REMEMBER_LOGIN,
  TOKEN_AFX,
  FIRST_LOGIN,
  IS_COMPANY,
  MIN_DEPOST,
  MIN_WITHDRAW,
  ACCOUNT_IDS,
  ACCOUNT_TYPE,
  LOCALE,
  FXNAME1,
  TIMEZONEAFX,
} from './../../core/constant/authen-constant';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from 'src/app/core/services/authen.service';
import { AccountType } from 'src/app/core/model/report-response.model';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: true }) username: ElementRef;
  @ViewChild('password', { static: true }) password: ElementRef;
  loginFormGroup: FormGroup;
  isSubmitted: boolean;
  isPc: boolean;
  invalidAccount: boolean;
  passWordExpired: boolean;
  hostNameRegis: string;

  constructor(
    private router: Router,
    private authenService: AuthenService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private spinnerService: Ng4LoadingSpinnerService,
    private envConfigService: EnvConfigService) {
  }

  ngOnInit() {
    this.login_layout();
    $(window).resize(() => {
      this.login_layout();
    });
    this.invalidAccount = false;
    this.checkDevice();
    this.initKeyboard();
    this.initLoginForm();
    this.hostNameRegis = this.envConfigService.getHostNameRegis();
  }

  ngAfterViewInit() {
    this.username.nativeElement.focus();
  }

  initLoginForm() {
    this.loginFormGroup = new FormGroup({
      userName: new FormControl('', requiredInput),
      passWord: new FormControl('', requiredInput),
      remember: new FormControl(false),
    });
    if (localStorage.getItem(REMEMBER_LOGIN) === 'false' || localStorage.getItem(REMEMBER_LOGIN) === null) {
      this.loginFormGroup.controls.remember.setValue(false);
      this.loginFormGroup.controls.userName.setValue('');
      this.loginFormGroup.controls.passWord.setValue('');
      this.activatedRoute.queryParams.subscribe(param => {
        if (param.loginId) {
          this.loginFormGroup.controls.userName.setValue(param.loginId);
        }
      });
    } else {
      this.loginFormGroup.controls.remember.setValue(true);
      if (this.checkUserNameAndPassWord(localStorage.getItem(USERNAME_LOGIN))) {
        this.loginFormGroup.controls.userName.setValue('');
      } else {
        this.loginFormGroup.controls.userName.setValue(atob(localStorage.getItem(USERNAME_LOGIN)));
      }
      if (this.checkUserNameAndPassWord(localStorage.getItem(PASSWORD_LOGIN))) {
        this.loginFormGroup.controls.passWord.setValue('');
      } else {
        this.loginFormGroup.controls.passWord.setValue(atob(localStorage.getItem(PASSWORD_LOGIN)));
      }
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    this.passWordExpired = false;
    this.invalidAccount = false;
    if (this.loginFormGroup.invalid) {
      return;
    }
    const param = {
      login_id: this.loginFormGroup.controls.userName.value,
      password: this.loginFormGroup.controls.passWord.value,
      device_type: this.isPc ? 'Pc' : 'Mobile'
    };
    this.spinnerService.show();
    this.authenService.login(param).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        localStorage.setItem(USERNAME_LOGIN, btoa(this.loginFormGroup.value.userName));
        localStorage.setItem(PASSWORD_LOGIN, btoa(this.loginFormGroup.value.passWord));
        if (this.loginFormGroup.value.remember === true) {
          localStorage.setItem(REMEMBER_LOGIN, 'true');
        } else {
          localStorage.setItem(REMEMBER_LOGIN, 'false');
        }
        response.data.account_ids = this.getListAccountIds(response.data.account_ids);
        localStorage.setItem(TOKEN_AFX, response.data.access_token);
        localStorage.setItem(ACCOUNT_IDS, JSON.stringify(response.data.account_ids));
        localStorage.setItem(IS_COMPANY, response.data.is_company.toString());
        if (response.data.module_funding_min_deposit) {
        localStorage.setItem(MIN_DEPOST, response.data.module_funding_min_deposit.toString());
        }
        if (response.data.module_funding_min_withdraw) {
          localStorage.setItem(MIN_WITHDRAW, response.data.module_funding_min_withdraw.toString());
        }
        if (response.data.fx_name1) {
          localStorage.setItem(FXNAME1, response.data.fx_name1);
        }
        if (response.data.tz) {
          localStorage.setItem(TIMEZONEAFX, response.data.tz);
        } else {
          localStorage.setItem(TIMEZONEAFX, 'Asia/Tokyo');
        }
        if (response.data.lang) {
          localStorage.setItem(LOCALE, response.data.lang);
          this.translate.use(response.data.lang);
        }
        localStorage.setItem(FIRST_LOGIN, '1');
        if (response.data.pwd_change_flg === false) {
          this.router.navigate(['/manage/notifications'], {
            queryParams: {
              fisrtLogin: true,
            }
          });
        } else {
          this.router.navigate(['/reset_password'], {
          });
        }
      } else if (response.meta.code === 102) {
        this.invalidAccount = true;
      } else if (response.meta.code === 101) {
        this.passWordExpired = true;
      }

    });
    $('.minimize-btn').click();
  }

  goToManage() {
    this.router.navigate(['/manage/notifications']);
  }

  changeToForgotPassWord() {
    this.router.navigate(['forgot_password'], {
      queryParams: {
        loginId: this.loginFormGroup.value.userName,
      }
    });
    $('.minimize-btn').click();
  }

  checkUserNameAndPassWord(loginParam) {
    if (loginParam === '' || loginParam === undefined || !loginParam) {
      return true;
    }
    return false;
  }

  getListAccountIds(data) {
    const listData = [];
    if (data) {
      // tslint:disable-next-line:no-shadowed-variable
      data.map((element: any) => {
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_FX.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_FX.name + '-' + element.account_id;
        }
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_CFDIndex.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_CFDIndex.name + '-' + element.account_id;
        }
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_CFDCom.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_CFDCom.name + '-' + element.account_id;
        }
        const dataObj: AccountType = {
          account_type: element.account_type,
          account_id: element.account_id,
          value : element.value,
          currency: element.currency
        };
        listData.push(dataObj);
      });
    }
    return listData;
  }

  checkDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.isPc = false;
    } else {
      this.isPc = true;
    }
  }

  openKeyboard() {
    $('#jq-keyboard').toggleClass('show');
  }

  login_layout() {
    const screenHeight = $(window).height();
    const cardLoginWidth = $('.card-login').width();
    $('.site-wrapper').css('min-height', screenHeight);
    $('.card-login').css('min-height', (cardLoginWidth / 2) + 25);
  }

  initKeyboard() {
    setTimeout(() => {
      $('.minimize-btn').click(() => {
        $('.btn-toggle-vkeyboard').toggleClass('active');
        $('#user-focus-btn').removeClass('active');
        $('#password-focus-btn').removeClass('active');
      });

      $('#user-focus-btn').click(() => {
        this.username.nativeElement.focus();
        $('#user-focus-btn').addClass('active');
        $('#password-focus-btn').removeClass('active');
      });

      $('#password-focus-btn').click(() => {
        this.password.nativeElement.focus();
        $('#password-focus-btn').addClass('active');
        $('#user-focus-btn').removeClass('active');
      });
    }, 100);
  }
}
