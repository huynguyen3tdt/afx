import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { LOCALE } from 'src/app/core/constant/authen-constant';
import { AccountType } from 'src/app/core/model/report-response.model';


@Component({
  selector: 'app-modal-deposit-withdraw',
  templateUrl: './modal-deposit-withdraw.component.html',
  styleUrls: ['./modal-deposit-withdraw.component.scss']
})
export class ModalDepositWithdrawComponent implements OnInit {
  @ViewChild('modalRule', { static: true }) modal: ModalDirective;
  @Input() minDeposit: number;
  @Input() minWithDraw: number;
  @Input() tradingAccount: AccountType;
  language;
  locale: string;
  constructor() { }

  ngOnInit() {
    this.language = LANGUAGLE;
    this.locale = localStorage.getItem(LOCALE);
  }

  open() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

}
