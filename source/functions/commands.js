const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandBooleanOption, SlashCommandStringOption, SlashCommandUserOption } = require('@discordjs/builders');
const { Client } = require('discord.js')
const { GetFonts, StringToFont } = require('../commands/fonts')
const Discord = require('discord.js')

/**@param {Client} bot */
function CreateCommands(bot) {
    const commandPing = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('A BOT ping-elése, avagy megnézni hogy most épp elérhető e');
    const commandWeather = new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Békéscsaba időjárása');
    const commandXp = new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Rangod');
    const commandDev = new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Fejlesztői segítség');
    const commandHelp = new SlashCommandBuilder()
        .setName('help')
        .setDescription('A parancsok listája');
    const commandCrateSub = new SlashCommandIntegerOption()
        .setName('darab')
        .setDescription('Ládák mennyisége')
        .setRequired(true)
    const commandCrate = new SlashCommandBuilder()
        .setName('crate')
        .setDescription('Láda kinyitása')
        .addIntegerOption(commandCrateSub)
    const commandNapiSub = new SlashCommandIntegerOption()
        .setName('darab')
        .setDescription('Napi ládák mennyisége')
        .setRequired(true)
    const commandNapi = new SlashCommandBuilder()
        .setName('napi')
        .setDescription('Napi láda kinyitása')
        .addIntegerOption(commandNapiSub)
    const commandProfil = new SlashCommandBuilder()
        .setName('profil')
        .setDescription('Statisztikák és matricák megtekintése')
    const commandBackpack = new SlashCommandBuilder()
        .setName('store')
        .setDescription('A hátizsákod tartalmának megtekintése.')
    const commandShop = new SlashCommandBuilder()
        .setName('bolt')
        .setDescription('Itt elköltheted a pénzed')

    const commandQuizSub3 = new SlashCommandIntegerOption()
        .setName('add_xp')
        .setDescription('🍺 mennyiség ha jól válaszol')
        .setRequired(true)
    const commandQuizSub4 = new SlashCommandIntegerOption()
        .setName('remove_xp')
        .setDescription('🍺 mennyiség ha rosszul válaszol')
        .setRequired(true)
    const commandQuizSub5 = new SlashCommandIntegerOption()
        .setName('add_token')
        .setDescription('🎫 mennyiség ha jól válaszol')
        .setRequired(true)
    const commandQuizSub6 = new SlashCommandIntegerOption()
        .setName('remove_token')
        .setDescription('🎫 mennyiség ha rosszul válaszol')
        .setRequired(true)
    const commandQuizSub0 = new SlashCommandStringOption()
        .setName('title')
        .setDescription('A kérdés')
        .setRequired(true)
    const commandQuizSub1 = new SlashCommandStringOption()
        .setName('options')
        .setDescription('Opció;Opció;Opció')
        .setRequired(true)
    const commandQuizSub2 = new SlashCommandStringOption()
        .setName('option_emojis')
        .setDescription('💥;💥;💥')
        .setRequired(true)
    const commandQuiz = new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Quiz')
        .addStringOption(commandQuizSub0)
        .addStringOption(commandQuizSub1)
        .addStringOption(commandQuizSub2)
        .addIntegerOption(commandQuizSub3)
        .addIntegerOption(commandQuizSub4)
        .addIntegerOption(commandQuizSub5)
        .addIntegerOption(commandQuizSub6)
    const commandGiftSub = new SlashCommandUserOption()
        .setName('user')
        .setDescription('Felhasználó')
        .setRequired(true)
    const commandGift = new SlashCommandBuilder()
        .setName('gift')
        .setDescription('Egy felhasználó megajándékozása')
        .addUserOption(commandGiftSub)

    const commandMarket = new SlashCommandBuilder()
        .setName('market')
        .setDescription('Piac')

    const commandCrossoutSub = new SlashCommandStringOption()
        .setName('search')
        .setDescription('A tárgy amit keresni szeretnél')
        .setRequired(true)
    const commandCrossout = new SlashCommandBuilder()
        .setName('crossout')
        .setDescription('Crossout')
        .addStringOption(commandCrossoutSub)

    const commandFont = new SlashCommandBuilder()
        .setName('font')
        .setDescription('Font converter')
    const commandFontSub0 = new SlashCommandStringOption()
        .setName('font')
        .setDescription('Font')
        .setRequired(true)
    const commandFontSub1 = new SlashCommandStringOption()
        .setName('text')
        .setDescription('Text')
        .setRequired(true)
    const fonts = GetFonts()
    for (let i = 0; i < fonts.length; i++) {
        if (i == 1) { continue }
        commandFontSub0.addChoice(StringToFont("Lorem ipsum", i), i.toString())
    }
    commandFont.addStringOption(commandFontSub1)
    commandFont.addStringOption(commandFontSub0)

    try {
        const guildCommands = bot.guilds.cache.get('737954264386764812').commands
        guildCommands?.create(commandPing.toJSON())
        guildCommands?.create(commandWeather.toJSON())
        guildCommands?.create(commandGift.toJSON())
        guildCommands?.create(commandXp.toJSON())
        guildCommands?.create(commandDev.toJSON())
        guildCommands?.create(commandHelp.toJSON())
        guildCommands?.create(commandCrate.toJSON())
        guildCommands?.create(commandNapi.toJSON())
        guildCommands?.create(commandProfil.toJSON())
        guildCommands?.create(commandBackpack.toJSON())
        guildCommands?.create(commandShop.toJSON())
        guildCommands?.create(commandQuiz.toJSON())
        guildCommands?.create(commandMarket.toJSON())
        guildCommands?.create(commandCrossout.toJSON())
        guildCommands?.create(commandFont.toJSON())
    } catch (error) {
        console.log(error)
    }
}

/**@param {Client} bot */
async function DeleteCommands(bot) {
    const guild = bot.guilds.cache.get('737954264386764812')
    const guildCommands = guild.commands
    await guildCommands.fetch()
    guildCommands.cache.forEach(async (val, key) => {
        await guildCommands.delete(val)
        console.log('Szerver parancsok törölése... (' + guildCommands.cache.size + ')')
    });

    const appCommands = bot.application?.commands
    await appCommands.fetch()
    appCommands.cache.forEach(async (val, key) => {
        await appCommands.delete(val)
        console.log('Bot parancsok törölése... (' + appCommands.cache.size + ')')
    });
}



module.exports = { CreateCommands, DeleteCommands }