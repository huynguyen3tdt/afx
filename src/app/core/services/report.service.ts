import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import { ReportResponseModel } from '../model/report-response.model';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient,
              private envConfigService: EnvConfigService) { }

  getReport(accountNumber: number, pageSize: number, pageNumber: number,
            type?: number, dateFrom?: string, dateTo?: string): Observable<ReportResponseModel> {
    let URL = '';
    if (type !== -1) {
      URL = `?account_numb=${accountNumber}&type_report=${type}&page_size=${pageSize}&page=${pageNumber}`;
    } else {
      URL = `?account_numb=${accountNumber}&page_size=${pageSize}&page=${pageNumber}`;
    }
    if (dateFrom && dateFrom !== 'Invalid date') {
      URL += `&date_from=${dateFrom}`;
    }
    if (dateTo && dateTo !== 'Invalid date') {
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
}

