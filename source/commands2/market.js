const Discord = require('discord.js')
const CommandMarket = require('../economy/market')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('market')
        .setDescription('Piac'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        interaction.reply(CommandMarket.OnCommand(sender.Database, sender.Database.dataMarket, interaction.user, ephemeral))
    }
}

module.exports = Command