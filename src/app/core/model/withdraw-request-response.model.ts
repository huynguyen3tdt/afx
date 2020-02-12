import { MetaResponseModel } from './meta-response.model';

export interface WithdrawRequestModel {
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



