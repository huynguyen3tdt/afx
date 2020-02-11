import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginResponseModel } from '../model/login-response.model';
import { TOKEN_AFX } from '../constant/authen-constant';
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
}
