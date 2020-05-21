import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TOKEN_AFX, FIRST_LOGIN, LOCALE, ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PageNotificationResponse, Notification } from 'src/app/core/model/page-noti.model';
import * as moment from 'moment';
import { EN_FORMATDATE, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { AccountType } from 'src/app/core/model/report-response.model';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { take } from 'rxjs/operators';
import { GlobalService } from 'src/app/core/services/global.service';
declare const $: any;
declare const TweenMax: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  listNotification: Array<Notification>;
  pageNotification: PageNotificationResponse;
  currentPage;
  pageSize;
  unreadAll: boolean;
  formatDateYear: string;
  locale: string;
  TABS = {
    ALL: { name: 'ALL', value: -1 },
    IMPORTANT: { name: 'IMPORTANT', value: 0 },
    NOTIFICATIONS: { name: 'NOTIFICATIONS', value: 1 },
    CAMPAIGN: { name: 'CAMPAIGN', value: 2 }
  };
  listTradingAccount: Array<AccountType>;
  accountID: string;
  isPc: boolean;
  isAndroid: boolean;
  isIos: boolean;

  constructor(private router: Router, private authenService: AuthenService,
              private notificationsService: NotificationsService,
              private globalService: GlobalService) {
    this.router.events.subscribe((e: any) => {
      this.activeRouter(this.router.url);
    });
  }

  ngOnInit() {
    this.checkDevice();
    this.locale = localStorage.getItem(LOCALE);
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.globalService.recallUnread.subscribe(response => {
      if (response === 'recall') {
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
      }
    });
    if (this.locale === LANGUAGLE.english) {
      this.formatDateYear = EN_FORMATDATE;
    } else if (this.locale === LANGUAGLE.japan) {
      this.formatDateYear = JAPAN_FORMATDATE;
    }
    this.unreadAll = true;
    this.layout_setup();
    this.currentPage = 1;
    this.pageSize = 3;
    if (this.listTradingAccount) {
      this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
    }
  }

  activeRouter(url) {
    url = url.split('/')[2];
    if (url && url.indexOf('?') > -1 ) {
      url = url.substring(0, url.indexOf('?'));
    }
    const listRouter = ['notifications', 'deposit', 'withdrawRequest', 'withdrawHistory', 'reportList', 'accountInfo'];
    listRouter.forEach(element => {
      if (url === element) {
        $(`#${element}`).addClass('active');
      } else {
        $(`#${element}`).removeClass('active');
      }
    });
  }

  logout() {
    this.authenService.logout().subscribe(response => {
      if (response.meta.code === 200) {
        localStorage.removeItem(TOKEN_AFX);
        this.router.navigate(['/login']);
      }
    });
  }

  openSubNav() {
    $('.offcanvas-overlay').addClass('show');
  }

  layout_setup() {
    function offcanvas_subnav() {
      $('.nav.offcanvas-nav > .nav-item.has-child > .nav-link > .toggle').click(() => {
        $(this).parents('.nav-item.has-child').toggleClass('opened');
      });
    }
    offcanvas_subnav();

    function open_offcanvas() {
      $('.offcanvas-overlay').addClass('show');
    }

    function close_offcanvas() {
      TweenMax.to('.offcanvas-wrapper', 0.5, { x: -360, opacity: 0 });
      setTimeout(() => {
        $('.offcanvas-overlay').removeClass('show');
        TweenMax.to('.offcanvas-wrapper', 0, { x: 0, opacity: 1 });
      }, 500);
    }

    $('.offcanvas-open').click(() => {
      open_offcanvas();
      TweenMax.from('.offcanvas-wrapper', 0.5, { x: -360, opacity: 0 });
    });

    $('.btn-offcanvas-close').click(() => {
      close_offcanvas();
    });
  }
  getListNotifications(pageSize: number, pageNumber: number, unread: boolean, type?: number) {
    this.listNotification = [];
    this.notificationsService.getListNotifications(pageSize, pageNumber, unread, type).subscribe(response => {
      if (response.meta.code === 200) {
        this.pageNotification = response;
        this.listNotification = this.pageNotification.data.results;
        this.listNotification.forEach(item => {
          item.publish_date = moment(item.publish_date).format(this.formatDateYear);
        });
      }
    });
  }

  checkDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // tslint:disable-next-line:no-string-literal
    const userAgent = navigator.userAgent || navigator.vendor || window['opera'];
    if (isMobile) {
      this.isPc = false;
      if (/android/i.test(userAgent)) {
        this.isAndroid = true;
    }
      // tslint:disable-next-line:no-string-literal
      if (/iPad|iPhone|iPod/.test(userAgent) && !window['MSStream']) {
        this.isIos = true;
    }
    } else {
      this.isPc = true;
    }
  }
}
