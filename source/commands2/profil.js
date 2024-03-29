const Discord = require('discord.js')
const CommandProfil = require('../economy/profil')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('profil')
        .setDescription('Statisztikák és matricák megtekintése'),
    OnCommand: async function(interaction, ephemeral, sender) {
        await CommandProfil(sender.Database, interaction, ephemeral)
    },
    Guild: '737954264386764812',
}

module.exports = Command