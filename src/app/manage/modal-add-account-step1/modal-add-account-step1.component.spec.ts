import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddAccountStep1Component } from './modal-add-account-step1.component';


describe('ModalAddAccountComponent', () => {
  let component: ModalAddAccountStep1Component;
  let fixture: ComponentFixture<ModalAddAccountStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddAccountStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddAccountStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
