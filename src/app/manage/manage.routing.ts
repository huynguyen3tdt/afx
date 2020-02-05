import { Routes } from '@angular/router';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountInformationComponent } from './account-information/account-information.component';

export const ManageRoutes: Routes = [
    {
        path: 'notifications',
        component: NotificationsComponent
    },
    {
        path: 'accountInfo',
        component: AccountInformationComponent
    }
];
