const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const Discord = require('discord.js')
const LogManager = require('../functions/log')
const CacheManager = require('../functions/offline-cache')
const { GetID, GetHash, AddNewUser, RemoveAllUser } = require('../functions/userHashManager')
const fs = require('fs')
const os = require('os')
const { DatabaseManager } = require('../functions/databaseManager.js')
const { StatesManager } = require('../functions/statesManager')
const {
    WsStatusText,
    NsfwLevel,
    VerificationLevel,
    MFALevel
} = require('../functions/enums')
const { GetTime, GetDataSize, GetDate } = require('../functions/functions')
const { SystemLog, GetLogs, GetUptimeHistory } = require('../functions/systemLog')
const { HbLog, HbGetLogs, HbStart } = require('./log')
const { CreateCommandsSync, DeleteCommandsSync, DeleteCommand, Updatecommand } = require('../functions/commands')
const { MessageType } = require('discord.js')
const process = require('process')
const archivePath = 'D:/Mappa/Discord/DiscordOldData/'

class WebInterfaceManager {
    /**
     * @param {string} password
     * @param {string} ip
     * @param {number} port
     * @param {Discord.Client} client
     * @param {LogManager} logManager
     * @param {DatabaseManager} database
     * @param {StatesManager} statesManager
     * @param {'DESKTOP' | 'MOBILE' | 'RASPBERRY'} clientType
     */
    constructor(password, ip, port, client, logManager, database, StartBot, StopBot, statesManager, clientType) {
        this.password = password
        this.client = client
        this.StartBot = StartBot
        this.StopBot = StopBot

        /** @type {'DESKTOP' | 'MOBILE' | 'RASPBERRY'} */
        this.ClientType = clientType

        this.logManager = logManager
        this.database = database

        this.statesManager = statesManager

        if (clientType != 'MOBILE') { HbStart() }

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

        this.ipToRate = {}
        this.blockedIpsFor = {}

        this.app.use((req, res, next) => {
            if (this.ipToRate[req.ip] == undefined) {
                this.ipToRate[req.ip] = 1
            } else {
                this.ipToRate[req.ip] += 1
            }

            if (this.blockedIpsFor[req.ip] != undefined) {
                if (this.blockedIpsFor[req.ip] > 0) {
                    res.status(429).send('Too many requiests! Try again in ' + this.blockedIpsFor[req.ip] + ' secs')
                    return
                }
            }

            if (req.path.startsWith('/public')) {
                return next()
            }

            const auth = { login: 'bb', password: 'bb' }

            const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
            const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

            if (login && password && login === auth.login && password === auth.password) {
                return next()
            }

            if (this.ClientType != 'MOBILE') {
                HbLog({ IP: req.ip, type: 'NORMAL', message: 'Failed to log in with username "' + login + '" and password "' + password + '"' })
            }

            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).render('userViews/401')
        })

        setInterval(() => {
            for (var ip in this.ipToRate) {
                var rate = this.ipToRate[ip]
                if (rate > 0) {
                    if (rate > 10) {
                        HbLog({ IP: ip, type: 'BLOCKED', message: 'Address blocked: too many requiests' })
                        this.blockedIpsFor[ip] = 5
                    }
                }
                this.ipToRate[ip] = 0
            }
            for (var ip in this.blockedIpsFor) {
                var time = this.blockedIpsFor[ip]
                if (time > 0) {
                    this.blockedIpsFor[ip] -= 1
                }
            }
        }, 1000);

        this.RegisterHandlebarsRoots()
        this.RegisterPublicRoots()
        this.RegisterWeatherRoots()
        this.RegisterArchiveBrowserRoots()
        
        this.app.get('/', (req, res) => {
            res.status(200).render('start')
        })
        
        this.app.get('/config.json', (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            if (ip.startsWith('127.') || ip.startsWith('192.168.1.')) {
                const Config = require('../config.json')
                res.status(200).send({
                    config: Config
                })

                return
            }

            res.status(401).send('Access denied: only accessible from LAN')
        })
        
        this.app.get('*', (req, res) => {
            res.status(404).render('404', {
                url: req.url
            })
        })

        this.OnStartListen = () => {
            this.statesManager.WebInterface.IsDone = true
            this.statesManager.WebInterface.URL = 'http://' + this.server.address().address + ":" + this.server.address().port
            if (this.ClientType != 'MOBILE') {
                HbLog({ type: 'NORMAL', message: 'Listening on ' + ip + ':' + port })
            }
        }

        this.server = this.app.listen(port, ip, this.OnStartListen)

        this.server.on('error', (err) => {
            if (err.message.startsWith('listen EADDRNOTAVAIL: address not available')) {
                this.statesManager.WebInterface.Error = 'Address not available'
            } else {
                this.statesManager.WebInterface.Error = err.message
            }
            if (this.ClientType != 'MOBILE') {
                HbLog({ type: 'ERROR', message: err.message, helperMessage: 'Server error: ' + err.message })
            }
        })
        this.server.on('clientError', (err, socket) => {
            if (this.ClientType != 'MOBILE') {
                HbLog({ type: 'CLIENT_ERROR', message: err.message, helperMessage: 'Client error: ' + err.message })
            }

            if (err.code === 'ECONNRESET' || !socket.writable) {
                return
            }
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        })
        this.server.on('close', () => {
            this.statesManager.WebInterface.IsDone = false
            this.statesManager.WebInterface.URL = ''
            if (this.ClientType != 'MOBILE') {
                HbLog({ type: 'NORMAL', message: 'Server closed' })
            }
        })
        this.server.on('connect', (req, socket, head) => {
            if (this.ClientType != 'MOBILE') {
                HbLog({ IP: req.socket.remoteAddress, type: 'CONNECT', url: req.url, method: req.method, helperMessage: 'Someone wanted to connect' })
            }
        })
        this.server.on('connection', (socket) => {
            this.statesManager.WebInterface.Clients.push(socket)
            this.statesManager.WebInterface.ClientsTime.push(10)
        })
        this.server.on('request', (req, res) => {
            this.statesManager.WebInterface.Requests.push(10)
            if (this.ClientType != 'MOBILE') {
                HbLog({ IP: req.socket.remoteAddress, type: 'REQUIEST', url: req.url, method: req.method, helperMessage: 'Someone requiested' })
            }
        })
        this.server.on('upgrade', (req, socket, head) => {
            if (this.ClientType != 'MOBILE') {
                HbLog({ IP: req.socket.remoteAddress, type: 'NORMAL', message: 'Upgrade', helperMessage: 'Someone upgraded' })
            }
        })



        this.databaseSearchedUserId = ''
        this.moderatingSearchedServerId = ''
        this.moderatingSearchedChannelId = ''

        this.archiveModeratingSearchedServerId = ''
        this.archiveModeratingSearchedChannelId = ''

