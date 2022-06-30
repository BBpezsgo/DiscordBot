const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const Discord = require('discord.js')
const { LogManager, MessageCodes } = require('../functions/log.js')
const fs = require('fs')
const { DatabaseManager } = require('../functions/databaseManager.js')
const { StatesManager } = require('../functions/statesManager')
const {
    INFO,
    ERROR,
    WARNING,
    DEBUG,
    DONE,
    WsStatusText,
    NsfwLevel,
    VerificationLevel,
    MFALevel
} = require('../functions/enums')
const { GetTime, GetDataSize, GetDate } = require('../functions/functions')
const { SystemLog, GetLogs, GetUptimeHistory } = require('../functions/systemLog')
const { HbLog, HbGetLogs, HbStart } = require('./log')

const SERVER = '[' + '\033[36m' + 'SERVER' + '\033[40m' + '' + '\033[37m' + ']'

class WebSocket {
    /**
     * @param {string} password
     * @param {string} ip
     * @param {number} port
     * @param {Discord.Client} client
     * @param {LogManager} logManager
     * @param {DatabaseManager} database
     * @param {StatesManager} statesManager
     * @param {boolean} isMobile
     */
    constructor(password, ip, port, client, logManager, database, StartBot, StopBot, statesManager, isMobile) {
        this.password = password
        this.client = client
        this.StartBot = StartBot
        this.StopBot = StopBot
        /** @type {boolean} */
        this.IsMobile = isMobile

        this.logManager = logManager
        this.database = database

        this.statesManager = statesManager

        if (isMobile == false) { HbStart() }

        this.app = express()
        this.app.engine('hbs', engine({
            extname: '.hbs',
            defaultLayout: 'layout',
            layoutsDir: __dirname + '/layouts'
        }))
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.set('view engine', 'hbs')
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())

