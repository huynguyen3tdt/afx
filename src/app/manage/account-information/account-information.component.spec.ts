import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInformationComponent } from './account-information.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { UserInforComponent } from '../user-infor/user-infor.component';
import { CorporateInfoComponent } from '../corporate-info/corporate-info.component';
import { ConvertFinancialPipe } from 'src/app/core/pipe/convert-financial.pipe';
import { ConvertInvestmentPurposePipe } from 'src/app/core/pipe/convert-purposeInvest.pipe';
import { Mt5InfoComponent } from '../mt5-info/mt5-info.component';
import { BankInfoComponent } from '../bank-info/bank-info.component';
import { SettingComponent } from '../setting/setting.component';
import { ConvertAccountTypeBankPipe } from 'src/app/core/pipe/convert-account-type-bank.pipe';

describe('AccountInformationComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountInformationComponent,
        UserInforComponent,
        CorporateInfoComponent,
        Mt5InfoComponent,
        BankInfoComponent,
        SettingComponent,
        ConvertFinancialPipe,
        ConvertInvestmentPurposePipe,
        ConvertAccountTypeBankPipe
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        Ng4LoadingSpinnerModule,
        FormsModule,
        RouterTestingModule,
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
