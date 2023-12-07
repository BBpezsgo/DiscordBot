const https = require('https')
const DOM = require('jsdom')
const fs = require('fs')
const LogError = require('../functions/errorLog').LogError
const Types = require('./tesco')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const ReadFromCache = false

const cookies = "consumer=default; trkid=8a2bbdbd-3239-46a2-94a2-04701a324c26; atrc=62da1feb-5cd0-4dbc-8f57-4c023dd212fb; DCO=sdc; _csrf=wR30HpKPE7ITgOORpQ3FWTV4; cookiePreferences=%7B%22experience%22%3Atrue%2C%22advertising%22%3Atrue%7D; PHPSESSID=baqk6jfll93cvh16vlmurncg31; _abck=8AE7B45E970A055617BA8922B922F2C8~0~YAAQCU4SAhPxE5SEAQAAcjfblAhZyWqso3p07IzPezN6si3w+FOYTrou9dEYnlfD+wIWISign9Zpz3wmCQkaLHL7c8S2H3qsVodR2/3lUgtiALlvuqEKr1g0qTLQUWEZj02x7TevOf2D7LYTRZLeyoBIg8mmalRNrMzrPuDWDH6d+4LUiLbuLNDTrPed17TzYjdD0JH6+hygrmcwVfivFOXBrVBUW+1RDVtWqbpGrlqj1lpEeZAu8ymGrRakoEdnmzAH9iNEfVWTBdAO2RZsS/lt9MEralL1K0WYfcBWGPIaiaZW/8DRin8a+Y/3hrv6A2q0eGSgLNzKX2DoK6nol5nZ/e4ngbRszDFypiDlwA8iv76HSgtdEynVuQppwh0I5PLqXIw0IOQ95pJ8hxwX6lK5fA==~-1~-1~-1; akavpau_hungary_vp=1668953596~id=f7cc8d82cab72630ff6686aa4a170cc1"

const SortMode = {
    Relevance: 'relevance',
    AZ: 'title-ascending',
    ZA: 'title-descending',
    CheapFirst: 'price-ascending',
    ExpensiveFirst: 'price-descending',
}

/**
 * @param {string} data
 * @returns {Types.SearchResult}
 */
const ProcessData = function(data) {
    /** @type {Types.Product[]} */
    const result = []

    const dom = new DOM.JSDOM(data)
    /** @type {Document} */
    const doc = dom.window.document

    const categories = []

    try {
        const filterCategories = doc.getElementById('filter-categories')
        const container = filterCategories.querySelectorAll('div > ul > li.current-filters > u > li a')
        for (let i = 0; i < container.length; i++) {
            const element = container.item(i)
            const categoryName = element.childNodes.item(3).textContent
            const categorySize = Number.parseInt(element.childNodes.item(4).textContent)
            if (categoryName && categorySize) categories.push({
                name: categoryName,
                size: categorySize,
            })
        }
    } catch (error) { LogError(error) }

    /** @type {HTMLUListElement | null} */
    const list = doc.querySelector('#product-list > div.product-list-view.has-trolley > div.product-list-container > div.product-lists > div > div.search.product-list--page.product-list--current-page > div > ul')
    if (list === null) { return undefined }
    list.querySelectorAll('li').forEach(i_ => {
        /** @type {HTMLDivElement | null} */
        const item = i_.querySelector('div > div > div')

        try {
            if (item.textContent.trim() === 'This product\'s currently unavailable') {
                result.push('This product\'s currently unavailable')
                return
            }
        } catch (error) {
            LogError(error)
        }

        var url = null
        var imageUrl = null
        var name = null
        var price = null
        var price2 = null
        var errorOccured = false
        try {
            url = item?.querySelector('div:nth-child(1) > a')?.getAttribute('href')
        } catch (error) {
            errorOccured = true
            LogError(error)
        }
        try {
            imageUrl = item.querySelector('div:nth-child(1) > a img').getAttribute('srcset')
        } catch (error) {
            errorOccured = true
            LogError(error)
        }
        try {
            name = item.querySelector('div:nth-child(1) > div.product-details--wrapper > h3 span').textContent
        } catch (error) {
            name = 'ERROR'
            errorOccured = true
            LogError(error)
        }
        try {
            price = item.querySelector('div:nth-child(1) > div.product-details--wrapper form > div > div > div:nth-child(1) > p:nth-child(1)').textContent
        } catch (error) {
            price = 'ERROR'
            errorOccured = true
            LogError(error)
        }
        try {
            price2 = item.querySelector('div:nth-child(1) > div.product-details--wrapper form > div > div > div:nth-child(1) > p:nth-child(2)').textContent
        } catch (error) {
            price2 = 'ERROR'
            errorOccured = true
            LogError(error)
        }

        var discount = null

        if (item !== null) {
            const discountElement = item.querySelector('div:nth-child(2)')
            if (discountElement !== null) {
                try {
                    var validUntil = discountElement.querySelector('div > div > a > div > span')?.textContent
                    var desc = discountElement.querySelector('div > div > a > div > div > span')?.textContent
        
                    if (validUntil && desc) {
                        discount = {
                            validUntil: validUntil,
                            desc: desc
                        }
                    }
                } catch (error) {
                    errorOccured = true
                    LogError(error)
                }
            }
        }

        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/tesco/errorLiS/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/tesco/errorLiS/')) }
        fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/tesco/errorLiS/' + Date.now() + '.html'), i_.outerHTML, 'utf-8')

        result.push({
            url: (url) ? ('https://bevasarlas.tesco.hu' + url) : null,
            imageUrl: (imageUrl === null) ? null : imageUrl.split(' ')[0],
            name: name,
            price: price,
            price2: price2,
            discount: discount,
        })
    })

    return {
        products: result,
        categories: categories,
    }
}

