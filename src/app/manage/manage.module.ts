import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageRoutes } from './manage.routing';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountInformationComponent } from './account-information/account-information.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReportListComponent } from './report-list/report-list.component';
import { DepositComponent } from './deposit/deposit.component';
import { CurrencyDirective } from '../core/directive/currency.directive';
import { TranslateModule } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(ManageRoutes),
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot(),
        TranslateModule,
        PdfJsViewerModule
    ],
    providers: [],
    declarations: [
      NotificationsComponent,
      AccountInformationComponent,
      WithdrawRequestComponent,
      WithdrawHistoryComponent,
      ReportListComponent,
      DepositComponent,
      CurrencyDirective,
      ListTransactionComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})

export class ManageModule { }
