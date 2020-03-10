import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PageNotificationResponse, Notification, TotalNotification } from 'src/app/core/model/page-noti.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { ActivatedRoute } from '@angular/router';
import { FIRST_LOGIN } from 'src/app/core/constant/authen-constant';
declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('importantTab', { static: false }) importantTab: ElementRef;
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
  TABS = {
    ALL: { name: 'ALL', value: -1 },
    IMPORTANT: { name: 'IMPORTANT', value: 0 },
    NOTIFICATIONS: { name: 'NOTIFICATIONS', value: 1 },
    CAMPAIGN: { name: 'CAMPAIGN', value: 2 }
  };

  constructor(
    private notificationsService: NotificationsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.initFilterRead();
    this.currentPage = 1;
    this.pageSize = 10;
    this.checkAgreement = false;
    this.activatedRoute.queryParams.subscribe(param => {
      if (param.fisrtLogin) {
        this.showNoti = true;
      } else {
        this.showNoti = false;
      }
    });
    this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
    this.initFormAgreement();
    this.getTotalNotification();
  }

  initFormAgreement() {
    this.formAgreement = new FormGroup({
      checkAgreement: new FormControl(false, requiredInput)
    });
  }
  getListNotifications(pageSize: number, pageNumber: number, unread: boolean, type?: number) {
    this.checkTab(type);
    this.listNotification = [];
    if (type !== -1) {
      localStorage.setItem(FIRST_LOGIN, '0');
    }
    this.spinnerService.show();
    this.notificationsService.getListNotifications(pageSize, pageNumber, unread, type).subscribe(response => {
      if (response.meta.code === 200) {
        this.pageNotification = response;
        this.listNotification = this.pageNotification.data.results;
        this.listNotification.forEach(item => {
          item.publish_date = moment(item.publish_date).format('YYYY/MM/DD HH:MM');
        });
        this.totalItem = this.pageNotification.data.count;
        this.spinnerService.hide();
        this.recordFrom = this.pageSize * (this.currentPage - 1) + 1;
        this.recordTo = this.recordFrom + (this.listNotification.length - 1);
      }
    });
    this.getTotalNotification();
  }
  getTotalNotification() {
    this.notificationsService.getTotalNotification().subscribe(response => {
      if (response.meta.code === 200) {
        this.totalNoti = response.data;
        this.totalCampagn = this.totalNoti.campaign;
        this.totalImportant = this.totalNoti.important;
        this.totalNotification = this.totalNoti.notification;
        this.totalAll = this.totalCampagn + this.totalImportant + this.totalNotification;
        if (this.showNoti === true && this.tab === 'ALL'
          && (localStorage.getItem(FIRST_LOGIN) === '1')
          && this.totalImportant > 0) {
          $('#notice_important').modal('show');
          this.importantTab.nativeElement.click();
        }
      }
    });
  }
  changeReadStatus(id: number) {
    const param = {
      noti_id: id
    };
    this.notificationsService.changeReadStatus(param).subscribe(response => {
    });
    this.getTotalNotification();
  }

  filterUnreadNoti() {
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
    // if (this.formAgreement.controls.checkAgreement.value === false) {
    //   return;
    // }
    const param = {
      noti_id: this.agreementID
    };
    this.notificationsService.changeAgreementStatus(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.checkAgreement = false;
        if (this.tab === this.TABS.ALL.name) {
          this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
        } else {
          this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.TABS.IMPORTANT.value);
        }
      }
    });
    this.checkAgreement = false;
    this.getTotalNotification();
  }

  hideAgreementModal() {
    this.checkAgreement = false;
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
    if (item.agreement_flg === 1) {
      this.contentAgeement = item.news_content;
      this.agreementID = item.id;
    }
    switch (this.tab) {
      case this.TABS.ALL.name:
        $(`#noti_${index}`).toggleClass('opened');
        $(`#noti_${index}`).removeClass('unread');
        break;
      case this.TABS.IMPORTANT.name:
        if (item.agreement_flg === 0) {
          $(`#important_${index}`).toggleClass('opened');
          $(`#important_${index}`).removeClass('unread');
        } else {
          $(`#important_${index}`).toggleClass('opened');
          $(`#important_${index}`).removeClass('unread');
        }
        break;
      case this.TABS.NOTIFICATIONS.name:
        $(`#system_${index}`).toggleClass('opened');
        $(`#system_${index}`).removeClass('unread');
        break;
      case this.TABS.CAMPAIGN.name:
        $(`#campain_${index}`).toggleClass('opened');
        $(`#campain_${index}`).removeClass('unread');
        break;
    }
    this.changeReadStatus(item.id);
    this.getTotalNotification();
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
