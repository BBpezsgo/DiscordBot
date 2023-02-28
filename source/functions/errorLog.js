const { FormatError } = require('./formatError')
const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

function LogError(error) {
    fs.appendFileSync(Path.join(CONFIG.paths.base, './node.error.log'), FormatError(error) + '\n', { encoding: 'utf-8' })
}

module.exports = LogError