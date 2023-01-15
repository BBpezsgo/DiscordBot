const tokens = require('../config.json').tokens
const weather1 = require('weather-js')
const fs = require('fs')
const { CityBekescsaba } = require('./weatherFunctions')
const WeatherServices = require('./weatherServices')

const URLs = {
    OpenWeatherMap: {
        Weather: `http://api.openweathermap.org/data/2.5/weather?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&units=metric&appid=${tokens.openweathermap}`,
        Pollution: `http://api.openweathermap.org/data/2.5/air_pollution?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&appid=${tokens.openweathermap}`,
        Forecast: `https://api.openweathermap.org/data/2.5/forecast?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&appid=${tokens.openweathermap}&cnt=24&units=metric`
    },
    NASA: {
        Mars: {
            Weather: `https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json&ver=1.0`,
            WeeklyImage: `https://mars.nasa.gov/rss/api/?feed=weekly_raws&category=mars2020&feedtype=json&num=1&page=0&tags=mars2020_featured_image&format=json`
        },
        Satellite: `https://api.nasa.gov/planetary/earth/assets?lon=${CityBekescsaba.Lon}&lat=${CityBekescsaba.Lat}&date=2014-02-01&dim=0.15&api_key=${tokens.nasa}`
    },
    AccuWeather: {
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
        CurrentConditions: `http://dataservice.accuweather.com/currentconditions/v1/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`
    }
}

const request = require("request");

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

/** @param {WeatherServices.ServiceCacheCallback<WeatherServices.MSN.WeatherResult>} callback */
const MsnWeather = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/', { recursive: true }) }
    
    /** @type {WeatherServices.Msn_WeatherResult} */
    const cacheData = JSON.parse(fs.readFileSync('./cache/weather/msn-weather.json', { encoding: 'utf-8' }))
    const date = Date.parse(cacheData[0].current.date + ' ' + cacheData[0].current.observationtime)
    const diff = Date.now() - (date - (Number.parseInt(cacheData[0].location.timezone) * 3600000))
    fs.writeFileSync('./cache/weather/msn-date.txt', `now: ${Date.now()}\ncache: ${date}\ndiff: ${diff}`, 'utf-8')
    if (diff >= MaxTimeDifference || ReadFromCache) {
        callback(true, cacheData)
        return
    }

    weather1.find({ search: 'Békéscsaba, HU', degreeType: 'C' }, function (error, msnWeather) {
        if (error) {
            callback(false, undefined, error)
            return
        }

        fs.writeFileSync('./cache/weather/msn-weather.json', JSON.stringify(msnWeather), { encoding: 'utf-8' })
        callback(false, msnWeather)
    })
}

const OpenweathermapForecast = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/openweathermap-forecast.json')) {
            callback(true, JSON.parse(fs.readFileSync('./cache/weather/openweathermap-forecast.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.OpenWeatherMap.Forecast, function (err, res, body) {
            if (err) {
                callback(false, undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(false, undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(false, undefined, `**HTTP Error:** No body recived`)
                return
            }

            var headersText = ''
            for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
            { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
            fs.writeFileSync('./cache/weather/openweathermap-forecast-headers.txt', headersText, { encoding: 'utf-8' })

            fs.writeFileSync('./cache/weather/openweathermap-forecast.json', body, { encoding: 'utf-8' })
            callback(false, JSON.parse(body))
        })
    } catch (err) {
        callback(false, undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {WeatherServices.ServiceCacheCallback<WeatherServices.OpenWeatherMap.WeatherResult>} callback */
const OpenweathermapWeather = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/openweathermap-weather.json')) {
            const cacheData = JSON.parse(fs.readFileSync('./cache/weather/openweathermap-weather.json', { encoding: 'utf-8' }))
            const date = cacheData.dt
            const diff = Date.now() - (date * 1000)
            fs.writeFileSync('./cache/weather/openweathermap-weather-date.txt', `now: ${Date.now()}\ncache: ${date}\ndiff: ${diff}`, 'utf-8')
            if (diff >= MaxTimeDifference || ReadFromCache) {
                callback(true, cacheData)
                return
            }
        }
    }

    try {
        request(URLs.OpenWeatherMap.Weather, function (err, res, body) {
            if (err) {
                callback(false, undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(false, undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(false, undefined, `**HTTP Error:** No body recived`)
                return
            }

            var headersText = ''
            for (let i = 0; i < res.rawHeaders.length - 1; i+=2)
            { headersText += `'${res.rawHeaders[i]}': '${res.rawHeaders[i+1]}'\n` }
            fs.writeFileSync('./cache/weather/openweathermap-weather-headers.txt', headersText, { encoding: 'utf-8' })

            fs.writeFileSync('./cache/weather/openweathermap-weather.json', body, { encoding: 'utf-8' })
            callback(false, JSON.parse(body))
        })
    } catch (err) {
        callback(false, undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {WeatherServices.ServiceCallback<WeatherServices.OpenWeatherMap.PollutionResult>} callback */
const OpenweathermapPollution = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/openweathermap-pollution.json')) {
            callback(JSON.parse(fs.readFileSync('./cache/weather/openweathermap-pollution.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.OpenWeatherMap.Pollution, function (err, res, body) {
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
            fs.writeFileSync('./cache/weather/openweathermap-pollution-headers.txt', headersText, { encoding: 'utf-8' })

            fs.writeFileSync('./cache/weather/openweathermap-pollution.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {WeatherServices.ServiceCallback<WeatherServices.NasaMars.WeatherResult>} callback */
const NasaMarsWeather = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/nasa-mars-weather.json')) {
            callback(JSON.parse(fs.readFileSync('./cache/weather/nasa-mars-weather.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.NASA.Mars.Weather, function (err, res, body) {
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
            fs.writeFileSync('./cache/weather/nasa-mars-weather-headers.txt', headersText, { encoding: 'utf-8' })

            fs.writeFileSync('./cache/weather/nasa-mars-weather.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {WeatherServices.ServiceCallback<WeatherServices.NasaMars.WeeklyImagesResult>} callback */
const NasaMarsWeeklyImage = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/nasa-mars-image.json')) {
            callback(JSON.parse(fs.readFileSync('./cache/weather/nasa-mars-image.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.NASA.Mars.WeeklyImage, function (err, res, body) {
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
            fs.writeFileSync('./cache/weather/nasa-mars-image-headers.txt', headersText, { encoding: 'utf-8' })

            fs.writeFileSync('./cache/weather/nasa-mars-image.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

const AccuWeather = function(callback) {
    if (!fs.existsSync('./cache/weather/')) { fs.mkdirSync('./cache/weather/') }
    if (ReadFromCache) {
        if (fs.existsSync('./cache/weather/accu-weather.json')) {
            callback(JSON.parse(fs.readFileSync('./cache/weather/accu-weather.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.AccuWeather.Forecast.Day1, function (err, res, body) {
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

            // const RateLimitRemaining = res.headers["RateLimit-Remaining"]

            fs.writeFileSync('./cache/weather/accu-weather.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

module.exports = { NasaMarsWeather, NasaMarsWeeklyImage, OpenweathermapPollution, OpenweathermapWeather, MsnWeather, AccuWeather, OpenweathermapForecast }
