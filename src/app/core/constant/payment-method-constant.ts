export const PAYMENTMETHOD = {
    QUICKDEPOSIT: {key: 'qd', nameJP: 'クイック入金', name: 'Quick deposit'},
    BANKTRANSFER: {key: 'bt', nameJP: '銀行振込', name: 'Bank transfer'}
};


export const TYPEOFTRANHISTORY = {
    DEPOSIT: {key: 'd', nameJP: '入金', name: 'Deposit'},
    WITHDRAWAL: {key: 'w', nameJP: '出金', name: 'Withdrawal'},
    INTERNALTRANSFER: {key: 'it', nameJP: '振替', name: 'Transfer'}
};

export const STATUSTRANHISTORY = {
    COMPLETE: {key: 1, name: 'Complete'},
    CANCEL: {key: 2, name: 'Cancel'},
    PENDING: {key: 3, name: 'Pending'},
    NEW: {key: 4, name: 'New'}
};

export const TRADING_TYPE = {
    FX: {key: '01', name: '[FX]'},
    ICFD: {key: '02', name: '[I-CFD]'},
    CCFD: {key: '03', name: '[C-CFD]'}
};
