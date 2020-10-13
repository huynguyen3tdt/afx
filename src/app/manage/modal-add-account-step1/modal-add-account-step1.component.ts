import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-add-account-step1',
  templateUrl: './modal-add-account-step1.component.html',
  styleUrls: ['./modal-add-account-step1.component.scss']
})
export class ModalAddAccountStep1Component implements OnInit {
  @ViewChild('modalAddAccountStep1', { static: true }) modal: ModalDirective;
  @Input() accountTradingForm: FormGroup;
  @Output() confirmStep1 = new EventEmitter();
  isConfirm: boolean;
  constructor() { }

  ngOnInit() {
    this.isConfirm = false;
  }

  open() {
    this.modal.show();
    if (this.accountTradingForm.controls.afxAccount) {
      this.accountTradingForm.controls.afxAccount.setValue(false);
    }
    if (this.accountTradingForm.controls.cfdAccount) {
      this.accountTradingForm.controls.cfdAccount.setValue(false);
    }
    if (this.accountTradingForm.controls.cfdCommunityAccount) {
      this.accountTradingForm.controls.cfdCommunityAccount.setValue(false);
    }
  }

  openWithOutReset() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  onConfirm() {
    this.isConfirm = true;
    if (Object.values(this.accountTradingForm.value)[0] || Object.values(this.accountTradingForm.value)[1]) {
      this.modal.hide();
      this.confirmStep1.emit();
      return;
    }

    this.accountTradingForm.setErrors({incorrect: true});
    return;
  }

}
