import { Pipe, PipeTransform } from '@angular/core';
import {TRADING_TYPE} from './../constant/payment-method-constant';
@Pipe({
  name: 'convertTradingType'
})
export class ConvertTradingTypePipe implements PipeTransform {
  transform(value: string, arg: any): any {
    if (value) {
      const accountNumber = value.toString();
      const tradingType = accountNumber.substring(accountNumber.length - 2, accountNumber.length);
      if (tradingType === TRADING_TYPE.FX.key) {
        return TRADING_TYPE.FX.name + ' ' + accountNumber;
      } else if (tradingType === TRADING_TYPE.ICFD.key) {
        return TRADING_TYPE.ICFD.name + ' ' + accountNumber;
      }
      return TRADING_TYPE.CCFD.name + ' ' + accountNumber;
    }
    return null;
  }
}
