const Discord = require('discord.js')
const CommandXp = require('../economy/xp')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('xp')
        .setDescription('Rangod'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        CommandXp(interaction, sender.Database, ephemeral)
    }
}

module.exports = Command