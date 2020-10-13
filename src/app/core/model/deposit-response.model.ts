import { MetaResponseModel } from './meta-response.model';

export interface DepositResponse {
  meta: MetaResponseModel;
  data: Array<DepositModel>;
}
export interface DepositModel {
  id: number;
  fx_logo_path: string;
  acc_number: number;
  acc_holder_name: string;
  name: string;
  branch_name: string;
  branch_code: string;
  fx_acc_type: string;
  bic: string;
  currency: string;
}

export interface BillingSystemResponse {
  meta: MetaResponseModel;
  data: BillingSystemModel;
}

export interface BillingSystemModel {
  id: number;
  create_date: string;
  currency: string;
  method: string;
  amount: number;
  funding_type: string;
  status: number;
}

export interface BankTransferParamModel {
  trading_account_id: number;
  bank_code: string;
  remark: string;
  amount: number;
  currency: string;
}
