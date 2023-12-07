const Discord = require('discord.js')
const CommandGift = require('../economy/gift')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('gift')
        .setDescription('Egy felhasználó megajándékozása')
        .addUserOption(
            new Discord.SlashCommandUserOption()
                .setName('user')
                .setDescription('Felhasználó')
                .setRequired(true)
            ),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        CommandGift.OnCommand(interaction, sender.Database)
    },
    Guild: '737954264386764812',
}

module.exports = Command