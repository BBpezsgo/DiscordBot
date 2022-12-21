const { StatesManager } = require('./statesManager')
const { Client, BaseGuildTextChannel } = require('discord.js')
const SendTest = true
const LogError = require('./errorLog')

/** @param {StatesManager} statesManager @param {BaseGuildTextChannel} channel */
async function GetOldReport(statesManager, channel) {
    statesManager.MVMReport.Text = 'Search old MVM report message (Fetch old messages)...'
    const messages = await channel.messages.fetch({ limit: 20 })

    statesManager.MVMReport.Text = 'Search old MVM report message (Loop messages)...'
    for (let i = 0; i < messages.size; i++) {
        statesManager.MVMReport.Text = `Search old MVM report message (Loop messages ${i}/${messages.size})...`
        const msg = messages.at(i)
        const message = await msg.fetch()
        if (message.embeds.length == 1) {
            if (message.embeds[0].title == 'Tervezett áramszünetek') {
                statesManager.MVMReport.Text = 'Old report message found'
                return message
            }
        }
    }

    statesManager.MVMReport.Text = 'No messages found'
    return null
}

/** @param {StatesManager} statesManager @param {Client} client @param {string} channelID */
async function TrySendMVMReport(statesManager, client, channelID) {
    statesManager.MVMReport.Text = 'Loading packages...'
    const SendReport = require('../commands/dailyElectricityReport')

    if (SendTest) {
        statesManager.WeatherReport.Text = 'Fetch test channel...'
        const testChannel = await client.channels.fetch('760804414205591585')
        await SendReport(testChannel, statesManager)
        return
    }

    statesManager.WeatherReport.Text = 'Fetch news channel...'
    const channel = await client.channels.fetch(channelID)

    statesManager.MVMReport.Text = 'Search old MVM report message...'
    const oldReport = await GetOldReport(statesManager, channel)

    if (oldReport === null || oldReport === undefined) {
        if (new Date(oldReport.createdTimestamp).getDate() != new Date(Date.now()).getDate()) {
            await SendReport(channel, statesManager)
        }
    } else {
        statesManager.MVMReport.Text = 'Delete old MVM report message...'
        await oldReport.delete()
        await SendReport(channel, statesManager)
    }

    statesManager.MVMReport.Text = ''
}

module.exports = { TrySendMVMReport }