        this.commandsDeleting = false
        this.commandsCreating = false
        this.commandsCreatingPercent = 0.0
    }

    /** @param {Discord.User} user */
    Get_UserJson(user) {
        const userJson = {
            defaultAvatarUrl: user.defaultAvatarURL,
            avatarUrlSmall: user.avatarURL({ size: 16 }),
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
            haveHash: (GetHash(user.id) != null && GetHash(user.id) != undefined),
            hash: '' + GetHash(user.id),
            createdAtText: user.createdAt.getFullYear() + '. ' + user.createdAt.getMonth() + '. ' + user.createdAt.getDate() + '.'
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
        user.presence
        return userJson
    }

    Get_UsersCache() {
        /** @type {{ defaultAvatarUrl: string; avatarUrlSmall: string | null; avatarUrlBig: string | null; id: string; hexAccentColor: `#${string}` | null | undefined; bot: boolean; createdAt: string; discriminator: string; system: boolean; username: string; cache: boolean}[]} */
        const users = []

        this.client.users.cache.forEach(user => {
            const userJson = this.Get_UserJson(user)
            userJson['cache'] = false
            users.push(userJson)
        })

        const usersSaved = CacheManager.GetUsers(this.client)

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
                const userJson = this.Get_UserJson(userSaved)
                userJson['cache'] = true
                users.push(userJson)
            }
        }

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
         * nsfwLevel: Discord.GuildMFALevel;
         * verificationLevel: Discord.GuildVerificationLevel;
         * splash: string | null;
         * available: boolean;
         * large: boolean;
         * }[]} */
        const servers = []

        this.client.guilds.cache.forEach(server => {
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
                nsfwLevel: server.nsfwLevel,
                mfaLevel: server.mfaLevel,
                verificationLevel: server.verificationLevel,
                splash: server.splash,

                available: server.available,
                large: server.large,
            }

            servers.push(newServer)
        });

        return servers
    }

    Get_ChannelsCache() {
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

        this.client.channels.cache.forEach(channel => {
            if (channel.type == Discord.ChannelType.GuildCategory) {
                const channels = []

                channel.children.cache.forEach(child => {
                    const newChannel = {
                        id: child.id,
                        createdAt: GetDate(child.createdAt),
                        deletable: child.deletable,
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
                        url: child.url,
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
                    url: channel.url,
                    channels: channels,
                    commands: ['Fetch'],
                }

                groups.push(newGroup)
            } else if (channel.parentId == null) {
                const newChannel = {
                    id: channel.id,
                    createdAt: GetDate(channel.createdAt),
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
                    url: channel.url,
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
                        position: child.position,
                        commands: ['Fetch'],
                    }

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
                    deletable: channel.deletable,
                    invitable: channel.invitable,
                    joinable: channel.joinable,
                    locked: channel.locked,
                    position: channel.position,
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

        singleChannels.sort(function(a, b) { return a.position - b.position })

        return { groups: groups, singleChannels: singleChannels }
    }

    GetClientStats() {
        if (this.client.user != undefined) {
            return { username: this.client.user.username, avatar: this.client.user.avatarURL(), discriminator: this.client.user.discriminator, ping: this.client.ws.ping, status: 'online', enStart: 'none', enStop: 'block' }
        } else {
            return { username: "Username", avatar: "defaultAvatar.png", discriminator: "0000", ping: 0, status: 'offline', enStart: 'block', enStop: 'none' }
        }
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {string} viewName
     * @param {object | undefined} options
     */
    RenderPage(req, res, viewName, options = undefined) {
        if (req.url.includes('?new') || true) {
            res.render(`userViewsNew/${viewName}`, options)
        } else {
            res.render(`userViews/${viewName}`, options)
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

        var systemInfo = {
            CPUs: []
        }

        const cpus = os.cpus()

        for (let i = 0; i < cpus.length; i++) {
            const cpu = cpus[i]
            systemInfo.CPUs.push({
                model: cpu.model,
                id: i,
                times: {
                    user: cpu.times.user/1000,
                    sys: cpu.times.sys/1000,
                    nice: cpu.times.nice/1000,
                    idle: cpu.times.idle/1000,
                    irq: cpu.times.irq/1000,
                }
            })
            
        }

        systemInfo.TotalMemory = os.totalmem()
        systemInfo.FreeMemory = os.freemem()
        systemInfo.UsedMemory = systemInfo.TotalMemory - systemInfo.FreeMemory
        systemInfo.Uptime = GetTime(new Date(os.uptime() * 1000))
        systemInfo.UserInfo = os.userInfo()

        const clientData = {
            readyTime: GetTime(this.client.readyAt),
            uptime: GetTime(uptime),
            botStarted: (this.client.ws.shards.size > 0) ? (this.client.ws.shards.first().status == 0) : false,
            ws: {
                ping: this.client.ws.ping.toString().replace('NaN', '-'),
                status: WsStatusText[this.client.ws.status],
                readyAt: this.client.ws.client.readyAt
            },
            statesManager: this.statesManager,
            shard: {
                state: shardState,
            },
            showWeatherStatus: (this.statesManager.WeatherReport.Text.length > 0),
            showNewsStatus: (this.statesManager.News.AllProcessed == false),
            system: systemInfo
        }

        this.RenderPage(req, res, 'Status', { bot: clientData })
    }

    RenderPage_CacheChannels(req, res) {
        const xd = this.Get_ChannelsCache()

        this.RenderPage(req, res, 'CacheChannels', { groups: xd.groups, channels: xd.singleChannels })
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

                businessIndex: 0,
                businessName: '',
                businessLevel: 0,

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

            try {
                userDatabase.businessIndex = this.database.dataBusinesses[userId].businessIndex
                userDatabase.businessName = this.database.dataBusinesses[userId].businessName
                userDatabase.businessLevel = this.database.dataBusinesses[userId].businessLevel
            } catch (err) { }

            const currentFiles = []
            const backupFiles = []

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

            this.RenderPage(req, res, 'Database', { userDatabase: userDatabase, user: user, bot: bot, market: market, info: info })
        } catch (error) {
            this.databaseSearchedUserId = ''
            this.RenderPage_DatabaseSearch(req, res, error.message)
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
            users.push({
                id: cacheUser.id,
                name: cacheUser.username,
                avatarUrlSmall: cacheUser.avatarURL({ size: 16 }),
                avatarUrlLarge: cacheUser.avatarURL({ size: 128 }),
                haveDatabase: (this.database.dataBasic[cacheUser.id] != undefined)
            })
        })


        const bot = {
            day: this.database.dataBot.day,
        }

        const market = {
            day: this.database.dataMarket.day,
            prices: {
                token: '?',
                coupon: '?',
                jewel: '?',
            },
        }

        if (this.database.dataMarket.prices != undefined) {
            market.prices.token = this.database.dataMarket.prices.token
            market.prices.coupon = this.database.dataMarket.prices.coupon
            market.prices.jewel = this.database.dataMarket.prices.jewel
        }

        this.RenderPage(req, res, 'DatabaseSearch', { users: users, searchError: searchError, bot: bot, market: market, info: info })
    }

    RenderPage_ModeratingSearch(req, res, searchError) {
        if (this.moderatingSearchedServerId.length > 0) {
            this.RenderPage_ModeratingGuildSearch(req, res, '')
            return
        }

        this.RenderPage(req, res, 'ModeratingSearch', { servers: this.Get_ServersCache(), searchError: searchError })
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

            name: g.name,
            id: g.id,

            createdAt: GetDate(g.createdAt),
            joinedAt: GetDate(g.joinedAt),

            memberCount: g.memberCount,
            nsfwLevel: g.nsfwLevel,
            // nameAcronym: '-',
            mfaLevel: g.mfaLevel,
            verificationLevel: g.verificationLevel,
            splash: g.splash,

            available: g.available,
            large: g.large
            // partnered: g.partnered,
            // verified: g.verified,
        }

        const emojis = []
        g.emojis.cache.forEach((emoji) => {
            emojis.push({
                animated: emoji.animated,
                author: emoji.author,
                available: emoji.available,
                deletable: emoji.deletable,
                id: emoji.id,
                identifier: emoji.identifier,
                managed: emoji.managed,
                name: emoji.name,
                requiresColons: emoji.requiresColons,
                roles: emoji.roles,
                url: emoji.url,
                createdAt: GetDate(emoji.createdAt)
            })
        })

        this.RenderPage(req, res, 'ModeratingGuildSearch', { server: guild, groups: this.Get_ChannelsInGuild(g).groups, singleChannels: this.Get_ChannelsInGuild(g).singleChannels, searchError: searchError, emojis: emojis })
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
            // nameAcronym: g.nameAcronym,
            mfaLevel: g.mfaLevel,
            verificationLevel: g.verificationLevel,
            splash: g.splash,

            available: g.available,
            large: g.large,
            // partnered: g.partnered,
            // verified: g.verified,
        }

        /** @type {Discord.GuildBasedChannel} */
        const c = g.channels.cache.get(this.moderatingSearchedChannelId)
        const channel = {
            id: c.id,
            archived: c.archived,
            archivedAt: GetDate(c.archivedAt),
            createdAt: GetDate(c.createdAt),
            deletable: c.deletable,
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

        /** @type {{id:string;createdAtTimestamp:number}[]} */
        const messages = []

        if (c.type === Discord.ChannelType.GuildText) {
            const cTxt = c

            cTxt.messages.cache.forEach((message) => {
                messages.push({
                    id: message.id,
                    position: message.position,
                    applicationId: message.applicationId,
                    cleanContent: message.cleanContent,
                    tts: message.tts,
                    content: message.content,
                    createdAt: GetDate(message.createdAt),
                    createdAtTimestamp: message.createdAt.getTime(),
                    crosspostable: message.crosspostable,
                    deletable: message.deletable,
                    editable: message.editable,
                    editedAt: GetDate(message.editedAt),
                    nonce: message.nonce,
                    partial: message.partial,
                    pinnable: message.pinnable,
                    pinned: message.pinned,
                    system: message.system,
                    type: message.type,
                    types: {
                        AutoModerationAction: message.type === MessageType.AutoModerationAction,
                        Call: message.type === MessageType.Call,
                        ChannelFollowAdd: message.type === MessageType.ChannelFollowAdd,
                        ChannelIconChange: message.type === MessageType.ChannelIconChange,
                        ChannelNameChange: message.type === MessageType.ChannelNameChange,
                        ChannelPinnedMessage: message.type === MessageType.ChannelPinnedMessage,
                        ChatInputCommand: message.type === MessageType.ChatInputCommand,
                        ContextMenuCommand: message.type === MessageType.ContextMenuCommand,
                        Default: message.type === MessageType.Default,
                        GuildBoost: message.type === MessageType.GuildBoost,
                        GuildBoostTier1: message.type === MessageType.GuildBoostTier1,
                        GuildBoostTier2: message.type === MessageType.GuildBoostTier2,
                        GuildBoostTier3: message.type === MessageType.GuildBoostTier3,
                        RecipientRemove: message.type === MessageType.RecipientRemove,
                        RecipientAdd: message.type === MessageType.RecipientAdd,
                        GuildInviteReminder: message.type === MessageType.GuildInviteReminder,
                        Reply: message.type === MessageType.Reply,
                        ThreadCreated: message.type === MessageType.ThreadCreated,
                        ThreadStarterMessage: message.type === MessageType.ThreadStarterMessage,
                        UserJoin: message.type === MessageType.UserJoin,
                    },
                    url: message.url,
                    author: this.Get_UserJson(message.author)
                })
            })

            messages.sort(function(a, b) { return a.createdAtTimestamp - b.createdAtTimestamp })
        }

        this.RenderPage(req, res, 'Moderating', { server: guild, channel: channel, messages: messages })
    }

    RenderPage_Commands(req, res) {
        const guildCommands = this.client.guilds.cache.get('737954264386764812').commands
        const globalCommands = this.client.application.commands
        const commands = []
        guildCommands.cache.forEach(command => {
            const newCommand = {
                id: command.id,
                createdAt: GetDate(command.createdAt),
                description: command.description,
                name: command.name,
                typeUrl: command.type,
                version: command.version,
                haveOptions: false,
                global: false,
                options: []
            }
            command.options.forEach(option => {
                newCommand.haveOptions = true
                newCommand.options.push({
                    typeUrl: option.type,
                    name: option.name,
                    description: option.description
                })
            })
            commands.push(newCommand)
        });
        globalCommands.cache.forEach(command => {
            const newCommand = {
                id: command.id,
                createdAt: GetDate(command.createdAt),
                description: command.description,
                name: command.name,
                typeUrl: command.type,
                version: command.version,
                haveOptions: false,
                global: true,
                options: []
            }
            command.options.forEach(option => {
                newCommand.haveOptions = true
                newCommand.options.push({
                    typeUrl: option.type,
                    name: option.name,
                    description: option.description
                })
            })
            commands.push(newCommand)
        });

        this.RenderPage(req, res, 'Commands', { commands: commands, deleting: this.commandsDeleting, creating: this.commandsCreating, deletingPercent: this.commandsDeletingPercent, creatingPercent: this.commandsCreatingPercent })
    }

    RegisterHandlebarsRoots() {
        this.app.get('/hb', (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            const view = req.query.view

            if (view == 'default' || view == null || view == undefined) {
                var icon = ''

                if (this.ClientType == 'DESKTOP') {
                    icon = '🖥️'
                } else if (this.ClientType == 'MOBILE') {
                    icon = '📱'
                } else if (this.ClientType == 'RASPBERRY') {
                    icon = '🍓'
                }

                res.render('default', { title: 'Discord BOT - ' + icon })
            } else {
                res.status(404).send("Not found")
            }
        })
        
        this.app.get('/hbnew', (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            const view = req.query.view

            if (view == 'default' || view == null || view == undefined) {
                res.render('defaultNew', { title: GetTitle() })
            } else {
                res.status(404).send("Not found")
            }
        })

        const GetTitle = () => {
            var icon = ''

            if (this.ClientType == 'DESKTOP') {
                icon = '🖥️'
            } else if (this.ClientType == 'MOBILE') {
                icon = '📱'
            } else if (this.ClientType == 'RASPBERRY') {
                icon = '🍓'
            }

            var statusIcon = ' - ❌'
            if (this.client.ws.shards.size > 0) {
                if (this.client.ws.shards.first().status == 0) {
                    statusIcon = ''
                }
            }

            return 'Discord BOT' + statusIcon + ' - ' + icon
        }

        this.app.get('/title', (req, res) => {
            res.status(200).send(GetTitle())
        })

        this.app.get('/json/status', (req, res) => {
            this.ipToRate[req.ip] -= 1

            var uptime = new Date(0)
            uptime.setSeconds(this.client.uptime / 1000)
            uptime.setHours(uptime.getHours() - 1)

            var shardState = 'none'
            if (this.client.ws.shards.size > 0) {
                shardState = WsStatusText[this.client.ws.shards.first().status]
            }

            res.status(200).send({
                heartbeat: this.statesManager.heartbeat,
                hello: this.statesManager.hello,
                loadingProgressText: this.statesManager.loadingProgressText,
                botLoadingState: this.statesManager.botLoadingState,
                botLoaded: this.statesManager.botLoaded,
                botReady: this.statesManager.botReady,
                Shard_IsLoading: this.statesManager.Shard.IsLoading,
                Shard_LoadingText: this.statesManager.Shard.LoadingText,
                Shard_Error: this.statesManager.Shard.Error,
                uptime: GetTime(uptime),
                shardState: shardState,
                ws: {
                    ping: this.client.ws.ping.toString().replace('NaN', '-'),
                    status: WsStatusText[this.client.ws.status],
                },
                systemUptime: GetTime(new Date(os.uptime() * 1000)),
            })
        })

        this.app.get('/json/ping', (req, res) => {
            this.ipToRate[req.ip] -= 1
            
            res.status(200).send()
        })

        this.app.get('/frames/top', (req, res) => {
            res.render('frames/top')
        })

        this.app.get('/userViews/MenuRpm', (req, res) => {
            res.render('userViews/MenuRpm')
        })

        this.app.get('/userViewsNew/MenuRpm', (req, res) => {
            res.render('userViewsNew/MenuRpm')
        })

        this.app.get('/userViews/Status', (req, res) => {
            this.RenderPage_Status(req, res)
        })

        this.app.get('/userViews/CacheEmojis', (req, res) => {
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

            this.RenderPage(req, res, 'CacheEmojis', { emojis: emojis })
        })

        this.app.get('/userViews/CacheUsers', (req, res) => {
            this.RenderPage(req, res, 'CacheUsers', { users: this.Get_UsersCache() })
        })

        this.app.get('/userViews/CacheChannels', (req, res) => {
            this.RenderPage_CacheChannels(req, res)
        })

        this.app.get('/userViews/CacheServers', (req, res) => {
            this.RenderPage(req, res, 'CacheServers', { servers: this.Get_ServersCache() })
        })

        this.app.get('/userViews/Application', (req, res) => {
            const app = this.client.application

            if (app == undefined || app == null) {
                this.RenderPage(req, res, 'ApplicationUnavaliable')
                return
            }

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
            this.RenderPage(req, res, 'Application', { app: newApp })
        })

        this.app.get('/userViews/Process', (req, res) => {
            const uptime = new Date()
            uptime.setSeconds(Math.floor(process.uptime()))

            const proc = {

                argv: process.argv,
                connected: process.connected,
                debugPort: process.debugPort,
                execArgv: process.execArgv,
                noAsar: process.noAsar,
                version: process.version,

                arch: process.arch,
                execPath: process.execPath,
                platform: process.platform,
                chrome: process.chrome,
                contextId: process.contextId,
                contextIsolated: process.contextIsolated,
                defaultApp: process.defaultApp,
                features: process.features,
                isMainFrame: process.isMainFrame,
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
                uptime: GetTime(uptime)
            }

            this.RenderPage(req, res, 'Process', { process: proc })
        })

        this.app.get('/userViews/Testing', (req, res) => {
            this.RenderPage(req, res, 'Testing')
        })

        this.app.post('/User/Fetch', (req, res) => {
            this.client.users.fetch(req.query.id)
            .then(() => {
                res.status(200).send({ message: 'ok' })
                CacheManager.SaveUsers(this.client)
            })
            .catch((error) => {
                res.status(200).send(error)
            })
        })

        this.app.post('/Message/Pin', (req, res) => {
            this.client.channels.fetch(req.query.channel)
                .then((channel) => {
                    if (channel === null) {
                        res.status(200).send(`Unknown channel (channel: ${req.query.channel})`)
                        return
                    }
                    if (channel.type !== Discord.ChannelType.GuildText) {
                        res.status(200).send(`Unknown channel type ${channel.type.toString()} (channel: ${req.query.channel})`)
                        return
                    }
                    channel.messages.fetch(req.query.id)
                        .then((message) => {
                            message.pin()
                                .then(() => {                                    
                                    res.status(200).send({ message: 'ok' })
                                })
                                .catch((error) => {
                                    res.status(200).send({ message: 'Failed to pin message', error: error })
                                })
                        })
                        .catch((error) => {
                            res.status(200).send({ message: 'Failed to fetch message', error: error })
                        })
                })
                .catch((error) => {
                    res.status(200).send({ message: 'Failed to fetch channel', error: error })
                })
        })

        this.app.post('/Message/Unpin', (req, res) => {
            this.client.channels.fetch(req.query.channel)
                .then((channel) => {
                    if (channel === null) {
                        res.status(200).send(`Unknown channel (channel: ${req.query.channel})`)
                        return
                    }
                    if (channel.type !== Discord.ChannelType.GuildText) {
                        res.status(200).send(`Unknown channel type ${channel.type.toString()} (channel: ${req.query.channel})`)
                        return
                    }
                    channel.messages.fetch(req.query.id)
                        .then((message) => {
                            message.unpin()
                                .then(() => {                                    
                                    res.status(200).send({ message: 'ok' })
                                })
                                .catch((error) => {
                                    res.status(200).send({ message: 'Failed to unpin message', error: error })
                                })
                        })
                        .catch((error) => {
                            res.status(200).send({ message: 'Failed to fetch message', error: error })
                        })
                })
                .catch((error) => {
                    res.status(200).send({ message: 'Failed to fetch channel', error: error })
                })
        })

        this.app.post('/Message/Delete', (req, res) => {
            this.client.channels.fetch(req.query.channel)
                .then((channel) => {
                    if (channel === null) {
                        res.status(200).send(`Unknown channel (channel: ${req.query.channel})`)
                        return
                    }
                    if (channel.type !== Discord.ChannelType.GuildText) {
                        res.status(200).send(`Unknown channel type ${channel.type.toString()} (channel: ${req.query.channel})`)
                        return
                    }
                    channel.messages.fetch(req.query.id)
                        .then((message) => {
                            message.delete()
                                .then(() => {                                    
                                    res.status(200).send({ message: 'ok' })
                                })
                                .catch((error) => {
                                    res.status(200).send({ message: 'Failed to delete message', error: error })
                                })
                        })
                        .catch((error) => {
                            res.status(200).send({ message: 'Failed to fetch message', error: error })
                        })
                })
                .catch((error) => {
                    res.status(200).send({ message: 'Failed to fetch channel', error: error })
                })
        })

        this.app.post('/Message/Send', (req, res) => {
            const channel = this.client.channels.cache.get(req.body.channel)

            if (channel === undefined) {
                this.RenderPage_Moderating(req, res)
                return
                res.status(200).send({ message: `Unknown channel (channel: ${req.body.channel})` })
            }

            if (channel.type !== Discord.ChannelType.GuildText) {
                this.RenderPage_Moderating(req, res)
                return
                return
            }

            channel.send({ content: req.body.content, tts: req.body.tts })
                .then(() => {
                    return
                    res.status(200).send({ message: 'ok' })
                })
                .catch((error) => {
                    return
                    res.status(200).send({ message: 'Failed to send message', error: error })
                })
                .finally(() => {                        
                    this.RenderPage_Moderating(req, res)
                })
        })

        this.app.post('/Message/Fetch', (req, res) => {
            var id = req.query.id
            if (id === undefined || id === null) {
                id = req.body.id
            }
            var count = req.query.count
            if (count === undefined || count === null) {
                count = req.body.count
            }

            var channel = req.query.channel
            if (channel === undefined || channel === null) {
                channel = req.body.channel
            }

            this.client.channels.fetch(channel)
                .then((ch) => {
                    if (ch.type === Discord.ChannelType.GuildText) {
                        if (id) {
                            ch.messages.fetch(id)
                                .then(() => {
                                    res.status(200).send({ message: 'ok' })
                                })
                                .catch((error) => {
                                    res.status(200).send(error)
                                })
                        } else if (count) {
                            res.status(200).send('ID is requied')
                        }
                    } else {
                        res.status(200).send('Invalid channel type')
                    }
                })
                .catch((error) => {
                    res.status(200).send(error)
                })
        })

        this.app.post('/Channel/Fetch', (req, res) => {
            var id = req.query.id
            if (id === undefined || id === null) {
                id = req.body.id
            }
            this.client.channels.fetch(id)
                .then(() => {
                    res.status(200).send({ message: 'ok' })
                })
                .catch((error) => {
                    res.status(200).send(error)
                })
        })

        this.app.post('/Guild/Fetch', (req, res) => {
            var id = req.query.id
            if (id == undefined || id == null) {
                id = req.body.id
            }
            this.client.guilds.fetch(id)
                .then(() => {
                    res.status(200).send({ message: 'ok' })
                })
                .catch((error) => {
                    res.status(200).send(error)
                })
        })

        this.app.post('/Process/Exit', (req, res) => {
            if (this.ClientType != 'MOBILE') {
                SystemLog('Exit by user (handlebars)')
            }
            setTimeout(() => { process.exit() }, 500)
        })

        this.app.post('/Process/Restart', (req, res) => {
            if (this.ClientType == 'MOBILE') { res.status(501).send('This is not available: the server is running on the phone'); return }

            fs.writeFileSync('./exitdata.txt', 'restart', { encoding: 'ascii' })
            setTimeout(() => {
                process.exit()
            }, 500)
        })

        this.app.post('/Process/Abort', (req, res) => {
            process.abort()
        })

        this.app.post('/Process/Disconnect', (req, res) => {
            process.disconnect()
        })

        this.app.post('/DiscordClient/Start', (req, res) => {
            this.StartBot()
        })

        this.app.post('/DiscordClient/Stop', (req, res) => {
            if (this.ClientType != 'MOBILE') {
                SystemLog('Destroy bot by user (handlebars)')
            }

            this.StopBot()
        })

        this.app.get('/userViews/Moderating', (req, res) => {
            this.RenderPage_ModeratingSearch(req, res, '')
        })

        this.app.post('/userViews/Moderating/Search', (req, res) => {
            const serverId = req.body.id

            if (this.client.guilds.cache.has(serverId)) {
                this.moderatingSearchedServerId = serverId

                this.RenderPage_ModeratingGuildSearch(req, res, '')
            } else {
                this.RenderPage_ModeratingSearch(req, res, 'Server not found')
            }
        })

        this.app.post('/userViews/Moderating/Back', (req, res) => {
            this.moderatingSearchedServerId = ''

            this.RenderPage_ModeratingSearch(req, res, '')
        })

        this.app.post('/userViews/Moderating/Server/Back', (req, res) => {
            this.moderatingSearchedChannelId = ''

            this.RenderPage_ModeratingGuildSearch(req, res, '')
        })

        this.app.post('/userViews/Moderating/Server/Search', (req, res) => {
            const channelId = req.body.id

            if (this.client.channels.cache.has(channelId)) {
                this.moderatingSearchedChannelId = channelId

                this.RenderPage_Moderating(req, res)
            } else {
                this.RenderPage_ModeratingSearch(req, res, 'Channel not found')
            }
        })

        this.app.get('/userViews/Database', (req, res) => {
            if (this.database == null || this.database == undefined) {
                this.RenderPage(req, res, 'DatabaseNotSupported')
            } else {
                this.RenderPage_DatabaseSearch(req, res, '')
            }
        })

        this.app.post('/userViews/Database/Search', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            const userId = req.body.id

            if (this.client.users.cache.has(userId)) {
                this.databaseSearchedUserId = userId

                this.RenderPage_Database(req, res, userId)
            } else {
                this.RenderPage_DatabaseSearch(req, res, 'User not found')
            }
        })

        this.app.post('/userViews/Database/Backup/All', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

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

        this.app.post('/userViews/Database/Backup/One', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            const file = req.body.filename

            const backupFile = this.database.backupFolderPath + file
            if (fs.existsSync(backupFile)) {
                fs.copyFile(backupFile, this.database.databaseFolderPath + file, (err) => {
                    if (err) { throw err }
                })
            }
        })

        this.app.post('/userViews/Database/Back', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            this.databaseSearchedUserId = ''

            this.RenderPage_DatabaseSearch(req, res, '')
        })

        this.app.post('/userViews/Database/Modify/Stickers', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

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

        this.app.post('/userViews/Database/Modify/Backpack', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

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

                this.database.SaveDatabase()

                this.RenderPage_Database(req, res, this.databaseSearchedUserId)
            }
        })

        this.app.post('/userViews/Database/Modify/Basic', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            if (this.databaseSearchedUserId.length > 0 && this.database.dataBasic[this.databaseSearchedUserId] != undefined) {
                const datas = req.body

                this.database.dataBasic[this.databaseSearchedUserId].score = datas.score
                this.database.dataBasic[this.databaseSearchedUserId].money = datas.money
                this.database.dataBasic[this.databaseSearchedUserId].day = datas.day

                this.database.SaveDatabase()

                this.RenderPage_Database(req, res, this.databaseSearchedUserId)
            }
        })

        this.app.get('/userViews/LogError', (req, res) => {
            const data = fs.readFileSync('./node.error.log', 'utf8')
            const lines = data.split('\n')

            var linesProcessed = []

            var isCrash = false
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.length < 2) { continue }
                
                /** @type {'none' | 'error' | 'crash' | 'warning'} */
                var icon = 'none'
                var type = 'none'
                var title = 'none'
                var isHeader = true

                if (line == 'CRASH') {
                    isCrash = true
                    continue
                }

                if (isCrash === true) {
                    icon = 'crash'
                } else {
                    icon = 'error'
                }
                
                if (line.startsWith('Error: ')) {
                    type = 'Error'
                    title = line.replace('Error: ', '')
                } else if (line.startsWith('DiscordAPIError[')) {
                    type = 'DiscordAPIError'
                    title = line.replace('DiscordAPIError', '')
                } else if (line.startsWith('Error [')) {
                    type = 'Error'
                    title = line.replace('Error ', '')
                } else if (line.startsWith('TypeError: ')) {
                    type = 'TypeError'
                    title = line.replace('TypeError: ', '')
                } else if (line.startsWith('ReferenceError: ')) {
                    type = 'ReferenceError'
                    title = line.replace('ReferenceError: ', '')
                } else if (line.startsWith('DiscordAPIError: ')) {
                    type = 'DiscordAPIError'
                    title = line.replace('DiscordAPIError: ', '')
                } else if (line.startsWith('    at ')) {
                    icon = 'none'
                    type = 'none'
                    isHeader = false

                    const stactItem = line.replace('    at ', '')
                    var filePath = ''
                    const isFile = (stactItem.startsWith('C:\\'))
                    if (isFile && stactItem.includes(':')) {
                        filePath = stactItem.replace(':' + stactItem.split(':')[2], '')
                        filePath = filePath.replace(':' + filePath.split(':')[2], '')
                    }            

                    title = 'at ' + stactItem
                } else if (line.includes(' DeprecationWarning:')) {
                    icon = 'warning'
                    type = 'DeprecationWarning'

                    var xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(':', '')
                    xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(': ', '')

                    title = xd
                } else if (line.includes(' ExperimentalWarning:')) {
                    icon = 'warning'
                    type = 'ExperimentalWarning'

                    var xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(':', '')
                    xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(': ', '')

                    title = xd
                } else if (line == '(Use `node --trace-deprecation ...` to show where the warning was created)') {
                    icon = 'none'
                    type = 'none'
                    isHeader = false
                    title = line
                } else {
                    icon = 'none'
                    type = 'none'
                    isHeader = false
                    title = line
                }
                
                linesProcessed.push({ icon: icon, type: type, title: title, id: i, isCrash: isCrash, isHeader: isHeader })

                isCrash = false
            }

            /*

            const errors = []
            const warnings = []

            var isCrash = false
            var lastLine = ''

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.length < 2) { continue }
                if (line == lastLine) { continue }
                lastLine = ''

                if (line == 'CRASH') {
                    isCrash = true
                } else if (line.startsWith('Error: ')) {
                    errors.push({ type: 'Error', title: line.replace('Error: ', ''), id: i, isCrash: isCrash })
                    isCrash = false
                    lastLine = line
                } else if (line.startsWith('Error [')) {
                    errors.push({ type: 'Error', title: line.replace('Error ', ''), id: i, isCrash: isCrash })
                    isCrash = false
                    lastLine = line
                } else if (line.startsWith('TypeError: ')) {
                    errors.push({ type: 'TypeError', title: line.replace('TypeError: ', ''), id: i, isCrash: isCrash })
                    isCrash = false
                    lastLine = line
                } else if (line.startsWith('ReferenceError: ')) {
                    errors.push({ type: 'ReferenceError', title: line.replace('ReferenceError: ', ''), id: i, isCrash: isCrash })
                    isCrash = false
                    lastLine = line
                } else if (line.startsWith('DiscordAPIError: ')) {
                    errors.push({ type: 'DiscordAPIError', title: line.replace('DiscordAPIError: ', ''), id: i, isCrash: isCrash })
                    isCrash = false
                    lastLine = line
                } else if (line.startsWith('    at ')) {
                    if (errors[errors.length - 1].stack == undefined) {
                        errors[errors.length - 1].stack = []
                    }
                    const stactItem = line.replace('    at ', '')
                    var filePath = ''
                    const isFile = (stactItem.startsWith('C:\\'))
                    if (isFile && stactItem.includes(':')) {
                        filePath = stactItem.replace(':' + stactItem.split(':')[2], '')
                        filePath = filePath.replace(':' + filePath.split(':')[2], '')
                    }
                    errors[errors.length - 1].stack.push({
                        raw: stactItem,
                        isFile: isFile,
                        filePath: filePath
                    })
                    isCrash = false
                } else if (line.includes(' DeprecationWarning:')) {
                    var xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(':', '')
                    xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(': ', '')
                    warnings.push({ type: 'DeprecationWarning', title: xd, id: i })
                    isCrash = false
                } else if (line.includes(' ExperimentalWarning:')) {
                    var xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(':', '')
                    xd = line.replace(line.replace(':'[0]), '')
                    xd = xd.replace(': ', '')
                    warnings.push({ type: 'ExperimentalWarning', title: xd, id: i })
                    isCrash = false
                } else if (line == '(Use `node --trace-deprecation ...` to show where the warning was created)') {
                    warnings[warnings.length - 1].info = 'Use `node --trace-deprecation ...` to show where the warning was created'
                    isCrash = false
                } else {
                    if (errors.length > 0) {
                        if (errors[errors.length - 1].info == undefined) {
                            errors[errors.length - 1].info = [line]
                        } else {
                            errors[errors.length - 1].info.push(line)
                        }
                    }
                    isCrash = false
                }
            }

            this.RenderPage(req, res, 'ErrorLogs', { errors: errors, warnings: warnings })
            
            */

            this.RenderPage(req, res, 'ErrorLogs', { logs: linesProcessed })
        })

        this.app.get('/json/errors', (req, res) => {
            const data = fs.readFileSync('./node.error.log', 'utf8')
            const lines = data.split('\n')

            var notificationIcon = 0

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.length < 2) { continue }
                
                if (line == 'CRASH') {
                    if (notificationIcon < 4)
                    { notificationIcon = 4 }
                    break
                } else if (line.startsWith('Error: ')) {
                    if (notificationIcon < 3)
                    { notificationIcon = 3 }
                } else if (line.startsWith('DiscordAPIError[')) {
                    if (notificationIcon < 3)
                    { notificationIcon = 3 }
                } else if (line.startsWith('Error [')) {
                    if (notificationIcon < 3)
                    { notificationIcon = 3 }
                } else if (line.startsWith('TypeError: ')) {
                    if (notificationIcon < 3)
                    { notificationIcon = 3 }
                } else if (line.startsWith('ReferenceError: ')) {
                    if (notificationIcon < 3)
                    { notificationIcon = 3 }
                } else if (line.startsWith('DiscordAPIError: ')) {
                    if (notificationIcon < 3)
                    { notificationIcon = 3 }
                } else if (line.startsWith('    at ')) {
                    if (notificationIcon < 1)
                    { notificationIcon = 1 }
                } else if (line.includes(' DeprecationWarning:')) {
                    if (notificationIcon < 2)
                    { notificationIcon = 2 }
                } else if (line.includes(' ExperimentalWarning:')) {
                    if (notificationIcon < 2)
                    { notificationIcon = 2 }
                } else if (line == '(Use `node --trace-deprecation ...` to show where the warning was created)') {
                    if (notificationIcon < 1)
                    { notificationIcon = 1 }    
                } else {
                    if (notificationIcon < 1)
                    { notificationIcon = 1 }
                }
            }

            res.status(200).send(JSON.stringify(notificationIcon))
        })

        this.app.get('/userViews/LogSystem', (req, res) => {
            if (this.ClientType == 'MOBILE') {
                this.RenderPage(req, res, 'SystemLogsNotSupported', {})
            } else {
                this.RenderPage(req, res, 'SystemLogs', { logs: GetLogs(), uptimeHistory: GetUptimeHistory() })
            }
        })

        this.app.get('/userViews/LogHandlebars', (req, res) => {
            if (this.ClientType == 'MOBILE') {
                this.RenderPage(req, res, 'HandlebarsLogsNotSupported', {})
            } else {
                this.RenderPage(req, res, 'HandlebarsLogs', { logs: HbGetLogs('192.168.1.100') })
            }
        })

        this.app.post('/userViews/Log/Clear', (req, res) => {
            fs.writeFileSync('./node.error.log', '')
        })

        this.app.post('/userViews/Moderating/SendMessage', (req, res) => {
            const channel = this.client.channels.cache.get(req.body.id)

            if (channel !== undefined) {
                if (channel.type === Discord.ChannelType.GuildText) {
                    channel.send({ content: req.body.content, tts: req.body.tts })
                        .then(() => {
                            this.RenderPage_ModeratingSearch(req, res, '')
                        })
                        .catch((err) => {
                            this.RenderPage_ModeratingSearch(req, res, '')
                        })
                    return
                }
            }

            this.RenderPage_ModeratingSearch(req, res, '')
        })

        this.app.post('/userViews/ApplicationCommands/Fetch', (req, res) => {
            this.client.application.commands.fetch().finally(()=> {
                this.client.guilds.cache.get('737954264386764812').commands.fetch().finally(() => {
                    this.RenderPage_Commands(req, res)
                })
            })
        })

        this.app.post('/userViews/ApplicationCommands/DeleteAll', (req, res) => {
            this.commandsDeleting = true
            DeleteCommandsSync(this.client, this.statesManager, (percent) => {
                this.commandsDeletingPercent = percent
            }, () => {
                this.commandsDeleting = false
            })
            this.RenderPage_Commands(req, res)
        })

        this.app.post('/userViews/ApplicationCommands/Createall', (req, res) => {
            this.commandsCreating = true
            CreateCommandsSync(this.client, this.statesManager, (percent) => {
                this.commandsCreatingPercent = percent
            }, () => {
                this.commandsCreating = false
            })
            this.RenderPage_Commands(req, res)
        })

        this.app.get('/userViews/ApplicationCommands/Status', (req, res) => {
            res.status(200).send(JSON.stringify({ creatingPercent: this.commandsCreatingPercent }))
        })

        this.app.get('/userViews/ApplicationCommands', (req, res) => {
            if (this.client.guilds.cache.get('737954264386764812') == null) {
                this.RenderPage(req, res, 'ApplicationUnavaliable')
                return
            }

            this.RenderPage_Commands(req, res)
        })

        this.app.post('/userViews/GenerateHash', (req, res) => {
            const userID = req.body.id
            RemoveAllUser(userID)
            AddNewUser(userID)
        })

        this.app.post('/userViews/Commands/Delete', (req, res) => {
            const commandID = req.body.id
            DeleteCommand(this.client, commandID, () => {
                this.RenderPage_Commands(req, res)
            })
        })

        this.app.post('/userViews/Commands/Update', (req, res) => {
            const commandID = req.body.id
            Updatecommand(this.client, commandID, () => {
                this.RenderPage_Commands(req, res)
            })
        })

        this.app.get('/userViews/*', (req, res) => {
            this.RenderPage(req, res, '404', { message: req.path })
        })
    }

    RegisterPublicRoots() {
        const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

        /**
         * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req
         * @param {Response<any, Record<string, any>, number>} res
         * @param {string} userId
         * @param {string} hash
         */
        const RenderStartpage = async (req, res, userId, hash, dontReload, additionalInfo) => {
            const user = this.client.users.cache.get(userId)
            var member = undefined
            var thereIsNetworkError = false
            try {
                member = this.client.guilds.cache.get('737954264386764812').members.cache.get(userId)
                if (member == undefined) {
                    member = await this.client.guilds.cache.get('737954264386764812').members.fetch(userId)
                }
            } catch (err) {
                thereIsNetworkError = true
            }

            const { abbrev } = require('../functions/abbrev')

            const score = this.database.dataBasic[userId].score
            const next = require('../commands/database/xpFunctions').xpRankNext(score)
            const scorePercent = score / next
            const xpImageUrl = require('../commands/database/xpFunctions').xpRankIconModern(score)
            const rankText = require('../commands/database/xpFunctions').xpRankText(score)

            const dataBackpack = this.database.dataBackpacks[userId]
            const dataBasic = this.database.dataBasic[userId]
            const dataUserstats = this.database.dataUserstats[userId]

            const dayCrates = this.database.dataBot.day - dataBasic.day

            const bools = {
                haveCrates: dataBackpack.crates > 0,
                gotGifts: dataBackpack.getGift > 0,
                haveDayCrates: dayCrates > 0,
                haveLuckycardSmall: dataBackpack.luckyCards.small > 0,
                haveLuckycardMedium: dataBackpack.luckyCards.medium > 0,
                haveLuckycardLarge: dataBackpack.luckyCards.large > 0,
            }

            const statistics = {
                messages: abbrev(dataUserstats.messages),
                chars: abbrev(dataUserstats.chars),
                commands: abbrev(dataUserstats.commands)
            }

            const awards = {
                quiz: false,
                meme: false,
                online: false
            }

            try {
                if (member != undefined) {
                    if (member.roles.cache.some(role => role.id == '929443006627586078')) {
                        awards.quiz = true
                    } else if (member.roles.cache.some(role => role.id == '929443558040166461')) {
                        awards.quiz = true
                    } else if (member.roles.cache.some(role => role.id == '929443627527180288')) {
                        awards.quiz = true
                    } else if (member.roles.cache.some(role => role.id == '929443673077329961')) {
                        awards.quiz = true
                    }
                    if (member.roles.cache.some(role => role.id == '929443957967048834')) {
                        awards.meme = true
                    }
                    if (member.roles.cache.some(role => role.id == '893187175087226910')) {
                        awards.online = true
                    }
                }                
            } catch (error) {
                
            }

            const moneyText = abbrev(this.database.dataBasic[userId].money)

            const userInfo = {
                name: '<valaki>',
                progress: scorePercent,
                xpImageUrl: xpImageUrl,
                rankText: rankText,
                avatarURL: user.avatarURL({ size: 32 })
            }

            if (member != undefined) {
                userInfo.name = member.displayName
            } else if (user != undefined) {
                userInfo.name = user.username
            }

            res.render('public/startPage', { additionalInfo: additionalInfo, dontReload: dontReload, hash: hash, thereIsNetworkError: thereIsNetworkError, awards: awards, statistics: statistics, dayCrates: dayCrates, bools: bools, userInfo: userInfo, backpack: dataBackpack, money: moneyText })
        }

        /**
         * @param {string} id 
         */
        const openAllCrate = (id) => {
            if (this.database.dataBackpacks[id].crates === 0) {
                return {
                    success: false
                }
            } else {
                let Crates = this.database.dataBackpacks[id].crates

                let getXpS = 0
                let getGiftS = 0
                let getMoney = 0
                for (let i = 0; i < Crates; i++) {

                    let replies = ['xp', 'money', 'gift']
                    let random = Math.floor(Math.random() * 3)
                    let out = replies[random]
                    let val = 0

                    if (out === 'xp') {
                        val = Math.floor(Math.random() * 110) + 100
                        getXpS += val
                        this.database.dataBasic[id].score += val
                    }
                    if (out === 'money') {
                        val = Math.floor(Math.random() * 2000) + 2000
                        getMoney += val
                        this.database.dataBasic[id].money += val
                    }
                    if (out === 'gift') {
                        getGiftS += 1
                        this.database.dataBackpacks[id].gifts += 1
                    }
                }

                this.database.dataBackpacks[id].crates = this.database.dataBackpacks[id].crates - Crates
                this.database.SaveDatabase()

                return {
                    success: true,
                    xp: getXpS,
                    money: getMoney,
                    gift: getGiftS
                }

            }
        }
        /**
         * @param {string} id
         */
        const openAllDayCrate = (id) => {
            /**
             * @param {number} userId
             * @returns {String} The result string
             */
            const openDayCrate = (userId) => {
                const RandomPercente = Math.floor(Math.random() * 100)
                let val = 0
                if (RandomPercente < 10) { // 10%
                    val = 1
                    this.database.dataBackpacks[userId].tickets += val

                    return 0 + '|' + val
                } else if (RandomPercente < 30) { // 20%
                    val = 1
                    this.database.dataBackpacks[userId].crates += val

                    return 1 + '|' + val
                } else if (RandomPercente < 60) { // 30%
                    val = Math.floor(Math.random() * 50) + 30
                    this.database.dataBasic[userId].score += val

                    return 2 + '|' + val
                } else { // 40%
                    val = Math.floor(Math.random() * 300) + 100
                    this.database.dataBasic[userId].money += val

                    return 3 + '|' + val
                }
            }

            if (dayOfYear === this.database.dataBasic[id].day) {
                return { success: false }
            } else {
                let dayCrates = this.database.dataBot.day - this.database.dataBasic[id].day

                let getXpS = 0
                let getChestS = 0
                let getMoney = 0
                let getTicket = 0
                for (let i = 0; i < dayCrates; i++) {
                    const rewald = openDayCrate(id)
                    const rewaldIndex = rewald.split('|')[0]
                    const rewaldValue = parseInt(rewald.split('|')[1])

                    if (rewaldIndex === '2') {
                        getXpS += rewaldValue
                    } else if (rewaldIndex === '3') {
                        getMoney += rewaldValue
                    } else if (rewaldIndex === '1') {
                        getChestS += 1
                    } else if (rewaldIndex === '0') {
                        getTicket += 1
                    }
                }

                this.database.dataBasic[id].day = this.database.dataBot.day
                this.database.SaveDatabase()

                return {
                    success: true,
                    money: getMoney,
                    xp: getXpS,
                    crate: getChestS,
                    ticket: getTicket
                }
            }
        }

        /**
         * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req
         * @param {Response<any, Record<string, any>, number>} res
         * @param {string} errorTitle
         * @param {string} errorText
         */
        const RenderError = (req, res, errorTitle, errorText) => {
            res.render('public/error', { title: errorTitle, text: errorText })
        }

        this.app.get('/public', (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const userHash = req.query.user
            if (userHash == undefined) {
                RenderError(req, res, 'Hozzáférés megtagadva', 'felhasználó-azonosító nincs megadva!')
                return
            }
            const userId = GetID(userHash)
            if (userId == undefined || userId == null) {
                RenderError(req, res, 'Hozzáférés megtagadva', 'nincs ilyen felhasználó!')
                return
            }
            const action = req.query.action
            if (action == 'openAllDayCrates') {
                RenderStartpage(req, res, userId, userHash, true, { dayCrateResult: openAllDayCrate(userId) })
                return
            } else if (action == 'openAllCrates') {
                RenderStartpage(req, res, userId, userHash, true, { crateResult: openAllCrate(userId) })
                return
            }
            RenderStartpage(req, res, userId, userHash, false, {})
        })
    }


    RenderArchivePage_ModeratingSearch(req, res, error) {
        const index = JSON.parse(fs.readFileSync(archivePath + 'servers/' + 'index.json', { encoding: 'utf-8' }))
            
        const guildList = fs.readdirSync(archivePath + 'servers/')
        const guilds = []
        for (let i = 0; i < guildList.length; i++) {
            const guildID = guildList[i]
            try {
                guilds.push(JSON.parse(fs.readFileSync(archivePath + 'servers/' + guildID + '/guild.json', { encoding: 'utf-8' })))
            } catch (err) { }
        }

        const channelList = fs.readdirSync(archivePath + 'messages/')
        const channelsIndex = JSON.parse(fs.readFileSync(archivePath + 'messages/' + 'index.json', { encoding: 'utf-8' }))
        const dms = []
        for (let i = 0; i < channelList.length; i++) {
            const channelID = channelList[i]
            try {
                const channel = JSON.parse(fs.readFileSync(archivePath + 'messages/' + channelID + '/channel.json', { encoding: 'utf-8' }))
                channel.data = channelsIndex[channelID]
                if (channel.guild === undefined) {
                    dms.push(channel)
                }
            } catch (err) { }
        }

        res.render('archive/views/ModeratingSearch', { servers: guilds, dms: dms, error: error })
    }

    RenderArchivePage_ModeratingGuildSearch(req, res, error) {
        const guildList = fs.readdirSync(archivePath + 'servers/')
        var guild = {}
        for (let i = 0; i < guildList.length; i++) {
            const guildID = guildList[i]
            if (guildID !== this.archiveModeratingSearchedServerId) { continue }
            try {
                var guild_ = JSON.parse(fs.readFileSync(archivePath + 'servers/' + guildID + '/guild.json', { encoding: 'utf-8' }))
                guild = guild_
            } catch (err) { }
            break
        }

        const channelList = fs.readdirSync(archivePath + 'messages/')
        const channelsIndex = JSON.parse(fs.readFileSync(archivePath + 'messages/' + 'index.json', { encoding: 'utf-8' }))
        const channels = []
        for (let i = 0; i < channelList.length; i++) {
            const channelID = channelList[i]
            if (fs.existsSync(archivePath + 'messages/' + channelID + '/channel.json')) {
                const channel = JSON.parse(fs.readFileSync(archivePath + 'messages/' + channelID + '/channel.json', { encoding: 'utf-8' }))
                channel.data = channelsIndex[channelID]
                if (channel.guild !== undefined) {
                    if (channel.guild.id == this.archiveModeratingSearchedServerId) {
                        channels.push(channel)
                    }
                }
            }
        }

        res.render('archive/views/ModeratingGuildSearch', { guild: guild, channels: channels, error: error })
    }

    RenderArchivePage_Moderating(req, res, error) {
        var guild = undefined
        if (this.archiveModeratingSearchedServerId.length > 0) {
            const guildList = fs.readdirSync(archivePath + 'servers/')
            for (let i = 0; i < guildList.length; i++) {
                const guildID = guildList[i]
                if (guildID !== this.archiveModeratingSearchedServerId) { continue }
                try {
                    var guild_ = JSON.parse(fs.readFileSync(archivePath + 'servers/' + guildID + '/guild.json', { encoding: 'utf-8' }))
                    guild = guild_
                } catch (err) { }
                break
            }
        }

        const channelList = fs.readdirSync(archivePath + 'messages/')
        const channelsIndex = JSON.parse(fs.readFileSync(archivePath + 'messages/' + 'index.json', { encoding: 'utf-8' }))
        var channel = {}
        for (let i = 0; i < channelList.length; i++) {
            const channelID = channelList[i]
            if (channelID !== this.archiveModeratingSearchedChannelId) { continue }
            if (fs.existsSync(archivePath + 'messages/' + channelID + '/channel.json')) {
                const channel_ = JSON.parse(fs.readFileSync(archivePath + 'messages/' + channelID + '/channel.json', { encoding: 'utf-8' }))
                if (this.archiveModeratingSearchedServerId.length === 0 && channel_.guild === undefined) {
                    channel = channel_
                    channel.data = channelsIndex[channelID]
                    break
                } else if (channel_.guild !== undefined) {
                    if (channel_.guild.id == this.archiveModeratingSearchedServerId) {
                        channel = channel_
                        channel.data = channelsIndex[channelID]
                        break
                    }
                }
            }
        }

        const userData = JSON.parse(fs.readFileSync(archivePath + 'account/' + 'user.json', { encoding: 'utf-8' }))

        const csv = require('csv')

        const messages = []

        const self = this
        if (fs.existsSync(archivePath + 'messages/' + channel.id + '/messages.csv')) {
            fs.createReadStream(archivePath + 'messages/' + channel.id + '/messages.csv')
                .pipe(csv.parse({ delimiter: ",", from_line: 2 }))
                .on('data', function (row) {
                    if (row.length > 3) {
                        messages.push({
                            id: row[0],
                            date: row[1],
                            content: self.ParseMessageContentToHandlebars(self.ParseMessageContent(row[2] + '')),
                            attachment: row[3],
                            author: {
                                id: userData.id,
                                username: userData.username,
                                discriminator: userData.discriminator,
                                avatarUrlSmall: `/archive/data/user/avatar.png`,
                                avatarUrlBig: `/archive/data/user/avatar.png`
                            }
                        })
                    } else {
                        messages.push({  })
                    }
                })
                .on('end', () => {
                    res.render('archive/views/Moderating', { guild: guild, channel: channel, messages: messages, error: error })
                })
                .on('error', (err) => {
                    res.render('archive/views/Moderating', { guild: guild, channel: channel, messages: messages, error: error })
                })
        } else {
            res.render('archive/views/Moderating', { guild: guild, channel: channel, messages: messages, error: error })
        }
    }
    RegisterArchiveBrowserRoots() {
        this.app.get('/archive', (req, res) => {
            const view = req.query.view
            if (view === 'default' || view == undefined) {
                res.render('archive/default')
            } else {
                res.status(404).send("Not found")
            }
        })

        this.app.get('/archive/views/MenuRpm', (req, res) => {
            res.render('archive/views/MenuRpm')
        })
        
        this.app.get('/archive/data/user/avatar.png', (req, res) => {
            const readStream = fs.createReadStream(archivePath + 'account/' + 'avatar.png')
            const stream = require('stream')
            const streamPassThrough = new stream.PassThrough()
            stream.pipeline(readStream, streamPassThrough, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(404).send('Not Found')
                }
            })
            streamPassThrough.pipe(res)
        })

        this.app.get('/archive/views/Startpage', (req, res) => {
            const readme = fs.readFileSync(archivePath + 'README.txt', { encoding: 'utf-8' })
            res.render('archive/views/Startpage', { ReadmeTxt: readme })
        })

        this.app.get('/archive/views/Account', (req, res) => {
            const userData = JSON.parse(fs.readFileSync(archivePath + 'account/' + 'user.json', { encoding: 'utf-8' }))

            res.render('archive/views/Account', { userData: userData })
        })

        this.app.get('/archive/views/Channels', (req, res) => {
            const index = JSON.parse(fs.readFileSync(archivePath + 'messages/' + 'index.json', { encoding: 'utf-8' }))
            
            const channelList = fs.readdirSync(archivePath + 'messages/')
            const channels = []
            for (let i = 0; i < channelList.length; i++) {
                const channelID = channelList[i]
                try {
                    channels.push(JSON.parse(fs.readFileSync(archivePath + 'messages/' + channelID + '/channel.json', { encoding: 'utf-8' })))
                } catch (error) { }
            }

            res.render('archive/views/Channels', { channels: channels })
        })

        this.app.get('/archive/views/Applications', (req, res) => {
            const appList = fs.readdirSync(archivePath + 'account/applications/')
            const apps = []
            for (let i = 0; i < appList.length; i++) {
                const appID = appList[i]
                apps.push(JSON.parse(fs.readFileSync(archivePath + 'account/applications/' + appID + '/application.json', { encoding: 'utf-8' })))
            }
            res.render('archive/views/Applications', { apps: apps })
        })

        this.app.get('/archive/views/Moderating', (req, res) => {
            if (this.archiveModeratingSearchedChannelId.length > 0) {
                this.RenderArchivePage_Moderating(req, res)
            } else if (this.archiveModeratingSearchedServerId.length > 0) {
                this.RenderArchivePage_ModeratingGuildSearch(req, res)
            } else {
                this.RenderArchivePage_ModeratingSearch(req, res)
            }
        })

        this.app.post('/archive/views/Moderating/Search', (req, res) => {
            const serverId = req.body.id

            const guildList = fs.readdirSync(archivePath + 'servers/')

            if (guildList.includes(serverId)) {
                this.archiveModeratingSearchedServerId = serverId
                this.archiveModeratingSearchedChannelId = ''

                this.RenderArchivePage_ModeratingGuildSearch(req, res)
            } else {
                this.RenderArchivePage_ModeratingSearch(req, res, `Server not found. (id: "${req.body.id}")`)
            }
        })

        this.app.post('/archive/views/Moderating/Back', (req, res) => {
            this.archiveModeratingSearchedServerId = ''
            this.archiveModeratingSearchedChannelId = ''

            this.RenderArchivePage_ModeratingSearch(req, res)
        })

        this.app.post('/archive/views/Moderating/Server/Back', (req, res) => {
            this.archiveModeratingSearchedChannelId = ''

            if (this.archiveModeratingSearchedServerId.length > 0) {
                this.RenderArchivePage_ModeratingGuildSearch(req, res)
            } else {
                this.RenderArchivePage_ModeratingSearch(req, res)
            }
        })

        this.app.post('/archive/views/Moderating/Server/Search', (req, res) => {
            const channelId = req.body.id
    
            const channelList = fs.readdirSync(archivePath + 'messages/')
            if (channelList.includes(channelId)) {
                this.archiveModeratingSearchedChannelId = channelId

                this.RenderArchivePage_Moderating(req, res)
            } else {
                this.RenderArchivePage_ModeratingSearch(req, res, `Channel not found. (id: "${req.body.id}")`)
            }
        })
    }

    RegisterWeatherRoots() {
        this.app.get('/weather', (req, res) => {
            res.render('weather/weather', { })
        })
    }
    
    ParseMessageContent(messageContent) {
        
        const ParseUsers = function(content) {
            const res = content.matchAll(/<@![0-9]{18}>/g)
            /** @type {{value: string, index: number}[]} */
            const result = []
            while (true) {
                /** @type {RegExpMatchArray | undefined} */
                const next = res.next().value
                if (next === undefined) { break }
                result.push({
                    value: next[0],
                    index: next.index
                })
            }

            /** @type {{type:'TEXT'|'USER';data:string;}[]} */
            var resultTxt = []
            if (result.length > 0) {
                var j = 0
                for (let i = 0; i < result.length; i++) {
                    const resItem = result[i]
                    resultTxt.push({
                        type: 'TEXT',
                        data: content.substring(j, resItem.index)
                    })
                    resultTxt.push({
                        type: 'USER',
                        data: resItem.value.substring(3, 21)
                    })
                    j = resItem.index + resItem.value.length
                }
                resultTxt.push({
                    type: 'TEXT',
                    data: content.substring(j)
                })
            } else {
                resultTxt.push({
                    type: 'TEXT',
                    data: content
                })
            }

            return resultTxt
        }
        
        const ParseChannels = function(content) {
            const res = content.matchAll(/<#[0-9]{18}>/g)
            /** @type {{value: string, index: number}[]} */
            const result = []
            while (true) {
                /** @type {RegExpMatchArray | undefined} */
                const next = res.next().value
                if (next === undefined) { break }
                result.push({
                    value: next[0],
                    index: next.index
                })
            }

            /** @type {{type:'TEXT'|'CHANNEL';data:string;}[]} */
            var resultTxt = []
            if (result.length > 0) {
                var j = 0
                for (let i = 0; i < result.length; i++) {
                    const resItem = result[i]
                    resultTxt.push({
                        type: 'TEXT',
                        data: content.substring(j, resItem.index)
                    })
                    resultTxt.push({
                        type: 'CHANNEL',
                        data: resItem.value.substring(2, 20)
                    })
                    j = resItem.index + resItem.value.length
                }
                resultTxt.push({
                    type: 'TEXT',
                    data: content.substring(j)
                })
            } else {
                resultTxt.push({
                    type: 'TEXT',
                    data: content
                })
            }

            return resultTxt
        }
        
        const ParseEmojis = function(content) {
            const res = content.matchAll(/<:[a-zA-Z]*:[0-9]{18}>/g)
            /** @type {{value: string, index: number}[]} */
            const result = []
            while (true) {
                /** @type {RegExpMatchArray | undefined} */
                const next = res.next().value
                if (next === undefined) { break }
                result.push({
                    value: next[0],
                    index: next.index
                })
            }

            /** @type {{type:'TEXT'|'EMOJI';data:string;}[]} */
            var resultTxt = []
            if (result.length > 0) {
                var j = 0
                for (let i = 0; i < result.length; i++) {
                    const resItem = result[i]
                    resultTxt.push({
                        type: 'TEXT',
                        data: content.substring(j, resItem.index)
                    })
                    resultTxt.push({
                        type: 'EMOJI',
                        data: resItem.value.substring(0, resItem.value.length)
                    })
                    j = resItem.index + resItem.value.length
                }
                resultTxt.push({
                    type: 'TEXT',
                    data: content.substring(j)
                })
            } else {
                resultTxt.push({
                    type: 'TEXT',
                    data: content
                })
            }

            return resultTxt
        }
        
        const ParsePings = function(content) {
            const res = content.matchAll(/@(everyone|here)/g)
            /** @type {{value: string, index: number}[]} */
            const result = []
            while (true) {
                /** @type {RegExpMatchArray | undefined} */
                const next = res.next().value
                if (next === undefined) { break }
                result.push({
                    value: next[0],
                    index: next.index
                })
            }

            /** @type {{type:'TEXT'|'PING';data:string;}[]} */
            var resultTxt = []
            if (result.length > 0) {
                var j = 0
                for (let i = 0; i < result.length; i++) {
                    const resItem = result[i]
                    resultTxt.push({
                        type: 'TEXT',
                        data: content.substring(j, resItem.index)
                    })
                    resultTxt.push({
                        type: 'PING',
                        data: resItem.value
                    })
                    j = resItem.index + resItem.value.length
                }
                resultTxt.push({
                    type: 'TEXT',
                    data: content.substring(j)
                })
            } else {
                resultTxt.push({
                    type: 'TEXT',
                    data: content
                })
            }

            return resultTxt
        }
        
        const ParseURLs = function(content) {
            const res = content.matchAll(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\!]*)/g)
            /** @type {{value: string, index: number}[]} */
            const result = []
            while (true) {
                /** @type {RegExpMatchArray | undefined} */
                const next = res.next().value
                if (next === undefined) { break }
                result.push({
                    value: next[0],
                    index: next.index
                })
            }

            /** @type {{type:'TEXT'|'URL';data:string;}[]} */
            var resultTxt = []
            if (result.length > 0) {
                var j = 0
                for (let i = 0; i < result.length; i++) {
                    const resItem = result[i]
                    resultTxt.push({
                        type: 'TEXT',
                        data: content.substring(j, resItem.index)
                    })
                    resultTxt.push({
                        type: 'URL',
                        data: resItem.value
                    })
                    j = resItem.index + resItem.value.length
                }
                resultTxt.push({
                    type: 'TEXT',
                    data: content.substring(j)
                })
            } else {
                resultTxt.push({
                    type: 'TEXT',
                    data: content
                })
            }

            return resultTxt
        }

        const parseResult = []

        ParseUsers(messageContent).forEach(e1 => {
            if (e1.type === 'TEXT') {
                ParseChannels(e1.data).forEach(e2 => {
                    if (e2.type === 'TEXT') {
                        ParseEmojis(e2.data).forEach(e3 => {
                            if (e3.type === 'TEXT') {
                                ParsePings(e3.data).forEach(e4 => {
                                    if (e4.type === 'TEXT') {
                                        ParseURLs(e4.data).forEach(e5 => {
                                            parseResult.push(e5)
                                        })
                                    } else {
                                        parseResult.push(e4)
                                    }
                                })
                            } else {
                                parseResult.push(e3)
                            }
                        })
                    } else {
                        parseResult.push(e2)
                    }
                })
            } else {
                parseResult.push(e1)
            }
        })

        var attachmentCounter = 0
        for (let i = 0; i < parseResult.length; i++) {
            const element = parseResult[i]
            if (element.type === 'URL') {
                const URL = require('node:url')
                const url = URL.parse(element.data)
                if (url.path.toLowerCase().endsWith('.png') ||
                url.path.toLowerCase().endsWith('.jpg') ||
                url.path.toLowerCase().endsWith('.gif')) {
                    attachmentCounter += 1
                    parseResult[i].attachmentID = attachmentCounter
                    parseResult.push({
                        type: 'IMG',
                        data: element.data,
                        attachmentID: attachmentCounter
                    })
                } else if (url.path.toLowerCase().endsWith('.mov') ||
                url.path.toLowerCase().endsWith('.mp4')) {
                    attachmentCounter += 1
                    parseResult[i].attachmentID = attachmentCounter
                    parseResult.push({
                        type: 'VIDEO',
                        data: element.data,
                        attachmentID: attachmentCounter
                    })
                }
            }
        }

        return parseResult
    }
    /** @param {{type:'TEXT'|'USER'|'CHANNEL'|'EMOJI'|'PING'|'URL'|'IMG';data:string;attachmentID:number|undefined}[]} parsedContent */
    ParseMessageContentToHandlebars(parsedContent) {
        if (typeof parsedContent === 'string') {
            return(this.ParseMessageContent(parsedContent))
        }
        var result = []
        for (let i = 0; i < parsedContent.length; i++) {
            const element = parsedContent[i]
            if (element.type === 'TEXT') {
                result.push({
                    text: element.data
                })
            } else if (element.type === 'USER') {
                var userData = undefined
                if (this.client.users.cache.has(element.data)) {
                    const cacheUser = this.client.users.cache.get(element.data)
                    userData = {
                        username: cacheUser.username,
                        avatarURL: cacheUser.avatarURL({ size: 16 }),
                        defaultAvatarURL: cacheUser.defaultAvatarURL
                    }
                }
                result.push({
                    user: element.data,
                    userData: userData
                })
            } else if (element.type === 'CHANNEL') {
                var channelData = undefined
                if (this.client.channels.cache.has(element.data)) {
                    const cacheChannel = this.client.channels.cache.get(element.data)
                    channelData = {
                        name: cacheChannel.name
                    }
                }
                result.push({
                    channel: element.data,
                    channelData: channelData
                })
            } else if (element.type === 'EMOJI') {
                const parsedEmoji = Discord.parseEmoji(element.data)
                var emoji = {
                    id: parsedEmoji.id,
                    animated: parsedEmoji.animated,
                    name: parsedEmoji.name
                }
                
                if (this.client.emojis.cache.has(parsedEmoji.id)) {
                    emoji.url = this.client.emojis.cache.get(parsedEmoji.id).url
                }

                result.push({ emoji: emoji })
            } else if (element.type === 'PING') {
                result.push({ ping: element.data })
            } else if (element.type === 'URL') {
                result.push({
                    url: element.data,
                    attachmentID: element.attachmentID
                })
            } else if (element.type === 'IMG') {
                result.push({
                    img: element.data,
                    attachmentID: element.attachmentID
                })
            } else if (element.type === 'VIDEO') {
                result.push({
                    video: element.data,
                    attachmentID: element.attachmentID
                })
            }
        }
        return result
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

module.exports = WebInterfaceManager
