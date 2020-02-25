import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PageNotificationResponse, Notification } from 'src/app/core/model/page-noti.model';
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
  unreadAll: boolean;
  unreadImportant: boolean;
  unreadNotification: boolean;
  unreadCampagn: boolean;
  checkType: any;
  TABS = {
    ALL: 'ALL',
    IMPORTANT: 'IMPORTANT',
    NOTIFICATIONS: 'NOTIFICATIONS',
    CAMPAIGN: 'CAMPAIGN'
  };
  CHECKTAB = {
    ALL: -1,
    IMPORTANT: 0,
    NOTIFICATIONS: 1,
    CAMPAIGN: 2
  };

  constructor(
    private notificationsService: NotificationsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.unreadAll = false;
    this.unreadCampagn = false;
    this.unreadImportant = false;
    this.unreadNotification = false;
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
    this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.CHECKTAB.ALL);
    this.initFormAgreement();
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
        this.totalCampagn = this.pageNotification.data.results.total_noti.campaign;
        this.totalImportant = this.pageNotification.data.results.total_noti.important;
        this.totalNotification = this.pageNotification.data.results.total_noti.notification;
        this.totalAll = this.totalCampagn + this.totalImportant + this.totalNotification;
        this.listNotification = this.pageNotification.data.results.noti_list;
        this.listNotification.forEach(item => {
          item.create_date = moment(item.create_date).format('YYYY/MM/DD HH:MM');
        });
        this.totalItem = this.pageNotification.data.count;
        this.spinnerService.hide();
        if (this.showNoti === true && this.tab === 'ALL'
          && (this.pageNotification.data.results.total_noti.important > 0)
          && (localStorage.getItem(FIRST_LOGIN) === '1')) {
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
  }

  filterUnreadNoti() {
    switch (this.tab) {
      case this.TABS.ALL:
        this.unreadAll = !this.unreadAll;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.CHECKTAB.ALL);
        break;
      case this.TABS.IMPORTANT:
        this.unreadImportant = !this.unreadImportant;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.CHECKTAB.IMPORTANT);
        break;
      case this.TABS.NOTIFICATIONS:
        break;
      case this.TABS.CAMPAIGN:
        break;
    }
  }

  confirmAgreement() {
    if (this.formAgreement.controls.checkAgreement.value === false) {
      return;
    }
    const param = {
      noti_id: this.agreementID
    };
    this.notificationsService.changeAgreementStatus(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.checkAgreement = false;
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.CHECKTAB.IMPORTANT);
        $('#agreementmd').modal('hide');
      }
    });
    this.checkAgreement = false;
  }

  hideAgreementModal() {
    this.checkAgreement = false;
  }

  pageChanged(event) {
    this.currentPage = event.page;
    switch (this.tab) {
      case this.TABS.ALL:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.CHECKTAB.ALL);
        break;
      case this.TABS.IMPORTANT:
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadImportant, this.CHECKTAB.IMPORTANT);
        break;
      case this.TABS.NOTIFICATIONS:
        break;
      case this.TABS.CAMPAIGN:
        break;
    }
  }

  checkTab(type: number) {
    switch (type) {
      case this.CHECKTAB.ALL:
        this.tab = this.TABS.ALL;
        break;
      case this.CHECKTAB.IMPORTANT:
        this.tab = this.TABS.IMPORTANT;
        break;
      case this.CHECKTAB.NOTIFICATIONS:
        this.tab = this.TABS.NOTIFICATIONS;
        break;
      case this.CHECKTAB.CAMPAIGN:
        this.tab = this.TABS.CAMPAIGN;
        break;
    }
  }

  showDetail(index: number, item: Notification) {
    switch (this.tab) {
      case 'ALL':
        $(`#noti_${index}`).toggleClass('opened');
        $(`#noti_${index}`).removeClass('unread');
        break;
      case 'IMPORTANT':
        if (item.agreement_flg === 0) {
          $(`#important_${index}`).toggleClass('opened');
          $(`#important_${index}`).removeClass('unread');
        } else {
          $(`#important_${index}`).removeClass('unread');
          this.contentAgeement = item.news_content;
          this.agreementID = item.id;
          $('#agreementmd').modal('show');
        }
        break;
    }
    this.changeReadStatus(item.id);
  }

  showimportant() {
    $('.test').toggleClass('opened');
  }

}
