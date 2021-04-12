import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
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
import { PL001, PL002, PL003, PL004, PL005, PL006, BIZ_GROUP } from 'src/app/core/constant/user-code-constant';
import { ModalCanNotAddAccountComponent } from '../modal-can-not-add-account/modal-can-not-add-account.component';
import { CCFD_IMAGE, ICFD_IMAGE, FX_IMAGE } from 'src/app/core/constant/img-constant';
import { TranslateService } from '@ngx-translate/core';
import { ModalApiKeyComponent } from '../modal-api-key/modal-api-key.component';

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
  isLateRegis: boolean;
  accountTradingForm: FormGroup;
  currentTime: Date;
  bizGroup: string;

  @ViewChild('modalAddAccountStep1', { static: false }) modalAddAccountStep1: ModalAddAccountStep1Component;
  @ViewChild('modalAddAccountStep2', { static: false }) modalAddAccountStep2: ModalAddAccountStep2Component;
  @ViewChild('modalAddAccountStep3', { static: false }) modalAddAccountStep3: ModalAddAccountStep3Component;
  @ViewChild('modalCanNotAddAccount', { static: false }) modalCanNotAddAccount: ModalCanNotAddAccountComponent;
  @ViewChild('modalApiKey', { static: false }) modalApiKey: ModalApiKeyComponent;

  constructor(private router: Router, private authenService: AuthenService,
              private notificationsService: NotificationsService,
              private globalService: GlobalService,
              private fb: FormBuilder,
              private userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService,
              private translate: TranslateService
              ) {
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.activeRouter(this.router.url);
        if (localStorage.getItem(TOKEN_AFX)) {
          this.globalService.callListAccount();
        }
      }
    });
  }

  ngOnInit() {
    this.checkDevice();
    this.locale = localStorage.getItem(LOCALE);
    this.bizGroup = localStorage.getItem(BIZ_GROUP);
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.globalService.recallUnread.subscribe(response => {
      if (response === 'recall') {
        this.getListNotifications(this.pageSize, this.currentPage, this.unreadAll, this.TABS.ALL.value);
      }
    });
    this.globalService.recallLanguage.subscribe(response => {
      if (response) {
        this.locale = response;
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

  changeLang(language) {
    this.translate.use(language);
    localStorage.setItem(LOCALE, language);
    const param = {
      lang: language
    };
    this.userService.changeLanguage(param).pipe(take(1)).subscribe(response => {
      this.locale = localStorage.getItem(LOCALE);
      this.globalService.changeLanguage(language);
    });
  }

  callListAccount() {
    this.spinnerService.show();
    this.userService.getUserListAccount().subscribe(value => {
        this.spinnerService.hide();
        const listAccount = [];
        if (value.meta.code === 200) {
          value.data.list_account.map(el => {
            if (el.trading_account_id) {
              listAccount.push(el);
            }
          });
          const param = this.globalService.getListAccountIds(this.globalService.sortListAccount(listAccount));
          localStorage.setItem(ACCOUNT_IDS, JSON.stringify(param));
        }
      });
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

  openApiKeyModal() {
  this.spinnerService.show();
  this.modalApiKey.open();
  this.userService.getUserListAccount().pipe(take(1)).subscribe(response => {
    this.spinnerService.hide();
    if (response.meta.code === 200) {
      this.accountTradingForm = this.fb.group({
        afxAccount: [false],
        cfdAccount: [false],
        cfdComAccount: [false],
      });
    }
  });
}


  openAddAccountModal() {
    this.spinnerService.show();
    this.userService.getUserListAccount().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.accountTradingForm = this.fb.group({
          afxAccount: [false],
          cfdAccount: [false],
          cfdCommunityAccount: [false],
        });
        response.data.list_account.map(value => {
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
      if (!Object.keys(this.accountTradingForm.value).length) {
        this.modalCanNotAddAccount.open();
      } else {
        this.modalAddAccountStep1.open();
      }
      if (response.data.next_audit_date === null) {
        this.isLateRegis = true;
      } else {
        const nextAuditDate = moment(response.data.next_audit_date).format('YYYY-MM-DD');
        const currentTime = new Date();
        const currentTimeUTC = moment(currentTime.toUTCString()).format('YYYY-MM-DD');
        this.isLateRegis = Date.parse(currentTimeUTC) >= Date.parse(nextAuditDate) ? true : false;
      }
    });
  }

  onConfirmStep1() {
    this.modalAddAccountStep2.open();
  }

  onConfirmStep2() {
    this.spinnerService.show();
    const param: GroupAccountType = {
      group_account_type: []
    };
    if (this.accountTradingForm.controls.afxAccount && this.accountTradingForm.controls.afxAccount.value) {
      param.group_account_type.push({
        lp_code: localStorage.getItem(IS_COMPANY) === 'true' ? PL002 : PL001,
      });
    }
    if (this.accountTradingForm.controls.cfdAccount && this.accountTradingForm.controls.cfdAccount.value) {
      param.group_account_type.push({
        lp_code: localStorage.getItem(IS_COMPANY) === 'true' ? PL004 : PL003,
      });
    }
    if (this.accountTradingForm.controls.cfdCommunityAccount && this.accountTradingForm.controls.cfdCommunityAccount.value) {
      param.group_account_type.push({
        lp_code: localStorage.getItem(IS_COMPANY) === 'true' ? PL006 : PL005,
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
        this.modalAddAccountStep3.open();
      }
    }
      );
  }

  onReturnStep1() {
    this.modalAddAccountStep2.close();
    this.modalAddAccountStep1.openWithOutReset();
  }
}
