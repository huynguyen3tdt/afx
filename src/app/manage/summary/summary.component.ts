import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from 'src/app/core/services/user.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  showSummary: boolean;
  showDetail: boolean;
  TAB = {
    summary: 'summary',
    detail: 'detail'
  };
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private userService: UserService,
    private globalService: GlobalService,
  ) { }

  ngOnInit() {
    this.showSummary = true;
  }
  changeTab(type) {
    this.showSummary = type === this.TAB.summary;
    this.showDetail = type === this.TAB.detail;
    this.globalService.callListAccount();
  }

}
