import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import * as moment from 'moment';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LOCALE } from 'src/app/core/constant/authen-constant';
import { EN_FORMATDATE, JAPAN_FORMATDATE} from 'src/app/core/constant/format-date-constant';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('loginid', { static: true }) loginid: ElementRef;

  forgotPasswordForm: FormGroup;
  isSubmitted: boolean;
  errorMess = '';
  successMess = '';
  errSubmit: boolean;
  time: number;
  interval;
  showInterval: boolean;
  locale: string;
  formatDateYear: string;

  constructor(
    private authenService: AuthenService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === 'en') {
      this.formatDateYear = EN_FORMATDATE;
    } else if (this.locale === 'jp') {
      this.formatDateYear = JAPAN_FORMATDATE;
    }
    this.showInterval = false;
    this.initForgotPasswordForm();
    this.activatedRoute.queryParams.subscribe(param => {
      if (param.loginId) {
        this.forgotPasswordForm.controls.email.setValue(param.loginId);
      }
    });
  }
  ngAfterViewInit() {
    this.loginid.nativeElement.focus();
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

    this.time = 5;
    this.spinnerService.show();
    this.authenService.forgotPassWord(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.showInterval = true;
        this.spinnerService.hide();
        this.errSubmit = false;
        this.successMess = '仮パスワードを登録メールアドレスにメール致しますので、ご確認ください。';
        this.interval = setInterval(() => {
          this.time = this.time - 1;
          if (this.time <= 0) {
            this.router.navigate(['login'], {
              queryParams: {
                loginId: this.forgotPasswordForm.value.email,
              }
            });
          }
        }, 1000);
      } else if (response.meta.code === 102) {
        this.spinnerService.hide();
        this.errSubmit = true;
        this.errorMess = 'Login ID and DOB is not matching';
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
