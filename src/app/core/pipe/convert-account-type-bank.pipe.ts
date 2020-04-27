import { Pipe, PipeTransform } from '@angular/core';
import { LOCALE } from '../constant/authen-constant';
import { LANGUAGLE } from '../constant/language-constant';

@Pipe({
  name: 'convertAccTypeBank'
})
export class ConvertAccountTypeBankPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (value) {
        const locale = localStorage.getItem(LOCALE);
        if (value === 'sa') {
            if (locale === LANGUAGLE.english) {
                return 'Savings';
            } else {
                return '普通';
            }
        } else {
            if (locale === LANGUAGLE.english) {
                return 'Checkings';
            } else {
                return '当座';
            }
        }
  }
}
}
