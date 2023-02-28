const https = require('https')
const fs = require('fs')
const xml = require('xml2js')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const ReadFromCache = true

const ProcessData = function(data) {
    var result = {}

    result.sender = data['gesmes:Envelope']['gesmes:Sender'][0]['gesmes:name'][0]
    result.rates = {}

    result.time = data['gesmes:Envelope']['Cube'][0]['Cube'][0]['$']['time']
    data['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'].forEach(element => {
        result.rates[element['$']['currency']] = element['$']['rate']
    })

    return result
}

/** @param {(result: any, error: string | undefined) => void} callback */
const Download = function(callback) {
    if (ReadFromCache) {
        if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/currency-data.xml'))) {
            return fs.readFileSync(Path.join(CONFIG.paths.base, './cache/currency-data.xml'), { encoding: 'utf-8' })
        }
    }

    try {            
        const req = https.request('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', function (res) {
            res.setEncoding('utf8')
            var data = ''
            fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/currency-res-.json'), JSON.stringify({ headers: res.headers }), { encoding: 'utf-8' })
            res.on('data', function (chunk) {
                data += chunk
            })
            res.on('end', () => {
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/currency-data-.xml'), data, { encoding: 'utf-8' })
                var parser = new xml.Parser()
                parser.parseString(data, function (error, result) {
                    if (error) {
                        callback(undefined, error)
                        return;
                    }
                    callback(result)
                })
            })
            res.on('error', (error) => {
                callback(undefined, '**HTTPS Response Error:** ' + error)
            })
        })
        req.on('error', (error) => {
            callback(undefined, '**HTTPS Requiest Error:** ' + error)
        })
        req.end()
    } catch (err) {
        callback(undefined, '**Error:** ' + err)
    }
}

// Download((result, error) => { if(error){return}; console.log(ProcessData(result)) })

const GetCurrency = function() {
    return new Promise((callback, err) => {
        Download((result, error) => {
            if (error) {
                err(error)
                return
            }
            callback(ProcessData(result))
        })
    })
}

module.exports = { GetCurrency }