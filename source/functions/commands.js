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
const Path = require('path')
const fs = require('fs')
const { LogError } = require('./errorLog')

const CommandsPath = Path.join(__dirname, '..', 'commands2')

function Load() {
    /** @type {Discord.Collection<string, import('../commands2/base').Command>} */
    const result = new Discord.Collection()
    const commandFiles = fs.readdirSync(CommandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = Path.join(CommandsPath, file)
        if (!fs.statSync(filePath).isFile()) { continue }

        try {
            /** @type {import('../commands2/base').Command} */
            const command = require(filePath)
            if ('Data' in command && 'Execute' in command) {
                result.set(command.Data.name, command)
            } else {
                console.warn(`The command at ${filePath} is missing a required "Data" or "Execute" property`)
            }
        } catch (error) {
            LogError(error)
        }
    }
    return result
}

/**
 * @param {string} name
 * @returns {import('../commands2/base').Command?}
 */
function Get(name) {
    const commandFiles = fs.readdirSync(CommandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = Path.join(CommandsPath, file)
        if (!fs.statSync(filePath).isFile()) { continue }

        try {
            /** @type {import("../commands2/base").Command} */
            const command = require(filePath)
            if ('Data' in command && 'Execute' in command) {
                if (command.Data.name === name) { return command }
            } else {
                console.warn(`The command at ${filePath} is missing a required "Data" or "Execute" property`)
            }
        } catch (error) {
            LogError(error)
        }
    }
    return null
}

/**
 * @param {Discord.Client} client
 */
async function CreateAll(client) {
    const commands = Load().toJSON()
    client.application.commands.fetch()
    for (const command of commands) {
        const commandContext = command.Guild
        if (!commandContext) {
            client.application.commands.create(command.Data)
        }
    }
}

/**
 * @param {Discord.Client} client
 */
async function DeleteAll(client) {
    const commands = await client.application.commands.fetch()
    for (const command of commands) {
        await client.application.commands.delete(command[1].id)
    }
}

/**
 * @param {Discord.Client} client
 * @param {string} name
 */
async function Delete(client, name) {
    const commands = await client.application.commands.fetch()
    for (const command of commands) {
        if (command[1].name === name) {
            await client.application.commands.delete(command[1].id)
            break
        }
    }
}

/**
 * @param {Discord.Client} client
 * @param {string} name
 * @param {string} guildId
 * @returns {Promise<Discord.ApplicationCommand<{}>?>}
 */
async function FetchFromGuild(client, name, guildId) {
    const guild = await client.guilds.fetch(guildId)
    const guildCommands = await guild.commands.fetch()
    for (const guildCommand of guildCommands) {
        if (guildCommand[1].name === name) {
            return guildCommand[1]
        }
    }

    return null
}

/**
 * @param {Discord.Client} client
 * @param {string} name
 * @returns {Promise<(Discord.ApplicationCommand<{ guild: Discord.GuildResolvable }>)?>}
 */
async function FetchFromGlobal(client, name) {
    const globalCommands = await client.application.commands.fetch()
    for (const globalCommand of globalCommands) {
        if (globalCommand[1].name === name) {
            return globalCommand[1]
        }
    }

    return null
}

/**
 * @param {Discord.Client} client
 * @param {import('../commands2/base').Command} command
 */
async function Update(client, command) {
    if (command.Guild) {
        const alreadyThere = await FetchFromGuild(client, command.Data.name, command.Guild)
        const guild = await client.guilds.fetch(command.Guild)
        if (alreadyThere) {
            await guild.commands.edit(alreadyThere.id, command.Data)
        } else {
            await guild.commands.create(command.Data)
        }
    } else {
        const alreadyThere = await FetchFromGlobal(client, command.Data.name)
        if (alreadyThere) {
            await client.application.commands.edit(alreadyThere.id, command.Data)
        } else {
            await client.application.commands.create(command.Data)
        }
    }
}

/**
 * @param {Discord.Client} client
 * @param {string} id
 * @returns {Promise<(Discord.ApplicationCommand<{}> | Discord.ApplicationCommand<{ guild: Discord.GuildResolvable }>)?>}
 */
