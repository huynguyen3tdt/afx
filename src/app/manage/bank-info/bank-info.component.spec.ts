import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInfoComponent } from './bank-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { ConvertAccountTypeBankPipe } from 'src/app/core/pipe/convert-account-type-bank.pipe';
import { ModalModule } from 'ngx-bootstrap';

describe('BankInfoComponent', () => {
  let component: BankInfoComponent;
  let fixture: ComponentFixture<BankInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BankInfoComponent,
        ConvertAccountTypeBankPipe
       ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        Ng4LoadingSpinnerModule,
        FormsModule,
        ModalModule.forRoot(),
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
