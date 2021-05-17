import { AbstractControl } from '@angular/forms';

const DEFAULT_INVALID_LENGTH_TEXT = {
  Lengthh: true,
  message: 'Max length is 50 and min length is 10'
};
const DEFAULT_INVALID_LENGTH_KTP_NPWP = {
  Lengthh: true,
  message: 'Max length is 17 and min length is 12'
};
const DEFAULT_INVALID_EMAIL = {
  Email: true,
  message: 'Please enter follow by format email'
};

const DEFAULT_INVALID_REQUIRED = {
  Required: true,
  message: 'This field is required'
};

const INVALID_PASSWORD = {
    RequiredPass: true,
    message: 'Password requires 8 characters and contain at least two of three types of characters (lower case, upper case and digits)'
  };

const DEFAULT_REQUIRED_SPECIAL = {
    SalarySpecial: true,
    message: 'Not Special'
};

const DEFAULT_LENGTH_REQUIRED = {
  Salary: true,
  message: 'Length must bigger than 3500000'
};

const DEFAULT_LENGTH_BIGER10 = {
  phoneLength: true,
  message: 'Length > 10'
};

const DEFAULT_LENGTH_LOWER7 = {
  lengthlower7: true,
  message: 'Length < 7'
};

const JP_ERROR = {
  Error: true,
  message: 'が正しくありません。'
};

const DEFAULT_INVALID_SPECIAL = {
  SalarySpecial: true,
  message: 'Not Special'
};

const DEFAULT_PHONE_REQUIRED = {
  Phone: true,
  message: ''
};

const DEFAULT_PHONE_LENGTH = {
  phoneLength: true,
  message: 'Length >= 10'
};

const DEFAULT_INVALID_EXP = {
  ErrorEXP: true,
  message: 'If the FX trading experience is less than six months, you can not open an account.'
};

const DEFAULT_INVALID_ANNUALINCOME = {
  ErrorIncome: true,
  message: 'ご年収が150万円未満の場合には口座を開設頂けない場合がございます。'
};

const FULLSIZE_HIRAGANA_ERR = {
  ErrorHalfSizeNumber: true,
  message: '全角ひらがなを入力してください'
};

const HALFSIZE_NUMER_ERR = {
  ErrorHalfSizeNumber: true,
  message: '半角数字を入力してください'
};

const FULL_WIDTH_ACCOUNT = {
  ErrFullWidth: true,
  message: '全角で入力してください'
};

const BANK_ACCOUNT_ERR = {
  ErrorBankInfo: true,
  message: '7桁未満の場合は、頭に「０」をつけてください。例）0123456'
};

const FAX_ERR = {
  ErrFax: true,
  message: 'ファックスは、10文字以上で入力してください。'
};

const TRANSFER_ERR = {
  ErrTransfer: true,
  message: 'Amount must be bigger than 0'
};

