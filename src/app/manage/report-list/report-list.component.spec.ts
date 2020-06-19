import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListComponent } from './report-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaginationModule, BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvConfigService } from 'src/app/core/services/env-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportListComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        PaginationModule.forRoot(),
        Ng4LoadingSpinnerModule,
        RouterTestingModule,
        BsDatepickerModule.forRoot(),
        TranslateModule.forRoot(),
        PdfJsViewerModule,
        ModalModule.forRoot(),
      ],
      providers: [ReportListComponent, EnvConfigService]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