async function Fetch(client, id) {
    const commands = Load().toJSON()
    for (const command of commands) {
        if (command.Guild) {
            const guild = await client.guilds.fetch(command.Guild)
            const guildCommands = await guild.commands.fetch()
            for (const guildCommand of guildCommands) {
                if (guildCommand[1].id === id) {
                    return guildCommand[1]
                }
            }
        }
    }

    const globalCommands = await client.application.commands.fetch()

    for (const command of commands) {
        if (!command.Guild) {
            for (const globalCommand of globalCommands) {
                if (globalCommand[1].id === id) {
                    return globalCommand[1]
                }
            }
        }
    }

    return null
}

/** @param {string[]} commandNames @param {string} commandDescription */
function GenerateCommand(commandNames, commandDescription) {
    /** @type {Discord.ApplicationCommandData[]} */
    const generatedCommands = []

    for (let i = 0; i < commandNames.length; i++) {
        generatedCommands.push({
            name: commandNames[i],
            description: commandDescription,
        })
    }

    return generatedCommands
}

function GenerateGuildCommands() {
    /** @type {Discord.ApplicationCommandData[]} */
    const generatedCommands = []

    GenerateCommand(
        ['xp', 'score'],
        'Rangod'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['dev'],
        'Fejlesztői segítség'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['test'],
        'Teszt'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['profil', 'profile'],
        'Statisztikák és matricák megtekintése'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['backpack'],
        'A hátizsákod tartalmának megtekintése'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['shop', 'bolt'],
        'Itt elköltheted a pénzed'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['market', 'piac'],
        'Piac, naponta változó árakkal'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['settings', 'preferences'],
        'Értesítési, és parancs beállítások'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['handlebars', 'webpage'],
        'Link a fiókod weblapjához'
    ).forEach((item) => {
        generatedCommands.push(item)
    })
    
    const commandTescoSub = new SlashCommandStringOption()
        .setName('search')
        .setDescription('Search')
        .setRequired(true)
    const commandTesco = new SlashCommandBuilder()
        .setName('tesco')
        .setDescription('Tesco')
        .addStringOption(commandTescoSub)
    generatedCommands.push(commandTesco.toJSON())
    
    const commandQuizdone = new SlashCommandBuilder()
        .setName('quizdone')
        .setDescription('Quiz befejezése')
    generatedCommands.push(commandQuizdone.toJSON())
    
    const commandCrateSub = new SlashCommandIntegerOption()
        .setName('darab')
        .setDescription('Ládák mennyisége')
        .setRequired(true)
    const commandCrate = new SlashCommandBuilder()
        .setName('crate')
        .setDescription('Láda kinyitása')
        .addIntegerOption(commandCrateSub)
    generatedCommands.push(commandCrate.toJSON())

    const commandNapiSub = new SlashCommandIntegerOption()
        .setName('darab')
        .setDescription('Heti ládák mennyisége')
        .setRequired(true)
    const commandNapi = new SlashCommandBuilder()
        .setName('heti')
        .setDescription('Heti láda kinyitása')
        .addIntegerOption(commandNapiSub)
    generatedCommands.push(commandNapi.toJSON())

    const commandQuizSub3 = new SlashCommandIntegerOption()
        .setName('add_xp')
        .setDescription('🍺 Mennyiség ha jól válaszol')
        .setRequired(true)
    const commandQuizSub4 = new SlashCommandIntegerOption()
        .setName('remove_xp')
        .setDescription('🍺 Mennyiség ha rosszul válaszol')
        .setRequired(true)
    const commandQuizSub5 = new SlashCommandIntegerOption()
        .setName('add_token')
        .setDescription('🎫 Mennyiség ha jól válaszol')
        .setRequired(true)
    const commandQuizSub6 = new SlashCommandIntegerOption()
        .setName('remove_token')
        .setDescription('🎫 Mennyiség ha rosszul válaszol')
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
    generatedCommands.push(commandQuiz.toJSON())

    const commandGiftSub = new SlashCommandUserOption()
        .setName('user')
        .setDescription('Felhasználó')
        .setRequired(true)
    const commandGift = new SlashCommandBuilder()
        .setName('gift')
        .setDescription('Egy felhasználó megajándékozása')
        .addUserOption(commandGiftSub)
    generatedCommands.push(commandGift.toJSON())

    const testContextMenu = new ContextMenuCommandBuilder()
        .setName('Megajándékozás')
        .setType(2)
    generatedCommands.push(testContextMenu.toJSON())
        
    const showMessageXpValueContextMenu = new ContextMenuCommandBuilder()
        .setName('Xp érték')
        .setType(3)
    generatedCommands.push(showMessageXpValueContextMenu.toJSON())

    const commandHangman = new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Hangman játék')
    generatedCommands.push(commandHangman.toJSON())

    return generatedCommands
}

