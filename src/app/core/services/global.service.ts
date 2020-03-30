import { Injectable } from '@angular/core';
import { AccountType } from '../model/report-response.model';

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
      marginLevel = Math.floor((equityDeposit / usedMargin) * 100);
    }
    return marginLevel;
  }
}
