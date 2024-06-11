const { StatesManager } = require('./statesManager')
const { Client } = require('discord.js')
const SendTest = true

const Discord = require('discord.js')
const MVM = require('../services/mvm')
const LogError = require('./errorLog').LogError
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')
const roadsInInterest = require(Path.join(CONFIG.paths.base, './mvm-roads-in-interest.json'))
const { FormatError } = require('./formatError')

const icon = 'https://media.glassdoor.com/sqll/1303067/mvm-group-squarelogo-1636624757422.png'

/** @param {MVM.Result[]} data */
function HasInterestingData(data) {
    for (let i = 0; i < data.length; i++) {
        if (IsInterestingData(data[i])) {
            return true
        }
    }
    return false
}
/** @param {MVM.Result} data */
function IsInterestingData(data) {
    const road = data.road.toLowerCase().trim()
    for (let i = 0; i < roadsInInterest.length; i++) {
        const element = roadsInInterest[i].trim().toLowerCase()
        if (element.includes(road)) {
            return true
        }
    }
    return false
}

/**
 * @param {MVM.Result[]} data
 * @param {boolean} isCache
 * @returns {Discord.EmbedBuilder}
 */
function GetEmbed(data, isCache) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#FFC658')
        .setAuthor({ name: 'Békéscsaba', url: 'https://www.mvmnext.hu/aram/pages/online/aramszunet.jsf', iconURL: icon })
        .setTitle(`Tervezett áramszünetek`)

    for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (IsInterestingData(element) !== true) { continue }
        embed.addFields([{
            name: element.road,
            value: `${element.houses}\n${element.time}`
        }])
    }

    if (isCache) {
        embed.setFooter({ text: '📁 www.mvmnext.hu' })
    } else {
        embed.setFooter({ text: 'www.mvmnext.hu' })
    }
    return embed
}

/** @param {StatesManager} statesManager @param {import('discord.js').TextBasedChannel} channel */
async function GetOldReport(statesManager, channel) {
    statesManager.MVMReport.Text = 'Search old MVM report message (Fetch old messages)...'
    const messages = await channel.messages.fetch({ limit: 20 })

    statesManager.MVMReport.Text = 'Search old MVM report message (Loop messages)...'
    for (let i = 0; i < messages.size; i++) {
        statesManager.MVMReport.Text = `Search old MVM report message (Loop messages ${i}/${messages.size})...`
        const msg = messages.at(i)
        if (!msg) { continue }
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

/**
 * @param {Discord.TextBasedChannel} channel
 * @param {StatesManager} statesManager
 */
async function SendReport(channel, statesManager) {
    statesManager.MVMReport.Text = 'Get MVM data...'
    MVM.Get(statesManager)
        .then(async data => {
            if (HasInterestingData(data)) {
                statesManager.MVMReport.Text = 'Send report message...'
                await channel.send({ content: '<@&1055067472123940944>', embeds: [GetEmbed(data, false)] })
                statesManager.MVMReport.Text = ''
            } else {
                statesManager.MVMReport.Text = ''
            }
        })
        .catch(async error => {
            LogError(error)
            statesManager.MVMReport.Text = 'Get MVM data is fault!'

            const errorEmbed = new Discord.EmbedBuilder()
                .setColor('#FFC658')
                .setAuthor({ name: 'Békéscsaba', url: 'https://www.mvmnext.hu/aram/pages/online/aramszunet.jsf', iconURL: icon })
                .setTitle('Tervezett áramszünetek betöltése sikertelen')
                .setDescription('> \\❗ ' + FormatError(error))
        
            await channel.send({ embeds: [ errorEmbed ] })
        })
}

/** @param {StatesManager} statesManager @param {Client} client @param {string} channelID */
async function TrySendMVMReport(statesManager, client, channelID) {
    if (SendTest) {
        statesManager.WeatherReport.Text = 'Fetch test channel...'
        /** @ts-ignore @type {Discord.TextBasedChannel} */
        const testChannel = await client.channels.fetch('760804414205591585')
        await SendReport(testChannel, statesManager)
        return
    }

    statesManager.WeatherReport.Text = 'Fetch news channel...'
    /** @ts-ignore @type {Discord.TextBasedChannel} */
    const channel = await client.channels.fetch(channelID)

    statesManager.MVMReport.Text = 'Search old MVM report message...'
    const oldReport = await GetOldReport(statesManager, channel)

    if (!oldReport) {
        await SendReport(channel, statesManager)
    } else {
        if (new Date(oldReport.createdTimestamp).getDate() != new Date(Date.now()).getDate()) {
            statesManager.MVMReport.Text = 'Delete old MVM report message...'
            await oldReport.delete()
            await SendReport(channel, statesManager)
        }
    }

    statesManager.MVMReport.Text = ''
}

module.exports = { TrySendMVMReport }