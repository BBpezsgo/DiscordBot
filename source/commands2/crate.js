const CommandOpenCrate = require('../economy/open-crate')
const Discord = require('discord.js')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('crate')
        .setDescription('Láda kinyitása')
        .addIntegerOption(option =>
            option.setName('darab')
                .setDescription('Ládák mennyisége')
                .setRequired(true)),
    OnCommand: async function(interaction, ephemeral, sender) {
        await interaction.reply(CommandOpenCrate.On(interaction.user.id, interaction.options.getInteger("darab"), sender.Database))
    },
    Guild: '737954264386764812',
}

module.exports = Command