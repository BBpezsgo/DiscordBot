/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')
const tokens = require('../config.json').tokens
const fs = require('fs')
const { CityBekescsaba } = require('../commands/weatherFunctions')
const Types = require('./AccuWeather')
const HTTP = require('../functions/http')

const URLs = {
    Forecast: {
        Daily: {
            Day1: `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
            Day15: `http://dataservice.accuweather.com/forecasts/v1/daily/15day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
            Day5: `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
            Day10: `http://dataservice.accuweather.com/forecasts/v1/daily/10day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`
        },
        Hourly: {
            Hour1: `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
            Hour12: `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
            Hour120: `http://dataservice.accuweather.com/forecasts/v1/hourly/120hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
            Hour24: `http://dataservice.accuweather.com/forecasts/v1/hourly/24hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
            Hour72: `http://dataservice.accuweather.com/forecasts/v1/hourly/72hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`
        }
    },
    CurrentConditions: `http://dataservice.accuweather.com/currentconditions/v1/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true&details=true`
}

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

/** @param {Types.ServiceCallback<any>} callback */
const AccuWeatherForecast = function(callback) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/weather/')) }
        if (ReadFromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/accu-current.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/weather/accu-forecast.json'), 'utf-8'))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        HTTP.Get(URLs.Forecast.Daily.Day1)
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
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/accu-forecast-headers.txt'), headersText, 'utf-8')

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/accu-forecast.json'), body, "utf-8")
                resolve(JSON.parse(body))
            })
            .catch(error => reject('**HTTP Error:** ' + error))
    })
}

const AccuWeatherCurrent = function() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/weather/')) }
        if (ReadFromCache) {
            if (fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/accu-current.json'))) {
                const cached = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/weather/accu-current.json'), 'utf-8'))
                cached.cache = true
                resolve(cached)
                return
            }
        }

        HTTP.Get(URLs.CurrentConditions)
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
                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/accu-current-headers.txt'), headersText, 'utf-8')

                fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/accu-current.json'), body, "utf-8")
                resolve(JSON.parse(body))
            })
            .catch(error => reject('**HTTP Error:** ' + error))
    })
}

module.exports = {
    AccuWeatherCurrent,
    AccuWeatherForecast,
}