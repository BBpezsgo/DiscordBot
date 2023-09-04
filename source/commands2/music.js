const Discord = require('discord.js')

const commandMusic = new Discord.SlashCommandBuilder()
    .setName('music')
    .setDescription('YouTube zenelejátszó')
const commandMusicSub0 = new Discord.SlashCommandSubcommandBuilder()
    .setName('play')
    .setDescription('YouTube zene lejátszása')
const commandMusicSub0a = new Discord.SlashCommandStringOption()
    .setName('url')
    .setDescription('YouTube link')
    .setRequired(true)
commandMusicSub0.addStringOption(commandMusicSub0a)

const commandMusicSub1 = new Discord.SlashCommandSubcommandBuilder()
    .setName('skip')
    .setDescription('A most hallható zene átugrása')

const commandMusicSub2 = new Discord.SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('A lejátszólista megtekintése')

commandMusic.addSubcommand(commandMusicSub0)
commandMusic.addSubcommand(commandMusicSub1)
commandMusic.addSubcommand(commandMusicSub2)

/** @type {import("./base").Command} */
const Command = {
	Data: commandMusic,
    /** @param {Discord.ChatInputCommandInteraction} interaction */
    Execute: async function(interaction, ephemeral, sender) {
        if (interaction.guild) {
            if (interaction.options.getSubcommand() == 'play') {
                await sender.MusicPlayer.CommandMusic(interaction, interaction.options.getString('url'))
            } else if (interaction.options.getSubcommand() == `skip`) {
                await sender.MusicPlayer.CommandSkip(interaction)
            } else if (interaction.options.getSubcommand() == `list`) {
                await sender.MusicPlayer.CommandMusicList(interaction)
            }
        } else {
            interaction.reply("> \\❌ **Ez a parancs csak szerveren használható!**")
        }
    }
}

module.exports = Command