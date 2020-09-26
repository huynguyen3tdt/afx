import { Component, OnInit } from '@angular/core';
import { IS_COMPANY } from 'src/app/core/constant/authen-constant';
import { Title } from '@angular/platform-browser';

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
  isCompany: boolean;
  showTabCorpInfo: boolean;
  showTabUserInfo: boolean;
  showTabMt5: boolean;
  showTabSetting: boolean;
  showTabWithDrawal: boolean;

  constructor(private titleService: Title) { }


  ngOnInit() {
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.isCompany = localStorage.getItem(IS_COMPANY) === 'true';
    this.showTabUserInfo = !this.isCompany;
    this.showTabCorpInfo = this.isCompany;
  }

  changeTab(type: string) {
    this.showTabMt5 = this.TAB.accountInfo === type;
    this.showTabUserInfo = this.TAB.userInfo === type;
    this.showTabCorpInfo = this.TAB.corpInfo === type;
    this.showTabWithDrawal = this.TAB.withDrawal === type;
    this.showTabSetting = this.TAB.setting === type;
    console.log('11111 ', this.showTabUserInfo);
  }
}
