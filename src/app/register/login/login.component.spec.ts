import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { REMEMBER_LOGIN } from 'src/app/core/constant/authen-constant';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationsComponent } from 'src/app/manage/notifications/notifications.component';
import { Router, RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaginationModule } from 'ngx-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, NotificationsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
        PaginationModule
      ],
      providers: [
        AuthenService,
        EnvConfigService
      ],
    schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // loginSpy = loginServiceSpy.login.and.returnValue(Promise.resolve(testUserData));
    fixture.detectChanges();
  });

  it('LoginComponent should create', () => {
    expect(component).toBeTruthy();
  });

  it('isSubmitted should be false when init', () => {
    expect(component.isSubmitted).toBeFalsy();
  });

  it('isSubmitted should be true when submit', () => {
    component.onSubmit();
    expect(component.isSubmitted).toBeTruthy();
  });

  it('login should be called ', () => {
    component.loginFormGroup.controls.userName.setValue('hieunguyen@tamdongtamvn');
    component.loginFormGroup.controls.passWord.setValue('123456');
    component.loginFormGroup.controls.remember.setValue(true);
    const button = fixture.debugElement.query(By.css('#btnlogin')).nativeElement;
    // button.click();
    expect(component.loginFormGroup.invalid).toBeFalsy();
    // tslint:disable-next-line:prefer-const

  });
});
