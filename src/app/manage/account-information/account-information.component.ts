import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model } from 'src/app/core/model/withdraw-request-response.model';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
  accountInfor: Mt5Model;

  constructor(private translateee: TranslateService,
              private withdrawRequestService: WithdrawRequestService) { }

  ngOnInit() {
    this.getMt5Infor();
  }

  changeLang(event) {
    this.translateee.use(event);
  }

  getMt5Infor() {
    this.withdrawRequestService.getmt5Infor().subscribe(response => {
      if (response.meta.code === 200) {
        this.accountInfor = response.data;
      }
    });
  }
}
