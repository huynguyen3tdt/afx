import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInfoComponent } from './bank-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { RouterTestingModule } from '@angular/router/testing';

describe('BankInfoComponent', () => {
  let component: BankInfoComponent;
  let fixture: ComponentFixture<BankInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankInfoComponent ],
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
    fixture = TestBed.createComponent(BankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
