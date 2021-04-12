import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApiKeyComponent } from './modal-api-key.component';

describe('ModalApiKeyComponent', () => {
  let component: ModalApiKeyComponent;
  let fixture: ComponentFixture<ModalApiKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApiKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApiKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
