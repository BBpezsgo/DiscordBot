const Discord = require('discord.js')
const MoonPhase = require('moonphase-js')
const weather1 = require('weather-js')
const weather2 = require('nodejs-weather-app');
const fs = require('fs')
const request = require("request");
const { tokens } = require('../config.json')
const SunCalc = require('suncalc')

const urlWeather = 'http://api.openweathermap.org/data/2.5/weather?lat=46.678889&lon=21.090833&units=metric&appid=' + tokens.openweathermap
const urlPollution = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=46.678889&lon=21.090833&appid=' + tokens.openweathermap
const urlMarsWeather = 'https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json&ver=1.0'
const urlMarsWeeklyImage = 'https://mars.nasa.gov/rss/api/?feed=weekly_raws&category=mars2020&feedtype=json&num=1&page=0&tags=mars2020_featured_image&format=json'
const urlSatellite = 'https://api.nasa.gov/planetary/earth/assets?lon=46.678889&lat=21.090833&date=2014-02-01&dim=0.15&api_key=' + tokens.nasa

let dataToAvoidErrors_SunDatasRaw, dataToAvoidErrors_Dawn, dataToAvoidErrors_Dusk
if (fs.existsSync('./Helper/output.txt') == true) {
    dataToAvoidErrors_SunDatasRaw = fs.readFileSync('./Helper/output.txt').toString().split("|")
    dataToAvoidErrors_Dawn = sunDatasRaw[0]
    dataToAvoidErrors_Dusk = sunDatasRaw[3]
} else {
    dataToAvoidErrors_Dawn = ''
    dataToAvoidErrors_Dusk = ''
}
const Dawn = dataToAvoidErrors_Dawn
const Dusk = dataToAvoidErrors_Dusk

const seasons = {
    'late autumn': { name: 'Késő ősz', icon: '🍂' },
    'early winter': { name: 'Kora tél', icon: '❄️' },
}

const {
    ImgExists,
    weatherSkytxt,
    weatherWindIcon,
    weatherTempIcon,
    weatherMoonIcon,
    weatherMoonText,
    weatherHumidityIcon,
    weatherThumbnailUrl,
    DirectionNameToArrow,
    unixToTime,
    weatherPressureIcon,
    Average,
    GetReadableNumber,
    GetPollutionIndex,
    GetPollutionText,
    dayName,
    weatherSkytextIcon,
    weatherSkytextImgName
} = require('../commands/weatherFunctions');

const ToUnix=(date)=>{return Math.round(date.getTime()/1000)}
const AverageUnix=(unix1,unix2)=>{return Math.round((unix1+unix2)/2)}

/**
 * @param {any} data0 Msn weather data
 * @param {any} data1 Openweather weather data
 * @param {any[]} data2 Moon data
 * @param {any} data3 Openweather pollution data
 * @returns {Discord.EmbedBuilder}
 */