function GenerateGlobalCommands() {
    /** @type {Discord.ApplicationCommandData[]} */
    const generatedCommands = []

    GenerateCommand(
        ['ping'],
        'A BOT ping-elése, avagy megnézni hogy most épp elérhető-e'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    GenerateCommand(
        ['help'],
        'A parancsok listája'
    ).forEach((item) => {
        generatedCommands.push(item)
    })

    const commandWeather = new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Időjárása')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Weather location')
                .setRequired(false)
                .addChoices(
                    { name: 'Earth - Békéscsaba', value: 'earth' },
                    { name: 'Mars - Jezero Kráter', value: 'mars' }
                ))
    generatedCommands.push(commandWeather.toJSON())
    
    const commandCrossoutSub = new SlashCommandStringOption()
        .setName('search')
        .setDescription('A tárgy amit keresni szeretnél')
        .setRequired(true)
    const commandCrossout = new SlashCommandBuilder()
        .setName('crossout')
        .setDescription('Crossout')
        .addStringOption(commandCrossoutSub)
    generatedCommands.push(commandCrossout.toJSON())

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
        commandFontSub0.addChoices({ name: StringToFont("Lorem ipsum", i), value: i.toString() })
    }
    commandFont.addStringOption(commandFontSub1)
    commandFont.addStringOption(commandFontSub0)
    generatedCommands.push(commandFont.toJSON())

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

    generatedCommands.push(commandMusic.toJSON())
        
    return generatedCommands
}

/**
 * @param {Client} bot
 * @param {StatesManager} statesManager
 */
function CreateCommands(bot, statesManager) {
    const guildCommands = GenerateGuildCommands()
    const globalCommands = GenerateGlobalCommands()

    try {
        statesManager.Commands.All = guildCommands.length + globalCommands
        statesManager.Commands.Created = 0

        bot.application.commands.create()
        const commandsGuild = bot.guilds.cache.get('737954264386764812').commands
        const commandsGlobal = bot.application.commands

        for (let i = 0; i < guildCommands.length; i++) {
            const command = guildCommands[i];
            commandsGuild?.create(command).finally(() => {
               statesManager.Commands.Created += 1
            })
        }

        for (let i = 0; i < globalCommands.length; i++) {
            const command = globalCommands[i];
            commandsGlobal?.create(command).finally(() => {
               statesManager.Commands.Created += 1
            })
        }
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
            //console.log('Szerver parancsok törölése... (' + guildCommands.cache.size + ')')
        })
    
        const appCommands = bot.application?.commands
        await appCommands.fetch()
        appCommands.cache.forEach(async (val, key) => {
            await appCommands.delete(val)
            //console.log('Bot parancsok törölése... (' + appCommands.cache.size + ')')
        })
    } catch (error) {
        console.error(error)
    }
}

/**
 * @param {Client} bot
 * @param {StatesManager} statesManager
 * @param {(process: number) => any} StepCallback
 * @param {() => any} FinishCallback
*/
function DeleteCommandsSync(bot, statesManager, StepCallback, FinishCallback) {
    try {
        statesManager.Commands.Deleted = 0

        const guildCommands = bot.guilds.cache.get('737954264386764812').commands
        const appCommands = bot.application?.commands
        guildCommands.fetch().then(() => {
            appCommands.fetch().then(() => {    
                statesManager.Commands.All = guildCommands.cache.size + appCommands.cache.size

                guildCommands.cache.forEach(async (val, key) => {
                    guildCommands.delete(val).finally(() => {
                        statesManager.Commands.Deleted += 1
                        StepCallback(statesManager.Commands.Deleted / statesManager.Commands.All)
                        if (statesManager.Commands.Deleted == statesManager.Commands.All) {
                             FinishCallback()
                        }
                    })
                    //console.log('Szerver parancsok törölése... (' + guildCommands.cache.size + ')')
                })

                appCommands.cache.forEach(async (val, key) => {
                    appCommands.delete(val).finally(() => {
                        statesManager.Commands.Deleted += 1
                        StepCallback(statesManager.Commands.Deleted / statesManager.Commands.All)
                        if (statesManager.Commands.Deleted == statesManager.Commands.All) {
                             FinishCallback()
                        }
                    })
                    //console.log('Bot parancsok törölése... (' + appCommands.cache.size + ')')
                })
            })
        })
    } catch (error) {
        console.error(error)
    }
}

