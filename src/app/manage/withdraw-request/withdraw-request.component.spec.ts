import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawRequestComponent } from './withdraw-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
        TranslateModule.forRoot()
      ],
      providers: [
        WithdrawRequestService,
        { provide: Router, useValue: router}
      ],
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
