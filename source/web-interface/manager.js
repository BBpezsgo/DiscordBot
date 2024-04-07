// @ts-check

const express = require('express')
const ExpressHandlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const Discord = require('discord.js')
const LogManager = require('../functions/log')
const LogError = require('../functions/errorLog').LogError
const { GetID } = require('../economy/userHashManager')
const fs = require('fs')
const { DatabaseManager } = require('../functions/databaseManager.js')
const { StatesManager } = require('../functions/statesManager')
const {
    NsfwLevel,
    MFALevel
} = require('../functions/enums')
const { GetTime, GetDate } = require('../functions/utils')
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
    },
    'json': function(/** @type {Handlebars.HelperOptions} */ context) {
        return JSON.stringify(context)
    },
    "svg": function(/** @type {Handlebars.HelperOptions} */ context) {
        if (typeof context === 'string') {
            const _path = Path.join(CONFIG.paths.webInterface, 'public', 'images', context + '.svg')
            if (fs.existsSync(_path)) {
                return fs.readFileSync(_path, 'utf8')
            }
        } else {
            return null
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

        this.app.use((req, res, next) => {
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

            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).render('view/401')
        })

        this.handlebarsManager = new WebInterfaceHandlebarsManager(client, database, StartBot, StopBot, clientType, statesManager, this.app)

        this.RegisterHandlebarsRoots()
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
        }

        this.server = this.app.listen(port, ip, this.OnStartListen)

        this.wss = new WebSocket.Server({
            server: this.server,
        })
        this.wss.on('listening', () => {
            const wssAddress = this.wss.address()
            if (typeof wssAddress === 'string') {
                console.log(`[WebSocketServer]: Listening on ${wssAddress}`)
            } else {
                console.log(`[WebSocketServer]: Listening on ${wssAddress.address}:${wssAddress.port} (${wssAddress.family})`)
            }
        })
        this.wss.on('close', () => {
            console.log('[WebSocketServer]: Closed')
        })
        this.wss.on('error', (error) => {
            console.error('[WebSocketServer]: Error ', error)
        })
        this.wss.on('connection', req => {
            req.on('message', (data) => {
                console.log('[WebSocketServer]: Received: ' + data.toString('utf8'))
            })
            req.on('close', (code, reason) => {
                console.log(`[WebSocketServer]: Client "${req.url}" closed (${code})`, reason.toString('utf8'))
            })
            req.on('error', (error) => {
                console.error(`[WebSocketServer]: Client "${req.url}" error`, error)
            })
            req.on('ping', (data) => {
                console.log(`[WebSocketServer]: Client "${req.url}" ping`, data.toString('utf8'))
            })
            req.on('pong', (data) => {
                console.log(`[WebSocketServer]: Client "${req.url}" pong`, data.toString('utf8'))
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
            console.error('[WebServer]: Error', err)
            if (err.message.startsWith('listen EADDRNOTAVAIL: address not available')) {
                this.statesManager.WebInterface[this.ID].Error = 'Address not available'
            } else {
                this.statesManager.WebInterface[this.ID].Error = err.message
            }
        })
        this.server.on('clientError', (err, socket) => {
            // @ts-ignore
            if (err.code === 'ECONNRESET' || !socket.writable) {
                return
            }
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        })
        this.server.on('close', () => {
            this.statesManager.WebInterface[this.ID].IsDone = false
            this.statesManager.WebInterface[this.ID].URL = ''
        })
        this.server.on('connect', (req, socket, head) => {
        })
        this.server.on('connection', (socket) => {
            this.statesManager.WebInterface[this.ID].Clients.push(socket)
            this.statesManager.WebInterface[this.ID].ClientsTime.push(10)
        })
        this.server.on('request', (req, res) => {
            this.statesManager.WebInterface[this.ID].Requests.push(10)
        })
        this.server.on('upgrade', (req, socket, head) => {
        })
        this.server.on('listening', () => {
            const webserverAddress = this.server.address()
            if (typeof webserverAddress === 'string') {
                console.log('[WebServer]: Listening on ' + webserverAddress)
            } else {
                console.log('[WebServer]: Listening on ' + webserverAddress.address + ':' + webserverAddress.port + ' (' + webserverAddress.family + ')')
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
            ...g,
            iconUrlLarge: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp`,
            iconUrlSmall: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=64`,
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
                    ...channel,
                    typeText: GetTypeText(channel.type),
                    typeUrl: GetTypeUrl(channel.type),
                }

                singleChannels.push(newChannel)
            }
        }

        res.render('view/har/ModeratingGuildSearch', {
            server: guild,
            searchError: searchError ?? 'No error',
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
            console.log(`[HAR]: Server ${this.moderatingSearchedServerId} not found`)

            this.RenderPage_ModeratingError(res, `HAR server \"${this.moderatingSearchedServerId}\" not found`)
            return
        }

        if (this.moderatingSearchedChannelId.length === 0) {
            console.log(`[HAR]: No channel selected`)

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
                const channel = g.channels[channelId]
                if (channel.id == this.moderatingSearchedChannelId) {
                    channelData = {
                        guild_id: g.id,
                        id: channelId,
                        messages: [],
                        name: channel.name,
                        type: channel.type,
                    }
                    break
                }
            }
        }

        if (!channelData) {
            console.log(`[HAR]: Channel ${this.moderatingSearchedChannelId} not found`)
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
            icon: g.icon,
        }

        const channel = {
            id: this.moderatingSearchedChannelId,
        }

        /** @type {{id:string;createdAtTimestamp:number}[]} */
        const messages = []

        /** @type {HarBrowser.User[]} */
        const members = []

        if (channelData.messages && channelData.messages.length > 0) {
            channelData.messages.forEach(message => {  
                const attachments = message.attachments
                const attachmentsResult = []
                for (const attachment of attachments) {
                    attachmentsResult.push({
                        contentType: Path.extname(attachment.filename),
                        height: attachment.height,
                        width: attachment.width,
                        id: attachment.id,
                        name: attachment.filename,
                        url: attachment.url,
                    })
                }

                const embedsResult = []
                for (const embed of message.embeds) {

                    let fieldsResult = null
                    if (embed.fields) {
                        fieldsResult = []
                        for (const field of embed.fields) {
                            fieldsResult.push({
                                name: Utils.GetHandlebarsMessage(this.client, field.name, this.moderatingSearchedServerId),
                                value: Utils.GetHandlebarsMessage(this.client, field.value, this.moderatingSearchedServerId),
                                inline: field.inline,
                            })
                        }
                    }

                    Discord.resolveColor
                    embedsResult.push({
                        ...embed,
                        color: undefined,
                        author: embed.author,
                        description: Utils.GetHandlebarsMessage(this.client, embed.description, this.moderatingSearchedServerId),
                        footer: undefined,
                        image: undefined,
                        thumbnail: embed.thumbnail,
                        url: embed.url,
                        title: Utils.GetHandlebarsMessage(this.client, embed.title, this.moderatingSearchedServerId),
                        fields: fieldsResult,
                    })
                }
              
                messages.push({
                    ...message,
                    // @ts-ignore
                    content: Utils.GetHandlebarsMessage(this.client, message.content),
                    attachments: message.attachments,
                    id: message.id,
                    createdAt: GetTime(new Date(Date.parse(message.timestamp))),
                    createdAtTimestamp: Date.parse(message.timestamp),
                    author: message.author,
                    embeds: embedsResult,
                })

                let memberAdded = false
                for (const member of members) {
                    if (member.id == message.author.id) {
                        memberAdded = true
                        break
                    }
                }
                if (!memberAdded) {
                    members.push(message.author)
                }
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

        console.log(`[HAR]: Send page "Moderating" ...`)
        res.render('view/har/Moderating', {
            server: guild,
            singleChannels: singleChannels,
            groups: groups,
            messages: messages,
            channel: {
                name: channelData.name,
            },
            members: members,
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

            console.log(`[HAR]: Search channel ${channelId}`)

            const guilds = HarBrowser.Guilds()
            
            if (guilds[this.moderatingSearchedServerId]) {
                const guild = guilds[this.moderatingSearchedServerId]
                for (const _channelId in guild.channels) {
                    const channel = guild.channels[_channelId]
                    if (channelId == channel.id) {
                        this.moderatingSearchedChannelId = channelId
        
                        console.log(`[HAR]: Channel ${channelId} found: `, channel)

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
            for (const id of guilds) {
                const guild = HarBrowser.Guild(id)
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
