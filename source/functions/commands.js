const {
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandBooleanOption,
    SlashCommandStringOption,
    SlashCommandUserOption,
    SlashCommandSubcommandBuilder,
    ContextMenuCommandBuilder
} = require('@discordjs/builders');
const { Client } = require('discord.js')
const { GetFonts, StringToFont } = require('../commands/fonts')
const Discord = require('discord.js')
const { StatesManager } = require('./statesManager')

/**@param {Client} bot @param {StatesManager} statesManager */
function CreateCommands(bot, statesManager) {
    const commandPing = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('A BOT ping-elése, avagy megnézni hogy most épp elérhető e')
    const commandWeather = new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Békéscsaba időjárása')
    const commandXp = new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Rangod')
    const commandDev = new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Fejlesztői segítség')
    const commandHelp = new SlashCommandBuilder()
        .setName('help')
        .setDescription('A parancsok listája')
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

    const commandMusic = new SlashCommandBuilder()
        .setName('music')
        .setDescription('YouTube zenelejátszó')
    const commandMusicSub0 = new SlashCommandSubcommandBuilder()
        .setName('play')
        .setDescription('YouTube zene lejátszása')
    const commandMusicSub0a = new SlashCommandStringOption()
        .setName('url')
        .setDescription('YouTube link')
        .setRequired(true)
    commandMusicSub0.addStringOption(commandMusicSub0a)

    const commandMusicSub1 = new SlashCommandSubcommandBuilder()
        .setName('skip')
        .setDescription('A most hallható zene átugrása')

    const commandMusicSub2 = new SlashCommandSubcommandBuilder()
        .setName('list')
        .setDescription('A lejátszólista megtekintése')
    
    commandMusic.addSubcommand(commandMusicSub0)
    commandMusic.addSubcommand(commandMusicSub1)
    commandMusic.addSubcommand(commandMusicSub2)

    const commandSettings = new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Értesítési, és parancs beállítások')
        
    const testContextMenu = new ContextMenuCommandBuilder()
        .setName('Megajándékozás')
        .setType(2)

    const commandWordle = new SlashCommandBuilder()
        .setName('wordle')
        .setDescription('Wordle játék (angol)')

    const fonts = GetFonts()
    for (let i = 0; i < fonts.length; i++) {
        if (i == 1) { continue }
        commandFontSub0.addChoices({ name: StringToFont("Lorem ipsum", i), value: i.toString() })
    }
    commandFont.addStringOption(commandFontSub1)
    commandFont.addStringOption(commandFontSub0)

    try {
        statesManager.commandAllCommandCount = 19
        statesManager.commandCreatedCount = 0

        const guildCommands = bot.guilds.cache.get('737954264386764812').commands
        guildCommands?.create(commandPing.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandWeather.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandGift.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandXp.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandDev.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandHelp.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandCrate.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandNapi.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandProfil.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandBackpack.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandShop.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandQuiz.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandMarket.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandCrossout.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandFont.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandMusic.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(testContextMenu.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandWordle.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
        guildCommands?.create(commandSettings.toJSON()).finally(() => { /*console.log('Create commands ' + Math.round((statesManager.commandCreatedCount / statesManager.commandAllCommandCount) * 100) + '%');*/ statesManager.commandCreatedCount += 1 })
    } catch (error) {
        console.error(error)
    }
}

/**@param {Client} bot */
async function DeleteCommands(bot) {
    try {
        const guild = bot.guilds.cache.get('737954264386764812')
        const guildCommands = guild.commands
        await guildCommands.fetch()
        guildCommands.cache.forEach(async (val, key) => {
            await guildCommands.delete(val)
            console.log('Szerver parancsok törölése... (' + guildCommands.cache.size + ')')
        })
    
        const appCommands = bot.application?.commands
        await appCommands.fetch()
        appCommands.cache.forEach(async (val, key) => {
            await appCommands.delete(val)
            console.log('Bot parancsok törölése... (' + appCommands.cache.size + ')')
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = { CreateCommands, DeleteCommands }