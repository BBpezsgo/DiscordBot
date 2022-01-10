const Discord = require('discord.js')
const fs = require('fs')/*
let scores = JSON.parse(fs.readFileSync('scores.json', 'utf-8'))

function resetScores() {
    fs.writeFile('scores.json', JSON.stringify(scores), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
}*/

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.User} sender
 * @param {Discord.Guild} _guild
 */
module.exports = async (sender, _guild, channel) => {
    /*if (scores[sender.id].haveHome === false) {
        let guild = Discord.Guild
        guild = _guild
        let homeChannel = await guild.channels.create('🏠-otthon', {
            type: 'text',
            permissionOverwrites: [
                {
                    id: sender.id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: guild.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                }
            ],
            parent: guild.channels.cache.get('798497125943345192')
        })
        scores[sender.id].haveHome = true
        resetScores()
        homeChannel.send('> \\👋 **Üdd az otthonodban!** \\🏠\n> Ide nyugodtan irogathatsz parancsokat anélkül, hogy ezzel bárkit is zavarnál.')
    } else {
        channel.send('> \\❌ **Már van otthonod!**')
    }*/
}