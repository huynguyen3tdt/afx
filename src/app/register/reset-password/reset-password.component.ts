import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {requiredInput} from '../../core/helper/custom-validate.helper';
import {Validators} from '@angular/forms';
import {AuthenService} from '../../core/services/authen.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPassForm: FormGroup;
  isSave = false;
  isShow = false;
  erroMessage = '';
  showPassword = false;
  showTypePass = 'password';
  showTypeConfirmPass = 'password';

  constructor(private authenService: AuthenService,
              private router: Router) { }

  ngOnInit() {
    this.initResetPassForm();
  }
  initResetPassForm() {
    this.resetPassForm = new FormGroup({
      new_password: new FormControl('', requiredInput),
      confirm_password: new FormControl('', requiredInput)
    });
  }
  onSubmit() {
    this.isSave = true;
    if (this.resetPassForm.invalid) {
      this.isShow = false;
      return;
    }
    if (this.resetPassForm.controls.new_password.value === this.resetPassForm.controls.confirm_password.value) {
      this.isShow = true;
    } else {
      this.isShow = false;
      this.erroMessage = 'Password is not the same';
      return;
    }
    const param = {
      password: this.resetPassForm.controls.confirm_password.value,
    };
    this.authenService.changePassword(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.router.navigate(['/login']);
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