        this.app.use((req, res, next) => {
            const auth = { login: 'bb', password: 'bb' }

            const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
            const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

            if (login && password && login === auth.login && password === auth.password) {
                return next()
            }

            if (this.IsMobile == false) {
                HbLog({ IP: req.ip, type: 'NORMAL', message: 'Failed to log in with username "' + login + '" and password "' + password + '"' })
            }

            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).render('userRpm/401')
        })

        this.registerRoots()

        this.server = this.app.listen(port, ip, () => {
            this.logManager.Log(SERVER + ': ' + 'Listening on http://' + this.server.address().address + ":" + this.server.address().port, true, null, MessageCodes.HandlebarsFinishLoading)
            this.statesManager.handlebarsDone = true
            this.statesManager.handlebarsURL = 'http://' + this.server.address().address + ":" + this.server.address().port
            if (this.IsMobile == false) {
                HbLog({ type: 'NORMAL', message: 'Listening on ' + ip + ':' + port })
            }
        })
        this.server.on('error', (err) => {
            if (err.message.startsWith('listen EADDRNOTAVAIL: address not available')) {
                this.statesManager.handlebarsErrorMessage = 'Address not available'
            } else {
                this.statesManager.handlebarsErrorMessage = err.message
            }
            if (this.IsMobile == false) {
                HbLog({ type: 'ERROR', message: err.message, helperMessage: 'Server error: ' + err.message })
            }
        })
        this.server.on('clientError', (err, socket) => {
            this.logManager.Log(ERROR + ': ' + err, true)
            if (this.IsMobile == false) {
                HbLog({ type: 'CLIENT_ERROR', message: err.message, helperMessage: 'Client error: ' + err.message })
            }

            if (err.code === 'ECONNRESET' || !socket.writable) {
                return
            }
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        })
        this.server.on('close', () => {
            this.statesManager.handlebarsDone = false
            this.statesManager.handlebarsURL = ''
            this.logManager.Log(SERVER + ': ' + "Closed", true)
            if (this.IsMobile == false) {
                HbLog({ type: 'NORMAL', message: 'Server closed' })
            }
        })
        this.server.on('connect', (req, socket, head) => {
            this.logManager.Log(DEBUG + ': ' + "connect", true)
            if (this.IsMobile == false) {
                HbLog({ IP: req.socket.remoteAddress, type: 'CONNECT', url: req.url, method: req.method, helperMessage: 'Someone wanted to connect' })
            }
        })
        this.server.on('connection', (socket) => {
            this.statesManager.handlebarsClients.push(socket)
            this.statesManager.handlebarsClientsTime.push(10)
        })
        this.server.on('request', (req, res) => {
            this.statesManager.handlebarsRequiests.push(10)
            if (this.IsMobile == false) {
                HbLog({ IP: req.socket.remoteAddress, type: 'REQUIEST', url: req.url, method: req.method, helperMessage: 'Someone requiested' })
            }
        })
        this.server.on('upgrade', (req, socket, head) => {
            this.logManager.Log(DEBUG + ': ' + "upgrade", true)
            if (this.IsMobile == false) {
                HbLog({ IP: req.socket.remoteAddress, type: 'NORMAL', message: 'Upgrade', helperMessage: 'Someone upgraded' })
            }
        })



        this.databaseSearchedUserId = ''
        this.moderatingSearchedServerId = ''
        this.moderatingSearchedChannelId = ''
    }

    Get_UsersCache() {
        /** @type {{ defaultAvatarUrl: string; avatarUrlSmall: string | null; avatarUrlBig: string | null; id: string; hexAccentColor: `#${string}` | null | undefined; bot: boolean; createdAt: string; discriminator: string; system: boolean; username: string;}[]} */
        const users = []

        this.client.users.cache.forEach(user => {
            const newUser = {
                defaultAvatarUrl: user.defaultAvatarURL,
                avatarUrlSmall: user.avatarURL({ size: 16 }),
                avatarUrlBig: user.avatarURL({ size: 128 }),
                id: user.id,
                hexAccentColor: user.hexAccentColor,
                bot: user.bot,
                createdAt: GetDate(user.createdAt),
                discriminator: user.discriminator,
                system: user.system,
                username: user.username,
            }

            users.push(newUser)
        })
        return users
    }

    Get_ServersCache() {
        /** @type {{
         * iconUrlSmall: string | null;
         * iconUrlLarge: string | null;
         * name: string; id: string;
         * createdAt: string;
         * joinedAt: string;
         * memberCount: number;
         * nsfwLevel: "DEFAULT" | "EXPLICIT" | "SAFE" | "AGE_RESTRICTED";
         * nameAcronym: string;
         * verificationLevel: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
         * splash: string | null;
         * available: boolean;
         * large: boolean;
         * partnered: boolean;
         * verified: boolean;
         * }[]} */
        const servers = []

        this.client.guilds.cache.forEach(server => {
            const newServer = {
                iconUrlSmall: server.iconURL({ size: 16 }),
                iconUrlLarge: server.iconURL({ size: 128 }),

                name: (server.name),
                id: server.id,

                createdAt: GetDate(server.createdAt),
                joinedAt: GetDate(server.joinedAt),

                memberCount: (server.memberCount),
                nsfwLevel: (server.nsfwLevel),
                nameAcronym: (server.nameAcronym),
                mfaLevel: (server.mfaLevel),
                verificationLevel: (server.verificationLevel),
                splash: (server.splash),

                available: server.available,
                large: (server.large),
                partnered: (server.partnered),
                verified: (server.verified),
            }

            servers.push(newServer)
        });

        return servers
    }

    Get_ChannelsCache() {
        const GetTypeUrl = (type) => {
            if (type == "GUILD_NEWS" || type == "GUILD_STORE" || type == "GUILD_TEXT") {
                return 'text'
            }
            if (type == "GUILD_STAGE_VOICE" || type == "GUILD_VOICE") {
                return 'voice'
            }
        }

        const GetTypeText = (type) => {
            if (type == "GUILD_NEWS" || type == "GUILD_STORE" || type == "GUILD_TEXT") {
                return 'Text channel'
            }
            if (type == "GUILD_STAGE_VOICE" || type == "GUILD_VOICE") {
                return 'Voice channel'
            }
        }

        const groups = []
        const singleChannels = []

        this.client.channels.cache.forEach(channel => {
            if (channel.type == "GUILD_CATEGORY") {
                const channels = []

                channel.children.forEach(child => {
                    const newChannel = {
                        id: child.id,
                        createdAt: GetDate(child.createdAt),
                        deletable: child.deletable,
                        invitable: child.invitable,
                        joinable: child.joinable,
                        locked: child.locked,
                        manageable: child.manageable,
                        name: child.name,
                        nsfw: child.nsfw,
                        sendable: child.sendable,
                        speakable: child.speakable,
                        type: child.type,
                        unarchivable: child.unarchivable,
                        viewable: child.viewable,
                        parentId: child.parentId,
                        typeText: GetTypeText(child.type),
                        typeUrl: GetTypeUrl(child.type),
                        commands: ['Fetch'],
                    }

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
                    channels: channels,
                    commands: ['Fetch'],
                }

                groups.push(newGroup)
            } else if (channel.parentId == null) {
                const newChannel = {
                    id: channel.id,
                    createdAt: GetDate(channel.createdAt),
                    deletable: channel.deletable,
                    invitable: channel.invitable,
                    joinable: channel.joinable,
                    locked: channel.locked,
                    manageable: channel.manageable,
                    name: channel.name,
                    nsfw: channel.nsfw,
                    sendable: channel.sendable,
                    speakable: channel.speakable,
                    type: channel.type,
                    unarchivable: channel.unarchivable,
                    viewable: channel.viewable,
                    parentId: channel.parentId,
                    typeText: GetTypeText(channel.type),
                    typeUrl: GetTypeUrl(channel.type),
                    commands: ['Fetch'],
                }

                if (channel.joinable) {
                    newChannel.commands.push('Join')
                }

                singleChannels.push(newChannel)
            }
        });

        return { groups: groups, singleChannels: singleChannels }
    }

    /** @param {Discord.Guild} guild */
    Get_ChannelsInGuild(guild) {
        const GetTypeUrl = (type) => {
            if (type == "GUILD_NEWS" || type == "GUILD_STORE" || type == "GUILD_TEXT") {
                return 'text'
            }
            if (type == "GUILD_STAGE_VOICE" || type == "GUILD_VOICE") {
                return 'voice'
            }
        }

        const GetTypeText = (type) => {
            if (type == "GUILD_NEWS" || type == "GUILD_STORE" || type == "GUILD_TEXT") {
                return 'Text channel'
            }
            if (type == "GUILD_STAGE_VOICE" || type == "GUILD_VOICE") {
                return 'Voice channel'
            }
        }

        const groups = []
        const singleChannels = []

        guild.channels.cache.forEach(channel => {
            if (channel.type == "GUILD_CATEGORY") {
                const channels = []

                channel.children.forEach(child => {
                    const newChannel = {
                        id: child.id,
                        createdAt: GetDate(child.createdAt),
                        deletable: child.deletable,
                        editable: child.editable,
                        invitable: child.invitable,
                        joinable: child.joinable,
                        locked: child.locked,
                        manageable: child.manageable,
                        name: child.name,
                        nsfw: child.nsfw,
                        sendable: child.sendable,
                        speakable: child.speakable,
                        type: child.type,
                        unarchivable: child.unarchivable,
                        viewable: child.viewable,
                        parentId: child.parentId,
                        typeText: GetTypeText(child.type),
                        typeUrl: GetTypeUrl(child.type),
                        commands: ['Fetch'],
                    }

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
                    channels: channels,
                    commands: ['Fetch'],
                }

                groups.push(newGroup)
            } else if (channel.parentId == null) {
                const newChannel = {
                    id: channel.id,
                    createdAt: GetDate(channel.createdAt),
                    deletable: channel.deletable,
                    editable: channel.editable,
                    invitable: channel.invitable,
                    joinable: channel.joinable,
                    locked: channel.locked,
                    manageable: channel.manageable,
                    name: channel.name,
                    nsfw: channel.nsfw,
                    sendable: channel.sendable,
                    speakable: channel.speakable,
                    type: channel.type,
                    unarchivable: channel.unarchivable,
                    viewable: channel.viewable,
                    parentId: channel.parentId,
                    typeText: GetTypeText(channel.type),
                    typeUrl: GetTypeUrl(channel.type),
                    commands: ['Fetch'],
                }

                if (channel.joinable) {
                    newChannel.commands.push('Join')
                }

                singleChannels.push(newChannel)
            }
        });

        return { groups: groups, singleChannels: singleChannels }
    }

    GetClientStats() {
        if (this.client.user != undefined) {
            return { username: this.client.user.username, avatar: this.client.user.avatarURL(), discriminator: this.client.user.discriminator, ping: this.client.ws.ping, status: 'online', enStart: 'none', enStop: 'block' }
        } else {
            return { username: "Username", avatar: "defaultAvatar.png", discriminator: "0000", ping: 0, status: 'offline', enStart: 'block', enStop: 'none' }
        }
    }

    RenderPage_Status(req, res) {
        var uptime = new Date(0)
        uptime.setSeconds(this.client.uptime / 1000)
        uptime.setHours(uptime.getHours() - 1)

        var shardState = 'none'
        if (this.client.ws.shards.size > 0) {
            shardState = WsStatusText[this.client.ws.shards.first().status]
        }

        const clientData = {
            readyTime: GetTime(this.client.readyAt),
            uptime: GetTime(uptime),
            botStarted: this.client.isReady(),
            botStopped: (!this.client.isReady()),
            ws: {
                ping: this.client.ws.ping.toString().replace('NaN', '-'),
                status: WsStatusText[this.client.ws.status],
                readyAt: this.client.ws.client.readyAt
            },
            statesManager: this.statesManager,
            shard: {
                state: shardState,
            },
        }

        res.render('userRpm/Status', { bot: clientData })
    }

    RenderPage_CacheChannels(req, res) {
        const xd = this.Get_ChannelsCache()

        res.render('userRpm/CacheChannels', { groups: xd.groups, channels: xd.singleChannels })
    }

    RenderPage_Database(req, res, userId) {
        try {
            const userDatabase = {
                userId: userId,
                score: this.database.dataBasic[userId].score,
                money: this.database.dataBasic[userId].money,
                day: this.database.dataBasic[userId].day,
                color: this.database.dataBasic[userId].color,
                privateCommands: this.database.dataBasic[userId].privateCommands,

                crates: this.database.dataBackpacks[userId].crates,
                gifts: this.database.dataBackpacks[userId].gifts,
                getGift: this.database.dataBackpacks[userId].getGift,
                tickets: this.database.dataBackpacks[userId].tickets,
                quizTokens: this.database.dataBackpacks[userId].quizTokens,
                luckyCards: {
                    small: this.database.dataBackpacks[userId].luckyCards.small,
                    medium: this.database.dataBackpacks[userId].luckyCards.medium,
                    large: this.database.dataBackpacks[userId].luckyCards.large,
                },

                businessIndex: this.database.dataBusinesses[userId].businessIndex,
                businessName: this.database.dataBusinesses[userId].businessName,
                businessLevel: this.database.dataBusinesses[userId].businessLevel,

                stickersMeme: this.database.dataStickers[userId].stickersMeme,
                stickersMusic: this.database.dataStickers[userId].stickersMusic,
                stickersYoutube: this.database.dataStickers[userId].stickersYoutube,
                stickersMessage: this.database.dataStickers[userId].stickersMessage,
                stickersCommand: this.database.dataStickers[userId].stickersCommand,
                stickersTip: this.database.dataStickers[userId].stickersTip,

                memes: this.database.dataUserstats[userId].memes,
                musics: this.database.dataUserstats[userId].musics,
                youtubevideos: this.database.dataUserstats[userId].youtubevideos,
                messages: this.database.dataUserstats[userId].messages,
                chars: this.database.dataUserstats[userId].chars,
                commands: this.database.dataUserstats[userId].commands,
            }

            const cacheUser = this.client.users.cache.get(userId)

            const user = {
                id: cacheUser.id,
                name: cacheUser.username,
                avatarUrlSmall: cacheUser.avatarURL({ size: 32 }),
                avatarUrlLarge: cacheUser.avatarURL({ size: 128 }),
            }

            fs.readdir(this.database.databaseFolderPath, (err, files) => {
                files.forEach(file => {
                    if (fs.existsSync(this.database.databaseFolderPath + file)) {
                        const size = fs.statSync(this.database.databaseFolderPath + file).size
                        currentFiles.push({ filename: file, size: GetDataSize(size) })
                    }
                })
            })
            fs.readdir(this.database.backupFolderPath, (err, files) => {
                files.forEach(file => {
                    if (fs.existsSync(this.database.backupFolderPath + file)) {
                        const size = fs.statSync(this.database.backupFolderPath + file).size
                        backupFiles.push({ filename: file, size: GetDataSize(size) })
                    }
                })
            })
            const info = {
                backupFolder: { path: this.database.backupFolderPath, files: backupFiles },
                folder: { path: this.database.databaseFolderPath, files: currentFiles }
            }

            const bot = {
                day: this.database.dataBot.day,
            }

            const market = {
                day: this.database.dataMarket.day,
                prices: {
                    token: this.database.dataMarket.prices.token,
                    coupon: this.database.dataMarket.prices.coupon,
                    jewel: this.database.dataMarket.prices.jewel,
                },
            }

            res.render('userRpm/Database', { userDatabase: userDatabase, user: user, bot: bot, market: market, info: info })
        } catch (error) {
            this.databaseSearchedUserId = ''
            this.RenderPage_DatabaseSearch(req, res, "User's database not found")
        }
    }

    RenderPage_DatabaseSearch(req, res, searchError) {
        if (this.databaseSearchedUserId.length > 0) {
            this.RenderPage_Database(req, res, this.databaseSearchedUserId)
            return
        }

        const cacheUsers = this.client.users.cache;
        const users = []

        const currentFiles = []
        const backupFiles = []

        fs.readdir(this.database.databaseFolderPath, (err, files) => {
            files.forEach(file => {
                if (fs.existsSync(this.database.databaseFolderPath + file)) {
                    const size = fs.statSync(this.database.databaseFolderPath + file).size
                    currentFiles.push({ filename: file, size: GetDataSize(size) })
                }
            })
        })
        fs.readdir(this.database.backupFolderPath, (err, files) => {
            files.forEach(file => {
                if (fs.existsSync(this.database.backupFolderPath + file)) {
                    const size = fs.statSync(this.database.backupFolderPath + file).size
                    backupFiles.push({ filename: file, size: GetDataSize(size) })
                }
            })
        })
        const info = {
            backupFolder: { path: this.database.backupFolderPath, files: backupFiles },
            folder: { path: this.database.databaseFolderPath, files: currentFiles }
        }

        cacheUsers.forEach(cacheUser => {
            users.push({ id: cacheUser.id, name: cacheUser.username, avatarUrlSmall: cacheUser.avatarURL({ size: 16 }), avatarUrlLarge: cacheUser.avatarURL({ size: 128 }) })
        });


        const bot = {
            day: this.database.dataBot.day,
        }

        const market = {
            day: this.database.dataMarket.day,
            prices: {
                token: this.database.dataMarket.prices.token,
                coupon: this.database.dataMarket.prices.coupon,
                jewel: this.database.dataMarket.prices.jewel,
            },
        }

        res.render('userRpm/DatabaseSearch', { users: users, searchError: searchError, bot: bot, market: market, info: info })
    }

    RenderPage_ModeratingSearch(req, res, searchError) {
        if (this.moderatingSearchedServerId.length > 0) {
            this.RenderPage_ModeratingGuildSearch(req, res, '')
            return
        }

        res.render('userRpm/ModeratingSearch', { servers: this.Get_ServersCache(), searchError: searchError })
    }

    RenderPage_ModeratingGuildSearch(req, res, searchError) {
        if (this.moderatingSearchedServerId.length == 0) {
            this.RenderPage_ModeratingSearch(req, res, 'No server selected')
            return
        }
        if (this.moderatingSearchedChannelId.length > 0) {
            this.RenderPage_Moderating(req, res)
            return
        }

        const g = this.client.guilds.cache.get(this.moderatingSearchedServerId)
        const guild = {
            iconUrlSmall: g.iconURL({ size: 32 }),
            iconUrlLarge: g.iconURL({ size: 128 }),

            name: (g.name),
            id: g.id,

            createdAt: GetDate(g.createdAt),
            joinedAt: GetDate(g.joinedAt),

            memberCount: (g.memberCount),
            nsfwLevel: (g.nsfwLevel),
            nameAcronym: (g.nameAcronym),
            mfaLevel: (g.mfaLevel),
            verificationLevel: (g.verificationLevel),
            splash: (g.splash),

            available: g.available,
            large: (g.large),
            partnered: (g.partnered),
            verified: (g.verified),
        }

        res.render('userRpm/ModeratingGuildSearch', { server: guild, groups: this.Get_ChannelsInGuild(g).groups, singleChannels: this.Get_ChannelsInGuild(g).singleChannels, searchError: searchError })
    }

    RenderPage_Moderating(req, res) {
        if (this.moderatingSearchedServerId.length == 0) {
            this.RenderPage_ModeratingSearch(req, res, 'No server selected')
            return
        }
        if (this.moderatingSearchedChannelId.length == 0) {
            this.RenderPage_ModeratingGuildSearch(req, res, 'No channel selected')
            return
        }

        const g = this.client.guilds.cache.get(this.moderatingSearchedServerId)
        const guild = {
            iconUrlSmall: g.iconURL({ size: 32 }),
            iconUrlLarge: g.iconURL({ size: 128 }),

            name: (g.name),
            id: g.id,

            createdAt: GetDate(g.createdAt),
            joinedAt: GetDate(g.joinedAt),

            memberCount: g.memberCount,
            nsfwLevel: g.nsfwLevel,
            nameAcronym: g.nameAcronym,
            mfaLevel: g.mfaLevel,
            verificationLevel: g.verificationLevel,
            splash: g.splash,

            available: g.available,
            large: g.large,
            partnered: g.partnered,
            verified: g.verified,
        }

        /** @type {Discord.GuildBasedChannel} */
        const c = g.channels.cache.get(this.moderatingSearchedChannelId)
        const channel = {
            id: c.id,
            archived: c.archived,
            archivedAt: GetDate(c.archivedAt),
            createdAt: GetDate(c.createdAt),
            deletable: c.deletable,
            editable: c.editable,
            full: c.full,
            invitable: c.invitable,
            joinable: c.joinable,
            locked: c.locked,
            manageable: c.manageable,
            memberCount: c.memberCount,
            messageCount: c.messageCount,
            name: c.name,
            nsfw: c.nsfw,
            sendable: c.sendable,
            speakable: c.speakable,
            topic: c.topic,
            type: c.type,
            unarchivable: c.unarchivable,
            userLimit: c.userLimit,
            videoQualityMode: c.videoQualityMode,
            viewable: c.viewable,
        }

        const messages = []

        if (c.isText()) {
            /** @type {Discord.DMChannel | Discord.PartialDMChannel | Discord.NewsChannel | Discord.TextChannel | Discord.ThreadChannel | Discord.VoiceChannel} */
            const cTxt = c
            cTxt.messages.cache.forEach((message) => {
                messages.push({
                    id: message.id,
                    applicationId: message.applicationId,
                    cleanContent: message.cleanContent,
                    content: message.content,
                    createdAt: GetDate(message.createdAt),
                    crosspostable: message.crosspostable,
                    deletable: message.deletable,
                    editable: message.editable,
                    editedAt: GetDate(message.editedAt),
                    nonce: message.nonce,
                    pinnable: message.pinnable,
                    pinned: message.pinned,
                    system: message.system,
                    type: message.type,
                    url: message.url
                })
            })
        }

        res.render('userRpm/Moderating', { server: guild, channel: channel, messages: messages })
    }

    registerRoots() {
        this.app.get('/', (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            const view = req.query.view

            if (view == 'default' || view == null || view == undefined) {
                res.render('default')
            } else {
                res.status(404).send("Not found")
            }
        })

        this.app.get('/frames/top', (req, res) => {
            res.render('frames/top')
        })

        this.app.get('/userRpm/MenuRpm', (req, res) => {
            res.render('userRpm/MenuRpm')
        })

        this.app.get('/userRpm/Status', (req, res) => {
            this.RenderPage_Status(req, res)
        })

        this.app.get('/userRpm/CacheEmojis', (req, res) => {
            var emojis = []

            this.client.emojis.cache.forEach(emoji => {
                const newEmoji = {
                    animated: emoji.animated,
                    available: emoji.available,
                    deletable: emoji.deletable,
                    createdAt: GetDate(emoji.createdAt),
                    id: emoji.id,
                    identifier: emoji.identifier,
                    name: emoji.name,
                    url: emoji.url
                }

                emojis.push(newEmoji)
            });

            res.render('userRpm/CacheEmojis', { emojis: emojis })
        })

        this.app.get('/userRpm/CacheUsers', (req, res) => {
            res.render('userRpm/CacheUsers', { users: this.Get_UsersCache() })
        })

        this.app.get('/userRpm/CacheChannels', (req, res) => {
            this.RenderPage_CacheChannels(req, res)
        })

        this.app.get('/userRpm/CacheServers', (req, res) => {
            res.render('userRpm/CacheServers', { servers: this.Get_ServersCache() })
        })

        this.app.get('/userRpm/Application', (req, res) => {
            const app = this.client.application

            const newApp = {
                id: app.id,
                createdAt: GetDate(app.createdAt),
                botRequireCodeGrant: app.botRequireCodeGrant,
                iconUrl: app.iconURL({ size: 16 }),
                coverUrl: app.coverURL({ size: 16 }),
                name: app.name,
                botPublic: app.botPublic,
                customInstallURL: app.customInstallURL,
                description: app.description,
                partial: app.partial,
                rpcOrigins: app.rpcOrigins,
                tags: app.tags,
            }
            res.render('userRpm/Application', { app: newApp })
        })

        this.app.get('/userRpm/Process', (req, res) => {
            const uptime = new Date()
            uptime.setSeconds(Math.floor(process.uptime()))

            const proc = {

                argv: process.argv,
                connected: process.connected,
                debugPort: process.debugPort,
                execArgv: process.execArgv,
                noAsar: process.noAsar,
                release: process.release,
                version: process.version,

                arch: process.arch,
                config: {
                    variables: process.config.variables,
                    target_defaults: process.config.target_defaults,
                },
                execPath: process.execPath,
                platform: process.platform,
                chrome: process.chrome,
                contextId: process.contextId,
                contextIsolated: process.contextIsolated,
                defaultApp: process.defaultApp,
                exitCode: process.exitCode,
                features: process.features,
                isMainFrame: process.isMainFrame,
                mas: process.mas,
                noDeprecation: process.noDeprecation,
                pid: process.pid,
                ppid: process.ppid,
                resourcesPath: process.resourcesPath,
                sandboxed: process.sandboxed,
                throwDeprecation: process.throwDeprecation,
                title: process.title,
                traceDeprecation: process.traceDeprecation,
                traceProcessWarnings: process.traceProcessWarnings,
                type: process.type,
                windowsStore: process.windowsStore,
                uptime: GetTime(uptime)
            }

            res.render('userRpm/Process', { process: proc })
        })

        this.app.get('/userRpm/Testing', (req, res) => {
            res.render('userRpm/Testing')
        })

        this.app.post('/userRpm/CacheChannels/Fetch', (req, res) => {
            const channel = this.client.channels.cache.get(req.body.id)
            channel.fetch()

            console.log('userRpm/CacheChannels/Fetch')

            this.RenderPage_CacheChannels(req, res)
        })

        this.app.post('/userRpm/CacheChannels/Join', (req, res) => {
            const voiceChannel = this.client.channels.cache.get(req.body.id)
            voiceChannel.join()

            console.log('userRpm/CacheChannels/Join')

            this.RenderPage_CacheChannels(req, res)
        })

        this.app.post('/userRpm/Process/Exit', (req, res) => {
            if (this.IsMobile == false) {
                SystemLog('Exit by user (handlebars)')
            }
            setTimeout(() => { process.exit() }, 500)
        })

        this.app.post('/userRpm/Process/Restart', (req, res) => {
            if (this.IsMobile == false) {
                fs.writeFileSync('./exitdata.txt', 'restart', { encoding: 'ascii' })
                setTimeout(function () {
                    process.exit()
                }, 500)
            }
        })

        this.app.post('/userRpm/Process/Abort', (req, res) => {
            process.abort()
        })

        this.app.post('/userRpm/Process/Disconnect', (req, res) => {
            process.disconnect()
        })

        this.app.post('/sendMessage', (req, res) => {
            var text = req.body.text
            var channelId = req.body.channel

            var chan = this.client.channels.cache.get(channelId)

            if (chan) {
                chan.send(text)
            }

            res.render('serverView', {
                title: chan.name,
                chans
            })
        })

        this.app.post('/sendMessageUser', (req, res) => {
            var text = req.body.text
            var userId = req.body.user

            var chan = this.client.users.cache.get(userId).dmChannel

            if (chan) {
                chan.send(text)
            }

            res.render('serverView', {
                title: 'Ügyintéző Dashboard'
            })
        })

        this.app.post('/fetchChannelMessages', (req, res) => {
            var channelId = req.body.id

            var chan = this.client.channels.cache.get(channelId)

            if (!chan) {
                res.status(500).send("Internal Server Error")
                return
            }

            chan.messages.fetch()

            res.status(200).send("OK")
        })

        this.app.post('/deleteUserDM', (req, res) => {
            var userId = req.body.id

            var user = this.client.users.cache.get(userId)

            if (!user) { return }

            user.deleteDM()

            res.send(200).send("OK")
        })

        this.app.post('/createUserDM', (req, res) => {
            var userId = req.body.id

            var user = this.client.users.cache.get(userId)

            if (!user) { return }

            user.createDM()

            res.send(200).send("OK")
        })

        this.app.post('/fetchUser', (req, res) => {
            var userId = req.body.id

            var user = this.client.users.cache.get(userId)

            if (!user) { return }

            user.fetch()

            res.send(200).send("OK")
        })

        this.app.post('/startBot', (req, res) => {
            this.StartBot()

            res.send(200).send("OK")
        })

        this.app.post('/stopBot', (req, res) => {
            if (this.IsMobile == false) {
                SystemLog('Destroy bot by user (handlebars)')
            }

            this.StopBot()

            res.send(200).send("OK")
        })

        this.app.get('/userRpm/Moderating', (req, res) => {
            this.RenderPage_ModeratingSearch(req, res, '')
        })

        this.app.post('/userRpm/Moderating/Search', (req, res) => {
            const serverId = req.body.id

            if (this.client.guilds.cache.has(serverId)) {
                this.moderatingSearchedServerId = serverId

                this.RenderPage_ModeratingGuildSearch(req, res, '')
            } else {
                this.RenderPage_ModeratingSearch(req, res, 'Server not found')
            }
        })

        this.app.post('/userRpm/Moderating/Back', (req, res) => {
            this.moderatingSearchedServerId = ''

            this.RenderPage_ModeratingSearch(req, res, '')
        })

        this.app.post('/userRpm/Moderating/Server/Back', (req, res) => {
            this.moderatingSearchedChannelId = ''

            this.RenderPage_ModeratingGuildSearch(req, res, '')
        })

        this.app.post('/userRpm/Moderating/Server/Search', (req, res) => {
            const channelId = req.body.id

            if (this.client.channels.cache.has(channelId)) {
                this.moderatingSearchedChannelId = channelId

                this.RenderPage_Moderating(req, res)
            } else {
                this.RenderPage_ModeratingSearch(req, res, 'Channel not found')
            }
        })

        this.app.get('/userRpm/Database', (req, res) => {
            if (this.database == null || this.database == undefined) {
                res.render('userRpm/DatabaseNotSupported')
            } else {
                this.RenderPage_DatabaseSearch(req, res, '')
            }
        })

        this.app.post('/userRpm/Database/Search', (req, res) => {
            const userId = req.body.id

            if (this.client.users.cache.has(userId)) {
                this.databaseSearchedUserId = userId

                this.RenderPage_Database(req, res, userId)
            } else {
                this.RenderPage_DatabaseSearch(req, res, 'User not found')
            }
        })

        this.app.post('/userRpm/Database/Backup/All', (req, res) => {
            fs.readdir(this.database.backupFolderPath, (err, files) => {
                files.forEach(file => {
                    const backupFile = this.database.backupFolderPath + file
                    if (fs.existsSync(backupFile)) {
                        fs.copyFile(backupFile, this.database.databaseFolderPath + file, (err) => {
                            if (err) { throw err }
                        })
                    }
                })
            })
        })

        this.app.post('/userRpm/Database/Backup/One', (req, res) => {
            const file = req.body.filename

            const backupFile = this.database.backupFolderPath + file
            if (fs.existsSync(backupFile)) {
                fs.copyFile(backupFile, this.database.databaseFolderPath + file, (err) => {
                    if (err) { throw err }
                })
            }
        })

        this.app.post('/userRpm/Database/Back', (req, res) => {
            this.databaseSearchedUserId = ''

            this.RenderPage_DatabaseSearch(req, res, '')
        })

        this.app.post('/userRpm/Database/Modify/Stickers', (req, res) => {
            if (this.databaseSearchedUserId.length > 0 && this.database.dataStickers[this.databaseSearchedUserId] != undefined) {
                const datas = req.body

                this.database.dataStickers[this.databaseSearchedUserId].stickersMeme = datas.stickersMeme
                this.database.dataStickers[this.databaseSearchedUserId].stickersMusic = datas.stickersMusic
                this.database.dataStickers[this.databaseSearchedUserId].stickersYoutube = datas.stickersYoutube
                this.database.dataStickers[this.databaseSearchedUserId].stickersMessage = datas.stickersMessage
                this.database.dataStickers[this.databaseSearchedUserId].stickersCommand = datas.stickersCommand
                this.database.dataStickers[this.databaseSearchedUserId].stickersTip = datas.stickersTip
                this.database.SaveDatabase()

                this.RenderPage_Database(req, res, this.databaseSearchedUserId)
            }
        })

        this.app.post('/userRpm/Database/Modify/Backpack', (req, res) => {
            if (this.databaseSearchedUserId.length > 0 && this.database.dataBackpacks[this.databaseSearchedUserId] != undefined) {
                const datas = req.body

                this.database.dataBackpacks[this.databaseSearchedUserId].crates = datas.crates
                this.database.dataBackpacks[this.databaseSearchedUserId].gifts = datas.gifts
                this.database.dataBackpacks[this.databaseSearchedUserId].getGift = datas.getGift
                this.database.dataBackpacks[this.databaseSearchedUserId].tickets = datas.tickets
                this.database.dataBackpacks[this.databaseSearchedUserId].quizTokens = datas.quizTokens
                this.database.dataBackpacks[this.databaseSearchedUserId].luckyCards.small = datas.luckyCardsSmall
                this.database.dataBackpacks[this.databaseSearchedUserId].luckyCards.medium = datas.luckyCardsMedium
                this.database.dataBackpacks[this.databaseSearchedUserId].luckyCards.large = datas.luckyCardsLarge

                this.RenderPage_Database(req, res, this.databaseSearchedUserId)
            }
        })

        this.app.post('/userRpm/Database/Modify/Basic', (req, res) => {
            if (this.databaseSearchedUserId.length > 0 && this.database.dataBasic[this.databaseSearchedUserId] != undefined) {
                const datas = req.body

                this.database.dataBasic[this.databaseSearchedUserId].score = datas.score
                this.database.dataBasic[this.databaseSearchedUserId].money = datas.money
                this.database.dataBasic[this.databaseSearchedUserId].day = datas.day

                this.RenderPage_Database(req, res, this.databaseSearchedUserId)
            }
        })

        this.app.get('/userRpm/LogError', (req, res) => {
            if (this.IsMobile == true) {
                res.render('userRpm/ErrorLogsNotSupported', {})
                return
            }
            const data = fs.readFileSync('./node.error.log', 'utf8')

            const errors = []
            const warnings = []

            const lines = data.split('\n')

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.length < 2) { continue }
                if (line.startsWith('Error: ')) {
                    errors.push({ type: 'Error', title: line.replace('Error: ', ''), id: i })
                } else if (line.startsWith('TypeError: ')) {
                    errors.push({ type: 'TypeError', title: line.replace('Error: ', ''), id: i })
                } else if (line.startsWith('    at ')) {
                    if (errors[errors.length - 1].stack == undefined) {
                        errors[errors.length - 1].stack = [line.replace('    at ', '')]
                    } else {
                        errors[errors.length - 1].stack.push(line.replace('    at ', ''))
                    }
                } else if (line.includes(' DeprecationWarning:')) {
                    var xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(':', '')
                    xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(': ', '')
                    warnings.push({ type: 'DeprecationWarning', title: xd, id: i })
                } else if (line == '(Use `node --trace-deprecation ...` to show where the warning was created)') {
                    warnings[warnings.length - 1].info = 'Use `node --trace-deprecation ...` to show where the warning was created'
                } else {
                    if (errors.length > 0) {
                        if (errors[errors.length - 1].info == undefined) {
                            errors[errors.length - 1].info = [line]
                        } else {
                            errors[errors.length - 1].info.push(line)
                        }
                    }
                }
            }

            res.render('userRpm/ErrorLogs', { errors: errors, warnings: warnings })
        })

        this.app.get('/userRpm/LogSystem', (req, res) => {
            if (this.IsMobile == false) {
                res.render('userRpm/SystemLogs', { logs: GetLogs(), uptimeHistory: GetUptimeHistory() })
            } else {
                res.render('userRpm/SystemLogsNotSupported', {})
            }
        })

        this.app.get('/userRpm/LogHandlebars', (req, res) => {
            if (this.IsMobile == false) {
                res.render('userRpm/HandlebarsLogs', { logs: HbGetLogs('192.168.1.100') })
            } else {
                res.render('userRpm/HandlebarsLogsNotSupported', {})
            }
        })

        this.app.post('/userRpm/Log/Clear', (req, res) => {
            fs.writeFileSync('./node.error.log', '')
        })

        this.app.get('/userRpm/*', (req, res) => {
            res.render('userRpm/404', { message: req.path })
        })
    }
}

