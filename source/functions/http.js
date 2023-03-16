const http = require('http')
const https = require('https')

/** @param {string | URL} url @returns {Promise<{ data: string, res: http.IncomingMessage, req: http.ClientRequest }>} */
function Get(url) {
    return new Promise((resolve, reject) => {
        const uri = new URL(url)
    
        if (uri.protocol === 'https:') {
            const req = https.get(url, res => {
                let data = ''
                res.on('data', chunk => { data += chunk.toString() })
                res.on('end', () => {
                    resolve({ data, res, req })
                })
                res.on('error', error => {
                    reject(error)
                })
            })
            req.on('error', error => {
                reject(error)
            })
            req.end()
        } else if (uri.protocol === 'http:') {
            const req = http.get(url, res => {
                let data = ''
                res.on('data', chunk => { data += chunk.toString() })
                res.on('end', () => {
                    resolve({ data, res, req })
                })
                res.on('error', error => {
                    reject(error)
                })
            })
            req.on('error', error => {
                reject(error)
            })
            req.end()
        } else {
            reject(new Error(`Unknown protocol '${uri.protocol}'`))
        }
    })
}

module.exports = { Get }
