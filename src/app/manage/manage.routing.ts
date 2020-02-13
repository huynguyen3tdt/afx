import { Routes } from '@angular/router';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';

export const ManageRoutes: Routes = [
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'accountInfo',
    component: AccountInformationComponent
  },
  {
    path: 'withdrawRequest',
    component: WithdrawRequestComponent
  },
  {
    path: 'withdrawHistory',
    component: WithdrawHistoryComponent
  }
];
