const Discord = require('discord.js')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('tesco')
        .setDescription('Tesco')
        .addStringOption(
            new Discord.SlashCommandStringOption()
                .setName('search')
                .setDescription('Search')
                .setRequired(true)
            ),
    /** @param {Discord.ChatInputCommandInteraction} command */
    Execute: async function(command, ephemeral, sender) {
        const CommandTesco = require('../commands/tesco')
        await CommandTesco(command)
    }
}

module.exports = Command