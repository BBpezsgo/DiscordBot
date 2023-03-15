const Discord = require('discord.js')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const { StatesManager } = require('./statesManager')
const LogError = require('./errorLog')
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

    SetupListeners() {
        this.Client.on('reconnecting', () => {
            this.StatesManager.botLoadingState = 'Reconnecting'
        })

        this.Client.on('disconnect', () => {
            this.StatesManager.botLoadingState = 'Disconnect'
        })

        this.Client.on('resume', () => {
            this.StatesManager.botLoadingState = 'Resume'
        })

        this.Client.on('error', error => {
            this.StatesManager.botLoadingState = 'Error'
            LogError(error)
        })

        this.Client.on('debug', debug => {
            this.StatesManager.ProcessDebugMessage(debug)
        })

        this.Client.on('warn', warn => {
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
        })

        this.Client.on('destroyed', () => {
            this.StatesManager.botLoadingState = 'Destroyed'
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