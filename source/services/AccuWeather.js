const tokens = require('../config.json').tokens
const fs = require('fs')
const { CityBekescsaba } = require('../commands/weatherFunctions')
const Types = require('./AccuWeather')

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

const request = require("request")

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

/** @param {Types.ServiceCallback<any>} callback */
const AccuWeatherForecast = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/accu-weather.json')) {
            callback(JSON.parse(fs.readFileSync('./cache/weather/accu-weather.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.Forecast.Day1, function (err, res, body) {
            if (err) {
                callback(undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(undefined, `**HTTP Error:** No body recived`)
                return
            }

            var headersText = ''
            for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
            { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
            fs.writeFileSync('./cache/weather/accu-weather-headers.txt', headersText, { encoding: 'utf-8' })
            fs.writeFileSync('./cache/weather/accu-weather.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {Types.ServiceCallback<any>} callback */
const AccuWeatherCurrent = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/accu-weather-current.json')) {
            callback(JSON.parse(fs.readFileSync('./cache/weather/accu-weather-current.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.CurrentConditions, function (err, res, body) {
            if (err) {
                callback(undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(undefined, `**HTTP Error:** No body recived`)
                return
            }

            var headersText = ''
            for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
            { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
            fs.writeFileSync('./cache/weather/accu-weather-current-headers.txt', headersText, { encoding: 'utf-8' })
            fs.writeFileSync('./cache/weather/accu-weather-current.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

module.exports = {
    AccuWeatherCurrent,
    AccuWeatherForecast,
}