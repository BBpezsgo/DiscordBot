// @ts-check

const { DiscordAPIError } = require("discord.js")

/**
 * @param {any} error
 * @param {{ key: string, value: any }[]} parameters
 */
function FormatError(error, ...parameters) { return FormatErrorYeah(error, parameters) }

/**
 * @param {any} error
 * @param {{ key: string, value: any }[]} parameters
 */
function FormatErrorYeah(error, parameters) {
    var str = ''
    if (error instanceof DiscordAPIError) {
        str = error.name + ': ' + error.message
        str += `\n  Method: ${error.method}`
        str += `\n  Code: ${error.code}`
        str += `\n  Status: ${error.status}`
        str += `\n  URL: ${error.url}`
        for (const parameter of parameters) str += `\n  ${parameter.key}: ${JSON.stringify(parameter.value)}`
        if (error.stack != undefined)
        { str += '\n' + error.stack }
    } else if (error instanceof Error) {
        str = error.name + ': ' + error.message
        for (const parameter of parameters) str += `\n  ${parameter.key}: ${JSON.stringify(parameter.value)}`
        if (error.stack != undefined)
        { str += '\n' + error.stack }
    } else {
        const stack = new Error().stack
        if (typeof error === 'string') {
            str = error
        } else if (typeof error === 'number') {
            str = error.toString()
        } else if (typeof error === 'undefined') {
            str = 'undefined'
        } else if (error === null) {
            str = 'null'
        } else {
            str = JSON.stringify(error)
        }
        for (const parameter of parameters) str += `\n  ${parameter.key}: ${JSON.stringify(parameter.value)}`
        if (stack != undefined)
        { str += '\n' + stack }
    }
    return str
}

module.exports = { FormatError, FormatErrorYeah }