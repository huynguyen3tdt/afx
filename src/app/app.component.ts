import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translate.use(browserLang.match(/en|jp/) ? browserLang : 'en');
    } else {
      localStorage.setItem('locale', 'en');
      translate.setDefaultLang('en');
    }
  }

  ngOnInit(): void {
  }
}
