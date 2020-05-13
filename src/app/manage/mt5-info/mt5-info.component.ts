import { Component, OnInit } from '@angular/core';
import { TIMEZONEAFX, LOCALE, ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { AccountType } from 'src/app/core/model/report-response.model';
import { Mt5Model, WithdrawAmountModel } from 'src/app/core/model/withdraw-request-response.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { GlobalService } from 'src/app/core/services/global.service';
import moment from 'moment-timezone';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-mt5-info',
  templateUrl: './mt5-info.component.html',
  styleUrls: ['./mt5-info.component.scss']
})
export class Mt5InfoComponent implements OnInit {
  accountID: number;
  timeZone: string;
  locale: string;
  formatDateHour: string;
  listTradingAccount: Array<AccountType>;
  accountInfor: Mt5Model;
  lastestTime: string;
  withdrawAmount: WithdrawAmountModel;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
              private withdrawRequestService: WithdrawRequestService,
              private globalService: GlobalService) { }

  ngOnInit() {
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = Number(this.listTradingAccount[0].account_id);
    }
    this.getMt5Infor(this.accountID);
    this.getWithDrawAmount(this.accountID);
  }

  getMt5Infor(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getmt5Infor(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.accountInfor = response.data;
        this.lastestTime = moment(this.accountInfor.lastest_time).tz(this.timeZone).format(this.formatDateHour);
      }
    });
  }

  getWithDrawAmount(accountId) {
    this.spinnerService.show();
    this.withdrawRequestService.getDwAmount(accountId).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.withdrawAmount = response.data;
        if (!this.withdrawAmount.withdraw_amount_pending || this.withdrawAmount.withdraw_amount_pending === null) {
          this.withdrawAmount.withdraw_amount_pending = 0;
        }
      }
    });
  }

}
