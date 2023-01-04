function Get() {
    const fs = require('fs')
    return JSON.parse(fs.readFileSync('../chrome-extension/key.json', 'utf-8'))
}

module.exports = { Get }