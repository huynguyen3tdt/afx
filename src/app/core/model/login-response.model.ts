import { MetaResponseModel } from './meta-response.model';

export interface LoginResponseModel {
    meta: MetaResponseModel;
    data: {
        account_ids: Array<AccountIDS>;
        access_token: string;
        expire_time: string;
        min_amount: number;
        fee: number;
        language: string;
    };
}

export interface AccountIDS {
    account_type: string;
    account_id: number;
}

