import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt5InfoComponent } from './mt5-info.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Mt5InfoComponent', () => {
  let component: Mt5InfoComponent;
  let fixture: ComponentFixture<Mt5InfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mt5InfoComponent ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        Ng4LoadingSpinnerModule,
        FormsModule,
        RouterTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mt5InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
