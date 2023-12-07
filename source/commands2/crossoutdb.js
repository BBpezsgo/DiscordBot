const Discord = require('discord.js')

const commandCrossoutSub = new Discord.SlashCommandStringOption()
    .setName('search')
    .setDescription('A tárgy amit keresni szeretnél')
    .setRequired(true)
const commandCrossout = new Discord.SlashCommandBuilder()
    .setName('crossout')
    .setDescription('Crossout')
    .addStringOption(commandCrossoutSub)

/** @type {import("./base").Command} */
const Command = {
	Data: commandCrossout,
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        const Crossout = require('../commands/crossout')
        await interaction.deferReply({ ephemeral })
        Crossout.GetItem(interaction, interaction.options.getString('search'))
    },
    Guild: null,
}

module.exports = Command