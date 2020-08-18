import { MetaResponseModel } from './meta-response.model';

export interface MailFlagResponseModel {
    meta: MetaResponseModel;
    data: MailFlagModel;
}

export interface MailFlagModel {
    losscut_email_flg: boolean;
    margincall_email_flg: boolean;
    company_losscut_flg: boolean;
    company_margincall_flg: boolean;

}

export interface MailFlagParamModel {
    losscut_email_flg: boolean;
    margincall_email_flg: boolean;
}
