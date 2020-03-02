import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositComponent } from './deposit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ReportListComponent} from '../report-list/report-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [DepositComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
