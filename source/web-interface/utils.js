// @ts-check

const Discord = require('discord.js')
const LogError = require('../functions/errorLog')
const CacheManager = require('../functions/offline-cache')
const { GetID, GetHash } = require('../economy/userHashManager')
const { DatabaseManager } = require('../functions/databaseManager.js')
const {
    WsStatusText,
    NsfwLevel,
    VerificationLevel,
    MFALevel
} = require('../functions/enums')
const { GetTime, GetDataSize, GetDate } = require('../functions/functions')
const ArchiveBrowser = require('../functions/archive-browser')
const HarBrowser = require('../functions/har-discord-browser')
const ContentParser = require('./content-parser')

/**
 * @param {Discord.User} user
 * @param {DatabaseManager?} database
 */
function UserJson(user, database = null) {
    const userJson = {
        defaultAvatarUrl: user.defaultAvatarURL,
        avatarUrlSmall: user.avatarURL({ size: 16 }),
        avatarUrlMedium: user.avatarURL({ size: 32 }),
        avatarUrlBig: user.avatarURL({ size: 128 }),
        id: user.id,
        flags: {
            BotHTTPInteractions: false,
            BugHunterLevel1: false,
            BugHunterLevel2: false,
            CertifiedModerator: false,
            HypeSquadOnlineHouse1: false,
            HypeSquadOnlineHouse2: false,
            HypeSquadOnlineHouse3: false,
            Hypesquad: false,
            Partner: false,
            PremiumEarlySupporter: false,
            Quarantined: false,
            Spammer: false,
            Staff: false,
            TeamPseudoUser: false,
            VerifiedBot: false,
            VerifiedDeveloper: false,
        },
        partial: user.partial,
        hexAccentColor: user.hexAccentColor,
        bot: user.bot,
        createdAt: GetDate(user.createdAt),
        discriminator: user.discriminator,
        system: user.system,
        username: user.username,
        haveHash: (GetHash(user.id) !== null && GetHash(user.id) !== undefined),
        hash: '' + GetHash(user.id),
        createdAtText: user.createdAt.getFullYear() + '. ' + user.createdAt.getMonth() + '. ' + user.createdAt.getDate() + '.',
        haveDatabase: database ? database.dataBasic[user.id] !== undefined : false,        
    }
    if (user.flags !== undefined && user.flags !== null) {            
        userJson.flags.BotHTTPInteractions = user.flags.has('BotHTTPInteractions')
        userJson.flags.BugHunterLevel1 = user.flags.has('BugHunterLevel1')
        userJson.flags.BugHunterLevel2 = user.flags.has('BugHunterLevel2')
        userJson.flags.CertifiedModerator = user.flags.has('CertifiedModerator')
        userJson.flags.HypeSquadOnlineHouse1 = user.flags.has('HypeSquadOnlineHouse1')
        userJson.flags.HypeSquadOnlineHouse2 = user.flags.has('HypeSquadOnlineHouse2')
        userJson.flags.HypeSquadOnlineHouse3 = user.flags.has('HypeSquadOnlineHouse3')
        userJson.flags.Hypesquad = user.flags.has('Hypesquad')
        userJson.flags.Partner = user.flags.has('Partner')
        userJson.flags.PremiumEarlySupporter = user.flags.has('PremiumEarlySupporter')
        userJson.flags.Quarantined = user.flags.has('Quarantined')
        userJson.flags.Spammer = user.flags.has('Spammer')
        userJson.flags.Staff = user.flags.has('Staff')
        userJson.flags.TeamPseudoUser = user.flags.has('TeamPseudoUser')
        userJson.flags.VerifiedBot = user.flags.has('VerifiedBot')
        userJson.flags.VerifiedDeveloper = user.flags.has('VerifiedDeveloper')
    }
    return userJson
}

/**
 * @param {Discord.Client} client
 */
