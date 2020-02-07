import { MetaResponseModel } from './meta-response.model';

export interface LoginResponseModel {
    meta: MetaResponseModel;
    data: {
        account_ids: Array<string>;
        access_token: string;
        expire_time: string;
        language: string;
    };
}

