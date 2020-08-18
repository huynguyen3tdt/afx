import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import * as moment from 'moment';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LOCALE } from 'src/app/core/constant/authen-constant';
import { EN_FORMATDATE, JAPAN_FORMATDATE} from 'src/app/core/constant/format-date-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { defineLocale, jaLocale } from 'ngx-bootstrap/chronos';
import { take } from 'rxjs/operators';
import { BsLocaleService, BsDatepickerDirective } from 'ngx-bootstrap';
import { ForgotPasswordParam } from 'src/app/core/model/user.model';
import { Title } from '@angular/platform-browser';
declare var $: any;
defineLocale('ja', jaLocale);

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('loginid', { static: true }) loginid: ElementRef;
  @ViewChild('dp', {static: true}) picker: BsDatepickerDirective;
  forgotPasswordForm: FormGroup;
  isSubmitted: boolean;
  successMess = '';
  errSubmit: boolean;
  time: number;
  interval;
  showInterval: boolean;
  locale: string;
  formatDateYear: string;
  isSending: boolean;

  constructor(
    private authenService: AuthenService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private localeService: BsLocaleService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.isSending = false;
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      $('body').removeClass('jp');
      this.localeService.use('en');
    } else if (this.locale === LANGUAGLE.japan) {
      this.localeService.use('ja');
      $('body').addClass('jp');
    }
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateYear = EN_FORMATDATE;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateYear = JAPAN_FORMATDATE;
    }
    this.showInterval = false;
    this.initForgotPasswordForm();
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(param => {
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
    if (this.isSending === true) {
      return;
    }
    this.isSending = true;
    const param: ForgotPasswordParam = {
      login_id: this.forgotPasswordForm.controls.email.value,
      dob: moment(this.forgotPasswordForm.controls.dateInput.value).format('YYYY-MM-DD'),
      wl_code: '10'
    };

    this.time = 5;
    this.spinnerService.show();
    this.authenService.forgotPassWord(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.showInterval = true;
        this.errSubmit = false;
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
      } else {
        this.isSending = false;
        if (response.meta.code === 104) {
          this.errSubmit = true;
        }
      }
    });
  }

  onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
      const { cell, isHovered } = hoverEvent;

      if ((isHovered &&
        !!navigator.platform &&
        /iPad|iPhone|iPod/.test(navigator.platform)) &&
        'ontouchstart' in window
      ) {
        (this.picker as any)._datepickerRef.instance.daySelectHandler(cell);
      }

      return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
