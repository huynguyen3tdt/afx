import { Injectable } from '@angular/core';
import { AccountType } from '../model/report-response.model';
import { TYPEOFTRANHISTORY, PAYMENTMETHOD, TRADING_TYPE } from '../constant/payment-method-constant';
import { LOCALE, ACCOUNT_TYPE, ACCOUNT_IDS } from '../constant/authen-constant';
import { LANGUAGLE } from '../constant/language-constant';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FX_IMAGE, ICFD_IMAGE, CCFD_IMAGE } from '../constant/img-constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from './user.service';

const numeral = require('numeral');
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private userService: UserService,
    private globalService: GlobalService,
  ) { }

  totalNoti = new BehaviorSubject('');
  recallUnread = this.totalNoti.asObservable();

  language = new BehaviorSubject('');
  recallLanguage = this.language.asObservable();

  changeLanguage(language: string) {
    this.language.next(language);
  }

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
        return FX_IMAGE;
      case TRADING_TYPE.ICFD.key:
        return ICFD_IMAGE;
      case TRADING_TYPE.CCFD.key:
        return CCFD_IMAGE;
    }
  }

  sortListAccount(arr: any) {
    arr.sort((a, b) => {
      if (a.account_type < b.account_type) {
        return -1;
      }  else if (a.account_type > b.account_type) {
        return 1;
      }
      return 0;
    });
    return arr;
  }

  getListAccountIds(data) {
    const listData = [];
    if (data) {
      // tslint:disable-next-line:no-shadowed-variable
      data.map((element: any) => {
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_FX.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_FX.name + ' ' + element.trading_account_id;
          element.img_type_account = FX_IMAGE;
        }
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_CFDIndex.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_CFDIndex.name + ' ' + element.trading_account_id;
          element.img_type_account = ICFD_IMAGE;
        }
        if (element.account_type === ACCOUNT_TYPE.ACCOUNT_CFDCom.account_type) {
          element.value = ACCOUNT_TYPE.ACCOUNT_CFDCom.name + ' ' + element.trading_account_id;
          element.img_type_account = CCFD_IMAGE;
        }
        const dataObj: AccountType = {
          account_type: element.account_type,
          account_id: element.trading_account_id.toString(),
          value : element.value,
          currency: element.currency_cd,
          img_type_account: element.img_type_account,
          turn_trading_flg: element.turn_trading_flg
        };
        listData.push(dataObj);
      });
    }
    return listData;
  }

  callListAccount() {
    this.spinnerService.show();
    this.userService.getUserListAccount().subscribe(value => {
        this.spinnerService.hide();
        const listAccount = [];
        if (value.meta.code === 200) {
          value.data.list_account.map(el => {
            if (el.trading_account_id) {
              listAccount.push(el);
            }
          });
          const param = this.getListAccountIds(this.sortListAccount(listAccount));
          localStorage.setItem(ACCOUNT_IDS, JSON.stringify(param));
        }
      });
  }
}
