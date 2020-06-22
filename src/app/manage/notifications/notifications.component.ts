import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PageNotificationResponse, Notification, TotalNotification } from 'src/app/core/model/page-noti.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FIRST_LOGIN, LOCALE, TIMEZONEAFX, TIMEZONESERVER, ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { EN_FORMATDATE_HH_MM, JAPAN_FORMATDATE_HH_MM } from 'src/app/core/constant/format-date-constant';
import moment from 'moment-timezone';
import { AccountType } from 'src/app/core/model/report-response.model';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { GlobalService } from 'src/app/core/services/global.service';
import { Title } from '@angular/platform-browser';
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
  locale: string;
  timeZone: string;
  listTradingAccount: Array<AccountType>;
  accountID: string;
  TABS = {
    ALL: { name: 'ALL', value: -1 },
    IMPORTANT: { name: 'IMPORTANT', value: 0 },
    NOTIFICATIONS: { name: 'NOTIFICATIONS', value: 1 },
    CAMPAIGN: { name: 'CAMPAIGN', value: 2 },
    SYSTEM_IMPORTANT: {name: 'SYS_IMPORTATNT', value: '01'}
  };
  language;
  constructor(
    private notificationsService: NotificationsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('フィリップMT5 Mypage');
    this.language = LANGUAGLE;
    this.timeZone = localStorage.getItem(TIMEZONEAFX);
    this.locale = localStorage.getItem(LOCALE);
    if (this.locale === LANGUAGLE.english) {
      this.formatDateHour = EN_FORMATDATE_HH_MM;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateHour = JAPAN_FORMATDATE_HH_MM;
    }
    this.initFilterRead();
    this.currentPage = 1;
    this.pageSize = 10;
    this.activatedRoute.queryParams.pipe(take(1)).subscribe(param => {
      if (param.fisrtLogin) {
        this.showNoti = true;
      } else {
        this.showNoti = false;
      }
    });
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    if (this.listTradingAccount) {
      this.accountID = this.listTradingAccount[0].value;
    }
    if (this.accountID) {
      this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
      this.getTotalNotification();
    }
  }

  getListNotifications(pageSize: number, pageNumber: number, unread: boolean, type?: number) {
    this.checkTab(type);
    this.listNotification = [];
    if (type !== -1) {
      localStorage.setItem(FIRST_LOGIN, '0');
    }
    this.spinnerService.show();
    this.notificationsService.getListNotifications(pageSize, pageNumber, unread, type).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.pageNotification = response;
        this.listNotification = this.pageNotification.data.results;
        this.listNotification.forEach(item => {
          item.publish_date += TIMEZONESERVER;
          item.publish_date = moment(item.publish_date).tz(this.timeZone).format(this.formatDateHour);
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
    const accountNumber = this.accountID.split('-')[1];
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
    switch (this.tab) {
      case this.TABS.ALL.name:
        this.unreadAll = !this.unreadAll;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
        break;
      case this.TABS.IMPORTANT.name:
        this.unreadImportant = !this.unreadImportant;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.TABS.IMPORTANT.value);
        break;
      case this.TABS.NOTIFICATIONS.name:
        this.unreadNotification = !this.unreadNotification;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadNotification, this.TABS.NOTIFICATIONS.value);
        break;
      case this.TABS.CAMPAIGN.name:
        this.unreadCampagn = !this.unreadCampagn;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadCampagn, this.TABS.CAMPAIGN.value);
        break;
    }
  }

  confirmAgreement() {
    const param = {
      noti_id: this.agreementID
    };
    this.notificationsService.changeAgreementStatus(param).pipe(take(1)).subscribe(response => {
      if (response.meta.code === 200) {
        this.changeReadStatus(this.agreementID);
        if (this.tab === this.TABS.ALL.name) {
          this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
        } else if (this.tab === this.TABS.IMPORTANT.name) {
          this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.TABS.IMPORTANT.value);
        } else if (this.tab === this.TABS.NOTIFICATIONS.name) {
          this.getListNotifications(this.pageSize, this.currentPage, this.unreadNotification, this.TABS.NOTIFICATIONS.value);
        } else if (this.tab === this.TABS.CAMPAIGN.name) {
          this.getListNotifications(this.pageSize, this.currentPage, this.unreadCampagn, this.TABS.CAMPAIGN.value);
        }
      }
    });
    this.getTotalNotification();
  }

  pageChanged(event) {
    this.currentPage = event.page;
    switch (this.tab) {
      case this.TABS.ALL.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
        break;
      case this.TABS.IMPORTANT.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.TABS.IMPORTANT.value);
        break;
      case this.TABS.NOTIFICATIONS.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadNotification, this.TABS.NOTIFICATIONS.value);
        break;
      case this.TABS.CAMPAIGN.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadCampagn, this.TABS.CAMPAIGN.value);
        break;
    }
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
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
        break;
      case this.TABS.IMPORTANT.value:
        this.tab = this.TABS.IMPORTANT.name;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.TABS.IMPORTANT.value);
        break;
      case this.TABS.NOTIFICATIONS.value:
        this.tab = this.TABS.NOTIFICATIONS.name;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadNotification, this.TABS.NOTIFICATIONS.value);
        break;
      case this.TABS.CAMPAIGN.value:
        this.tab = this.TABS.CAMPAIGN.name;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadCampagn, this.TABS.CAMPAIGN.value);
        break;
    }
  }

  changeTotalItem(event) {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    switch (this.tab) {
      case this.TABS.ALL.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
        break;
      case this.TABS.IMPORTANT.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.TABS.IMPORTANT.value);
        break;
      case this.TABS.NOTIFICATIONS.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadNotification, this.TABS.NOTIFICATIONS.value);
        break;
      case this.TABS.CAMPAIGN.name:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadCampagn, this.TABS.CAMPAIGN.value);
        break;
    }
  }

  showDetail(index: number, item: Notification) {
    switch (this.tab) {
      case this.TABS.ALL.name:
        $(`#noti_${index}`).toggleClass('opened');
        if (this.checkAgreementIsRead(item) === true) {
          $(`#noti_${index}`).removeClass('unread');
        }
        break;
      case this.TABS.IMPORTANT.name:
        $(`#important_${index}`).toggleClass('opened');
        if (this.checkAgreementIsRead(item) === true) {
          $(`#important_${index}`).removeClass('unread');
        }
        break;
      case this.TABS.NOTIFICATIONS.name:
        $(`#system_${index}`).toggleClass('opened');
        if (this.checkAgreementIsRead(item) === true) {
          $(`#system_${index}`).removeClass('unread');
        }
        break;
      case this.TABS.CAMPAIGN.name:
        $(`#campain_${index}`).toggleClass('opened');
        if (this.checkAgreementIsRead(item) === true) {
          $(`#campain_${index}`).removeClass('unread');
        }
        break;
    }
    // if (item.agreement_flg === 1) {
    //   this.contentAgeement = item.news_content;
    //   this.agreementID = item.id;
    //   if (item.agree_flg === false) {
    //     return;
    //   }
    // }
    if (this.checkAgreementIsRead(item) === false) {
      return;
    }
    if (!item.read_flg) {
      this.changeReadStatus(item.id);
      this.getTotalNotification();
    }
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
    this.unreadAll = false;
    this.unreadCampagn = false;
    this.unreadImportant = false;
    this.unreadNotification = false;
  }

}
