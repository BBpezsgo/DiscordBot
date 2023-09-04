const Discord = require('discord.js')
const MoonPhase = require('moonphase-js')
const fs = require('fs')
const SunCalc = require('suncalc')
const Openweathermap = require('../services/Openweathermap')
const NASA = require('../services/NASA')
const WeatherAlertsService = require('../services/weatherMet')
const LogError = require('../functions/errorLog')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const seasons = {
    'early autumn': { name: 'Kora ősz', icon: '🍂' },
    'mid autumn': { name: 'Ősz', icon: '🍂' },
    'late autumn': { name: 'Késő ősz', icon: '🍂' },

    'early winter': { name: 'Kora tél', icon: '❄️' },
    'mid winter': { name: 'Tél', icon: '❄️' },
    'late winter': { name: 'Késő tél', icon: '❄️' },

    'early spring': { name: 'Kora tavasz', icon: '🌱' },
    'mid spring': { name: 'Tavasz', icon: '🌱' },
    'late spring': { name: 'Késő tavasz', icon: '🌱' },
}

const {
    ImgExists,
    unixToTime,
    weatherSkytextImgName,
    
    weatherSkytxt,
    weatherWindIcon,
    weatherTempIcon,
    weatherMoonIcon,
    weatherMoonText,
    weatherHumidityIcon,
    weatherThumbnailUrl,
    DirectionNameToArrow,
    weatherPressureIcon,
    Average,
    GetReadableNumber,
    GetPollutionIndex,
    GetPollutionText,
    dayName,
    weatherSkytextIcon,
    MetAlert_DegreeIconNames,
    MetAlert_TypeIcons,
    MetAlert_TypeNames,
    CityBekescsaba
} = require('../commands/weatherFunctions');
const Utils = require('../functions/utils')

const EmojiPrefix = ''

/**
 @param {Openweathermap.OpenWeatherMap.WeatherResult} OpenweatherWeather
 @param {MoonPhase[]} Moon
 @param {Openweathermap.OpenWeatherMap.PollutionItem | undefined} OpenweatherPollution
 @param {WeatherAlertsService.MET.ResultCounty[]} MetAlerts
 @param {WeatherAlertsService.MET.ResultSnowReport} MetSnowReport
 @param {boolean} msnIsCache
 @param {boolean} openweathermapWeatherIsCache
 */