function getEmbedEarth(data0, data1, data2, data3) {
    var current = data0[0].current
    const embed = new Discord.EmbedBuilder()
        .setColor('#00AE86')
        .setAuthor({ name: current.observationpoint.replace(', Hungary', ''), url: 'https://openweathermap.org/city/' + data1.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    { //Ma
        let skyTxt = current.skytext
        const skyImgName = weatherSkytextImgName(skyTxt, unixToTime(data1.sys.sunset).split(':')[0], unixToTime(data1.sys.sunrise).split(':')[0], data1.clouds.all)
        skyTxt = weatherSkytxt(skyTxt)

        const humidityValue = Average([current.humidity, data1.main.humidity])
        const humidityIcon = weatherHumidityIcon(humidityValue)

        const windValue = GetReadableNumber(Average([data1.wind.speed * 3.6, parseInt(current.windspeed.replace(' km/h', ''))]))
        const windIcon = weatherWindIcon(windValue)

        const windGustValue = GetReadableNumber(data1.wind.gust * 3.6)

        const tempValue = GetReadableNumber(Average([current.temperature, data1.main.temp]))

        const tempMinValue = GetReadableNumber(Average([data0[0].forecast[1].low, data1.main.temp_min]))
        const tempMaxValue = GetReadableNumber(Average([data0[0].forecast[1].high, data1.main.temp_max]))

        const tempFeelslikeValue = Math.floor(Average([current.feelslike, data1.main.feels_like]))

        const tempIcon = weatherTempIcon(tempFeelslikeValue)

        const moonIcon = weatherMoonIcon(data2[1].phaseName())
        const moonText = weatherMoonText(data2[1].phaseName())

        const windDirection = DirectionNameToArrow(current.winddisplay.toString().split(' ')[2])

        const visibilityValue = Math.floor(data1.visibility / 1000)

        const times = SunCalc.getTimes(new Date(Date.now()), 46.677227, 21.089993)
        
        embed
            .setTitle(`**${skyTxt}** ||(${data1.weather[0].description})|||| (${data1.weather[0].id})||`)
        
        var description =
            `\\☁️ ${data1.clouds.all} % felhősség\n` +
            `\\☔ ${data0[0].forecast[1].precip} % csapadék\n` +
            `${humidityIcon} ${humidityValue} % páratartalom\n` +
            `${tempIcon} ${tempMinValue} - ${tempValue} - ${tempMaxValue} °C (Hőérzet: ${tempFeelslikeValue} °C)\n` +
            `${windIcon} ${windDirection} (${data1.wind.deg}°) ${windValue} km/h szél\n` +
            `\\🌬️ ${windGustValue} km/h széllökés\n` +
            `${weatherPressureIcon(data1.main.pressure)} ${data1.main.pressure} pHa légnyomás\n` +
            `\\👁️ ${visibilityValue} km látótávolság`

        if (data3 != undefined && data3 != null) {
            description +=
            '\n\n**Levegőminőség:**\n\n' +

            'Levőminőség index: \\' + GetPollutionIndex(8, data3.main.aqi) + ' ' + GetPollutionText(data3.main.aqi) +

            '\n\nCO: \\' + GetPollutionIndex(0, data3.components.co) + ' ' + data3.components.co + ' μg/m³' +
            '\nNO: \\' + GetPollutionIndex(1, data3.components.no) + ' ' + data3.components.no + ' μg/m³' +
            '\nNO₂: \\' + GetPollutionIndex(2, data3.components.no2) + ' ' + data3.components.no2 + ' μg/m³' +
            '\nO₃: \\' + GetPollutionIndex(3, data3.components.o3) + ' ' + data3.components.o3 + ' μg/m³' +
            '\nSO₂: \\' + GetPollutionIndex(4, data3.components.so2) + ' ' + data3.components.so2 + ' μg/m³' +
            '\nPM₂.₅: \\' + GetPollutionIndex(5, data3.components.pm2_5) + ' ' + data3.components.pm2_5 + ' μg/m³' +
            '\nPM₁₀: \\' + GetPollutionIndex(6, data3.components.pm10) + ' ' + data3.components.pm10 + ' μg/m³' +
            '\nNH₃: \\' + GetPollutionIndex(7, data3.components.nh3) + ' ' + data3.components.nh3 + ' μg/m³'
        }

            description +=
            '\n\n**Egyéb:**\n\n' +

            `${moonIcon} ${moonText} (${Math.floor(data2[1].illum * 100)} %-a látható)\n` +
            `\\🌇 Hajnal: <t:${ToUnix(times.dawn)}:R>\n` +
            `\\🌇 Napkelte: <t:${AverageUnix(data1.sys.sunrise, ToUnix(times.sunrise))}:R>\n` +
            `\\🌞 Dél: <t:${ToUnix(times.solarNoon)}:R>\n` +
            `\\📷 "Golden Hour": <t:${ToUnix(times.goldenHour)}:R>\n` +
            `\\🌆 Napnyugta: <t:${AverageUnix(data1.sys.sunset, ToUnix(times.sunset))}:R>\n` +
            `\\🌆 Szürkület: <t:${ToUnix(times.dusk)}:R>\n` +
            `\\🌃 Éjjfél: <t:${ToUnix(times.nadir) + 86400}:R>\n\n`

            '**Előrejelzés:**'

        embed.setDescription(description)
        
        if (ImgExists(skyImgName) === true) {
            embed
                .setImage('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/' + skyImgName + '.jpg')
        } else {
            embed
                .addFields([{name: 'ImgCode', value: skyImgName, inline: false}])
        }
    }
    { //Tegnap
        let skyTxt = data0[0].forecast[0].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[0].low

        const tempMaxValue = data0[0].forecast[0].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addFields([{
                    name: dayName(new Date().getDay() - 1),
                    value:
                        `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                        `${skyIcon} ${skyTxt}\n` +
                        `${weatherMoonIcon(data2[0].phaseName())}`,
                    inline: true
                }])
    }
    { //Ma2
        let skyTxt = data0[0].forecast[1].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[1].low

        const tempMaxValue = data0[0].forecast[1].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addFields([{
                name: dayName(new Date().getDay()) + ' (ma)',
                value: `\\☔ ${data0[0].forecast[1].precip} %\n` +
                    `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                    `${skyIcon} ${skyTxt}\n` +
                    `${weatherMoonIcon(data2[1].phaseName())}`,
                inline: true
            }])
    }
    { //Holnap
        let skyTxt = data0[0].forecast[2].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[2].low

        const tempMaxValue = data0[0].forecast[2].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addFields([{
                name: dayName(new Date().getDay() + 1),
                value: `\\☔ ${data0[0].forecast[2].precip} %\n` +
                    `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                    `${skyIcon} ${skyTxt}\n` +
                    `${weatherMoonIcon(data2[2].phaseName())}`,
                inline: true
            }])
    }
    { //Holnap után
        let skyTxt = data0[0].forecast[3].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[3].low

        const tempMaxValue = data0[0].forecast[3].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addFields([{
                name: dayName(new Date().getDay() + 2),
                value: `\\☔ ${data0[0].forecast[3].precip} %\n` +
                    `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                    `${skyIcon} ${skyTxt}\n` +
                    `${weatherMoonIcon(data2[3].phaseName())}`,
                inline: true
            }])
    }
    { //Holnap után-után
        let skyTxt = data0[0].forecast[4].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[4].low

        const tempMaxValue = data0[0].forecast[4].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addFields([{
                name: dayName(new Date().getDay() + 3),
                value: `\\☔ ${data0[0].forecast[4].precip} %\n` +
                    `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                    `${skyIcon} ${skyTxt}\n` +
                    `${weatherMoonIcon(data2[4].phaseName())}`,
                inline: true
            }])
    }

    embed
        .setTimestamp(Date.parse(current.date + 'T' + current.observationtime))
        .setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(current.skytext, true).replace('\\', '')))
        .setFooter({ text: '• weather.service.msn.com : openweathermap.org' })
    return embed
}

function GetMarsPressureIcon(pressure, averagePressure) {
    if (averagePressure == 0) {
        return ''
    } else {
        if (pressure-5 > averagePressure) {
            return '\\🔺 '
        } else if (pressure+5 < averagePressure) {
            return '\\🔻 '
        }
        return '\\◼️ '
    }
}

function GetSeason(season) {
    var seasonName = season
    if (seasons[seasonName] != undefined) {
        seasonName = `\\${seasons[seasonName].icon} ${seasons[seasonName].name}`
    }
    return seasonName
}

/** @param {string} date YYYY-MM-DD */
function DateToDate(date) {
    var newDate = new Date()
    newDate.setFullYear(date.split('-')[0], Number.parseInt(date.split('-')[1]) - 1, date.split('-')[2])
    return newDate
}

/**
 * @param {{
 *      sols: {
 *          terrestrial_date: string;
 *          sol: string;
 *          ls: string;
 *          season: string;
 *          min_temp: number;
 *          max_temp: number;
 *          pressure: number;
 *          sunrise: string;
 *          sunset: string;
 *      }[];
 *  }} data Mars weather data
 * @param {any} data Mars image data
 * @returns {Discord.EmbedBuilder}
 */
function getEmbedMars(data, weeklyImage) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#fd875f')
        .setAuthor({ name: 'Jezero Kráter', url: 'https://mars.nasa.gov/mars2020/weather/', iconURL: 'https://mars.nasa.gov/mars2020/favicon-16x16.png' })

    var averagePressure = 0
    try {
        var text = ""
        if (fs.existsSync('./pressures.txt')) {
            text = fs.readFileSync('./pressures.txt', 'utf-8')
        }
        var lines = text.split('\n')
        var solsLogged = []
        lines.forEach(line => {
            if (line.length > 0) {
                solsLogged.push(line.split(' ')[0])
            }
        });
        data.sols.forEach(sol => {
            if (solsLogged.includes(sol.sol)) {
                
            } else {
                text += sol.sol + ' ' + sol.pressure + '\n'
                solsLogged.push(sol.sol)
            }
        })
        fs.writeFileSync('./pressures.txt', text, 'utf-8')
        var lines = text.split('\n')
        var n = 0
        lines.forEach(line => {
            if (line.length > 0) {
                averagePressure += Number.parseFloat(line.split(' ')[1])
                n += 1
            }
        })
        averagePressure = averagePressure / n        
    } catch (ex) { }

    const latestSol = data.sols[data.sols.length - 1]
    
    embed
        .setTitle(`sol ${latestSol.sol}`)
        .setDescription(
            `\\🌡️ ${latestSol.min_temp} - ${latestSol.max_temp} °C\n` +
            `${GetMarsPressureIcon(latestSol.pressure, averagePressure)} ${latestSol.pressure} pHa légnyomás\n` +
            `${GetSeason(latestSol.season)}\n` +
            `Földi dátum: ${latestSol.terrestrial_date}` +

            '\n\n**Egyéb:**\n\n' +

            `\\🌇 Napkelte: ${latestSol.sunrise}\n` +
            `\\🌆 Napnyugta: ${latestSol.sunset}\n\n` +

            '**Előző sol-ok:**')

    data.sols.forEach(sol => {
        if (latestSol.sol != sol.sol) {
            embed.addFields([{
                name: 'Sol ' + sol.sol,
                value: '\\🌡️ ' + sol.min_temp + ' - ' + sol.max_temp + ' C°\n' + 
                    GetSeason(sol.season),
                inline: true
            }])
        }
    })

    embed
        .setTimestamp(DateToDate(latestSol.terrestrial_date))
        .setFooter({ text: '• Mars 2020' })
        .setImage('https://i.cdn29.hu/apix_collect_c/primary/1311/mars131114_20131114_122345_original_1150x645_cover.jpg')
    
    if (weeklyImage != null) {
        const imageList = weeklyImage.images[0]
        if (imageList != undefined) {
            embed.setImage(imageList.image_files.medium)
        }
    }
    
    return embed
}

/**
 * @param {Date} date 
 * @param {number} days 
 * @returns {Date}
 */
function addDays(date, days) {
    date.setDate(date.getDate() + days)
    return date
}

/** @param {(error: string, embeds: Discord.EmbedBuilder[]) => void} callback */
function GetMarsWeather(callback) {
    try {
        request(urlMarsWeeklyImage, function (err, res, body) {
            var bodyImage = null
            if (res.statusCode === 200) {
                bodyImage = body
            }

            try {
                //const body = fs.readFileSync('C:/Users/bazsi/Desktop/letöltés (1).json')
                request(urlMarsWeather, function (err, res, body) {
                    if (res.statusCode === 200) {
                        if (err) {
                            callback('**Mars Weather Error:** ' + err.toString(), [])
                        } else {
                            const data = JSON.parse(body)
                            if (bodyImage != null) {
                                bodyImage = JSON.parse(bodyImage)
                            }
                            callback(null, [ getEmbedMars(data, bodyImage) ])
                        }
                    } else {
                        callback('**HTTP Response Error:** ' + res.statusCode, [])
                    }
                })
            } catch (err) {
                callback('**HTTP Requiest Error:** ' + err.toString(), [])
            }
        })
    } catch (err) {
        callback('**HTTP Requiest Error:** ' + err.tostring(), [])
    }
}

/**
 * @param {
 *      (
 *          msnWeather: any,
 *          openweathermapWeather: any,
 *          openweathermapPollution: any,
 *          errorMessage: string
 *      ) => void
 *  } callback
 */
function GetEarthWeather(callback) {
    try {
        weather1.find({ search: 'Békéscsaba, HU', degreeType: 'C' }, function (msnWeatherError, msnWeather) {
            if (msnWeatherError) {
                callback(null, null, null, '**MSN Error:** ' + msnWeatherError.toString())
                return
            }
            try {
                request(urlWeather, function (err1, res1, openweathermapWeatherBody) {
                    if (res1.statusCode === 200) {
                        if (err1) {
                            callback(null, null, null, '**OpenWeatherMap Error:** ' + err1.toString())
                        } else {
                            /** @type {{ coord: { lon: number; lat: number; }; weather: { id: number; main: string; description: string; icon: string; }[]; base: string; main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number; }; visibility: number; wind: { speed: number; deg: number; gust: number; }; clouds: { all: number; }; dt: number; sys: { type: number; id: number; country: string; sunrise: number; sunset: number; }; timezone: number; id: number; name: string; cod: number; }} */
                            const openweathermapWeather = JSON.parse(openweathermapWeatherBody)
                            try {
                                request(urlPollution, function (err2, res2, openweathermapPollutionBody) {
                                    if (res2.statusCode === 200) {
                                        if (err2) {
                                            callback(null, null, null, '**OpenWeatherMap Error:** ' + err2.toString())
                                        } else {
                                            /** @type {{coord: { lon: number; lat: number; }; list: { main: { aqi: number; }; components: { co: number; no: number; no2: number; o3: number; so2: number; pm2_5: number; pm10: number; nh3: number; }; dt: number; }[];}} */
                                            const openweathermapPollution = JSON.parse(openweathermapPollutionBody)

                                            callback(msnWeather, openweathermapWeather, openweathermapPollution.list[0], null)
                                        }
                                    } else {
                                        callback(null, null, null, '**HTTP Response Error:** ' + res2.statusCode)
                                    }
                                })
                            } catch (err) {
                                callback(null, null, null, '**HTTP Requiest Error:** ' + err.toString())
                            }
                        }
                    } else {
                        callback(null, null, null, '**HTTP Response Error:** ' + res1.statusCode)
                    }
                })
            } catch (err) {
                callback(null, null, null, '**HTTP Requiest Error:** ' + err.toString())
            }
        })
    } catch (error) {
        callback(null, null, null, '**MSN Error:** ' + error.toString())
    }
}

/**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
*/
module.exports = async (command, privateCommand, earth = true) => {
    if (earth == true) {
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()
        const m = [
            new MoonPhase(addDays(new Date(year, month, day), -1)),
            new MoonPhase(new Date(year, month, day)),
            new MoonPhase(addDays(new Date(year, month, day), 1)),
            new MoonPhase(addDays(new Date(year, month, day), 2)),
            new MoonPhase(addDays(new Date(year, month, day), 3))
        ]
    
        await command.deferReply({ ephemeral: privateCommand })
    
        GetEarthWeather((msnWeather, openweathermapWeather, openweathermapPollution, errorMessage) => {
            if (errorMessage != null) {
                command.editReply({ content: '> \\❌ ' + errorMessage })
            } else {
                const embed = getEmbedEarth(msnWeather, openweathermapWeather, m, openweathermapPollution)
                command.editReply({ embeds: [embed] })
            }
        })
    } else {
        await command.deferReply()
        GetMarsWeather((errorMessage, embeds) => {
            if (errorMessage != null) {
                command.editReply({ content: '> \\❌ ' + errorMessage })
            } else {
                command.editReply({ embeds: embeds })
            }
        })
    }
}
