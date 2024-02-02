// @ts-check
/** @type {import('../config').Config} */
// @ts-ignore
const Config = require('../config')
const API_KEY = Config.tokens['newsdata.io']
const { URL } = require('url')
const fs = require('fs')
const Path = require('path')

const BASE_URL = 'https://newsdata.io/api/1/'

const HTTPS = require('https')

const CacheFolder = 'newsdata'

/**
 * @param {string | HTTPS.RequestOptions | URL} url
 * @returns {Promise<string>}
 */
function GET(url) {
    return new Promise((resolve, reject) => {
        const req = HTTPS.get(url, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                reject(`HTTP ${res.statusCode} ${res.statusMessage}`)
                return
            }
            let data = ''
            res.on('data', chunk => {
                data += chunk
            })
            res.on('end', () => {
                resolve(data)
                if (!fs.existsSync(Path.join(Config.paths.base, './cache/' + CacheFolder + '/'))) fs.mkdirSync(Path.join(Config.paths.base, './cache/' + CacheFolder + '/'), { recursive: true })
                fs.writeFileSync(Path.join(Config.paths.base, './cache/' + CacheFolder + '/result'), data, 'utf-8')
            })
            res.on('error', reject)

            let headersText = ''
            for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
            { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
            if (!fs.existsSync(Path.join(Config.paths.base, './cache/' + CacheFolder + '/'))) fs.mkdirSync(Path.join(Config.paths.base, './cache/' + CacheFolder + '/'), { recursive: true })
            fs.writeFileSync(Path.join(Config.paths.base, './cache/' + CacheFolder + '/headers.txt'), headersText, 'utf-8')
        })

        req.on('abort', () => { reject('Aborted') })
        req.on('error', reject)
        req.on('timeout', () => { reject('Timed out') })
    })
}

/**
 * @param {import('./newsdata.io').Settings} settings
 */
async function GetFresh(settings) {
    let url = BASE_URL + 'news?apikey=' + API_KEY
    if (settings.Page) {
        url += '&page=' + settings.Page
    }
    if (settings.Query) {
        url += '&q=' + settings.Query
    } else if  (settings.QueryInTitle) {
        url += '&qInTitle=' + settings.QueryInTitle
    }
    const resString = await GET(url)
    const res = JSON.parse(resString)

    return res
}

/**
 * @param {string} query
 * @param {string} language
 * @param {Date} fromDate
 * @param {Date} toDate
 */
async function GetArchived(query, language, fromDate, toDate) {
    const resString = await GET(BASE_URL + 'archive?apikey=' + API_KEY + '&q=' + query + '&language=' + language + '&from_date=' + fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getDate() + '&to_date=' + toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-' + toDate.getDate())
    const res = JSON.parse(resString)
}

module.exports = {
    GetFresh,
}