const Discord = require('discord.js')

 /**
 * @param {Discord.Channel} channel
 */
module.exports = (channel) => {
    if (musicArray.length === 0) {
        channel.send('> **\\❔ A lejátszólista üres \\🎧**')
    } else {
        const embed = new Discord.EmbedBuilder()
        musicArray.forEach(_link => {
            ytdl.getBasicInfo(_link).then( info => {
                embed.addFields([{
                    name: info.videoDetails.title,
                    value: ' ',
                    inline: false
                }])
            })
        })
        channel.send('> **\\❔ Lejátszólista: \\🎧**', embed)
    }
}