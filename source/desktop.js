console.log('The script is executing!')

process.title = "Discord BOT"

const LogError = require('./functions/errorLog')
const fs = require('fs')
const Path = require('path')
/** @type {import('./config').Config} */
const CONFIG = require('./config.json')
process.on('uncaughtException', function (err) {
    fs.appendFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), 'CRASH\n', { encoding: 'utf-8' })
    LogError(err)
})

var autoStartBot = true

const startDateTime = new Date(Date.now())

const LogManager = require('./functions/log')
var logManager = new LogManager(null, null)

logManager.scriptLoadingText = 'Loading script... (set process things)'

process.__defineGetter__('stderr', function() { return fs.createWriteStream(Path.join(CONFIG.paths.base, 'node.error.log'), { flags: 'a' }) })

var botStopped = false

process.stdin.on('mousepress', function (info) { })

process.stdin.resume()

const ConsoleUtilities = new (require('./functions/consoleUtilities')).ConsoleUtilities()
ConsoleUtilities.on('onKeyDown', key => {
    logManager.OnKeyDown(key)

    if (key === '\u0003') {
        if (botStopped == true) {
            process.stdin.pause()
            setTimeout(() => { process.exit() }, 500)
        } else {
            StopBot()
        }
    }
})
ConsoleUtilities.Listen()
ConsoleUtilities.EnableMouse()

process.on('exit', function (code) {
    ConsoleUtilities.DisableMouse()
    console.log('Exit with code ' + code)
})

logManager.scriptLoadingText = 'Loading script... (loading npm packages)'

//#region NPM Packages and variables






logManager.Loading("Loading commands", 'economy/shop')
const CommandShop = require('./economy/shop')
logManager.Loading("Loading commands", 'economy/backpack')
const CommandBackpack = require('./economy/backpack')
logManager.Loading("Loading commands", 'economy/open-crate')
const CommandOpenCrate = require('./economy/open-crate')
logManager.Loading("Loading commands", 'economy/open-daily-crate')
const CommandOpenDailyCrate = require('./economy/open-daily-crate')
logManager.Loading("Loading commands", 'economy/market')
const CommandMarket = require('./economy/market')
logManager.Loading("Loading commands", 'economy/settings')
const CommandSettings = require('./economy/settings')
logManager.Loading("Loading commands", 'economy/gift')
const CommandGift = require('./economy/gift')
logManager.Loading("Loading commands", 'quiz')
const QuizManager = require('./economy/quiz')
logManager.Loading("Loading commands", 'poll')
const PollManager = require('./commands/poll')

logManager.Loading("Loading extensions", 'economy/xpFunctions')
const { calculateAddXp } = require('./economy/xpFunctions')







logManager.Loading("Loading commands", 'game')
const {
    playerCanMoveToHere,
    gameResetCameraPos,
    resetGameMessage,
    addItemToPlayer,
    getGameUserSettings,
    createGame,
    connectTogame,
    MapPoint,
    Game,
    savedGameMessage,
    GameUserSettings,
    MapObject,
    ItemType,
    Direction,
    MapObjectType,
    getGameMessage,
    getMapPoint
} = require('./commands/game')

logManager.Loading("Loading extensions", 'StatesManager')
const { StatesManager } = require('./functions/statesManager.js')
logManager.Loading("Loading extensions", 'DatabaseManager')
const { DatabaseManager } = require('./functions/databaseManager.js')
logManager.Loading("Loading extensions", 'EconomyManager')
const { Economy } = require('./economy/economy')

logManager.Loading("Loading extensions", "MusicPlayer")
const MusicPlayer = require('./commands/music/functions')

logManager.Loading('Loading', "WS")
const WebInterface = require('./web-interface/manager')


logManager.Loading('Loading packet', "discord.js")
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActivityType } = require('discord.js')

const { AutoReact } = require('./functions/autoReact')

logManager.Loading('Loading packet', "other functions")

