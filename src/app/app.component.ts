import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCALE } from './core/constant/authen-constant';
import { LANGUAGLE } from './core/constant/language-constant';
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
      console.log('browserLang ', browserLang);
      translate.use(browserLang.match(/en_US|ja_JP/) ? browserLang : 'en_US');
    } else {
      localStorage.setItem(LOCALE, LANGUAGLE.english);
      translate.setDefaultLang(LANGUAGLE.english);
    }
  }

  ngOnInit(): void {
  }
}
