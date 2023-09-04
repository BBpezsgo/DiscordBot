const CommandOpenCrate = require('../economy/open-daily-crate')
const Discord = require('discord.js')
const { Color } = require('../functions/enums')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('dev')
        .setDescription('Fejlesztői segítség'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        if (interaction.user.id === '726127512521932880') {
            const embed = new Discord.EmbedBuilder()
                .addFields([{
                    name: 'Fejlesztői parancsok',
                    value:
                    '> \\❔  `.quiz`\n' +
                    '>  \\📊  `.poll simple`\n' +
                    '>  \\📊  `.poll wyr`'
                }])
                .setColor(Color.Highlight)
            await interaction.reply({
                embeds: [embed],
                ephemeral,
            })
        } else {
            await interaction.reply({
                content: '> \\⛔ **Nincs jogosultságod a parancs használatához!**',
                ephemeral,
            })
        }
    }
}

module.exports = Command