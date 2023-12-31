const { Client } = require('discord.js')
const Discord = require('discord.js')
const Path = require('path')
const fs = require('fs')
const LogError = require('./errorLog').LogError

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

module.exports = {
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