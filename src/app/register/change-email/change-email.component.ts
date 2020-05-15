import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from 'src/app/core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { take } from 'rxjs/operators';
import { ChangeEmail } from 'src/app/core/model/user.model';

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
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authenService: AuthenService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.passWordType = 'password';
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(res => {
      if (res.token) {
        this.token = res.token;
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

  onSubmit() {
    const param: ChangeEmail = {
      password: this.changeEmailForm.controls.password.value,
      token: this.token
    };
    this.spinnerService.show();
    this.authenService.changeEmail(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.router.navigate(['/login']);
      } else if (response.meta.code === 400) {
        this.invalidPassWord = true;
      } else if (response.meta.code === 409) {
        this.invalidEmail = true;
      }
    });
  }

}
