import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { take } from 'rxjs/operators';
import { ChangeEmail, CheckTokenParam } from 'src/app/core/model/user.model';
import {
  LOCALE,
  TOKEN_EXPIRED_EN,
  TYPE_ERROR_TOAST_EN,
  TOKEN_EXPIRED_JP,
  TYPE_ERROR_TOAST_JP,
  TIMEOUT_TOAST,
  TYPE_SUCCESS_TOAST_EN,
  TYPE_SUCCESS_TOAST_JP
} from 'src/app/core/constant/authen-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm: FormGroup;
  token: string;
  isSubmitted: boolean;
  invalidPassWord: boolean;
  invalidEmail: boolean;
  passWordType: string;
  showScreen: boolean;
  locale: string;
  isSending: boolean;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authenService: AuthenService,
              private spinnerService: Ng4LoadingSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.isSending = false;
    this.passWordType = 'password';
    this.locale = localStorage.getItem(LOCALE);
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(res => {
      if (res.token) {
        this.showScreen = false;
        this.token = res.token;
        this.checkToken();
      } else {
        this.showScreen = true;
      }
    });
    this.initChangeEmailForm();
  }

  initChangeEmailForm() {
    this.changeEmailForm = new FormGroup({
      password: new FormControl('', [requiredInput])
    });
  }

  showPassWord() {
    if (this.passWordType === 'password') {
      this.passWordType = 'text';
      return;
    }
    if (this.passWordType === 'text') {
      this.passWordType = 'password';
      return;
    }
  }

  checkToken() {
    let messageErr;
    let typeErr;
    if (this.locale === LANGUAGLE.english) {
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
    this.authenService.checkTokenEmail(param).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.showScreen = true;
      } else {
        this.toastr.error(messageErr, typeErr, {
          timeOut: TIMEOUT_TOAST
        });
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    let messageSuccess;
    let typeSuccess;
    if (this.locale === LANGUAGLE.english) {
      messageSuccess = 'Your email address has been updated successfully';
      typeSuccess = TYPE_SUCCESS_TOAST_EN;
    } else {
      messageSuccess = 'メールアドレスの更新が完了しました。';
      typeSuccess = TYPE_SUCCESS_TOAST_JP;
    }
    if (this.isSending === true) {
      return;
    }
    this.isSending = true;
    const param: ChangeEmail = {
      password: this.changeEmailForm.controls.password.value,
      token: this.token
    };
    this.spinnerService.show();
    this.authenService.changeEmail(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.router.navigate(['/login']);
        this.toastr.success(messageSuccess, typeSuccess, {
          timeOut: TIMEOUT_TOAST
        });
      } else if (response.meta.code === 400) {
        this.isSending = false;
        this.invalidPassWord = true;
      } else if (response.meta.code === 409) {
        this.isSending = false;
        this.invalidEmail = true;
      }
    });
  }

}
