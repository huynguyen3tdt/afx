import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOKEN_AFX } from '../constant/authen-constant';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor() { }

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
    return next.handle(request);
  }
}
