const Discord = require('discord.js')
const { CommandFont, GetFonts, StringToFont } = require('../commands/fonts')

const commandFont = new Discord.SlashCommandBuilder()
    .setName('font')
    .setDescription('Font converter')
const commandFontSub0 = new Discord.SlashCommandStringOption()
    .setName('font')
    .setDescription('Font')
    .setRequired(true)
const commandFontSub1 = new Discord.SlashCommandStringOption()
    .setName('text')
    .setDescription('Text')
    .setRequired(true)
const fonts = GetFonts()
for (let i = 0; i < fonts.length; i++) {
    if (i == 1) { continue }
    commandFontSub0.addChoices({ name: StringToFont("Lorem ipsum", i), value: i.toString() })
}
commandFont.addStringOption(commandFontSub1)
commandFont.addStringOption(commandFontSub0)

/** @type {import("./base").Command} */
const Command = {
	Command: commandFont,
    OnCommand: async function(interaction, ephemeral, sender) {
        CommandFont(interaction, ephemeral)
    },
    Guild: null,
}

module.exports = Command