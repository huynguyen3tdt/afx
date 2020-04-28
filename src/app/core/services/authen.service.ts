import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import { LoginResponseModel } from '../model/login-response.model';
import { ResponseWihtoutDataModel } from '../model/none-data-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  constructor(
    private httpClient: HttpClient,
    private envConfigService: EnvConfigService) {}

  login(param): Observable<LoginResponseModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_LOGIN}`,
        param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  logout(): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_LOGOUT}`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  forgotPassWord(param): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_FORGOT_PASSWORD}`, param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  changePassword(param): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_CHANGE_PASSWORD}`, param)
      .pipe(
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: InnerSubscriber<any, any>) => {
          observer.next(error);
        });
      })
    );
  }

  resetPassword(param): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_RESET_PASSWORD}`, param)
      .pipe(
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: InnerSubscriber<any, any>) => {
          observer.next(error);
        });
      })
    );
  }

  changeEmail(param): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_CHANGE_EMAIL}`, param)
      .pipe(
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: InnerSubscriber<any, any>) => {
          observer.next(error);
        });
      })
    );
  }
}
