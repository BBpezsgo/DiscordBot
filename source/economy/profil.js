const Discord = require('discord.js')
const { DatabaseManager } = require('../functions/databaseManager.js')
const GetUserColor = require('./userColor')
const { Abbrev } = require('../functions/utils.js')

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
        .setColor(GetUserColor(database.dataBasic[command.user.id].color))
        .setTitle('Profil')
        .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
        .addFields([
            {
                name: 'Matricák',
                value:
                    '> ' + database.dataStickers[command.user.id].stickersMusic + ' \\🎼 Zene\n' +
                    '> ' + database.dataStickers[command.user.id].stickersMeme + ' \\🎭 Meme\n' +
                    '> ' + database.dataStickers[command.user.id].stickersMessage + ' \\📋 Üzenet\n' +
                    '> ' + database.dataStickers[command.user.id].stickersCommand + ' \\🖥️ Parancs\n' +
                    '> ' + database.dataStickers[command.user.id].stickersTip + ' \\💡 Ötlet'
            },
            {
                name: 'Statisztika',
                value:
                    '> \\🎼 Zenék: ' + Abbrev(database.dataUserstats[command.user.id].memes) + '\n' +
                    '> \\🎭 Vicces dolgok: ' + Abbrev(database.dataUserstats[command.user.id].musics) + '\n' +
                    '> \\🎬 YouTube linkek: ' + Abbrev(database.dataUserstats[command.user.id].youtubevideos) + '\n' +
                    '> \\📋 Üzenetek: ' + Abbrev(database.dataUserstats[command.user.id].messages) + '\n' +
                    '> \\🖥️ Parancsok:' + Abbrev(database.dataUserstats[command.user.id].commands) + '\n' +
                    '> \\👁‍🗨 Összes karakter: ' + Abbrev(database.dataUserstats[command.user.id].chars)
            }
        ])

    let text = ''
    awardRoles.forEach(award => {
        if (Array.isArray(command.member.roles)) {
            if (command.member.roles.some(role => role === award)) {
                text += '\n> ' + awardRoleNames[award]
            }
        } else {
            if (command.member.roles.cache.some(role => role.id === award)) {
                text += '\n> ' + awardRoleNames[award]
            }
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
