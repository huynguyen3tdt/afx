import { MetaResponseModel } from './meta-response.model';

export interface UserResponse {
    meta: MetaResponseModel;
    data: UserModel;
}

export interface UserModel {
    full_name: string;
    dob: string;
    gender: string;
    postcode: {
        status: number,
        value: string
    };
    address: {
    status: 0,
    value: {
        prefecture: string,
        county: string,
        house_numb: string
        }
    };
    email: {
        status: number,
        value: string
    };
    phone: string;
    language: string;
}
