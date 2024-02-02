const Discord = require('discord.js')
const CommandXp = require('../economy/xp')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('xp')
        .setDescription('Rangod'),
    OnCommand: async function(interaction, ephemeral, sender) {
        CommandXp(interaction, sender.Database, ephemeral)
    },
    Guild: '737954264386764812',
}

module.exports = Command