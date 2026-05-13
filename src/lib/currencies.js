// Exchange rates relative to CAD. Update periodically or integrate a live-rates API.
export const CURRENCIES = {
  // ── Already supported ────────────────────────────────────────────────────────
  CAD: { code: 'CAD', symbol: 'CA$',  locale: 'en-CA',  rate: 1,       name: 'Canadian Dollar' },
  USD: { code: 'USD', symbol: 'US$',  locale: 'en-US',  rate: 0.73,    name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£',    locale: 'en-GB',  rate: 0.58,    name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€',    locale: 'de-DE',  rate: 0.67,    name: 'Euro' },
  AUD: { code: 'AUD', symbol: 'A$',   locale: 'en-AU',  rate: 1.09,    name: 'Australian Dollar' },
  PKR: { code: 'PKR', symbol: '₨',    locale: 'en-PK',  rate: 205,     name: 'Pakistani Rupee' },

  // ── Gulf / Middle East ────────────────────────────────────────────────────────
  AED: { code: 'AED', symbol: 'د.إ',  locale: 'ar-AE',  rate: 2.68,    name: 'UAE Dirham' },
  SAR: { code: 'SAR', symbol: '﷼',    locale: 'ar-SA',  rate: 2.74,    name: 'Saudi Riyal' },
  QAR: { code: 'QAR', symbol: 'QR',   locale: 'ar-QA',  rate: 2.66,    name: 'Qatari Riyal' },
  KWD: { code: 'KWD', symbol: 'KD',   locale: 'ar-KW',  rate: 0.224,   name: 'Kuwaiti Dinar' },
  BHD: { code: 'BHD', symbol: 'BD',   locale: 'ar-BH',  rate: 0.275,   name: 'Bahraini Dinar' },
  OMR: { code: 'OMR', symbol: 'OMR',  locale: 'ar-OM',  rate: 0.281,   name: 'Omani Rial' },
  JOD: { code: 'JOD', symbol: 'JD',   locale: 'ar-JO',  rate: 0.518,   name: 'Jordanian Dinar' },
  EGP: { code: 'EGP', symbol: 'E£',   locale: 'ar-EG',  rate: 36.5,    name: 'Egyptian Pound' },
  IQD: { code: 'IQD', symbol: 'IQD',  locale: 'ar-IQ',  rate: 955,     name: 'Iraqi Dinar' },
  SYP: { code: 'SYP', symbol: 'LS',   locale: 'ar-SY',  rate: 9470,    name: 'Syrian Pound' },
  YER: { code: 'YER', symbol: 'YR',   locale: 'ar-YE',  rate: 182,     name: 'Yemeni Rial' },
  LBP: { code: 'LBP', symbol: 'LL',   locale: 'ar-LB',  rate: 65400,   name: 'Lebanese Pound' },
  TRY: { code: 'TRY', symbol: '₺',    locale: 'tr-TR',  rate: 26.3,    name: 'Turkish Lira' },
  ILS: { code: 'ILS', symbol: '₪',    locale: 'he-IL',  rate: 2.76,    name: 'Israeli Shekel' },

  // ── South Asia ────────────────────────────────────────────────────────────────
  INR: { code: 'INR', symbol: '₹',    locale: 'en-IN',  rate: 61.5,    name: 'Indian Rupee' },
  BDT: { code: 'BDT', symbol: '৳',    locale: 'bn-BD',  rate: 80,      name: 'Bangladeshi Taka' },
  LKR: { code: 'LKR', symbol: 'Rs',   locale: 'si-LK',  rate: 235,     name: 'Sri Lankan Rupee' },
  NPR: { code: 'NPR', symbol: 'Rs',   locale: 'ne-NP',  rate: 98,      name: 'Nepalese Rupee' },
  MVR: { code: 'MVR', symbol: 'Rf',   locale: 'dv-MV',  rate: 11.3,    name: 'Maldivian Rufiyaa' },
  AFN: { code: 'AFN', symbol: '؋',    locale: 'ps-AF',  rate: 51,      name: 'Afghan Afghani' },

  // ── East Asia ─────────────────────────────────────────────────────────────────
  CNY: { code: 'CNY', symbol: '¥',    locale: 'zh-CN',  rate: 5.3,     name: 'Chinese Yuan' },
  JPY: { code: 'JPY', symbol: '¥',    locale: 'ja-JP',  rate: 110,     name: 'Japanese Yen' },
  KRW: { code: 'KRW', symbol: '₩',    locale: 'ko-KR',  rate: 980,     name: 'South Korean Won' },
  HKD: { code: 'HKD', symbol: 'HK$',  locale: 'zh-HK',  rate: 5.7,     name: 'Hong Kong Dollar' },
  TWD: { code: 'TWD', symbol: 'NT$',  locale: 'zh-TW',  rate: 23.5,    name: 'Taiwan Dollar' },
  MOP: { code: 'MOP', symbol: 'MOP$', locale: 'zh-MO',  rate: 5.88,    name: 'Macanese Pataca' },
  MNT: { code: 'MNT', symbol: '₮',    locale: 'mn-MN',  rate: 2510,    name: 'Mongolian Tögrög' },

  // ── Southeast Asia ────────────────────────────────────────────────────────────
  SGD: { code: 'SGD', symbol: 'S$',   locale: 'en-SG',  rate: 0.98,    name: 'Singapore Dollar' },
  MYR: { code: 'MYR', symbol: 'RM',   locale: 'ms-MY',  rate: 3.28,    name: 'Malaysian Ringgit' },
  THB: { code: 'THB', symbol: '฿',    locale: 'th-TH',  rate: 26,      name: 'Thai Baht' },
  IDR: { code: 'IDR', symbol: 'Rp',   locale: 'id-ID',  rate: 11500,   name: 'Indonesian Rupiah' },
  PHP: { code: 'PHP', symbol: '₱',    locale: 'fil-PH', rate: 41,      name: 'Philippine Peso' },
  VND: { code: 'VND', symbol: '₫',    locale: 'vi-VN',  rate: 18600,   name: 'Vietnamese Dong' },
  MMK: { code: 'MMK', symbol: 'K',    locale: 'my-MM',  rate: 2100,    name: 'Myanmar Kyat' },
  KHR: { code: 'KHR', symbol: '៛',    locale: 'km-KH',  rate: 2990,    name: 'Cambodian Riel' },
  LAK: { code: 'LAK', symbol: '₭',    locale: 'lo-LA',  rate: 15900,   name: 'Lao Kip' },
  BND: { code: 'BND', symbol: 'B$',   locale: 'ms-BN',  rate: 0.98,    name: 'Brunei Dollar' },

  // ── Central Asia ──────────────────────────────────────────────────────────────
  KZT: { code: 'KZT', symbol: '₸',    locale: 'kk-KZ',  rate: 365,     name: 'Kazakhstani Tenge' },
  UZS: { code: 'UZS', symbol: 'сум',  locale: 'uz-UZ',  rate: 9400,    name: 'Uzbekistani Som' },
  KGS: { code: 'KGS', symbol: 'с',    locale: 'ky-KG',  rate: 63.5,    name: 'Kyrgystani Som' },
  TJS: { code: 'TJS', symbol: 'SM',   locale: 'tg-TJ',  rate: 7.97,    name: 'Tajikistani Somoni' },
  TMT: { code: 'TMT', symbol: 'T',    locale: 'tk-TM',  rate: 2.55,    name: 'Turkmenistani Manat' },
  AZN: { code: 'AZN', symbol: '₼',    locale: 'az-AZ',  rate: 1.24,    name: 'Azerbaijani Manat' },
  GEL: { code: 'GEL', symbol: '₾',    locale: 'ka-GE',  rate: 1.98,    name: 'Georgian Lari' },
  AMD: { code: 'AMD', symbol: '֏',    locale: 'hy-AM',  rate: 283,     name: 'Armenian Dram' },

  // ── Europe (non-Euro) ─────────────────────────────────────────────────────────
  CHF: { code: 'CHF', symbol: 'Fr',   locale: 'de-CH',  rate: 0.684,   name: 'Swiss Franc' },
  SEK: { code: 'SEK', symbol: 'kr',   locale: 'sv-SE',  rate: 7.7,     name: 'Swedish Krona' },
  NOK: { code: 'NOK', symbol: 'kr',   locale: 'nb-NO',  rate: 7.9,     name: 'Norwegian Krone' },
  DKK: { code: 'DKK', symbol: 'kr',   locale: 'da-DK',  rate: 5.1,     name: 'Danish Krone' },
  PLN: { code: 'PLN', symbol: 'zł',   locale: 'pl-PL',  rate: 3.0,     name: 'Polish Zloty' },
  CZK: { code: 'CZK', symbol: 'Kč',   locale: 'cs-CZ',  rate: 17.2,    name: 'Czech Koruna' },
  HUF: { code: 'HUF', symbol: 'Ft',   locale: 'hu-HU',  rate: 264,     name: 'Hungarian Forint' },
  RON: { code: 'RON', symbol: 'lei',  locale: 'ro-RO',  rate: 3.35,    name: 'Romanian Leu' },
  BGN: { code: 'BGN', symbol: 'лв',   locale: 'bg-BG',  rate: 1.31,    name: 'Bulgarian Lev' },
  HRK: { code: 'HRK', symbol: 'kn',   locale: 'hr-HR',  rate: 5.07,    name: 'Croatian Kuna' },
  RSD: { code: 'RSD', symbol: 'din',  locale: 'sr-RS',  rate: 78.3,    name: 'Serbian Dinar' },
  BAM: { code: 'BAM', symbol: 'KM',   locale: 'bs-BA',  rate: 1.31,    name: 'Bosnia Mark' },
  MKD: { code: 'MKD', symbol: 'ден',  locale: 'mk-MK',  rate: 41.2,    name: 'Macedonian Denar' },
  ALL: { code: 'ALL', symbol: 'L',    locale: 'sq-AL',  rate: 73.3,    name: 'Albanian Lek' },
  RUB: { code: 'RUB', symbol: '₽',    locale: 'ru-RU',  rate: 69.4,    name: 'Russian Ruble' },
  UAH: { code: 'UAH', symbol: '₴',    locale: 'uk-UA',  rate: 27.2,    name: 'Ukrainian Hryvnia' },
  BYN: { code: 'BYN', symbol: 'Br',   locale: 'be-BY',  rate: 2.39,    name: 'Belarusian Ruble' },
  MDL: { code: 'MDL', symbol: 'L',    locale: 'ro-MD',  rate: 12.9,    name: 'Moldovan Leu' },
  ISK: { code: 'ISK', symbol: 'kr',   locale: 'is-IS',  rate: 102,     name: 'Icelandic Króna' },

  // ── Americas ──────────────────────────────────────────────────────────────────
  NZD: { code: 'NZD', symbol: 'NZ$',  locale: 'en-NZ',  rate: 1.17,    name: 'New Zealand Dollar' },
  BRL: { code: 'BRL', symbol: 'R$',   locale: 'pt-BR',  rate: 3.7,     name: 'Brazilian Real' },
  MXN: { code: 'MXN', symbol: '$',    locale: 'es-MX',  rate: 12.5,    name: 'Mexican Peso' },
  ARS: { code: 'ARS', symbol: '$',    locale: 'es-AR',  rate: 680,     name: 'Argentine Peso' },
  CLP: { code: 'CLP', symbol: '$',    locale: 'es-CL',  rate: 695,     name: 'Chilean Peso' },
  COP: { code: 'COP', symbol: '$',    locale: 'es-CO',  rate: 2930,    name: 'Colombian Peso' },
  PEN: { code: 'PEN', symbol: 'S/',   locale: 'es-PE',  rate: 2.74,    name: 'Peruvian Sol' },
  UYU: { code: 'UYU', symbol: '$U',   locale: 'es-UY',  rate: 28.6,    name: 'Uruguayan Peso' },
  BOB: { code: 'BOB', symbol: 'Bs',   locale: 'es-BO',  rate: 5.03,    name: 'Bolivian Boliviano' },
  PYG: { code: 'PYG', symbol: '₲',    locale: 'es-PY',  rate: 5295,    name: 'Paraguayan Guaraní' },
  VES: { code: 'VES', symbol: 'Bs.S', locale: 'es-VE',  rate: 26.3,    name: 'Venezuelan Bolívar' },
  GTQ: { code: 'GTQ', symbol: 'Q',    locale: 'es-GT',  rate: 5.68,    name: 'Guatemalan Quetzal' },
  HNL: { code: 'HNL', symbol: 'L',    locale: 'es-HN',  rate: 18,      name: 'Honduran Lempira' },
  NIO: { code: 'NIO', symbol: 'C$',   locale: 'es-NI',  rate: 26.7,    name: 'Nicaraguan Córdoba' },
  CRC: { code: 'CRC', symbol: '₡',    locale: 'es-CR',  rate: 378,     name: 'Costa Rican Colón' },
  DOP: { code: 'DOP', symbol: 'RD$',  locale: 'es-DO',  rate: 42.9,    name: 'Dominican Peso' },
  JMD: { code: 'JMD', symbol: 'J$',   locale: 'en-JM',  rate: 113,     name: 'Jamaican Dollar' },
  TTD: { code: 'TTD', symbol: 'TT$',  locale: 'en-TT',  rate: 4.96,    name: 'T&T Dollar' },
  BBD: { code: 'BBD', symbol: 'Bds$', locale: 'en-BB',  rate: 1.46,    name: 'Barbadian Dollar' },

  // ── Africa ────────────────────────────────────────────────────────────────────
  ZAR: { code: 'ZAR', symbol: 'R',    locale: 'en-ZA',  rate: 13.7,    name: 'South African Rand' },
  NGN: { code: 'NGN', symbol: '₦',    locale: 'en-NG',  rate: 1090,    name: 'Nigerian Naira' },
  KES: { code: 'KES', symbol: 'KSh',  locale: 'sw-KE',  rate: 95,      name: 'Kenyan Shilling' },
  GHS: { code: 'GHS', symbol: 'GH₵',  locale: 'en-GH',  rate: 11.2,    name: 'Ghanaian Cedi' },
  ETB: { code: 'ETB', symbol: 'Br',   locale: 'am-ET',  rate: 40.6,    name: 'Ethiopian Birr' },
  TZS: { code: 'TZS', symbol: 'TSh',  locale: 'sw-TZ',  rate: 1860,    name: 'Tanzanian Shilling' },
  UGX: { code: 'UGX', symbol: 'USh',  locale: 'sw-UG',  rate: 2730,    name: 'Ugandan Shilling' },
  MAD: { code: 'MAD', symbol: 'DH',   locale: 'ar-MA',  rate: 7.3,     name: 'Moroccan Dirham' },
  DZD: { code: 'DZD', symbol: 'DA',   locale: 'ar-DZ',  rate: 98.8,    name: 'Algerian Dinar' },
  TND: { code: 'TND', symbol: 'DT',   locale: 'ar-TN',  rate: 2.29,    name: 'Tunisian Dinar' },
  LYD: { code: 'LYD', symbol: 'LD',   locale: 'ar-LY',  rate: 3.54,    name: 'Libyan Dinar' },
  SDG: { code: 'SDG', symbol: 'SDG',  locale: 'ar-SD',  rate: 438,     name: 'Sudanese Pound' },
  RWF: { code: 'RWF', symbol: 'RF',   locale: 'rw-RW',  rate: 970,     name: 'Rwandan Franc' },
  XOF: { code: 'XOF', symbol: 'CFA',  locale: 'fr-SN',  rate: 439,     name: 'West African CFA' },
  XAF: { code: 'XAF', symbol: 'CFA',  locale: 'fr-CM',  rate: 439,     name: 'Central African CFA' },
  ZMW: { code: 'ZMW', symbol: 'ZK',   locale: 'en-ZM',  rate: 19.7,    name: 'Zambian Kwacha' },
  MWK: { code: 'MWK', symbol: 'MK',   locale: 'en-MW',  rate: 1260,    name: 'Malawian Kwacha' },
  MZN: { code: 'MZN', symbol: 'MT',   locale: 'pt-MZ',  rate: 46.7,    name: 'Mozambican Metical' },
  BWP: { code: 'BWP', symbol: 'P',    locale: 'en-BW',  rate: 9.96,    name: 'Botswanan Pula' },
  NAD: { code: 'NAD', symbol: 'N$',   locale: 'en-NA',  rate: 13.7,    name: 'Namibian Dollar' },
  SZL: { code: 'SZL', symbol: 'L',    locale: 'en-SZ',  rate: 13.7,    name: 'Swazi Lilangeni' },
  MUR: { code: 'MUR', symbol: '₨',    locale: 'en-MU',  rate: 33.9,    name: 'Mauritian Rupee' },
  SCR: { code: 'SCR', symbol: '₨',    locale: 'en-SC',  rate: 9.88,    name: 'Seychellois Rupee' },
  AOA: { code: 'AOA', symbol: 'Kz',   locale: 'pt-AO',  rate: 605,     name: 'Angolan Kwanza' },
  CDF: { code: 'CDF', symbol: 'FC',   locale: 'fr-CD',  rate: 2060,    name: 'Congolese Franc' },
};

