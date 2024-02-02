const Discord = require('discord.js')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('tesco')
        .setDescription('Tesco')
        .addStringOption(
            new Discord.SlashCommandStringOption()
                .setName('search')
                .setDescription('Search')
                .setRequired(true)
            ),
    OnCommand: async function(command, ephemeral, sender) {
        const CommandTesco = require('../commands/tesco')
        await CommandTesco(command)
    },
    Guild: null,
}

module.exports = Command