import { Component, OnInit } from '@angular/core';
import { AccountType } from 'src/app/core/model/report-response.model';
import { Mt5Model, WithdrawRequestModel } from 'src/app/core/model/withdraw-request-response.model';
import { ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { forkJoin, Observable } from 'rxjs';

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
  constructor(private withdrawRequestService: WithdrawRequestService) { }

  ngOnInit() {
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.totalBalance = 0;
    this.totalPL = 0;
    if (this.listTradingAccount) {
      const listMT5: Observable<WithdrawRequestModel> [] = [];
      this.listTradingAccount.forEach((item) => {
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
        });
        this.listMt5Infor.forEach(item => {
          this.totalBalance += Number(item.data.balance);
          this.totalPL += Number(item.data.unrealize_pl);
        });
      });
    }
  }
}
