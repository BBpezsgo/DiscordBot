const Discord = require('discord.js')
const CommandBackpack = require('../economy/backpack')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('backpack')
        .setDescription('A hátizsákod tartalmának megtekintése'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        CommandBackpack.OnCommand(interaction, sender.Database, ephemeral)
    }
}

module.exports = Command