function getEmbedEarth(OpenweatherWeather, Moon, OpenweatherPollution, MetAlerts, msnIsCache, openweathermapWeatherIsCache, MetSnowReport) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#00AE86')
        .setAuthor({ name: 'Békéscsaba', url: 'https://openweathermap.org/city/' + OpenweatherWeather.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    {
        embed.setTitle(`**${weatherSkytxt(OpenweatherWeather.weather[0].description)}** ||${OpenweatherWeather.weather[0].id}||`)

        const humidityValue = OpenweatherWeather.main.humidity

        const windValue = GetReadableNumber(OpenweatherWeather.wind.speed * 3.6)

        const tempValue = GetReadableNumber(OpenweatherWeather.main.temp)

        const tempMinValue = GetReadableNumber(OpenweatherWeather.main.temp_min)
        const tempMaxValue = GetReadableNumber(OpenweatherWeather.main.temp_max)

        const pressure = (OpenweatherWeather.main.grnd_level) ? OpenweatherWeather.main.grnd_level : OpenweatherWeather.main.pressure

        const tempFeelslikeValue = Math.floor(OpenweatherWeather.main.feels_like)

        // const windDirection = DirectionNameToArrow(current.winddisplay.toString().split(' ')[2])

        const times = SunCalc.getTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)
        const moonTimes = SunCalc.getMoonTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)

        var description = ''
        description += '\n' + `${EmojiPrefix}☁️ ${OpenweatherWeather.clouds.all} % felhősség`
        
        description += '\n' + `${EmojiPrefix}${weatherHumidityIcon(humidityValue)} ${humidityValue} % páratartalom`
        description += '\n' + `${EmojiPrefix}${weatherTempIcon(tempFeelslikeValue)} ${tempMinValue} - ${tempValue} - ${tempMaxValue} °C (Hőérzet: ${tempFeelslikeValue} °C)`
        description += '\n' + `${EmojiPrefix}${weatherWindIcon(windValue)} ${windValue} km/h szél`
        description += '\n' + `${EmojiPrefix}🌬️ ${GetReadableNumber(OpenweatherWeather.wind.gust * 3.6)} km/h széllökés`
        description += '\n' + `${EmojiPrefix}${weatherPressureIcon(pressure)} ${pressure} pHa légnyomás`
        
        if (OpenweatherWeather.visibility !== 10000) {
            if (OpenweatherWeather.visibility < 1000) {
                description += '\n' + `${EmojiPrefix}👁️ ${OpenweatherWeather.visibility} m látótávolság`
            } else {
                description += '\n' + `${EmojiPrefix}👁️ ${Math.round(OpenweatherWeather.visibility / 1000)} km látótávolság`
            }
        }

        var snowDepth = null
        for (let i = 0; i < MetSnowReport.length; i++) {
            if (MetSnowReport[i].location === 'Békéscsaba') {
                snowDepth = MetSnowReport[i].depth
                break
            }           
        }
        if (OpenweatherWeather.rain) {
            if (OpenweatherWeather.rain['1h']) {
                description += '\n' + `${EmojiPrefix}🌊 ${OpenweatherWeather.rain['1h']} mm eső az elmúlt 1 órában`
            }
            if (OpenweatherWeather.rain['3h']) {
                description += '\n' + `${EmojiPrefix}🌊 ${OpenweatherWeather.rain['3h']} mm eső az elmúlt 3 órában`
            }
        }

        if (snowDepth !== null) {
            if (snowDepth === 'patches') {
                description += '\n' + `${EmojiPrefix}⛄ Helyenként hófoltok`
            } else if (snowDepth !== 0) {
                description += '\n' + `${EmojiPrefix}⛄ ${snowDepth} cm hó`
            }
        }

        if (OpenweatherWeather.snow) {
            if (OpenweatherWeather.snow['1h']) {
                description += '\n' + `${EmojiPrefix}⛄ ${OpenweatherWeather.snow['1h']} mm hó az elmúlt 1 órában`
            }
            if (OpenweatherWeather.snow['3h']) {
                description += '\n' + `${EmojiPrefix}⛄ ${OpenweatherWeather.snow['3h']} mm hó az elmúlt 3 órában`
            }
        }

        if (MetAlerts[0] !== null) {
            if (MetAlerts[0].alerts.length > 0) {
                description += '\n' + '\n🔔 **Riasztások:**\n'
                
                for (let i = 0; i < MetAlerts[0].alerts.length; i++) {
                    const alert = MetAlerts[0].alerts[i]
                    var result = ''
                    
                    if (MetAlert_TypeIcons[alert.typeIcon] !== undefined) {
                        result += `${EmojiPrefix}${MetAlert_TypeIcons[alert.typeIcon]} `
                    } else {
                        result += `||${alert.typeIcon}|| `
                    }
                    
                    if (MetAlert_DegreeIconNames[alert.degreeIcon] !== undefined) {
                        result += `${MetAlert_DegreeIconNames[alert.degreeIcon]} `
                    } else {
                        result += `||${alert.degreeIcon}|| `
                    }

                    if (MetAlert_TypeNames[alert.Name.toLowerCase()] !== undefined) {
                        result += MetAlert_TypeNames[alert.Name.toLowerCase()].toLowerCase()
                    } else {
                        result += alert.Name.toLowerCase()
                    }

                    description += '\n' + result
                }
            }
        }

        if (OpenweatherPollution) {
            description += '\n' + `\n😷 **Levegőminőség:**\n`

            description += '\n' + `Levőminőség: ${EmojiPrefix}${GetPollutionIndex(8, OpenweatherPollution.main.aqi)} ${GetPollutionText(OpenweatherPollution.main.aqi)}`
        
            description += '\n' + `CO: ${EmojiPrefix}${GetPollutionIndex(0, OpenweatherPollution.components.co)} ${OpenweatherPollution.components.co} μg/m³`
            description += '\n' + `NO: ${EmojiPrefix}${GetPollutionIndex(1, OpenweatherPollution.components.no)} ${OpenweatherPollution.components.no}μg/m³`
            description += '\n' + `NO₂: ${EmojiPrefix}${GetPollutionIndex(2, OpenweatherPollution.components.no2)} ${OpenweatherPollution.components.no2}μg/m³`
            description += '\n' + `O₃: ${EmojiPrefix}${GetPollutionIndex(3, OpenweatherPollution.components.o3)} ${OpenweatherPollution.components.o3}μg/m³`
            description += '\n' + `SO₂: ${EmojiPrefix}${GetPollutionIndex(4, OpenweatherPollution.components.so2)} ${OpenweatherPollution.components.so2}μg/m³`
            description += '\n' + `PM₂.₅: ${EmojiPrefix}${GetPollutionIndex(5, OpenweatherPollution.components.pm2_5)} ${OpenweatherPollution.components.pm2_5}μg/m³`
            description += '\n' + `PM₁₀: ${EmojiPrefix}${GetPollutionIndex(6, OpenweatherPollution.components.pm10)} ${OpenweatherPollution.components.pm10}μg/m³`
            description += '\n' + `NH₃: ${EmojiPrefix}${GetPollutionIndex(7, OpenweatherPollution.components.nh3)} ${OpenweatherPollution.components.nh3}g/m³`
        }

        try {
            description +=
                '\n\n☀️ **Nap:**\n\n' +

                `${EmojiPrefix}🌇 Hajnal: <t:${Utils.ToUnix(times.dawn)}:t>\n` +
                `${EmojiPrefix}🌇 Napkelte: <t:${Utils.Average(OpenweatherWeather.sys.sunrise, Utils.ToUnix(times.sunrise))}:t> - <t:${Utils.ToUnix(times.sunriseEnd)}:t>\n` +
                `${EmojiPrefix}🌞 Dél: <t:${Utils.ToUnix(times.solarNoon)}:t>\n` +
                `${EmojiPrefix}📷 "Golden Hour": <t:${Utils.ToUnix(times.goldenHour)}:t>\n` +
                `${EmojiPrefix}🌆 Napnyugta: <t:${Utils.ToUnix(times.sunsetStart)}:t> - <t:${Utils.Average(OpenweatherWeather.sys.sunset, Utils.ToUnix(times.sunset))}:t>\n` +
                `${EmojiPrefix}🌆 Szürkület: <t:${Utils.ToUnix(times.dusk)}:t>\n` +
                `${EmojiPrefix}🌃 Éjjfél: <t:${Utils.ToUnix(times.nadir) + 86400}:t>`            
        } catch (error) {
            LogError(error)
        }

        description +=
            '\n\n🌙 **Hold:**\n\n'
        description += `${EmojiPrefix}${weatherMoonIcon(Moon[1].phaseName())} ${weatherMoonText(Moon[1].phaseName())} (${Math.floor(Moon[1].illum * 100)} %-a látható)\n`
        
        if (moonTimes.rise !== undefined)
        { description += `${EmojiPrefix}⬆️ Holdkelte: <t:${Utils.ToUnix(moonTimes.rise)}:t>\n` }
        if (moonTimes.set !== undefined)
        { description += `${EmojiPrefix}⬇️ Holdnyugta: <t:${Utils.ToUnix(moonTimes.set)}:t>\n` }

        if (moonTimes.alwaysUp)
        { description += `A Hold ma mindig a **horizont felett lesz**\n` }
        if (moonTimes.alwaysDown)
        { description += `A Hold ma mindig a **horizont alatt lesz**\n` }
        // description += '\n🗓️ **Előrejelzés:**'
        embed.setDescription(description)
        
        /*
        const skyImgName = weatherSkytextImgName(current.skytext, unixToTime(OpenweatherWeather.sys.sunset).split(':')[0], unixToTime(OpenweatherWeather.sys.sunrise).split(':')[0], OpenweatherWeather.clouds.all)
        
        if (ImgExists(skyImgName) === true)
        { embed.setImage('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/' + skyImgName + '.jpg') }
        else
        { embed.addFields([{ name: 'ImgCode', value: skyImgName, inline: false }]) }
        */
    }

    /*
    for (let i = 0; i < MsnWeather.forecast.length; i++) {
        const Element = MsnWeather.forecast[i]
        
        const skyIcon = weatherSkytextIcon(Element.skytextday, false)
        const skyTxt = weatherSkytxt(Element.skytextday)

        const tempMinValue = Element.low

        const tempMaxValue = Element.high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        var text = ''

        if (Element.precip !== undefined && Element.precip !== '0')
        { text += `\n${EmojiPrefix}☔ ${Element.precip} %` }

        text += `\n${EmojiPrefix}${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C`
        
        text += `\n${EmojiPrefix}${skyIcon} ${skyTxt}`

        const dayNameText = dayName(new Date().getDay() + i - 1)

        if (i > 1 && i < MetAlerts.length) {
            if (MetAlerts[i-1] !== null) {
                if (MetAlerts[i-1].alerts.length > 0) {
                    
                    for (let j = 0; j < MetAlerts[i-1].alerts.length; j++) {
                        const alert = MetAlerts[i-1].alerts[j]
                        var result = ''
                        
                        if (MetAlert_TypeIcons[alert.typeIcon] !== undefined) {
                            result += `${EmojiPrefix}${MetAlert_TypeIcons[alert.typeIcon]} `
                        } else {
                            result += `||${alert.typeIcon}|| `
                        }
                        
                        if (MetAlert_DegreeIconNames[alert.degreeIcon] !== undefined) {
                            result += `${MetAlert_DegreeIconNames[alert.degreeIcon]} `
                        } else {
                            result += `||${alert.degreeIcon}|| `
                        }

                        if (MetAlert_TypeNames[alert.Name.toLowerCase()] !== undefined) {
                            result += MetAlert_TypeNames[alert.Name.toLowerCase()].toLowerCase()
                        } else {
                            result += alert.Name.toLowerCase()
                        }

                        text += '\n' + result
                    }
                }
            }
        }

        embed.addFields([{
            name: dayNameText,
            value: text.trim(),
            inline: true
        }])
    }
    */

    /*
    embed.addFields({
        name: '\n📈 Grafikon:',
        value: 'Minimum-, maximum hőmérséklet és csapadék',
        inline: false
    })
    */

    embed.setTimestamp(new Date(OpenweatherWeather.dt))    
    // embed.setThumbnail('attachment://graph.png')
    embed.setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(OpenweatherWeather.weather[0].id)))
    const MsnFooter = ((msnIsCache === true) ? '📁' : '') + 'weather.service.msn.com'
    const OpenweathermapFooter = ((openweathermapWeatherIsCache === true) ? '📁' : '') + 'openweathermap.org'
    embed.setFooter({ text: `${OpenweathermapFooter}` })
    embed.setImage('attachment://graph.png')
    return embed
}

