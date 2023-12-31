const Discord = require('discord.js')
const CommandBackpack = require('../economy/backpack')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('backpack')
        .setDescription('A hátizsákod tartalmának megtekintése'),
    Execute: async function(interaction, ephemeral, sender) {
        CommandBackpack.OnCommand(interaction, sender.Database, ephemeral)
    },
    Guild: '737954264386764812',
    OnButton: function(interaction, sender) {
        if (CommandBackpack.OnButtonClick(interaction, sender.Database)) {
            return Promise.resolve()
        } else {
            return false
        }
    }
}

module.exports = Command