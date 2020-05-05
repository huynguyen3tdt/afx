import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PaginationModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from 'src/app/core/pipe/safePipe.pipe';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsComponent, SafePipe],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        PaginationModule.forRoot(),
        Ng4LoadingSpinnerModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [NotificationsService, EnvConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