function UsersCache(client) {
    const users = []

    client.users.cache.forEach(user => {
        const userJson = UserJson(user)
        userJson['cache'] = false
        users.push(userJson)
    })

    const archivedUsers = ArchiveBrowser.Users()

    for (const archivedUser of archivedUsers) {
        var found = false
        for (let j = 0; j < users.length; j++) {
            const user = users[j]
            if (user.id == archivedUser.id) {
                found = true
                break
            }
        }
        if (!found) {
            const userJson = {
                id: archivedUser.id,
                avatarUrlSmall: archivedUser.user.avatar ? `https://cdn.discordapp.com/avatars/${archivedUser.id}/${archivedUser.user.avatar}.webp?size=16` : null,
                avatarUrlMedium: archivedUser.user.avatar ? `https://cdn.discordapp.com/avatars/${archivedUser.id}/${archivedUser.user.avatar}.webp?size=32` : null,
                avatarUrlLarge: archivedUser.user.avatar ? `https://cdn.discordapp.com/avatars/${archivedUser.id}/${archivedUser.user.avatar}.webp` : null,
                discriminator: archivedUser.user.discriminator,
                username: archivedUser.user.username,
                hexAccentColor: null,
            }
            userJson['cache'] = false
            userJson['archived'] = true
            users.push(userJson)
        }
    }

    const usersSaved = CacheManager.GetUsers(client)

    for (let i = 0; i < usersSaved.length; i++) {
        const userSaved = usersSaved[i]
        var found = false
        for (let j = 0; j < users.length; j++) {
            const user = users[j]
            if (user.id == userSaved.id) {
                found = true
                break
            }
        }
        if (!found) {
            const userJson = UserJson(userSaved)
            userJson['cache'] = true
            users.push(userJson)
        }
    }

    return users
}

/**
 * @param {Discord.Client} client
 */
function ServersCache(client) {
    const servers = []

    client.guilds.cache.forEach(server => {
        const newServer = {
            iconUrlSmall: server.iconURL({ size: 16 }),
            iconUrlLarge: server.iconURL({ size: 128 }),

            name: server.name,
            id: server.id,

            createdAt: GetDate(server.createdAt),
            joinedAt: GetDate(server.joinedAt),
            createdAtText: server.createdAt.getFullYear() + '. ' + server.createdAt.getMonth() + '. ' + server.createdAt.getDate() + '.',
            joinedAtText: server.joinedAt.getFullYear() + '. ' + server.joinedAt.getMonth() + '. ' + server.joinedAt.getDate() + '.',

            memberCount: server.memberCount,
            nsfwLevel: NsfwLevel[server.nsfwLevel],
            mfaLevel: MFALevel[server.mfaLevel],
            verificationLevel: server.verificationLevel,
            splash: server.splash,

            available: server.available,
            large: server.large,
        }

        servers.push(newServer)
    })

    return servers
}

/**
 * @param {Discord.Client} client
 */
function ChannelsCache(client) {
    /** @param {Discord.ChannelType.GuildText | Discord.ChannelType.DM | Discord.ChannelType.GuildVoice | Discord.ChannelType.GroupDM | Discord.ChannelType.GuildNews | Discord.ChannelType.GuildNewsThread | Discord.ChannelType.GuildPublicThread | Discord.ChannelType.GuildPrivateThread | Discord.ChannelType.GuildStageVoice} type */
    const GetTypeUrl = (type) => {
        if (type == Discord.ChannelType.GuildNews|| type == Discord.ChannelType.GuildText) {
            return 'text'
        }
        if (type == Discord.ChannelType.GuildStageVoice || type == Discord.ChannelType.GuildVoice) {
            return 'voice'
        }
    }

    /** @param {Discord.ChannelType.GuildText | Discord.ChannelType.DM | Discord.ChannelType.GuildVoice | Discord.ChannelType.GroupDM | Discord.ChannelType.GuildNews | Discord.ChannelType.GuildNewsThread | Discord.ChannelType.GuildPublicThread | Discord.ChannelType.GuildPrivateThread | Discord.ChannelType.GuildStageVoice} type */
    const GetTypeText = (type) => {
        if (type == Discord.ChannelType.GuildNews || type == Discord.ChannelType.GuildText) {
            return 'Text channel'
        }
        if (type == Discord.ChannelType.GuildStageVoice || type == Discord.ChannelType.GuildVoice) {
            return 'Voice channel'
        }
    }

    const groups = []
    const singleChannels = []

    client.channels.cache.forEach(channel => {
        if (channel.type == Discord.ChannelType.GuildCategory) {
            const channels = []

            channel.children.cache.forEach(child => {
                const newChannel = {
                    id: child.id,
                    createdAt: GetDate(child.createdAt),
                    deletable: child.deletable,
                    // @ts-ignore
                    joinable: child.joinable,
                    // @ts-ignore
                    locked: child.locked,
                    manageable: child.manageable,
                    name: child.name,
                    nsfw: child.nsfw,
                    // @ts-ignore
                    sendable: child.sendable,
                    // @ts-ignore
                    speakable: child.speakable,
                    type: child.type,
                    // @ts-ignore
                    unarchivable: child.unarchivable,
                    viewable: child.viewable,
                    parentId: child.parentId,
                    // @ts-ignore
                    typeText: GetTypeText(child.type),
                    // @ts-ignore
                    typeUrl: GetTypeUrl(child.type),
                    url: child.url,
                    commands: ['Fetch'],
                }

                // @ts-ignore
                if (child.joinable) {
                    newChannel.commands.push('Join')
                }

                channels.push(newChannel)
            })

            const newGroup = {
                id: channel.id,
                createdAt: GetDate(channel.createdAt),
                deletable: channel.deletable,
                manageable: channel.manageable,
                name: channel.name,
                viewable: channel.viewable,
                url: channel.url,
                channels: channels,
                commands: ['Fetch'],
            }

            groups.push(newGroup)
            // @ts-ignore
        } else if (channel.parentId == null) {
            const newChannel = {
                id: channel.id,
                createdAt: GetDate(channel.createdAt),
                // @ts-ignore
                invitable: channel.invitable,
                // @ts-ignore
                joinable: channel.joinable,
                // @ts-ignore
                locked: channel.locked,
                // @ts-ignore
                manageable: channel.manageable,
                // @ts-ignore
                name: channel.name,
                // @ts-ignore
                nsfw: channel.nsfw,
                // @ts-ignore
                sendable: channel.sendable,
                // @ts-ignore
                speakable: channel.speakable,
                type: channel.type,
                // @ts-ignore
                unarchivable: channel.unarchivable,
                // @ts-ignore
                viewable: channel.viewable,
                // @ts-ignore
                parentId: channel.parentId,
                // @ts-ignore
                typeText: GetTypeText(channel.type),
                // @ts-ignore
                typeUrl: GetTypeUrl(channel.type),
                url: channel.url,
                commands: ['Fetch'],
            }

            // @ts-ignore
            if (channel.joinable) {
                newChannel.commands.push('Join')
            }

            singleChannels.push(newChannel)
        }
    });

    return { groups: groups, singleChannels: singleChannels }
}

