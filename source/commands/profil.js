const Discord = require('discord.js')
const fs = require('fs')
const { DatabaseManager } = require('../functions/databaseManager.js')
const request = require("request")
const GetUserColor = require('../functions/userColor')
const { abbrev } = require('../functions/abbrev')

/**
 * @param {DatabaseManager} database
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
*/
module.exports = async (database, command, privateCommand) => {
    const embed = new Discord.MessageEmbed()
        .setColor(GetUserColor(database.dataBasic[command.member.id].color))
        .setTitle('Profil')
        .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
        .addField('Matricák',
            '> ' + database.dataStickers[command.member.id].stickersMusic + ' \\🎼 Zene\n' +
            '> ' + database.dataStickers[command.member.id].stickersMeme + ' \\🎭 Meme\n' +
            '> ' + database.dataStickers[command.member.id].stickersMessage + ' \\📋 Üzenet\n' +
            '> ' + database.dataStickers[command.member.id].stickersCommand + ' \\🖥️ Parancs\n' +
            '> ' + database.dataStickers[command.member.id].stickersTip + ' \\💡 Ötlet'
        )
        .addField('Statisztika',
            '> \\🎼 Zenék: ' + abbrev(database.dataUserstats[command.member.id].memes) + '\n' +
            '> \\🎭 Vicces dolgok: ' + abbrev(database.dataUserstats[command.member.id].musics) + '\n' +
            '> \\🎬 YouTube linkek: ' + abbrev(database.dataUserstats[command.member.id].youtubevideos) + '\n' +
            '> \\📋 Üzenetek: ' + abbrev(database.dataUserstats[command.member.id].messages) + '\n' +
            '> \\🖥️ Parancsok:' + abbrev(database.dataUserstats[command.member.id].commands) + '\n' +
            '> \\👁‍🗨 Összes karakter: ' + abbrev(database.dataUserstats[command.member.id].chars)
        )
        /*.addField('meta',
            '> \\🏆 medal-0a: 0\n' +
            '> \\🥇 medal-1a: 0\n' +
            '> \\🥈 medal-1b: 0\n' +
            '> \\🥉 medal-1c: 0\n' +
            '> \\🏅 medal-1d: 0\n' +
            '> \\🎖️ medal-2a: 0\n' +
            '> \\🀄 card-0a: 0\n' +
            '> \\🃏 card-0b: 0\n' +
            '> \\🎴 card-0c: 0\n' +
            '> \\🧧 card-1a: 0'
        )*/
        .addField('Mást keresel?',
            'Beállítások: `/settings`\n' + 
            'Profil testreszabása: `/bolt`',
            false
        )
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/bust-in-silhouette_1f464.png')
        command.reply({ embeds: [embed], ephemeral: privateCommand })
}
