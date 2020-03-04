import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TOKEN_AFX } from 'src/app/core/constant/authen-constant';
import { AuthenService } from 'src/app/core/services/authen.service';
declare const $: any;
declare const TweenMax: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private authenService: AuthenService) {
    this.router.events.subscribe((e: any) => {
      this.activeRouter(this.router.url);
    });
  }

  ngOnInit() {
    this.layout_setup();
  }

  activeRouter(url) {
    url = url.split('/')[2];
    if (url.indexOf('?') > -1 ) {
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
}
