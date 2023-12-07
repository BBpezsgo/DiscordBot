const { StatesManager } = require('./statesManager')
const { Client } = require('discord.js')
const SendTest = false
const LogError = require('./errorLog').LogError

const Discord = require('discord.js')
const SunCalc = require('suncalc')
const Openweathermap = require('../services/Openweathermap')
const Met = require('../services/weatherMet')

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

const { Color } = require('./enums')
const { ToUnix, Average } = require('./utils')

const IsMorning = () => { return (new Date(Date.now()).getHours() < 10) }

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
        time: Average(weatherData.city.sunrise, ToUnix(times.sunrise)),
        title: `<t:${Average(weatherData.city.sunrise, ToUnix(times.sunrise))}:t> - <t:${ToUnix(times.sunriseEnd)}:t> ${EmojiPrefix}🌇 Napkelte`,
        description: '\u200b'
    })
    fields.push({
        time: ToUnix(times.solarNoon),
        title: `<t:${ToUnix(times.solarNoon)}:t> ${EmojiPrefix}🌞 Dél`,
        description: '\u200b'
    })
    fields.push({
        time: Average(weatherData.city.sunset, ToUnix(times.sunset)),
        title: `<t:${ToUnix(times.sunsetStart)}:t> - <t:${Average(weatherData.city.sunset, ToUnix(times.sunset))}:t> ${EmojiPrefix}🌆 Napnyugta`,
        description: '\u200b'
    })
    fields.push({
        time: ToUnix(times.dusk),
        title: `<t:${ToUnix(times.dusk)}:t> ${EmojiPrefix}🌆 Szürkület`,
        description: '\u200b'
    })

    embed.setTitle(`Napi időjárás jelentés`)

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
            title: `<t:${ToUnix(new Date(currentWeatherItem.dt * 1000))}:t>` + ` ${EmojiPrefix}${weatherSkytextIcon(currentWeatherItem.weather[0].main)} ${weatherSkytxt(currentWeatherItem.weather[0].main)}`,
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

    embed.setTimestamp(Date.now())
    if (isCache) {
        embed.setFooter({ text: '📁 openweathermap.org' })
    } else {
        embed.setFooter({ text: 'openweathermap.org' })
    }
    return embed
}

/**
 * @param {{alerts:Met.MET.ResultCounty,day:'today'|'tomorrow'}[]} alerts
 * @returns {Discord.EmbedBuilder}
 */
function GetAlertEmbed(alerts) {
    if (alerts.length <= 0) { return null }

    const embed = new Discord.EmbedBuilder()
        .setColor('#00AE86')
        .setAuthor({ name: 'met.hu', url: 'https://met.hu/idojaras/veszelyjelzes/', iconURL: 'https://met.hu/android-chrome-96x96.png' })
        .setTitle('Vészjelzések')

    for (const day of alerts) {
        if (day.alerts.alerts.length <= 0)
        { continue }

        const dayName = {
            'today': 'Ma',
            'tomorrow': 'Holnap',
        }[day.day] ?? day.day

        let stringBuilder = ''
        
        stringBuilder += `> **Kiadva:** <t:${ToUnix(day.alerts.kiadva)}:R>\n`

        for (const alert of day.alerts.alerts) {
            const typeIcon = {
                'ts1.gif': '🌩️',
                'ts2.gif': '🌩️',
                'ts3.gif': '🌩️',

                'rainstorm1.gif': '🌧️',
                'rainstorm2.gif': '🌊',
                'rainstorm3.gif': '🌊',

                'hotx1.gif': '🌡️',
                'hotx2.gif': '🔥',
                'hotx3.gif': '🔥',
                
                'wind1.gif': '💨',
                'wind2.gif': '🌪️',
                'wind3.gif': '🌪️',
                
                'fzra1.gif': '🧊',
                'fzra2.gif': '🧊',
                'fzra3.gif': '🧊',
                
                'snowdrift1.gif': '☃️',
                'snowdrift2.gif': '☃️',
                'snowdrift3.gif': '☃️',
                
                'rain1.gif': '🌧️',
                'rain2.gif': '🌧️',
                'rain3.gif': '🌧️',
                
                'snow1.gif': '🌨️',
                'snow2.gif': '🌨️',
                'snow3.gif': '🌨️',
                
                'fog1.gif': '🌫️',
                'fog2.gif': '🌫️',
                'fog3.gif': '🌫️',
                
                'coldx1.gif': '❄️',
                'coldx2.gif': '❄️',
                'coldx3.gif': '❄️',
            }[alert.typeIcon] ?? alert.typeIcon
                
            const degreeIcon = {
                'w1.gif': '1',
                'w2.gif': '2',
                'w3.gif': '3',
            }[alert.degreeIcon] ?? alert.degreeIcon

            const description = Met.Descriptions[alert.typeIcon]?.description

            stringBuilder += `> ${typeIcon} \`${alert.Name} ${degreeIcon}\` - ${description}\n`
        }
        embed.addFields({
            name: dayName,
            value: stringBuilder,
            inline: false
        })
    }

    embed.setTimestamp(Date.now())
    
    return embed
}

