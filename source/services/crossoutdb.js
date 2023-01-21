const request = require("request")
const fs = require('fs')

/** @param {string} query */
function SearchFor(query) {
    return new Promise((resolve, reject) => {
        request('https://crossoutdb.com/api/v1/items?query=' + query, function (error, res, body) {
            if (error) {
                reject(error)
                return
            }
            if (!fs.existsSync('./cache/crossoutdb/')) { fs.mkdirSync('./cache/crossoutdb/', { recursive: true }) }
            
            const resultList = JSON.parse(body)

            fs.writeFileSync(`./cache/crossoutdb/search-${query}.json`, JSON.stringify(resultList, null, ' '), { encoding: 'utf-8' })

            if (!resultList) {
                resolve(null)
                return
            }

            const result = resultList[0]
            if (!result) {
                resolve(null)
                return
            }

            resolve(result)
        })
    })
}

module.exports = { SearchFor }