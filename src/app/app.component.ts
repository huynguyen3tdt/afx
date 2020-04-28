import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCALE } from './core/constant/authen-constant';
declare const jqKeyboard: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'afx-front';
  constructor(private translate: TranslateService) {
    jqKeyboard.init();
    if (localStorage.getItem(LOCALE)) {
      const browserLang = localStorage.getItem(LOCALE);
      translate.use(browserLang.match(/en|jp/) ? browserLang : 'en');
    } else {
      localStorage.setItem(LOCALE, 'en');
      translate.setDefaultLang('en');
    }
  }

  ngOnInit(): void {
  }
}
