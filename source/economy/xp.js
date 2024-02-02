const Discord = require('discord.js')
const { xpRankIcon, xpRankNext, xpRankPrevoius, xpRankText } = require('./xpFunctions')
const GetUserColor = require('../economy/userColor')
const { Abbrev } = require('../functions/utils')
const { DatabaseManager } = require('../functions/databaseManager')

let coloredProgressBarPart = '⬜'

 /** @param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand @param {DatabaseManager} database */
async function execute(command, database, privateCommand) {
    const scores = database.dataBasic

    try {
        const userColor = scores[command.user.id].color

        if (userColor === "red") {
            coloredProgressBarPart = '🟥'
        } else if (userColor === "yellow") {
            coloredProgressBarPart = '🟨'
        } else if (userColor === "blue") {
            coloredProgressBarPart = '🟦'
        } else if (userColor === "orange") {
            coloredProgressBarPart = '🟧'
        } else if (userColor === "purple") {
            coloredProgressBarPart = '🟪'
        } else if (userColor === "green") {
            coloredProgressBarPart = '🟩'
        } else if (userColor === "brown") {
            coloredProgressBarPart = '🟫'
        }

        const score = scores[command.user.id].score
        const rankName = xpRankText(score)
        const next = xpRankNext(score)

        let progressBar = ''

        const progressBarLength = 10

        let scorePercent = score / next * progressBarLength

        let progressBarFilled = ''
        for (let l = 0; l < scorePercent; l++) {
            progressBarFilled += '\\' + coloredProgressBarPart
        }
        progressBar += progressBarFilled
        for (let l = 0; l < progressBarLength - (progressBarFilled.length / 3); l++) {
            progressBar += '\\⬛'
        }

        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: command.user.username, iconURL: command.user.displayAvatarURL() })
            .setTitle('Rang')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/beer-mug_1f37a.png')
            .addFields([{
                name: rankName,
                value: '\\' + xpRankIcon(score) + ' ' + progressBar + ' \\❔'
            }])
            .setColor(GetUserColor(userColor))
            .setFooter({ text: Abbrev(score) + ' / ' + Abbrev(next) + '\nKell még: 🍺' + Abbrev(next - score) + ' xp' })
        command.reply({ embeds: [embed], ephemeral: privateCommand })
    } catch (error) {
        command.reply({ content: '> \\❗ ' + error.toString(), ephemeral: privateCommand})
    }
}

 /**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
 * @param {DatabaseManager} database
 */
module.exports = (command, database, privateCommand) => { execute(command, database, privateCommand) }