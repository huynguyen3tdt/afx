import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginGuard } from '../core/guard/login.guard';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

export const RegisterRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        canActivate: [LoginGuard],
        component: LoginComponent
    },
    {
        path: 'forgot_password',
        canActivate: [LoginGuard],
        component: ForgotPasswordComponent
    },
    {
      path: 'reset_password',
      component: ResetPasswordComponent
    },
];
