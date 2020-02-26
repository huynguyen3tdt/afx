import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import { UserResponse, UserModel, CorporateResponse } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private envConfigService: EnvConfigService) { }

  getUserInfor(): Observable<UserResponse> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_GET_INDIVIDUAL}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getCorporateInfor(): Observable<CorporateResponse> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_GET_CORPORATION}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  updateUser(parram: any): Observable<UserResponse> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_PUT_INDIVIDUAL}`,
            parram)
      .pipe(
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: InnerSubscriber<any, any>) => {
          observer.next(error);
        });
      })
    );
  }
}