const DIGITS_PATTERN = '^\\d+$';
const SALARY_PATTEN = '^[0-9, ]*$';
const NOT_SPECIAL_CHARACTERS_FOR_EMAIL = '^[a-zA-Z0-9-._ ]*$';
const NOT_SPECIAL_CHARACTERS = '^[a-zA-Z0-9 ]*$';
// /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/ /^[0-9,.]*$/
const NOT_SPECIAL_CHARACTERS_CONTAIN_DOT = '^[a-zA-Z0-9,./_ ]*$';
const EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const HALF_PATTERN = /^[ｦ-ﾟ ､0-9a-zA-Z]*$/;
const PHONE_PATTERN = /^[0-9]{10}$/;
const WORK_PHONE_PATTERN = /^[0-9]{10,11}$/;
const MOBILE_PATTERN = /^[0-9]{11}$/;
const FULL_SIZE_NUMBER = /([０-９])/;
const HALF_SIZE_NUMBER = /^[0-9]*$/;
// const FULL_WIDTH_PATTERN = /^[ア-ンｦ-ﾟＡ-ｚA-z０-９0-9ーー\-（(）)／/．\.　 ]*$/;
const FULL_WIDTH_PATTERN = /^([ァ-ン()?＆,.'・]|ー|　)+$/;
const FULLSIZE_HIRAGANA = /[\u3040-\u309fa-zA-Z]/;
const JP_REQUIRED = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
// tslint:disable-next-line:max-line-length
const FULL_WIDTH_TXT = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
// https://gist.github.com/ryanmcgrath/982242
const PHONE_LENGTH = 10;
const MOBILE_LENGTH = 11;

// export function emailValidation(control: AbstractControl) {
//     if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
//       return DEFAULT_INVALID_REQUIRED;
//     }
//     const str1 = control.value.split('@')[0];
//     const pattern = new RegExp(EMAIL_PATTERN);
//     const pattern2 = new RegExp(NOT_SPECIAL_CHARACTERS_FOR_EMAIL);
//     if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
//       return DEFAULT_INVALID_REQUIRED;
//     }
//     if (pattern2.test(str1) === false) {
//       return DEFAULT_INVALID_EMAIL;
//     }
//     if (pattern.test(control.value.trim()) === false) {
//       return DEFAULT_INVALID_EMAIL;
//     }
//     return;
// }
export function emailValidation(control: AbstractControl) {
  const pattern = new RegExp(EMAIL_PATTERN);
  const patternFullWidth = new RegExp(FULL_WIDTH_TXT);
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  if (patternFullWidth.test(control.value.trim())) {
    return HALFSIZE_NUMER_ERR;
  }
  if (pattern.test(control.value.trim()) === false) {
    return DEFAULT_INVALID_EMAIL;
  }
  return;
}

export function requiredInput(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  return null;
}

export function passwordValidation(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  if (validatePassWord(control.value) === false) {
    return INVALID_PASSWORD;
  }
  return null;
}

function validatePassWord(passWord: string) {
  let count = 0;
  if (passWord.search(/[a-z]/) < 0) {
    count++;
  }
  if (passWord.search(/[A-Z]/) < 0) {
    count++;
  }
  if (passWord.search(/[0-9]/) < 0) {
    count++;
  }
  if (count > 1 || passWord.length < 8) {
    return false;
  } else {
    return true;
  }
}

// Validation of number fields
export function validationNumber(control: AbstractControl) {
  const patternPhone = RegExp(WORK_PHONE_PATTERN);
  const patternNumber = RegExp(HALF_SIZE_NUMBER);
  const patternFullWidth = RegExp(FULL_WIDTH_TXT);
  if (!toString(control.value).trim()) {
    return DEFAULT_PHONE_REQUIRED;
  }
  if (patternFullWidth.test(control.value) || !patternNumber.test(control.value)) {
    return HALFSIZE_NUMER_ERR;
  }
  if (!patternPhone.test(control.value)) {
    return DEFAULT_PHONE_LENGTH;
  }
  return null;
}

// Validation of Phone number
export function validationPhoneNumber(control: string, mobile: string) {
  const patternPhone = RegExp(PHONE_PATTERN);
  const patternMobile = RegExp(MOBILE_PATTERN);
  const patternFullWidth = RegExp(FULL_WIDTH_TXT);
  const patternNumber = RegExp(HALF_SIZE_NUMBER);
  if (!toString(control).trim() && !patternMobile.test(mobile)) {
    return DEFAULT_PHONE_REQUIRED;
  } else if (control && control.length < PHONE_LENGTH && patternNumber.test(control)) {
    return DEFAULT_PHONE_LENGTH;
  }
  if (patternFullWidth.test(control) && !patternNumber.test(control)
  || (!patternMobile.test(mobile) && !patternPhone.test(control))
  || (control && patternMobile.test(mobile) && !patternPhone.test(control))) {
    return HALFSIZE_NUMER_ERR;
  }
  return null;
}

// Validation of Mobile number
export function validationMobileNumber(control: string, phone: string) {
  const patternPhone = RegExp(PHONE_PATTERN);
  const patternMobile = RegExp(MOBILE_PATTERN);
  const patternFullWidth = RegExp(FULL_WIDTH_TXT);
  const patternNumber = RegExp(HALF_SIZE_NUMBER);
  if (!toString(control).trim() && !patternPhone.test(phone)) {
    return DEFAULT_PHONE_REQUIRED;
  } else if (control && control.length < MOBILE_LENGTH && patternNumber.test(control)) {
    return DEFAULT_PHONE_LENGTH;
  }
  if (patternFullWidth.test(control) && !patternNumber.test(control)
  || (!patternPhone.test(phone) && !patternMobile.test(control))
  || (control && patternPhone.test(phone) && !patternMobile.test(control))) {
    return HALFSIZE_NUMER_ERR;
  }
  return null;
}


export function postCodevalidation(control: AbstractControl) {
  const pattern = new RegExp(DIGITS_PATTERN);
  const patternNumber = new RegExp(FULL_SIZE_NUMBER);
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
      return DEFAULT_INVALID_REQUIRED;
  }
  if (control.value) {
      // tslint:disable-next-line: variable-name
      const string = control.value.toString().split('');
      if (string.length > 0 && string.indexOf('-') > -1) {
          return DEFAULT_REQUIRED_SPECIAL;
      } else if (patternNumber.test(control.value)) {
          return JP_ERROR;
      } else if (pattern.test(control.value) === false && control.value !== '') {
          return DEFAULT_LENGTH_REQUIRED;
      } else if (control.value && (control.value.length < 7)) {
          return DEFAULT_LENGTH_LOWER7;
      }
  }
  return null;
}

export function experienceValidation(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  if (Number(control.value <= 2)) {
    return DEFAULT_INVALID_EXP;
  }
  return null;
}

export function annualIncomeValidation(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  if (Number(control.value <= 1)) {
    return DEFAULT_INVALID_ANNUALINCOME;
  }
  return null;
}

export function fullSizeHiraganaValidation(control: AbstractControl) {
  const pattern = new RegExp(FULLSIZE_HIRAGANA);
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return null;
  }
  for (let i = 0; i < control.value.toString().length; i++) {
    if (pattern.test(control.value[i]) === false) {
      return FULLSIZE_HIRAGANA_ERR;
    }
  }
  return;
}

export function halfSizeNumberValidation(control: AbstractControl) {
  const pattern = new RegExp(HALF_SIZE_NUMBER);
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return null;
  }
  for (let i = 0; i < control.value.toString().length; i++) {
    if (pattern.test(control.value[i]) === false) {
      return HALFSIZE_NUMER_ERR;
    }
  }
  return;
}

export function fullWidthRequired(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  if (control.value) {
      const pattern =  new RegExp(FULL_WIDTH_PATTERN);
      if (!control.value.match(pattern)) {
        return FULL_WIDTH_ACCOUNT;
        }
  }
}

export function bankAccountValidation(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
      return DEFAULT_INVALID_REQUIRED;
  }
  if (control.value) {
      const value = control.value.toString().split('');
      if (value.length < 7) {
          return BANK_ACCOUNT_ERR;
      }
  }
  return null;
}

export function faxValidation(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return null;
  }
  if (control.value.length < 10) {
    return FAX_ERR;
  }
  return;
}

export function transferValidation(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return null;
  }
  if (Number(control.value) < 1) {
    return TRANSFER_ERR;
  }
  return null;
}

/**
 * toString method:
 * Return String value and avoid null or undefined
 */
export function toString(value) {
  return value ? value.toString() : '';
}
