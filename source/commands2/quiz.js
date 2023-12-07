const QuizManager = require('../economy/quiz')
const Discord = require('discord.js')
const { ChannelId } = require('../functions/enums')

const CommandInformations = new Discord.SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Quiz')
    .addStringOption(
        new Discord.SlashCommandStringOption()
            .setName('title')
            .setDescription('A kérdés')
            .setRequired(true)
    )
    .addStringOption(
        new Discord.SlashCommandStringOption()
            .setName('options')
            .setDescription('Opció;Opció;Opció')
            .setRequired(true)
    )
    .addStringOption(
        new Discord.SlashCommandStringOption()
            .setName('option_emojis')
            .setDescription('💥;💥;💥')
            .setRequired(true)
    )
    .addIntegerOption(
        new Discord.SlashCommandIntegerOption()
            .setName('add_xp')
            .setDescription('🍺 Mennyiség ha jól válaszol')
            .setRequired(true)
    )
    .addIntegerOption(
        new Discord.SlashCommandIntegerOption()
            .setName('remove_xp')
            .setDescription('🍺 Mennyiség ha rosszul válaszol')
            .setRequired(true)
    )
    .addIntegerOption(
        new Discord.SlashCommandIntegerOption()
            .setName('add_token')
            .setDescription('🎫 Mennyiség ha jól válaszol')
            .setRequired(true)
    )
    .addIntegerOption(
        new Discord.SlashCommandIntegerOption()
            .setName('remove_token')
            .setDescription('🎫 Mennyiség ha rosszul válaszol')
            .setRequired(true)
    )
    .addAttachmentOption(
        new Discord.SlashCommandAttachmentOption()
            .setName('quiz_attachment')
            .setDescription('Bruh')
            .setRequired(false)
    )

/** @type {import("./base").Command} */
const Command = {
	Data: CommandInformations,
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
            interaction.options.getInteger("remove_token"),
            interaction.options.getAttachment("quiz_attachment"))
        
        interaction.editReply({
            content: '> \\✔️ **OK**',
        })
    },
    Guild: '737954264386764812',
}

module.exports = Command