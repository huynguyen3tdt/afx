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
    message: 'New password needs to be 8 characters or more and has at least 1 alphabet letter'
  };
const INVALID_PASSWORD_LENGTH = {
    RequiredPassLength: true,
    message: 'New password needs to be 8 characters or more and has at least 1 alphabet letter'
  };

const DEFAULT_SALARY_REQUIRED_SPECIAL = {
    SalarySpecial: true,
    message: 'Not Special'
};

const DEFAULT_SALARY_REQUIRED = {
  Salary: true,
  message: 'Salary must bigger than 3500000'
};

const DEFAULT_SALARY_REQUIRED_LENGTH = {
  SalaryLength: true,
  message: 'Length > 10'
};

const DIGITS_PATTERN = '^\\d+$';
const SALARY_PATTEN = '^[0-9, ]*$';
const NOT_SPECIAL_CHARACTERS_FOR_EMAIL = '^[a-zA-Z0-9-._ ]*$';
const NOT_SPECIAL_CHARACTERS = '^[a-zA-Z0-9 ]*$';
// /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/ /^[0-9,.]*$/
const NOT_SPECIAL_CHARACTERS_CONTAIN_DOT = '^[a-zA-Z0-9,./_ ]*$';
const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const HALF_PATTERN = /^[ｦ-ﾟ ､0-9a-zA-Z]*$/;
const FULL_SIZE_NUMBER = /([０-９])/;
const HALF_SIZE_NUMBER = /[0-9]/;
const FULL_WIDTH_PATTERN = /^[ア-ンｦ-ﾟＡ-ｚA-z０-９0-9ーー\-（(）)／/．\.　 ]*$/;
const HIRAGANA_REQUIRED = /[\u3040-\u309f]/;
const JP_REQUIRED = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;


export function emailValidation(control: AbstractControl) {
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  const str1 = control.value.split('@')[0];
  const pattern = new RegExp(EMAIL_PATTERN);
  const pattern2 = new RegExp(NOT_SPECIAL_CHARACTERS_FOR_EMAIL);
  if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    return DEFAULT_INVALID_REQUIRED;
  }
  if (pattern2.test(str1) === false) {
    return DEFAULT_INVALID_EMAIL;
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
    return INVALID_PASSWORD;
  }
  if (control.value.search(/[a-zA-Z]/) < 0) {
    return INVALID_PASSWORD_LENGTH;
  } else if (control.value.search(/[0-9]/) < 0) {
    return INVALID_PASSWORD_LENGTH;
  } else if (control.value.length < 8) {
    return INVALID_PASSWORD_LENGTH;
  }
  return null;
}

export function validationPhoneNumber(control: AbstractControl) {
  if (control.value === '' || control.value === undefined) {
      return null;
  }
  if (control.value) {
      // tslint:disable-next-line: variable-name
      const string = control.value.toString().split('');
      if (string.length > 0 &&  string.indexOf('-') > -1) {
          return DEFAULT_SALARY_REQUIRED_SPECIAL;
      }
      if (string.length > 0 &&  string.indexOf(' ') > -1) {
          return DEFAULT_SALARY_REQUIRED;
      }
      if (isNaN(control.value) === true && control.value !== '') {
          return DEFAULT_SALARY_REQUIRED;
      }
      if (control.value && (control.value.length < 10)) {
          return DEFAULT_SALARY_REQUIRED_LENGTH;
      }
  }
  return null;
}
