const Discord = require('discord.js')
const { StatesManager } = require('../functions/statesManager')
const MVM = require('../services/mvm')
const LogError = require('../functions/errorLog')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')
const roadsInInterest = require(Path.join(CONFIG.paths.base, './mvm-roads-in-interest.json'))
const { FormatError } = require('../functions/formatError')

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

/** @param {Discord.TextChannel} channel @param {StatesManager} statesManager */
module.exports = async (channel, statesManager) => {
    statesManager.MVMReport.Text = 'Get MVM data...'
    MVM.Get()
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
                .setDescription('> \\❌ ' + FormatError(error))
        
            await channel.send({ embeds: [errorEmbed] })
        })
}
