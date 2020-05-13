import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, AbstractControl} from '@angular/forms';
import {AuthenService} from '../../core/services/authen.service';
import {Router, ActivatedRoute} from '@angular/router';
import { PASSWORD_LOGIN, LOCALE } from 'src/app/core/constant/authen-constant';
import { passwordValidation, requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { defineLocale, jaLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
declare var $: any;
defineLocale('ja', jaLocale);

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
  constructor(private authenService: AuthenService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private localeService: BsLocaleService) { }

  ngOnInit() {
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      $('body').removeClass('jp');
      this.localeService.use('en');
    } else if (this.locale === LANGUAGLE.japan) {
      this.localeService.use('ja');
      $('body').addClass('jp');
    }
    this.oldPassword = atob(localStorage.getItem(PASSWORD_LOGIN));
    this.initResetPassForm();
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(res => {
      if (res.token) {
        this.token = res.token;
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
    let paramSubmit;
    const param = {
      new_password: this.resetPassForm.controls.confirm_password.value,
      old_password: this.oldPassword
    };
    const paramToken = {
      new_password: this.resetPassForm.controls.confirm_password.value,
      token: this.token
    };
    if (this.token) {
      paramSubmit = paramToken;
      this.authenService.resetPassword(paramSubmit).pipe(take(1)).subscribe(response => {
        if (response.meta.code === 200) {
          this.router.navigate(['/login']);
        } else if (response.meta.code === 103) {
          this.errorMess = response.meta.message;
        }
      });
    } else {
      paramSubmit = param;
      this.authenService.changePassword(paramSubmit).pipe(take(1)).subscribe(response => {
        if (response.meta.code === 200) {
          this.router.navigate(['/login']);
        } else if (response.meta.code === 103) {
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
