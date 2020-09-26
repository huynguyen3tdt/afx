import { Injectable } from '@angular/core';
import { AccountType } from '../model/report-response.model';
import { TYPEOFTRANHISTORY, PAYMENTMETHOD, TRADING_TYPE } from '../constant/payment-method-constant';
import { LOCALE } from '../constant/authen-constant';
import { LANGUAGLE } from '../constant/language-constant';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export const ACCOUNT_TYPE = {
  ACCOUNT_FX: { account_type: 1, name: 'FX' },
  ACCOUNT_CFDIndex: { account_type: 2, name: 'CFD Index' },
  ACCOUNT_CFDCom: { account_type: 3, name: 'CFD Index' },
};
const numeral = require('numeral');

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }

  totalNoti = new BehaviorSubject('');
  recallUnread = this.totalNoti.asObservable();

  changeStatusNoti(status: string) {
    this.totalNoti.next(status);
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
    if (type === TYPEOFTRANHISTORY.INTERNALTRANSFER.key) {
      if (locale === LANGUAGLE.english) {
        return TYPEOFTRANHISTORY.INTERNALTRANSFER.name;
      } else {
        return TYPEOFTRANHISTORY.INTERNALTRANSFER.nameJP;
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
    if (type === PAYMENTMETHOD.INTERNALTRANSFER.key) {
      if (locale === LANGUAGLE.english) {
        return PAYMENTMETHOD.INTERNALTRANSFER.name;
      } else {
        return PAYMENTMETHOD.INTERNALTRANSFER.nameJP;
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

  reConvertGender(value: string) {
    if (value === 'Male' || value === '男性') {
      return 'M';
    } else {
      return 'F';
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

  resetValidator(formControl: AbstractControl, validator?: ValidatorFn) {
    if (validator) {
      formControl.setValidators([validator]);
      formControl.updateValueAndValidity();
    } else {
      formControl.setValidators([]);
      formControl.updateValueAndValidity();
    }
  }

  convertTradingAcount(accountNumber: string) {
    const tradingType = accountNumber.substring(accountNumber.length - 2, accountNumber.length);
    if (tradingType === TRADING_TYPE.FX.key) {
      return TRADING_TYPE.FX.name + ' ' + accountNumber;
    } else if (tradingType === TRADING_TYPE.ICFD.key) {
      return TRADING_TYPE.ICFD.name + ' ' + accountNumber;
    }
    return TRADING_TYPE.CCFD.name + ' ' + accountNumber;
  }

  convertTypeToImg(accountNumber: string) {
    const tradingType = accountNumber.substring(accountNumber.length - 2, accountNumber.length);
    switch (tradingType) {
      case TRADING_TYPE.FX.key:
        return 'assets/images/icon-for-FX.svg';
      case TRADING_TYPE.ICFD.key:
        return 'assets/images/icon-for-ICFD.svg';
      case TRADING_TYPE.CCFD.key:
        return 'assets/images/icon-for-CCFD.svg';
    }
  }
}
