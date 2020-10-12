import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TOKEN_AFX,
  TIMEOUT_TOAST,
  TYPE_ERROR_TOAST_EN,
  TYPE_ERROR_TOAST_JP,
  TOKEN_EXPIRED_EN,
  TOKEN_EXPIRED_JP,
  INTERNAL_SERVER_EN,
  INTERNAL_SERVER_JP,
  CHANGE_PASS_FLG} from '../constant/authen-constant';
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
            localStorage.removeItem(CHANGE_PASS_FLG);
            this.router.navigate(['/login']);
            if (locale === LANGUAGLE.english) {
              messageErr = TOKEN_EXPIRED_EN;
              typeErr = TYPE_ERROR_TOAST_EN;
            } else {
              messageErr = TOKEN_EXPIRED_JP;
              typeErr = TYPE_ERROR_TOAST_JP;
            }
          }
          if (err.status === 500) {
            if (locale === LANGUAGLE.english) {
              messageErr = INTERNAL_SERVER_EN;
              typeErr = TYPE_ERROR_TOAST_EN;
            } else {
              messageErr = INTERNAL_SERVER_JP;
              typeErr = TYPE_ERROR_TOAST_EN;
            }
            this.toastr.error(messageErr, typeErr, {
              timeOut: TIMEOUT_TOAST
            });
          }
          if (err.status === 423) {
            alert('Maintain Mode');
            window.location.reload();
          }
          return throwError(err.error);
        }));
    }
}
