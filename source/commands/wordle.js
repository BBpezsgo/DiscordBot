const Discord = require('discord.js')
const fs = require('fs')

/**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
*/
module.exports = (command, privateCommand) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Wordle!')
        .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
        .addField('Matricák',
            '> ' + database.dataStickers[command.member.id].stickersMusic + ' \\🎼 Zene\n' +
            '> ' + database.dataStickers[command.member.id].stickersMeme + ' \\🎭 Meme\n' +
            '> ' + database.dataStickers[command.member.id].stickersYoutube + ' \\🎬 YouTube\n' +
            '> ' + database.dataStickers[command.member.id].stickersMessage + ' \\📋 Üzenet\n' +
            '> ' + database.dataStickers[command.member.id].stickersCommand + ' \\🖥️ Parancs\n' +
            '> ' + database.dataStickers[command.member.id].stickersTip + ' \\💡 Ötlet'
        )
        .addField('Statisztika',
            '> \\🎼 Zenék: ' + abbrev(userstats[command.member.id].memes) + '\n' +
            '> \\🎭 Vicces dolgok: ' + abbrev(userstats[command.member.id].musics) + '\n' +
            '> \\🎬 YouTube linkek: ' + abbrev(userstats[command.member.id].youtubevideos) + '\n' +
            '> \\📋 Üzenetek: ' + abbrev(userstats[command.member.id].messages) + '\n' +
            '> \\🖥️ Parancsok:' + abbrev(userstats[command.member.id].commands) + '\n' +
            '> \\👁‍🗨 Összes karakter: ' + abbrev(userstats[command.member.id].chars)
        )
        .addField('meta',
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
        )
    command.reply({ embeds: [embed], ephemeral: privateCommand })
}
