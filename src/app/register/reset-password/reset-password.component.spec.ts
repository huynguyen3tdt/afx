import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NotificationsComponent} from '../../manage/notifications/notifications.component';
import {HttpClientModule} from '@angular/common/http';
import {PaginationModule} from 'ngx-bootstrap';
import {AuthenService} from '../../core/services/authen.service';
import {EnvConfigService} from '../../core/services/env-config.service';
import {Router, RouterModule} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        AuthenService,
        EnvConfigService,
        BsLocaleService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
