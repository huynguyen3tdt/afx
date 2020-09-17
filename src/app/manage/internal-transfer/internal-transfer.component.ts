import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountType } from 'src/app/core/model/report-response.model';
import { ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { TYPEOFTRANHISTORY } from 'src/app/core/constant/payment-method-constant';

@Component({
  selector: 'app-internal-tranfer',
  templateUrl: './internal-transfer.component.html',
  styleUrls: ['./internal-transfer.component.scss']
})
export class InternalTransferComponent implements OnInit {
  @ViewChild('historyTab', { static: true }) historyTab: ElementRef;
  @ViewChild('transferHistory', { static: true }) transferHistory: ElementRef;
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
  hideTransferTab: boolean;
  filterDepositHistory: boolean;
  filterWithDrawHistory: boolean;
  showTransferHistory: boolean;
  constructor() { }

  ngOnInit() {
    this.showTabDeposit = true;
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.hideTransferTab = this.listTradingAccount.length > 1;
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
  goToTab(event) {
    console.log('eventtt ', event);
    this.showTabHistory = true;
    setTimeout(() => {
      this.historyTab.nativeElement.click();
    }, 100);
    if (event === TYPEOFTRANHISTORY.DEPOSIT.key) {
      this.filterDepositHistory = true;
    } else if (event === TYPEOFTRANHISTORY.WITHDRAWAL.key) {
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
