const Discord = require('discord.js')
const CommandMarket = require('../economy/market')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('market')
        .setDescription('Piac'),
    OnCommand: async function(interaction, ephemeral, sender) {
        interaction.reply(CommandMarket.OnCommand(sender.Database, sender.Database.dataMarket, interaction.user, ephemeral))
    },
    Guild: '737954264386764812',
    OnButton: function(interaction, sender) {
        if (CommandMarket.OnButton(interaction, sender.Database)) {
            return Promise.resolve()
        } else {
            return false
        }
    },
}

module.exports = Command