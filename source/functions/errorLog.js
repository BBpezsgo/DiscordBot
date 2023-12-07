const { FormatError } = require('./formatError')
const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

/**
 * @param {any} error
 * @param {{ key: string, value: any }[]} parameters
 */
function LogError(error, ...parameters) {
    fs.appendFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), FormatError(error, ...parameters) + '\n', 'utf8')
}

/**
 * @param {any} error
 * @param {{ key: string, value: any }[]} parameters
 */
function LogCrash(error, ...parameters) {
    fs.appendFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), 'CRASH\n' + FormatError(error, ...parameters) + '\n', 'utf8')
}

module.exports = { LogError, LogCrash }