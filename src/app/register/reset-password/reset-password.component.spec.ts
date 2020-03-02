import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NotificationsComponent} from '../../manage/notifications/notifications.component';
import {HttpClientModule} from '@angular/common/http';
import {PaginationModule} from 'ngx-bootstrap';
import {AuthenService} from '../../core/services/authen.service';
import {EnvConfigService} from '../../core/services/env-config.service';
import {Router} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  const router = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot()
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
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
