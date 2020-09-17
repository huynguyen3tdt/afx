import { MetaResponseModel } from './meta-response.model';

export interface WithdrawRequestModel {
  meta: MetaResponseModel;
  data: Mt5Model;
}

export interface TransferResponseModel {
  meta: MetaResponseModel;
  data: TransferResulteModel;
}

export interface ListTransferResponseModel {
  meta: MetaResponseModel;
  data: {
    next: string;
    previous: string;
    count: number;
    results: Array<TransferResulteModel>;
  };
}

export interface WithdrawHistoryModel {
  meta: MetaResponseModel;
  data: BankInforModel;
}

export interface WithdrawAmountResponse {
  meta: MetaResponseModel;
  data: WithdrawAmountModel;
}

// tslint:disable-next-line: class-name
export interface postWithdrawResponse {
  meta: MetaResponseModel;
  data: postWithdrawModel;
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
  branch_name: string;
  zip: number;
  branch_code: string;
  fx_acc_type: number;
  bic: string;
  currency: string;
  branch_id: number;
  bank_id: number;
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

// tslint:disable-next-line: class-name
export interface postWithdrawModel {
  id: number;
  create_date: string;
  method: string;
  amount: number;
  funding_type: string;
  status: number;
}

export interface TransferModel {
  from_account_id: number;
  to_account_id: number;
  amount: number;
  device_type: string;
}

export interface TransferResulteModel {
  amount: number;
  currency: string;
  method: string;
  status: string;
  transfer_id: number;
  create_date: string;
  from_trading_account_id: number;
  to_trading_account_id: number;
}




