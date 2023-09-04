const Discord = require('discord.js')
const CommandProfil = require('../economy/profil')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('profil')
        .setDescription('Statisztikák és matricák megtekintése'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        await CommandProfil(sender.Database, interaction, ephemeral)
    }
}

module.exports = Command