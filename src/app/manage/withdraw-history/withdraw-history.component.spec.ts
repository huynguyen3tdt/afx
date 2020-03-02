import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawHistoryComponent } from './withdraw-history.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';


describe('WithdrawHistoryComponent', () => {
  let component: WithdrawHistoryComponent;
  let fixture: ComponentFixture<WithdrawHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawHistoryComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        TranslateModule.forRoot()
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
