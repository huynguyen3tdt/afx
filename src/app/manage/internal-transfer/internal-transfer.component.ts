import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AccountType } from 'src/app/core/model/report-response.model';
import { ACCOUNT_IDS, INTERNAL_TRANSFER } from 'src/app/core/constant/authen-constant';
import { TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-internal-tranfer',
  templateUrl: './internal-transfer.component.html',
  styleUrls: ['./internal-transfer.component.scss']
})
export class InternalTransferComponent implements OnInit, AfterViewInit {
  @ViewChild('historyTab', { static: true }) historyTab: ElementRef;
  @ViewChild('transferHistory', { static: true }) transferHistory: ElementRef;
  @ViewChild('abc', { static: true }) abc: ElementRef;
  TAB = {
    deposit: 'deposit',
    withdraw: 'withdraw',
    transfer: 'transfer',
    history: 'history'
  };
  showTabDeposit: boolean;
  showTabWithdraw: boolean;
  showTabTransfer: boolean;
  showTabHistory: boolean;
  listTradingAccount: Array<AccountType>;
  filterDepositHistory: boolean;
  filterWithDrawHistory: boolean;
  showTransferHistory: boolean;
  querytab: string;
  detaiWithdrawFlag: boolean;
  accountID: number;
  hideTransfer: boolean;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.hideTransfer = Boolean(localStorage.getItem(INTERNAL_TRANSFER));
    this.showTabDeposit = true;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(res => {
      this.querytab = res.tab;
      if (this.querytab === 'detailwithdrawal') {
        this.showTabHistory = true;
        this.showTabDeposit = false;
        this.showTabTransfer = false;
        this.showTabWithdraw = false;
        this.detaiWithdrawFlag = true;
        this.accountID = Number(res.accountID);
      }
    });
  }

  changeTab(type) {
    this.showTabDeposit = this.TAB.deposit === type;
    this.showTabWithdraw = this.TAB.withdraw === type;
    this.showTabTransfer = this.TAB.transfer === type;
    this.showTabHistory = this.TAB.history === type;
    if (type !== this.TAB.history) {
      this.initFilterHistory();
    }
  }
  goToTabHistory(event) {
    this.accountID = event.accountID;
    this.showTabHistory = true;
    this.showTabDeposit = false;
    this.showTabTransfer = false;
    this.showTabWithdraw = false;
    if (event.tab === TYPEOFTRANHISTORY.DEPOSIT.key) {
      this.filterDepositHistory = true;
    } else if (event.tab === TYPEOFTRANHISTORY.WITHDRAWAL.key) {
      this.filterWithDrawHistory = true;
    } else {
      this.showTransferHistory = true;
    }
  }

  initFilterHistory() {
    this.filterDepositHistory = false;
    this.filterWithDrawHistory = false;
    this.showTransferHistory = false;
  }
}
