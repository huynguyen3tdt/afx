import { BankModel } from '../model/bank-response.model';

export const MizuhoBank: BankModel = {
  id: 1281,
  name: 'みずほ',
  fx_name_kana: 'ﾐｽﾞﾎ',
  bic: '0001'
};
export const RakutenBank: BankModel = {
  id: 1289,
  name: '楽天',
  fx_name_kana: 'ﾗｸﾃﾝ',
  bic: '0036'
};
export const SumitomoMitsuiBank: BankModel = {
  id: 1283,
  name: '三井住友',
  fx_name_kana: 'ﾐﾂｲｽﾐﾄﾓ',
  bic: '0009'
};
export const MitsubishiUFJBank: BankModel = {
  id: 1282,
  name: '三菱ＵＦＪ',
  fx_name_kana: 'ﾐﾂﾋﾞｼﾕ-ｴﾌｼﾞｴｲ',
  bic: '0005'
};
export const JapanNetBank: BankModel = {
  id: 1286,
  name: 'ジャパンネット',
  fx_name_kana: 'ｼﾞﾔﾊﾟﾝﾈﾂﾄ',
  bic: '0033'
};
export const JapanPostBank: BankModel = {
  id: 2558,
  name: 'ゆうちょ',
  fx_name_kana: 'ﾕｳﾁﾖ',
  bic: '9900'
};
export const LISTCITY_JAPAN = [
  '北海道', '青森県', '岩手県',
  '宮城県', '秋田県', '山形県',
  '福島県', '茨城県', '栃木県',
  '群馬県', '埼玉県', '千葉県',
  '東京都', '神奈川県', '新潟県',
  '富山県', '石川県', '福井県',
  '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府',
  '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県',
  '広島県', '山口県', '徳島県',
  '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県',
  '鹿児島県', '沖縄県'
];