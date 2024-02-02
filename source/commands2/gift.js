const Discord = require('discord.js')
const CommandGift = require('../economy/gift')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('gift')
        .setDescription('Egy felhasználó megajándékozása')
        .addUserOption(
            new Discord.SlashCommandUserOption()
                .setName('user')
                .setDescription('Felhasználó')
                .setRequired(true)
            ),
    OnCommand: async function(interaction, ephemeral, sender) {
        CommandGift.OnCommand(interaction, sender.Database)
    },
    Guild: '737954264386764812',
    OnButton: function(interaction, sender) {
        if (CommandGift.OnButtonClick(interaction, sender.Database)) {
            return Promise.resolve()
        } else {
            return false
        }
    },
}

module.exports = Command