import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDepositWithdrawComponent } from './modal-deposit-withdraw.component';
import { ModalModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

describe('ModalDepositWithdrawComponent', () => {
  let component: ModalDepositWithdrawComponent;
  let fixture: ComponentFixture<ModalDepositWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDepositWithdrawComponent ],
      imports: [
        ModalModule.forRoot(),
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDepositWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