const { DateToString } = require('./functions/dateToString')
const NewsManager = require('./functions/news')
const { MailManager } = require('./commands/mail')
const {
    Color,
    ChannelId,
    CliColor
} = require('./functions/enums.js')
const { CommandHangman, HangmanManager } = require('./commands/hangman.js')

logManager.scriptLoadingText = 'Loading script... (create Discord client instance)'

logManager.BlankScreen()

const bot = new Discord.Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates ], partials: [ Discord.Partials.Channel ], presence: { activities: [{ name: 'Starting up...', type: ActivityType.Custom }] } })
logManager.Destroy()

/** @type {string[]} */
let listOfHelpRequiestUsers = []

const CacheManager = require('./functions/offline-cache')

const statesManager = new StatesManager()

const musicPlayer = new MusicPlayer(statesManager, bot)

logManager = new LogManager(bot, statesManager)

logManager.scriptLoadingText = 'Loading script... (create NewsManager instance)'
const newsManager = new NewsManager(statesManager, true)

statesManager.botLoaded = true

logManager.scriptLoadingText = 'Loading script... (loading database)'

logManager.Loading('Loading database', 'Manager')
const database = new DatabaseManager(Path.join(CONFIG.paths.base, './database/'), Path.join(CONFIG.paths.base, './database-copy/'), statesManager)
logManager.Loading('Loading database', 'datas')
const databaseIsSuccesfullyLoaded = database.LoadDatabase()

if (!databaseIsSuccesfullyLoaded) {
    logManager.Destroy()
    console.log(CliColor.FgRed + "Can't read database!" + CliColor.FgDefault)
    autoStartBot = false
    setTimeout(() => { process.exit() }, 2000)
}

const economy = new Economy(database)

logManager.scriptLoadingText = 'Loading script... (create WebInterface instance)'

const ws = new WebInterface('1234', '192.168.1.100', 5665, bot, logManager, database, StartBot, StopBot, statesManager, 'DESKTOP')
logManager.BlankScreen()

const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

logManager.scriptLoadingText = 'Loading script... (create HangmanManager instance)'
const hangmanManager = new HangmanManager()

logManager.scriptLoadingText = 'Loading script... (create MailManager instance)'
const mailManager = new MailManager(database)

logManager.scriptLoadingText = 'Loading script... (create Game instance)'
const game = new Game()

//#endregion

//#region Listener-ek
logManager.scriptLoadingText = 'Loading script... (setup basic listeners)'

bot.on('reconnecting', () => {
    statesManager.botLoadingState = 'Reconnecting'
})

bot.on('disconnect', () => {
    statesManager.botLoadingState = 'Disconnect'
})

bot.on('resume', () => {
    statesManager.botLoadingState = 'Resume'
})

bot.on('error', error => {
    statesManager.botLoadingState = 'Error'
    LogError(error)
})

bot.on('debug', debug => {
    statesManager.ProcessDebugMessage(debug)
})

bot.on('warn', warn => {
    fs.appendFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), warn + '\n', 'utf8')
    statesManager.botLoadingState = 'Warning'
})

bot.on('shardError', (error, shardID) => {
    LogError(error, { key: 'ShardID', value: shardID })
})

bot.on('invalidated', () => {
    statesManager.botLoadingState = 'Invalidated'
})

bot.on('shardDisconnect', (colseEvent, shardID) => {
    statesManager.Shard.IsLoading = true
    statesManager.Shard.LoadingText = 'Disconnected'
    statesManager.Shard.LoadingTextColor = CliColor.FgRed
})

bot.on('shardReady', (shardID) => {
    const mainGuild = bot.guilds.cache.get('737954264386764812')
    const quizChannel = mainGuild.channels.cache.get('799340273431478303')
    if (quizChannel != undefined) {
        quizChannel.messages.fetch()
    } else {
        bot.channels.fetch('799340273431478303').then((channel) => {
            channel.messages.fetch()
        })
    }
    statesManager.Shard.IsLoading = false
})

