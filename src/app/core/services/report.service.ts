import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import { ReportResponseModel, ReportChangeResponseModel } from '../model/report-response.model';
import { LOCALE } from '../constant/authen-constant';
import * as moment from 'moment';
import { LANGUAGLE } from '../constant/language-constant';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient,
              private envConfigService: EnvConfigService) { }

  getReport(accountNumber: number, pageSize: number, pageNumber: number,
            type?: string, dateFrom?: string, dateTo?: string): Observable<ReportResponseModel> {
    let URL = '';
    const locale = localStorage.getItem(LOCALE);
    if (type) {
      URL = `?account_numb=${accountNumber}&type_report=${type}&page_size=${pageSize}&page=${pageNumber}`;
    } else {
      URL = `?account_numb=${accountNumber}&page_size=${pageSize}&page=${pageNumber}`;
    }
    if (dateFrom && dateFrom !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateFrom = moment(new Date(dateFrom)).format('DD-MM-YYYY');
      }
      URL += `&date_from=${dateFrom}`;
    }
    if (dateTo && dateTo !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateTo = moment(new Date(dateTo)).format('DD-MM-YYYY');
      }
      URL += `&date_to=${dateTo}`;
    }
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_REPORT}` + URL)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
  downLoadReportFile(reportId: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.envConfigService.getConfig()}/${AppSettings.API_DOWNLOAD_REPORT_FILE}?report_id=${reportId}`,
        { responseType: 'arraybuffer' }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  changeReadStatus(param): Observable<ReportChangeResponseModel> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_REPORT_STATUS}`,
        param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
}

