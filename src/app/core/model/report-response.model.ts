import { MetaResponseModel } from './meta-response.model';


export interface ReportResponseModel {
  meta: MetaResponseModel;
  data: {
    next: string;
    previous: string;
    count: number;
    results: Array<ReportIDS>
  };
}

export interface ReportChangeResponseModel {
  meta: MetaResponseModel;
  data: ReportIDS;
}

export interface ReportIDS {
  id: number;
  partner_id: number;
  company_id: number;
  report_cd: string;
  report_title: string;
  report_date: string;
  report_type: string;
  trading_account_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  read_flg: boolean;
  create_date: string;
  write_date: string;
  create_uid: number;
  write_uid: number;
  account_type: string;
}

export interface AccountType {
  account_type: number;
  account_id: string;
  value: string;
  currency: string;
  img_type_account?: string;
  turn_trading_flg?: boolean;
}

export interface Report {
  id: number;
  report_title: string;
  created_date: string;
  read_flg: boolean;
  file_type: string;
}

