import { MetaResponseModel } from './meta-response.model';

export interface LoginResponseModel {
    meta: MetaResponseModel;
    data: {
        account_ids: Array<AccountIDS>;
        access_token: string;
        is_company: string;
        pwd_change_flg: string;
        expire_time: string;
        min_amount: number;
        fee: number;
        lang: string;
    };
}

export interface AccountIDS {
    account_type: string;
    account_id: number;
}

