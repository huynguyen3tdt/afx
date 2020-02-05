import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {

  constructor(private translateee: TranslateService) { }

  ngOnInit() {
  }

  changeLang(event) {
    this.translateee.use(event);
  }

}
