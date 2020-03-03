import { MetaResponseModel } from './meta-response.model';

export interface WithdrawRequestModel {
  meta: MetaResponseModel;
  data: Mt5Model;
}

export interface WithdrawHistoryModel {
  meta: MetaResponseModel;
  data: BankInforModel;
}

export interface WithdrawAmountResponse {
  meta: MetaResponseModel;
  data: WithdrawAmountModel;
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
  acc_number: number;
  acc_holder_name: string;
  name: string;
  bank_branch: string;
  zip: number;
  branch_code: string;
  currency: string;
}

export interface TransactionModel {
    id: number;
    trading_account_id: number;
    create_date: string;
    description: string;
    currency: string;
    method: string;
    amount: number;
    funding_type: string;
    status: number;
    name: string;
}

export interface WithdrawAmountModel {
  deposit_amount: number;
  withdraw_amount: number;
  withdraw_amount_pending: number;
}





