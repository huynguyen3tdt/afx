import { Pipe, PipeTransform } from '@angular/core';
import { investmentCorporation, amountAvaiableInvidual, annualIncomeInvidual } from '../constant/question-constant';

@Pipe({
  name: 'convertFinancial'
})
export class ConvertFinancialPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (value) {
      if (arg === 'corp') {
        return investmentCorporation.labels.find(item => item.sequence === Number(value)).value;
      }
      if (arg === 'userAnnual') {
        return annualIncomeInvidual.labels.find(item => item.sequence === Number(value)).value;
      }
      if (arg === 'user') {
        return amountAvaiableInvidual.labels.find(item => item.sequence === Number(value)).value;
      }
    }
    return '';
  }
}
