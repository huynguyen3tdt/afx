import { Injectable } from '@angular/core';
import { AccountType } from '../model/report-response.model';
import { TYPEOFTRANHISTORY, PAYMENTMETHOD } from '../constant/payment-method-constant';
import { LOCALE } from '../constant/authen-constant';

export const ACCOUNT_TYPE = {
  ACCOUNT_FX: {account_type: 1, name: 'FX'},
  ACCOUNT_CFDIndex: {account_type: 2, name: 'CFD Index'},
  ACCOUNT_CFDCom: {account_type: 3, name: 'CFD Index'},
};
const numeral = require('numeral');

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }

  getListAccountIds(data) {
    const listData = [];
    if (data) {
      // tslint:disable-next-line:no-shadowed-variable
      data.map((element: any) => {
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_FX.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_FX.name + '-' + element.account_id;
        }
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_CFDIndex.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_CFDIndex.name + '-' + element.account_id;
        }
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_CFDCom.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_CFDCom.name + '-' + element.account_id;
        }
        const dataObj: AccountType = {
          account_type: element.account_type,
          account_id: element.account_id,
          value : element.value
        };
        listData.push(dataObj);
      });
    }
    return listData;
  }

  calculateMarginLevel(equityDeposit: number, usedMargin: number) {
    let marginLevel: number;
    if (usedMargin === 0) {
      marginLevel = 0;
    } else {
      marginLevel = ((equityDeposit / usedMargin) * 100);
    }

    return marginLevel;
  }

  checkType(type: string) {
    const locale = localStorage.getItem(LOCALE);
    console.log('localeee ', locale);
    if (type === TYPEOFTRANHISTORY.DEPOSIT.key) {
      if (locale === 'en') {
        return TYPEOFTRANHISTORY.DEPOSIT.name;
      } else {
        return TYPEOFTRANHISTORY.DEPOSIT.nameJP;
      }
    }
    if (type === TYPEOFTRANHISTORY.WITHDRAWAL.key) {
      if (locale === 'en') {
        return TYPEOFTRANHISTORY.WITHDRAWAL.name;
      } else {
        return TYPEOFTRANHISTORY.WITHDRAWAL.nameJP;
      }
    }
    return '';
  }

  checkPaymentMedthod(type: string) {
    const locale = localStorage.getItem(LOCALE);
    if (type === PAYMENTMETHOD.QUICKDEPOSIT.key) {
      if (locale === 'en') {
        return PAYMENTMETHOD.QUICKDEPOSIT.name;
      } else {
        return PAYMENTMETHOD.QUICKDEPOSIT.nameJP;
      }
    }
    if (type === PAYMENTMETHOD.BANKTRANSFER.key) {
      if (locale === 'en') {
        return PAYMENTMETHOD.BANKTRANSFER.name;
      } else {
        return PAYMENTMETHOD.BANKTRANSFER.nameJP;
      }
    }
    return '';
  }

  checkGender(value: string) {
    const locale = localStorage.getItem(LOCALE);
    if (value === 'M') {
        if (locale === 'en') {
            return 'Male';
        } else {
            return '男性';
        }
    } else {
        if (locale === 'en') {
            return 'Female';
        } else {
            return '女性';
        }
    }
  }

  convertGender(value: string) {
    if (value === 'Male' || value === '男性') {
      return 'M';
    }
    if (value === 'Female' || value === '女性') {
      return 'F';
    }
  }
}
