const Discord = require('discord.js')
const MoonPhase = require('moonphase-js')
const weather1 = require('weather-js')
const weather2 = require('nodejs-weather-app');
const fs = require('fs')
const request = require("request");
const { openweatherToken } = require('../config.json')

const urlWeather = 'http://api.openweathermap.org/data/2.5/weather?lat=46.678889&lon=21.090833&units=metric&appid=' + openweatherToken
const urlPollution = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=46.678889&lon=21.090833&appid=' + openweatherToken
const urlMarsWeather = 'https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json&ver=1.0'
const urlMarsWeeklyImage = 'https://mars.nasa.gov/rss/api/?feed=weekly_raws&category=mars2020&feedtype=json&num=1&page=0&tags=mars2020_featured_image&format=json'

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
} = require('../commands/weatherFunctions')

/**
 * @param {any} data0 Msn weather data
 * @param {any} data1 Openweather weather data
 * @param {any[]} data2 Moon data
 * @param {any} data3 Openweather pollution data
 * @returns {Discord.MessageEmbed}
 */
function getEmbedEarth(data0, data1, data2, data3) {
    var current = data0[0].current
    const embed = new Discord.MessageEmbed()
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

        embed
            .setTitle(`**${skyTxt}** ||(${data1.weather[0].description})|||| (${data1.weather[0].id})||`)
            .setDescription(
                `\\?????? ${data1.clouds.all} % felh??ss??g\n` +
                `\\??? ${data0[0].forecast[1].precip} % csapad??k\n` +
                `${humidityIcon} ${humidityValue} % p??ratartalom\n` +
                `${tempIcon} ${tempMinValue} - ${tempValue} - ${tempMaxValue} ??C (H????rzet: ${tempFeelslikeValue} ??C)\n` +
                `${windIcon} ${windDirection} (${data1.wind.deg}??) ${windValue} km/h sz??l\n` +
                `\\??????? ${windGustValue} km/h sz??ll??k??s\n` +
                `${weatherPressureIcon(data1.main.pressure)} ${data1.main.pressure} pHa l??gnyom??s\n` +
                `\\??????? ${visibilityValue} km l??t??t??vols??g\n` +

                '\n\n**Leveg??min??s??g:**\n\n' +

                'Lev??min??s??g index: \\' + GetPollutionIndex(8, data3.main.aqi) + ' ' + GetPollutionText(data3.main.aqi) +

                '\n\nCO: \\' + GetPollutionIndex(0, data3.components.co) + ' ' + data3.components.co + ' ??g/m??' +
                '\nNO: \\' + GetPollutionIndex(1, data3.components.no) + ' ' + data3.components.no + ' ??g/m??' +
                '\nNO???: \\' + GetPollutionIndex(2, data3.components.no2) + ' ' + data3.components.no2 + ' ??g/m??' +
                '\nO???: \\' + GetPollutionIndex(3, data3.components.o3) + ' ' + data3.components.o3 + ' ??g/m??' +
                '\nSO???: \\' + GetPollutionIndex(4, data3.components.so2) + ' ' + data3.components.so2 + ' ??g/m??' +
                '\nPM???.???: \\' + GetPollutionIndex(5, data3.components.pm2_5) + ' ' + data3.components.pm2_5 + ' ??g/m??' +
                '\nPM??????: \\' + GetPollutionIndex(6, data3.components.pm10) + ' ' + data3.components.pm10 + ' ??g/m??' +
                '\nNH???: \\' + GetPollutionIndex(7, data3.components.nh3) + ' ' + data3.components.nh3 + ' ??g/m??' +

                '\n\n**Egy??b:**\n\n' +

                `${moonIcon} ${moonText} (${Math.floor(data2[1].illum * 100)} %-a l??that??)\n` +
                `\\???? Napkelte: ${unixToTime(data1.sys.sunrise)}\n` +
                `\\???? Napnyugta: ${unixToTime(data1.sys.sunset)}\n\n` +

                '**El??rejelz??s:**')
        if (ImgExists(skyImgName) === true) {
            embed
                .setImage('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/' + skyImgName + '.jpg')
        } else {
            embed
                .addField('ImgCode', skyImgName, false)
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
            .addField(dayName(new Date().getDay() - 1),
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} ??C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[0].phaseName())} ${weatherMoonText(data2[0].phaseName())}`,
                true)
    }
    { //Ma2
        let skyTxt = data0[0].forecast[1].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[1].low

        const tempMaxValue = data0[0].forecast[1].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addField(dayName(new Date().getDay()) + ' (ma)',
                `\\??? ${data0[0].forecast[1].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} ??C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[1].phaseName())} ${weatherMoonText(data2[1].phaseName())}`,
                true)
    }
    { //Holnap
        let skyTxt = data0[0].forecast[2].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[2].low

        const tempMaxValue = data0[0].forecast[2].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addField(dayName(new Date().getDay() + 1),
                `\\??? ${data0[0].forecast[2].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} ??C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[2].phaseName())} ${weatherMoonText(data2[2].phaseName())}`,
                true)
    }
    { //Holnap ut??n
        let skyTxt = data0[0].forecast[3].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[3].low

        const tempMaxValue = data0[0].forecast[3].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addField(dayName(new Date().getDay() + 2),
                `\\??? ${data0[0].forecast[3].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} ??C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[3].phaseName())} ${weatherMoonText(data2[3].phaseName())}`,
                true)
    }
    { //Holnap ut??n-ut??n
        let skyTxt = data0[0].forecast[4].skytextday
        const skyIcon = weatherSkytextIcon(skyTxt, false)
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[4].low

        const tempMaxValue = data0[0].forecast[4].high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        embed
            .addField(dayName(new Date().getDay() + 3),
                `\\??? ${data0[0].forecast[4].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} ??C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[4].phaseName())} ${weatherMoonText(data2[4].phaseName())}`,
                true)
    }

    embed
        .setTimestamp(current.date + 'T' + current.observationtime)
        .setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(current.skytext, true).replace('\\', '')))
        .setFooter({ text: '??? weather.service.msn.com : openweathermap.org', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/information_2139-fe0f.png' })
    return embed
}

function GetMarsPressureIcon(pressure, averagePressure) {
    if (averagePressure == 0) {
        return ''
    } else {
        if (pressure-5 > averagePressure) {
            return '\\???? '
        } else if (pressure+5 < averagePressure) {
            return '\\???? '
        }
        return '\\?????? '
    }
}

/**
 * @param {any} data Mars weather data
 * @param {any} data Mars image data
 * @returns {Discord.MessageEmbed}
 */
function getEmbedMars(data, weeklyImage) {
    const embed = new Discord.MessageEmbed()
        .setColor('#fd875f')
        .setAuthor({ name: 'Jezero Kr??ter', url: 'https://mars.nasa.gov/mars2020/weather/', iconURL: 'https://mars.nasa.gov/mars2020/favicon-16x16.png' })

    const seasonNames = {
        'late autumn': 'K??s?? ??sz'
    }

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

    data.sols.forEach(_sol => {
        /** @type {{terrestrial_date: string; sol: string; ls: string; season: string; min_temp: number; max_temp: number; pressure: number; sunrise: string; sunset: string;}} */
        const sol = _sol
        var seasonName = sol.season
        if (seasonNames[seasonName] != undefined) {
            seasonName = seasonNames[seasonName]
        }
        embed.addField('Sol ' + sol.sol,
        GetMarsPressureIcon(sol.pressure, averagePressure) + sol.pressure + ' Pa\n' + 
        '\\??????? ' + sol.min_temp + ' - ' + sol.max_temp + ' C??\n' + 
        '??vszak: ' + seasonName + ''
        , true)
    })

    embed
        .setFooter({ text: '??? Mars 2020', iconURL: 'https://images-ext-1.discordapp.net/external/yUBPtm8abWHU7zYH04hOrTOPwU6Q8WfqtGX1OPwXTYQ/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/information_2139-fe0f.png' })
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

/** @param {(error: string, embeds: Discord.MessageEmbed[]) => void} callback */
function GetMarsWeather(callback) {
    try {
        request(urlMarsWeeklyImage, function (err, res, body) {
            var bodyImage = null
            if (res.statusCode === 200) {
                bodyImage = body
            }

            try {
                //const body = fs.readFileSync('C:/Users/bazsi/Desktop/let??lt??s (1).json')
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
    } catch (err) {}
}

/** @param 
 * {(
 * msnWeather: any,
 * openweathermapWeather: any,
 * openweathermapPollution: any,
 * errorMessage: string
 * ) => void}
 * callback */
function GetEarthWeather(callback) {
    try {
        weather1.find({ search: 'B??k??scsaba, HU', degreeType: 'C' }, function (msnWeatherError, msnWeather) {
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
                command.editReply({ content: '> \\??? ' + errorMessage })
            } else {
                const embed = getEmbedEarth(msnWeather, openweathermapWeather, m, openweathermapPollution)
                command.editReply({ embeds: [embed] })
            }
        })
    } else {
        await command.deferReply()
        GetMarsWeather((errorMessage, embeds) => {
            if (errorMessage != null) {
                command.editReply({ content: '> \\??? ' + errorMessage })
            } else {
                command.editReply({ embeds: embeds })
            }
        })
    }
}
