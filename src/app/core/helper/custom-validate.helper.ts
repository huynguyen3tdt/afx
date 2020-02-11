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
