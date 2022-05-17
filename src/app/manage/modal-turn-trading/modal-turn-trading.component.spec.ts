import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTurnTradingComponent } from './modal-turn-trading.component';

describe('ModalTurnTradingComponent', () => {
  let component: ModalTurnTradingComponent;
  let fixture: ComponentFixture<ModalTurnTradingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTurnTradingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTurnTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
