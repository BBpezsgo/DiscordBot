const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandBooleanOption } = require('@discordjs/builders');
const { Client } = require('discord.js')

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
        .addIntegerOption(commandCrateSub)
    const commandProfil = new SlashCommandBuilder()
        .setName('profil')
        .setDescription('Statisztikák és matricák megtekintése')
    const commandBackpack = new SlashCommandBuilder()
        .setName('store')
        .setDescription('A hátizsákod tartalmának megtekintése.')
    const commandShop = new SlashCommandBuilder()
        .setName('bolt')
        .setDescription('Itt elköltheted a pénzed')
    const guildCommands = bot.guilds.cache.get('737954264386764812').commands
    guildCommands?.create(commandPing.toJSON())
    guildCommands?.create(commandWeather.toJSON())
    guildCommands?.create(commandXp.toJSON())
    guildCommands?.create(commandDev.toJSON())
    guildCommands?.create(commandHelp.toJSON())
    guildCommands?.create(commandCrate.toJSON())
    guildCommands?.create(commandNapi.toJSON())
    guildCommands?.create(commandProfil.toJSON())
    guildCommands?.create(commandBackpack.toJSON())
    guildCommands?.create(commandShop.toJSON())
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



module.exports = {CreateCommands, DeleteCommands}