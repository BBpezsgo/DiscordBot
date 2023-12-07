const Discord = require('discord.js')
const LogError = require('../functions/errorLog').LogError

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('test')
        .setDescription('Teszt'),
    /** @param {Discord.ChatInputCommandInteraction} command */
    Execute: async function(command, ephemeral, sender) {
        const service = require('../services/DONKI')
        service.FLR(false)
            .then(result => {
                const embed = new Discord.EmbedBuilder()
                embed.setTitle('DONKI')
                for (let i = 0; i < result.length; i++) {
                    if (i > 5) { break }
                    const flr = result[i]
                    let body = JSON.stringify(flr, null, ' ')
                    embed.addFields({
                        name: flr.flrID,
                        value: `\`\`\`json\n${body}\n\`\`\``,
                        inline: true,
                    })
                }
                command.reply({ embeds: [ embed ] })
                    .catch(LogError)
            })
            .catch(LogError)
    },
    Guild: '737954264386764812',
}

module.exports = Command