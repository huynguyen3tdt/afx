import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { LOCALE } from 'src/app/core/constant/authen-constant';


@Component({
  selector: 'app-modal-deposit-withdraw',
  templateUrl: './modal-deposit-withdraw.component.html',
  styleUrls: ['./modal-deposit-withdraw.component.scss']
})
export class ModalDepositWithdrawComponent implements OnInit {
  @ViewChild('modalRule', { static: true }) modal: ModalDirective;
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
