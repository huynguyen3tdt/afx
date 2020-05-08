import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacstionModalComponent } from './transacstion-modal.component';
import { ModalModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

describe('TransacstionModalComponent', () => {
  let component: TransacstionModalComponent;
  let fixture: ComponentFixture<TransacstionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransacstionModalComponent ],
      imports: [
        ModalModule.forRoot(),
        TranslateModule.forRoot()
    ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransacstionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
