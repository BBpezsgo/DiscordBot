const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const URLs = {
    GST: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/GST',
    IPS: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/IPS',
    FLR: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR',
    Notifications: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/notifications'
}

const request = require("request")

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

function GST(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/gst.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/gst.json'), { encoding: 'utf-8' }))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        try {
            request(URLs.GST, function (err, res, body) {
                if (err) {
                    reject('**HTTP Error:** ' + err)
                    return
                }
                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                if (body === undefined || body == null) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/gst-headers.txt'), headersText, { encoding: 'utf-8' })

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/gst.json'), body, { encoding: 'utf-8' })
                resolve(JSON.parse(body))
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

function IPS(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/ips.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/ips.json'), { encoding: 'utf-8' }))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        try {
            request(URLs.IPS, function (err, res, body) {
                if (err) {
                    reject('**HTTP Error:** ' + err)
                    return
                }
                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                if (body === undefined || body == null) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/ips-headers.txt'), headersText, { encoding: 'utf-8' })

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/ips.json'), body, { encoding: 'utf-8' })
                resolve(JSON.parse(body))
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

function FLR(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/flr.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/flr.json'), { encoding: 'utf-8' }))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        try {
            request(URLs.FLR, function (err, res, body) {
                if (err) {
                    reject('**HTTP Error:** ' + err)
                    return
                }
                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                if (body === undefined || body == null) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/flr-headers.txt'), headersText, { encoding: 'utf-8' })

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/flr.json'), body, { encoding: 'utf-8' })
                resolve(JSON.parse(body))
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

function Notifications(fromCache = false) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/donki/')) }
        if (ReadFromCache || fromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/donki/notifications.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/donki/notifications.json'), { encoding: 'utf-8' }))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        try {
            request(URLs.Notifications, function (err, res, body) {
                if (err) {
                    reject('**HTTP Error:** ' + err)
                    return
                }
                if (res.statusCode !== 200) {
                    reject(`**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                    return
                }
                if (body === undefined || body == null) {
                    reject(`**HTTP Error:** No body recived`)
                    return
                }

                var headersText = ''
                for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
                { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/notifications-headers.txt'), headersText, { encoding: 'utf-8' })

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/donki/notifications.json'), body, { encoding: 'utf-8' })
                resolve(JSON.parse(body))
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

module.exports = {
    GST,
    IPS,
    FLR,
    Notifications
}