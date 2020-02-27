import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TOKEN_AFX } from '../constant/authen-constant';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
          if (err.status === 401) {
            localStorage.removeItem(TOKEN_AFX);
            this.router.navigate(['/login']);
          }
          return throwError(err.error);
        }));
    }
}
