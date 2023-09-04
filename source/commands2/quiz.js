const QuizManager = require('../economy/quiz')
const Discord = require('discord.js')
const { ChannelId } = require('../functions/enums')

const commandQuizSub3 = new Discord.SlashCommandIntegerOption()
    .setName('add_xp')
    .setDescription('🍺 Mennyiség ha jól válaszol')
    .setRequired(true)
const commandQuizSub4 = new Discord.SlashCommandIntegerOption()
    .setName('remove_xp')
    .setDescription('🍺 Mennyiség ha rosszul válaszol')
    .setRequired(true)
const commandQuizSub5 = new Discord.SlashCommandIntegerOption()
    .setName('add_token')
    .setDescription('🎫 Mennyiség ha jól válaszol')
    .setRequired(true)
const commandQuizSub6 = new Discord.SlashCommandIntegerOption()
    .setName('remove_token')
    .setDescription('🎫 Mennyiség ha rosszul válaszol')
    .setRequired(true)
const commandQuizSub0 = new Discord.SlashCommandStringOption()
    .setName('title')
    .setDescription('A kérdés')
    .setRequired(true)
const commandQuizSub1 = new Discord.SlashCommandStringOption()
    .setName('options')
    .setDescription('Opció;Opció;Opció')
    .setRequired(true)
const commandQuizSub2 = new Discord.SlashCommandStringOption()
    .setName('option_emojis')
    .setDescription('💥;💥;💥')
    .setRequired(true)
const commandQuiz = new Discord.SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Quiz')
    .addStringOption(commandQuizSub0)
    .addStringOption(commandQuizSub1)
    .addStringOption(commandQuizSub2)
    .addIntegerOption(commandQuizSub3)
    .addIntegerOption(commandQuizSub4)
    .addIntegerOption(commandQuizSub5)
    .addIntegerOption(commandQuizSub6)

/** @type {import("./base").Command} */
const Command = {
	Data: commandQuiz,
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        await interaction.deferReply({
            ephemeral
        })

        await interaction.client.channels.fetch(ChannelId.Quiz)
        
        await QuizManager.Quiz(
            interaction.client,
            interaction.options.getString("title"),
            interaction.options.getString("options"),
            interaction.options.getString("option_emojis"),
            interaction.options.getInteger("add_xp"),
            interaction.options.getInteger("remove_xp"),
            interaction.options.getInteger("add_token"),
            interaction.options.getInteger("remove_token"))
        
        interaction.editReply({
            content: '> \\✔️ **OK**',
        })
    }
}

module.exports = Command