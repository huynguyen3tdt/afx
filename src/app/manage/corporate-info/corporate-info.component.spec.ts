import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateInfoComponent } from './corporate-info.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ConvertFinancialPipe } from 'src/app/core/pipe/convert-financial.pipe';
import { ConvertInvestmentPurposePipe } from 'src/app/core/pipe/convert-purposeInvest.pipe';

describe('CorporateInfoComponent', () => {
  let component: CorporateInfoComponent;
  let fixture: ComponentFixture<CorporateInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateInfoComponent,
         ConvertFinancialPipe,
         ConvertInvestmentPurposePipe ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot()
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
