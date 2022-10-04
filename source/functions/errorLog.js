const { FormatError } = require('./formatError')
const fs = require('fs')

/** @param {Error} error */
function LogError(error) {
    fs.appendFileSync('./node.error.log', FormatError(error) + '\n', { encoding: 'utf-8' })
}

module.exports = LogError