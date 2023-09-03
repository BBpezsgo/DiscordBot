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
const { GetTime, GetDataSize, GetDate } = require('../functions/utils')
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

class WebInterfaceHandlebarsManager {
    /**
     * @param {Discord.Client} client
     * @param {DatabaseManager} database
     * @param {() => void} StartBot
     * @param {() => void} StopBot
     * @param {'DESKTOP' | 'MOBILE' | 'RASPBERRY'} clientType
     * @param {StatesManager} statesManager
     * @param {import('express').Express} app
     */
    constructor(client, database, StartBot, StopBot, clientType, statesManager, app) {
        this.client = client
        this.StartBot = StartBot
        this.StopBot = StopBot

        this.statesManager = statesManager

        /** @type {'DESKTOP' | 'MOBILE' | 'RASPBERRY'} */
        this.ClientType = clientType

        this.database = database
        this.app = app

        this.databaseSearchedUserId = ''
        this.moderatingSearchedServerId = ''
        this.moderatingSearchedChannelId = ''

        this.viewUserMessagedId = ''

        this.commandsDeleting = false
        this.commandsCreating = false
        this.commandsDeletingPercent = 0.0
        this.commandsCreatingPercent = 0.0

        this.ipToRate = { }

        /*
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

        this.app.get('/frames/top', (req, res) => {
            res.render('frames/top')
        })

        this.app.get('/view/MenuRpm', (req, res) => {
            res.render('view/MenuRpm')
        })
        */

        //#region GET HTML

        this.app.get('/dcbot/BotStatusPanel', (req, res) => {
            res.render('view/BotStatusPanel', this.client.user ? {
                username: this.client.user.username,
                avatar: this.client.user.avatarURL({ size: 32 }),
                discriminator: this.client.user.discriminator,
            } : {
                username: null,
                avatar: null,
                discriminator: '0000',
            })
        })

        this.app.get('/dcbot/view/menu.html', (req, res) => {
            res.render('view/Menu')
        })

        this.app.get('/dcbot/user-popup.html', (req, res) => {
            if (typeof req.query.id !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
            this.client.users.fetch(req.query.id)
            .then(user => {
                res.render('view/UserPopup', Utils.UserJson(user, this.database))
            })
            .catch((error) => res.status(500).send(error))
        })

        this.app.get('/dcbot/view/status.html', (req, res) => {
            this.RenderPage_Status(req, res)
        })

        this.app.get('/dcbot/view/cache-users.html', (req, res) => {
            this.RenderPage_DirectMessages(req, res)
        })

        this.app.get('/dcbot/view/cache-channels.html', (req, res) => {
            this.RenderPage_CacheChannels(req, res)
        })

        this.app.get('/dcbot/view/cache-emojis.html', (req, res) => {
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

            res.render(`view/CacheEmojis`, { emojis: emojis })
        })

        this.app.get('/dcbot/view/application.html', (req, res) => {
            const app = this.client.application

            if (app == undefined || app == null) {
                res.render(`view/ApplicationUnavaliable`)
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

            res.render(`view/Application`, { app: newApp })
        })

        this.app.get('/dcbot/view/process.html', (req, res) => {
            const uptime = new Date()
            uptime.setSeconds(Math.floor(process.uptime()))

            const proc = {
                argv: process.argv,
                connected: process.connected,
                debugPort: process.debugPort,
                execArgv: process.execArgv,
                // noAsar: process.noAsar,
                version: process.version,

                arch: process.arch,
                execPath: process.execPath,
                platform: process.platform,
                // chrome: process.chrome,
                // contextId: process.contextId,
                // contextIsolated: process.contextIsolated,
                // defaultApp: process.defaultApp,
                features: process.features,
                // isMainFrame: process.isMainFrame,
                // noDeprecation: process.noDeprecation,
                pid: process.pid,
                ppid: process.ppid,
                // resourcesPath: process.resourcesPath,
                // sandboxed: process.sandboxed,
                // throwDeprecation: process.throwDeprecation,
                title: process.title,
                // traceDeprecation: process.traceDeprecation,
                // traceProcessWarnings: process.traceProcessWarnings,
                // type: process.type,
                uptime: GetTime(uptime)
            }

            res.render(`view/Process`, { process: proc, dirname: __dirname, filename: __filename })
        })

        this.app.get('/dcbot/view/testing.html', (req, res) => {
            res.render(`view/Testing`)
        })

        this.app.get('/dcbot/view/moderating.html', (req, res) => {
            this.RenderPage_ModeratingError(req, res, '')
        })

        this.app.get('/dcbot/view/firebase.html', (req, res) => {
            res.render(`view/Firebase`)
        })

        this.app.get('/dcbot/view/database.html', (req, res) => {
            if (this.database == null || this.database == undefined) {
                res.render(`view/DatabaseNotSupported`)
            } else {
                this.RenderPage_DatabaseSearch(req, res, '')
            }
        })

        this.app.get('/dcbot/view/log-error.html', (req, res) => {
            const data = fs.readFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), 'utf8')
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
                } else if (line.startsWith('AbortError: ')) {
                    type = 'AbortError'
                    title = line.replace('AbortError: ', '')
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

                    var xd = line.replace(line.split(':')[0], '')
                    xd = xd.replace(':', '')
                    xd = line.replace(line.split(':')[0], '')
                    xd = xd.replace(': ', '')

                    title = xd
                } else if (line.includes(' ExperimentalWarning:')) {
                    icon = 'warning'
                    type = 'ExperimentalWarning'

                    var xd = line.replace(line.split(':')[0], '')
                    xd = xd.replace(':', '')
                    xd = line.replace(line.split(':')[0], '')
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

            res.render(`view/ErrorLogs`, { logs: linesProcessed })
        })

        this.app.get('/dcbot/view/log-handlebars.html', (req, res) => {
            if (this.ClientType == 'MOBILE') {
                res.render(`view/HandlebarsLogsNotSupported`, { })
            } else {
                res.render(`view/HandlebarsLogs`, { logs: HbGetLogs('192.168.1.100') })
            }
        })

        this.app.get('/dcbot/view/application-commands.html', (req, res) => {
            if (this.client.guilds.cache.get('737954264386764812') == null) {
                res.render(`view/ApplicationUnavaliable`)
                return
            }

            this.RenderPage_Commands(req, res)
        })

        //#endregion

        //#region GET JSON/TXT

        this.app.get('/dcbot/application-commands-status.json', (req, res) => {
            res.status(200).send(JSON.stringify({ creatingPercent: this.commandsCreatingPercent }))
        })

        this.app.get('/dcbot/guilds.json', (req, res) => {
            const guilds = []
            this.client.guilds.cache.forEach(guild => {
                guilds.push({
                    id: guild.id,
                    iconUrl: guild.iconURL({ size: 64 }),
                    name: guild.name,
                })
            })
            
            const harGuilds = HarBrowser.Guilds()
            for (const harGuildId in harGuilds) {
                const harGuild = harGuilds[harGuildId]
                guilds.push({
                    id: harGuild.id,
                    name: harGuild.name,
                    iconUrl: `https://cdn.discordapp.com/icons/${harGuild.id}/${harGuild.icon}.webp?size=64`,
                    HAR: true,
                })
            }
            res.status(200).send(JSON.stringify(guilds))
        })

        this.app.get('/archived/guilds.json', (req, res) => {
            const result = []

            ArchiveBrowser.Servers()
                .then(servers => {
                    for (const id in servers) {
                        const server = servers[id]
                        result.push({
                            id: server.id,
                            name: server.name,
                            iconData:
                                server.IconPath ?
                                (Buffer.from(fs.readFileSync(server.IconPath))).toString('base64') :
                                null
                        })
                    }
        
                    res.status(200).send(JSON.stringify(result))
                })
                .catch(LogError)
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

        this.app.get('/dcbot/title.txt', (req, res) => {
            res.status(200).send(GetTitle())
        })

        this.app.get('/dcbot/status.json', (req, res) => {
            this.ipToRate[req.ip] -= 1

            var uptime = new Date(0)
            uptime.setSeconds(this.client.uptime / 1000)
            uptime.setHours(uptime.getHours() - 1)

            var shardState = 'none'
            if (this.client.ws.shards.size > 0) {
                shardState = WsStatusText[this.client.ws.shards.first().status]
            }

            res.status(200).send({
                readyTime: GetTime(this.client.readyAt),
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
                    readyAt: this.client.ws.client.readyAt
                },
                systemUptime: GetTime(new Date(os.uptime() * 1000)),
            })
        })

        this.app.get('/dcbot/ping.json', (req, res) => {
            this.ipToRate[req.ip] -= 1
            
            res.status(200).send()
        })

        this.app.get('/errors.json', (req, res) => {
            const data = fs.readFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), 'utf8')
            const lines = data.split('\n')

            var notificationIcon = 0

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.length < 2) { continue }
                
                if (line == 'CRASH') {
                    if (notificationIcon < 4) notificationIcon = 4
                    break
                } else if (line.startsWith('Error: ')) {
                    if (notificationIcon < 3) notificationIcon = 3
                } else if (line.startsWith('DiscordAPIError[')) {
                    if (notificationIcon < 3) notificationIcon = 3
                } else if (line.startsWith('Error [')) {
                    if (notificationIcon < 3) notificationIcon = 3
                } else if (line.startsWith('TypeError: ')) {
                    if (notificationIcon < 3) notificationIcon = 3
                } else if (line.startsWith('ReferenceError: ')) {
                    if (notificationIcon < 3) notificationIcon = 3
                } else if (line.startsWith('DiscordAPIError: ')) {
                    if (notificationIcon < 3) notificationIcon = 3
                } else if (line.startsWith('    at ')) {
                    if (notificationIcon < 1) notificationIcon = 1
                } else if (line.includes(' DeprecationWarning:')) {
                    if (notificationIcon < 2) notificationIcon = 2
                } else if (line.includes(' ExperimentalWarning:')) {
                    if (notificationIcon < 2) notificationIcon = 2
                } else if (line == '(Use `node --trace-deprecation ...` to show where the warning was created)') {
                    if (notificationIcon < 1) notificationIcon = 1
                } else {
                    if (notificationIcon < 1) notificationIcon = 1
                }
            }

