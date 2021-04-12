import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment-timezone';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { ACCOUNT_IDS } from 'src/app/core/constant/authen-constant';
import { AccountType } from 'src/app/core/model/report-response.model';
import { WithdrawRequestModel } from 'src/app/core/model/withdraw-request-response.model';
import { GlobalService } from 'src/app/core/services/global.service';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';

@Component({
  selector: 'app-modal-api-key',
  templateUrl: './modal-api-key.component.html',
  styleUrls: ['./modal-api-key.component.scss']
})
export class ModalApiKeyComponent implements OnInit {
  @ViewChild('modalApiKey', { static: true }) modal: ModalDirective;
  listTradingAccount: Array<AccountType>;
  listMt5Infor: Array<WithdrawRequestModel> = [];
  latestTime: string;
  timeZone: string;
  formatDateHour: string;
  constructor(private withdrawRequestService: WithdrawRequestService,
              private globalService: GlobalService,
              private spinnerService: Ng4LoadingSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.getAccountInformation();
  }

  open() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  getAccountInformation() {
    if (this.listTradingAccount) {
      const listMT5: Observable<WithdrawRequestModel> [] = [];
      this.listTradingAccount.forEach((item) => {
        item.img_type_account = this.globalService.convertTypeToImg(item.account_id);
        if (item.account_id) {
          listMT5.push(this.withdrawRequestService.getmt5Infor(Number(item.account_id)));
        }
      });
      forkJoin (
        listMT5
      ).subscribe((result) => {
        this.listMt5Infor = result;
        this.listMt5Infor.forEach((item, index) => {
          this.listMt5Infor[index].data.account_id = this.listTradingAccount[index].account_id;
        });
        this.listMt5Infor.forEach(item => {
          item.data.img_type_account = this.globalService.convertTypeToImg(item.data.account_id);
          this.latestTime = moment(item.data.lastest_time).tz(this.timeZone).format(this.formatDateHour);
        });
      });
    }
  }

toggleDisplayKey(item?) {
    item.is_show_key = !item.is_show_key;
  }
}