/**
 * @param {string} search
 * @param {number} page
 * @param {(result: Types.Response<string, string>) => void} callback
 */
function Download(search, page, callback) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/tesco/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/tesco/')) }
    if (ReadFromCache) {
        if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/tesco/search-data-' + search + '.html'))) {
            callback({
                cache: true,
                result: fs.readFileSync(Path.join(CONFIG.paths.base, './cache/tesco/search-data-' + search + '.html'), { encoding: 'utf-8' }),
            })
            return
        }
    }

    /** @type {https.RequestOptions} */
    const options = {
        host: 'bevasarlas.tesco.hu',
        port: 443,
        path: '/groceries/en-GB/search?query=' + search + '&page=' + page + '&sortBy=relevance',
        method: 'GET',
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "utf8",
            "accept-language": "en,hu-HU;q=0.9,hu;q=0.8",
            "cache-control": "max-age=0",
            "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": cookies,
            "Referer": "https://bevasarlas.tesco.hu/groceries/hu-HU/search?query=" + search + "&page=" + page + '&sortBy=relevance',
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "dnt": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        }
    }

    try {            
        const req = https.request(options, function (res) {
            fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/tesco/search-res-' + search + '.json'), JSON.stringify({ headers: res.headers }), { encoding: 'utf-8' })
            res.setEncoding('utf8')
            var data = ''
            res.on('data', function (chunk) {
                data += chunk
            })
            res.on('end', () => {
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/tesco/search-data-' + search + '.html'), data, { encoding: 'utf-8' })
                callback({
                    cache: false,
                    result: data,
                })
            })
            res.on('error', (error) => {
                callback({
                    error: '**HTTPS Response Error:** ' + error,
                })
            })
        })
        req.on('error', (error) => {
            callback({
                error: '**HTTPS Requiest Error:** ' + error,
            })
        })
        req.on('timeout', () => {
            callback({
                error: '**HTTPS Requiest Timeout** ',
            })
        })
        req.on('abort', () => {
            callback({
                error: '**HTTPS Requiest Aborted** ',
            })
        })
        req.end()
    } catch (err) {
        callback({
            error: '**Error:** ' + err,
        })
    }
}

/** 
 * @param {string} search
 * @param {number} page
 * @param {Types.SortMode} sort
 * @returns {Promise<Types.SuccessfulResponse<Types.SearchResult>>}
 */// @ts-ignore
function SearchFor(search, page = 1, sort = SortMode.AZ) {
    return new Promise((resolve, reject) => {
        Download(search, page, res => {
            if (res.error) {
                reject(res.error)
                return
            }
            resolve({
                result: ProcessData(res.result),
                cache: res.cache
            })
        })
    })
}

module.exports = { SearchFor, SortMode }