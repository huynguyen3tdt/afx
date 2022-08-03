import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCALE } from './core/constant/authen-constant';
import { LANGUAGLE } from './core/constant/language-constant';
declare const jqKeyboard: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'afx-front';
  constructor(private translate: TranslateService) {
    jqKeyboard.init();
    if (localStorage.getItem(LOCALE)) {
      const browserLang = localStorage.getItem(LOCALE);
      translate.use(browserLang.match(/en_US|ja_JP/) ? browserLang : 'ja_JP');
    } else {
      localStorage.setItem(LOCALE, LANGUAGLE.japan);
      translate.setDefaultLang(LANGUAGLE.japan);
    }
  }

  ngOnInit(): void {
    this.translate.setDefaultLang(LANGUAGLE.japan);
    this.translate.use(LANGUAGLE.japan);
  }
}
