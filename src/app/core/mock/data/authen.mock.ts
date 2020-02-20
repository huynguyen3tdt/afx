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
        expire_time: '2020-02-11T04:46:08.387Z',
        is_company: 'false',
        pwd_change_flg: 'false',
        min_amount: 10000,
        fee: 20,
        lang: 'English'
    }
};
