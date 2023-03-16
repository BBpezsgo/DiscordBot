const HTTP = require('../functions/http')
const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

function Get(ApiUrl, CacheFolder, FromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/' + CacheFolder))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/'  + CacheFolder)) }
        if (FromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/' + CacheFolder + '/result.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/' + CacheFolder + '/result.json'), 'utf-8'))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        HTTP.Get(ApiUrl)
            .then(result => {
                const res = result.res
                const body = result.data

                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                
                if (!body) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/' + CacheFolder + '/headers.txt'), headersText, 'utf-8')
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/' + CacheFolder + '/result.json'), body, 'utf-8')
                
                resolve(JSON.parse(body))
            })
            .catch(error => reject('**HTTP Error:** ' + error))
    })
}

module.exports = { Get }