bot.on('shardReconnecting', (shardID) => {
    statesManager.Shard.IsLoading = true
    statesManager.Shard.LoadingText = 'Reconnecting...'
    statesManager.Shard.LoadingTextColor = null
})

bot.on('shardResume', (shardID, replayedEvents) => {
    statesManager.Shard.IsLoading = false
})

bot.on('close', () => {
    statesManager.botLoadingState = 'Closed'
})

bot.on('destroyed', () => {
    statesManager.botLoadingState = 'Destroyed'
})

bot.on('invalidSession', () => {
    statesManager.botLoadingState = 'Invalid Session'
})

bot.on('allReady', () => {
    statesManager.botLoadingState = 'All Ready'
})

bot.on('presenceUpdate', (oldPresence, newPresence) => {
    
})

//#endregion

logManager.scriptLoadingText = 'Loading script... (setup client listeners)'
bot.on(Discord.Events.InteractionCreate, async interaction => {
    if (interaction.member === undefined)
    { database.SaveUserToMemoryAll(interaction.user, interaction.user.username) }
    else
    { database.SaveUserToMemoryAll(interaction.user, interaction.member.displayName) }

    const privateCommand = database.dataBasic[interaction.user.id].privateCommands
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
        if (CommandGift.OnUserContextMenu(interaction, database)) return
    } else if (interaction.isCommand()) processApplicationCommand(interaction, privateCommand)
    else if (interaction.isButton()) {
        if (require('./commands/redditsave').OnButtonClick(interaction)) return
        const Crossout = require('./commands/crossout')
        if (Crossout.OnButton(interaction, privateCommand)) return
    
        if (interaction.user.username !== interaction.message.embeds[0].author.name) {
            interaction.reply({ content: '> \\❗ **Ez nem a tied!**', ephemeral: true })
            return
        }

        if (CommandShop.OnButtonClick(interaction, database)) return
        if (CommandBackpack.OnButtonClick(interaction, database)) return
        if (CommandGift.OnButtonClick(interaction, database)) return
        if (CommandMarket.OnButton(interaction, database)) return
        if (mailManager.OnButtonClick(interaction)) return
        if (hangmanManager.OnButton(interaction)) return
        if (game.OnButton(interaction)) return
    } else if (interaction.isSelectMenu()) {
        if (CommandShop.OnSelectMenu(interaction, database)) return
        if (hangmanManager.OnSelectMenu(interaction)) return

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
            const money = database.dataBasic[interaction.user.id].money

            var newColorRoleId = ''

            try {
                if (selectedIndex == 'szavazas') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.szavazas) == true) {
                        await interaction.member.roles.remove(roles.szavazas)
                    } else {
                        await interaction.member.roles.add(roles.szavazas)
                    }
                } else if (selectedIndex == 'quiz') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.quiz) == true) {
                        await interaction.member.roles.remove(roles.quiz)
                    } else {
                        await interaction.member.roles.add(roles.quiz)
                    }
                } else if (selectedIndex == 'crossoutBejelentes') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.crossoutBejelentes) == true) {
                        await interaction.member.roles.remove(roles.crossoutBejelentes)
                    } else {
                        await interaction.member.roles.add(roles.crossoutBejelentes)
                    }
                } else if (selectedIndex == 'crossoutBejelentesPC') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.crossoutBejelentesPC) == true) {
                        await interaction.member.roles.remove(roles.crossoutBejelentesPC)
                    } else {
                        await interaction.member.roles.add(roles.crossoutBejelentesPC)
                    }
                } else if (selectedIndex == 'crossoutBejelentesKonzol') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.crossoutBejelentesKonzol) == true) {
                        await interaction.member.roles.remove(roles.crossoutBejelentesKonzol)
                    } else {
                        await interaction.member.roles.add(roles.crossoutBejelentesKonzol)
                    }
                } else if (selectedIndex == 'crossoutEgyeb') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.crossoutEgyeb) == true) {
                        await interaction.member.roles.remove(roles.crossoutEgyeb)
                    } else {
                        await interaction.member.roles.add(roles.crossoutEgyeb)
                    }
                } else if (selectedIndex == 'ingyenesJatek') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.ingyenesJatek) == true) {
                        await interaction.member.roles.remove(roles.ingyenesJatek)
                    } else {
                        await interaction.member.roles.add(roles.ingyenesJatek)
                    }
                } else if (selectedIndex == 'warzone') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.warzone) == true) {
                        await interaction.member.roles.remove(roles.warzone)
                    } else {
                        await interaction.member.roles.add(roles.warzone)
                    }
                } else if (selectedIndex == 'minecraft') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.minecraft) == true) {
                        await interaction.member.roles.remove(roles.minecraft)
                    } else {
                        await interaction.member.roles.add(roles.minecraft)
                    }
                } else if (selectedIndex == 'napiIdojaras') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.napiIdojaras) == true) {
                        await interaction.member.roles.remove(roles.napiIdojaras)
                    } else {
                        await interaction.member.roles.add(roles.napiIdojaras)
                    }
                } else if (selectedIndex == 'electricityReport') {
                    if (interaction.member.roles.cache.some(role => role.id === roles.electricityReport) == true) {
                        await interaction.member.roles.remove(roles.electricityReport)
                    } else {
                        await interaction.member.roles.add(roles.electricityReport)
                    }
                } else if (selectedIndex == 'privateCommands') {
                    if (privateCommand == true) {
                        database.dataBasic[interaction.member.id].privateCommands = false                        
                    } else {
                        database.dataBasic[interaction.member.id].privateCommands = true
                    }
                    database.SaveDatabase()
                }
                await interaction.member.fetch()
                setTimeout(() => {
                    interaction.update(CommandSettings(database, interaction.member, privateCommand))
                }, 1500)
            } catch (error) {
                interaction.channel.send({ content: '> \\❗ **Error: ' + error + '**' })
            }

            return
        }
    } else if (interaction.isModalSubmit()) {
    }
})

