import { MetaResponseModel } from './meta-response.model';

export interface LoginResponseModel {
    meta: MetaResponseModel;
    data: {
        account_ids: Array<AccountIDS>;
        access_token: string;
        is_company: boolean;
        pwd_change_flg: boolean;
        expire_time: string;
        module_funding_min_deposit: number;
        module_funding_min_withdraw: number;
        module_funding_max_deposit: number;
        module_funding_max_withdraw: number;
        lang: string;
        fx_name1: string;
        tz: string;
    };
}

export interface AccountIDS {
    account_type: string;
    account_id: number;
}