/**
 * @param {Discord.Guild} guild
 */
function ChannelsInGuild(guild) {
    /** @param {Discord.ChannelType.GuildText | Discord.ChannelType.DM | Discord.ChannelType.GuildVoice | Discord.ChannelType.GroupDM | Discord.ChannelType.GuildNews | Discord.ChannelType.GuildNewsThread | Discord.ChannelType.GuildPublicThread | Discord.ChannelType.GuildPrivateThread | Discord.ChannelType.GuildStageVoice} type */
    const GetTypeUrl = (type) => {
        if (type == Discord.ChannelType.GuildText) {
            return 'text'
        }
        if (type == Discord.ChannelType.GuildStageVoice || type == Discord.ChannelType.GuildVoice) {
            return 'voice'
        }
    }

    /** @param {Discord.ChannelType.GuildText | Discord.ChannelType.DM | Discord.ChannelType.GuildVoice | Discord.ChannelType.GroupDM | Discord.ChannelType.GuildNews | Discord.ChannelType.GuildNewsThread | Discord.ChannelType.GuildPublicThread | Discord.ChannelType.GuildPrivateThread | Discord.ChannelType.GuildStageVoice} type */
    const GetTypeText = (type) => {
        if (type == Discord.ChannelType.GuildText) {
            return 'Text channel'
        }
        if (type == Discord.ChannelType.GuildStageVoice || type == Discord.ChannelType.GuildVoice) {
            return 'Voice channel'
        }
    }

    const groups = []
    /**
     * @type {{
     *   id: string
     *   name: string
     *   position: number
     * }[]}
     */
    const singleChannels = []

    guild.channels.cache.forEach(channel => {
        if (channel.type === Discord.ChannelType.GuildCategory) {
            const channels = []

            channel.children.cache.forEach(child => {
                const newChannel = {
                    id: child.id,
                    createdAt: GetDate(child.createdAt),
                    deletable: child.deletable,
                    // @ts-ignore
                    invitable: child.invitable,
                    // @ts-ignore
                    joinable: child.joinable,
                    // @ts-ignore
                    locked: child.locked,
                    manageable: child.manageable,
                    name: child.name,
                    nsfw: child.nsfw,
                    // @ts-ignore
                    sendable: child.sendable,
                    // @ts-ignore
                    speakable: child.speakable,
                    type: child.type,
                    // @ts-ignore
                    unarchivable: child.unarchivable,
                    viewable: child.viewable,
                    parentId: child.parentId,
                    // @ts-ignore
                    typeText: GetTypeText(child.type),
                    // @ts-ignore
                    typeUrl: GetTypeUrl(child.type),
                    position: child.position,
                    isAfk: guild.afkChannelId === child.id,
                    commands: ['Fetch'],
                }

                // @ts-ignore
                if (child.joinable) {
                    newChannel.commands.push('Join')
                }

                channels.push(newChannel)
            })
            
            channels.sort(function(a, b) { return a.position - b.position })

            const newGroup = {
                id: channel.id,
                createdAt: GetDate(channel.createdAt),
                deletable: channel.deletable,
                manageable: channel.manageable,
                name: channel.name,
                viewable: channel.viewable,
                channels: channels,
                commands: ['Fetch'],
            }

            groups.push(newGroup)
        } else if (channel.parentId == null) {
            const newChannel = {
                id: channel.id,
                createdAt: GetDate(channel.createdAt),
                // @ts-ignore
                deletable: channel.deletable,
                // @ts-ignore
                invitable: channel.invitable,
                // @ts-ignore
                joinable: channel.joinable,
                // @ts-ignore
                locked: channel.locked,
                // @ts-ignore
                position: channel.position,
                manageable: channel.manageable,
                name: channel.name,
                // @ts-ignore
                nsfw: channel.nsfw,
                // @ts-ignore
                sendable: channel.sendable,
                // @ts-ignore
                speakable: channel.speakable,
                type: channel.type,
                // @ts-ignore
                unarchivable: channel.unarchivable,
                viewable: channel.viewable,
                parentId: channel.parentId,
                // @ts-ignore
                typeText: GetTypeText(channel.type),
                // @ts-ignore
                typeUrl: GetTypeUrl(channel.type),
                isAfk: guild.afkChannelId === channel.id,
                commands: ['Fetch'],
            }

            // @ts-ignore
            if (channel.joinable) {
                newChannel.commands.push('Join')
            }

            singleChannels.push(newChannel)
        }
    });

    singleChannels.sort(function(a, b) { return a.position - b.position })

    return { groups: groups, singleChannels: singleChannels }
}

