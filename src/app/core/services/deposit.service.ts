import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import {DepositResponse, BillingSystemResponse} from '../model/deposit-response.model';



@Injectable({
  providedIn: 'root'
})
export class DepositService {

  constructor(private httpClient: HttpClient,
              private envConfigService: EnvConfigService) {}

  getDepositBank(): Observable<DepositResponse> {
    return this.httpClient.get(`${this.envConfigService.getConfig()}/${AppSettings.API_DEPOSIT_BANK_TRANFER}`)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return new Observable((observer: InnerSubscriber<any, any>) => {
              observer.next(error);
            });
          })
        );
  }
  billingSystem(param): Observable<BillingSystemResponse> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_DEPOSIT_BIILING}`,
        param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getBankCompany(): Observable<DepositResponse> {
    return this.httpClient.get(`${this.envConfigService.getConfig()}/${AppSettings.API_BANK_COMPANY}`)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return new Observable((observer: InnerSubscriber<any, any>) => {
              observer.next(error);
            });
          })
        );
  }
}