/**
 * @param {Discord.TextBasedChannel} channel
 * @param {StatesManager} statesManager
 */
async function SendReport(channel, statesManager) {
    statesManager.WeatherReport.Text = 'Send loading message...'

    const loadingEmbed = new Discord.EmbedBuilder()
        .setColor(Color.Highlight)
        .setAuthor({ name: 'Békéscsaba', url: 'https://openweathermap.org/city/' + CityBekescsaba.ID, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })
        .setTitle('Napi időjárás jelentés betöltése...')

    const loadingMessage = await channel.send({ embeds: [loadingEmbed] })

    statesManager.WeatherReport.Text = 'Get weather data...'
    Openweathermap.OpenweathermapForecast()
        .then(async result => {
            /** @type {{alerts:Met.MET.ResultCounty,day:'today'|'tomorrow'}[]} */
            const alerts = [ ]

            try { alerts.push({
                alerts: await Met.GetCountyAlerts('Bekes', 'Today'),
                day: 'today',
            }) }
            catch (error) { }

            try { alerts.push({
                alerts: await Met.GetCountyAlerts('Bekes', 'Tomorrow'),
                day: 'tomorrow',
            }) }
            catch (error) { }

            const embed = GetEmbed(result, result.fromCache)
            const alertEmbed = GetAlertEmbed(alerts)
            statesManager.WeatherReport.Text = 'Delete loading message...'
            await loadingMessage.delete()
            statesManager.WeatherReport.Text = 'Send report message...'
            if (alertEmbed) {
                await channel.send({ content: '<@&978665941753806888>', embeds: [ embed, alertEmbed ] })
            } else {
                await channel.send({ content: '<@&978665941753806888>', embeds: [ embed ] })
            }
            statesManager.WeatherReport.Text = ''
        })
        .catch(async error => {
            LogError(error)
            statesManager.WeatherReport.Text = 'Get weather is failed!'
            await loadingMessage.edit({ content: '> \\❗ ' + error })
        })
}

/** @param {StatesManager} statesManager @param {Discord.TextBasedChannel} channel */
async function GetOldDailyWeatherReport(statesManager, channel) {

    statesManager.WeatherReport.Text = 'Search old weather report message (Fetch old messages)...'
    const messages = await channel.messages.fetch({ limit: 20 })

    statesManager.WeatherReport.Text = 'Search old weather report message (Loop messages)...'
    for (let i = 0; i < messages.size; i++) {
        statesManager.WeatherReport.Text = `Search old weather report message (Loop messages ${i}/${messages.size})...`
        const msg = messages.at(i)
        try {
            const message = await msg.fetch()
            if (message.embeds.length > 0) {
                if (message.embeds[0].title == 'Napi időjárás jelentés') {
                    statesManager.WeatherReport.Text = 'Old report message found'
                    return message
                }
            }
        } catch (error) {
            LogError(error, { key: 'MessageID', value: msg.id }, { key: 'ChannelID', value: channel.id })
        }
    }

    statesManager.WeatherReport.Text = 'No messages found'
    return null
}

/** @param {StatesManager} statesManager @param {Client} client @param {string} channelID */
async function TrySendWeatherReport(statesManager, client, channelID) {
    statesManager.WeatherReport.Text = 'Fetch news channel...'
    /** @ts-ignore @type {Discord.TextBasedChannel} */
    const channel = await client.channels.fetch(channelID)
    /** @ts-ignore @type {Discord.TextBasedChannel} */
    const testChannel = await client.channels.fetch('760804414205591585')

    statesManager.WeatherReport.Text = 'Search old weather report message...'
    const oldWeatherMessage = await GetOldDailyWeatherReport(statesManager, channel)

    if (oldWeatherMessage == null || oldWeatherMessage == undefined) {
        if (IsMorning()) {
            await SendReport(channel, statesManager)
        } else {
            if (SendTest) await SendReport(testChannel, statesManager)
            statesManager.WeatherReport.Text = 'I will not send a report because it is not morning now'
        }
    } else {
        if (new Date(oldWeatherMessage.createdTimestamp).getDate() != new Date(Date.now()).getDate()) {
            statesManager.WeatherReport.Text = 'Delete old weather report message...'
            await oldWeatherMessage.delete()
            if (IsMorning()) {
                await SendReport(channel, statesManager)
            } else {
                if (SendTest) await SendReport(testChannel, statesManager)
                statesManager.WeatherReport.Text = 'I don\'t need to send a new report'
            }
        } else {
            if (SendTest) await SendReport(testChannel, statesManager)
            statesManager.WeatherReport.Text = 'I don\'t need to send a new report'
        }
    }
}

module.exports = { TrySendWeatherReport }