/**
 * @param {Client} bot
 * @param {StatesManager} statesManager
 * @param {(process: number) => any} StepCallback
 * @param {() => any} FinishCallback
 */
function CreateCommandsSync(bot, statesManager, StepCallback, FinishCallback) {
    const guildCommands = GenerateGuildCommands()
    const globalCommands = GenerateGlobalCommands()

    try {
        statesManager.Commands.All = guildCommands.length + globalCommands.length
        statesManager.Commands.Created = 0

        const commandsGuild = bot.guilds.cache.get('737954264386764812').commands
        const commandsGlobal = bot.application.commands

        for (let i = 0; i < guildCommands.length; i++) {
            const command = guildCommands[i];
            commandsGuild?.create(command).finally(() => {
                //console.log('create bot command ' + Math.round(statesManager.Commands.Created / statesManager.Commands.All * 100) + '%')
                statesManager.Commands.Created += 1
                StepCallback(statesManager.Commands.Created / statesManager.Commands.All)
                if (statesManager.Commands.Created == statesManager.Commands.All) {
                    FinishCallback()
                }
            })
        }

        for (let i = 0; i < globalCommands.length; i++) {
            const command = globalCommands[i];
            commandsGlobal?.create(command).finally(() => {
                //console.log('create global command ' + Math.round(statesManager.Commands.Created / statesManager.Commands.All * 100) + '%')
                statesManager.Commands.Created += 1
                StepCallback(statesManager.Commands.Created / statesManager.Commands.All)
                if (statesManager.Commands.Created == statesManager.Commands.All) {
                    FinishCallback()
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
}

/** @param {Client} bot @param {string} commandID @param {() => any} FinishCallback */
function DeleteCommand(bot, commandID, FinishCallback) {
    try {
        const guildCommands = bot.guilds.cache.get('737954264386764812').commands
        const appCommands = bot.application?.commands
        guildCommands.fetch().then(() => {
            appCommands.fetch().then(() => {    
                guildCommands.cache.forEach(async (val, key) => {
                    if (val.id == commandID) {
                        guildCommands.delete(val).finally(() => { FinishCallback() })
                        return
                    }
                })

                appCommands.cache.forEach(async (val, key) => {
                    if (val.id == commandID) {
                        appCommands.delete(val).finally(() => { FinishCallback() })
                        return
                    }
                })
            })
        })
    } catch (error) {
        console.error(error)
    }
}

/**
 * @param {string} commandName
 * @param {string?} commandDescription
 * @returns {Discord.ApplicationCommandData | Discord.RESTPostAPIApplicationCommandsJSONBody | null}
 */
function GetCommandData(commandName, commandDescription = null) {
    var x = GenerateGlobalCommands()
    var y = GenerateGuildCommands()

    for (let i = 0; i < x.length; i++) {
        const item = x[i]
        if (item.name == commandName && (!commandDescription || item.description == commandDescription)) {
            return item
        }
    }
    for (let i = 0; i < y.length; i++) {
        const item = y[i]
        if (item.name == commandName && (!commandDescription || item.description == commandDescription)) {
            return item
        }
    }
    return null
}

/**
 * @param {Client} bot
 * @param {string} commandID
 * @returns {Promise<void>}
 */
function Updatecommand(bot, commandID) {
    return new Promise((resolve, reject) => {
        try {
            const guildCommands = bot.guilds.cache.get('737954264386764812').commands
            const appCommands = bot.application?.commands
            guildCommands.fetch().then(() => {
                appCommands.fetch().then(() => {
                    guildCommands.cache.forEach(async (val, key) => {
                        if (val.id == commandID) {
                            val.edit(GetCommandData(val.name, val.description))
                            resolve()
                            return
                        }
                    })
    
                    appCommands.cache.forEach(async (val, key) => {
                        if (val.id == commandID) {
                            val.edit(GetCommandData(val.name, val.description))
                            resolve()
                            return
                        }
                    })
                })
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    // CreateCommands,
    // DeleteCommands,
    // CreateCommandsSync,
    // DeleteCommandsSync,
    // DeleteCommand,
    // Updatecommand,

    Load,
    Get,
    Delete,
    Fetch,
    CreateAll,
    DeleteAll,
    FetchFromGuild,
    FetchFromGlobal,
    Update,
}