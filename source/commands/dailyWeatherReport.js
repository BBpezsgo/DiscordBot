const Discord = require('discord.js')
const fs = require('fs')
const request = require("request");
const { openweatherToken } = require('../config.json')
const { StatesManager } = require('../functions/statesManager')

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
    weatherSkytxt,
    weatherWindIcon,
    weatherTempIcon,
    weatherHumidityIcon,
    DirectionToArrow,
    unixToTime,
    weatherSkytextIcon,
    bekescsabaId
} = require('../commands/weatherFunctions')

const { Color } = require('../functions/enums')

/**
 * @param {any} weatherData
 * @returns {Discord.MessageEmbed}
 */
function getEmbedEarth(weatherData) {
    const embed = new Discord.MessageEmbed()
        .setColor(Color.Highlight)
        .setAuthor({ name: weatherData.city.name, url: 'https://openweathermap.org/city/' + weatherData.city.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    embed
        .setTitle(`Napi időjárás jelentés`)

    for (let i = 0; i < 5; i++) {
        const currentWeatherItem = weatherData.list[i]

        var stringBuilder = ''

        stringBuilder += `${weatherTempIcon(currentWeatherItem.main.temp)} ${currentWeatherItem.main.temp} C°\n`
        stringBuilder += `${weatherHumidityIcon(currentWeatherItem.main.humidity)} ${currentWeatherItem.main.humidity}% páratartalom\n`
        stringBuilder += `\\☁️ ${currentWeatherItem.clouds.all} %\n`
        stringBuilder += `${DirectionToArrow(currentWeatherItem.wind.deg)} ${weatherWindIcon(currentWeatherItem.wind.speed)} ${currentWeatherItem.wind.speed} km/h szél\n`
        stringBuilder += `\\🌬️ ${currentWeatherItem.wind.gust} km/h széllökés\n`
        if (currentWeatherItem.visibility != 10000) {
            stringBuilder += `\\👁️ ${currentWeatherItem.visibility / 1000} km látótávolság\n`
        }
        if (currentWeatherItem.pop != 0) {
            stringBuilder += `\\☔ ${currentWeatherItem.pop * 100} % csapadék\n`
        }
        if (currentWeatherItem.rain != undefined) {
            stringBuilder += `\\🌊 ${currentWeatherItem.rain['3h']} mm eső\n`
        }
        if (currentWeatherItem.snow != undefined) {
            stringBuilder += `\\⛄ ${currentWeatherItem.snow['3h']} mm hó\n`
        }

        embed.addField(unixToTime(currentWeatherItem.dt) + ` ${weatherSkytextIcon(currentWeatherItem.weather[0].main, true)} ${weatherSkytxt(currentWeatherItem.weather[0].main)}`, stringBuilder.trimEnd(), false)
    }

    embed
        .setTimestamp(Date.now())
        .setFooter({ text: '• openweathermap.org • ⚠️ Tesztverzió', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/information_2139-fe0f.png' })
    return embed
}

/** @param {Discord.TextChannel} channel @param {StatesManager} statesManager */
module.exports = async (channel, statesManager) => {
    statesManager.dailyWeatherReportLoadingText = 'Send loading message...'

    const loadingEmbed = new Discord.MessageEmbed()
        .setColor(Color.Highlight)
        .setAuthor({ name: 'Békéscsaba', url: 'https://openweathermap.org/city/' + bekescsabaId, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })
        .setTitle('Napi időjárás jelentés betöltése...')

    const loadingMessage = await channel.send({ embeds: [loadingEmbed] })

    const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=46.678889&lon=21.090833&appid=' + openweatherToken + '&cnt=24&units=metric'

    statesManager.dailyWeatherReportLoadingText = 'Get weather data...'
    request(url, async function (err, res, body) {
        if (err) {
            statesManager.dailyWeatherReportLoadingText = 'Get weather is fault!'
            await loadingMessage.edit({ content: '> \\❌ **OpenWeatherMap Error:** ' + err.toString })
        } else {
            statesManager.dailyWeatherReportLoadingText = 'Parse weather data...'
            const weather = JSON.parse(body) // JSON.parse(fs.readFileSync('C:/Users/bazsi/Desktop/forecast.json'))
            const embed = getEmbedEarth(weather)

            statesManager.dailyWeatherReportLoadingText = 'Delete loading message...'
            await loadingMessage.delete()
            statesManager.dailyWeatherReportLoadingText = 'Send report message...'
            await channel.send({ content: '<@&978665941753806888>', embeds: [embed] })
            statesManager.dailyWeatherReportLoadingText = ''
        }
    })
}
