import { MetaResponseModel } from './meta-response.model';

export interface UserResponse {
    meta: MetaResponseModel;
    data: UserModel;
}

export interface UserModel {
    name: string;
    fx_dob: string;
    fx_gender: string;
    zip: {
        status: number,
        value: string
    };
    address: {
    status: 0,
    value: {
        city: string,
        street: string,
        street2: string
        }
    };
    email: {
        status: number,
        value: string
    };
    phone: string;
    lang: string;
}

