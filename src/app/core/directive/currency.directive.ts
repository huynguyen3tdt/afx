import { Directive, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[formControlName][currency]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '(change)': 'onInputChange($event.target.value)'
  }
})
export class CurrencyDirective {
  @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();
  constructor(public model: NgControl) { }

  onInputChange(event: any) {
    if (event) {
      event = event.replace(',', '');
      if (event.substr(event.length - 1) === '.') {
        event = (event + '00');
        console.log('222222222 ', event);
      }
      const numeral = require('numeral');
      const newVal = numeral(event).format('0,0[.]00');
      const rawValue = newVal;
      console.log('aaaaaa ', rawValue);
      this.model.valueAccessor.writeValue(rawValue);
      this.rawChange.emit(rawValue);
    }

  }
}
