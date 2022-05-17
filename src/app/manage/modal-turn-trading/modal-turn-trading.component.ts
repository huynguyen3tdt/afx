import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {UserService} from '../../core/services/user.service';
import {ToastrService} from 'ngx-toastr';
import {GlobalService} from '../../core/services/global.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ACCOUNT_IDS} from '../../core/constant/authen-constant';
import {AccountType} from '../../core/model/report-response.model';
import {forkJoin} from 'rxjs';
import {WithdrawRequestModel} from '../../core/model/withdraw-request-response.model';
import {Observable} from 'rxjs/internal/Observable';
import {WithdrawRequestService} from '../../core/services/withdraw-request.service';

@Component({
  selector: 'app-modal-turn-trading',
  templateUrl: './modal-turn-trading.component.html',
  styleUrls: ['./modal-turn-trading.component.scss']
})
export class ModalTurnTradingComponent implements OnInit {
  @ViewChild('modalTurnTrading', { static: true }) modal: ModalDirective;

  agreeApiPolicyFlg: any;
  showAPIAccountFlg: false;
  listTradingAccount: Array<AccountType>;

  constructor(
    private withdrawRequestService: WithdrawRequestService,
    private globalService: GlobalService,
    private spinnerService: Ng4LoadingSpinnerService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
  }

  toggleCheckBox(e) {
    this.agreeApiPolicyFlg = e.target.checked;
  }

  open() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  sendApplication() {

  }

}
