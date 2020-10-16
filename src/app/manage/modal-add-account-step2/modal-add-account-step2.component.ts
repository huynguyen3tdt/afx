import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { LOCALE } from 'src/app/core/constant/authen-constant';
import { LANGUAGLE } from 'src/app/core/constant/language-constant';
declare var $: any;

@Component({
  selector: 'app-modal-add-account-step2',
  templateUrl: './modal-add-account-step2.component.html',
  styleUrls: ['./modal-add-account-step2.component.scss']
})
export class ModalAddAccountStep2Component implements OnInit, OnChanges {
  @ViewChild('modalAddAccountStep2', { static: true }) modal: ModalDirective;
  @Input() accountTradingForm: FormGroup;
  @Output() confirmStep2 = new EventEmitter();
  @Output() returnStep1 = new EventEmitter();

  rulesForm: FormGroup;
  isConfirm: boolean;
  divElement: HTMLElement;
  locale: string;
  language;
  constructor( private fb: FormBuilder) {
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.language = LANGUAGLE;
    this.locale = localStorage.getItem(LOCALE);
  }

  ngOnInit() {
    this.initRulesForm();
    $('.agreement-rules').css('max-height', ($(window).height() * 0.5));
  }

  initRulesForm() {
    this.rulesForm = this.fb.group({
      agree_electronic_delivery: [false, requiredInput],
      agree_contract_tnc: [false, requiredInput],
      agree_fx_tnc: [false, requiredInput],
      agree_tax: [false, requiredInput],
      agree_pep: [false, requiredInput],
    });
  }

  open() {
    this.modal.show();
    this.isConfirm = false;
    this.initRulesForm();
  }

  close() {
    this.modal.hide();
  }

  onConfirm() {
    this.isConfirm = true;
    if (Object.values(this.rulesForm.value).every(Boolean)) {
      this.modal.hide();
      this.confirmStep2.emit();
    }
  }

  onReturnStep1() {
    this.returnStep1.emit();
  }
}
