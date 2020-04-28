import { Component, OnInit } from '@angular/core';
import { IS_COMPANY } from 'src/app/core/constant/authen-constant';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit {
  TAB = {
    accountInfo: 'accountInfo',
    userInfo: 'userInfo',
    corpInfo: 'corpInfo',
    withDrawal: 'withDrawal',
    setting: 'setting'
  };
  isCompany: string;
  showTabCorpInfo: boolean;
  showTabUserInfo: boolean;
  showTabMt5: boolean;
  showTabSetting: boolean;
  showTabWithDrawal: boolean;

  constructor() { }


  ngOnInit() {
    this.showTabMt5 = true;
    this.isCompany = localStorage.getItem(IS_COMPANY);
  }

  changeTab(type: string) {
    if (this.TAB.accountInfo === type) {
      this.showTabMt5 = true;
    } else {
      this.showTabMt5 = false;
    }
    if (this.TAB.userInfo === type) {
      this.showTabUserInfo = true;
    } else {
      this.showTabUserInfo = false;
    }
    if (this.TAB.corpInfo === type) {
      this.showTabCorpInfo = true;
    } else {
      this.showTabCorpInfo = false;
    }
    if (this.TAB.withDrawal === type) {
      this.showTabWithDrawal = true;
    } else {
      this.showTabWithDrawal = false;
    }
    if (this.TAB.setting === type) {
      this.showTabSetting = true;
    } else {
      this.showTabSetting = false;
    }
  }
}
