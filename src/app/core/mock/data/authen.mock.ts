export const MOCK_LOGIN_RESPONSE = {
  meta: {
    code: 200,
    message: 'success'
  },
  data: {
    account_ids: [
      {
        account_type: 'FX',
        account_id: 1001
      }
    ],
    access_token: 'qwertyuiopsdfghjklxcvbnm',
    is_company: false,
    pwd_change_flg: false,
    expire_time: '2020-02-21T02:54:47.932Z',
    module_funding_min_deposit: 10000,
    module_funding_min_withdraw: 10000,
    module_funding_max_deposit: 1000000000000,
    module_funding_max_withdraw: 100000000,
    fee: 20,
    lang: 'English',
    fx_name1: '23',
    tz: 'Asia/Tokyo'
  }
};
