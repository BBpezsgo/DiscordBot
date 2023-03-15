const { FormatErrorYeah } = require('./formatError')
const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

/**
 * @param {Error} error
 * @param {{ key: string, value: any }[]} parameters
 */
function LogError(error, ...parameters) {
    fs.appendFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), FormatErrorYeah(error, parameters) + '\n', { encoding: 'utf-8' })
}

module.exports = LogError