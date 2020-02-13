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
export class WithdrawRequestService {

  constructor(private httpClient: HttpClient,
              private envConfigService: EnvConfigService) { }

  getmt5Infor(): Observable<any> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_MT5_INFOR}/`,
        { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getBankInfor(): Observable<any> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_BANK_INFOR}/`,
        { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getDwAmount(): Observable<any> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_DW_AMOUNT}/`,
        { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  postWithdraw(params: any): Observable<any> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_WITHDRAW}/`, params, { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getDwHistory(): Observable<any> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_WD_HISTORY}/`,
        { observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
}
