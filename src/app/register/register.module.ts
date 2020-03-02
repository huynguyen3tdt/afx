import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterRoutes } from './register.routing';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(RegisterRoutes),
        BsDatepickerModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot()
    ],

    providers: [],
    declarations: [LoginComponent, ForgotPasswordComponent, ResetPasswordComponent],
})

export class RegisterModule { }
