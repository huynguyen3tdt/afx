import { Directive, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[formControlName][currency]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '(ngModelChange)': 'onInputChange($event)'
  }
})
export class CurrencyDirective {
  @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();
  constructor(public model: NgControl) { }

  onInputChange(event: any) {
    if (event) {
      const numeral = require('numeral');
      const newVal = numeral(event).format('0,0');
      const rawValue = newVal;
      this.model.valueAccessor.writeValue(newVal);
      this.rawChange.emit(rawValue);
    }

  }
}
