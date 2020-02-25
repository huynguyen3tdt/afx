import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import * as moment from 'moment';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  isSubmitted: boolean;
  errorMess = '';
  successMess = '';
  errSubmit: boolean;

  constructor(private authenService: AuthenService, private router: Router) { }

  ngOnInit() {
    this.initForgotPasswordForm();
  }
  initForgotPasswordForm() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', requiredInput),
      dateInput: new FormControl('', requiredInput),
    });
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const param = {
      login_id: this.forgotPasswordForm.controls.email.value,
      dob : moment(this.forgotPasswordForm.controls.dateInput.value).format('YYYY-MM-DD')
    };

    this.authenService.forgotPassWord(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.errSubmit = true;
        this.successMess = '仮パスワードを登録メールアドレスにメール致しますので、ご確認ください。';
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 2000);
      } else {
        this.errSubmit = false;
        this.errorMess = 'Login ID and DOB is not matching';
      }
    });
  }
}
