import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, AbstractControl} from '@angular/forms';
import {requiredInput} from '../../core/helper/custom-validate.helper';
import {Validators} from '@angular/forms';
import {AuthenService} from '../../core/services/authen.service';
import {Router} from '@angular/router';
import { PASSWORD_LOGIN } from 'src/app/core/constant/authen-constant';

const INVALID_PASSWORD = {
  Required: true,
  message: 'New password needs to be 8 characters or more and has at least 1 alphabet letter'
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPassForm: FormGroup;
  isSubmitted: boolean;
  // isShow = false;
  erroMessage: boolean;
  showPassword: boolean;
  showTypePass = 'password';
  showTypeConfirmPass = 'password';
  errorMess = '';
  oldPassword: string;
  constructor(private authenService: AuthenService,
              private router: Router) { }

  ngOnInit() {
    this.oldPassword = atob(localStorage.getItem(PASSWORD_LOGIN));
    console.log('111', this.oldPassword)
    this.initResetPassForm();
  }
  initResetPassForm() {
    this.resetPassForm = new FormGroup({
      new_password: new FormControl('', [requiredInput, this.passwordValidation]),
      confirm_password: new FormControl('', [requiredInput, this.passwordValidation])
    });
  }
  onSubmit() {
    this.isSubmitted = true;
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
    const param = {
      new_password: this.resetPassForm.controls.confirm_password.value,
      old_password: this.oldPassword
    };
    this.authenService.changePassword(param).subscribe(response => {
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
  passwordValidation(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
      return INVALID_PASSWORD;
    }
    if (control.value.search(/[a-zA-Z]/) < 0) {
      return INVALID_PASSWORD;
    } else if (control.value.search(/[0-9]/) < 0) {
      return INVALID_PASSWORD;
    } else if (control.value.length < 8) {
      return INVALID_PASSWORD;
    }
    return null;
  }
}
