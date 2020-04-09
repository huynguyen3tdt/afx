import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOKEN_AFX, TIMEOUT_TOAST } from '../constant/authen-constant';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
const TIMEOUT = 30000;

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem(TOKEN_AFX) || localStorage.getItem(TOKEN_AFX);
    if (token !== undefined || token != null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: ``
        }
      });
    }
    return next.handle(request).pipe(
      timeout(TIMEOUT),
      catchError(e => {
        if (e.name === 'TimeoutError') {
          this.toastr.error('TimeoutError', 'ERROR', {
            timeOut: TIMEOUT_TOAST
          });
        }
        return throwError(e);
      }));
  }
}
