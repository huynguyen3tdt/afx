import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountType } from 'src/app/core/model/report-response.model';
import { WithdrawRequestModel } from 'src/app/core/model/withdraw-request-response.model';
import { ACCOUNT_IDS, TIMEZONEAFX, LOCALE} from 'src/app/core/constant/authen-constant';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { forkJoin, Observable } from 'rxjs';
import * as moment from 'moment-timezone';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import { GlobalService } from 'src/app/core/services/global.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-account',
  templateUrl: './all-account.component.html',
  styleUrls: ['./all-account.component.scss']
})
export class AllAccountComponent implements OnInit, OnDestroy {
  listTradingAccount: Array<AccountType>;
  listMt5Infor: Array<WithdrawRequestModel> = [];
  totalBalance: number;
  totalPL: number;
  lastestTime: string;
  timeZone: string;
  formatDateHour: string;
  locale: string;
  intervalResetMt5Infor;
  constructor(private withdrawRequestService: WithdrawRequestService,
              private globalService: GlobalService,
              private spinnerService: Ng4LoadingSpinnerService,
              private userService: UserService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.getSummaryAllAccount();
    this.intervalResetMt5Infor = setInterval(() => {
      this.getSummaryAllAccount();
    }, 60000);
  }

  getSummaryAllAccount() {
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
          this.totalBalance += Number(item.data.balance);
          this.totalPL += Number(item.data.unrealize_pl);
          this.lastestTime = moment(item.data.lastest_time).tz(this.timeZone).format(this.formatDateHour);
        });
      });
    }
  }


  ngOnDestroy(): void {
    clearInterval(this.intervalResetMt5Infor);
  }


}
