const https = require('https')
const DOM = require('jsdom')
const fs = require('fs')

const ReadFromCache = true

const ProcessData = function(data) {
    var result = []

    const dom = new DOM.JSDOM(data)
    const doc = dom.window.document
    /** @type {HTMLUListElement | null} */
    const list = doc.querySelector('#product-list > div.product-list-view.has-trolley > div.product-list-container > div.product-lists > div > div.search.product-list--page.product-list--current-page > div > ul')
    if (list === null) { console.log('null'); return undefined; }
    list.querySelectorAll('li').forEach(i_ => {
        const item = i_.querySelector('div > div > div')
        const url = item.querySelector('div:nth-child(1) > a').getAttribute('href')
        const imageUrl = item.querySelector('div:nth-child(1) > a img').getAttribute('srcset')
        const name = item.querySelector('div:nth-child(1) > div.product-details--wrapper > h3 span').textContent
        const price = item.querySelector('div:nth-child(1) > div.product-details--wrapper form > div > div > div:nth-child(1) > p:nth-child(1)').textContent
        const price2 = item.querySelector('div:nth-child(1) > div.product-details--wrapper form > div > div > div:nth-child(1) > p:nth-child(2)').textContent
        
        var discount = undefined

        const discountElement = item.querySelector('div:nth-child(2)')
        if (discountElement !== null) {
            try {
                var validUntil = discountElement.querySelector('div > div > a > div > span').textContent
                var desc = discountElement.querySelector('div > div > a > div > div > span').textContent
    
                discount = {
                    validUntil: validUntil,
                    desc: desc
                }
            } catch (error) { }
        }

        result.push({
            url: 'https://bevasarlas.tesco.hu' + url,
            imageUrl: imageUrl.split(' ')[0],
            name: name,
            price: price,
            price2: price2,
            discount: discount
        })
    })

    return result
}

