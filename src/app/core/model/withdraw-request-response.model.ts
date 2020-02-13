import { MetaResponseModel } from './meta-response.model';

export interface WithdrawRequestModel {
  meta: MetaResponseModel;
  data: Mt5Model;
}

export interface WithdrawHistoryModel {
  meta: MetaResponseModel;
  data: BankInforModel;
}

export interface WithdrawAmount {
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
    results: Array<TransactionModel>;
  };
}

export interface TransactionResponse {
  meta: MetaResponseModel;
  data: TransactionModel;
}

export interface Mt5Model {
  balance: number;
  margin: number;
  free_margin: number;
  equity: number;
  margin_level: number;
  used_margin: number;
  leverage: number;
  lastest_time: string;
  unrealize_pl: number;
  currency: string;
}

export interface BankInforModel {
  id: number;
  holder_name: string;
  beneficiary_bank: string;
  bank_branch: string;
  swift_code: number;
  branch_number: string;
  currency: string;
}

export interface TransactionModel {
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





