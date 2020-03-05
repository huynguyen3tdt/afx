import { DepositComponent } from './deposit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

describe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        Ng4LoadingSpinnerModule,
      ],
      providers: [DepositComponent, EnvConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
