import { Component, OnInit, ViewChild } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  ACCOUNT_IDS,
  ACCOUNT_INSSURANCE,
  ERROR_GEN_ISSUANCE_KEY_EN,
  ERROR_GEN_ISSUANCE_KEY_JP,
  SUCCESS_CLIPBOARD_EN,
  SUCCESS_CLIPBOARD_JP,
  TYPE_SUCCESS_TOAST_EN,
  TYPE_SUCCESS_TOAST_JP,
} from 'src/app/core/constant/authen-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { Metacode } from 'src/app/core/enum/enum-info';
import { AccountType } from 'src/app/core/model/report-response.model';
import { TradingAccount } from 'src/app/core/model/user.model';
import { WithdrawRequestModel } from 'src/app/core/model/withdraw-request-response.model';
import { GlobalService } from 'src/app/core/services/global.service';
import { UserService } from 'src/app/core/services/user.service';
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
  agreeApiPolicyFlg: boolean;
  showAPIAccountFlg: boolean;
  locale: string;
  listApiKey = [];
  LIST_ACCOUNT_ISSURANCE = ACCOUNT_INSSURANCE;
  constructor(
    private withdrawRequestService: WithdrawRequestService,
    private globalService: GlobalService,
    private spinnerService: Ng4LoadingSpinnerService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.listTradingAccount = JSON.parse(localStorage.getItem(ACCOUNT_IDS));
    this.getAccountInformation();

    // If account already had api key, no longer need to accept policy
    this.checkExistApiKeys();
  }

  open() {
    this.modal.show();
    this.checkExistApiKeys();
    this.resetToggleShowKey();
  }

  close() {
    this.modal.hide();
  }

  // Getting account information to show on modal
  getAccountInformation() {
    if (this.listTradingAccount) {
      const listMT5: Observable<WithdrawRequestModel>[] = [];
      this.listTradingAccount.forEach((item) => {
        item.img_type_account = this.globalService.convertTypeToImg(item.account_id);
        if (item.account_id) {
          listMT5.push(this.withdrawRequestService.getmt5Infor(Number(item.account_id)));
        }
      });
      forkJoin(
        listMT5
      ).subscribe((result) => {
        this.listMt5Infor = result;
        this.listMt5Infor.forEach((item, index) => {
          this.listMt5Infor[index].data.account_id = this.listTradingAccount[index].account_id;
          this.listMt5Infor[index].data.account_id_char = this.listTradingAccount[index].value;
          this.listMt5Infor[index].data.account_type = this.listTradingAccount[index].account_type;
        });
        this.listMt5Infor.forEach(item => {
          item.data.img_type_account = this.globalService.convertTypeToImg(item.data.account_id);
          if (item.data.issuance_key) {
            this.listApiKey.push(item);
          }
        });
      });
    }

  }

  toggleDisplayKey(item?) {
    item.is_show_key = !item.is_show_key;
  }

  toggleCheckBox(e) {
    // make checkbox is checked
    this.agreeApiPolicyFlg = e.target.checked;
  }

  toggleShowListAccount() {
    this.showAPIAccountFlg = true;
    // if user tick accept policy they would be able to click button show overview account
    this.agreeApiPolicyFlg = false;
  }

  resetToggleShowKey() {
    if (this.listMt5Infor) {
      this.listMt5Infor.forEach((item => {
        item.data.is_show_key = false;
      }));
    }
  }

  genQuoreaKey(accountID) {
    let messageSuccess;
    let messageErr;
    if (this.locale === LANGUAGLE.english) {
      messageSuccess = TYPE_SUCCESS_TOAST_EN;
      messageErr = ERROR_GEN_ISSUANCE_KEY_EN;
    } else {
      messageSuccess = TYPE_SUCCESS_TOAST_JP;
      messageErr = ERROR_GEN_ISSUANCE_KEY_JP;
    }
    const param: TradingAccount = {
      trading_account_id: accountID
    };
    this.spinnerService.show();
    this.userService.genQuoreaKey(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === Metacode.SUCCESS) {
        this.getAccountInformation();
        this.toastr.success(messageSuccess);
      } else {
        this.toastr.error(messageErr);
      }
    });
  }

  copyMessage(val: string) {
    let message;
    if (this.locale === LANGUAGLE.english) {
      message = SUCCESS_CLIPBOARD_EN;
    } else {
      message = SUCCESS_CLIPBOARD_JP;
    }
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success(message);
  }

  checkExistApiKeys() {
      // Show agreement policy when we have less than 2 account with issuance key ( FX and I-CFD)
    if (this.listApiKey.length !== 0) {
      this.showAPIAccountFlg = true;
    } else {
      this.showAPIAccountFlg = false;
      this.agreeApiPolicyFlg = false;
    }
  }
}
