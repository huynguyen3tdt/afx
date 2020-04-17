import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInforComponent } from './user-infor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ConvertFinancialPipe } from 'src/app/core/pipe/convert-financial.pipe';
import { ConvertInvestmentPurposePipe } from 'src/app/core/pipe/convert-purposeInvest.pipe';

describe('UserInforComponent', () => {
  let component: UserInforComponent;
  let fixture: ComponentFixture<UserInforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInforComponent,
        ConvertFinancialPipe,
        ConvertInvestmentPurposePipe ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot()
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
