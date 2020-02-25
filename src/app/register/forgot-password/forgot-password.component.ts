import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import * as moment from 'moment';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  isSubmitted: boolean;
  errorMess = '';

  constructor(
    private authenService: AuthenService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.initForgotPasswordForm();
    this.activatedRoute.queryParams.subscribe(param => {
      if (param.loginId) {
        this.forgotPasswordForm.controls.email.setValue(param.loginId);
      }
    });
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
      dob: moment(this.forgotPasswordForm.controls.dateInput.value).format('YYYY-MM-DD')
    };

    this.authenService.forgotPassWord(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.router.navigate(['login'], {
          queryParams: {
            loginId: this.forgotPasswordForm.value.email,
          }
        });
      } else if (response.meta.code === 102) {
        this.errorMess = response.meta.message;
      }
    });
  }
}
