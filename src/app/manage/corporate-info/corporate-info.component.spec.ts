import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateInfoComponent } from './corporate-info.component';

describe('CorporateInfoComponent', () => {
  let component: CorporateInfoComponent;
  let fixture: ComponentFixture<CorporateInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
