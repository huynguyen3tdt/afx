import { Routes } from '@angular/router';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';
import { ReportListComponent } from './report-list/report-list.component';
import { DepositComponent } from './deposit/deposit.component';
import { SummaryComponent } from './summary/summary.component';
import { InternalTransferComponent } from './internal-transfer/internal-transfer.component';

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
  },
  {
    path: 'reportList',
    component: ReportListComponent
  },
  {
    path: 'deposit',
    component: DepositComponent
  },
  {
    path: 'summary',
    component: SummaryComponent
  },
  {
    path: 'internal',
    component: InternalTransferComponent
  },
];
