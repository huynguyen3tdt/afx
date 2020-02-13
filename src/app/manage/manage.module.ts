import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageRoutes } from './manage.routing';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(ManageRoutes),
        PaginationModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot(),
    ],
    providers: [],
    declarations: [NotificationsComponent, AccountInformationComponent],
    schemas: [NO_ERRORS_SCHEMA]
})

export class ManageModule { }
