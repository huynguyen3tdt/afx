import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private envConfigService: EnvConfigService) { }

    // login(params: any): Observable<any> {
    //   return this.httpClient
    //     .post(`${this.envConfigService.getConfig().backEnd}/${AppSettings.API_LOGIN}/`, 
    //     params, { observe: 'response' })
    //     .pipe(
    //       map((data: any)) => {

    //       }
    //     )
    //     .pipe(
    //       catchError((error: HttpErrorResponse) => {
    //         return new Observable((observer: InnerSubscriber<any, any>) => {
    //           observer.next(error);
    //         });
    //       })
    //     );
    // }
    login(parrams): Observable<any> {
      return this.httpClient
      .post(`${this.envConfigService.getConfig().backEnd}/${AppSettings.API_LOGIN}`,
          parrams, { observe: 'response' })
        .pipe(
          map((data: any) => {
            if (data.status === 200) {
              if (data.body.access_token) {
                localStorage.setItem('currentUser', data.body.access_token);
                return data;
              }
              return data;
            }
          })
        ).pipe(
          catchError((error: HttpErrorResponse) => {
              return new Observable((observer: InnerSubscriber<any, any>) => {
                observer.next(error);
              }); 
            // return new Observable((observer: InnerSubscriber<any, any>) => {
            //   observer.next(error)
            // });
          })
        );
    }
}
