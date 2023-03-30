// @ts-check

const fs = require('fs')
/** @type {import('../config').Config} */
// @ts-ignore
const CONFIG = require('../config.json')
const Path = require('path')
const HTTP = require('../functions/http')
const Types = require('./crossoutdb')

const BaseURI = 'https://crossoutdb.com/api/v1/'

/** @param {string | Types.SearchOptions} options */
function GetID(options) {
    let result = ''
    if (typeof options === 'string') {
        result += '&query=' + options
    } else {
        if (options.rarity) {
            result += '&rarity=' + options.rarity
        }
        if (options.category) {
            result += '&category=' + options.category
        }
        if (options.faction) {
            result += '&faction=' + options.faction
        }
        if (options.removedItems) {
            result += '&removedItems=' + options.removedItems
        }
        if (options.metaItems) {
            result += '&metaItems=' + options.metaItems
        }
    }
    if (result.length === 0) return 'null'
    return result.substring(1)
}

/** @param {string | Types.SearchOptions} options */
function GetItems(options) {
    let uri = BaseURI + 'items'
    let qMarkPlaced = false
    if (typeof options === 'string') {
        if (qMarkPlaced) { uri += '&' } else { uri += '?'; qMarkPlaced = true }
        uri += 'query=' + options
    } else {
        if (options.rarity) {
            if (qMarkPlaced) { uri += '&' } else { uri += '?'; qMarkPlaced = true }
            uri += 'rarity=' + options.rarity
        }
        if (options.category) {
            if (qMarkPlaced) { uri += '&' } else { uri += '?'; qMarkPlaced = true }
            uri += 'category=' + options.category
        }
        if (options.faction) {
            if (qMarkPlaced) { uri += '&' } else { uri += '?'; qMarkPlaced = true }
            uri += 'faction=' + options.faction
        }
        if (options.removedItems) {
            if (qMarkPlaced) { uri += '&' } else { uri += '?'; qMarkPlaced = true }
            uri += 'removedItems=' + options.removedItems
        }
        if (options.metaItems) {
            if (qMarkPlaced) { uri += '&' } else { uri += '?'; qMarkPlaced = true }
            uri += 'metaItems=' + options.metaItems
        }
    }
    return new Promise((resolve, reject) => {
        HTTP.Get(uri)
            .then(result => {
                const body = result.data

                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'), { recursive: true }) }
                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/items/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/items/'), { recursive: true }) }
                
                const resultParsed = JSON.parse(body)
                fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/crossoutdb/items/${GetID(options)}.json`), JSON.stringify(resultParsed, null, ' '), 'utf-8')

                if (!resultParsed) {
                    resolve(null)
                    return
                }

                resolve(resultParsed)
            })
            .catch(reject)
    })
}

/** @param {number} itemID */
function GetItem(itemID) {
    return new Promise((resolve, reject) => {
        HTTP.Get(BaseURI + 'item/' + itemID)
            .then(result => {
                const body = result.data

                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'), { recursive: true }) }
                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/items/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/items/'), { recursive: true }) }
                
                const resultParsed = JSON.parse(body)
                fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/crossoutdb/items/${itemID}.json`), JSON.stringify(resultParsed, null, ' '), 'utf-8')

                if (!resultParsed) {
                    resolve(null)
                    return
                }
    
                if (!resultParsed[0]) {
                    resolve(null)
                    return
                }
    
                resolve(resultParsed[0])
            })
            .catch(reject)
    })
}

/** @param {number} itemID */
function GetRecipe(itemID) {
    return new Promise((resolve, reject) => {
        HTTP.Get(BaseURI + 'recipe/' + itemID)
            .then(result => {
                const body = result.data

                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'), { recursive: true }) }
                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/recipes/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/recipes/'), { recursive: true }) }
                
                fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/crossoutdb/recipes/${itemID}.json`), body, 'utf-8')
                const resultParsed = JSON.parse(body)
                fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/crossoutdb/recipes/${itemID}.json`), JSON.stringify(resultParsed, null, ' '), 'utf-8')

                if (!resultParsed) {
                    resolve(null)
                    return
                }
    
                resolve(resultParsed)
            })
            .catch(reject)
    })
}

/** @param {number} itemID */
function GetRecipeDeep(itemID) {
    return new Promise((resolve, reject) => {
        HTTP.Get(BaseURI + 'recipe-deep/' + itemID)
            .then(result => {
                const body = result.data

                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'), { recursive: true }) }
                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/recipes-deep/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/recipes-deep/'), { recursive: true }) }
                
                const resultParsed = JSON.parse(body)
                fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/crossoutdb/recipes-deep/${itemID}.json`), JSON.stringify(resultParsed, null, ' '), 'utf-8')

                if (!resultParsed) {
                    resolve(null)
                    return
                }
    
                resolve(resultParsed)
            })
            .catch(reject)
    })
}

/**
 * @param { 'sellprice' | 'buyprice' | 'selloffers' | 'buyorders' } marketColumn
 * @param {number} itemID
 */
function GetMarket(marketColumn, itemID) {
    return new Promise((resolve, reject) => {
        HTTP.Get(BaseURI + 'market/' + marketColumn + '/' + itemID)
            .then(result => {
                const body = result.data

                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/'), { recursive: true }) }
                if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/market/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/crossoutdb/market/'), { recursive: true }) }
                
                const resultParsed = JSON.parse(body)
                fs.writeFileSync(Path.join(CONFIG.paths.base, `./cache/crossoutdb/market/${itemID}_${marketColumn}.json`), JSON.stringify(resultParsed, null, ' '), 'utf-8')

                if (!resultParsed) {
                    resolve(null)
                    return
                }
    
                resolve(resultParsed)
            })
            .catch(error => reject(error))
    })
}

module.exports = { GetItems, GetItem, GetRecipe, GetRecipeDeep, GetMarket }