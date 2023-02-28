const tokens = require('../config.json').tokens
const fs = require('fs')
const { CityBekescsaba } = require('../commands/weatherFunctions')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const URLs = {
    Mars: {
        Weather: `https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json&ver=1.0`,
        WeeklyImage: `https://mars.nasa.gov/rss/api/?feed=weekly_raws&category=mars2020&feedtype=json&num=1&page=0&tags=mars2020_featured_image&format=json`
    },
    Satellite: `https://api.nasa.gov/planetary/earth/assets?lon=${CityBekescsaba.Lon}&lat=${CityBekescsaba.Lat}&date=2014-02-01&dim=0.15&api_key=${tokens.nasa}`
}

const request = require("request")

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

const NasaMarsWeather = function() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/weather/')) }
        if (ReadFromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-weather.json'))) {
                resolve(JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-weather.json'), { encoding: 'utf-8' })))
                return
            }
        }

        try {
            request(URLs.Mars.Weather, function (err, res, body) {
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
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-weather-headers.txt'), headersText, { encoding: 'utf-8' })

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-weather.json'), body, { encoding: 'utf-8' })
                resolve(JSON.parse(body))
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

const NasaMarsWeeklyImage = () => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/weather/')) }
        if (ReadFromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-image.json'))) {
                resolve(JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-image.json'), { encoding: 'utf-8' })))
                return
            }
        }

        try {
            request(URLs.Mars.WeeklyImage, function (err, res, body) {
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
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-image-headers.txt'), headersText, { encoding: 'utf-8' })

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/nasa-mars-image.json'), body, { encoding: 'utf-8' })
                resolve(JSON.parse(body))
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

module.exports = {
    NasaMarsWeather,
    NasaMarsWeeklyImage,
}