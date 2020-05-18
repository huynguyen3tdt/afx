import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import { LoginResponseModel } from '../model/login-response.model';
import { ResponseWihtoutDataModel } from '../model/none-data-response.model';
import { ForgotPasswordParam, LoginParam, ResetPasswordParam, ResetPasswordWithTokenParam, ChangeEmail, CheckTokenParam } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  constructor(
    private httpClient: HttpClient,
    private envConfigService: EnvConfigService) {}

  login(param: LoginParam): Observable<LoginResponseModel> {
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

  forgotPassWord(param: ForgotPasswordParam): Observable<ResponseWihtoutDataModel> {
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

  changePassword(param: ResetPasswordParam): Observable<ResponseWihtoutDataModel> {
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

  resetPassword(param: ResetPasswordWithTokenParam): Observable<ResponseWihtoutDataModel> {
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

  checkTokenPassWord(param: CheckTokenParam): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .post(`${this.envConfigService.getConfig()}/${AppSettings.API_CHECK_TOKEN_PASSWORD}`, param)
      .pipe(
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: InnerSubscriber<any, any>) => {
          observer.next(error);
        });
      })
    );
  }

  changeEmail(param: ChangeEmail): Observable<ResponseWihtoutDataModel> {
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
