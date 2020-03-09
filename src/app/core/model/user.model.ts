import { MetaResponseModel } from './meta-response.model';
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';

export interface UserResponse {
  meta: MetaResponseModel;
  data: UserModel;
}

export interface CorporateResponse {
  meta: MetaResponseModel;
  data: CorporateModel;
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
      street2: string,
      fx_street3: string,
    }
  };
  email: {
    status: number,
    value: string
  };
  mobile: string;
  lang: string;
}

export interface CorporateModel {
  corporation: {
    name: string,
    fx_name1: string,
    zip: {
      status: number,
      value: number,
    }
    address: {
      status: number,
      value: {
        city: string,
        street: string,
        street2: string,
        fx_street3: string,
      }
    },
    fx_fax: {
      status: number,
      value: string,
    },
    mobile: string,
    lang: string,
  };
  pic: {
    name: string,
    fx_name1: string,
    fx_gender: {
      status: number,
      value: string,
    },
    email: {
      status: number,
      value: string,
    },
    mobile: string,
    function: string,
    fx_dept: string,
  };
}

