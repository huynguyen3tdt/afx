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

  getReport(pageSize: number, pageNumber: number, type?: number): Observable<ReportResponseModel> {
    let URL = '';
    if (type !== -1) {
      URL = `?type=${type}&page_size=${pageSize}?page_numb=${pageNumber}`;
    } else {
      URL = `?page_size=${pageSize}?page_numb=${pageNumber}`;
    }
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_REPORT}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
}
