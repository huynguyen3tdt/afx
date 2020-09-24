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
  TransactionModel,
  TransferModel,
  TransferResponseModel,
  TransferResulteModel,
  ListTransferResponseModel,
  Mt5Model
} from '../model/withdraw-request-response.model';
import { ResponseWihtoutDataModel } from '../model/none-data-response.model';
import * as moment from 'moment';
import { LOCALE } from '../constant/authen-constant';
import { LANGUAGLE } from '../constant/language-constant';
import { DATE_CLIENT_ENG, DATE_CLIENT_ENG_SUBMIT } from '../constant/format-date-constant';
import { AccountType } from '../model/report-response.model';
import { forkJoin } from 'rxjs';


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

  // getListMt5Info(listAccount: Array<AccountType>): Observable<Array<Mt5Model>> {
  //   const listMT5: any [] = [];
  //   // const result;
  //   let listMt5Info: Array<WithdrawRequestModel>;
  //   listAccount.forEach((item) => {
  //     listMT5.push(this.getmt5Infor(Number(item.account_id)));
  //   });
  //   forkJoin (
  //     listMT5
  //   ).subscribe((result) => {
  //     console.log('aaaaaaa ', result);
  //     listMt5Info = result;
  //   });
  //   return listMt5Info;
  // }

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

  getDwAmount(accountId: number): Observable<WithdrawAmountResponse> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_DW_AMOUNT}` + `?account_id=${accountId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  postWithdraw(param): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_POST_WITHDRAW}`, param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getDwHistory(accountNumber: string, pageSize: number, pageNumber: number,
               type?: string, dateFrom?: string, dateTo?: string, statusSearch?: string): Observable<WithdrawHistory> {
    let URL = '';
    const locale = localStorage.getItem(LOCALE);
    if (type) {
      URL = `?account_id=${accountNumber}&type=${type}&page_size=${pageSize}&page=${pageNumber}`;
    } else {
      URL = `?account_id=${accountNumber}&page_size=${pageSize}&page=${pageNumber}`;
    }
    if (dateFrom && dateFrom !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateFrom = moment(dateFrom, DATE_CLIENT_ENG).format(DATE_CLIENT_ENG_SUBMIT);
      }
      URL += `&date_from=${dateFrom}`;
    }
    if (dateTo && dateTo !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateTo = moment(dateTo, DATE_CLIENT_ENG).format(DATE_CLIENT_ENG_SUBMIT);
      }
      URL += `&date_to=${dateTo}`;
    }
    if (statusSearch) {
      URL += `&status=${statusSearch}`;
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

  exportHistoryToCsv(accountNumber: string, type?: string,
                     dateFrom?: string, dateTo?: string, statusSearch?: string): Observable<ArrayBuffer> {
    let URL = '';
    const locale = localStorage.getItem(LOCALE);
    if (type) {
      URL = `?account_id=${accountNumber}&type=${type}`;
    } else {
      URL = `?account_id=${accountNumber}`;
    }
    if (dateFrom && dateFrom !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateFrom = moment(dateFrom, DATE_CLIENT_ENG).format(DATE_CLIENT_ENG_SUBMIT);
      }
      URL += `&date_from=${dateFrom}`;
    }
    if (dateTo && dateTo !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateTo = moment(dateTo, DATE_CLIENT_ENG).format(DATE_CLIENT_ENG_SUBMIT);
      }
      URL += `&date_to=${dateTo}`;
    }
    if (statusSearch) {
      URL += `&status=${statusSearch}`;
    }
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_EXPORT_CSV}` + URL, { responseType: 'arraybuffer' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  postTransfer(param: TransferModel): Observable<TransferResponseModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_INTERNAL_TRANSFER}`, param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getDetailTransferTranHistory(transferId: number): Observable<TransferResponseModel> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_GET_INTERNAL_HISTORY}${transferId}/`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getInternalHistory(accountNumber: string, pageSize: number, pageNumber: number,
                     dateFrom?: string, dateTo?: string, statusSearch?: string): Observable<ListTransferResponseModel> {
    let URL = '';
    const locale = localStorage.getItem(LOCALE);
    URL = `?account_id=${accountNumber}&page_size=${pageSize}&page=${pageNumber}`;
    if (dateFrom && dateFrom !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateFrom = moment(dateFrom, DATE_CLIENT_ENG).format(DATE_CLIENT_ENG_SUBMIT);
      }
      URL += `&date_from=${dateFrom}`;
    }
    if (dateTo && dateTo !== 'Invalid date') {
      if (locale === LANGUAGLE.english) {
        dateTo = moment(dateTo, DATE_CLIENT_ENG).format(DATE_CLIENT_ENG_SUBMIT);
      }
      URL += `&date_to=${dateTo}`;
    }
    if (statusSearch) {
      URL += `&status=${statusSearch}`;
    }
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_GET_INTERNAL_HISTORY}` + URL)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
}
