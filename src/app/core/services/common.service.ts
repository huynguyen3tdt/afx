import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient: HttpClient,
              private envConfigService: EnvConfigService) { }

  getExample(): Observable<any> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_EXAMPLE}/`,
        { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
  putExample(params: any, id): Observable<any> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_EXAMPLE}${id}/`,
        params, { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
  deleteExample(id: any): Observable<any> {
    return this.httpClient
      .delete(`${this.envConfigService.getConfig()}/${AppSettings.API_EXAMPLE}${id}/`, { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
  postExample(params: any): Observable<any> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_EXAMPLE}/`, params, { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

}


