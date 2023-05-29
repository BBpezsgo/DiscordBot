const fs = require('fs')

/** @returns {import('./har').HAR} */
function Load(path) {
    const contentRaw = fs.readFileSync(path, 'utf8')
    return JSON.parse(contentRaw)
}

module.exports = { Load }