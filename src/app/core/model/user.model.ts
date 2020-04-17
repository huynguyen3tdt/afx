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

export interface BankResponse {
  meta: MetaResponseModel;
  data: Array<string>;
}

export interface AddressResponse {
  meta: MetaResponseModel;
  data: AddressModel;
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
  surveys: Array<QuestionModel>;
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
  surveys: Array<QuestionModel>;
}

export interface AddressModel {
  id: number;
  code: string;
  old_postcode: string;
  postno: string;
  prefecture_kana: string;
  city_kana: string;
  town_kana: string;
  prefecture: string;
  city: string;
  town: string;
  prefecture_roman: string;
  city_roman: string;
  town_roman: string;
  over_postno: string;
  detail_view: string;
  street: string;
  over_division: string;
}
export interface LabelModel {
  id: number;
  sequence: number;
  value: string;
  quizz_mark: number;
}

export interface QuestionModel {
  question_cd: string;
  value_text: string;
  sequence: number;
}


