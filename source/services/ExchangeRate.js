const https = require('https')
const fs = require('fs')
const XML = require('xml2js')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const ReadFromCache = false
const ForceReadFromCache = false

const Currencies = [
    'USD',
    'JPY',
    'BGN',
    'CZK',
    'DKK',
    'GBP',
    'HUF',
    'PLN',
    'RON',
    'SEK',
    'CHF',
    'ISK',
    'NOK',
    'TRY',
    'AUD',
    'BRL',
    'CAD',
    'CNY',
    'HKD',
    'IDR',
    'ILS',
    'INR',
    'KRW',
    'MXN',
    'MYR',
    'NZD',
    'PHP',
    'SGD',
    'THB',
    'ZAR'
]

function GetNextUpdate(date) {
    const IsWorkingDay = !(
        date.getDay() === 6 ||
        date.getDay() === 0 ||
        [
            '1-1',
            '4-7',
            '4-10',
            '5-1',
            '5-9',
            '5-18',
            '5-29',
            '6-8',
            '10-3',
            '11-1',
            '12-24',
            '12-25',
            '12-26',
            '12-31'
        ].includes((date.getMonth() + 1).toString() + '-' + date.getDate().toString())
    )

    if (IsWorkingDay && date.getHours() < 16) {
        const nextUpdate = new Date(date.getTime())
        nextUpdate.setHours(16, 0, 0, 0)
        return nextUpdate
    }

    const nextDay = new Date(date.getTime() + (1000 * 60 * 60 * 24))
    return GetNextUpdate(nextDay)
}

function ProcessData(data) {
    const result = { }

    result.sender = data['gesmes:Envelope']['gesmes:Sender'][0]['gesmes:name'][0]
    result.rates = {}
    result.fromCache = false

    result.time = data['gesmes:Envelope']['Cube'][0]['Cube'][0]['$']['time']
    data['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'].forEach(element => {
        result.rates[element['$']['currency']] = Number.parseFloat(element['$']['rate'])
    })

    return result
}

/** @param {string} data @param {(result: any | null, error: string | null) => void} callback */
function Parse(data, callback) {
    const parser = new XML.Parser()
    parser.parseString(data, function (error, result) {
        if (error) {
            callback(null, error)
            return
        }
        callback(result, null)
    })
}

/** @param {(result: string | undefined, error: string | undefined, fromCache: boolean) => void} callback */
function Download(callback) {
    if (ReadFromCache) {
        if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/currency-data.xml')) && (fs.existsSync(Path.join(CONFIG.paths.base, './cache/currency-date.txt')) || ForceReadFromCache)) {
            const cacheDate = ForceReadFromCache ? 0 : Number.parseInt(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/currency-date.txt'), 'utf8'))
            const difference = Date.now() - cacheDate
            if (difference > (1000 * 60 * 60 * 24)) {
                callback(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/currency-data.xml'), 'utf8'), undefined, true)
                return
            }
        }
    }

    try {
        const req = https.request('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', function (res) {
            res.setEncoding('utf8')
            let data = ''
            fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/currency-res.json'), JSON.stringify({ headers: res.headers }, null, ' '), 'utf8')
            res.on('data', function (chunk) {
                data += chunk
            })
            res.on('end', () => {
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/currency-data.xml'), data, 'utf8')
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/currency-date.txt'), Date.now().toString(), 'utf8')
                callback(data, undefined, false)
            })
            res.on('error', (error) => {
                callback(undefined, '**HTTPS Response Error:** ' + error, false)
            })
        })
        req.on('error', (error) => {
            callback(undefined, '**HTTPS Requiest Error:** ' + error, false)
        })
        req.end()
    } catch (err) {
        callback(undefined, '**Error:** ' + err, false)
    }
}

// Download((result, error) => { if(error){return}; console.log(ProcessData(result)) })

function GetCurrency() {
    return new Promise((callback, reject) => {
        Download((raw, downloadError, fromCache) => {
            if (downloadError) {
                reject(downloadError)
                return
            }
            Parse(raw, (parsed, parserError) => {
                if (parserError) {
                    reject(parserError)
                    return
                }

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/currency-parsed.json'), JSON.stringify(parsed, null, ' '), 'utf8')
    
                const processed = ProcessData(parsed)
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/currency-processed.json'), JSON.stringify(processed, null, ' '), 'utf8')
                processed.fromCache = fromCache
                callback(processed)
            })
        })
    })
}

const Currency = {
    USD: 'USD',
    JPY: 'JPY',
    BGN: 'BGN',
    CZK: 'CZK',
    DKK: 'DKK',
    GBP: 'GBP',
    HUF: 'HUF',
    PLN: 'PLN',
    RON: 'RON',
    SEK: 'SEK',
    CHF: 'CHF',
    ISK: 'ISK',
    NOK: 'NOK',
    TRY: 'TRY',
    AUD: 'AUD',
    BRL: 'BRL',
    CAD: 'CAD',
    CNY: 'CNY',
    HKD: 'HKD',
    IDR: 'IDR',
    ILS: 'ILS',
    INR: 'INR',
    KRW: 'KRW',
    MXN: 'MXN',
    MYR: 'MYR',
    NZD: 'NZD',
    PHP: 'PHP',
    SGD: 'SGD',
    THB: 'THB',
    ZAR: 'ZAR'
}

module.exports = { GetCurrency, Currencies, Currency, GetNextUpdate }