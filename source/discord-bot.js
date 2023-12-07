const Discord = require('discord.js')
/** @type {import('./config').Config} */
const CONFIG = require('./config.json')
const { StatesManager } = require('./functions/statesManager')
const LogError = require('./functions/errorLog').LogError
const LogManager = require('./functions/log')
const ImageCache = require('./functions/image-cache')
const { DatabaseManager } = require('./functions/databaseManager')
const { GatewayIntentBits, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const fs = require('fs')
const Path = require('path')
const CacheManager = require('./functions/offline-cache')
const {
    ChannelId, Color
} = require('./functions/enums.js')
const { AutoReact } = require('./functions/autoReact')

const CommandShop = require('./economy/shop')
const CommandBackpack = require('./economy/backpack')
const CommandOpenCrate = require('./economy/open-crate')
const CommandOpenDailyCrate = require('./economy/open-daily-crate')
const CommandMarket = require('./economy/market')
const CommandSettings = require('./economy/settings')
const CommandGift = require('./economy/gift')
const { HangmanManager } = require('./commands2/hangman.js')
const {
    gameResetCameraPos,
    getGameUserSettings,
    createGame,
    connectTogame,
    Game,
    savedGameMessage,
    GameUserSettings,
    getGameMessage,
} = require('./commands/game')

const QuizManager = require('./economy/quiz')
const PollManager = require('./commands/poll')
const { calculateAddXp } = require('./economy/xpFunctions')
const { ToUnix } = require('./functions/utils')

module.exports = class DiscordBot {
    /**
     * @param {'DESKTOP' | 'MOBILE'} platform
     */
    constructor(platform) {
        try {
            /** @type {Discord.Collection<string, import("./commands2/base").Command>} */
            this.Commands = new Discord.Collection()
            /** @type {'DESKTOP' | 'MOBILE'} */
            this.Platform = platform
            /** @type {StatesManager} */
            this.StatesManager = new StatesManager()
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
                        
                    ]
                }
            })
            /** @type {LogManager} */
            this.LogManager = new LogManager(this.Client, this.StatesManager)

            this.SetupListeners()

            /** @type {string} */
            this.ID = '738030244367433770'

            /** @type {string[]} */
            this.ListOfHelpRequiestUsers = []

            /** @type {DatabaseManager | null} */
            this.Database = new DatabaseManager(Path.join(CONFIG.paths.base, './database/'), Path.join(CONFIG.paths.base, './database-copy/'), this.StatesManager)

            const NewsManager = require('./functions/news')
            this.NewsManager = new NewsManager(this.StatesManager, true)

            const { MailManager } = require('./commands/mail')
            this.Mails = new MailManager(this.Database)

            this.HangmanManager = new HangmanManager()

            const { Economy } = require('./economy/economy')
            this.Economy = new Economy(this.Database)

            const MusicPlayer = require('./commands/music/functions')
            this.MusicPlayer = new MusicPlayer(this.StatesManager, this.Client)

            this.Game = new Game()

            this.StatesManager.botLoaded = true
        } catch (error) {
            LogError(error)
        }
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

        this.Client.on(Discord.Events.Error, error => {
            this.StatesManager.botLoadingState = 'Error'
            LogError(error)
        })

        this.Client.on(Discord.Events.Debug, debug => {
            this.StatesManager.ProcessDebugMessage(debug)
        })

        this.Client.on(Discord.Events.Warn, warn => {
            this.StatesManager.botLoadingState = 'Warning'
        })

        this.Client.on(Discord.Events.ShardError, (error, shardID) => {
            
        })

        this.Client.on(Discord.Events.Invalidated, () => {
            
        })

        this.Client.on(Discord.Events.ShardDisconnect, (colseEvent, shardID) => {
            this.StatesManager.Shard.IsLoading = true
            this.StatesManager.Shard.LoadingText = 'Lecsatlakozva'
        })

        this.Client.on(Discord.Events.ShardReady, (shardID) => {
            const mainGuild = this.Client.guilds.cache.get('737954264386764812')
            const quizChannel = mainGuild.channels.cache.get('799340273431478303')
            if (quizChannel && quizChannel.isTextBased()) {
                quizChannel.messages.fetch()
            }
            this.StatesManager.Shard.IsLoading = false
        })

        this.Client.on(Discord.Events.ShardReconnecting, (shardID) => {
            this.StatesManager.Shard.IsLoading = true
            this.StatesManager.Shard.LoadingText = 'Újracsatlakozás...'
        })

        this.Client.on(Discord.Events.ShardResume, (shardID, replayedEvents) => {
            this.StatesManager.Shard.IsLoading = false
        })

        this.Client.on(Discord.Events.Raw, async event => {
            
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

        this.Client.on(Discord.Events.PresenceUpdate, (oldPresence, newPresence) => {
            
        })

        this.Client.on(Discord.Events.ClientReady, () => this.OnReady())
        this.Client.on(Discord.Events.InteractionCreate, (interaction) => this.OnInteraction(interaction))
        this.Client.on(Discord.Events.MessageCreate, (message) => {
            message.fetch()
                .then(fetchedMessage => {
                    this.OnMessage(fetchedMessage)
                })
                .catch(error => {
                    LogError(error)
                    this.OnMessage(message)
                })
        })
    }

    async OnReady() {
        const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
        
        this.StatesManager.botLoadingState = 'Ready'
    
        const { activitiesDesktop } = require('./functions/enums.js')
    
        CacheManager.SaveUsers(this.Client)
    
        const lastDay = this.Database.dataBot.day
    
        try {
            // require('./functions/commands')
        } catch (error) {
            console.error(error)
        }
    
        setInterval(() => {
            const index = Math.floor(Math.random() * (activitiesDesktop.length - 1))
            this.Client.user.setActivity(activitiesDesktop[index])
        }, 10000)
    
        require('./functions/dailyWeatherReport').TrySendWeatherReport(this.StatesManager, this.Client, ChannelId.ProcessedNews)
        require('./functions/dailyElectricityReport.js').TrySendMVMReport(this.StatesManager, this.Client, ChannelId.ProcessedNews)
        require('./functions/dailyExchangeReport').TrySendReport(this.StatesManager, this.Client, ChannelId.ProcessedNews)
    
        require('./economy/tax').Taxation(this.Database, lastDay)
    
        this.Database.SaveDatabase()
        
        await this.NewsManager.OnStart(this.Client)
    
        setInterval(() => {
            this.NewsManager.TryProcessNext(this.Client)
        }, 2000)
    
        try {
            /** @type {string[]} */
            const channelsWithSettings = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './settings.json'), 'utf8')).channelSettings.channelsWithSettings
            channelsWithSettings.forEach(channelWithSettings => {
                this.Client.channels.fetch(channelWithSettings)
                    .then((chn) => {
                        if (chn.isTextBased()) chn.messages.fetch({ limit: 10 })
                            .then(async (messages) => {
                                messages.forEach(message => {
                                    AutoReact(message)
                                })
                            })
                    })
            })
        } catch (err) {
            LogError(err)
        }

        ImageCache.DownloadEverything(this.Client)

        this.Database.dataBot.day = dayOfYear

        this.Commands = new Discord.Collection()

        const commandsPath = Path.join(__dirname, 'commands2')
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
        for (const file of commandFiles) {
            const filePath = Path.join(commandsPath, file)
            if (!fs.statSync(filePath).isFile()) { continue }

            try {
                /** @type {import("./commands2/base").Command} */
                const command = require(filePath)
                if ('Data' in command && 'Execute' in command) {
                    this.Commands.set(command.Data.name, command)
                } else {
                    console.warn(`The command at ${filePath} is missing a required "data" or "execute" property`)
                }
            } catch (error) {
                LogError(error)
            }
        }
    }

    /** @param {Discord.Interaction<Discord.CacheType>} interaction */
    async OnInteraction(interaction) {
        ImageCache.DownloadEverything(this.Client)

        if (interaction.member && interaction.member instanceof Discord.GuildMember)
        { this.Database.SaveUserToMemoryAll(interaction.user, interaction.member.displayName) }
        else
        { this.Database.SaveUserToMemoryAll(interaction.user, interaction.user.username) }
    
        const privateCommand = this.Database.dataBasic[interaction.user.id].privateCommands
        if (interaction.isMessageContextMenuCommand()) {
            if (interaction.commandName == 'Xp érték') {
                const messageXpValue = calculateAddXp(interaction.targetMessage)
                if (messageXpValue.total == 0) {
                    interaction.reply({
                        content: '> Ez az üzenet semmi \\🍺t se ér', ephemeral: true
                    })
                } else {
                    interaction.reply({
                        content:
                            '> Ez az üzenet **' + messageXpValue.total + '**\\🍺t ér:' + '\n' +
                            '>  Alap érték: ' + messageXpValue.messageBasicReward + '\\🍺' + '\n' +
                            '>  \\📄 Fájl bónusz: ' + messageXpValue.messageAttachmentBonus + '\\🍺' + '\n' +
                            '>  \\➰ Hossz bónusz: ' + messageXpValue.messageLengthBonus + '\\🍺' + '\n' +
                            '>  \\🙂 Emoji bónusz: ' + messageXpValue.messageEmojiBonus + '\\🍺' + '\n' +
                            '>  \\🔗 Link bónusz: ' + messageXpValue.otherBonuses + '\\🍺' + '\n' +
                            '>  \\💄 Egyedi emoji bónusz: ' + messageXpValue.messageCustomEmojiBonus + '\\🍺'
                        ,ephemeral: true
                    })
                }
            }
        } else if (interaction.isUserContextMenuCommand()) {
            if (CommandGift.OnUserContextMenu(interaction, this.Database)) return
        } else if (interaction.isCommand()) this.OnCommand(interaction, privateCommand)
        else if (interaction.isButton()) {
            if (require('./commands/redditsave').OnButtonClick(interaction)) return
            
            try {
                if (interaction.user.username !== interaction.message.embeds[0].author.name) {
                    interaction.reply({ content: '> \\❗ **Ez nem a tied!**', ephemeral: true })
                    return
                }
            } catch (error) { }
    
            if (CommandShop.OnButtonClick(interaction, this.Database)) return
            if (CommandBackpack.OnButtonClick(interaction, this.Database)) return
            if (CommandGift.OnButtonClick(interaction, this.Database)) return
            if (CommandMarket.OnButton(interaction, this.Database)) return
            if (this.Mails.OnButtonClick(interaction)) return
            if (this.HangmanManager.OnButton(interaction)) return
            if (this.Game.OnButton(interaction)) return
        } else if (interaction.isStringSelectMenu()) {
            if (CommandShop.OnSelectMenu(interaction, this.Database)) return
            if (this.HangmanManager.OnSelectMenu(interaction)) return
            if (QuizManager.OnSelectMenu(interaction)) return
    
            if (interaction.customId == 'userSettings') {
                const roles = {
                    szavazas: '795935996982198272',
                    quiz: '799342836931231775',
                    crossoutBejelentes: '902877945876598784',
                    crossoutBejelentesPC: '902878695742652437',
                    crossoutBejelentesKonzol: '902878741364105238',
                    crossoutEgyeb: '902881176719622145',
                    ingyenesJatek: '902878798956093510',
                    warzone: '902878851938517043',
                    minecraft: '902878964438143026',
                    napiIdojaras: '978665941753806888',
                    electricityReport: '1055067472123940944'
                }
    
                const selectedIndex = interaction.values[0]
                const money = this.Database.dataBasic[interaction.user.id].money
    
                var newColorRoleId = ''
    
                try {
                    const memberRoles = interaction.member.roles
                    if (Array.isArray(memberRoles)) {
                        interaction.channel.send({ content: '> \\❗ **Error: Bruh**' })
                        return
                    }
                    if (!(interaction.member instanceof Discord.GuildMember)) {
                        interaction.channel.send({ content: '> \\❗ **Error: Bruh**' })
                        return
                    }
                    if (selectedIndex == 'szavazas') {
                        if (memberRoles.cache.some(role => role.id === roles.szavazas) == true) {
                            await memberRoles.remove(roles.szavazas)
                        } else {
                            await memberRoles.add(roles.szavazas)
                        }
                    } else if (selectedIndex == 'quiz') {
                        if (memberRoles.cache.some(role => role.id === roles.quiz) == true) {
                            await memberRoles.remove(roles.quiz)
                        } else {
                            await memberRoles.add(roles.quiz)
                        }
                    } else if (selectedIndex == 'crossoutBejelentes') {
                        if (memberRoles.cache.some(role => role.id === roles.crossoutBejelentes) == true) {
                            await memberRoles.remove(roles.crossoutBejelentes)
                        } else {
                            await memberRoles.add(roles.crossoutBejelentes)
                        }
                    } else if (selectedIndex == 'crossoutBejelentesPC') {
                        if (memberRoles.cache.some(role => role.id === roles.crossoutBejelentesPC) == true) {
                            await memberRoles.remove(roles.crossoutBejelentesPC)
                        } else {
                            await memberRoles.add(roles.crossoutBejelentesPC)
                        }
                    } else if (selectedIndex == 'crossoutBejelentesKonzol') {
                        if (memberRoles.cache.some(role => role.id === roles.crossoutBejelentesKonzol) == true) {
                            await memberRoles.remove(roles.crossoutBejelentesKonzol)
                        } else {
                            await memberRoles.add(roles.crossoutBejelentesKonzol)
                        }
                    } else if (selectedIndex == 'crossoutEgyeb') {
                        if (memberRoles.cache.some(role => role.id === roles.crossoutEgyeb) == true) {
                            await memberRoles.remove(roles.crossoutEgyeb)
                        } else {
                            await memberRoles.add(roles.crossoutEgyeb)
                        }
                    } else if (selectedIndex == 'ingyenesJatek') {
                        if (memberRoles.cache.some(role => role.id === roles.ingyenesJatek) == true) {
                            await memberRoles.remove(roles.ingyenesJatek)
                        } else {
                            await memberRoles.add(roles.ingyenesJatek)
                        }
                    } else if (selectedIndex == 'warzone') {
                        if (memberRoles.cache.some(role => role.id === roles.warzone) == true) {
                            await memberRoles.remove(roles.warzone)
                        } else {
                            await memberRoles.add(roles.warzone)
                        }
                    } else if (selectedIndex == 'minecraft') {
                        if (memberRoles.cache.some(role => role.id === roles.minecraft) == true) {
                            await memberRoles.remove(roles.minecraft)
                        } else {
                            await memberRoles.add(roles.minecraft)
                        }
                    } else if (selectedIndex == 'napiIdojaras') {
                        if (memberRoles.cache.some(role => role.id === roles.napiIdojaras) == true) {
                            await memberRoles.remove(roles.napiIdojaras)
                        } else {
                            await memberRoles.add(roles.napiIdojaras)
                        }
                    } else if (selectedIndex == 'electricityReport') {
                        if (memberRoles.cache.some(role => role.id === roles.electricityReport) == true) {
                            await memberRoles.remove(roles.electricityReport)
                        } else {
                            await memberRoles.add(roles.electricityReport)
                        }
                    } else if (selectedIndex == 'privateCommands') {
                        if (privateCommand == true) {
                            this.Database.dataBasic[interaction.member.id].privateCommands = false                        
                        } else {
                            this.Database.dataBasic[interaction.member.id].privateCommands = true
                        }
                        this.Database.SaveDatabase()
                    }
                    await interaction.member.fetch()
                    await interaction.update(CommandSettings(this.Database, interaction.member, privateCommand))
                } catch (error) {
                    interaction.channel.send({ content: '> \\❗ **Error: ' + error + '**' })
                }
    
                return
            }
        } else if (interaction.isModalSubmit()) {
        }
    }

    /**
     * @param {Discord.Message<boolean>} message
     */
    async OnMessage(message) {
        ImageCache.DownloadEverything(this.Client)
        CacheManager.SaveUsers(this.Client)
        
        const thisIsPrivateMessage = (message.channel.type === Discord.ChannelType.DM)
    
        if (message.author.bot === true && thisIsPrivateMessage === false) return
    
        const sender = message.author
    
        this.Database.LoadDatabase()
    
        AutoReact(message)
    
        //#region User Stats
       
        this.Database.UserstatsAddUserToMemory(sender)
        if (message.channel.id === '744979145460547746') { //Memes channel
            if (message.content.includes('https://cdn.discordapp.com/attachments')) {
                this.Database.UserstatsSendMeme(sender)
            }
            if (message.content.includes('https://www.youtube.com/watch?v=')) {
                this.Database.UserstatsSendMeme(sender)
            }
            if (message.content.includes('https://www.reddit.com/r/')) {
                this.Database.UserstatsSendMeme(sender)
            }
            if (message.content.includes('https://media.discordapp.net/attachments/')) {
                this.Database.UserstatsSendMeme(sender)
            }
            if (message.content.includes('https://tenor.com/view/')) {
                this.Database.UserstatsSendMeme(sender)
            }
            if (message.attachments.size) {
                this.Database.UserstatsSendMeme(sender)
            }
        }
        
        if (message.channel.id === '738772392385577061') { //Music channel
            if (message.content.includes('https://cdn.discordapp.com/attachments')) {
                this.Database.UserstatsSendMusic(sender)
            }
            if (message.content.includes('https://www.youtube.com/watch?v=')) {
                this.Database.UserstatsSendMusic(sender)
            }
            if (message.content.includes('https://media.discordapp.net/attachments/')) {
                this.Database.UserstatsSendMusic(sender)
            }
            if (message.content.includes('https://youtu.be/')) {
                this.Database.UserstatsSendMusic(sender)
            }
            if (message.attachments.size) {
                this.Database.UserstatsSendMusic(sender)
            }
        }
    
        this.Database.UserstatsSendMessage(sender)
        this.Database.UserstatsSendChars(sender, message.cleanContent)
        
        //#endregion
    
        if (message.content.startsWith('https://www.reddit.com/r/')) {
            require('./commands/redditsave').Redditsave(message)
        }
    
        await this.NewsManager.TryProcessMessage(message)
    
        if (thisIsPrivateMessage) {
            this.Database.SaveUserToMemoryAll(sender, sender.username)
        } else {
            this.Database.SaveUserToMemoryAll(sender, message.member.displayName.toString())
        }
    
        if (message.content.length > 2) {
            if (thisIsPrivateMessage === false) {
                this.Economy.AddScore(message.member, calculateAddXp(message).total)
            }
        }
    
        /*
        if (message.content.startsWith(CONFIG.perfix)) {
            this.OnSimpleCommand(message, thisIsPrivateMessage, sender, message.content.substring(1).trim())
            return
        }
        */
    
        if (this.ListOfHelpRequiestUsers.includes(message.author.id) === true) {
            if (message.content.toLowerCase().includes('igen')) {
                message.reply('Használd a `.help` parancsot!')
            } else if (message.content.toLowerCase().includes('nem')) {
                message.reply('...')
            }
            this.ListOfHelpRequiestUsers.splice(this.ListOfHelpRequiestUsers.indexOf(message.author.id), 1)
        } else {
            if (message.content.includes('<@!738030244367433770>')) {
                message.reply('Segítség kell?')
                this.ListOfHelpRequiestUsers.push(message.author.id)
            }
        }
    }

    /**
     * @param {Discord.ChatInputCommandInteraction<Discord.CacheType>} command
     * @param {boolean} privateCommand
     */
    async OnCommand(command, privateCommand) {
        const commandHandler = this.Commands.get(command.commandName)

        if (commandHandler) {
            try {
                await commandHandler.Execute(command, privateCommand, this)
            } catch (error) {
                LogError(error)
                await command.reply({
                    content: `> \\❌ **Error:** ${error}`,
                    ephemeral: privateCommand,
                })
            }
            return
        }
    
        await command.reply("> \\❌ **Ismeretlen parancs `" + command.commandName + "`! **`/help`** a parancsok listájához!**")
    }

    /*
     * @param {Discord.Message<boolean>} message
     * @param {boolean} thisIsPrivateMessage
     * @param {Discord.User} sender
     * @param {string} command
     *
    async OnSimpleCommand(message, thisIsPrivateMessage, sender, command) {
    
        //#region Enabled in dm
    
        if (command === `pms`) {
            const CommandBusiness = require('./economy/businees')
            CommandBusiness(message.channel, sender, thisIsPrivateMessage, this.Database)
            this.Database.UserstatsSendCommand(sender)
            return
        }
    
        if (command === `test`) {
            const button0 = new ButtonBuilder()
                .setLabel("This is a button!")
                .setCustomId("myid0")
                .setStyle(Discord.ButtonStyle.Secondary)
            const button1 = new ButtonBuilder()
                .setLabel("This is a button!")
                .setCustomId("myid1")
                .setStyle(Discord.ButtonStyle.Primary)
            const option = new MessageMenuOption()
                .setLabel('Your Label')
                .setEmoji('🍔')
                .setValue('menuid')
                .setDescription('Custom Description!')
    
            const select = new MessageMenu()
                .setID('customid')
                .setPlaceholder('Click me! :D')
                .setMaxValues(1)
                .setMinValues(1)
                .addOption(option)
    
            const row0 = new ActionRowBuilder()
                .addComponents(button0, button1)
            const row1 = new ActionRowBuilder()
                .addComponents(select)
            message.channel.send("Message with a button!", { components: [row0, row1] })
    
            this.Database.UserstatsSendCommand(sender)
            return
        }
    
        const currEditingMailI = this.Mails.GetCurrentlyEditingMailIndex(sender.id)
        if (command === `mail`) {
            this.Mails.CommandMail(sender, message.channel)
            this.Database.UserstatsSendCommand(sender)
            return
        }
        if (currEditingMailI > -1) {
            if (command.startsWith(`mail wt `)) {
                const mailNewValue = command.replace(`mail wt `, '')
                
                this.Mails.currentlyWritingEmails[currEditingMailI].mail.title = mailNewValue
    
                const _message = this.Mails.GetMailMessage(sender, 3)
                this.Mails.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
                try { message.delete() } catch (error) { }
    
                this.Database.UserstatsSendCommand(sender)
                return
            } else if (command.startsWith(`mail wc `)) {
                const mailNewValue = command.replace(`mail wc `, '')
    
                this.Mails.currentlyWritingEmails[currEditingMailI].mail.context = mailNewValue
    
                const _message = this.Mails.GetMailMessage(sender, 3)
                this.Mails.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
                try { message.delete() } catch (error) { }
    
                this.Database.UserstatsSendCommand(sender)
                return
            } else if (command.startsWith(`mail wr `) && message.mentions.users.first()) {
                const mailNewValue = message.mentions.users.first()
    
                this.Mails.currentlyWritingEmails[currEditingMailI].mail.reciver.id = mailNewValue.id
                this.Mails.currentlyWritingEmails[currEditingMailI].mail.reciver.name = mailNewValue.username
    
                const _message = this.Mails.GetMailMessage(sender, 3)
                this.Mails.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
                try { message.delete() } catch (error) { }
    
                this.Database.UserstatsSendCommand(sender)
                return
            } else if (command.startsWith(`mail wr `) && command.length == 26) {
                const mailNewValue = command.replace(`mail wr `, '')
    
                let userName = '???'
                try {
                    userName = this.Client.users.cache.get(mailNewValue).username
                } catch (error) { }
    
                this.Mails.currentlyWritingEmails[currEditingMailI].mail.reciver.id = mailNewValue
                this.Mails.currentlyWritingEmails[currEditingMailI].mail.reciver.name = userName
    
                const _message = this.Mails.GetMailMessage(sender, 3)
                this.Mails.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
                try { message.delete() } catch (error) { }
    
                this.Database.UserstatsSendCommand(sender)
                return
            }
        }
    
        //#endregion
    
        //#region Disabled in dm
    
        if (command.startsWith(`quiz\n`)) {
            const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
            if (message.attachments.size == 1) {
                QuizManager.Quiz(this.Client, msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6], message.attachments.first())
            } else {
                QuizManager.Quiz(this.Client, msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6])
            }
            this.Database.UserstatsSendCommand(sender)
            return
        }
    
        if (command.startsWith(`quiz help`)) {
            this.Database.UserstatsSendCommand(sender)
            const embed = new Discord.EmbedBuilder()
                .addFields([{
                    name: 'Quiz szintaxis',
                    value: '.quiz\n' +
                        'Cím\n' +
                        'Opció;Opció;Opció\n' +
                        '💥;💥;💥\n' +
                        '5000 (add XP)\n' +
                        '2500 (remove XP)\n' +
                        '10 (add Token)\n' +
                        '5 (remove Token)'
                }])
                .setColor(Color.Highlight)
            message.channel.send({ embeds: [embed] })
            return
        }
    
        if (command.startsWith(`quizdone help`)) {
            this.Database.UserstatsSendCommand(sender)
            const embed = new Discord.EmbedBuilder()
                .addFields([{ name: 'Quizdone szintaxis', value: '.quizdone messageId correctIndex(0 - ...)' }])
                .setColor(Color.Highlight)
            message.channel.send({ embeds: [embed] })
            return
        }
    
        if (command.startsWith(`quizdone `)) {
            QuizManager.QuizDone(this.Client, command.replace(`quizdone `, '').split(' ')[0], command.replace(`quizdone `, '').split(' ')[1])
            this.Database.UserstatsSendCommand(sender)
            return
        }
    
        if (command.startsWith(`poll simple\n`)) {
            const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
            PollManager.poll(this.Client, msgArgs[0], msgArgs[1], msgArgs[2], false)
            this.Database.UserstatsSendCommand(sender)
            return
        }
    
        if (command.startsWith(`poll wyr\n`)) {
            const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
            PollManager.poll(this.Client, msgArgs[0], msgArgs[1], msgArgs[2], true)
            this.Database.UserstatsSendCommand(sender)
            return
        }
    
        //#endregion
    
        if (command === 'game') {
            if (this.Game.gameMap == null) {
                this.Game.gameMap = createGame(50, 50)
            }
    
            connectTogame(sender, this.Game)
            gameResetCameraPos(false, sender, this.Game)
    
            if (getGameUserSettings(sender.id, this.Game) == null) {
                this.Game.gameUserSettings.push(new GameUserSettings(sender.id))
            }
    
            const _message = getGameMessage(sender, false, false, this.Game)
            message.channel.send({ embeds: [_message.embed], components: _message.actionRows }).then(msg => {
                this.Game.allGameMessages.push(new savedGameMessage(msg, sender))
            })
            return
        }
    
        if (command.startsWith('test')) {
            /*
            const aaaaaaaaaaaa = command.split('|')
            const title = aaaaaaaaaaaa[1]
            const texts = aaaaaaaaaaaa[2].split(';')
            const icons = aaaaaaaaaaaa[3].split(';')
            if (texts.length > 5) {
                message.channel.send("> Az opciók száma nem lehet több 5-nél")
                return
            }
            *
    
            /*
             * @type {ButtonBuilder[]}
             *
            /*
            let buttons = []
            for (let i = 0; i < icons.length; i++) {
                const icon = icons[i]
                const button0 = new ButtonBuilder()
                    .setLabel(icon)
                    .setID("pollOption" + i)
                    .setStyle("gray")
                buttons.push(button0)
            }
            const row0 = new ActionRowBuilder()
                .addComponents(buttons)
    
            const buttonFinish = new ButtonBuilder()
                .setLabel('Befejezés')
                .setID("pollFinish")
                .setStyle("green")
            const row1 = new ActionRowBuilder()
                .addComponent(buttonFinish)
    
            let optionText = ''
            for (let i = 0; i < texts.length; i++) {
                optionText += '> ' + icons[i] + ' ' + texts[i] + '\n'
            }
    
            message.channel.send(`**${title}**\n${optionText}`, { components: [row0, row1] }).then(msg => {
                addNewPoll(msg.id, title, texts, icons, this.Database)
            })
            return
            *
        }
    }
    */

    Login() {
        return new Promise(resolve => {
            this.Client.login(CONFIG.tokens.discord)
                .then(token => { resolve() })
                .catch(error => { LogError(error) })
        })
    }

    Destroy() {
        this.Client.destroy()
        this.IsStopped = true
    }
}
