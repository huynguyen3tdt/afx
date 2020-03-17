import { MetaResponseModel } from './meta-response.model';

export interface SearchBankResponseModel {
  meta: MetaResponseModel;
  data: Array<BankModel>;

}
export interface BankModel {
  id: number;
  name: string;
  fx_name_kana: string;
  bic: string;
}

export interface BranchModel {
  id: number;
  branch_name: string;
  branch_name_kana: string;
  branch_code: string;
}

export interface SearchHiraModel {
  key_hira: string;
  key_kata: string;
  class: string;
}
