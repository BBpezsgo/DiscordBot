const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')
const HTTP = require('../functions/http')

const URLs = {
    GST: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/GST',
    IPS: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/IPS',
    FLR: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR',
    Notifications: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/notifications'
}

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

function GST(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/gst.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/gst.json'), 'utf8'))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        HTTP.Get(URLs.GST)
            .then(result => {
                const res = result.res
                const body = result.data

                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }

                if (!body) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/gst-headers.txt'), headersText, 'utf8')

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/gst.json'), JSON.stringify(JSON.parse(body), null, ' '), 'utf8')
                resolve(JSON.parse(body))
            })
            .catch(error => reject('**HTTP Error:** ' + error))
    })
}

function IPS(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/ips.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/ips.json'), 'utf8'))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        HTTP.Get(URLs.IPS)
            .then(result => {
                const res = result.res
                const body = result.data

                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                
                if (!body) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/ips-headers.txt'), headersText, 'utf8')

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/ips.json'), JSON.stringify(JSON.parse(body), null, ' '), 'utf8')
                resolve(JSON.parse(body))
            })
            .catch(error => reject('**HTTP Error:** ' + error))
    })
}

function FLR(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/flr.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/flr.json'), 'utf8'))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        HTTP.Get(URLs.FLR)
            .then(result => {
                const res = result.res
                const body = result.data

                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                
                if (!body) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/flr-headers.txt'), headersText, 'utf8')

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/flr.json'), JSON.stringify(JSON.parse(body), null, ' '), 'utf8')
                resolve(JSON.parse(body))
            })
            .catch(error => reject('**HTTP Error:** ' + error))
    })
}

function Notifications(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/notifications.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/notifications.json'), 'utf8'))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        HTTP.Get(URLs.Notifications)
            .then(result => {
                const res = result.res
                const body = result.data

                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                
                if (!body) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/notifications-headers.txt'), headersText, 'utf8')

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/notifications.json'), JSON.stringify(JSON.parse(body), null, ' '), 'utf8')
                resolve(JSON.parse(body))
            })
            .catch(error => reject('**HTTP Error:** ' + error))
    })
}

module.exports = {
    GST,
    IPS,
    FLR,
    Notifications
}