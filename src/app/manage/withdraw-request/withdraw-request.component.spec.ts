import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawRequestComponent } from './withdraw-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';

describe('WithdrawRequestComponent', () => {
  let component: WithdrawRequestComponent;
  let fixture: ComponentFixture<WithdrawRequestComponent>;
  const router = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawRequestComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot(),
        Ng4LoadingSpinnerModule,
        ModalModule.forRoot(),
      ],
      providers: [
        WithdrawRequestService,
        { provide: Router, useValue: router}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
