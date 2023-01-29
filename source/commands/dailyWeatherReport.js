const Discord = require('discord.js')
const { StatesManager } = require('../functions/statesManager')
const SunCalc = require('suncalc')
const Openweathermap = require('../services/Openweathermap')
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
 * @param {Openweathermap.OpenWeatherMap.Forecast} weatherData
 * @param {boolean} isCache
 * @returns {Discord.EmbedBuilder}
 */
function GetEmbed(weatherData, isCache) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#00AE86')
        .setAuthor({ name: weatherData.city.name, url: 'https://openweathermap.org/city/' + weatherData.city.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    const times = SunCalc.getTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)
    const moonTimes = SunCalc.getMoonTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)

    const fields = []

    if (moonTimes.rise) {
        fields.push({
            time: ToUnix(moonTimes.rise),
            title: `<t:${ToUnix(moonTimes.rise)}:t> ${EmojiPrefix}🌙 Holdkelte`,
            description: '\u200b'
        })
    }
    if (moonTimes.set) {
        fields.push({
            time: ToUnix(moonTimes.set),
            title: `<t:${ToUnix(moonTimes.set)}:t> ${EmojiPrefix}🌙 Holdnyugta`,
            description: '\u200b'
        })
    }

    fields.push({
        time: ToUnix(times.dawn),
        title: `<t:${ToUnix(times.dawn)}:t> ${EmojiPrefix}🌇 Hajnal`,
        description: '\u200b'
    })
    fields.push({
        time: AverageUnix(weatherData.city.sunrise, ToUnix(times.sunrise)),
        title: `<t:${AverageUnix(weatherData.city.sunrise, ToUnix(times.sunrise))}:t> - <t:${ToUnix(times.sunriseEnd)}:t> ${EmojiPrefix}🌇 Napkelte`,
        description: '\u200b'
    })
    fields.push({
        time: ToUnix(times.solarNoon),
        title: `<t:${ToUnix(times.solarNoon)}:t> ${EmojiPrefix}🌞 Dél`,
        description: '\u200b'
    })
    fields.push({
        time: AverageUnix(weatherData.city.sunset, ToUnix(times.sunset)),
        title: `<t:${ToUnix(times.sunsetStart)}:t> - <t:${AverageUnix(weatherData.city.sunset, ToUnix(times.sunset))}:t> ${EmojiPrefix}🌆 Napnyugta`,
        description: '\u200b'
    })
    fields.push({
        time: ToUnix(times.dusk),
        title: `<t:${ToUnix(times.dusk)}:t> ${EmojiPrefix}🌆 Szürkület`,
        description: '\u200b'
    })

    embed.setTitle(`Napi időjárás jelentés`)
        /*.setDescription(
            `${EmojiPrefix}🌇 Hajnal: <t:${ToUnix(times.dawn)}:t>\n` +
            `${EmojiPrefix}🌇 Napkelte: <t:${AverageUnix(weatherData.city.sunrise, ToUnix(times.sunrise))}:t>\n` +
            `${EmojiPrefix}🌞 Dél: <t:${ToUnix(times.solarNoon)}:t>\n` +
            `${EmojiPrefix}🌆 Napnyugta: <t:${AverageUnix(weatherData.city.sunset, ToUnix(times.sunset))}:t>\n` +
            `${EmojiPrefix}🌆 Szürkület: <t:${ToUnix(times.dusk)}:t>`
            )*/

    for (let i = 0; i < 5; i++) {
        const currentWeatherItem = weatherData.list[i]

        var stringBuilder = ''

        stringBuilder += `${EmojiPrefix}${weatherTempIcon(currentWeatherItem.main.temp)} ${currentWeatherItem.main.temp} C°\n`
        stringBuilder += `${EmojiPrefix}${weatherHumidityIcon(currentWeatherItem.main.humidity)} ${currentWeatherItem.main.humidity}% páratartalom\n`
        stringBuilder += `${EmojiPrefix}☁️ ${currentWeatherItem.clouds.all} % felhősség\n`
        stringBuilder += `${DirectionToArrow(currentWeatherItem.wind.deg)} ${EmojiPrefix}${weatherWindIcon(currentWeatherItem.wind.speed)} ${currentWeatherItem.wind.speed} km/h szél\n`
        stringBuilder += `${EmojiPrefix}🌬️ ${currentWeatherItem.wind.gust} km/h széllökés\n`
        if (currentWeatherItem.visibility != 10000) {
            if (currentWeatherItem.visibility < 1000) {
                stringBuilder += `${EmojiPrefix}👁️ ${currentWeatherItem.visibility} m látótávolság\n`
            } else {
                stringBuilder += `${EmojiPrefix}👁️ ${Math.round(currentWeatherItem.visibility / 1000)} km látótávolság\n`
            }
        }
        if (currentWeatherItem.pop !== 0) {
            stringBuilder += `${EmojiPrefix}☔ ${Math.round(currentWeatherItem.pop * 100)} % csapadék\n`
        }
        if (currentWeatherItem.rain) {
            stringBuilder += `${EmojiPrefix}🌊 ${currentWeatherItem.rain['3h']} mm eső\n`
        }
        if (currentWeatherItem.snow) {
            stringBuilder += `${EmojiPrefix}⛄ ${currentWeatherItem.snow['3h']} mm hó\n`
        }

        fields.push({
            time: ToUnix(new Date(currentWeatherItem.dt * 1000)),
            title: `<t:${ToUnix(new Date(currentWeatherItem.dt * 1000))}:t>` + ` ${EmojiPrefix}${weatherSkytextIcon(currentWeatherItem.weather[0].main, true)} ${weatherSkytxt(currentWeatherItem.weather[0].main)}`,
            description: stringBuilder.trimEnd() + '\n'
        })
    }

    fields.sort((a, b) => a.time - b.time)

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        embed.addFields([{
            name: field.title,
            value: field.description,
            inline: false
        }])
    }

    // embed.setThumbnail('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/earth.gif')
    embed.setTimestamp(Date.now())
    if (isCache) {
        embed.setFooter({ text: '📁 openweathermap.org' })
    } else {
        embed.setFooter({ text: 'openweathermap.org' })
    }
    return embed
}

/** @param {Discord.TextChannel} channel @param {StatesManager} statesManager */
module.exports = async (channel, statesManager) => {
    statesManager.WeatherReport.Text = 'Send loading message...'

    const loadingEmbed = new Discord.EmbedBuilder()
        .setColor(Color.Highlight)
        .setAuthor({ name: 'Békéscsaba', url: 'https://openweathermap.org/city/' + CityBekescsaba.ID, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })
        .setTitle('Napi időjárás jelentés betöltése...')

    const loadingMessage = await channel.send({ embeds: [loadingEmbed] })

    statesManager.WeatherReport.Text = 'Get weather data...'
    Openweathermap.OpenweathermapForecast()
        .then(async result => {
            const embed = GetEmbed(result, result.fromCache)    
            statesManager.WeatherReport.Text = 'Delete loading message...'
            await loadingMessage.delete()
            statesManager.WeatherReport.Text = 'Send report message...'
            await channel.send({ content: '<@&978665941753806888>', embeds: [embed] })
            statesManager.WeatherReport.Text = ''
        })
        .catch(async error => {
            LogError(error)
            statesManager.WeatherReport.Text = 'Get weather is failed!'
            await loadingMessage.edit({ content: '> \\❌ ' + error })
        })
}
