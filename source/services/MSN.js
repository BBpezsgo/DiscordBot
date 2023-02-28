const weather1 = require('weather-js')
const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const ReadFromCache = false
const MaxTimeDifference = 1000 * 60 * 10 // 10 minutes

const MsnWeather = function(callback) {
    if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/weather/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/weather/'), { recursive: true }) }
    
    const cacheData = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './cache/weather/msn-weather.json'), { encoding: 'utf-8' }))
    const date = Date.parse(cacheData[0].current.date + ' ' + cacheData[0].current.observationtime)
    const diff = Date.now() - (date - (Number.parseInt(cacheData[0].location.timezone) * 3600000))
    fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/msn-date.txt'), `now: ${Date.now()}\ncache: ${date}\ndiff: ${diff}\nmax time diff: ${MaxTimeDifference}`, 'utf-8')
    if (diff <= MaxTimeDifference || ReadFromCache) {
        callback(true, cacheData)
        return
    }

    weather1.find({ search: 'Békéscsaba, HU', degreeType: 'C' }, function (error, msnWeather) {
        if (error) {
            callback(false, undefined, error)
            return
        }

        fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/weather/msn-weather.json'), JSON.stringify(msnWeather), { encoding: 'utf-8' })
        callback(false, msnWeather)
    })
}

module.exports = { MsnWeather }
