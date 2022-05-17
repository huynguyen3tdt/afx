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
import {MultiSelectModule} from 'primeng/multiselect';
import { TransacstionModalComponent } from './transacstion-modal/transacstion-modal.component';
import { ModalModule } from 'ngx-bootstrap';
import { UserInforComponent } from './user-infor/user-infor.component';
import { CorporateInfoComponent } from './corporate-info/corporate-info.component';
import { ConvertFinancialPipe } from '../core/pipe/convert-financial.pipe';
import { ConvertInvestmentPurposePipe } from '../core/pipe/convert-purposeInvest.pipe';
import { Mt5InfoComponent } from './mt5-info/mt5-info.component';
import { BankInfoComponent } from './bank-info/bank-info.component';
import { SettingComponent } from './setting/setting.component';
import { ConvertAccountTypeBankPipe } from '../core/pipe/convert-account-type-bank.pipe';
import { SafePipe } from '../core/pipe/safePipe.pipe';
import { ModalDepositWithdrawComponent } from './modal-deposit-withdraw/modal-deposit-withdraw.component';
import { SummaryComponent } from './summary/summary.component';
import { AllAccountComponent } from './all-account/all-account.component';
import { InternalTransferComponent } from './internal-transfer/internal-transfer.component';
import { TransferComponent } from './transfer/transfer.component';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { ConvertTradingTypePipe } from '../core/pipe/convert-trading-type.pipe';
import { ModalTurnTradingComponent } from './modal-turn-trading/modal-turn-trading.component';

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
        PdfJsViewerModule,
        MultiSelectModule,
        ModalModule
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
        ListTransactionComponent,
        TransacstionModalComponent,
        UserInforComponent,
        CorporateInfoComponent,
        Mt5InfoComponent,
        BankInfoComponent,
        SettingComponent,
        ConvertFinancialPipe,
        ConvertInvestmentPurposePipe,
        ConvertAccountTypeBankPipe,
        SafePipe,
        ModalDepositWithdrawComponent,
        SummaryComponent,
        AllAccountComponent,
        InternalTransferComponent,
        TransferComponent,
        TransferHistoryComponent,
        ConvertTradingTypePipe,
        ModalTurnTradingComponent
    ],
    exports: [
        ModalTurnTradingComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})

export class ManageModule { }
