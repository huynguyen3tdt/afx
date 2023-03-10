import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Notification, PageNotificationResponse, TotalNotification } from 'src/app/core/model/page-noti.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ACCOUNT_IDS,
  ACCOUNT_TYPE,
  FIRST_LOGIN,
  LOCALE,
  TIMEZONEAFX,
  TIMEZONESERVER
} from 'src/app/core/constant/authen-constant';
import {
  EN_FORMATDATE_HH_MM,
  EN_FORMATDATE_HH_MM_SS,
  JAPAN_FORMATDATE_HH_MM,
  JAPAN_FORMATDATE_HH_MM_SS
} from 'src/app/core/constant/format-date-constant';
import * as moment from 'moment-timezone';
import { AccountType } from 'src/app/core/model/report-response.model';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { GlobalService } from 'src/app/core/services/global.service';
import { Title } from '@angular/platform-browser';
import {
  B2B_FX_GROUP,
  C_CFD_B2B_GROUP,
  C_CFD_GROUP,
  FX_GROUP,
  I_CFD_B2B_GROUP,
  I_CFD_GROUP
} from 'src/app/core/constant/new-group-constant';
import { BIZ_GROUP } from 'src/app/core/constant/user-code-constant';

declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('importantTab', { static: true }) importantTab: ElementRef;
  @ViewChild('notiModal', { static: true }) notiModal: ModalDirective;
  currentPage: number;
  pageSize: number;
  listNotification: Array<Notification>;
  pageNotification: PageNotificationResponse;
  totalItem: number;
  tab: string;
  contentAgeement: any;
  checkAgreement: boolean;
  agreementID: number;
  formAgreement: FormGroup;
  showNoti: boolean;
  totalAll: number;
  totalImportant: number;
  totalCampagn: number;
  totalNotification: number;
  totalNoti: TotalNotification;
  unreadAll: boolean;
  unreadImportant: boolean;
  unreadNotification: boolean;
  unreadCampagn: boolean;
  checkType: any;
  recordFrom: number;
  recordTo: number;
  listTotalItem: Array<number> = [10, 20, 30];
  totalPage: number;
  formatDateHour: string;
  formatDateHourSecond: string;
  locale: string;
  timeZone: string;
  listTradingAccount: Array<AccountType>;
  accountID: string;
  TABS = {
    ALL: { name: 'ALL', value: -1 },
    IMPORTANT: { name: 'IMPORTANT', value: 0 },
    NOTIFICATIONS: { name: 'NOTIFICATIONS', value: 1 },
    CAMPAIGN: { name: 'CAMPAIGN', value: 2 },
    SYSTEM_IMPORTANT: { name: 'SYS_IMPORTATNT', value: '01' }
  };
  language;
  filterFX: boolean;
  filterICFD: boolean;
  filterCCFD: boolean;
  showFilterFX: boolean;
  showFilterICFD: boolean;
  showFilterCCFD: boolean;
  newsGroup: string;

  constructor(
    private notificationsService: NotificationsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('???????????????MT5 Mypage');
    this.language = LANGUAGLE;
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    this.updatePageDataByLanguage();
    this.globalService.recallLanguage.subscribe((newLang) => {
      this.locale = newLang;

      this.updatePageDataByLanguage();
    });
    this.initFilterRead();
    this.initFilterTradingAcount();
    this.currentPage = 1;
    this.pageSize = 10;
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((param) => {
      if (param.fisrtLogin) {
        this.showNoti = true;
      } else {
        this.showNoti = false;
      }
      if (param.unread) {
        this.changeFilterRead();
      }
    });
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = this.listTradingAccount[0].account_id;
    }
    if (this.accountID) {
      this.checkSearchTypeTrading();
      this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value, this.newsGroup);
      this.getTotalNotification();
    }
  }

  updatePageDataByLanguage() {
    if (this.locale === LANGUAGLE.english) {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
      this.formatDateHourSecond = EN_FORMATDATE_HH_MM_SS;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
      this.formatDateHourSecond = JAPAN_FORMATDATE_HH_MM_SS;
    }
  }

  getListNotifications(pageSize: number, pageNumber: number, unread: boolean, type?: number, listAccountId?: string) {
    this.checkTab(type);
    this.listNotification = [];
    if (type !== -1) {
      localStorage.setItem(FIRST_LOGIN, '0');
    }
    this.spinnerService.show();
    this.notificationsService.getListNotifications(pageSize, pageNumber, unread, type, listAccountId).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.pageNotification = response;
        this.listNotification = this.pageNotification.data.results;
        this.listNotification.forEach(item => {
          if (item.publish_date) {
            item.publish_date += TIMEZONESERVER;
            item.publish_date = moment(item.publish_date).format(this.formatDateHour);
          }

          if (item.expire_date) {
            item.expire_date += TIMEZONESERVER;
            item.expire_date = moment(item.expire_date).format(this.formatDateHourSecond);
          }

          if (item.agree_date) {
            item.agree_date += TIMEZONESERVER;
            item.agree_date = moment(item.agree_date).format(this.formatDateHour);
          }
        });
        this.totalItem = this.pageNotification.data.count;
        this.totalPage = (this.totalItem / this.pageSize) * 10;
        this.spinnerService.hide();
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listNotification.length - 1);
      }
    });
    this.getTotalNotification();
  }

  getTotalNotification() {
    const accountNumber = this.accountID;
    this.notificationsService.getTotalNotification(accountNumber).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.totalNoti = response.data;
        this.totalCampagn = this.totalNoti.campaign;
        this.totalImportant = this.totalNoti.important;
        this.totalNotification = this.totalNoti.notification;
        this.totalAll = this.totalNoti.total;
        if (this.showNoti === true && this.tab === 'ALL'
          && (localStorage.getItem(FIRST_LOGIN) === '1')
          && this.totalImportant > 0) {
          // $('#notice_important').modal('show');
          this.notiModal.show();
          this.importantTab.nativeElement.click();
        }
      }
    });
  }

  changeReadStatus(id: number) {
    const param = {
      noti_id: id
    };
    this.notificationsService.changeReadStatus(param).pipe(take(1)).subscribe(response => {
    });
    this.getTotalNotification();
    this.globalService.changeStatusNoti('recall');
  }

  filterUnreadNoti() {
    this.currentPage = 1;
    this.unreadAll = !this.unreadAll;
    this.searchByTab();
  }

  filterType(type) {
    if (type === 'fx') {
      this.filterFX = !this.filterFX;
    }
    if (type === 'icfd') {
      this.filterICFD = !this.filterICFD;
    }
    if (type === 'ccfd') {
      this.filterCCFD = !this.filterCCFD;
    }
    this.checkSearchTypeTrading();
    this.currentPage = 1;
    this.searchByTab();
  }

  checkSearchTypeTrading() {
    this.newsGroup = '';
    this.listTradingAccount.forEach(item => {
      if (item.account_type === ACCOUNT_TYPE.ACCOUNT_FX.account_type) {
        this.showFilterFX = true;
        if (this.filterFX) {
          if (localStorage.getItem(BIZ_GROUP) === 'it') {
            this.newsGroup += FX_GROUP + ',';
          } else {
            this.newsGroup += B2B_FX_GROUP + ',';
          }
        }
      }
      if (item.account_type === ACCOUNT_TYPE.ACCOUNT_CFDIndex.account_type) {
        this.showFilterICFD = true;
        if (this.filterICFD) {
          if (localStorage.getItem(BIZ_GROUP) === 'it') {
            this.newsGroup += I_CFD_GROUP + ',';
          } else {
            this.newsGroup += I_CFD_B2B_GROUP + ',';
          }

        }
      }
      if (item.account_type === ACCOUNT_TYPE.ACCOUNT_CFDCom.account_type) {
        this.showFilterCCFD = true;
        if (this.filterCCFD) {
          if (localStorage.getItem(BIZ_GROUP) === 'it') {
            this.newsGroup += C_CFD_GROUP + ',';
          } else {
            this.newsGroup += C_CFD_B2B_GROUP + ',';
          }
        }
      }
    });
    if (this.newsGroup) {
      if (this.newsGroup[this.newsGroup.length - 1] === ',') {
        this.newsGroup = this.newsGroup.substr(0, this.newsGroup.length - 1);
      }
    }
  }

  confirmAgreement(id: number) {
    const param = {
      noti_id: id
    };
    this.notificationsService.changeAgreementStatus(param).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.changeReadStatus(this.agreementID);
        this.searchByTab();
      }
    });
    this.getTotalNotification();
  }

  pageChanged(event) {
    this.currentPage = event.page;
    // this.searchByTab();
    let tabName;
    switch (this.tab) {
      case this.TABS.ALL.name:
        tabName = this.TABS.ALL.value;
        break;
      case this.TABS.IMPORTANT.name:
        tabName = this.TABS.IMPORTANT.value;
        break;
      case this.TABS.NOTIFICATIONS.name:
        tabName = this.TABS.NOTIFICATIONS.value;
        break;
      case this.TABS.CAMPAIGN.name:
        tabName = this.TABS.CAMPAIGN.value;
        break;
    }
    this.spinnerService.show();
    this.notificationsService.getListNotifications(this.pageSize,
      this.currentPage, this.unreadAll, tabName, this.newsGroup).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.pageNotification = response;
        this.listNotification = this.pageNotification.data.results;
        this.listNotification.forEach((item) => {
          if (item.publish_date) {
            item.publish_date += TIMEZONESERVER;
            item.publish_date = moment(item.publish_date).format(this.formatDateHour);
          }

          if (item.expire_date) {
            item.expire_date += TIMEZONESERVER;
            item.expire_date = moment(item.expire_date).format(this.formatDateHourSecond);
          }

          if (item.agree_date) {
            item.agree_date += TIMEZONESERVER;
            item.agree_date = moment(item.agree_date).format(this.formatDateHour);
          }
        });
        this.totalItem = this.pageNotification.data.count;
        this.totalPage = (this.totalItem / this.pageSize) * 10;
        this.spinnerService.hide();
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listNotification.length - 1);
      }
    });
    this.getTotalNotification();
  }

  checkTab(type: number) {
    switch (type) {
      case this.TABS.ALL.value:
        this.tab = this.TABS.ALL.name;
        break;
      case this.TABS.IMPORTANT.value:
        this.tab = this.TABS.IMPORTANT.name;
        break;
      case this.TABS.NOTIFICATIONS.value:
        this.tab = this.TABS.NOTIFICATIONS.name;
        break;
      case this.TABS.CAMPAIGN.value:
        this.tab = this.TABS.CAMPAIGN.name;
        break;
    }
  }

  changeTab(type: number) {
    this.pageSize = 10;
    this.currentPage = 1;
    this.initFilterRead();
    switch (type) {
      case this.TABS.ALL.value:
        this.tab = this.TABS.ALL.name;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value, this.newsGroup);
        break;
      case this.TABS.IMPORTANT.value:
        this.tab = this.TABS.IMPORTANT.name;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.IMPORTANT.value, this.newsGroup);
        break;
      case this.TABS.NOTIFICATIONS.value:
        this.tab = this.TABS.NOTIFICATIONS.name;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.NOTIFICATIONS.value, this.newsGroup);
        break;
      case this.TABS.CAMPAIGN.value:
        this.tab = this.TABS.CAMPAIGN.name;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.CAMPAIGN.value, this.newsGroup);
        break;
    }
    this.globalService.callListAccount();
  }

  changeTotalItem(event) {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    this.searchByTab();
  }

  searchByTab() {
    switch (this.tab) {
      case this.TABS.ALL.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value, this.newsGroup);
        break;
      case this.TABS.IMPORTANT.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.IMPORTANT.value, this.newsGroup);
        break;
      case this.TABS.NOTIFICATIONS.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.NOTIFICATIONS.value, this.newsGroup);
        break;
      case this.TABS.CAMPAIGN.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.CAMPAIGN.value, this.newsGroup);
        break;
    }
  }

  showDetail(index: number, item: Notification) {
    $(`#noti_${index}`).toggleClass('opened');
    if (this.checkAgreementIsRead(item)) {
      $(`#noti_${index}`).removeClass('unread');
    }

    if (item.read_flg) {
      return;
    }

    if (item.agreement_flg === 1 && !item.agree_flg && !item.expire_flg) {
      return;
    }

    item.read_flg = true;
    this.changeReadStatus(item.id);
  }

  checkAgreementIsRead(item: Notification) {
    if (item.agreement_flg === 1) {
      this.contentAgeement = item.news_content;
      this.agreementID = item.id;
      if (item.agree_flg === false) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  changeAccountId() {
  }

  showimportant() {
    $('.test').toggleClass('opened');
  }

  initFilterRead() {
    this.unreadAll = true;
    // this.unreadCampagn = false;
    // this.unreadImportant = false;
    // this.unreadNotification = false;
  }

  changeFilterRead() {
    this.unreadAll = true;
    this.unreadCampagn = true;
    this.unreadImportant = true;
    this.unreadNotification = true;
  }

  initFilterTradingAcount() {
    this.filterFX = true;
    this.filterICFD = true;
    this.filterCCFD = true;
  }

}
