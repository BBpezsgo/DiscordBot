const Discord = require('discord.js')
const CommandShop = require('../economy/shop')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('backpack')
        .setDescription('A hátizsákod tartalmának megtekintése'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        await interaction.reply(CommandShop.CommandShop(interaction.channel, interaction.user, interaction.member, sender.Database, 0, '', ephemeral))
    }
}

module.exports = Command