/**
 * @param {import('discord.js').Client} client
 * @param {string} content
 * @param {string?} serverID
 */
function GetHandlebarsMessage(client, content, serverID = undefined) {
    const result = (new ContentParser.Parser(content)).result

    var attachmentCounter = 0
    for (let i = 0; i < result.length; i++) {
        switch (result[i].type) {
            case 'URL':
                {
                    const URL = require('node:url')
                    const url = URL.parse(result[i].data)
                    if (url.path.toLowerCase().endsWith('.png') ||
                    url.path.toLowerCase().endsWith('.jpg') ||
                    url.path.toLowerCase().endsWith('.gif')) {
                        attachmentCounter += 1
                        result[i].attachmentID = attachmentCounter
                        result.push({
                            type: 'IMG',
                            data: result[i].data,
                            attachmentID: attachmentCounter
                        })
                    } else if (url.path.toLowerCase().endsWith('.mov') ||
                                url.path.toLowerCase().endsWith('.mp4')) {
                        attachmentCounter += 1
                        result[i].attachmentID = attachmentCounter
                        result.push({
                            type: 'VIDEO',
                            data: result[i].data,
                            attachmentID: attachmentCounter
                        })
                    }
                    break
                }
            case 'USER':
                {
                    if (client.users.cache.has(result[i].data)) {
                        const details = client.users.cache.get(result[i].data)
                        result[i].details = {
                            username: details.username,
                            avatarURL: details.avatarURL({ size: 16 }),
                            defaultAvatarURL: details.defaultAvatarURL,
                        }
                    }
                    break
                }
            case 'CHANNEL':
                {
                    if (client.channels.cache.has(result[i].data)) {
                        const details = client.channels.cache.get(result[i].data)
                        result[i].details = {
                            // @ts-ignore
                            name: details.name,
                        }
                    }
                    break
                }
            case 'EMOJI':
                {
                    const parsedEmoji = Discord.parseEmoji(result[i].data)
                    var details = {
                        id: parsedEmoji.id,
                        animated: parsedEmoji.animated,
                        name: parsedEmoji.name
                    }
                    
                    if (client.emojis.cache.has(parsedEmoji.id)) {
                        details.url = client.emojis.cache.get(parsedEmoji.id).url
                    }

                    result[i].details = details
                    break
                }
            case 'ROLE':
                {
                    // @ts-ignore
                    if (serverID && serverID.length > 0) {
                        // @ts-ignore
                        const guild = client.guilds.cache.get(serverID)
                        if (!guild) break
                        if (guild.roles.cache.has(result[i].data)) {
                            const details = guild.roles.cache.get(result[i].data)
                            result[i].details = {
                                name: details.name,
                                hexColor: details.hexColor,
                            }
                        }
                    }
                    break
                }
            default:
                {
                    break
                }
        }
    }

    return result
}

module.exports = {
    UserJson,
    UsersCache,
    ServersCache,
    ChannelsCache,
    ChannelsInGuild,
    GetHandlebarsMessage,
}