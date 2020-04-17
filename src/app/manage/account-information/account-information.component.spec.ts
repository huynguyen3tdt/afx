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

describe('AccountInformationComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountInformationComponent,
        UserInforComponent,
        CorporateInfoComponent,
        ConvertFinancialPipe,
        ConvertInvestmentPurposePipe
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
