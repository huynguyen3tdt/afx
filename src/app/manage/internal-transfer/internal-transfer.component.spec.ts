import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalTransferComponent } from './internal-transfer.component';

describe('InternalTranferComponent', () => {
  let component: InternalTransferComponent;
  let fixture: ComponentFixture<InternalTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
