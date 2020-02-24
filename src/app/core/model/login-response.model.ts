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
        fee: number;
        lang: string;
    };
}

export interface AccountIDS {
    account_type: string;
    account_id: number;
}

