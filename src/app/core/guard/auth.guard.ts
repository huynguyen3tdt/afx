import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TOKEN_AFX, CHANGE_PASS_FLG } from '../constant/authen-constant';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem(TOKEN_AFX) && localStorage.getItem(CHANGE_PASS_FLG) === 'false') {
      return true;
    } else {
      localStorage.removeItem(TOKEN_AFX);
      this.router.navigate(['login']);
      return false;
    }
  }

}
