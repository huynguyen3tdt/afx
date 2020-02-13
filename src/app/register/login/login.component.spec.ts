import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { REMEMBER_LOGIN } from 'src/app/core/constant/authen-constant';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationsComponent } from 'src/app/manage/notifications/notifications.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { EnvConfigService } from 'src/app/core/services/env-config.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const router = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, NotificationsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          {path: 'manage/notifications', component: NotificationsComponent}
        ]),
        HttpClientModule
      ],
      providers: [
        AuthenService,
        EnvConfigService,
        { provide: Router, useValue: router}
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
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

  // it('userName and passWord equal should be blank when init form', () => {
  //   component.initLoginForm();
  //   expect(component.loginFormGroup.controls.userName.value).toEqual('');
  //   expect(component.loginFormGroup.controls.passWord.value).toEqual('');
  // });

  it('login should be called ', () => {
    component.loginFormGroup.controls.userName.setValue('hieunguyen@tamdongtamvn');
    component.loginFormGroup.controls.passWord.setValue('123456');
    component.loginFormGroup.controls.remember.setValue(true);
    const button = fixture.debugElement.query(By.css('#btnlogin')).nativeElement;
    // button.click();
    expect(component.loginFormGroup.invalid).toBeFalsy();
    // tslint:disable-next-line:prefer-const

  });

  it('login should go to forgot password ', () => {
    component.changeToForgotPassWord();
    expect(router.navigate).toHaveBeenCalledWith(['forgot_password']);
  });
});
