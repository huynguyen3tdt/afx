import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddAccountStep3Component } from './modal-add-account-step3.component';

describe('ModalAddAccountStep3Component', () => {
  let component: ModalAddAccountStep3Component;
  let fixture: ComponentFixture<ModalAddAccountStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddAccountStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddAccountStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
