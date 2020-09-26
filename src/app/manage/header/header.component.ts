import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TOKEN_AFX, FIRST_LOGIN, LOCALE, ACCOUNT_IDS, IS_COMPANY, ACCOUNT_TYPE } from 'src/app/core/constant/authen-constant';
import { AuthenService } from 'src/app/core/services/authen.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PageNotificationResponse, Notification } from 'src/app/core/model/page-noti.model';
import * as moment from 'moment';
import { EN_FORMATDATE, JAPAN_FORMATDATE } from 'src/app/core/constant/format-date-constant';
import { AccountType } from 'src/app/core/model/report-response.model';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { take } from 'rxjs/operators';
import { GlobalService } from 'src/app/core/services/global.service';
import { ModalAddAccountStep1Component } from '../modal-add-account-step1/modal-add-account-step1.component';
import { ModalAddAccountStep2Component } from '../modal-add-account-step2/modal-add-account-step2.component';
import { ModalAddAccountStep3Component } from '../modal-add-account-step3/modal-add-account-step3.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AccountTypeAFX, GroupAccountType } from 'src/app/core/model/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PL001, PL002, PL003, PL004, PL005, PL006 } from 'src/app/core/constant/user-code-constant';

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
  accountTradingForm: FormGroup;

  @ViewChild('modalAddAccountStep1', { static: false }) modalAddAccountStep1: ModalAddAccountStep1Component;
  @ViewChild('modalAddAccountStep2', { static: false }) modalAddAccountStep2: ModalAddAccountStep2Component;
  @ViewChild('modalAddAccountStep3', { static: false }) modalAddAccountStep3: ModalAddAccountStep3Component;

  constructor(private router: Router, private authenService: AuthenService,
              private notificationsService: NotificationsService,
              private globalService: GlobalService,
              private fb: FormBuilder,
              private userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService,
              ) {
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
    this.initAccountTradingForm();
  }

  initAccountTradingForm() {
    this.accountTradingForm = this.fb.group({
      afxAccount: [false],
      cfdAccount: [false],
      cfdCommunityAccount: [false],
    });
    if (localStorage.getItem(ACCOUNT_IDS)) {
      const accountType: AccountTypeAFX[] = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
      accountType.map(value => {
        switch (value.account_type) {
          case 1 :
            this.accountTradingForm.removeControl('afxAccount');
            break;
          case 2:
            this.accountTradingForm.removeControl('cfdAccount');
            break;
          case 3:
            this.accountTradingForm.removeControl('cfdCommunityAccount');
            break;
        }
      });
    }
  }

  activeRouter(url) {
    url = url.split('/')[2];
    if (url && url.indexOf('?') > -1 ) {
      url = url.substring(0, url.indexOf('?'));
    }
    const listRouter = ['notifications', 'deposit', 'withdrawRequest',
    'withdrawHistory', 'reportList', 'accountInfo', 'summary', 'internal'];
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

  openAddAccountModal() {
    this.modalAddAccountStep1.open();
  }

  onConfirmStep1() {
    this.modalAddAccountStep2.open();
  }

  onConfirmStep2() {
    this.modalAddAccountStep3.open();
  }

  onConfirmStep3() {
    this.spinnerService.show();
    const param: GroupAccountType = {
      group_account_type: []
    };
    if (this.accountTradingForm.controls.afxAccount && this.accountTradingForm.controls.afxAccount.value) {
      param.group_account_type.push({
        lp_code: localStorage.getItem(IS_COMPANY) === 'true' ? PL002 : PL001,
        account_type: '1'
      });
    }
    if (this.accountTradingForm.controls.cfdAccount && this.accountTradingForm.controls.cfdAccount.value) {
      param.group_account_type.push({
        lp_code: localStorage.getItem(IS_COMPANY) === 'true' ? PL004 : PL003,
        account_type: '2'
      });
    }
    if (this.accountTradingForm.controls.cfdCommunityAccount && this.accountTradingForm.controls.cfdCommunityAccount.value) {
      param.group_account_type.push({
        lp_code: localStorage.getItem(IS_COMPANY) === 'true' ? PL006 : PL005,
        account_type: '3'
      });
    }
    this.userService.registrationAccountType(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        param.group_account_type.map(value => {
          switch (value.account_type) {
            case ACCOUNT_TYPE.ACCOUNT_FX.account_type.toString():
              this.accountTradingForm.removeControl('afxAccount');
              break;
            case ACCOUNT_TYPE.ACCOUNT_CFDIndex.account_type.toString():
              this.accountTradingForm.removeControl('cfdAccount');
              break;
            case ACCOUNT_TYPE.ACCOUNT_CFDCom.account_type.toString():
              this.accountTradingForm.removeControl('cfdCommunityAccount');
              break;
          }
        });
      }
    }
      );
  }

  onReturnStep1() {
    this.modalAddAccountStep2.close();
    this.modalAddAccountStep1.open();
  }
}