bot.once('ready', async () => {
    statesManager.botLoadingState = 'Ready'

    const { Taxation } = require('./economy/tax')
    const { TrySendWeatherReport } = require('./functions/dailyWeatherReport')
    const { TrySendMVMReport } = require('./functions/dailyElectricityReport.js')
    const DailyExchangeReport = require('./functions/dailyExchangeReport')
    const { activitiesDesktop } = require('./functions/enums.js')

    CacheManager.SaveUsers(bot)

    const lastDay = database.dataBot.day

    try {
        // require('./functions/commands')
    } catch (error) {
        console.error(error)
    }

    setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesDesktop.length - 1))
        bot.user.setActivity(activitiesDesktop[index])
    }, 10000)

    TrySendWeatherReport(statesManager, bot, ChannelId.ProcessedNews)
    TrySendMVMReport(statesManager, bot, ChannelId.ProcessedNews)
    DailyExchangeReport.TrySendReport(statesManager, bot, ChannelId.ProcessedNews)

    Taxation(database, lastDay)

    database.SaveDatabase()
    
    await newsManager.OnStart(bot, true)

    setInterval(() => {
        newsManager.TryProcessNext(bot)
    }, 2000)

    try {
        /** @type {string[]} */
        const channelsWithSettings = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, './settings.json'))).channelSettings.channelsWithSettings
        channelsWithSettings.forEach(channelWithSettings => {
            bot.channels.fetch(channelWithSettings)
                .then((chn) => {
                    chn.messages.fetch({ limit: 10 })
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

    database.dataBot.day = dayOfYear
})

bot.on('messageCreate', async msg => {
    CacheManager.SaveUsers(bot)

    let message
    try {
        message = await msg.fetch()
    } catch (error) {
        LogError(error)
        return
    }

    const thisIsPrivateMessage = (message.channel.type === Discord.ChannelType.DM)

    if (message.author.bot === true && thisIsPrivateMessage === false) return

    const sender = message.author

    database.LoadDatabase()

    AutoReact(message)

    //#region User Stats
   
    database.UserstatsAddUserToMemory(sender)
    if (message.channel.id === '744979145460547746') { //Memes channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            database.UserstatsSendMeme(sender)
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            database.UserstatsSendMeme(sender)
        }
        if (message.content.includes('https://www.reddit.com/r/')) {
            database.UserstatsSendMeme(sender)
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            database.UserstatsSendMeme(sender)
        }
        if (message.content.includes('https://tenor.com/view/')) {
            database.UserstatsSendMeme(sender)
        }
        if (message.attachments.size) {
            database.UserstatsSendMeme(sender)
        }
    }
    
    if (message.channel.id === '738772392385577061') { //Music channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            database.UserstatsSendMusic(sender)
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            database.UserstatsSendMusic(sender)
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            database.UserstatsSendMusic(sender)
        }
        if (message.content.includes('https://youtu.be/')) {
            database.UserstatsSendMusic(sender)
        }
        if (message.attachments.size) {
            database.UserstatsSendMusic(sender)
        }
    }

    database.UserstatsSendMessage(sender)
    database.UserstatsSendChars(sender, message.cleanContent)
    
    //#endregion

    if (message.content.startsWith('https://www.reddit.com/r/')) {
        require('./commands/redditsave').Redditsave(message)
    }

    await newsManager.TryProcessMessage(message)

    if (thisIsPrivateMessage) {
        database.SaveUserToMemoryAll(sender, sender.username)
    } else {
        database.SaveUserToMemoryAll(sender, message.member.displayName.toString())
    }

    if (message.content.length > 2) {
        if (thisIsPrivateMessage === false) {
            economy.AddScore(message.member, calculateAddXp(message).total)
        }
    }

    if (message.content.startsWith(CONFIG.perfix)) {
        processCommand(message, thisIsPrivateMessage, sender, message.content.substring(1).trim())
        return
    }

    if (listOfHelpRequiestUsers.includes(message.author.id) === true) {
        if (message.content.toLowerCase().includes('igen')) {
            message.reply('Használd a `.help` parancsot!')
        } else if (message.content.toLowerCase().includes('nem')) {
            message.reply('...')
        }
        listOfHelpRequiestUsers.splice(listOfHelpRequiestUsers.indexOf(message.author.id), 1)
    } else {
        if (message.content.includes('<@!738030244367433770>')) {
            message.reply('Segítség kell?')
            listOfHelpRequiestUsers.push(message.author.id)
        }
    }
})

