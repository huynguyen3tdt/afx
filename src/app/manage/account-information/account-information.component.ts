import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
  public listAccountInfor;

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
      if (response.status === 200) {
        this.listAccountInfor = response.body.data;

      }
    });
  }
}
