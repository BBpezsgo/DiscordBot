const Discord = require('discord.js')

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.GuildMember} sender
 */
module.exports = (channel, sender) => {
    if (sender.voice.channel) {
        musicArray.unshift(link)
        channel.send('> **\\➕ Hozzáadva a lejátszólistába \\🎧**')
    } else {
        channel.send('> **\\❌ Előbb jépj be egy hangcsatornába! \\🎧**')
    }
}