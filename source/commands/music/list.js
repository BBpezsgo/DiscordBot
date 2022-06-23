const Discord = require('discord.js')

 /**
 * @param {Discord.Channel} channel
 */
module.exports = (channel) => {
    if (musicArray.length === 0) {
        channel.send('> **\\❔ A lejátszólista üres \\🎧**')
    } else {
        const embed = new Discord.MessageEmbed()
        musicArray.forEach(_link => {
            ytdl.getBasicInfo(_link).then( info => {
                embed.addField(info.videoDetails.title, ' ', false)
            })
        })
        channel.send('> **\\❔ Lejátszólista: \\🎧**', embed)
    }
}