function GetMarsPressureIcon(pressure, averagePressure) {
    if (averagePressure == 0) {
        return ''
    } else {
        if (pressure-5 > averagePressure) {
            return `${EmojiPrefix}🔺 `
        } else if (pressure+5 < averagePressure) {
            return `${EmojiPrefix}🔻 `
        }
        return `${EmojiPrefix}◼️ `
    }
}

function GetSeason(season) {
    var seasonName = season
    if (seasons[seasonName] != undefined) {
        seasonName = `${EmojiPrefix}${seasons[seasonName].icon} ${seasons[seasonName].name}`
    }
    return seasonName
}

/** @param {string} date YYYY-MM-DD */
function DateToDate(date) {
    var newDate = new Date()
    newDate.setFullYear(Number.parseInt(date.split('-')[0]), Number.parseInt(date.split('-')[1]) - 1, Number.parseInt(date.split('-')[2]))
    return newDate
}

/** @param {NASA.NasaMars.WeatherResult} data @param {NASA.NasaMars.WeeklyImagesResult} weeklyImage */
function getEmbedMars(data, weeklyImage) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#fd875f')
        .setAuthor({ name: 'Jezero Kráter', url: 'https://mars.nasa.gov/mars2020/weather/', iconURL: 'https://mars.nasa.gov/mars2020/favicon-16x16.png' })

    var averagePressure = 0
    try {
        var text = ""
        if (fs.existsSync(Path.join(CONFIG.paths.base, './pressures.txt'))) {
            text = fs.readFileSync(Path.join(CONFIG.paths.base, './pressures.txt'), 'utf-8')
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
        fs.writeFileSync(Path.join(CONFIG.paths.base, './pressures.txt'), text, 'utf-8')
        var lines = text.split('\n')
        var n = 0
        lines.forEach(line => {
            if (line.length > 0) {
                averagePressure += Number.parseFloat(line.split(' ')[1])
                n += 1
            }
        })
        averagePressure = averagePressure / n        
    } catch (ex) {
        LogError(ex)
    }

    const latestSol = data.sols[data.sols.length - 1]
    
    embed
        .setTitle(`sol ${latestSol.sol}`)
        .setDescription(
            `${EmojiPrefix}🌡️ ${latestSol.min_temp} - ${latestSol.max_temp} °C\n` +
            `${GetMarsPressureIcon(latestSol.pressure, averagePressure)} ${latestSol.pressure} pHa légnyomás\n` +
            `${GetSeason(latestSol.season)}\n` +
            `${EmojiPrefix}🌍 Földi dátum: <t:${Utils.ToUnix(DateToDate(latestSol.terrestrial_date))}:d>` +

            '\n\n☀️ **Nap:**\n\n' +

            `${EmojiPrefix}🌇 Napkelte: ${latestSol.sunrise}\n` +
            `${EmojiPrefix}🌆 Napnyugta: ${latestSol.sunset}\n\n` +

            '🗓️ **Előző sol-ok:**')

    data.sols.forEach(sol => {
        if (latestSol.sol != sol.sol) {
            embed.addFields([{
                name: 'Sol ' + sol.sol,
                value: `${EmojiPrefix}🌡️ ` + sol.min_temp + ' - ' + sol.max_temp + ' C°\n' + 
                    GetSeason(sol.season),
                inline: true
            }])
        }
    })

    embed
        .setTimestamp(DateToDate(latestSol.terrestrial_date))
        .setFooter({ text: 'Mars 2020' })
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

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('weather')
        .setDescription('Időjárása')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Weather location')
                .setRequired(false)
                .addChoices(
                    { name: 'Earth - Békéscsaba', value: 'earth' },
                    { name: 'Mars - Jezero Kráter', value: 'mars' }
                )),
    /** @param {Discord.ChatInputCommandInteraction} command */
    Execute: async function(command, ephemeral, sender) {
        await command.deferReply({ ephemeral })
        const location = command.options.getString('location', false)

        if (!location || location === 'earth') {        
            const year = new Date().getFullYear()
            const month = new Date().getMonth() + 1
            const day = new Date().getDate()
    
            Openweathermap.OpenweathermapWeather()
                .then(openweathermapWeather => {
                    Openweathermap.OpenweathermapPollution()
                        .then(async openweathermapPollution => {
                            const MoonPhases = [
                                new MoonPhase(addDays(new Date(year, month, day), -1)),
                                new MoonPhase(new Date(year, month, day)),
                                new MoonPhase(addDays(new Date(year, month, day), 1)),
                                new MoonPhase(addDays(new Date(year, month, day), 2)),
                                new MoonPhase(addDays(new Date(year, month, day), 3))
                            ]
        
                            /** @type {WeatherAlertsService.MET.ResultCounty[]} */
                            var alerts = []
        
                            try
                            { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'Today')) }
                            catch (e)
                            { alerts.push(null) }
        
                            try
                            { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'Tomorrow')) }
                            catch (e)
                            { alerts.push(null) }
        
                            try
                            { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'ThirdDay')) }
                            catch (e)
                            { alerts.push(null) }
        
                            try
                            { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'FourthDay')) }
                            catch (e)
                            { alerts.push(null) }
        
                            const embed = getEmbedEarth(openweathermapWeather, MoonPhases, openweathermapPollution.list[0], alerts, false, openweathermapWeather.fromCache, await WeatherAlertsService.GetSnowReport())
                            command.editReply({ embeds: [embed] })
                        })
                        .catch(openweathermapPollutionError => {
                            LogError(openweathermapPollutionError)
                            command.editReply({ content: '> \\❌ ' + openweathermapPollutionError })
                        })
                })
                .catch(openweathermapWeatherError => {
                    LogError(openweathermapWeatherError)
                    command.editReply({ content: '> \\❌ ' + openweathermapWeatherError })
                })
            return
        }
        
        if (location === 'mars') {
            NASA.NasaMarsWeather()
                .then(weatherData => {
                    NASA.NasaMarsWeeklyImage()
                        .then(bodyImage => {
                            command.editReply({ embeds: [ getEmbedMars(weatherData, bodyImage)] })
                        })
                        .catch(error => {
                            LogError(error)
                            command.editReply({ content: '> \\❗ ' + error })
                        })
                })
                .catch(error => {
                    LogError(error)
                    command.editReply({ content: '> \\❗ ' + error })
                })

            return
        }
        
        await command.reply({ content: '> \\❌ **Nem tudok ilyen helyről <:wojakNoBrain:985043138471149588>**', ephemeral })
    }
}

module.exports = {
    ...Command,
}