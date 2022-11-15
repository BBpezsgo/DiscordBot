const { FormatError } = require('./formatError')
const fs = require('fs')

function LogError(error) {
    fs.appendFileSync('./node.error.log', FormatError(error) + '\n', { encoding: 'utf-8' })
}

module.exports = LogError