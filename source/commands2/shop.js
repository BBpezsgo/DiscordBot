const Discord = require('discord.js')
const CommandShop = require('../economy/shop')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('shop')
        .setDescription('Bevásárlás'),
    Execute: async function(interaction, ephemeral, sender) {
        await interaction.reply(CommandShop.CommandShop(interaction.channel, interaction.user, interaction.member, sender.Database, 0, '', ephemeral))
    },
    Guild: '737954264386764812',
    OnButton: function(interaction, sender) {
        if (CommandShop.OnButtonClick(interaction, sender.Database)) {
            return Promise.resolve()
        } else {
            return false
        }
    },
    OnSelectMenu: function(interaction, sender) {
        if (CommandShop.OnSelectMenu(interaction, sender.Database)) {
            return Promise.resolve()
        } else {
            return false
        }
    },
}

module.exports = Command