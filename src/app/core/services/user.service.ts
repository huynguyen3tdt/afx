import { Injectable } from '@angular/core';
import { AppSettings } from './api.setting';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { EnvConfigService } from './env-config.service';
import { catchError } from 'rxjs/operators';
import { UserResponse, CorporateResponse, BankResponse } from '../model/user.model';
import { ResponseWihtoutDataModel } from '../model/none-data-response.model';
import { SearchBankResponseModel, SearchBranchResponseModel } from '../model/bank-response.model';
import { WithdrawHistoryModel } from '../model/withdraw-request-response.model';

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

  updateUser(parram: any): Observable<ResponseWihtoutDataModel> {
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

  changeCorporation(param): Observable<ResponseWihtoutDataModel> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_CHANGE_CORPORATION}`, param)
      .pipe(
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: InnerSubscriber<any, any>) => {
          observer.next(error);
        });
      })
    );
  }

  getAllCharacBranch(bankId: number): Observable<BankResponse> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_BRANCH}` + `?bank_id=${bankId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getSearchBank(firstChar: string, name: string, bic: string): Observable<SearchBankResponseModel> {
    let URL = '';
    if (firstChar) {
      URL += `?first_char=${firstChar}`;
    }
    if (name) {
      URL += `?name=${name}`;
    }
    if (bic) {
      URL += `?bic=${bic}`;
    }
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_BANK_SEARCH}` + URL)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getAllCharacBank(): Observable<BankResponse> {
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_BANK}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  getSearchBranch(bankId: number, firstChar: string, branchName: string, branchCode: string): Observable<SearchBranchResponseModel> {
    let URL = '';
    if (firstChar && bankId) {
      URL += `?bank_id=${bankId}&first_char=${firstChar}`;
    }
    if (branchName && bankId) {
      URL += `?bank_id=${bankId}&branch_name=${branchName}`;
    }
    if (branchCode && bankId) {
      URL += `?bank_id=${bankId}&branch_code=${branchCode}`;
    }
    return this.httpClient
      .get(`${this.envConfigService.getConfig()}/${AppSettings.API_BRANCH_SEARCH}` + URL)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return new Observable((observer: InnerSubscriber<any, any>) => {
            observer.next(error);
          });
        })
      );
  }

  changeBank(param): Observable<WithdrawHistoryModel> {
    return this.httpClient
      .put(`${this.envConfigService.getConfig()}/${AppSettings.API_CHANGE_BANK}`, param)
      .pipe(
      catchError((error: HttpErrorResponse) => {
        return new Observable((observer: InnerSubscriber<any, any>) => {
          observer.next(error);
        });
      })
    );
  }
}
