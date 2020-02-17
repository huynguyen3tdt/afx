import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import {
  WithdrawRequestModel,
  WithdrawHistoryModel,
  TransactionResponse,
  WithdrawHistory,
  WithdrawAmountResponse
} from '../model/withdraw-request-response.model';


@Injectable({
  providedIn: 'root'
})
export class WithdrawRequestService {

  constructor(private httpClient: HttpClient,
              private envConfigService: EnvConfigService) { }

  getmt5Infor(): Observable<WithdrawRequestModel> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_MT5_INFOR}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getBankInfor(): Observable<WithdrawHistoryModel> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_BANK_INFOR}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getDwAmount(): Observable<WithdrawAmountResponse> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_DW_AMOUNT}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  postWithdraw(params: any): Observable<TransactionResponse> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_WITHDRAW}`, params)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getDwHistory(): Observable<WithdrawHistory> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_WD_HISTORY}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
}
