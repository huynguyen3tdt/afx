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

export interface LoginParam {
  login_id: string;
  password: string;
  device_type: string;
  wl_code: string;
}

export interface ForgotPasswordParam {
  login_id: string;
  dob: string;
  wl_code: string;
}

export interface ResetPasswordParam {
  new_password: string;
  old_password: string;
}

export interface ResetPasswordWithTokenParam {
  new_password: string;
  token: string;
}

export interface CheckTokenParam {
  token: string;
}

export interface ChangeEmail {
  password: string;
  token: string;
}

export interface UpdateUserParam {
  zip: string;
  address: {
    city: string;
    street: string;
    street2: string;
    fx_street3: string;
  };
  email: string;
  phone?: string;
  mobile?: string;
  lang?: string;
  surveys: Array<QuestionModel>;
  survey_cd: string;
}

export interface UpdateCorporateParam {
  corporation: {
    zip: string;
    address: {
      city: string;
      street: string;
      street2: string;
      fx_street3: string;
    };
    phone: string;
    fx_fax: string;
    lang?: string;
  };
  pic: {
    name: string;
    fx_name1: string;
    fx_gender: string;
    email?: string;
    phone: string;
    mobile: string;
    function: string;
    fx_dept: string;
  };
  surveys: Array<QuestionModel>;
  survey_cd: string;
}

export interface UserModel {
  name: string;
  fx_dob: string;
  fx_gender: string;
  address: {
    status: 0,
    value: {
      zip: string;
      city: string,
      street: string,
      street2: string,
      fx_street3: string,
    }
  };
  email: {
    status: string,
    value: string
  };
  phone: string;
  mobile: string;
  lang: string;
  surveys: Array<QuestionModel>;
}

export interface CorporateModel {
  corporation: {
    name: string,
    fx_name1: string,
    address: {
      status: string,
      value: {
        zip: string,
        city: string,
        street: string,
        street2: string,
        fx_street3: string,
      }
    },
    fx_fax: {
      status: string,
      value: string,
    },
    lang: string,
    phone: string
  };
  pic: {
    info: {
      status: string,
      value: {
        name: string,
        fx_name1: string,
        fx_gender: string
      }
    }
    email: {
      status: string,
      value: string,
    },
    phone: string,
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

export interface AccountTypeAFX {
  account_id: string;
  account_type: number;
  currency: string;
  value: string;
}

export interface GroupAccountType {
  group_account_type: GroupAccountTypeDetail[];
}

export interface GroupAccountTypeDetail {
  lp_code: string;
  account_type?: string;
}

export interface ListAccountResponeModel {
  meta: MetaResponseModel;
  data: AccountRespondModel;
}

export interface AccountRespondModel {
  list_account: AccountType[];
  next_audit_date: string;
}

export interface AccountType {
  account_type: number;
  trading_account_id: number;
  status: number;
  partner_id: number;
  currency_cd: string;
  issuance_key: string;
}

export interface TradingAccountResponeModel {
  meta: MetaResponseModel;
  data: AccountType;
}

export interface TradingAccount {
  trading_account_id: number;
}
