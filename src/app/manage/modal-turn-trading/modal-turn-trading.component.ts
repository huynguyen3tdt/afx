import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {UserService} from '../../core/services/user.service';
import {ToastrService} from 'ngx-toastr';
import {GlobalService} from '../../core/services/global.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {
  FAILED_REGIST_TURN_TRADING_EN,
  FAILED_REGIST_TURN_TRADING_JP, LOCALE,
  SUCCESS_REGIST_TURN_TRADING_EN,
  SUCCESS_REGIST_TURN_TRADING_JP,
  TYPE_SUCCESS_TOAST_EN,
  TYPE_SUCCESS_TOAST_JP
} from '../../core/constant/authen-constant';
import {AccountType} from '../../core/model/report-response.model';
import {WithdrawRequestService} from '../../core/services/withdraw-request.service';
import {take} from 'rxjs/operators';
import {Metacode} from '../../core/enum/enum-info';
import {LANGUAGLE} from '../../core/constant/language-constant';

@Component({
  selector: 'app-modal-turn-trading',
  templateUrl: './modal-turn-trading.component.html',
  styleUrls: ['./modal-turn-trading.component.scss']
})
export class ModalTurnTradingComponent implements OnInit {
  @ViewChild('modalTurnTrading', { static: true }) modal: ModalDirective;
  @Output() dismiss: EventEmitter<boolean> = new EventEmitter<boolean>();

  agreePolicyFlg: any;
  listTradingAccount: Array<AccountType>;
  locale: string;

  constructor(
    private withdrawRequestService: WithdrawRequestService,
    private globalService: GlobalService,
    private spinnerService: Ng4LoadingSpinnerService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.locale = localStorage.getItem(LOCALE);
  }

  toggleCheckBox(e) {
    this.agreePolicyFlg = e.target.checked;
  }

  open() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  sendApplication() {
    let messageSuccess;
    let messageErr;
    if (this.locale === LANGUAGLE.english) {
      messageSuccess = SUCCESS_REGIST_TURN_TRADING_EN;
      messageErr = FAILED_REGIST_TURN_TRADING_EN;
    } else {
      messageSuccess = SUCCESS_REGIST_TURN_TRADING_JP;
      messageErr = FAILED_REGIST_TURN_TRADING_JP;
    }
    this.spinnerService.show();
    this.userService.turnTradingAccept().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      this.modal.hide();
      if (response.meta.code === Metacode.SUCCESS) {
        this.toastr.success(messageSuccess);
        this.dismiss.emit(false);
      } else {
        const failedAccounts = response.data.failed_accounts;
        messageErr = `${failedAccounts} ${messageErr}`;
        this.toastr.warning(messageErr);
      }
    });
  }

}
