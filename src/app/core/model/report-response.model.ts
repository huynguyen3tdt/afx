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
  report_name: string;
  report_url: string;
  created_date: string;
  is_read: string;
}


