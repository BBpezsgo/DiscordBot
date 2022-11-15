function FormatError(error) {
    var str = ''
    if (error instanceof Error) {
        str = error.name + ': ' + error.message
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
        if (stack != undefined)
        { str += '\n' + stack }
    }
    return str
}

module.exports = { FormatError }