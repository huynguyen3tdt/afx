import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
import { LOCALE } from 'src/app/core/constant/authen-constant';

@Component({
  selector: 'app-modal-add-account-step3',
  templateUrl: './modal-add-account-step3.component.html',
  styleUrls: ['./modal-add-account-step3.component.scss']
})
export class ModalAddAccountStep3Component implements OnInit, OnChanges {
  @ViewChild('modalAddAccountStep3', { static: true }) modal: ModalDirective;
  @Input() isLateRegis: boolean;
  locale: string;
  language;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
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
