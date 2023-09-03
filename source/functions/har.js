const fs = require('fs')

/**
 * @returns {import('./har').HAR}
 * @param {string} path
 */
function Load(path) {
    const contentRaw = fs.readFileSync(path, 'utf8')
    return JSON.parse(contentRaw)
}

module.exports = { Load }