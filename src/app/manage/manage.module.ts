import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageRoutes } from './manage.routing';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(ManageRoutes),
    ],
    providers: [],
    declarations: [NotificationsComponent, AccountInformationComponent, WithdrawRequestComponent, WithdrawHistoryComponent]
})

export class ManageModule { }
