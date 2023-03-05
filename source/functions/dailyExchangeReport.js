const { StatesManager } = require('./statesManager')

const Discord = require('discord.js')
const fs = require('fs')

const LogError = require('./errorLog')
const { FormatError } = require('./formatError')

const Service = require('../services/ExchangeRate')
const icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Logo_European_Central_Bank.svg/64px-Logo_European_Central_Bank.svg.png'

const SendTest = false

const ToUnix=(date)=>{return Math.round(date.getTime()/1000)}

/**
 * @param {Service.Result} data
 * @returns {Discord.EmbedBuilder}
 */
function GetEmbed(data) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#48BF21')
        .setAuthor({ name: data.sender, url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', iconURL: icon })
        .setTitle('Árfolyam')
        .setDescription('💶 Euró árfolyam\nKövetkező frissítés ' + `<t:${ToUnix(Service.GetNextUpdate(new Date(Date.now())))}:R>`)
    
    const currencyInInterest = [
        Service.Currency.HUF,
        Service.Currency.USD,
    ]
    
    for (let i = 0; i < currencyInInterest.length; i++) {
        embed.addFields([{
            name: `${currencyInInterest[i]}`,
            value: `${(data.rates[currencyInInterest[i]] ?? 'null').toString()}`
        }])
    }

    let foother = 'www.ecb.europa.eu'
    if (data.fromCache) embed.setFooter({ text: '📁 ' + foother })
    else embed.setFooter({ text: foother })
    
    return embed
}

/** @param {Discord.TextChannel} channel @param {StatesManager} statesManager */
async function SendReport(channel, statesManager) {
    statesManager.ExchangeReport.Text = 'Get Exchange data...'
    Service.GetCurrency()
        .then(async data => {
            statesManager.ExchangeReport.Text = 'Send report message...'
            await channel.send({ /*content: '<@&1055067472123940944>',*/ embeds: [GetEmbed(data)] })
            statesManager.ExchangeReport.Text = ''
        })
        .catch(async error => {
            LogError(error)
            statesManager.ExchangeReport.Text = 'Get Exchange data is fault!'

            const errorEmbed = new Discord.EmbedBuilder()
                .setColor('#48BF21')
                .setAuthor({ name: 'Error', url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', iconURL: icon })
                .setTitle('Árfolyam betöltése sikertelen')
                .setFooter({ text: 'www.ecb.europa.eu' })
                .setDescription('> \\❌ ' + FormatError(error))
        
            await channel.send({ embeds: [errorEmbed] })
        })
}

/** @param {StatesManager} statesManager @param {Discord.BaseGuildTextChannel} channel */
async function GetOldReport(statesManager, channel) {
    statesManager.ExchangeReport.Text = 'Search old Exchange report message (Fetch old messages)...'
    const messages = await channel.messages.fetch({ limit: 20 })

    statesManager.ExchangeReport.Text = 'Search old Exchange report message (Loop messages)...'
    for (let i = 0; i < messages.size; i++) {
        statesManager.ExchangeReport.Text = `Search old Exchange report message (Loop messages ${i}/${messages.size})...`
        const msg = messages.at(i)
        const message = await msg.fetch()
        if (message.embeds.length == 1) {
            if (message.embeds[0].title == 'Árfolyam') {
                statesManager.ExchangeReport.Text = 'Old report message found'
                return message
            }
        }
    }

    statesManager.ExchangeReport.Text = 'No messages found'
    return null
}

/** @param {StatesManager} statesManager @param {Discord.Client} client @param {string} channelID */
async function TrySendReport(statesManager, client, channelID) {
    if (SendTest) {
        statesManager.WeatherReport.Text = 'Fetch test channel...'
        const testChannel = await client.channels.fetch('760804414205591585')
        await SendReport(testChannel, statesManager)
        return
    }

    statesManager.WeatherReport.Text = 'Fetch news channel...'
    const channel = await client.channels.fetch(channelID)

    statesManager.ExchangeReport.Text = 'Search old Exchange report message...'
    const oldReport = await GetOldReport(statesManager, channel)

    if (oldReport === null || oldReport === undefined) {
        await SendReport(channel, statesManager)
    } else {
        statesManager.ExchangeReport.Text = 'Delete old Exchange report message...'
        await oldReport.delete()
        await SendReport(channel, statesManager)
    }

    statesManager.ExchangeReport.Text = ''
}

module.exports = { TrySendReport }