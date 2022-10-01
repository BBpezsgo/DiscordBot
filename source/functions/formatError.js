/** @param {Error} err */
function FormatError(err) {
    var str = ""
    str += err.name + ': ' + err.message
    if (err.stack != undefined) {
        str += '\n' + err.stack
    }
    return str
}

module.exports = { FormatError }