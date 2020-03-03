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
  WithdrawAmountResponse,
  TransactionModel
} from '../model/withdraw-request-response.model';


@Injectable({
  providedIn: 'root'
})
export class WithdrawRequestService {

  constructor(private httpClient: HttpClient,
              private envConfigService: EnvConfigService) { }

  getmt5Infor(accountId: number): Observable<WithdrawRequestModel> {
    let URL = '';
    URL = `?account_id=${accountId}`;
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_MT5_INFOR}` + URL)
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

  getDwHistory(accountNumber: number, pageSize: number, pageNumber: number,
               type?: number, dateFrom?: string, dateTo?: string): Observable<WithdrawHistory> {
    let URL = '';
    if (type !== -1) {
      URL = `?account_id=${accountNumber}&type=${type}&page_size=${pageSize}&page=${pageNumber}`;
    } else {
      URL = `?account_id=${accountNumber}&page_size=${pageSize}&page=${pageNumber}`;
    }
    if (dateFrom && dateFrom !== 'Invalid date') {
      URL += `&date_from=${dateFrom}`;
    }
    if (dateTo && dateTo !== 'Invalid date') {
      URL += `&date_to=${dateTo}`;
    }
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_WD_HISTORY}` + URL)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getDetailTranHistory(tranId: number): Observable<TransactionResponse> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_WD_HISTORY}${tranId}/`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
}
