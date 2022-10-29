const Discord = require('discord.js')
const MoonPhase = require('moonphase-js')
const fs = require('fs')
const SunCalc = require('suncalc')
const WeatherServices = require('./weatherServices')

const seasons = {
    'late autumn': { name: 'Késő ősz', icon: '🍂' },
    'early winter': { name: 'Kora tél', icon: '❄️' },
    'mid winter': { name: 'Tél közepe', icon: '❄️' },
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
    weatherSkytextImgName,
    CityBekescsaba
} = require('../commands/weatherFunctions');

const ToUnix=(date)=>{return Math.round(date.getTime()/1000)}
const AverageUnix=(unix1,unix2)=>{return Math.round((unix1+unix2)/2)}

/**
 * @param {WeatherServices.MSN.WeatherResult} MsnWeather Msn weather data
 * @param {WeatherServices.OpenWeatherMap.WeatherResult} OpenweatherWeather Openweather weather data
 * @param {MoonPhase[]} data2 Moon data
 * @param {WeatherServices.OpenWeatherMap.PollutionResult} OpenweatherPollution Openweather pollution data
 */
function getEmbedEarth(MsnWeather, OpenweatherWeather, data2, OpenweatherPollution) {
    const current = MsnWeather.current
    const embed = new Discord.EmbedBuilder()
        .setColor('#00AE86')
        .setAuthor({ name: current.observationpoint.replace(', Hungary', ''), url: 'https://openweathermap.org/city/' + OpenweatherWeather.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    {
        const skyTxt = weatherSkytxt(current.skytext)
        embed.setTitle(`**${skyTxt}** ||(${OpenweatherWeather.weather[0].description})|||| (${OpenweatherWeather.weather[0].id})||`)

        const humidityValue = Average([current.humidity, OpenweatherWeather.main.humidity])
        const humidityIcon = weatherHumidityIcon(humidityValue)

        const windValue = GetReadableNumber(Average([OpenweatherWeather.wind.speed * 3.6, parseInt(current.windspeed.replace(' km/h', ''))]))

        const windGustValue = GetReadableNumber(OpenweatherWeather.wind.gust * 3.6)

        const tempValue = GetReadableNumber(Average([current.temperature, OpenweatherWeather.main.temp]))

        const tempMinValue = GetReadableNumber(Average([MsnWeather.forecast[1].low, OpenweatherWeather.main.temp_min]))
        const tempMaxValue = GetReadableNumber(Average([MsnWeather.forecast[1].high, OpenweatherWeather.main.temp_max]))

        const tempFeelslikeValue = Math.floor(Average([current.feelslike, OpenweatherWeather.main.feels_like]))

        const windDirection = DirectionNameToArrow(current.winddisplay.toString().split(' ')[2])

        const visibilityValue = Math.floor(OpenweatherWeather.visibility / 1000)

        const times = SunCalc.getTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)
        const moonTimes = SunCalc.getMoonTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)
                
        var description = ''
        description += '\n' + `\\☁️ ${OpenweatherWeather.clouds.all} % felhősség`
        if (MsnWeather.forecast[1].precip !== '0')
        { description += '\n' + `\\☔ ${MsnWeather.forecast[1].precip} % csapadék` }
        description += '\n' + `${humidityIcon} ${humidityValue} % páratartalom`
        description += '\n' + `${weatherTempIcon(tempFeelslikeValue)} ${tempMinValue} - ${tempValue} - ${tempMaxValue} °C (Hőérzet: ${tempFeelslikeValue} °C)`
        description += '\n' + `${weatherWindIcon(windValue)} ${windDirection} (${OpenweatherWeather.wind.deg}°) ${windValue} km/h szél`
        description += '\n' + `\\🌬️ ${windGustValue} km/h széllökés`
        description += '\n' + `${weatherPressureIcon(OpenweatherWeather.main.pressure)} ${OpenweatherWeather.main.pressure} pHa légnyomás`
        
        if (visibilityValue !== 10)
        { description += '\n' + `\\👁️ ${visibilityValue} km látótávolság` }

        if (OpenweatherPollution !== undefined) {
            description += '\n' + '\n😷 **Levegőminőség:**\n'

            description += '\n' + `Levőminőség: \\${GetPollutionIndex(8, OpenweatherPollution.main.aqi)} ${GetPollutionText(OpenweatherPollution.main.aqi)}`
        
            description += '\n' + `CO: \\${GetPollutionIndex(0, OpenweatherPollution.components.co)} ${OpenweatherPollution.components.co} μg/m³`
            description += '\n' + `NO: \\${GetPollutionIndex(1, OpenweatherPollution.components.no)} ${OpenweatherPollution.components.no}μg/m³`
            description += '\n' + `NO₂: \\${GetPollutionIndex(2, OpenweatherPollution.components.no2)} ${OpenweatherPollution.components.no2}μg/m³`
            description += '\n' + `O₃: \\${GetPollutionIndex(3, OpenweatherPollution.components.o3)} ${OpenweatherPollution.components.o3}μg/m³`
            description += '\n' + `SO₂: \\${GetPollutionIndex(4, OpenweatherPollution.components.so2)} ${OpenweatherPollution.components.so2}μg/m³`
            description += '\n' + `PM₂.₅: \\${GetPollutionIndex(5, OpenweatherPollution.components.pm2_5)} ${OpenweatherPollution.components.pm2_5}μg/m³`
            description += '\n' + `PM₁₀: \\${GetPollutionIndex(6, OpenweatherPollution.components.pm10)} ${OpenweatherPollution.components.pm10}μg/m³`
            description += '\n' + `NH₃: \\${GetPollutionIndex(7, OpenweatherPollution.components.nh3)} ${OpenweatherPollution.components.nh3}g/m³`
        }

        description +=
            '\n\n☀️ **Nap:**\n\n' +

            `\\🌇 Hajnal: <t:${ToUnix(times.dawn)}:R>\n` +
            `\\🌇 Napkelte: <t:${AverageUnix(OpenweatherWeather.sys.sunrise, ToUnix(times.sunrise))}:R>\n` +
            `\\🌞 Dél: <t:${ToUnix(times.solarNoon)}:R>\n` +
            `\\📷 "Golden Hour": <t:${ToUnix(times.goldenHour)}:R>\n` +
            `\\🌆 Napnyugta: <t:${AverageUnix(OpenweatherWeather.sys.sunset, ToUnix(times.sunset))}:R>\n` +
            `\\🌆 Szürkület: <t:${ToUnix(times.dusk)}:R>\n` +
            `\\🌃 Éjjfél: <t:${ToUnix(times.nadir) + 86400}:R>`
        description +=
            '\n\n🌕 **Hold:**\n\n'
        description += `${weatherMoonIcon(data2[1].phaseName())} ${weatherMoonText(data2[1].phaseName())} (${Math.floor(data2[1].illum * 100)} %-a látható)\n`
        description += `Holdkelte: <t:${ToUnix(moonTimes.rise)}:R>\n`
        description += `Holdnyugta: <t:${ToUnix(moonTimes.set)}:R>\n`
        if (moonTimes.alwaysUp) {
            description += `A Hold ma mindig a **horizont felett lesz**\n`
        }
        if (moonTimes.alwaysDown) {
            description += `A Hold ma mindig a **horizont alatt lesz**\n`
        }

        description += '\n🗓️ **Előrejelzés:**'
        embed.setDescription(description)
        
        const skyImgName = weatherSkytextImgName(current.skytext, unixToTime(OpenweatherWeather.sys.sunset).split(':')[0], unixToTime(OpenweatherWeather.sys.sunrise).split(':')[0], OpenweatherWeather.clouds.all)
        if (ImgExists(skyImgName) === true)
        { embed.setImage('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/' + skyImgName + '.jpg') }
        else
        { embed.addFields([{ name: 'ImgCode', value: skyImgName, inline: false }]) }
    }

    for (let i = 0; i < MsnWeather.forecast.length; i++) {
        const Element = MsnWeather.forecast[i]
        
        const skyIcon = weatherSkytextIcon(Element.skytextday, false)
        const skyTxt = weatherSkytxt(Element.skytextday)

        const tempMinValue = Element.low

        const tempMaxValue = Element.high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        var text = ''
        if (Element.precip !== undefined && Element.precip !== '0')
        { text += `\n\\☔ ${Element.precip} %` }
        text += `\n${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C`
        text += `\n${skyIcon} ${skyTxt}`

        var dayName = dayName(new Date().getDay() + i - 1)
        if (i === 0) {
            dayName += ' (ma)'
        }

        embed.addFields([{
            name: dayName,
            value: text.trim(),
            inline: true
        }])
    }

    embed.setTimestamp(Date.parse(current.date + 'T' + current.observationtime))
    embed.setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(current.skytext, true).replace('\\', '')))
    embed.setFooter({ text: '• weather.service.msn.com • openweathermap.org' })
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

