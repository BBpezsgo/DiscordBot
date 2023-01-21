const fs = require('fs')
const request = require("request")

const Types = require('./Openweathermap')
const { CityBekescsaba } = require('../commands/weatherFunctions')
const tokens = require('../config.json').tokens

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

const URLs = {
    Weather: `http://api.openweathermap.org/data/2.5/weather?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&units=metric&appid=${tokens.openweathermap}`,
    Pollution: `http://api.openweathermap.org/data/2.5/air_pollution?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&appid=${tokens.openweathermap}`,
    Forecast: `https://api.openweathermap.org/data/2.5/forecast?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&appid=${tokens.openweathermap}&cnt=24&units=metric`
}

const OpenweathermapForecast = function() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
        if (ReadFromCache) {
            if (fs.existsSync('./cache/weather/openweathermap-forecast.json')) {
                var cacheData = JSON.parse(fs.readFileSync('./cache/weather/openweathermap-forecast.json', { encoding: 'utf-8' }))
                cacheData['fromCache'] = true
                resolve(cacheData)
                return
            }
        }

        try {
            request(URLs.Forecast, function (err, res, body) {
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
                fs.writeFileSync('./cache/weather/openweathermap-forecast-headers.txt', headersText, { encoding: 'utf-8' })

                fs.writeFileSync('./cache/weather/openweathermap-forecast.json', body, { encoding: 'utf-8' })
                var data = JSON.parse(body)
                data['fromCache'] = false
                resolve(data)
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

const OpenweathermapWeather = function() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
        if (fs.existsSync('./cache/weather/openweathermap-weather.json')) {
            /** @type {Types.OpenWeatherMap.WeatherResult} */
            var cacheData = JSON.parse(fs.readFileSync('./cache/weather/openweathermap-weather.json', { encoding: 'utf-8' }))
            const date = cacheData.dt * 1000
            const diff = Date.now() - date
            fs.writeFileSync('./cache/weather/openweathermap-weather-date.txt', `now: ${Date.now()}\ncache: ${date}\ndiff: ${diff}`, 'utf-8')
            if (diff <= MaxTimeDifference || ReadFromCache) {
                cacheData['fromCache'] = true
                resolve(cacheData)
                return
            }
        }

        try {
            request(URLs.Weather, function (err, res, body) {
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
                fs.writeFileSync('./cache/weather/openweathermap-weather-headers.txt', headersText, { encoding: 'utf-8' })

                fs.writeFileSync('./cache/weather/openweathermap-weather.json', body, { encoding: 'utf-8' })
                
                var data = JSON.parse(body)
                data['fromCache'] = false
                resolve(data)
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

const OpenweathermapPollution = function() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
        if (ReadFromCache) {
            if (fs.existsSync('./cache/weather/openweathermap-pollution.json')) {
                resolve(JSON.parse(fs.readFileSync('./cache/weather/openweathermap-pollution.json', { encoding: 'utf-8' })))
                return
            }
        }

        try {
            request(URLs.Pollution, function (err, res, body) {
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
                fs.writeFileSync('./cache/weather/openweathermap-pollution-headers.txt', headersText, { encoding: 'utf-8' })

                fs.writeFileSync('./cache/weather/openweathermap-pollution.json', body, { encoding: 'utf-8' })
                resolve(JSON.parse(body))
            })
        } catch (err) {
            reject('**HTTP Requiest Error:** ' + err)
        }
    })
}

module.exports = {
    OpenweathermapForecast,
    OpenweathermapWeather,
    OpenweathermapPollution,
}