/** @param {(isCache: boolean, result: string | undefined, error: string | undefined) => void} callback */
const Download = function(search, callback) {
    if (!fs.existsSync('../tesco-cache/')) { fs.mkdirSync('../tesco-cache/') }
    if (ReadFromCache) {
        if (fs.existsSync('../tesco-cache/search-data-' + search + '.html')) {
            callback(true, fs.readFileSync('../tesco-cache/search-data-' + search + '.html', { encoding: 'utf-8' }))
            return
        }
    }

    /** @type {https.RequestOptions} */
    const options = {
        host: 'bevasarlas.tesco.hu',
        port: 443,
        path: '/groceries/en-GB/search?query=' + search,
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
            "cookie": "consumer=default; trkid=8a2bbdbd-3239-46a2-94a2-04701a324c26; atrc=62da1feb-5cd0-4dbc-8f57-4c023dd212fb; DCO=sdc; _csrf=wR30HpKPE7ITgOORpQ3FWTV4; cookiePreferences=%7B%22experience%22%3Atrue%2C%22advertising%22%3Atrue%7D; PHPSESSID=baqk6jfll93cvh16vlmurncg31; _abck=8AE7B45E970A055617BA8922B922F2C8~0~YAAQyV4OF9v6QoKEAQAAmgTxhQgXOgQt3xQlJN+hTk/wxlOsFrlXjOt13imEYa/I/NwGsdo1AcNBNb+bSmKhlHfr6VFzChnk/mSwyfx6JAphneptv0J74dfccyGHtDAvORDSG1rpESWxGXk0qSFTr+4ncTrmFE+Qvzx4mEd14Fzj3c/C4dV+7AbXVXgJlrzCNiEjj7j3EHhFzju4jG03LyfbSUc/a3G5sHxtL3LRitj5KBBXLy5Tp9zfpHpO+9R3OBqpmGIGB/oynvWdc/ZuyUvH99nhR0kEe7f35cyPxGG0y0qi8jcZhGHig6KdTHkuqarEi6SKqvbZ9n+WqEmkXt0I0kI31rPLEU518szdcSHRyYCGKGi4px9HBi0W6aOlglYfbFsqCO2GuNakxypl/KjJcA==~-1~-1~-1; ak_bmsc=378327DD72DEEC8230325BBA3FAD7129~000000000000000000000000000000~YAAQyV4OF9z6QoKEAQAAmgTxhRHZd/PGv6Qdid8IetkpYjCGiR1NLpICnbKbupj/LM2PnHdK2F03OtzfNmha0R7repD4oVmlni7Xr9cuxKqpnAQcdattoHGRh0x2ciQIToJD9tZIPutorB82cwcWU3BLmx7P3gb+PBOP1Oino22iT6SsuRyVvMMmOIhtL0MJAwyWZr903fn3R7jsgSC8pdhzqNM6GXj1tLw+j2jQosatTaQqt99lqQv4MiNqXm2I9HW70nH7e1AnfAxqA1CqoqHhJN1yQU0Q0N4i+bCY0rMSrqV3M5nuPNV1qGouqwyX5m2YmY8IQxgUY7DGNO+w6mwJhxEhPbasPUoC71zp6+Ia1uEKIs2vUhJjPExbTxLLG+cfVwNP1CU=; bm_sz=0A174E545C134820AC31FFE92454CED5~YAAQyV4OF976QoKEAQAAmgTxhRHAqZZ8ILSud/3b6hxRXusM4/X3hPDL9AkHXAG084KQJ/TV824jBM9TfLAvxq3gXylxzQKRjKiW0uYLfej4OUdVXdiMXRAFMpJBlGeAoDzbAITqwyMiamohJtxzWIQBgYj1PVbOVZI7/3eN8IzFnUcjnj8JX7wvJ5uYt2Vw1wCDr3fYMeNplis5dVpNJyu8aKp31hgCUDe49mMSk/XgMa+oROcjRS/Y981qgpXw4tSKlmh/O8jWs2ph5cd91UtnY101U2TV0DXod2RhsIl7~3621430~4338996; ighs-sess=eyJzdG9yZUlkIjoiNDE1NDAiLCJhbmFseXRpY3NTZXNzaW9uSWQiOiI1NzdiYmRiNTIzZmFhOTUxNTQ0NTM2NTY4YmE1ODIwZSIsInJlcXVlc3RCYWNrdXBzIjpbeyJpZCI6ImY0MGRiMTljLTZkNGQtNDMwYy05MjNiLWM3MDAyYTdhZGE1MCIsIm1ldGhvZCI6IlBPU1QiLCJ1cmwiOiIvZ3JvY2VyaWVzL2h1LUhVL2xhbmd1YWdlL3N3aXRjaCIsImJvZHkiOnsicmVxdWVzdGVkTGFuZyI6ImVuLUdCIiwicmV0dXJuVXJsIjoiL2dyb2Nlcmllcy9odS1IVS9zZWFyY2g/cXVlcnk9cG9wY29ybiZwYWdlPTEiLCJfY3NyZiI6IlIyb3pKVDJlLU5Fbk5FRkxYMTBYNWpuQWRJRkpONzR4MDlRNCJ9LCJ0aW1lc3RhbXAiOjE2Njg2OTQ1NDkxMDl9XX0=; ighs-sess.sig=TNIJA1_29-LC7l0lWsfWDptQdtg; bm_mi=2EAC8C2C45F29E8433561898A3E5FEBF~YAAQyV4OF4L+QoKEAQAA+SXyhRE3jFtgHnWuFnq6/rMOm4x92v17BojSkApzEV7nLoZIx8k4VuDASBDgLIkcTYyvE6pbjLujLkKYgbdIGx2nzMKKaus5GxzGeEoKUe7M06IB2RJR34bgBVwFY4HvgW9rtryPvNGQmice2cT9VSW1YUQZJSTs/2yp4MbwKOt+nBmPtf4LZ/RjkdOzTdSKYRvXDB4lKkmbsOHAhvYZe6a3dM438FanGwMaJQGQds1EWWMyI1o7tEsksNcTwjtTbsNVUmWUMs3C2MBa2BA+o3ABKyJCRGMFJtdeqA8TNO9YO215uUw3WeyNRTMP+a7fQk2k~1; akavpau_hungary_vp=1668694866~id=86d76577bc78aec0e5ae03af32c9b999; bm_sv=595159505DF50DB3C46EBBFB47F895FF~YAAQyV4OF1P/QoKEAQAAgGTyhRGuFAYJihbhvJ8QE708kO+9kHnqPvfSdo9fPfQUvtwww/s5mY7SGKoscBQHrSq1Vcfe5NyAUjfM6xZOwziIeMG4TJJARHzwdJTJcnqF2poiYA+pOg9zgoQFFpNooPrfk1tGO+Ue+53tqcz6hzU5KYBi05ox/nMAoFtnTD6+y1zNZB92iBKNtdlvueObnw1vp0rIEEB9fgoNrxsYrJ/k5rov0Yaosm0DBacDmw==~1",
            "Referer": "https://bevasarlas.tesco.hu/groceries/hu-HU/search?query=" + search + "&page=1",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "dnt": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        }
    }

    try {            
        const req = https.request(options, function (res) {
            res.setEncoding('utf8')
            var data = ''
            fs.writeFileSync('../search-res-' + search + '.json', JSON.stringify({ headers: res.headers }), { encoding: 'utf-8' })
            res.on('data', function (chunk) {
                data += chunk
            })
            res.on('end', () => {
                fs.writeFileSync('../search-data-' + search + '.html', data, { encoding: 'utf-8' })
                callback(false, data)
            })
            res.on('error', (error) => {
                callback(false, undefined, '**HTTPS Response Error:** ' + error)
            })
        })
        req.on('error', (error) => {
            callback(false, undefined, '**HTTPS Requiest Error:** ' + error)
        })
        req.end()
    } catch (err) {
        callback(false, undefined, '**Error:** ' + err)
    }
}

// ProcessData(fs.readFileSync('./tesco-cache/search-data-bread.html', { encoding: 'utf-8' }))
// Download('bread', (result, error) => { if(error){return}; ProcessData(result); })

/** @returns {Promise<{result: string|undefined; error: string|undefined; isCache: boolean}>} */
const SearchFor = function(search) {
    return new Promise((callback) => {
        Download(search, (isCache, result, error) => {
            if (error) {
                callback({ error: error })
                return
            }
            callback({ result: ProcessData(result), isCache: isCache })
        })
    })
}

module.exports = { SearchFor }