const { StatesManager } = require('./statesManager')
const { Client, BaseGuildTextChannel } = require('discord.js')
const CommandDailyWeatherReport = require('../commands/dailyWeatherReport')
const endOfMorning = 10

const IsMorning = () => { return (new Date(Date.now()).getHours() < endOfMorning) }

/** @param {StatesManager} statesManager @param {BaseGuildTextChannel} channel */
async function GetOldDailyWeatherReport(statesManager, channel) {

    statesManager.dailyWeatherReportLoadingText = 'Search old weather report message (Fetch old messages)...'
    const messages = await channel.messages.fetch({ limit: 10 })

    statesManager.dailyWeatherReportLoadingText = 'Search old weather report message (Loop messages)...'
    messages.forEach(message => {
        if (message.embeds.length == 1) {
            if (message.embeds[0].title == 'Napi időjárás jelentés') {
                statesManager.dailyWeatherReportLoadingText = 'Old report message found'
                return message
            }
        }        
    })

    statesManager.dailyWeatherReportLoadingText = 'No messages found'
    return null
}

/** @param {StatesManager} statesManager @param {Client} client @param {string} channelID */
async function TrySendWeatherReport(statesManager, client, channelID) {  

    statesManager.dailyWeatherReportLoadingText = 'Fetch news channel...'
    const channel = await client.channels.fetch(channelID)

    statesManager.dailyWeatherReportLoadingText = 'Search old weather report message...'
    const oldWeatherMessage = await GetOldDailyWeatherReport(statesManager, channel)

    if (oldWeatherMessage == null || oldWeatherMessage == undefined) {
        if (IsMorning()) {
            CommandDailyWeatherReport(channel, statesManager)
        } else {
            statesManager.dailyWeatherReportLoadingText = 'I will not send a report because it is not morning now'
        }
    } else {
        if (new Date(oldWeatherMessage.createdTimestamp).getDate() != new Date(Date.now()).getDate() && IsMorning()) {
            statesManager.dailyWeatherReportLoadingText = 'Delete old weather report message...'
            await oldWeatherMessage.delete()
            CommandDailyWeatherReport(channel, statesManager)
        } else {
            statesManager.dailyWeatherReportLoadingText = ''
        }
    }
}

module.exports = { TrySendWeatherReport }