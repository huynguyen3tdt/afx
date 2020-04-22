import { Injectable } from '@angular/core';
import { AccountType } from '../model/report-response.model';
import { TYPEOFTRANHISTORY, PAYMENTMETHOD } from '../constant/payment-method-constant';
import { LOCALE } from '../constant/authen-constant';
import { LANGUAGLE } from '../constant/language-constant';
import { AbstractControl, ValidatorFn } from '@angular/forms';

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
    if (type === TYPEOFTRANHISTORY.DEPOSIT.key) {
      if (locale === LANGUAGLE.english) {
        return TYPEOFTRANHISTORY.DEPOSIT.name;
      } else {
        return TYPEOFTRANHISTORY.DEPOSIT.nameJP;
      }
    }
    if (type === TYPEOFTRANHISTORY.WITHDRAWAL.key) {
      if (locale === LANGUAGLE.english) {
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
      if (locale === LANGUAGLE.english) {
        return PAYMENTMETHOD.QUICKDEPOSIT.name;
      } else {
        return PAYMENTMETHOD.QUICKDEPOSIT.nameJP;
      }
    }
    if (type === PAYMENTMETHOD.BANKTRANSFER.key) {
      if (locale === LANGUAGLE.english) {
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
        if (locale === LANGUAGLE.english) {
            return 'Male';
        } else {
            return '男性';
        }
    } else {
        if (locale === LANGUAGLE.english) {
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

  resetFormControl(formControl: AbstractControl, validator?: ValidatorFn) {
    if (validator) {
      formControl.setValue('');
      formControl.setValidators([validator]);
      formControl.updateValueAndValidity();
    } else {
      formControl.setValue('');
      formControl.setValidators([]);
      formControl.updateValueAndValidity();
    }
  }
}
