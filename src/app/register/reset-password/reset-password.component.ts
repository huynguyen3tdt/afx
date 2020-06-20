import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, AbstractControl} from '@angular/forms';
import {AuthenService} from '../../core/services/authen.service';
import {Router, ActivatedRoute} from '@angular/router';
import { PASSWORD_LOGIN,
   LOCALE,
   TIMEOUT_TOAST,
   TOKEN_EXPIRED_EN,
   TYPE_ERROR_TOAST_EN,
   TOKEN_EXPIRED_JP,
   TYPE_ERROR_TOAST_JP,
   TYPE_SUCCESS_TOAST_EN,
   TYPE_SUCCESS_TOAST_JP,
   CHANGE_PASS_FLG} from 'src/app/core/constant/authen-constant';
import { passwordValidation } from 'src/app/core/helper/custom-validate.helper';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { take } from 'rxjs/operators';
import { ResetPasswordParam, ResetPasswordWithTokenParam, CheckTokenParam } from 'src/app/core/model/user.model';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPassForm: FormGroup;
  isSubmitted: boolean;
  erroMessage: boolean;
  showPassword: boolean;
  showTypePass = 'password';
  showTypeConfirmPass = 'password';
  errorMess = '';
  oldPassword: string;
  token: string;
  locale: string;
  showScreen: boolean;
  isSending: boolean;
  constructor(private authenService: AuthenService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastrService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.isSending = false;
    this.oldPassword = atob(localStorage.getItem(PASSWORD_LOGIN));
    this.initResetPassForm();
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(res => {
      if (res.token) {
        this.showScreen = false;
        this.token = res.token;
        this.checkToken();
      } else {
        this.showScreen = true;
      }
    });
  }
  initResetPassForm() {
    this.resetPassForm = new FormGroup({
      new_password: new FormControl('', [passwordValidation]),
      confirm_password: new FormControl('', [passwordValidation])
    });
  }

  changeConfirmPassWord() {
    if (this.resetPassForm.controls.new_password.value === this.resetPassForm.controls.confirm_password.value) {
      this.erroMessage = false;
    } else {
      this.erroMessage = true;
      return;
    }
  }

  checkToken() {
    const locale = localStorage.getItem(LOCALE);
    let messageErr;
    let typeErr;
    if (locale === LANGUAGLE.english) {
      messageErr = TOKEN_EXPIRED_EN;
      typeErr = TYPE_ERROR_TOAST_EN;
    } else {
      messageErr = TOKEN_EXPIRED_JP;
      typeErr = TYPE_ERROR_TOAST_JP;
    }
    const param: CheckTokenParam = {
      token: this.token
    };
    this.spinnerService.show();
    this.authenService.checkTokenPassWord(param).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.showScreen = true;
      } else {
        this.toastr.error(messageErr, typeErr, {
          timeOut: TIMEOUT_TOAST
        });
        this.router.navigate(['/forgot_password']);
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.erroMessage = false;
    if (this.resetPassForm.invalid) {
      this.erroMessage = false;
      return;
    }
    if (this.resetPassForm.controls.new_password.value === this.resetPassForm.controls.confirm_password.value) {
      this.erroMessage = false;
    } else {
      this.erroMessage = true;
      return;
    }
    if (this.isSending === true) {
      return;
    }
    this.isSending = true;
    const locale = localStorage.getItem(LOCALE);
    let paramSubmit;
    let messageSuccess;
    let typeSuccess;
    const param: ResetPasswordParam = {
      new_password: this.resetPassForm.controls.confirm_password.value,
      old_password: this.oldPassword
    };
    const paramToken: ResetPasswordWithTokenParam = {
      new_password: this.resetPassForm.controls.confirm_password.value,
      token: this.token
    };
    if (locale === LANGUAGLE.english) {
      messageSuccess = 'You have successfully changed the password';
      typeSuccess = TYPE_SUCCESS_TOAST_EN;
    } else {
      messageSuccess = 'パスワードを変更しました';
      typeSuccess = TYPE_SUCCESS_TOAST_JP;
    }
    if (this.token) {
      paramSubmit = paramToken;
      this.spinnerService.show();
      this.authenService.resetPassword(paramSubmit).pipe(take(1)).subscribe(response => {
        this.spinnerService.hide();
        if (response.meta.code === 200) {
          this.router.navigate(['/login']);
          this.toastr.success(messageSuccess, typeSuccess, {
            timeOut: TIMEOUT_TOAST
          });
        } else if (response.meta.code === 103) {
          this.isSending = false;
          this.errorMess = response.meta.message;
        }
      });
    } else {
      paramSubmit = param;
      this.spinnerService.show();
      this.authenService.changePassword(paramSubmit).pipe(take(1)).subscribe(response => {
        this.spinnerService.hide();
        if (response.meta.code === 200) {
          localStorage.setItem(CHANGE_PASS_FLG, 'false');
          this.router.navigate(['/login']);
          this.toastr.success(messageSuccess, typeSuccess, {
            timeOut: TIMEOUT_TOAST
          });
        } else if (response.meta.code === 103) {
          this.isSending = false;
          this.errorMess = response.meta.message;
        }
      });
    }
  }

  showPass() {
    if (this.showTypePass === 'password') {
      this.showTypePass = 'text';
      return;
    }
    if (this.showTypePass === 'text') {
      this.showTypePass = 'password';
      return;
    }

  }

  showConfirmPass() {
    if (this.showTypeConfirmPass === 'password') {
      this.showTypeConfirmPass = 'text';
      return;
    }
    if (this.showTypeConfirmPass === 'text') {
      this.showTypeConfirmPass = 'password';
      return;
    }
  }
}