/** @param {WeatherServices.NasaMars.WeatherResult} data @param {WeatherServices.NasaMars.WeeklyImagesResult} weeklyImage */
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
            if (!solsLogged.includes(sol.sol)) {
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
            `\\🌍 Földi dátum: ${latestSol.terrestrial_date}` +

            '\n\n☀️ **Nap:**\n\n' +

            `\\🌇 Napkelte: ${latestSol.sunrise}\n` +
            `\\🌆 Napnyugta: ${latestSol.sunset}\n\n` +

            '\\🗓️ **Előző sol-ok:**')

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

/** @param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
module.exports = async (command, privateCommand, earth = true) => {
    await command.deferReply({ ephemeral: privateCommand })

    if (earth == true) {        
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()

        WeatherServices.MsnWeather((msnWeather, msnWeatherError) => {
            if (msnWeatherError) {
                command.editReply({ content: '> \\❌ **MSN Error:** ' + msnWeatherError })
                return
            }
            WeatherServices.OpenweathermapWeather((openweathermapWeather, openweathermapWeatherError) => {
                if (openweathermapWeatherError) {
                    command.editReply({ content: '> \\❌ ' + openweathermapWeatherError })
                    return
                }
                WeatherServices.OpenweathermapPollution((openweathermapPollution, openweathermapPollutionError) => {
                    if (openweathermapPollutionError) {
                        command.editReply({ content: '> \\❌ ' + openweathermapPollutionError })
                        return
                    }

                    const MoonPhases = [
                        new MoonPhase(addDays(new Date(year, month, day), -1)),
                        new MoonPhase(new Date(year, month, day)),
                        new MoonPhase(addDays(new Date(year, month, day), 1)),
                        new MoonPhase(addDays(new Date(year, month, day), 2)),
                        new MoonPhase(addDays(new Date(year, month, day), 3))
                    ]

                    const embed = getEmbedEarth(msnWeather[0], openweathermapWeather, MoonPhases, openweathermapPollution.list[0])
                    command.editReply({ embeds: [embed] })
                })
            })
        })
    } else {
        WeatherServices.NasaMarsWeather((weatherData, weatherError) => {
            if (weatherError) {
                command.editReply({ content: '> \\❌ ' + weatherError })
                return
            }

            WeatherServices.NasaMarsWeeklyImage((bodyImage, imageError) => {
                command.editReply({ embeds: [ getEmbedMars(weatherData, bodyImage)] })
            })
        })
    }
}
