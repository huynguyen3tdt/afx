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
