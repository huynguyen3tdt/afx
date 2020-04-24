import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, AbstractControl} from '@angular/forms';
import {AuthenService} from '../../core/services/authen.service';
import {Router, ActivatedRoute} from '@angular/router';
import { PASSWORD_LOGIN } from 'src/app/core/constant/authen-constant';
import { passwordValidation, requiredInput } from 'src/app/core/helper/custom-validate.helper';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
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
  constructor(private authenService: AuthenService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.oldPassword = atob(localStorage.getItem(PASSWORD_LOGIN));
    this.initResetPassForm();
    this.activatedRoute.queryParams.subscribe(res => {
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
      old_password: this.oldPassword
    };
    if (this.token) {
      paramSubmit = paramToken;
    } else {
      paramSubmit = param;
    }
    this.authenService.resetPassword(paramSubmit).subscribe(response => {
      if (response.meta.code === 200) {
        this.router.navigate(['/login']);
      } else if (response.meta.code === 103) {
        this.errorMess = response.meta.message;
      }
    });
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
