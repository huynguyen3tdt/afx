import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TOKEN_AFX, TIMEOUT_TOAST } from '../constant/authen-constant';
import { ToastrService } from 'ngx-toastr';
import { LOCALE } from './../constant/authen-constant';
import { LANGUAGLE } from '../constant/language-constant';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private toastr: ToastrService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const locale = localStorage.getItem(LOCALE);
      let messageErr;
      let typeErr;
      return next.handle(request).pipe(catchError(err => {
          if (err.status === 401) {
            localStorage.removeItem(TOKEN_AFX);
            this.router.navigate(['/login']);
            if (locale === LANGUAGLE.english) {
              messageErr = 'Token expired';
              typeErr = 'ERROR';
            } else {
              messageErr = 'トークンの有効期限が切れました。';
              typeErr = 'エラー';
            }
          }
          // if (err.status === 400) {
          //   if (locale === LANGUAGLE.english) {
          //     messageErr = 'Internal client error';
          //     typeErr = 'ERROR';
          //   } else {
          //     messageErr = '内部クライアントエラー';
          //   }
          //   this.toastr.error(messageErr, typeErr, {
          //     timeOut: 3000
          //   });
          // }
          if (err.status === 500) {
            if (locale === LANGUAGLE.english) {
              messageErr = 'Internal server error';
              typeErr = 'ERROR';
            } else {
              messageErr = '内部サーバーエラー';
              typeErr = 'エラー';
            }
            this.toastr.error(messageErr, typeErr, {
              timeOut: TIMEOUT_TOAST
            });
          }
          return throwError(err.error);
        }));
    }
}
