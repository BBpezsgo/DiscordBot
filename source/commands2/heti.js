const CommandOpenCrate = require('../economy/open-daily-crate')
const Discord = require('discord.js')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('heti')
        .setDescription('Heti láda kinyitása')
        .addIntegerOption(option =>
            option.setName('darab')
                .setDescription('Heti ládák mennyisége')
                .setRequired(true)),
    OnCommand: async function(interaction, ephemeral, sender) {
        await interaction.reply(CommandOpenCrate.On(interaction.user.id, interaction.options.getInteger("darab"), sender.Database, sender.Economy))
    },
    Guild: '737954264386764812',
}

module.exports = Command