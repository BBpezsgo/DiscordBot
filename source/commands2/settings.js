const Discord = require('discord.js')
const CommandSettings = require('../economy/settings')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('settings')
        .setDescription('Értesítési, és parancs beállítások'),
    OnCommand: async function(interaction, ephemeral, sender) {
        await interaction.deferReply()
        const member = await interaction.member.fetch()
        await member.guild.fetch()
        await interaction.editReply(CommandSettings(sender.Database, member, ephemeral))
    },
    Guild: '737954264386764812',
}

module.exports = Command