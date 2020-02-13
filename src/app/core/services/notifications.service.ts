import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import { PageNotificationResponse, NotificationStatusResponse, NotificationResponse } from '../model/page-noti.model';
import { AppSettings } from './api.setting';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private httpClient: HttpClient,
    private envConfigService: EnvConfigService) { }

  getListNotifications(pageSize: number, pageNumber: number, type?: number): Observable<PageNotificationResponse> {
    let URL = '';
    if (type !== -1) {
      URL = `?type=${type}&page_size=${pageSize}?page_numb=${pageNumber}`;
    } else {
      URL = `?page_size=${pageSize}?page_numb=${pageNumber}`;
    }
    return this.httpClient.get(`${this.envConfigService.getConfig()}/${AppSettings.API_GET_LIST_NOTIFICATIONS}` + URL)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  changeReadStatus(param): Observable<NotificationStatusResponse> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_CHANGE_READ_STATUS}`,
        param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  changeAgreementStatus(param): Observable<NotificationResponse> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_CHANGE_AGREEMENT_STATUS}`,
        param)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }
}
