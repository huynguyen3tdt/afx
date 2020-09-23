import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddAccountStep2Component } from './modal-add-account-step2.component';

describe('ModalAddAccountStep2Component', () => {
  let component: ModalAddAccountStep2Component;
  let fixture: ComponentFixture<ModalAddAccountStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddAccountStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddAccountStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
