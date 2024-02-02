const QuizManager = require('../economy/quiz')
const Discord = require('discord.js')

/** @type {import("./base").Command} */
const Command = {
	Command: new Discord.SlashCommandBuilder()
        .setName('quizdone')
        .setDescription('Quiz befejezése'),
    OnCommand: async function(interaction, ephemeral, sender) {
        await QuizManager.QuizDoneTest(interaction.client, interaction)
    },
    Guild: '737954264386764812',
}

module.exports = Command