logManager.scriptLoadingText = 'Loading script... (define "processCommand" functions)'

/**
 * @param {Discord.Message} message
 * @param {boolean} thisIsPrivateMessage
 * @param {Discord.User} sender
 * @param {string} command
 */
async function processCommand(message, thisIsPrivateMessage, sender, command) {
    
    //#region Enabled in dm

    if (command === `pms`) {
        const CommandBusiness = require('./economy/businees')
        CommandBusiness(message.channel, sender, thisIsPrivateMessage, database)
        database.UserstatsSendCommand(sender)
        return
    }

    if (command === `test`) {
        const button0 = new ButtonBuilder()
            .setLabel("This is a button!")
            .setID("myid0")
            .setStyle("grey")
        const button1 = new ButtonBuilder()
            .setLabel("This is a button!")
            .setID("myid1")
            .setStyle("blurple")
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

        database.UserstatsSendCommand(sender)
        return
    }

    const currEditingMailI = mailManager.GetCurrentlyEditingMailIndex(sender.id)
    if (command === `mail`) {
        mailManager.CommandMail(sender, message.channel)
        database.UserstatsSendCommand(sender)
        return
    }
    if (currEditingMailI > -1) {
        if (command.startsWith(`mail wt `)) {
            const mailNewValue = command.replace(`mail wt `, '')
            
            mailManager.currentlyWritingEmails[currEditingMailI].mail.title = mailNewValue

            const _message = mailManager.GetMailMessage(sender, 3)
            mailManager.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            database.UserstatsSendCommand(sender)
            return
        } else if (command.startsWith(`mail wc `)) {
            const mailNewValue = command.replace(`mail wc `, '')

            mailManager.currentlyWritingEmails[currEditingMailI].mail.context = mailNewValue

            const _message = mailManager.GetMailMessage(sender, 3)
            mailManager.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            database.UserstatsSendCommand(sender)
            return
        } else if (command.startsWith(`mail wr `) && message.mentions.users.first()) {
            const mailNewValue = message.mentions.users.first()

            mailManager.currentlyWritingEmails[currEditingMailI].mail.reciver.id = mailNewValue.id
            mailManager.currentlyWritingEmails[currEditingMailI].mail.reciver.name = mailNewValue.username

            const _message = mailManager.GetMailMessage(sender, 3)
            mailManager.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            database.UserstatsSendCommand(sender)
            return
        } else if (command.startsWith(`mail wr `) && command.length == 26) {
            const mailNewValue = command.replace(`mail wr `, '')

            let userName = '???'
            try {
                userName = bot.users.cache.get(mailNewValue).username
            } catch (error) { }

            mailManager.currentlyWritingEmails[currEditingMailI].mail.reciver.id = mailNewValue
            mailManager.currentlyWritingEmails[currEditingMailI].mail.reciver.name = userName

            const _message = mailManager.GetMailMessage(sender, 3)
            mailManager.currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            database.UserstatsSendCommand(sender)
            return
        }
    }

    //#endregion

    //#region Disabled in dm

    if (command.startsWith(`quiz\n`)) {
        const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
        if (message.attachments.size == 1) {
            QuizManager.Quiz(bot, msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6], message.attachments.first())
        } else {
            QuizManager.Quiz(bot, msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6])
        }
        database.UserstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`quiz help`)) {
        database.UserstatsSendCommand(sender)
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
        database.UserstatsSendCommand(sender)
        const embed = new Discord.EmbedBuilder()
            .addFields([{ name: 'Quizdone szintaxis', value: '.quizdone messageId correctIndex(0 - ...)' }])
            .setColor(Color.Highlight)
        message.channel.send({ embeds: [embed] })
        return
    }

    if (command.startsWith(`quizdone `)) {
        QuizManager.QuizDone(bot, command.replace(`quizdone `, '').split(' ')[0], command.replace(`quizdone `, '').split(' ')[1])
        database.UserstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`poll simple\n`)) {
        const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
        PollManager.poll(bot, msgArgs[0], msgArgs[1], msgArgs[2], false)
        database.UserstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`poll wyr\n`)) {
        const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
        PollManager.poll(bot, msgArgs[0], msgArgs[1], msgArgs[2], true)
        database.UserstatsSendCommand(sender)
        return
    }

    //#endregion

    if (command === 'game') {
        if (game.gameMap == null) {
            game.gameMap = createGame(50, 50)
        }

        connectTogame(sender, game)
        gameResetCameraPos(false, sender, game)

        if (getGameUserSettings(sender.id, game) == null) {
            game.gameUserSettings.push(new GameUserSettings(sender.id))
        }

        const _message = getGameMessage(sender, false, false, game)
        message.channel.send({ embeds: [_message.embed], components: _message.actionRows }).then(msg => {
            game.allGameMessages.push(new savedGameMessage(msg, sender))
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
        */

        /**
         * @type {ButtonBuilder[]}
         */
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
            addNewPoll(msg.id, title, texts, icons, database)
        })
        return
        */
    }
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
async function processApplicationCommand(command, privateCommand) {
    const isDm = command.guild == null

    if (command.commandName == `test`) {
        const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');

		// Add components to modal

		// Create the text input components
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('favoriteColorInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('hobbiesInput')
			.setLabel("What's some of your favorite hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		await command.showModal(modal);

        return;
    }

    if (command.commandName === `handlebars` || command.commandName === `webpage`) {
        const { GetHash } = require('./economy/userHashManager')
        const row = new ActionRowBuilder()
        const button = new ButtonBuilder()
            .setLabel('Weboldal')
            .setStyle(Discord.ButtonStyle.Link)
            .setURL('http://bbpezsgo.ddns.net:5665/public?user=' + GetHash(command.user.id))
        row.addComponents(button)
        command.reply({ components: [row], ephemeral: true })
        return
    }

    if (command.commandName === `hangman`) {
        CommandHangman(command, hangmanManager, true)
        return
    }

    if (command.commandName == `gift`) {
        database.UserstatsSendCommand(command.user)
        CommandGift.OnCommand(command, database)
        return
    }

    if (command.commandName === `tesco`) {
        const CommandTesco = require('./commands/tesco')
        CommandTesco(command)
        return
    }

    if (command.commandName === `crossout`) {
        const Crossout = require('./commands/crossout')
        command.deferReply({ ephemeral: privateCommand }).then(() => {
            Crossout.GetItem(command, command.options.getString('search'), privateCommand)
        })
        return
    }

    if (command.commandName === `market` || command.commandName === `piac`) {
        command.reply(CommandMarket.OnCommand(database, database.dataMarket, command.user, privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `xp` || command.commandName === `score`) {
        const CommandXp = require('./economy/xp')
        CommandXp(command, database, privateCommand)
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName == `ping`) {
        var WsStatus = "Unknown"
        if (bot.ws.status === 0) {
            WsStatus = "Kész"
        } else if (bot.ws.status === 1) {
            WsStatus = "Csatlakozás"
        } else if (bot.ws.status === 2) {
            WsStatus = "Újracsatlakozás"
        } else if (bot.ws.status === 3) {
            WsStatus = "Tétlen"
        } else if (bot.ws.status === 4) {
            WsStatus = "Majdnem kész"
        } else if (bot.ws.status === 5) {
            WsStatus = "Lecsatlakozba"
        } else if (bot.ws.status === 6) {
            WsStatus = "Várakozás guild-okra"
        } else if (bot.ws.status === 7) {
            WsStatus = "Azonosítás"
        } else if (bot.ws.status === 8) {
            WsStatus = "Folytatás"
        }
        const embed = new Discord.EmbedBuilder()
            .setTitle('Pong!')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/ping-pong_1f3d3.png')
            .setColor(Color.Highlight)
            .addFields([
                {
                    name: '\\🤖 BOT:',
                    value:
                    '> Készen áll: ' + DateToString(new Date(bot.readyTimestamp))
                },
                {
                    name: '\\📡 WebSocket:',
                    value:
                    '> Ping: ' + bot.ws.ping + ' ms\n' +
                '> Státusz: ' + WsStatus
                }
            ])
        if (bot.shard != null) {
            embed.addFields([{
                name: 'Shard:',
                value:
                '> Fő port: ' + bot.shard.parentPort + '\n' +
                '> Mód: ' + bot.shard.mode
            }])
        }
        command.reply({ embeds: [embed], ephemeral: privateCommand })
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `weather`) {
        const CommandWeather = require('./commands/weather')
        /** @type {"earth" | "mars" | null} */
        const weatherLocation = command.options.getString('location', false)
        if (weatherLocation == 'mars') {
            CommandWeather(command, privateCommand, false)
        } else if (weatherLocation == 'earth' || weatherLocation == null) {            
            CommandWeather(command, privateCommand)
        } else {
            command.reply({ content: '> \\❌ **Nem tudok ilyen helyről <:wojakNoBrain:985043138471149588>**' })
        }
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `dev`) {
        if (command.user.id === '726127512521932880') {
            database.UserstatsSendCommand(command.user)
            const embed = new Discord.EmbedBuilder()
                .addFields([{
                    name: 'Fejlesztői parancsok',
                    value:
                    '> \\❔  `.quiz`\n' +
                    '>  \\📊  `.poll simple`\n' +
                    '>  \\📊  `.poll wyr`'
                }])
                .setColor(Color.Highlight)
            command.reply({ embeds: [embed], ephemeral: true })
        } else {
            command.reply({ content: '> \\⛔ **Nincs jogosultságod a parancs használatához!**', ephemeral: true })
        }
        return
    }

    if (command.commandName === `help`) {
        const CommandHelp = require('./commands/help')
        command.reply({ embeds: [CommandHelp(isDm)], ephemeral: privateCommand })
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `crate`) {
        command.reply(CommandOpenCrate.On(command.member.id, command.options.getInteger("darab"), database))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `heti`) {
        command.reply(CommandOpenDailyCrate.On(command.user.id, command.options.getInteger("darab"), database, economy))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `napi`) {
        command.reply(CommandOpenDailyCrate.On(command.user.id, command.options.getInteger("darab"), database, economy))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `profil` || command.commandName === `profile`) {
        const CommandProfil = require('./economy/profil')
        CommandProfil(database, command, privateCommand)
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `backpack`) {
        CommandBackpack.OnCommand(command, database, privateCommand)
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `bolt` || command.commandName === `shop`) {
        command.reply(CommandShop.CommandShop(command.channel, command.user, command.member, database, 0, '', privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `quiz`) {
        await command.deferReply()
        bot.channels.fetch(ChannelId.Quiz)
            .then(async () => {
                try {
                    QuizManager.Quiz(bot, command.options.getString("title"), command.options.getString("options"), command.options.getString("option_emojis"), command.options.getInteger("add_xp"), command.options.getInteger("remove_xp"), command.options.getInteger("add_token"), command.options.getInteger("remove_token"))
                        .then(() => {
                            command.editReply({ content: '> \\✔️ **Kész**', ephemeral: true })
                        })
                        .catch((error) => {
                            command.editReply({ content: '> \\❗ **Hiba: ' + error.toString() + '**', ephemeral: true })
                        })
                } catch (error) {
                    command.editReply({ content: '> \\❗ **Hiba: ' + error.toString() + '**', ephemeral: true })
                }
            })
            .catch((error) => {
                command.editReply({ content: '> \\❗ **Hiba: ' + error.toString() + '**', ephemeral: true })
            })
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `font`) {
        const { CommandFont } = require('./commands/fonts')
        CommandFont(command, privateCommand)
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `music`) {
        if (isDm == false) {
            if (command.options.getSubcommand() == 'play') {
                musicPlayer.CommandMusic(command, command.options.getString('url'))
            } else if (command.options.getSubcommand() == `skip`) {
                musicPlayer.CommandSkip(command)
            } else if (command.options.getSubcommand() == `list`) {
                musicPlayer.CommandMusicList(command)
            }
        } else {
            command.reply("> \\❌ **Ez a parancs csak szerveren használható!**")
        }
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `settings` || command.commandName === `preferences`) {
        await command.deferReply()
        /** @type {Discord.GuildMember} */
        const member = await command.member.fetch()
        await member.guild.fetch()
        command.editReply(CommandSettings(database, command.member, privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    command.reply("> \\❌ **Ismeretlen parancs `" + command.commandName + "`! **`/help`** a parancsok listájához!**")
}

logManager.scriptLoadingText = 'Loading script... (define some functions)'
function StartBot() {
    bot.login(CONFIG.tokens.discord)
        .then(token => {
        })
        .catch(error => {
            LogError(error)
        })
}

function StopBot() {
    bot.destroy()
    botStopped = true
}

logManager.scriptLoadingText = 'Loading script... (Finishing up)'
const endDateTime = new Date(Date.now())
const ellapsedMilliseconds = endDateTime - startDateTime

logManager.scriptLoadingText = ''

if (autoStartBot) StartBot()
