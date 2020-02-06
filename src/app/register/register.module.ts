import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterRoutes } from './register.routing';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(RegisterRoutes),
        BsDatepickerModule.forRoot()
    ],

    providers: [],
    declarations: [LoginComponent, ForgotPasswordComponent],
})

export class RegisterModule { }
