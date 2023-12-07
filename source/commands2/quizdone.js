const QuizManager = require('../economy/quiz')
const Discord = require('discord.js')
const { ChannelId } = require('../functions/enums')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
        .setName('quizdone')
        .setDescription('Quiz befejezése'),
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        await QuizManager.QuizDoneTest(interaction.client, interaction)
    },
    Guild: '737954264386764812',
}

module.exports = Command