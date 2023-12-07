const Discord = require('discord.js')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('webpage')
        .setDescription('Link a fiókod weblapjához'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        const { GetHash } = require('../economy/userHashManager')
        const button = new Discord.ButtonBuilder()
            .setLabel('Weboldal')
            .setStyle(Discord.ButtonStyle.Link)
            .setURL('http://bbpezsgo.ddns.net:5665/public?user=' + GetHash(interaction.user.id))
        const row = new Discord.ActionRowBuilder()
            .addComponents(button)
        await interaction.reply({
            components: [ row ],
            ephemeral: true,
        })
    },
    Guild: '737954264386764812',
}

module.exports = Command