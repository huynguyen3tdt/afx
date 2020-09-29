import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCanNotAddAccountComponent } from './modal-can-not-add-account.component';

describe('ModalCanNotAddAccountComponent', () => {
  let component: ModalCanNotAddAccountComponent;
  let fixture: ComponentFixture<ModalCanNotAddAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCanNotAddAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCanNotAddAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
