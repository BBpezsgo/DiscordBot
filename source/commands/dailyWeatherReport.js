const Discord = require('discord.js')
const request = require("request");
const { tokens } = require('../config.json')
const { StatesManager } = require('../functions/statesManager')
const SunCalc = require('suncalc')
const WeatherServices = require('./weatherServices')
const LogError = require('../functions/errorLog')

const EmojiPrefix = ''

const {
    weatherSkytxt,
    weatherWindIcon,
    weatherTempIcon,
    weatherHumidityIcon,
    DirectionToArrow,
    unixToTime,
    weatherSkytextIcon,
    CityBekescsaba
} = require('../commands/weatherFunctions')

const { Color } = require('../functions/enums')

const ToUnix=(date)=>{return Math.round(date.getTime()/1000)}
const AverageUnix=(unix1,unix2)=>{return Math.round((unix1+unix2)/2)}

/**
 * @param {any} weatherData
 * @returns {Discord.EmbedBuilder}
 */
function GetEmbed(weatherData) {
    const embed = new Discord.EmbedBuilder()
        .setColor(Color.Highlight)
        .setAuthor({ name: weatherData.city.name, url: 'https://openweathermap.org/city/' + weatherData.city.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    const times = SunCalc.getTimes(new Date(Date.now()), 46.677227, 21.089993)

    embed
        .setTitle(`Napi időjárás jelentés`)
        .setDescription(
            `${EmojiPrefix}🌇 Hajnal: <t:${ToUnix(times.dawn)}:R>\n` +
            `${EmojiPrefix}🌇 Napkelte: <t:${AverageUnix(weatherData.city.sunrise, ToUnix(times.sunrise))}:R>\n` +
            `${EmojiPrefix}🌞 Dél: <t:${ToUnix(times.solarNoon)}:R>\n` +
            `${EmojiPrefix}🌆 Napnyugta: <t:${AverageUnix(weatherData.city.sunset, ToUnix(times.sunset))}:R>\n` +
            `${EmojiPrefix}🌆 Szürkület: <t:${ToUnix(times.dusk)}:R>`
            )

    for (let i = 0; i < 5; i++) {
        const currentWeatherItem = weatherData.list[i]

        var stringBuilder = ''

        stringBuilder += `${EmojiPrefix}${weatherTempIcon(currentWeatherItem.main.temp)} ${currentWeatherItem.main.temp} C°\n`
        stringBuilder += `${EmojiPrefix}${weatherHumidityIcon(currentWeatherItem.main.humidity)} ${currentWeatherItem.main.humidity}% páratartalom\n`
        stringBuilder += `${EmojiPrefix}☁️ ${currentWeatherItem.clouds.all} %\n`
        stringBuilder += `${DirectionToArrow(currentWeatherItem.wind.deg)} ${EmojiPrefix}${weatherWindIcon(currentWeatherItem.wind.speed)} ${currentWeatherItem.wind.speed} km/h szél\n`
        stringBuilder += `${EmojiPrefix}🌬️ ${currentWeatherItem.wind.gust} km/h széllökés\n`
        if (currentWeatherItem.visibility != 10000) {
            stringBuilder += `${EmojiPrefix}👁️ ${currentWeatherItem.visibility / 1000} km látótávolság\n`
        }
        if (currentWeatherItem.pop != 0) {
            stringBuilder += `${EmojiPrefix}☔ ${currentWeatherItem.pop * 100} % csapadék\n`
        }
        if (currentWeatherItem.rain != undefined) {
            stringBuilder += `${EmojiPrefix}🌊 ${currentWeatherItem.rain['3h']} mm eső\n`
        }
        if (currentWeatherItem.snow != undefined) {
            stringBuilder += `${EmojiPrefix}⛄ ${currentWeatherItem.snow['3h']} mm hó\n`
        }

        embed.addFields([{
            name: unixToTime(currentWeatherItem.dt) + ` ${EmojiPrefix}${weatherSkytextIcon(currentWeatherItem.weather[0].main, true)} ${weatherSkytxt(currentWeatherItem.weather[0].main)}`,
            value: stringBuilder.trimEnd(),
            inline: false
        }])
        embed.setThumbnail('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/earth.gif')
    }

    embed
        .setTimestamp(Date.now())
        .setFooter({ text: '• openweathermap.org', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/information_2139-fe0f.png' })
    return embed
}

/** @param {Discord.TextChannel} channel @param {StatesManager} statesManager */
module.exports = async (channel, statesManager, isTest = false) => {
    statesManager.WeatherReport.Text = 'Send loading message...'

    const loadingEmbed = new Discord.EmbedBuilder()
        .setColor(Color.Highlight)
        .setAuthor({ name: 'Békéscsaba', url: 'https://openweathermap.org/city/' + CityBekescsaba.ID, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })
        .setTitle('Napi időjárás jelentés betöltése...')

    const loadingMessage = await channel.send({ embeds: [loadingEmbed] })

    statesManager.WeatherReport.Text = 'Get weather data...'
    WeatherServices.OpenweathermapForecast(async (result, error) => {
        if (error) {
            LogError(error)
            statesManager.WeatherReport.Text = 'Get weather is fault!'
            await loadingMessage.edit({ content: '> \\❌ ' + error })
            return
        }

        const embed = GetEmbed(result)

        statesManager.WeatherReport.Text = 'Delete loading message...'
        await loadingMessage.delete()
        statesManager.WeatherReport.Text = 'Send report message...'
        await channel.send({ content: '<@&978665941753806888>', embeds: [embed] })
        statesManager.WeatherReport.Text = ''
    })
}