// ISO 3166-1 alpha-2 country → currency code
export const COUNTRY_CURRENCY_MAP = {
  // North America
  CA: 'CAD', US: 'USD', MX: 'MXN',

  // Gulf / Middle East
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD',
  OM: 'OMR', JO: 'JOD', EG: 'EGP', IQ: 'IQD', SY: 'SYP',
  YE: 'YER', LB: 'LBP', IL: 'ILS', TR: 'TRY',

  // South Asia
  PK: 'PKR', IN: 'INR', BD: 'BDT', LK: 'LKR', NP: 'NPR',
  MV: 'MVR', AF: 'AFN',

  // East Asia
  CN: 'CNY', JP: 'JPY', KR: 'KRW', HK: 'HKD', TW: 'TWD',
  MO: 'MOP', MN: 'MNT',

  // Southeast Asia
  SG: 'SGD', MY: 'MYR', TH: 'THB', ID: 'IDR', PH: 'PHP',
  VN: 'VND', MM: 'MMK', KH: 'KHR', LA: 'LAK', BN: 'BND',

  // Central Asia
  KZ: 'KZT', UZ: 'UZS', KG: 'KGS', TJ: 'TJS', TM: 'TMT',
  AZ: 'AZN', GE: 'GEL', AM: 'AMD',

  // Oceania
  AU: 'AUD', NZ: 'NZD',

  // Europe – Eurozone
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  AT: 'EUR', BE: 'EUR', PT: 'EUR', FI: 'EUR', IE: 'EUR',
  GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR',
  LV: 'EUR', LT: 'EUR', CY: 'EUR', MT: 'EUR', HR: 'EUR',

  // Europe – non-Euro
  GB: 'GBP', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN',
  RS: 'RSD', BA: 'BAM', MK: 'MKD', AL: 'ALL', IS: 'ISK',
  RU: 'RUB', UA: 'UAH', BY: 'BYN', MD: 'MDL',

  // South America
  BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
  UY: 'UYU', BO: 'BOB', PY: 'PYG', VE: 'VES',

  // Central America & Caribbean
  GT: 'GTQ', HN: 'HNL', NI: 'NIO', CR: 'CRC', DO: 'DOP',
  JM: 'JMD', TT: 'TTD', BB: 'BBD',

  // Africa
  ZA: 'ZAR', NG: 'NGN', KE: 'KES', GH: 'GHS', ET: 'ETB',
  TZ: 'TZS', UG: 'UGX', MA: 'MAD', DZ: 'DZD', TN: 'TND',
  LY: 'LYD', SD: 'SDG', RW: 'RWF', SN: 'XOF', CI: 'XOF',
  CM: 'XAF', ZM: 'ZMW', MW: 'MWK', MZ: 'MZN', BW: 'BWP',
  NA: 'NAD', SZ: 'SZL', MU: 'MUR', SC: 'SCR', AO: 'AOA',
  CD: 'CDF',
};
