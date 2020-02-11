import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_AFX } from 'src/app/core/constant/authen-constant';
import { AuthenService } from 'src/app/core/services/authen.service';
declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authenService: AuthenService) { }

  ngOnInit() {
    this.layout_setup();
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
    // tslint:disable-next-line:variable-name
    const screen_height = $(window).height();
    // tslint:disable-next-line:variable-name
    const header_height = $('.header-wrapper').outerHeight();
    // tslint:disable-next-line:variable-name
    const footer_height = $('.footer-wrapper').outerHeight();

    // tslint:disable-next-line:variable-name
    const main_height = screen_height - header_height - footer_height;

    $('.main-wrapper').css('min-height', main_height);
  }
}
