import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-add-account-step3',
  templateUrl: './modal-add-account-step3.component.html',
  styleUrls: ['./modal-add-account-step3.component.scss']
})
export class ModalAddAccountStep3Component implements OnInit {
  @ViewChild('modalAddAccountStep3', { static: true }) modal: ModalDirective;
  @Output() confirmStep3 = new EventEmitter();
  @Input() isLateRegis: boolean;
  constructor() { }

  ngOnInit() {
  }

  open() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  onConfirm() {
    this.modal.hide();
    this.confirmStep3.emit();
  }
}
