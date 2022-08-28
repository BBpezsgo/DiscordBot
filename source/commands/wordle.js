const Discord = require('discord.js')
const fs = require('fs')

/**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
*/
module.exports = (command, privateCommand) => {
    const embed = new Discord.EmbedBuilder()
        .setTitle('Wordle!')
        .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
    command.reply({ embeds: [embed], ephemeral: privateCommand })
}
