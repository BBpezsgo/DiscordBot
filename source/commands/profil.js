const Discord = require('discord.js')
const fs = require('fs')
const { DatabaseManager } = require('../functions/databaseManager.js')
const request = require("request")
const GetUserColor = require('../functions/userColor')
const { abbrev } = require('../functions/abbrev')

const awardRoles = [
    '929443006627586078',
    '929443558040166461',
    '929443627527180288',
    '929443673077329961',
    '929443957967048834',
    '893187175087226910'
]

const awardRoleNames = {
    '929443006627586078': '\\🔥 Quiz - **Answer Streak** 3',
    '929443558040166461': '\\🔥 Quiz - **Answer Streak** 4',
    '929443627527180288': '\\🔥 Quiz - **Answer Streak** 5',
    '929443673077329961': '\\🔥 Quiz - **Answer Streak** 5+ ||Max||',
    '929443957967048834': '\\🎭 **Meme Áradat**',
    '893187175087226910': '\\💥 **Aktív Résztvevő**'
}

/**
 * @param {DatabaseManager} database
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
*/
module.exports = async (database, command, privateCommand) => {
    const embed = new Discord.EmbedBuilder()
        .setColor(GetUserColor(database.dataBasic[command.member.id].color))
        .setTitle('Profil')
        .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
        .addFields([
            {
                name: 'Matricák',
                value:
                    '> ' + database.dataStickers[command.member.id].stickersMusic + ' \\🎼 Zene\n' +
                    '> ' + database.dataStickers[command.member.id].stickersMeme + ' \\🎭 Meme\n' +
                    '> ' + database.dataStickers[command.member.id].stickersMessage + ' \\📋 Üzenet\n' +
                    '> ' + database.dataStickers[command.member.id].stickersCommand + ' \\🖥️ Parancs\n' +
                    '> ' + database.dataStickers[command.member.id].stickersTip + ' \\💡 Ötlet'
            },
            {
                name: 'Statisztika',
                value:
                    '> \\🎼 Zenék: ' + abbrev(database.dataUserstats[command.member.id].memes) + '\n' +
                    '> \\🎭 Vicces dolgok: ' + abbrev(database.dataUserstats[command.member.id].musics) + '\n' +
                    '> \\🎬 YouTube linkek: ' + abbrev(database.dataUserstats[command.member.id].youtubevideos) + '\n' +
                    '> \\📋 Üzenetek: ' + abbrev(database.dataUserstats[command.member.id].messages) + '\n' +
                    '> \\🖥️ Parancsok:' + abbrev(database.dataUserstats[command.member.id].commands) + '\n' +
                    '> \\👁‍🗨 Összes karakter: ' + abbrev(database.dataUserstats[command.member.id].chars)
            }
        ])

    var text = ''
    awardRoles.forEach(award => {
        if (command.member.roles.cache.some(role => role.id == award)) {
            text += '\n> ' + awardRoleNames[award]
        }
    })

    if (text == '') {
        text = '> Nincsenek jelvényeid'
    }

    embed
        .addFields([{ name: 'Jelvények', value: text }])

        /*
            '> \\🏆 medal-0a: 0\n'
            '> \\🥇 medal-1a: 0\n'
            '> \\🥈 medal-1b: 0\n'
            '> \\🥉 medal-1c: 0\n'
            '> \\🏅 medal-1d: 0\n'
            '> \\🎖️ medal-2a: 0\n'
            '> \\🀄 card-0a: 0\n'
            '> \\🃏 card-0b: 0\n'
            '> \\🎴 card-0c: 0\n'
            '> \\🧧 card-1a: 0'
        */

        .addFields([{
            name: 'Mást keresel?',
            value: 
                'Beállítások: `/settings`\n' + 
                'Profil testreszabása: `/shop`',
            inline: false
        }])
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/bust-in-silhouette_1f464.png')
    command.reply({ embeds: [embed], ephemeral: privateCommand })
}
