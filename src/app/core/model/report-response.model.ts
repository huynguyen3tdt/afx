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

export interface ReportIDS {
  id: number;
  report_title: string;
  read_flg: string;
  created_date: string;
  file_type: string;
}


