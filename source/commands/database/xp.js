const Discord = require('discord.js')
const fs = require('fs');
const { xpRankIcon, xpRankNext, xpRankPrevoius, xpRankText } = require('./xpFunctions')
const GetUserColor = require('../../functions/userColor')

let coloredProgressBarPart = '⬜'

function abbrev(num) {
    if (!num || isNaN(num)) return "0";
    if (typeof num === "string") num = parseInt(num);
    let decPlaces = Math.pow(10, 1);
    var abbrev = ["E", "m", "M", "b", "B", "tr", "TR", "qa", "QA", "qi", "QI", "sx", "SX", "sp", "SP"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= num) {
            num = Math.round((num * decPlaces) / size) / decPlaces;
            if (num == 1000 && i < abbrev.length - 1) {
                num = 1;
                i++;
            }
            num += abbrev[i];
            break;
        }
    }
    return num;
}

 /** @param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
async function execute(command, privateCommand) {
    const scores = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'));

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

        var score = scores[command.user.id].score
        var rankName = xpRankText(score)
        var next = xpRankNext(score)

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

        const embed = new Discord.MessageEmbed()
            .setAuthor({ name: command.user.username, iconURL: command.user.displayAvatarURL() })
            .setTitle('Rang')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/beer-mug_1f37a.png')
            .addField(rankName,'\\' + xpRankIcon(score) + ' ' + progressBar + ' \\❔')
            .setColor(GetUserColor(userColor))
            .setFooter({ text: abbrev(score) + ' / ' + abbrev(next) + '\nKell még: 🍺' + abbrev(next - score) + ' xp' })
        command.reply({ embeds: [embed], ephemeral: privateCommand });
    } catch (error) {
        command.reply({ content: '> \\❌ ' + error.toString(), ephemeral: privateCommand})
    }
}

 /**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
 */
module.exports = (command, privateCommand) => { execute(command, privateCommand) }