/**@param {Date} date @returns {string}*/
function dateToHumanTime(date) {
    const minutes = date.getMinutes()
    const hours = date.getHours()
    const days = date.getDate()
    const months = date.getMonth()
    const years = date.getFullYear()

    const currentDate = new Date(Date.now())

    if (days < currentDate.getDate()) {
        const days2 = currentDate.getDate() - days
        if (days2 == 1) {
            return "tegnap " + OneNumberToTwoNumber(hours) + ":" + OneNumberToTwoNumber(minutes) + "-kor"
        } else if (days2 == 2) {
            return "tegnapelőtt " + OneNumberToTwoNumber(hours) + ":" + OneNumberToTwoNumber(minutes) + "-kor"
        } else {
            return years + "." + months + "." + days + "."
        }
    } else {
        return "ma " + OneNumberToTwoNumber(hours) + ":" + OneNumberToTwoNumber(minutes) + "-kor"
    }
}

/**@param {number} number @returns {string} */
function OneNumberToTwoNumber(number) {
    if (number < 10) {
        return "0" + number
    } else {
        return number.toString()
    }
}

function xpRankIcon(score) {
    let rank = ''
    if (score < 1000) {
        rank = '🔰' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/japanese-symbol-for-beginner_1f530.png'
    } else if (score < 5000) {
        rank = 'Ⓜ️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-latin-capital-letter-m_24c2.png'
    } else if (score < 10000) {
        rank = '📛' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/name-badge_1f4db.png'
    } else if (score < 50000) {
        rank = '💠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/diamond-shape-with-a-dot-inside_1f4a0.png'
    } else if (score < 80000) {
        rank = '⚜️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/fleur-de-lis_269c.png'
    } else if (score < 100000) {
        rank = '🔱' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/trident-emblem_1f531.png'
    } else if (score < 140000) {
        rank = '㊗️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-congratulation_3297.png'
    } else if (score < 180000) {
        rank = '🉐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-advantage_1f250.png'
    } else if (score < 250000) {
        rank = '🉑' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-accept_1f251.png'
    } else if (score < 350000) {
        rank = '💫' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/dizzy-symbol_1f4ab.png'
    } else if (score < 500000) {
        rank = '🌠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/shooting-star_1f320.png'
    } else if (score < 780000) {
        rank = '☄️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/comet_2604.png'
    } else if (score < 1000000) {
        rank = '🪐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/ringed-planet_1fa90.png'
    } else if (score < 1500000) {
        rank = '🌀' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/cyclone_1f300.png'
    } else if (score < 1800000) {
        rank = '🌌' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/milky-way_1f30c.png'
    } else {
        rank = '🧿' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png'
    }
    return rank
}
function xpRankText(score) {
    let rankName = ''
    if (score < 1000) {
        rankName = 'Ujjonc'
    } else if (score < 5000) {
        rankName = 'Zöldfülű'
    } else if (score < 10000) {
        rankName = 'Felfedező'
    } else if (score < 50000) {
        rankName = 'Haladó'
    } else if (score < 80000) {
        rankName = 'Törzsvendég'
    } else if (score < 100000) {
        rankName = 'Állampolgár'
    } else if (score < 140000) {
        rankName = 'Csoportvezető'
    } else if (score < 180000) {
        rankName = 'Csoportvezér'
    } else if (score < 250000) {
        rankName = 'Vezér'
    } else if (score < 350000) {
        rankName = 'Polgárelnök'
    } else if (score < 500000) {
        rankName = 'Miniszterelnök'
    } else if (score < 780000) {
        rankName = 'Elnök'
    } else if (score < 1000000) {
        rankName = 'Világdiktátor'
    } else if (score < 1500000) {
        rankName = 'Galaxis hódító'
    } else if (score < 1800000) {
        rankName = 'Univerzum birtokló'
    } else {
        rankName = 'Isten'
    }
    return rankName
}
function xpRankPrevoius(score) {
    let prevoius = 0
    if (score < 1000) {
        prevoius = 0
    } else if (score < 5000) {
        prevoius = 1000
    } else if (score < 10000) {
        prevoius = 5000
    } else if (score < 50000) {
        prevoius = 10000
    } else if (score < 80000) {
        prevoius = 50000
    } else if (score < 100000) {
        prevoius = 80000
    } else if (score < 140000) {
        prevoius = 100000
    } else if (score < 180000) {
        prevoius = 140000
    } else if (score < 250000) {
        prevoius = 180000
    } else if (score < 350000) {
        prevoius = 250000
    } else if (score < 500000) {
        prevoius = 350000
    } else if (score < 780000) {
        prevoius = 500000
    } else if (score < 1000000) {
        prevoius = 780000
    } else if (score < 1500000) {
        prevoius = 1000000
    } else if (score < 1800000) {
        prevoius = 1500000
    }
    return prevoius
}
function xpRankNext(score) {
    let next = 0
    if (score < 1000) {
        next = 1000
    } else if (score < 5000) {
        next = 5000
    } else if (score < 10000) {
        next = 10000
    } else if (score < 50000) {
        next = 50000
    } else if (score < 80000) {
        next = 80000
    } else if (score < 100000) {
        next = 100000
    } else if (score < 140000) {
        next = 140000
    } else if (score < 180000) {
        next = 180000
    } else if (score < 250000) {
        next = 250000
    } else if (score < 350000) {
        next = 350000
    } else if (score < 500000) {
        next = 500000
    } else if (score < 780000) {
        next = 780000
    } else if (score < 1000000) {
        next = 1000000
    } else if (score < 1500000) {
        next = 1500000
    } else if (score < 1800000) {
        next = 1800000
    }
    return next
}

module.exports = WebSocket
