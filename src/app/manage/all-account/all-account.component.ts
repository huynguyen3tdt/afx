import { Component, OnInit } from '@angular/core';
import { AccountType } from 'src/app/core/model/report-response.model';
import { Mt5Model, WithdrawRequestModel } from 'src/app/core/model/withdraw-request-response.model';
import { ACCOUNT_IDS, TIMEZONEAFX, LOCALE } from 'src/app/core/constant/authen-constant';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { forkJoin, Observable } from 'rxjs';
import moment from 'moment-timezone';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-all-account',
  templateUrl: './all-account.component.html',
  styleUrls: ['./all-account.component.scss']
})
export class AllAccountComponent implements OnInit {
  listTradingAccount: Array<AccountType>;
  listMt5Infor: Array<WithdrawRequestModel> = [];
  totalBalance: number;
  totalPL: number;
  lastestTime: string;
  timeZone: string;
  formatDateHour: string;
  locale: string;
  constructor(private withdrawRequestService: WithdrawRequestService,
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
    this.totalBalance = 0;
    this.totalPL = 0;
    if (this.listTradingAccount) {
      const listMT5: Observable<WithdrawRequestModel> [] = [];
      this.listTradingAccount.forEach((item) => {
        item.img_type_account = this.globalService.convertTypeToImg(item.account_id);
        if (item.account_id) {
          listMT5.push(this.withdrawRequestService.getmt5Infor(Number(item.account_id)));
        }
      });
      forkJoin (
        listMT5
        // this.getMT5info()
      ).subscribe((result) => {
        this.listMt5Infor = result;
        this.listMt5Infor.forEach((item, index) => {
          this.listMt5Infor[index].data.account_id = this.listTradingAccount[index].account_id;
          this.listMt5Infor[index].data.currency = this.listTradingAccount[index].currency;
        });
        this.listMt5Infor.forEach(item => {
          item.data.img_type_account = this.globalService.convertTypeToImg(item.data.account_id);
          console.log('3333 ', item.data.img_type_account);
          this.totalBalance += Number(item.data.balance);
          this.totalPL += Number(item.data.unrealize_pl);
          this.lastestTime = moment(item.data.lastest_time).tz(this.timeZone).format(this.formatDateHour);
        });
      });
    }
  }
}
