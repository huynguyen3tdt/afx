
export const REMEMBER_LOGIN = 'rememberAFX';
export const TOKEN_AFX = 'currentTokenAFX';
export const INTERNAL_TRANSFER = 'fx_internal_transfer_flg';
export const USERNAME_LOGIN = 'useNameLoginAFX';
export const PASSWORD_LOGIN = 'passWordLoginAFX';
export const ACCOUNT_IDS    = 'accountTypeAFX';
export const FIRST_LOGIN    = 'firstLoginAFX';
export const IS_COMPANY     = 'isCompanyAFX';
export const MIN_DEPOST     = 'minDepositAFX';
export const MAX_DEPOSIT    = 'maxDepositAFX';
export const MIN_WITHDRAW   = 'minWithdrawAFX';
export const MAX_WITHDRAW   = 'maxWithdrawAFX';
export const FONTSIZE_AFX   = 'fontsizeAFX';
export const LOCALE         = 'locale';
export const MARGIN_CALL    = 'marginCallAFX';
export const MARGIN_STOP_OUT = 'marginStopOutAFX';
export const CHANGE_PASS_FLG = 'pwd_change_flg_AFX';
export const FXNAME1        = 'fxname1AFX';
export const TIMEZONEAFX    = 'timezoneAFX';
export const TIMEZONESERVER = '+00:00';
export const TIMEOUT_TOAST  = 4000;
export const TYPE_ERROR_TOAST_EN    = 'ERROR';
export const TYPE_ERROR_TOAST_JP    = 'エラー';
export const TYPE_SUCCESS_TOAST_EN  = 'SUCCESS';
export const TYPE_SUCCESS_TOAST_JP  = '成功';
export const MESSAGE_SUCCESS_GEN_QUOREA_KEY_EN  = 'Successful insuance API key';
export const MESSAGE_SUCCESS_GEN_QUOREA_KEY_JP  = 'APIキーを発行しました。';
export const SUCCESS_CLIPBOARD_EN = 'Copy success to clipboard!';
export const SUCCESS_CLIPBOARD_JP = 'コピーされました！';
export const TOKEN_EXPIRED_EN  = 'Token has been expired or revoked';
export const TOKEN_EXPIRED_JP  = 'トークンの有効期限が切れました。';
export const INTERNAL_SERVER_EN = 'Internal server error';
export const INTERNAL_SERVER_JP = '内部サーバーエラー';
export const ERROR_TIME_CLOSING_EN = 'Trading time is closing now. Please come back in 6:00 AM';
export const ERROR_TIME_CLOSING_JP = '取引時間は現在終了しています。 午前6時に戻ってください';
export const SUCCESS_REGIST_TURN_TRADING_EN = 'Successful sending Turn Trading cooperation application';
export const SUCCESS_REGIST_TURN_TRADING_JP = 'TurnTrading連携申請を受付しました。';
export const FAILED_REGIST_TURN_TRADING_EN = 'Has failed to send application. Please re-send application for them.';
export const FAILED_REGIST_TURN_TRADING_JP = 'にTurnTrading連携申請を受付できませんでした。再度申請してください。';

export const ERROR_MAX_DEPOSIT_EN = 'Max deposit is ';
export const ERROR_MAX_DEPOSIT_JP = '最大預金は ';
export const ERROR_MIN_DEPOSIT_EN = 'Min deposit is ';
export const ERROR_MIN_DEPOSIT_JP = '最小預金は';
export const ERROR_GEN_ISSUANCE_KEY_EN = 'Failed to generate API key';
export const ERROR_GEN_ISSUANCE_KEY_JP = 'APIキーの発行は失敗しました';

export const ACCOUNT_TYPE = {
    ACCOUNT_FX: {account_type: 1, name: '[FX]'},
    ACCOUNT_CFDIndex: {account_type: 2, name: '[I-CFD]'},
    ACCOUNT_CFDCom: {account_type: 3, name: '[C-CFD]'},
};

export const ACCOUNT_INSSURANCE = [
    ACCOUNT_TYPE.ACCOUNT_FX.account_type,
    ACCOUNT_TYPE.ACCOUNT_CFDIndex.account_type
];
