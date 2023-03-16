const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')
const HTTP = require('../functions/http')

/** @param {string} query */
function SearchFor(query) {
    return new Promise((resolve, reject) => {
        HTTP.Get('https://crossoutdb.com/api/v1/items?query=' + query)
            .then(result => {
                const body = result.data

                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'), { recursive: true }) }
                
                const resultList = JSON.parse(body)
                fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/crossoutdb/search-${query}.json`), JSON.stringify(resultList, null, ' '), { encoding: 'utf-8' })

                if (!resultList) {
                    resolve(null)
                    return
                }
    
                if (!resultList[0]) {
                    resolve(null)
                    return
                }
                resolve(resultList[0])
            })
            .catch(error => reject(error))
    })
}

module.exports = { SearchFor }