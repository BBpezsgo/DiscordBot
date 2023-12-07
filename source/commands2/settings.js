const Discord = require('discord.js')
const CommandSettings = require('../economy/settings')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('settings')
        .setDescription('Értesítési, és parancs beállítások'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        await interaction.deferReply()
        const member = await interaction.member.fetch()
        await member.guild.fetch()
        await interaction.editReply(CommandSettings(sender.Database, interaction.member, ephemeral))
    },
    Guild: '737954264386764812',
}

module.exports = Command