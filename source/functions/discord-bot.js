const Discord = require('discord.js')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const { StatesManager } = require('./statesManager')

const LogError = require('./errorLog')
const { SystemLog, SystemStart, SystemStop } = require('./systemLog')
const { TranslateMessage } = require('./translator')
const LogManager = require('./log')

module.exports = class DiscordBot {
    /**
     * @param {'DESKTOP' | 'MOBILE'} platform
     * @param {StatesManager} statesManager
     * @param {LogManager} logManager
     */
    constructor(platform, statesManager, logManager) {
        /** @type {'DESKTOP' | 'MOBILE'} */
        this.Platform = platform
        /** @type {StatesManager} */
        this.StatesManager = statesManager
        /** @type {LogManager} */
        this.LogManager = logManager
        /** @type {boolean} */
        this.IsStopped = true
        /** @type {Discord.Client<boolean>} */
        this.Client = new Discord.Client({
            intents:
            [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildVoiceStates
            ],
            partials:
            [
                Discord.Partials.Channel
            ],
            presence:
            {
                activities:
                [
                    {
                        name: 'Starting up...',
                        type: ActivityType.Custom
                    }
                ]
            }
        })
        /** @type {string} */
        this.ID = '738030244367433770'
    }

    /**
     * @param {string} message
     * @param {'DEBUG' | 'NORMAL' | 'WARNING' | 'ERROR'} messageType
     */
    Log(message, messageType = 'NORMAL') {
        this.LogManager.LogMessage({ message: message, messageType })
    }

    SetupListeners() {
        this.Client.on('reconnecting', () => {
            this.StatesManager.botLoadingState = 'Reconnecting'
            SystemLog('Reconnecting')
        })

        this.Client.on('disconnect', () => {
            this.StatesManager.botLoadingState = 'Disconnect'
            SystemLog('Disconnect')
        })

        this.Client.on('resume', () => {
            this.StatesManager.botLoadingState = 'Resume'
            SystemLog('Resume')
        })

        this.Client.on('error', error => {
            this.StatesManager.botLoadingState = 'Error'
            SystemLog('Error: ' + error.message)
            LogError(error)
        })

        this.Client.on('debug', debug => {
            this.Log(debug, 'DEBUG')
            
            this.StatesManager.ProcessDebugMessage(debug)
            const translatedDebug = TranslateMessage(debug)

            if (translatedDebug == null) return

            if (translatedDebug.translatedText.startsWith('Heartbeat nyugtázva')) {
                SystemLog('Ping: ' + translatedDebug.translatedText.replace('Heartbeat nyugtázva: ', ''))
            }
        })

        this.Client.on('warn', warn => {
            this.Log(warn, 'WARNING')
            this.StatesManager.botLoadingState = 'Warning'
        })

        this.Client.on('shardError', (error, shardID) => {
            
        })

        this.Client.on('invalidated', () => {
            
        })

        this.Client.on('shardDisconnect', (colseEvent, shardID) => {
            this.StatesManager.Shard.IsLoading = true
            this.StatesManager.Shard.LoadingText = 'Lecsatlakozva'
        })

        this.Client.on('shardReady', (shardID) => {
            const mainGuild = this.Client.guilds.cache.get('737954264386764812')
            const quizChannel = mainGuild.channels.cache.get('799340273431478303')
            if (quizChannel) {
                quizChannel.messages.fetch()
            } else {
                this.Client.channels.fetch('799340273431478303')
                    .then((channel) => {
                        channel.messages.fetch()
                    })
            }
            this.StatesManager.Shard.IsLoading = false
        })

        this.Client.on('shardReconnecting', (shardID) => {
            this.StatesManager.Shard.IsLoading = true
            this.StatesManager.Shard.LoadingText = 'Újracsatlakozás...'
        })

        this.Client.on('shardResume', (shardID, replayedEvents) => {
            this.StatesManager.Shard.IsLoading = false
        })

        this.Client.on('raw', async event => {
            
        })

        this.Client.on('close', () => {
            this.StatesManager.botLoadingState = 'Close'
            SystemLog('Close')
        })

        this.Client.on('destroyed', () => {
            this.StatesManager.botLoadingState = 'Destroyed'
            SystemLog('Destroyed')
        })

        this.Client.on('invalidSession', () => {
            this.StatesManager.botLoadingState = 'Invalid Session'
        })

        this.Client.on('allReady', () => {
            this.StatesManager.botLoadingState = 'All Ready'
        })

        this.Client.on('presenceUpdate', (oldPresence, newPresence) => {
            
        })
    }

    Login() {
        return this.Client.login(CONFIG.tokens.discord)
    }

    Destroy() {
        this.Client.destroy()
        this.IsStopped = true
    }
}