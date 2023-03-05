// export type Currency = 'USD' | 'JPY' | 'BGN' | 'CZK' | 'DKK' | 'GBP' | 'HUF' | 'PLN' | 'RON' | 'SEK' | 'CHF' | 'ISK' | 'NOK' | 'TRY' | 'AUD' | 'BRL' | 'CAD' | 'CNY' | 'HKD' | 'IDR' | 'ILS' | 'INR' | 'KRW' | 'MXN' | 'MYR' | 'NZD' | 'PHP' | 'SGD' | 'THB' | 'ZAR'

export const Currencies: string[]

export enum Currency {
    USD = 'USD',
    JPY = 'JPY',
    BGN = 'BGN',
    CZK = 'CZK',
    DKK = 'DKK',
    GBP = 'GBP',
    HUF = 'HUF',
    PLN = 'PLN',
    RON = 'RON',
    SEK = 'SEK',
    CHF = 'CHF',
    ISK = 'ISK',
    NOK = 'NOK',
    TRY = 'TRY',
    AUD = 'AUD',
    BRL = 'BRL',
    CAD = 'CAD',
    CNY = 'CNY',
    HKD = 'HKD',
    IDR = 'IDR',
    ILS = 'ILS',
    INR = 'INR',
    KRW = 'KRW',
    MXN = 'MXN',
    MYR = 'MYR',
    NZD = 'NZD',
    PHP = 'PHP',
    SGD = 'SGD',
    THB = 'THB',
    ZAR = 'ZAR'
}

export type Result = {
    sender: string
    rates: object
    /** `YYYY-MM-DD` */
    time: string
    fromCache: boolean
}

export function GetNextUpdate(date: Date): Date
export function GetCurrency(): Promise<Result>