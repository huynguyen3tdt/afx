import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-can-not-add-account',
  templateUrl: './modal-can-not-add-account.component.html',
  styleUrls: ['./modal-can-not-add-account.component.scss']
})
export class ModalCanNotAddAccountComponent implements OnInit {
  @ViewChild('modalCanNotAddAccount', { static: true }) modal: ModalDirective;
  constructor() { }

  ngOnInit() {
  }

  open() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

}
