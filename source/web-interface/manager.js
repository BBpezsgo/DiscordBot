// @ts-check

const express = require('express')
const ExpressHandlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const Discord = require('discord.js')
const LogManager = require('../functions/log')
const ContentParser = require('./content-parser')
const LogError = require('../functions/errorLog')
const CacheManager = require('../functions/offline-cache')
const { GetID, GetHash, AddNewUser, RemoveAllUser } = require('../economy/userHashManager')
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
const { HbLog, HbGetLogs, HbStart } = require('./log')
const { CreateCommandsSync, DeleteCommandsSync, DeleteCommand, Updatecommand } = require('../functions/commands')
const { MessageType, GuildVerificationLevel } = require('discord.js')
const process = require('process')
const archivePath = 'D:/Mappa/Discord/DiscordOldData/'
const Key = require('../key')
/** @type {import('../config').Config} */
// @ts-ignore
const CONFIG = require('../config.json')
const Path = require('path')
const ArchiveBrowser = require('../functions/archive-browser')
const HarBrowser = require('../functions/har-discord-browser')
const Utils = require('./utils')
const WebInterfaceHandlebarsManager = require('./manager-handlebars')
const WebSocket = require('ws')

/** @type {Handlebars.HelperDeclareSpec} */
const HandlebarsHelpers = {
    "equal": function(arg1, arg2, /** @type {Handlebars.HelperOptions} */ options) {
        if (arg1 === arg2) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    'switch': function(value, /** @type {Handlebars.HelperOptions} */ options) {
        this.switch_value = value
        // @ts-ignore
        this.done = false
        return options.fn(this)
    },
    'case': function(value, /** @type {Handlebars.HelperOptions} */ options) {
        // @ts-ignore
        if (this.done !== true && value === this.switch_value) {
            // @ts-ignore
            this.done = true
            return options.fn(this)
        }
    },
    'casedefault': function(/** @type {Handlebars.HelperOptions} */ options) {
        // @ts-ignore
        if (this.done !== true) {
            return options.fn(this)
        }
    }
}

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

        this.ID = `${ip}:${port}`

        /** @type {'DESKTOP' | 'MOBILE' | 'RASPBERRY'} */
        this.ClientType = clientType

        this.database = database

        this.statesManager = statesManager

        this.statesManager.WebInterface[this.ID] = {
            IsDone: false,
            Error: '',
            URL: '',
            ClientsTime: [],
            Clients: [],
            Requests: []
        }

        if (clientType != 'MOBILE') { HbStart() }

        this.app = express()
        this.app.engine('hbs', ExpressHandlebars.engine({
            extname: '.hbs',
            defaultLayout: 'layout',
            layoutsDir: Path.join(CONFIG.paths.webInterface, '/layouts'),
            helpers: HandlebarsHelpers,
            partialsDir: Path.join(CONFIG.paths.webInterface, '/partials'),
        }))
        this.app.set('views', path.join(CONFIG.paths.webInterface, 'views'))
        this.app.set('view engine', 'hbs')
        this.app.use(express.static(path.join(CONFIG.paths.webInterface, 'public')))
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

            const url = new URL(req.url, `http://${req.headers.host}`)
            const authKey = url.searchParams.get('key')
            if (authKey) {
                if (authKey === Key.Get()) {
                    return next()
                } else {
                    res.status(401).statusMessage = 'Invalid Key'
                    res.end()
                    return
                }
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
            res.status(401).render('view/401')
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

        this.handlebarsManager = new WebInterfaceHandlebarsManager(client, database, StartBot, StopBot, clientType, statesManager, this.app)

        this.RegisterHandlebarsRoots()
        if (this.database) this.RegisterPublicRoots()
        this.RegisterWeatherRoots()
        this.RegisterArchiveBrowserRoots()
        
        this.app.get('/', (req, res) => {
            res.status(200).render('start')
        })
        
        this.app.get('/config.json', (req, res) => {
            if (req.headers['this-is-forwarded'] === 'bruh') {
                res.status(401).send('Access denied: only accessible from LAN<br><br>You are trying to access it through my forwarder >:(')
                return
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            if (typeof ip !== 'string') {
                res.status(500).send('Bruh')
                return
            }

            if (ip.startsWith('127.') || ip.startsWith('192.168.1.')) {} else {
                res.status(401).send('Access denied: only accessible from LAN<br><br>The address ' + ip + ' is not private')
                return
            }

            res.status(200).send(CONFIG)
        })
        
        this.app.get('/mobile-config.json', (req, res) => {
            if (req.headers['this-is-forwarded'] === 'bruh') {
                res.status(401).send('Access denied: only accessible from LAN<br><br>You are trying to access it through my forwarder >:(')
                return
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            if (typeof ip !== 'string') {
                res.status(500).send('Bruh')
                return
            }

            if (ip.startsWith('127.') || ip.startsWith('192.168.1.')) {} else {
                res.status(401).send('Access denied: only accessible from LAN<br><br>The address ' + ip + ' is not private')
                return
            }

            const configRaw = fs.readFileSync(Path.join(CONFIG.paths.base, './mobile-config.json'), 'utf8')
            res.status(200).send(JSON.parse(configRaw))
        })
        
        this.app.get('*', (req, res) => {
            res.status(404).render('404', {
                url: req.url
            })
        })

        this.OnStartListen = () => {
            this.statesManager.WebInterface[this.ID].IsDone = true
            // @ts-ignore
            this.statesManager.WebInterface[this.ID].URL = 'http://' + this.server.address().address + ":" + this.server.address().port
            if (this.ClientType != 'MOBILE') {
                HbLog({ type: 'NORMAL', message: 'Listening on ' + ip + ':' + port })
            }
        }

        this.server = this.app.listen(port, ip, this.OnStartListen)

        this.wss = new WebSocket.Server({
            server: this.server,
        })
        this.wss.on('listening', () => {
            const wssAddress = this.wss.address()
            if (typeof wssAddress === 'string') {
                console.log('[WSS]: Listening on ' + wssAddress)
            } else {
                console.log('[WSS]: Listening on ' + wssAddress.address + ':' + wssAddress.port + ' (' + wssAddress.family + ')')
            }
        })
        this.wss.on('close', () => {
            console.log('[WSS]: Closed')
        })
        this.wss.on('error', (error) => {
            console.error('[WSS]: Error ', error)
        })
        this.wss.on('connection', req => {
            req.on('message', (data) => {
                console.log('[WSS]: received: ' + data.toString('utf8'))
            })
            req.on('close', (code, reason) => {
                console.log('[WSS]: Client "' + req.url + '" closed (' + code + ') (' + reason + ')')
            })
            req.on('error', (error) => {
                console.error('[WSS]: Client "' + req.url + '" error', error)
            })
            req.on('ping', (data) => {
                console.error('[WSS]: Client "' + req.url + '" ping', data.toString('utf8'))
            })
            req.on('pong', (data) => {
                console.error('[WSS]: Client "' + req.url + '" pong', data.toString('utf8'))
            })
        })

        /** @param {WebInterfaceManager} self */
        const WssBroadcastStatus = function(self) {
            if (!self.wss) { return }
            if (!self.wss.clients) { return }
            for (const client of self.wss.clients) {
                client.send(JSON.stringify({
                    type: 'bot-user-status',
                    data: {
                        username: self.client?.user?.username,
                        avatarUrl: self.client?.user?.avatarURL({ size: 32 }),
                        status: self.client?.user?.presence?.status ?? 'offline',
                    }
                }))
            }
        }

        setTimeout(() => {
            clearInterval(this.wssStatusInterval)
            this.wssStatusInterval = setInterval(() => WssBroadcastStatus(this), 5000)
        }, 5000)

        this.wssStatusInterval = setInterval(() => WssBroadcastStatus(this), 500)

        this.server.on('error', (err) => {
            console.error('[WEBSERVER]: Error', err)
            if (err.message.startsWith('listen EADDRNOTAVAIL: address not available')) {
                this.statesManager.WebInterface[this.ID].Error = 'Address not available'
            } else {
                this.statesManager.WebInterface[this.ID].Error = err.message
            }
            if (this.ClientType != 'MOBILE') {
                HbLog({ type: 'ERROR', message: err.message, helperMessage: 'Server error: ' + err.message })
            }
        })
        this.server.on('clientError', (err, socket) => {
            if (this.ClientType != 'MOBILE') {
                HbLog({ type: 'CLIENT_ERROR', message: err.message, helperMessage: 'Client error: ' + err.message })
            }

            // @ts-ignore
            if (err.code === 'ECONNRESET' || !socket.writable) {
                return
            }
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        })
        this.server.on('close', () => {
            this.statesManager.WebInterface[this.ID].IsDone = false
            this.statesManager.WebInterface[this.ID].URL = ''
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
            this.statesManager.WebInterface[this.ID].Clients.push(socket)
            this.statesManager.WebInterface[this.ID].ClientsTime.push(10)
        })
        this.server.on('request', (req, res) => {
            this.statesManager.WebInterface[this.ID].Requests.push(10)
            if (this.ClientType != 'MOBILE') {
                HbLog({ IP: req.socket.remoteAddress, type: 'REQUIEST', url: req.url, method: req.method, helperMessage: 'Someone requiested' })
            }
        })
        this.server.on('upgrade', (req, socket, head) => {
            if (this.ClientType != 'MOBILE') {
                HbLog({ IP: req.socket.remoteAddress, type: 'NORMAL', message: 'Upgrade', helperMessage: 'Someone upgraded' })
            }
        })
        this.server.on('listening', () => {
            const webserverAddress = this.server.address()
            if (typeof webserverAddress === 'string') {
                console.log('[WEBSERVER]: Listening on ' + webserverAddress)
            } else {
                console.log('[WEBSERVER]: Listening on ' + webserverAddress.address + ':' + webserverAddress.port + ' (' + webserverAddress.family + ')')
            }
        })

        this.databaseSearchedUserId = ''
        this.moderatingSearchedServerId = ''
        this.moderatingSearchedChannelId = ''

        this.archiveModeratingSearchedServerId = ''
        this.archiveModeratingSearchedChannelId = ''

        this.viewUserMessagedId = ''

        this.commandsDeleting = false
        this.commandsCreating = false
        this.commandsCreatingPercent = 0.0
    }

    Get_ServersCache() {
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
                nsfwLevel: NsfwLevel[server.nsfwLevel],
                mfaLevel: MFALevel[server.mfaLevel],
                verificationLevel: server.verificationLevel,
                splash: server.splash,

                available: server.available,
                large: server.large,
            }

            servers.push(newServer)
        });

        return servers
    }

    RenderPage_ModeratingError(res, searchError) {
        res.render(`view/ModeratingError`, { servers: this.Get_ServersCache(), searchError: searchError })
    }

    RenderPage_Archived_ModeratingGuildSearch(req, res, searchError) {
        if (this.moderatingSearchedServerId.length === 0) {
            this.RenderPage_ModeratingError(res, 'No archived server selected')
            return
        }

        ArchiveBrowser.Servers()
            .then(guilds => {
                /** @type {ArchiveBrowser.ArchivedGuild} */
                const g = guilds[this.moderatingSearchedServerId]
        
                if (!g) {
                    this.RenderPage_ModeratingError(res, `Archived server \"${this.moderatingSearchedServerId}\" not found`)
                    return
                }
        
                const guild = {
                    iconData:
                        g.IconPath ?
                        (Buffer.from(fs.readFileSync(g.IconPath))).toString('base64') :
                        null,
        
                    name: g.name,
                    id: g.id,
                }
        
                const emojis = []
                g.Emojis?.forEach((emoji) => {
                    emojis.push({
                        animated: emoji.animated,
                        author: emoji.user_id,
                        available: emoji.available,
                        id: emoji.id,
                        managed: emoji.managed,
                        name: emoji.name,
                        requiresColons: emoji.require_colons,
                        roles: emoji.roles,
                        imageData:
                            emoji.image_path ?
                            (Buffer.from(fs.readFileSync(emoji.image_path))).toString('base64') :
                            null,
                    })
                })
        
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
        
                g.Channels?.forEach(channel => {
                    if (channel.type === Discord.ChannelType.GuildCategory) {
                        const channels = []
        
                        for (let i = 0; i < g.Channels.length; i++) {
                            const child = g.Channels[i]
                            if (child.parent_id === channel.id) {
                                const newChannel = {
                                    id: child.id,
                                    position: child.position,
                                    name: child.name,
                                    nsfw: child.nsfw,
                                    type: child.type,
                                    parentId: child.parent_id,
                                    typeText: GetTypeText(child.type),
                                    typeUrl: GetTypeUrl(child.type),
                                }
                
                                channels.push(newChannel)
                            }
                        }
                        
                        channels.sort(function(a, b) { return a.position - b.position })
        
                        const newGroup = {
                            id: channel.id,
                            name: channel.name,
                            channels: channels,
                        }
        
                        groups.push(newGroup)
                    } else if (channel.parent_id == null) {
                        const newChannel = {
                            id: channel.id,
                            position: channel.position,
                            name: channel.name,
                            nsfw: channel.nsfw,
                            type: channel.type,
                            parentId: channel.parent_id,
                            typeText: GetTypeText(channel.type),
                            typeUrl: GetTypeUrl(channel.type),
                        }
        
                        singleChannels.push(newChannel)
                    }
                });
        
                singleChannels.sort(function(a, b) { return a.position - b.position })
        
                res.render('view/archive/ModeratingGuildSearch', {
                    server: guild,
                    searchError: searchError,
                    singleChannels: singleChannels,
                    groups: groups,
                    emojis: emojis,
                })
            })
            .catch(LogError)
    }

    RenderPage_HAR_ModeratingGuildSearch(req, res, searchError) {
        if (this.moderatingSearchedServerId.length === 0) {
            this.RenderPage_ModeratingError(res, 'No HAR server selected')
            return
        }

        const guilds = HarBrowser.Guilds()

        const g = guilds[this.moderatingSearchedServerId]

        if (!g) {
            this.RenderPage_ModeratingError(res, `HAR server \"${this.moderatingSearchedServerId}\" not found`)
            return
        }

        const guild = {
            iconUrlLarge: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp`,
            iconUrlSmall: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=64`,
            name: g.name,
            id: g.id,
            description: g.description,
            nsfw_level: g.nsfw_level,
            nsfw: g.nsfw,
            verification_level: g.verification_level,
            memberCount: g.memberCount,
        }

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
        /** @type {any[]} */
        const singleChannels = []

        for (const channelId in g.channels) {
            const channel = g.channels[channelId]
            if (channel.type === Discord.ChannelType.GuildCategory) {
                groups.push(channel)
            } else {
                const newChannel = {
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    typeText: GetTypeText(channel.type),
                    typeUrl: GetTypeUrl(channel.type),
                }

                singleChannels.push(newChannel)
            }
        }

        res.render('view/har/ModeratingGuildSearch', {
            server: guild,
            searchError: searchError,
            singleChannels: singleChannels,
            groups: groups,
        })
    }

    RenderPage_Archived_Moderating(req, res) {
        if (this.moderatingSearchedServerId.length === 0) {
            this.RenderPage_ModeratingError(res, 'No archived server selected')
            return
        }

        ArchiveBrowser.Servers()
            .then(guilds => {
                /** @type {ArchiveBrowser.ArchivedGuild} */
                const g = guilds[this.moderatingSearchedServerId]
        
                if (!g) {
                    this.RenderPage_ModeratingError(res, `Archived server \"${this.moderatingSearchedServerId}\" not found`)
                    return
                }
        
                if (this.moderatingSearchedChannelId.length === 0) {
                    this.RenderPage_Archived_ModeratingGuildSearch(req, res, 'No archived channel selected')
                    return
                }
        
                /** @type {ArchiveBrowser.ArchivedChannel} */
                let c = undefined
        
                g.Channels?.forEach(channel => {
                    if (channel.id == this.moderatingSearchedChannelId) {
                        c = channel
                    }
                })
        
                if (!c) {
                    this.RenderPage_Archived_ModeratingGuildSearch(req, res, `Archived channel \"${this.moderatingSearchedChannelId}\" not found`)
                    return
                }
        
                const guild = {
                    iconData:
                        g.IconPath ?
                        (Buffer.from(fs.readFileSync(g.IconPath))).toString('base64') :
                        null,
        
                    name: g.name,
                    id: g.id,
                }
        
                const channel = {
                    id: c.id,
                    name: c.name,
                    nsfw: c.nsfw,
                    topic: c.topic,
                    type: c.type,
                    rate_limit_per_user: c.rate_limit_per_user,
                }

                const accountData = ArchiveBrowser.Account()
        
                /** @type {{id:string;createdAtTimestamp:number}[]} */
                const messages = []
        
                if (c.messages && c.messages.length > 0) {
                    c.messages.forEach(message => {                
                        messages.push({
                            // @ts-ignore
                            content: Utils.GetHandlebarsMessage(this.client, message.content),
                            attachment: message.attachment,
                            id: message.id,
                            createdAt: message.date,
                            createdAtTimestamp: Date.parse(message.date),
                            author: accountData,
                        })
                    })
        
                    messages.sort((a, b) => { return a.createdAtTimestamp - b.createdAtTimestamp })
                }
        
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
        
                g.Channels?.forEach(channel => {
                    if (channel.type === Discord.ChannelType.GuildCategory) {
                        const channels = []
        
                        for (let i = 0; i < g.Channels.length; i++) {
                            const child = g.Channels[i]
                            if (child.parent_id === channel.id) {
                                const newChannel = {
                                    id: child.id,
                                    position: child.position,
                                    name: child.name,
                                    nsfw: child.nsfw,
                                    type: child.type,
                                    parentId: child.parent_id,
                                    typeText: GetTypeText(child.type),
                                    typeUrl: GetTypeUrl(child.type),
                                }
                
                                channels.push(newChannel)
                            }
                        }
                        
                        channels.sort(function(a, b) { return a.position - b.position })
        
                        const newGroup = {
                            id: channel.id,
                            name: channel.name,
                            channels: channels,
                        }
        
                        groups.push(newGroup)
                    } else if (channel.parent_id == null) {
                        const newChannel = {
                            id: channel.id,
                            position: channel.position,
                            name: channel.name,
                            nsfw: channel.nsfw,
                            type: channel.type,
                            parentId: channel.parent_id,
                            typeText: GetTypeText(channel.type),
                            typeUrl: GetTypeUrl(channel.type),
                        }
        
                        singleChannels.push(newChannel)
                    }
                });
        
                singleChannels.sort(function(a, b) { return a.position - b.position })
        
                for (let i = 0; i < groups.length; i++)
                { if (channel.id === groups[i].id) { groups[i].selected = true; break } }
                for (let i = 0; i < singleChannels.length; i++)
                // @ts-ignore
                { if (channel.id === singleChannels[i].id) { singleChannels[i].selected = true; break } }
        
                res.render('view/archive/Moderating', {
                    server: guild,
                    singleChannels: singleChannels,
                    groups: groups,
                    messages: messages,
                    channel: channel
                })
            })
            .catch(LogError)
    }

    RenderPage_HAR_Moderating(req, res) {
        if (this.moderatingSearchedServerId.length === 0) {
            this.RenderPage_ModeratingError(res, 'No HAR server selected')
            return
        }

        const guilds = HarBrowser.Guilds()
        const channels = HarBrowser.Load().channels

        const g = guilds[this.moderatingSearchedServerId]

        if (!g) {
            this.RenderPage_ModeratingError(res, `HAR server \"${this.moderatingSearchedServerId}\" not found`)
            return
        }

        if (this.moderatingSearchedChannelId.length === 0) {
            this.RenderPage_HAR_ModeratingGuildSearch(req, res, 'No HAR channel selected')
            return
        }

        /** @type {HarBrowser.Channel}  */
        let channelData = undefined

        for (const channelId in channels) {
            const channel = channels[channelId]
            if (channel.id == this.moderatingSearchedChannelId) {
                channelData = channel
                break
            }
        }

        if (!channelData) {
            for (const channelId in g.channels) {
                if (!channels[channelId]) continue
                const channel = channels[channelId]
                if (channel.id == this.moderatingSearchedChannelId) {
                    channelData = channel
                    break
                }
            }
        }

        if (!channelData) {
            this.RenderPage_HAR_ModeratingGuildSearch(req, res, `HAR channel \"${this.moderatingSearchedChannelId}\" not found (2)`)
            return
        }

        const guild = {
            iconData:
                // @ts-ignore
                g.IconPath ?
                // @ts-ignore
                (Buffer.from(fs.readFileSync(g.IconPath))).toString('base64') :
                null,

            name: g.name,
            id: g.id,
        }

        const channel = {
            id: this.moderatingSearchedChannelId,
        }

        /** @type {{id:string;createdAtTimestamp:number}[]} */
        const messages = []

        if (channelData.messages && channelData.messages.length > 0) {
            channelData.messages.forEach(message => {                
                messages.push({
                    // @ts-ignore
                    content: Utils.GetHandlebarsMessage(this.client, message.content),
                    attachments: message.attachments,
                    id: message.id,
                    createdAt: GetTime(new Date(Date.parse(message.timestamp))),
                    createdAtTimestamp: Date.parse(message.timestamp),
                    author: message.author,
                })
            })

            messages.sort((a, b) => { return a.createdAtTimestamp - b.createdAtTimestamp })
        }

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

        for (const channelId in g.channels) {
            const channel = g.channels[channelId]
            if (channel.type === Discord.ChannelType.GuildCategory) {
                const channels = []

                const newGroup = {
                    id: channel.id,
                    name: channel.name,
                    channels: channels,
                }

                groups.push(newGroup)
            } else {
                const newChannel = {
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    typeText: GetTypeText(channel.type),
                    typeUrl: GetTypeUrl(channel.type),
                }

                                // @ts-ignore
                singleChannels.push(newChannel)
            }
        }

        for (let i = 0; i < groups.length; i++)
        { if (channel.id === groups[i].id) { groups[i].selected = true; break } }
        for (let i = 0; i < singleChannels.length; i++)
        // @ts-ignore
        { if (channel.id === singleChannels[i].id) { singleChannels[i].selected = true; break } }

        res.render('view/har/Moderating', {
            server: guild,
            singleChannels: singleChannels,
            groups: groups,
            messages: messages,
            channel: {
                name: channelData.name,
            },
        })
    }

    RegisterHandlebarsRoots() {
        this.app.get('/archived/view/moderating/Search', (req, res) => {
            const serverId = req.query.id
            if (typeof serverId !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }

            ArchiveBrowser.Servers()
                .then(guilds => {
                    if (guilds[serverId]) {
                        this.moderatingSearchedServerId = serverId
        
                        this.RenderPage_Archived_ModeratingGuildSearch(req, res, '')
                    } else {
                        this.RenderPage_ModeratingError(res, `Archived server \"${serverId}\" not found`)
                    }
                })
                .catch(LogError)
        })

        this.app.get('/har/view/moderating/Search', (req, res) => {
            const serverId = req.query.id
            if (typeof serverId !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }

            const guilds = HarBrowser.Guilds()
            if (guilds[serverId]) {
                this.moderatingSearchedServerId = serverId

                this.RenderPage_HAR_ModeratingGuildSearch(req, res, '')
            } else {
                this.RenderPage_ModeratingError(res, `HAR server \"${serverId}\" not found`)
            }
        })

        this.app.post('/archived/view/moderating/Server/Back', (req, res) => {
            this.moderatingSearchedChannelId = ''

            this.RenderPage_Archived_ModeratingGuildSearch(req, res, '')
        })

        this.app.post('/archived/view/moderating/Server/Search', (req, res) => {
            const channelId = req.body.id

            ArchiveBrowser.Servers()
                .then(servers => {
                    for (const id in servers) {
                        /** @type {ArchiveBrowser.ArchivedGuild} */
                        const server = servers[id]
                        if (server.Channels) {
                            for (let i = 0; i < server.Channels.length; i++) {
                                const channel = server.Channels[i]
                                
                                if (channelId == channel.id) {
                                    this.moderatingSearchedChannelId = channelId
                    
                                    this.RenderPage_Archived_Moderating(req, res)
                                    return
                                }
                            }
                        }
                    }
                    this.RenderPage_Archived_ModeratingGuildSearch(req, res, `Archived channel \"${channelId}\" not found`)
                })
                .catch(LogError)
        })

        this.app.post('/har/view/moderating/Server/Search', (req, res) => {
            const channelId = req.body.id ?? req.query.id

            const guilds = HarBrowser.Guilds()
            if (guilds[this.moderatingSearchedServerId]) {
                const guild = guilds[this.moderatingSearchedServerId]
                for (const _channelId in guild.channels) {
                    const channel = guild.channels[_channelId]
                    if (channelId == channel.id) {
                        this.moderatingSearchedChannelId = channelId
        
                        this.RenderPage_HAR_Moderating(req, res)
                        return
                    }
                }
            }
            this.RenderPage_HAR_ModeratingGuildSearch(req, res, `HAR channel \"${channelId}\" not found (0)`)
        })

        this.app.get('/har/view/moderating/Server/Search', (req, res) => {
            const channelId = req.body.id ?? req.query.id

            const guilds = HarBrowser.Guilds()
            for (const id in guilds) {
                const guild = guilds[id]
                for (const _channelId in guild.channels) {
                    const channel = guild.channels[_channelId]
                    
                    if (channelId == channel.id) {
                        this.moderatingSearchedChannelId = channelId
        
                        this.RenderPage_HAR_Moderating(req, res)
                        return
                    }
                }
            }
            this.RenderPage_HAR_ModeratingGuildSearch(req, res, `HAR channel \"${channelId}\" not found (1)`)
        })

        this.app.post('/har/view/moderating/Server/Back', (req, res) => {
            this.moderatingSearchedChannelId = ''

            this.RenderPage_HAR_ModeratingGuildSearch(req, res, '')
        })
    }

    RegisterPublicRoots() {
        const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
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
            const next = require('../economy/xpFunctions').xpRankNext(score)
            const scorePercent = score / next
            const xpImageUrl = require('../economy/xpFunctions').xpRankIconModern(score)
            const rankText = require('../economy/xpFunctions').xpRankText(score)

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
             * @param {string} userId
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
         * @param {import('express').Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req
         * @param {import('express').Response<any, Record<string, any>, number>} res
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
            if (typeof userHash !== 'string') {
                res.status(500).send('Invalid query parameter type')
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
                if (err) return res.status(404).send('Not Found')
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

        this.app.get('/archive/views/Applications', (req, res) => {
            const appList = fs.readdirSync(archivePath + 'account/applications/')
            const apps = []
            for (let i = 0; i < appList.length; i++) {
                const appID = appList[i]
                apps.push(JSON.parse(fs.readFileSync(archivePath + 'account/applications/' + appID + '/application.json', { encoding: 'utf-8' })))
            }
            res.render('archive/views/Applications', { apps: apps })
        })
    }

    RegisterWeatherRoots() {
        this.app.get('/weather', (req, res) => {
            res.render('weather/weather', { })
        })
    }
}

module.exports = WebInterfaceManager
