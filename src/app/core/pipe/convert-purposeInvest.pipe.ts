import { Pipe, PipeTransform } from '@angular/core';
import { backgroundApplicationInvidual, investExFxInvidual } from '../constant/question-constant';


@Pipe({
  name: 'convertInvestmentPurpose'
})
export class ConvertInvestmentPurposePipe implements PipeTransform {
  backGroundOfApplication = backgroundApplicationInvidual.labels;

  investExperienceFx = investExFxInvidual.labels;


  transform(value: any, args: any): any {
    if (value) {
      if (args === 'background') {
        return this.backGroundOfApplication.find(item => item.sequence === Number(value)).value;
      }
      if (args === 'experience') {
        return this.investExperienceFx.find(item => item.sequence === Number(value)).value;
      }
      return '';
  }
}
}
