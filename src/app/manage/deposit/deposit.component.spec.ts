import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositComponent } from './deposit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ReportListComponent} from '../report-list/report-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
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
