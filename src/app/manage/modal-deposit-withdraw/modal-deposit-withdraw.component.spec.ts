import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDepositWithdrawComponent } from './modal-deposit-withdraw.component';

describe('ModalDepositWithdrawComponent', () => {
  let component: ModalDepositWithdrawComponent;
  let fixture: ComponentFixture<ModalDepositWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDepositWithdrawComponent ]
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
