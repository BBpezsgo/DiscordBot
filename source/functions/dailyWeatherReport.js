const { StatesManager } = require('./statesManager')
const { Client, BaseGuildTextChannel } = require('discord.js')
const endOfMorning = 10
const SendTest = false

const IsMorning = () => { return (new Date(Date.now()).getHours() < endOfMorning) }

/** @param {StatesManager} statesManager @param {BaseGuildTextChannel} channel */
async function GetOldDailyWeatherReport(statesManager, channel) {

    statesManager.WeatherReport.Text = 'Search old weather report message (Fetch old messages)...'
    const messages = await channel.messages.fetch({ limit: 20 })

    statesManager.WeatherReport.Text = 'Search old weather report message (Loop messages)...'
    for (let i = 0; i < messages.size; i++) {
        statesManager.WeatherReport.Text = `Search old weather report message (Loop messages ${i}/${messages.size})...`
        const msg = messages.at(i)
        const message = await msg.fetch()
        if (message.embeds.length == 1) {
            if (message.embeds[0].title == 'Napi időjárás jelentés') {
                statesManager.WeatherReport.Text = 'Old report message found'
                return message
            }
        }
    }

    statesManager.WeatherReport.Text = 'No messages found'
    return null
}

/** @param {StatesManager} statesManager @param {Client} client @param {string} channelID */
async function TrySendWeatherReport(statesManager, client, channelID) {  
    statesManager.WeatherReport.Text = 'Loading packages...'
    const CommandDailyWeatherReport = require('../commands/dailyWeatherReport')

    statesManager.WeatherReport.Text = 'Fetch news channel...'
    const channel = await client.channels.fetch(channelID)
    const testChannel = await client.channels.fetch('760804414205591585')

    statesManager.WeatherReport.Text = 'Search old weather report message...'
    const oldWeatherMessage = await GetOldDailyWeatherReport(statesManager, channel)

    if (oldWeatherMessage == null || oldWeatherMessage == undefined) {
        if (IsMorning()) {
            await CommandDailyWeatherReport(channel, statesManager, false)
        } else {
            if (SendTest) {
                await CommandDailyWeatherReport(testChannel, statesManager, true)
            }
            statesManager.WeatherReport.Text = 'I will not send a report because it is not morning now'
        }
    } else {
        if (new Date(oldWeatherMessage.createdTimestamp).getDate() != new Date(Date.now()).getDate()) {
            statesManager.WeatherReport.Text = 'Delete old weather report message...'
            await oldWeatherMessage.delete()
            if (IsMorning()) {
                await CommandDailyWeatherReport(channel, statesManager, false)
            } else {
                if (SendTest) {
                    await CommandDailyWeatherReport(testChannel, statesManager, true)
                }
                statesManager.WeatherReport.Text = 'I don\'t need to send a new report'
            }
        } else {
            if (SendTest) {
                await CommandDailyWeatherReport(testChannel, statesManager, true)
            }
            statesManager.WeatherReport.Text = 'I don\'t need to send a new report'
        }
    }
}

module.exports = { TrySendWeatherReport }