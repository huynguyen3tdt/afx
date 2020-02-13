import { MetaResponseModel } from './meta-response.model';

export interface WithdrawRequestModel {
  body: any;
  meta: MetaResponseModel;
  data: {
    balance: number,
    margin: number,
    free_margin: number,
    equity: number,
    margin_level: number,
    used_margin: number,
    leverage: number,
    lastest_time: string,
    unrealize_pl: number,
    currency: string,
  };
}

export interface WithdrawHistoryModel {
  body: any;
  meta: MetaResponseModel;
  data: {
    id: number,
    holder_name: string,
    beneficiary_bank: string,
    bank_branch: string,
    swift_code: number,
    branch_number: string,
    currency: string
  };
}

export interface WithdrawAmount {
  body: any;
  meta: MetaResponseModel;
  data: {
    deposit_amount: number;
    withdraw_amount: number;
    withdraw_amount_pending: number
  };
}

export interface WithdrawHistory {
  meta: MetaResponseModel;
  data: {
    next: string;
    previous: string;
    count: number;
    results: Array<DrawHistoryID>;
  };
}

export interface DrawHistoryID {
  data: any;
  body: any;
  meta: any;
  id: number;
  transaction_id: number;
  transaction_date: string;
  description: string;
  currency: string;
  payment: string;
  amount: number;
  type: string;
  status: number;

}

export interface DrawPost {
  meta: any;
  id: number;
  transaction_id: number;
  transaction_date: string;
  description: string;
  currency: string;
  payment_method: string;
  amount: number;
  type: string;
  status: number;
}