            res.status(200).send(JSON.stringify(notificationIcon))
        })

        //#endregion

        //#region POST to Discord

        this.app.post('/User/Fetch', (req, res) => {
            if (typeof req.query.id !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
            this.client.users.fetch(req.query.id)
            .then(() => {
                res.status(200).send({ message: 'ok' })
                CacheManager.SaveUsers(this.client)
            })
            .catch((error) => {
                res.status(200).send(error)
            })
        })

        this.app.post('/Guild/Member/FetchAll', (req, res) => {
            if (typeof req.query.guild !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
            const guild = this.client.guilds.cache.get(req.query.guild)
            if (guild === undefined || guild === null) {
                res.status(200).send({ message: 'Guild not found' })
                return
            }

            guild.members.list()
            .then(() => {
                res.status(200).send({ message: 'ok' })
                CacheManager.SaveMembers(this.client, guild)
            })
            .catch(async (error) => {
                res.status(200).send(error)
            })
        })

        this.app.post('/Guild/Member/Fetch', (req, res) => {
            if (typeof req.query.guild !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
            const guild = this.client.guilds.cache.get(req.query.guild)
            if (guild === undefined || guild === null) {
                res.status(200).send({ message: 'Guild not found' })
                return
            }

            if (typeof req.query.id !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
            guild.members.fetch(req.query.id)
            .then(() => {
                res.status(200).send({ message: 'ok' })
                CacheManager.SaveMembers(this.client, guild)
            })
            .catch((error) => {
                res.status(200).send(error)
            })
        })

        this.app.post('/Message/Pin', (req, res) => {
            if (typeof req.query.channel !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
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
                    if (typeof req.query.id !== 'string') {
                        res.status(500).send('Invalid query parameter type')
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
            if (typeof req.query.channel !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
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
                    if (typeof req.query.id !== 'string') {
                        res.status(500).send('Invalid query parameter type')
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
            if (typeof req.query.channel !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
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
                    if (typeof req.query.id !== 'string') {
                        res.status(500).send('Invalid query parameter type')
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
                res.status(200).send({ message: `Channel '${req.body.channel}' not found` })
            }

            if (channel.type === Discord.ChannelType.GuildText) {
                channel.send({ content: req.body.content, tts: req.body.tts })
                    .finally(() => {                        
                        this.RenderPage_Moderating(req, res)
                    })
                return
            }

            if (channel.type === Discord.ChannelType.DM) {
                channel.send({ content: req.body.content, tts: req.body.tts })
                    .finally(() => {                        
                        this.RenderPage_DirectMessages(req, res)
                    })
                return
            }

            res.status(200).send({ message: `Invalid channel type` })
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

            if (typeof channel !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }

            this.client.channels.fetch(channel)
                .then((ch) => {
                    if (ch.type === Discord.ChannelType.GuildText) {
                        if (id) {
                            if (typeof id !== 'string') {
                                res.status(500).send('Invalid query parameter type')
                                return
                            }
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

        this.app.post('/Message/FetchMore', (req, res) => {
            var count = req.query.count
            if (count === undefined || count === null) {
                count = req.body.count
            }

            var channel = req.query.channel
            if (channel === undefined || channel === null) {
                channel = req.body.channel
            }

            if (typeof channel !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }

            this.client.channels.fetch(channel)
                .then((ch) => {
                    if (ch.type === Discord.ChannelType.GuildText) {
                        if (count) {
                            if (typeof count !== 'string') {
                                res.status(500).send('Invalid query parameter type')
                                return
                            }
                            ch.messages.fetch({ limit: Number.parseInt(count) })
                                .then(() => {
                                    res.status(200).send({ message: 'ok' })
                                })
                                .catch((error) => {
                                    res.status(200).send(error)
                                })
                        } else {
                            res.status(200).send('Count is requied')
                        }
                    } else {
                        res.status(200).send('Invalid channel type')
                    }
                })
                .catch((error) => {
                    res.status(200).send(error)
                })
        })

        this.app.post('/Message/FetchMoreSimple', (req, res) => {
            const channelID = req.query.channel ?? req.body.channel

            if (!channelID || typeof channelID !== 'string') {
                res.status(400).send({ error: 'Channel is requied' })
            }

            this.client.channels.fetch(channelID)
                .then((channel) => {
                    if (channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.DM) {
                        res.status(400).send({ error: 'Invalid channel type' })
                        return
                    }

                    if (channel.messages.cache.toJSON().length > 0) {
                        const messages = channel.messages.cache.toJSON().sort((a, b) => {
                            return a.createdTimestamp - b.createdTimestamp
                        })

                        channel.messages.fetch({ limit: 5, before: messages[0].id })
                            .then(() => {
                                res.status(200).send({
                                    message: 'ok',
                                    details: `Fetched ${5} messages before ${messages[0].id} in channel ${channel.id}`
                                })
                            })
                            .catch((error) => {
                                res.status(500).send({ error })
                            })
                    } else {
                        channel.messages.fetch({ limit: 5 })
                            .then(() => {
                                res.status(200).send({
                                    message: 'ok',
                                    details: `Fetched ${5} messages in channel ${channel.id}`
                                })
                            })
                            .catch((error) => {
                                res.status(500).send({ error })
                            })
                    }
                })
                .catch((error) => {
                    LogError(error)
                    res.status(500).send()
                })
        })

        this.app.post('/Channel/Fetch', (req, res) => {
            var id = req.query.id
            if (id === undefined || id === null) {
                id = req.body.id
            }
            if (typeof id !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
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
            if (typeof id !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }
            this.client.guilds.fetch(id)
                .then(() => {
                    res.status(200).send({ message: 'ok' })
                })
                .catch((error) => {
                    res.status(200).send(error)
                })
        })

        this.app.post('/DiscordClient/Start', (req, res) => {
            this.StartBot()
        })

        this.app.post('/DiscordClient/Stop', (req, res) => {
            this.StopBot()
        })

        this.app.post('/view/Commands/Delete', (req, res) => {
            const commandID = req.body.id
            DeleteCommand(this.client, commandID, () => {
                this.RenderPage_Commands(req, res)
            })
        })

        this.app.post('/view/Commands/Update', (req, res) => {
            const commandID = req.body.id
            Updatecommand(this.client, commandID, () => {
                this.RenderPage_Commands(req, res)
            })
        })

        this.app.post('/dcbot/view/Moderating.html/SendMessage', (req, res) => {
            const channel = this.client.channels.cache.get(req.body.id)

            if (channel !== undefined) {
                if (channel.type === Discord.ChannelType.GuildText) {
                    channel.send({ content: req.body.content, tts: req.body.tts })
                        .then(() => {
                            this.RenderPage_ModeratingError(req, res, '')
                        })
                        .catch((err) => {
                            this.RenderPage_ModeratingError(req, res, '')
                        })
                    return
                }
            }

            this.RenderPage_ModeratingError(req, res, '')
        })

        this.app.post('/view/Commands/Fetch', (req, res) => {
            this.client.application.commands.fetch().finally(()=> {
                this.client.guilds.cache.get('737954264386764812').commands.fetch().finally(() => {
                    this.RenderPage_Commands(req, res)
                })
            })
        })

        this.app.post('/view/Commands/DeleteAll', (req, res) => {
            this.commandsDeleting = true
            DeleteCommandsSync(this.client, this.statesManager, (percent) => {
                this.commandsDeletingPercent = percent
            }, () => {
                this.commandsDeleting = false
            })
            this.RenderPage_Commands(req, res)
        })

        this.app.post('/view/Commands/Createall', (req, res) => {
            this.commandsCreating = true
            CreateCommandsSync(this.client, this.statesManager, (percent) => {
                this.commandsCreatingPercent = percent
            }, () => {
                this.commandsCreating = false
            })
            this.RenderPage_Commands(req, res)
        })

        //#endregion

        //#region POST to Web Interface

        this.app.post('/Process/Exit', (req, res) => {
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

        this.app.post('/dcbot/view/Moderating.html/Search', (req, res) => {
            const serverId = req.body.id

            if (this.client.guilds.cache.has(serverId)) {
                this.moderatingSearchedServerId = serverId

                this.RenderPage_ModeratingGuildSearch(req, res, '')
            } else {
                this.RenderPage_ModeratingError(req, res, `Server \"${serverId}\" not found`)
            }
        })

        this.app.get('/dcbot/view/Moderating.html/Search', (req, res) => {
            const serverId = req.query.id
            if (typeof serverId !== 'string') {
                res.status(500).send('Invalid query parameter type')
                return
            }

            if (this.client.guilds.cache.has(serverId)) {
                this.moderatingSearchedServerId = serverId

                this.RenderPage_ModeratingGuildSearch(req, res, '')
            } else {
                this.RenderPage_ModeratingError(req, res, `Server \"${serverId}\" not found`)
            }
        })

        this.app.post('/dcbot/view/UserMessages/Back', (req, res) => {
            this.viewUserMessagedId = ''
            this.RenderPage_DirectMessages(req, res)
        })

        this.app.post('/dcbot/view/UserMessages/Search', (req, res) => {
            this.viewUserMessagedId = ''
            const id = req.query.id ?? req.body.id

            if (this.client.users.cache.has(id)) {
                this.viewUserMessagedId = id
                this.RenderPage_DirectMessages(req, res, '')

                return
            }
            
            const archivedUsers = ArchiveBrowser.Users()
            for (const archivedUser of archivedUsers) {
                if (archivedUser.id === id) {
                    this.viewUserMessagedId = id
                    this.RenderPage_DirectMessages(req, res, '')

                    return
                }
            }

            this.RenderPage_DirectMessages(req, res, `User \"${id}\" not found`)
        })

        this.app.get('/dcbot/view/UserMessages/Search', (req, res) => {
            this.viewUserMessagedId = ''
            const id = req.query.id ?? req.body.id

            if (this.client.users.cache.has(id)) {
                this.viewUserMessagedId = id
                this.RenderPage_DirectMessages(req, res, '')

                return
            }
            
            const archivedUsers = ArchiveBrowser.Users()
            for (const archivedUser of archivedUsers) {
                if (archivedUser.id === id) {
                    this.viewUserMessagedId = id
                    this.RenderPage_DirectMessages(req, res, '')

                    return
                }
            }

            this.RenderPage_DirectMessages(req, res, `User \"${id}\" not found`)
        })

        this.app.post('/UserMessages/Create', (req, res) => {
            if (this.client.users.cache.has(this.viewUserMessagedId)) {
                this.client.users.cache.get(this.viewUserMessagedId).createDM()
                    .then(() => {
                        res.status(200).send({ message: 'ok' })
                    })
                    .catch(error => {
                        res.status(500).send({ error })
                    })
            } else {
                res.status(500).send({ error: `User '${this.viewUserMessagedId}' not found` })
            }
        })


        this.app.post('/UserMessages/Delete', (req, res) => {
            if (this.client.users.cache.has(this.viewUserMessagedId)) {
                this.client.users.cache.get(this.viewUserMessagedId).deleteDM()
                    .then(() => {
                        res.status(200).send({ message: 'ok' })
                    })
                    .catch(error => {
                        res.status(500).send({ error })
                    })
            } else {
                res.status(500).send({ error: `User '${this.viewUserMessagedId}' not found` })
            }
        })

        this.app.post('/dcbot/view/Moderating.html/Back', (req, res) => {
            this.moderatingSearchedServerId = ''

            this.RenderPage_ModeratingError(req, res, '')
        })

        this.app.post('/dcbot/view/Moderating.html/Server/Back', (req, res) => {
            this.moderatingSearchedChannelId = ''

            this.RenderPage_ModeratingGuildSearch(req, res, '')
        })

        this.app.post('/dcbot/view/Moderating.html/Server/Search', (req, res) => {
            const channelId = req.body.id

            if (this.client.channels.cache.has(channelId)) {
                this.moderatingSearchedChannelId = channelId

                this.RenderPage_Moderating(req, res)
            } else {
                this.RenderPage_ModeratingError(req, res, 'Channel not found')
            }
        })

        this.app.post('/dcbot/view/Database.html/Search', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            const userId = req.body.id

            if (this.client.users.cache.has(userId)) {
                this.databaseSearchedUserId = userId

                this.RenderPage_Database(req, res, userId)
            } else {
                this.RenderPage_DatabaseSearch(req, res, `User \"${userId}\" not found`)
            }
        })

        this.app.post('/database/fix', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            this.database.Fix()
            
            const userId = req.body.id

            if (this.client.users.cache.has(userId)) {
                this.databaseSearchedUserId = userId

                this.RenderPage_Database(req, res, userId)
            } else {
                this.RenderPage_DatabaseSearch(req, res, `User \"${userId}\" not found`)
            }
        })

        this.app.post('/dcbot/view/Database.html/Backup/All', (req, res) => {
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

        this.app.post('/dcbot/view/Database.html/Backup/One', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            const file = req.body.filename

            const backupFile = this.database.backupFolderPath + file
            if (fs.existsSync(backupFile)) {
                fs.copyFile(backupFile, this.database.databaseFolderPath + file, (err) => {
                    if (err) { throw err }
                })
            }
        })

        this.app.post('/dcbot/view/Database.html/Back', (req, res) => {
            if (this.ClientType != 'DESKTOP') { res.status(501).send('This is not available: the server is running on the phone'); return }

            this.databaseSearchedUserId = ''

            this.RenderPage_DatabaseSearch(req, res, '')
        })

        this.app.post('/dcbot/view/Database.html/Modify/Stickers', (req, res) => {
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

        this.app.post('/dcbot/view/Database.html/Modify/Backpack', (req, res) => {
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

        this.app.post('/dcbot/view/Database.html/Modify/Basic', (req, res) => {
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

        this.app.post('/view/Log/Clear', (req, res) => {
            fs.writeFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), '')
        })

        this.app.post('/view/GenerateHash', (req, res) => {
            const userID = req.body.id
            RemoveAllUser(userID)
            AddNewUser(userID)
        })

        //#endregion

        this.app.get('/dcbot', (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            const view = req.query.view

            if (view == 'default' || view == null || view == undefined) {
                res.render('default', { title: 'Stjórnandius' })
            } else {
                res.status(404).send("Not found")
            }
        })

        this.app.get('/dcbot/view/*', (req, res) => {
            res.render(`view/404`, { message: req.path })
        })
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
                status: WsStatusText[this.client.ws.status]
            },
            statesManager: this.statesManager,
            shard: {
                state: shardState,
            },
            showWeatherStatus: (this.statesManager.WeatherReport.Text.length > 0),
            showNewsStatus: (this.statesManager.News.AllProcessed == false),
            system: systemInfo
        }

        res.render(`view/Status`, { bot: clientData })
    }

    RenderPage_CacheChannels(req, res) {
        const channels = Utils.ChannelsCache(this.client)
        res.render(`view/CacheChannels`, { groups: channels.groups, channels: channels.singleChannels })
    }

    /**
     * @param {string} userId
     */
    RenderPage_Database(req, res, userId) {
        try {
            const userDatabase = {
                userId: userId,
                score: this.database.dataBasic[userId].score,
                scoreType: typeof this.database.dataBasic[userId].score,
                money: this.database.dataBasic[userId].money,
                moneyType: typeof this.database.dataBasic[userId].money,
                day: this.database.dataBasic[userId].day,
                dayType: typeof this.database.dataBasic[userId].day,
                color: this.database.dataBasic[userId].color,
                colorType: typeof this.database.dataBasic[userId].color,
                privateCommands: this.database.dataBasic[userId].privateCommands,
                privateCommandsType: typeof this.database.dataBasic[userId].privateCommands,

                crates: this.database.dataBackpacks[userId].crates,
                cratesType: typeof this.database.dataBackpacks[userId].crates,
                gifts: this.database.dataBackpacks[userId].gifts,
                giftsType: typeof this.database.dataBackpacks[userId].gifts,
                getGift: this.database.dataBackpacks[userId].getGift,
                getGiftType: typeof this.database.dataBackpacks[userId].getGift,
                tickets: this.database.dataBackpacks[userId].tickets,
                ticketsType: typeof this.database.dataBackpacks[userId].tickets,
                quizTokens: this.database.dataBackpacks[userId].quizTokens,
                quizTokensType: typeof this.database.dataBackpacks[userId].quizTokens,
                luckyCards: {
                    small: this.database.dataBackpacks[userId].luckyCards.small,
                    smallType: typeof this.database.dataBackpacks[userId].luckyCards.small,
                    medium: this.database.dataBackpacks[userId].luckyCards.medium,
                    mediumType: typeof this.database.dataBackpacks[userId].luckyCards.medium,
                    large: this.database.dataBackpacks[userId].luckyCards.large,
                    largeType: typeof this.database.dataBackpacks[userId].luckyCards.large,
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
                // @ts-ignore
                userDatabase.businessName = this.database.dataBusinesses[userId].businessName
                // @ts-ignore
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
                // day: this.database.dataMarket.day,
                prices: require('../economy/market').GetValues(),
            }

            res.render(`view/Database`, { userDatabase: userDatabase, user: user, bot: bot, market: market, info: info })
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
                avatarUrlSmall: cacheUser.avatarURL({ size: 32 }),
                avatarUrlLarge: cacheUser.avatarURL({ size: 128 }),
                haveDatabase: (this.database.dataBasic[cacheUser.id] != undefined)
            })
        })


        const bot = {
            day: this.database.dataBot.day,
        }

        res.render(`view/DatabaseSearch`, { users: users, searchError: searchError, bot: bot, info: info })
    }

    RenderPage_ModeratingError(req, res, searchError) {
        if (this.moderatingSearchedServerId.length > 0) {
            this.RenderPage_ModeratingGuildSearch(req, res, searchError)
            return
        }

        res.render(`view/ModeratingError`, { servers: Utils.ServersCache(this.client), searchError: searchError })
    }

    RenderPage_DirectMessages(req, res, errorMessage) {
        if (this.viewUserMessagedId.length > 0) {
            const user = this.client.users.cache.get(this.viewUserMessagedId)

            if (user) {
                const c = user.dmChannel
                let channelJson = c ? {
                    id: c.id,
                    name: user.username,
                    createdAt: GetDate(c.createdAt),
                } : {
                    name: user.username,
                }
                

                /** @type {{id:string;createdAtTimestamp:number}[]} */
                const messages = []

                if (user.dmChannel) {
                    const cTxt = c

                    cTxt.messages.cache.forEach((message) => {
                        const attachments = message.attachments.toJSON()
                        const attachmentsResult = []
                        for (const attachment of attachments) {
                            attachmentsResult.push({
                                contentType: attachment.contentType,
                                description: attachment.description,
                                height: attachment.height,
                                width: attachment.width,
                                id: attachment.id,
                                name: attachment.name,
                                spoiler: attachment.spoiler,
                                url: attachment.url,
                            })
                        }

                        const reactions = message.reactions.cache.toJSON()
                        const reactionsResult = []
                        for (const reaction of reactions) {
                            reactionsResult.push({
                                count: reaction.count,
                                url: reaction.emoji.url,
                                name: reaction.emoji.name,
                                me: reaction.me,
                            })
                        }

                        const embedsResult = []
                        for (const embed of message.embeds) {
                            embedsResult.push({
                                color: embed.hexColor,
                                author: embed.author,
                                description: (new ContentParser.Parser(embed.description)).result,
                                footer: embed.footer,
                                image: embed.image,
                                thumbnail: embed.thumbnail,
                                url: embed.url,
                                title: (new ContentParser.Parser(embed.title)).result,
                                fields: embed.fields.map(field => {
                                    return {
                                        name: (new ContentParser.Parser(field.name)).result,
                                        value: (new ContentParser.Parser(field.value)).result,
                                        inline: field.inline,
                                    }
                                }),
                            })
                        }

                        messages.push({
                            // @ts-ignore
                            content: Utils.GetHandlebarsMessage(this.client, message.content),
                            reactions: reactionsResult,
                            attachments: attachmentsResult,
                            embeds: embedsResult,
                            id: message.id,
                            position: message.position,
                            applicationId: message.applicationId,
                            cleanContent: message.cleanContent,
                            tts: message.tts,
                            // content: message.content,
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
                            author: Utils.UserJson(message.author, this.database)
                        })
                    })

                    messages.sort((a, b) => a.createdAtTimestamp - b.createdAtTimestamp)
                }

                res.render(`view/UserMessages`, { users: Utils.UsersCache(this.client), channel: channelJson, messages, errorMessage })
                return
            }

            console.log(`[ArchiveBrowser]: Search user ${this.viewUserMessagedId} ...`)
            const archivedUsers = ArchiveBrowser.Users()
            for (const archivedUser of archivedUsers) {
                if (archivedUser.id !== this.viewUserMessagedId)
                { continue }

                console.log(`[ArchiveBrowser]: User ${this.viewUserMessagedId} found`, archivedUser)
                
                console.log(`[ArchiveBrowser]: Search DM channel ...`)

                ArchiveBrowser.Messages()
                    .then(/** @param {ArchiveBrowser.ArchivedMessageChannel3[]} archivedChannels */ archivedChannels => {
                        for (const  archivedChannel of archivedChannels) {
                            if (!archivedChannel.recipients)
                            { continue }
                            if (!archivedChannel.recipients.includes(archivedUser.id))
                            { continue }

                            console.log(`[ArchiveBrowser]: DM channel found`, archivedChannel)

                            let channelJson = archivedChannel ? {
                                id: archivedChannel.id,
                                name: archivedUser.nickname,
                                archived: true,
                            } : {
                                name: archivedUser.nickname,
                                archived: true,
                            }

                            const archivedAccount = ArchiveBrowser.Account()
                            
                            /** @type {{id:string;createdAtTimestamp:number}[]} */
                            const messages = []

                            for (const message of archivedChannel.messages) {
                                
                                const attachmentsResult = []
                                if (message.attachment) {
                                    attachmentsResult.push({
                                        contentType: message.attachment.contentType,
                                        url: message.attachment.url,
                                        raw: message.attachment.raw,
                                    })
                                }

                                messages.push({
                                    // @ts-ignore
                                    content: Utils.GetHandlebarsMessage(this.client, message.content),
                                    reactions: [],
                                    attachments: attachmentsResult,
                                    embeds: [],
                                    id: message.id,
                                    cleanContent: message.content,
                                    createdAt: message.date,
                                    createdAtTimestamp: Date.parse(message.date),
                                    author: {
                                        id: archivedAccount.id,
                                        discriminator: archivedAccount.discriminator,
                                        username: archivedAccount.username,
                                        flags: archivedAccount.flags,
                                        avatarData: archivedAccount.avatarData,
                                    },
                                })
                            }

                            messages.sort((a, b) => a.createdAtTimestamp - b.createdAtTimestamp)

                            res.render(`view/UserMessages`, { users: Utils.UsersCache(this.client), channel: channelJson, messages, errorMessage })

                            return
                        }
                    })
                    .catch(LogError)

                return
            }
        }

        res.render(`view/CacheUsers`, { users: Utils.UsersCache(this.client), errorMessage })
    }

    RenderPage_ModeratingGuildSearch(req, res, searchError) {
        if (this.moderatingSearchedServerId.length === 0) {
            this.RenderPage_ModeratingError(req, res, 'No server selected')
            return
        }

        const g = this.client.guilds.cache.get(this.moderatingSearchedServerId)

        if (!g) {
            this.RenderPage_ModeratingError(req, res, 'No server selected')
            return
        }

        if (this.moderatingSearchedChannelId.length > 0) {
            /** @type {Discord.GuildBasedChannel} */
            const c = g.channels.cache.get(this.moderatingSearchedChannelId)
    
            if (c) {
                this.RenderPage_Moderating(req, res)
                return
            }
        }

        const guild = {
            iconUrlSmall: g.iconURL({ size: 32 }),
            iconUrlLarge: g.iconURL({ size: 128 }),

            name: g.name,
            id: g.id,

            createdAt: GetDate(g.createdAt),
            joinedAt: GetDate(g.joinedAt),

            memberCount: g.memberCount,
            nsfwLevel: NsfwLevel[g.nsfwLevel],
            mfaLevel: MFALevel[g.mfaLevel],
            verificationLevel: g.verificationLevel,

            available: g.available,
            large: g.large,

            membersNotFetched: g.memberCount - g.members.cache.size,
            membersNotVisible: null,
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
        
        const members = []
        g.members.cache.forEach((member) => {
            members.push({
                id: member.id,
                nickname: member.nickname,
                displayName: member.displayName,
                avatarUrlSmall: member.displayAvatarURL({ size: 16 }),
                avatarUrlBig: member.displayAvatarURL({ size: 128 }),
                bannable: member.bannable,
                kickable: member.kickable,
                manageable: member.manageable,
                moderatable: member.moderatable,
                isOwner: member.id === g.ownerId,
                user: Utils.UserJson(member.user, this.database),
            })
        })

        const membersSaved = CacheManager.GetMembers(this.client, guild.id)
        
        for (let i = 0; i < membersSaved.length; i++) {
            const memberSaved = membersSaved[i]
            var found = false
            for (let j = 0; j < members.length; j++) {
                const member = members[j]
                if (member.id == memberSaved.id) {
                    found = true
                    break
                }
            }
            if (!found) {
                members.push({
                    id: memberSaved.id,
                    nickname: memberSaved.nickname,
                    /*displayName: memberSaved.displayName,
                    avatarUrlSmall: memberSaved.displayAvatarURL({ size: 16 }),
                    avatarUrlBig: memberSaved.displayAvatarURL({ size: 128 }),
                    bannable: memberSaved.bannable,
                    kickable: memberSaved.kickable,
                    manageable: memberSaved.manageable,
                    moderatable: memberSaved.moderatable,*/
                    isOwner: memberSaved.id === g.ownerId,
                    // user: Utils.UserJson(memberSaved.user),
                    cache: true
                })
            }
        }

        guild.membersNotVisible = g.memberCount - members.length

        res.render(`view/ModeratingGuildSearch`, { server: guild, members: members, groups: Utils.ChannelsInGuild(g).groups, singleChannels: Utils.ChannelsInGuild(g).singleChannels, searchError: searchError, emojis: emojis })
    }
    
    RenderPage_Moderating(req, res) {
        if (this.moderatingSearchedServerId.length === 0) {
            this.RenderPage_ModeratingError(req, res, 'No server selected')
            return
        }

        const g = this.client.guilds.cache.get(this.moderatingSearchedServerId)

        if (!g) {
            this.RenderPage_ModeratingError(req, res, 'No server selected')
            return
        }

        if (this.moderatingSearchedChannelId.length === 0) {
            this.RenderPage_ModeratingGuildSearch(req, res, 'No channel selected')
            return
        }

        /** @type {Discord.GuildBasedChannel} */
        const c = g.channels.cache.get(this.moderatingSearchedChannelId)

        if (!c) {
            this.RenderPage_ModeratingGuildSearch(req, res, 'No channel selected')
            return
        }

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

        const channel = {
            id: c.id,
            // @ts-ignore
            archived: c.archived,
            // @ts-ignore
            archivedAt: GetDate(c.archivedAt),
            createdAt: GetDate(c.createdAt),
            // @ts-ignore
            deletable: c.deletable,
            // @ts-ignore
            full: c.full,
            // @ts-ignore
            invitable: c.invitable,
            // @ts-ignore
            joinable: c.joinable,
            // @ts-ignore
            locked: c.locked,
            manageable: c.manageable,
            // @ts-ignore
            memberCount: c.memberCount,
            // @ts-ignore
            messageCount: c.messageCount,
            name: c.name,
            // @ts-ignore
            nsfw: c.nsfw,
            // @ts-ignore
            sendable: c.sendable,
            // @ts-ignore
            speakable: c.speakable,
            // @ts-ignore
            topic: c.topic,
            type: c.type,
            // @ts-ignore
            unarchivable: c.unarchivable,
            // @ts-ignore
            userLimit: c.userLimit,
            // @ts-ignore
            videoQualityMode: c.videoQualityMode,
            viewable: c.viewable,
        }

        const members = []

        /** @type {Discord.BaseGuildTextChannel} */
        // @ts-ignore
        const __c = c
        __c.members.forEach(member => {
            members.push({
                displayHexColor: member.displayHexColor,
                displayName: member.displayName,
                status: member.presence?.status,
                ...Utils.UserJson(member.user),
            })
        })

        /** @type {{id:string;createdAtTimestamp:number}[]} */
        const messages = []

        if (c.type === Discord.ChannelType.GuildText) {
            const cTxt = c

            cTxt.messages.cache.forEach((message) => {
                let memberAdded = false
                for (const member of members) {
                    if (member.id == message.author.id) {
                        memberAdded = true
                        break
                    }
                }

                if (!memberAdded) {
                    members.push({
                        displayHexColor: message.member?.displayHexColor,
                        displayName: message.member?.displayName,
                        status: message.member?.presence?.status,
                        ...Utils.UserJson(message.author),
                    })
                }

                const attachments = message.attachments.toJSON()
                const attachmentsResult = []
                for (const attachment of attachments) {
                    attachmentsResult.push({
                        contentType: attachment.contentType,
                        description: attachment.description,
                        height: attachment.height,
                        width: attachment.width,
                        id: attachment.id,
                        name: attachment.name,
                        spoiler: attachment.spoiler,
                        url: attachment.url,
                    })
                }

                const reactions = message.reactions.cache.toJSON()
                const reactionsResult = []
                for (const reaction of reactions) {
                    reactionsResult.push({
                        count: reaction.count,
                        url: reaction.emoji.url,
                        name: reaction.emoji.name,
                        me: reaction.me,
                    })
                }

                const embedsResult = []
                for (const embed of message.embeds) {
                    embedsResult.push({
                        color: embed.hexColor,
                        author: embed.author,
                        description: Utils.GetHandlebarsMessage(this.client, embed.description, this.moderatingSearchedServerId),
                        footer: embed.footer,
                        image: embed.image,
                        thumbnail: embed.thumbnail,
                        url: embed.url,
                        title: Utils.GetHandlebarsMessage(this.client, embed.title, this.moderatingSearchedServerId),
                        fields: embed.fields.map(field => {
                            return {
                                name: Utils.GetHandlebarsMessage(this.client, field.name, this.moderatingSearchedServerId),
                                value: Utils.GetHandlebarsMessage(this.client, field.value, this.moderatingSearchedServerId),
                                inline: field.inline,
                            }
                        }),
                    })
                }

                messages.push({
                    // @ts-ignore
                    content: Utils.GetHandlebarsMessage(this.client, message.content, this.moderatingSearchedServerId),
                    reactions: reactionsResult,
                    attachments: attachmentsResult,
                    embeds: embedsResult,
                    id: message.id,
                    position: message.position,
                    applicationId: message.applicationId,
                    cleanContent: message.cleanContent,
                    tts: message.tts,
                    // content: message.content,
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
                    author: Utils.UserJson(message.author, this.database)
                })
            })

            messages.sort((a, b) => { return a.createdAtTimestamp - b.createdAtTimestamp })
        }

        const channelGroups = Utils.ChannelsInGuild(g).groups
        const singleChannels = Utils.ChannelsInGuild(g).singleChannels

        for (let i = 0; i < channelGroups.length; i++)
        { if (channel.id === channelGroups[i].id) { channelGroups[i].selected = true; break } }
        for (let i = 0; i < singleChannels.length; i++)
        // @ts-ignore
        { if (channel.id === singleChannels[i].id) { singleChannels[i].selected = true; break } }

        res.render(`view/Moderating`, { server: guild, channel: channel, messages: messages, groups: channelGroups, singleChannels: singleChannels, members: members })
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

        res.render(`view/Moderating`, { commands: commands, deleting: this.commandsDeleting, creating: this.commandsCreating, deletingPercent: this.commandsDeletingPercent, creatingPercent: this.commandsCreatingPercent })
    }
}

module.exports = WebInterfaceHandlebarsManager