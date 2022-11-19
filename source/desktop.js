const LogError = require('./functions/errorLog')
const fs = require('fs')
process.on('uncaughtException', function (err) {
    fs.appendFileSync('./node.error.log', 'CRASH\n', { encoding: 'utf-8' })
    LogError(err)
})

var startedInvisible = false
var startedByUser = false
process.argv.forEach(function (val, index, array) {
    if (val == 'invisible') {
        startedInvisible = true
    } else if (val == 'user') {
        startedByUser = true
    }
})

var autoStartBot = true

const { SystemLog, SystemStart, SystemStop } = require('./functions/systemLog')

SystemStart(startedInvisible, startedByUser)

const startDateTime = new Date(Date.now())

const LogManager = require('./functions/log')
var logManager = new LogManager(null, null)

process.__defineGetter__('stderr', function() { return fs.createWriteStream(__dirname + '\\node.error.log', { flags: 'a' }) })

var botStopped = false

process.stdin.on('mousepress', function (info) {})

process.stdin.resume()

process.stdin.on('data', function (b) {
    var s = b.toString('utf8')
    
    if (logManager.CurrentlyPromt()) {
        logManager.OnKeyDown(s)
    }

    if (s === '\u0003') {
        if (botStopped == true) {
            SystemLog('Exit by user (terminal)')
            SystemStop()
            process.stdin.pause()
            setTimeout(() => { process.exit() }, 500)
        } else {
            SystemLog('Destroy bot by user (terminal)')
            StopBot()
        }
    } else if (/^\u001b\[M/.test(s)) {
        // mouse event
        // reuse the key array albeit its name
        // otherwise recompute as the mouse event is structured differently
        var modifier = s.charCodeAt(3)
        var key = {}
        key.shift = !!(modifier & 4)
        key.meta = !!(modifier & 8)
        key.ctrl = !!(modifier & 16)
        key.x = s.charCodeAt(4) - 32
        key.y = s.charCodeAt(5) - 32
        key.button = null
        key.sequence = s
        key.buf = Buffer(key.sequence)
        if ((modifier & 96) === 96) {
            key.name = 'scroll'
            key.button = modifier & 1 ? 'down' : 'up'
        } else {
            key.name = modifier & 64 ? 'move' : 'click'
            switch (modifier & 3) {
                case 0: key.button = 'left'; break;
                case 1: key.button = 'middle'; break;
                case 2: key.button = 'right'; break;
                case 3: key.button = 'none'; break;
                default: return;
            }
        }
        console.error(key)
    } else {
        // console.error(0, s, b)
    }
})

// Enable "raw mode"
if (process.stdin.setRawMode) {
    process.stdin.setRawMode(true)
} else {
    const tty = require('tty')
    if (tty.setRawMode)
    { tty.setRawMode(true) }    
}

// Enable "mouse reporting"
process.stdout.write('\x1b[?1005h')
process.stdout.write('\x1b[?1003h')

process.on('exit', function (code) {
    // Turn off mouse reporting
    process.stdout.write('\x1b[?1005l')
    process.stdout.write('\x1b[?1003l')
    console.log('Exit with code ' + code)

    SystemLog('Exited with code ' + code)
    SystemStop()
})

//#region NPM Packages and variables

logManager.Loading("Loading commands", 'profil')
const CommandProfil = require('./commands/profil')
logManager.Loading("Loading commands", 'help')
const CommandHelp = require('./commands/help')

logManager.Loading("Loading commands", 'poll')
const { addNewPoll, savePollDefaults } = require('./commands/poll')
logManager.Loading("Loading commands", 'database/xp')
const CommandXp = require('./commands/database/xp')
logManager.Loading("Loading commands", 'database/shop')
const { CommandShop, removeAllColorRoles } = require('./commands/database/shop')
logManager.Loading("Loading commands", 'database/businees')
const CommandBusiness = require('./commands/database/businees')
logManager.Loading("Loading commands", 'database/market')
const CommandMarket = require('./commands/database/market')
logManager.Loading("Loading commands", 'database/settings')
const CommandSettings = require('./commands/settings')

logManager.Loading("Loading extensions", 'database/xpFunctions')
const { xpRankIcon, xpRankText, calculateAddXp } = require('./commands/database/xpFunctions')

logManager.Loading("Loading commands", 'crossout')
const { CrossoutTest } = require('./commands/crossout')
logManager.Loading("Loading commands", 'redditsave')
const CommandRedditsave = require('./commands/redditsave')
logManager.Loading("Loading commands", 'fonts')
const { CommandFont } = require('./commands/fonts')
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
    GameMessage,
    GamePlayer,
    MapObject,
    GameTool,
    GameItem,
    ItemType,
    ToolType,
    Direction,
    MapObjectType,
    MapHeight,
    MapBiome,
    NoisePoint,
    Table,
    getGameMessage,
    getMapPoint
} = require('./commands/game')

logManager.Loading("Loading extensions", 'translator')
const { TranslateMessage } = require('./functions/translator.js')
logManager.Loading("Loading extensions", 'statesManager')
const { StatesManager } = require('./functions/statesManager.js')
logManager.Loading("Loading extensions", 'DatabaseManager')
const { DatabaseManager } = require('./functions/databaseManager.js')

logManager.Loading("Loading extensions", "MusicPlayer")
const MusicPlayer = require('./commands/music/functions')

logManager.Loading('Loading', "WS")
const WebInterface = require('./web-interface/manager')
const { GetHash } = require('./functions/userHashManager')

logManager.Loading('Loading packet', "discord.js")
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActivityType } = require('discord.js')
const { perfix, tokens } = require('./config.json')

const { AutoReact } = require('./functions/autoReact')

logManager.Loading('Loading packet', "other functions")
const { abbrev } = require('./functions/abbrev')
const { DateToString } = require('./functions/dateToString')
const NewsManager = require('./functions/news')
const { MailManager, Mail, MailUser, CurrentlyWritingMail } = require('./commands/mail')
const {
    Color,
    ChannelId,
    CliColor
} = require('./functions/enums.js')
const { CommandHangman, HangmanManager } = require('./commands/hangman.js')

logManager.BlankScreen()

const selfId = '738030244367433770'

/** @type {string[]} */
let listOfHelpRequiestUsers = []

const bot = new Discord.Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates ], partials: [ Discord.Partials.Channel ], presence: { activities: [{ name: 'Starting up...', type: ActivityType.Custom }] } })
logManager.Destroy()

const statesManager = new StatesManager()

const musicPlayer = new MusicPlayer(statesManager, bot)

logManager = new LogManager(bot, statesManager)
const newsManager = new NewsManager(statesManager, true)

statesManager.botLoaded = true

logManager.Loading('Loading database', 'Manager')
const database = new DatabaseManager('./database/', './database-copy/', statesManager)
logManager.Loading('Loading database', 'datas')
const databaseIsSuccesfullyLoaded = database.LoadDatabase()

if (!databaseIsSuccesfullyLoaded) {
    SystemLog('Error: Database not found')
    console.log(CliColor.FgRed + "Can't read database!" + CliColor.FgDefault)
    autoStartBot = false

    logManager.Promt('Betölti a biztonsági másolatokat?', ['Igen', 'Nem']).then(pressed => {
        if (pressed == 'Igen') {
            database.BackupDatabase()

            setTimeout(() => {
                StartBot()
            }, 1000)
        } else {
            SystemStop()
            setTimeout(() => { process.exit() }, 500)
        }
    })
}

const ws = new WebInterface('1234', '192.168.1.100', 5665, bot, logManager, database, StartBot, StopBot, statesManager, 'DESKTOP')
logManager.BlankScreen()

const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

const hangmanManager = new HangmanManager()

const mailManager = new MailManager(database)

const game = new Game()

//#endregion

//#region Functions 

/**
* @param {Discord.User} user
* @param {Discord.TextChannel} channel
* @param {number} ammount
 */
function addXp(user, channel, ammount) {
    const oldScore = database.dataBasic[user.id].score
    database.dataBasic[user.id].score += ammount
    const newScore = database.dataBasic[user.id].score

    if (oldScore < 1000 && newScore > 999 || oldScore < 5000 && newScore > 4999 || oldScore < 10000 && newScore > 9999 || oldScore < 50000 && newScore > 49999 || oldScore < 100000 && newScore > 99999) {
        let rank = xpRankIcon(newScore)
        let rankName = xpRankText(newScore)
        let addMoney = 0
        if (newScore < 1000) {
        } else if (newScore < 5000) {
            addMoney = 500
        } else if (newScore < 10000) {
            addMoney = 1000
        } else if (newScore < 50000) {
            addMoney = 1400
        } else if (newScore < 80000) {
            addMoney = 1800
        } else if (newScore < 100000) {
            addMoney = 2300
        } else if (newScore < 140000) {
            addMoney = 2500
        } else if (newScore < 180000) {
            addMoney = 2900
        } else if (newScore < 250000) {
            addMoney = 3300
        } else if (newScore < 350000) {
            addMoney = 3500
        } else if (newScore < 500000) {
            addMoney = 3800
        } else if (newScore < 780000) {
            addMoney = 4700
        } else if (newScore < 1000000) {
            addMoney = 5800
        } else if (newScore < 1500000) {
            addMoney = 10000
        } else if (newScore < 1800000) {
            addMoney = 11000
        } else {
            addMoney = 15000
        }

        database.dataBasic[user.id].money += addMoney
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.avatarURL() })
            .setTitle('Szintet léptél!')
            .addFields([
                {
                    name: 'Rang',
                    value: '\\' + rank.toString() + '  (' + rankName + ')',
                    inline: true
                },
                {
                    name: 'Jutalmad',
                    value: addMoney.toString() + '\\💵',
                    inline: true
                }
            ])
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clinking-beer-mugs_1f37b.png')
            .setColor(Color.Highlight)
        //channel.send({ embeds: [embed] })
    }

    database.SaveDatabase()
}

//#endregion

//#region Listener-ek

bot.on('reconnecting', () => {
    statesManager.botLoadingState = 'Reconnecting'
    SystemLog('Reconnecting')
})

bot.on('disconnect', () => {
    statesManager.botLoadingState = 'Disconnect'
    SystemLog('Disconnect')
})

bot.on('resume', () => {
    statesManager.botLoadingState = 'Resume'
    SystemLog('Resume')
})

bot.on('error', error => {
    statesManager.botLoadingState = 'Error'
    SystemLog('Error: ' + error.message)
    LogError(error)
})

bot.on('debug', debug => {
    statesManager.ProcessDebugMessage(debug)
    const translatedDebug = TranslateMessage(debug)

    if (translatedDebug == null) return

    if (translatedDebug.translatedText.startsWith('Heartbeat nyugtázva')) {
        SystemLog('Ping: ' + translatedDebug.translatedText.replace('Heartbeat nyugtázva: ', ''))
    }
})

bot.on('warn', warn => {
    statesManager.botLoadingState = 'Warning'
})

bot.on('shardError', (error, shardID) => {
    
})

bot.on('invalidated', () => {
    
})

bot.on('shardDisconnect', (colseEvent, shardID) => {
    statesManager.Shard.IsLoading = true
    statesManager.Shard.LoadingText = 'Lecsatlakozva'
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
    statesManager.Shard.LoadingText = 'Újracsatlakozás...'
})

bot.on('shardResume', (shardID, replayedEvents) => {
    statesManager.Shard.IsLoading = false
})

bot.on('raw', async event => {
    
})

bot.on('close', () => {
    statesManager.botLoadingState = 'Close'
    SystemLog('Close')
})

bot.on('destroyed', () => {
    statesManager.botLoadingState = 'Destroyed'
    SystemLog('Destroyed')
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

//#region Commands

//#region Command Functions

/**
 * @param {number} userId
 * @returns {string} The result string
 */
function openDayCrate(userId) {
    const RandomPercente = Math.floor(Math.random() * 100)
    let val = 0
    if (RandomPercente < 10) { // 10%
        val = 1
        database.dataBackpacks[userId].tickets += val

        return 0 + '|' + val
    } else if (RandomPercente < 30) { // 20%
        val = 1
        database.dataBackpacks[userId].crates += val

        return 1 + '|' + val
    } else if (RandomPercente < 60) { // 30%
        val = Math.floor(Math.random() * 50) + 30
        database.dataBasic[userId].score += val

        return 2 + '|' + val
    } else { // 40%
        val = Math.floor(Math.random() * 300) + 100
        database.dataBasic[userId].money += val

        return 3 + '|' + val
    }
}

//#endregion

/**
 * @param {Discord.User} sender 
 * @param {boolean} privateCommand
 */
function commandStore(sender, privateCommand) {
    const GetUserColor = require('./functions/userColor')
    
    var dayCrates = (database.dataBot.day - database.dataBasic[sender.id].day) / 7
    var crates = database.dataBackpacks[sender.id].crates
    var gifts = database.dataBackpacks[sender.id].gifts
    var tickets = database.dataBackpacks[sender.id].tickets
    var getGifts = database.dataBackpacks[sender.id].getGift
    var quizTokens = database.dataBackpacks[sender.id].quizTokens
    var smallLuckyCard = database.dataBackpacks[sender.id].luckyCards.small
    var mediumLuckyCard = database.dataBackpacks[sender.id].luckyCards.medium
    var largeLuckyCard = database.dataBackpacks[sender.id].luckyCards.large
    var money = database.dataBasic[sender.id].money

    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: sender.username, iconURL: sender.avatarURL() })
        .setTitle('Hátizsák')
        .addFields([
            { name: 'Pénz', value: '\\💵 ' + abbrev(money), inline: false },
            {
                name: 'Alap cuccok', value: 
                '> \\🧱 ' + crates + ' láda\n' +
                '> \\🎁 ' + gifts + ' ajándék\n' +
                '> \\🎟️ ' + tickets + ' kupon\n' +
                '> \\🎫 ' + quizTokens + ' Quiz Token\n' +
                '> \\🧰 ' + Math.floor(dayCrates) + ' heti láda',
                inline: false
            },
            {
                name: 'Sorsjegyek', value: 
                '> \\💶 ' + smallLuckyCard + ' Black Jack\n' +
                '> \\💷 ' + mediumLuckyCard + ' Buksza\n' +
                '> \\💴 ' + largeLuckyCard + ' Fáraók Kincse',
                inline: false
            }
        ])
        .setFooter({ text: 'Ha használni szeretnéd az egyik cuccodat, kattints az ikonjára!' })
        .setColor(GetUserColor(database.dataBasic[sender.id].color))
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/briefcase_1f4bc.png')
    if (getGifts > 0) {
        if (getGifts == 1) {
            embed.addFields([{ name: 'Van egy ajándékod, ami kicsomagolásra vár', value: 'Kattints a \\🎀-ra a kicsomagoláshoz!' }])
        } else {
            embed.addFields([{ name: 'Van ' + getGifts + ' ajándékod, ami kicsomagolásra vár', value: 'Kattints a \\🎀-ra a kicsomagoláshoz!' }])
        }
    }
    const buttonCrate = new ButtonBuilder()
        .setLabel("🧱")
        .setCustomId("openCrate")
        .setStyle(Discord.ButtonStyle.Primary)
    const buttonDayCrate = new ButtonBuilder()
        .setLabel("🧰")
        .setCustomId("openDayCrate")
        .setStyle(Discord.ButtonStyle.Primary)
    const buttonLuckyCardSmall = new ButtonBuilder()
        .setLabel("💶")
        .setCustomId("useLuckyCardSmall")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonLuckyCardMedium = new ButtonBuilder()
        .setLabel("💷")
        .setCustomId("useLuckyCardMedium")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonLuckyCardLarge = new ButtonBuilder()
        .setLabel("💴")
        .setCustomId("useLuckyCardLarge")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonOpenGift = new ButtonBuilder()
        .setLabel("🎀")
        .setCustomId("openGift")
        .setStyle(Discord.ButtonStyle.Primary)
    const buttonSendGift = new ButtonBuilder()
        .setLabel("🎁")
        .setCustomId("sendGift")
        .setStyle(Discord.ButtonStyle.Secondary)
    if (!crates > 0) { buttonCrate.setDisabled(true) }
    if (!(Math.floor(dayCrates)) > 0) { buttonDayCrate.setDisabled(true) }
    if (!smallLuckyCard > 0) { buttonLuckyCardSmall.setDisabled(true) }
    if (!mediumLuckyCard > 0) { buttonLuckyCardMedium.setDisabled(true) }
    if (!largeLuckyCard > 0) { buttonLuckyCardLarge.setDisabled(true) }
    if (!getGifts > 0) { buttonOpenGift.setDisabled(true) }
    if (!gifts > 0) { buttonSendGift.setDisabled(true) }
    const rowPrimary = new ActionRowBuilder()
        .addComponents(buttonCrate, buttonDayCrate, buttonLuckyCardSmall, buttonLuckyCardMedium, buttonLuckyCardLarge)
    const rowSecondary = new ActionRowBuilder()
        .addComponents(buttonSendGift)
    if (getGifts > 0) { rowSecondary.addComponents(buttonOpenGift) }
    return { embeds: [embed], components: [rowPrimary, rowSecondary], ephemeral: privateCommand }
}

/**
 * @param {Discord.GuildMember} sender 
 * @param {number} ammount
 * @param {boolean} privateCommand
 */
function commandAllNapi(sender, ammount, privateCommand) {
    if (Math.floor((database.dataBot.day - database.dataBasic[sender.id].day) / 7) <= 0) {
        return { content: '> **\\❌ Nincs heti ládád! \\🧰**', ephemeral: privateCommand }
    } else {
        var dayCrateCountRaw = (database.dataBot.day - database.dataBasic[sender.id].day) / 7
        let dayCrates = Math.min(dayCrateCountRaw, ammount)

        let getXpS = 0
        let getChestS = 0
        let getMoney = 0
        let getTicket = 0
        for (let i = 0; i < Math.floor(dayCrates); i++) {

            const rewald = openDayCrate(sender.id)
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


        database.dataBasic[sender.id].day = database.dataBasic[sender.id].day + (Math.floor(dayCrates) * 7)
        database.SaveDatabase()

        return {
            content: '> ' + Math.floor(dayCrates) + 'x \\🧰 Kaptál:\n' +
                '>     \\💵 **' + getMoney + '** pénzt\n' +
                '>     \\🍺 **' + getXpS + '** xpt\n' +
                '>     \\🧱 **' + getChestS + '** ládát\n' +
                '>     \\🎟️ **' + getTicket + '** kupont',
            ephemeral: privateCommand
        }
    }
}

/**
 * @param {Discord.GuildMember} sender 
 * @param {number} ammount
 * @param {boolean} privateCommand
 */
function commandAllCrate(sender, ammount, privateCommand) {
    if (database.dataBackpacks[sender.id].crates === 0) {
        return {
            content: '> **\\❌ Nincs ládád! \\🧱**',
            ephemeral: privateCommand
        }
    } else {
        let Crates = Math.min(database.dataBackpacks[sender.id].crates, ammount)

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
                database.dataBasic[sender.id].score += val
            }
            if (out === 'money') {
                val = Math.floor(Math.random() * 2000) + 2000
                getMoney += val
                database.dataBasic[sender.id].money += val
            }
            if (out === 'gift') {
                getGiftS += 1
                database.dataBackpacks[sender.id].gifts += 1
            }
        }

        database.dataBackpacks[sender.id].crates = database.dataBackpacks[sender.id].crates - Crates
        database.SaveDatabase()

        return {
            content: '> ' + Crates + 'x \\🧱 Kaptál:\n' +
                '>     \\🍺 **' + getXpS + '** xpt\n' +
                '>     \\💵 **' + getMoney + '** pénzt\n' +
                '>     \\🎁 **' + getGiftS + '** ajándékot',
            ephemeral: privateCommand
        }

    }
}

/**@param {number} days @returns {number} */
function DaysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000
}

/**
 * @param {Discord.MessageAttachment} image
 * @param {string} titleText
 * @param {string} listOfOptionText
 * @param {string} listOfOptionEmojis
 */
async function quiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, image = undefined) {
    const optionEmojis = listOfOptionEmojis.toString().split(';')
    const optionTexts = listOfOptionText.toString().split(';')
    let optionText = ''
    for (let i = 0; i < optionTexts.length; i++) {
        optionText += `> ${optionEmojis[i]}  ${optionTexts[i].trim()}\n`
    }

    const dateNow = Date.now() + DaysToMilliseconds(2)

    const embed = new Discord.EmbedBuilder()
        .setColor(Color.Pink)
        .setTitle('Quiz!')
        .setDescription(
            `\\✔️  **${addXpValue}\\🍺** és **${addToken}\\🎫**\n` +
            `\\❌ **-${removeXpValue}\\🍺** és **-${removeToken}\\🎫**\n` +
            `Ha van **\`Quiz - Answer Streak\`** rangod, bejelölheted a 🎯 opciót is, hogy a fenti értékek számodra megduplázódjanak.`
        )
        .addFields([{
            name: titleText,
            value: optionText
        }])
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/direct-hit_1f3af.png')
        .setFooter({ text: "Vége:" })
        .setTimestamp(dateNow)
    if (image != undefined) {
        embed.setImage(image.url)
    }

    /** @type {Discord.GuildTextBasedChannel | undefined} */
    const quizChannel = bot.channels.cache.get(ChannelId.Quiz)
    const sentQuiz = await quizChannel.send({ embeds: [embed] })
    if (sentQuiz) {
        await sentQuiz.react('🎯')
        for (let i = 0; i < optionEmojis.length; i++) {
            if (optionEmojis[i].includes('<')) {
                await sentQuiz.react(optionEmojis[i].split(':')[2].replace('>', ''))
            } else {
                await sentQuiz.react(optionEmojis[i])
            }
        }  
        await quizChannel.send('> <@&799342836931231775>')      
    }
}

/**
* @param {string} titleText
* @param {string} listOfOptionText
* @param {string} listOfOptionEmojis
* @param {boolean} wouldYouRather
*/
function poll(titleText, listOfOptionText, listOfOptionEmojis, wouldYouRather) {
    const optionEmojis = listOfOptionEmojis.toString().replace(' ', '').split(';')
    const optionTexts = listOfOptionText.toString().replace(' ', '').split(';')
    let optionText = ''
    if (wouldYouRather) {
        for (let i = 0; i < optionTexts.length; i++) {
            optionText += `${optionEmojis[i]}  ${optionTexts[i]}\n`
            if (i < optionTexts.length - 1) {
                optionText += `   vagy\n`
            }
        }
    } else {
        for (let i = 0; i < optionTexts.length; i++) {
            optionText += `${optionEmojis[i]}  ${optionTexts[i]}\n`
        }
    }
    const embed = new Discord.EmbedBuilder()
        .setColor(Color.DarkPink)
        .setTitle('Szavazás!')
        .addFields([{
            name: titleText,
            value: optionText
        }])

    bot.channels.cache.get('795935090026086410').send({ embeds: [embed] }).then(message => {
        message.channel.send('> <@&795935996982198272>')
        for (let i = 0; i < optionEmojis.length; i++) {
            if (optionEmojis[i].includes('<')) {
                message.react(optionEmojis[i].split(':')[2].replace('>', ''))
            } else {
                message.react(optionEmojis[i])
            }
        }
    })

}

/**@param {Discord.GuildMember} member @returns {boolean} */
function HasQuizStreakRole(member) {
    const roles = ['929443006627586078', '929443558040166461', '929443627527180288', '929443673077329961']
    return member.roles.cache.some(role => roles.includes(role.id))
}

/**@param {string} quizMessageId @param {number} correctIndex */
async function quizDone(quizMessageId, correctIndex) {

    /**@type {Discord.TextChannel} */
    const channel = bot.channels.cache.get(ChannelId.Quiz)
    channel.messages.fetch({ limit: 10 }).then(async (messages) => {
        const message = messages.get(quizMessageId)
        /**@type {string[]} */
        const answersEmoji = []
        const variableHAHA = message.embeds[0].fields[0].value.split('\n')
        variableHAHA.forEach(element => {
            const gfgfdgdfgdf = element.replace('>', '').trimStart().split(' ')[0]
            if (gfgfdgdfgdf.includes('🎯')) { } else {
                answersEmoji.push(gfgfdgdfgdf)
            }
        })
        const correctAnswer = message.embeds[0].fields[0].value.split('\n')[correctIndex].replace('>', '').trimStart()
        const correctAnswerEmoji = correctAnswer.split(' ')[0]
        const correctAnswerText = correctAnswer.replace(correctAnswerEmoji, '').trimStart()
        const awardAdd0 = message.embeds[0].description.split('\n')[0].replace('✔️', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[0].replace('🍺', '')
        const awardAdd1 = message.embeds[0].description.split('\n')[0].replace('✔️', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[1].replace('🎫', '')
        const awardRemove0 = message.embeds[0].description.split('\n')[1].replace('❌', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[0].replace('🍺', '').replace('-', '')
        const awardRemove1 = message.embeds[0].description.split('\n')[1].replace('❌', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[1].replace('🎫', '').replace('-', '')

        message.reactions.resolve('🎯').users.fetch().then(async (userList0) => {
            /**@type {string[]} */
            const usersWithCorrectAnswer = []
            /**@type {string[]} */
            const usersWithWrongAnswer = []
            const usersWithMultiplier = userList0.map((user) => user.id)

            const members = bot.guilds.cache.get('737954264386764812').members
            let finalText = '**A helyes válasz: ' + correctAnswerEmoji + ' ' + correctAnswerText + '**'

            for (let i = 0; i < answersEmoji.length; i++) {
                const currentAnswerEmoji = answersEmoji[i]
                await message.reactions.resolve(currentAnswerEmoji).users.fetch().then(async (userList1) => {
                    const users = userList1.map((user) => user.id)
                    for (let j = 0; j < users.length; j++) {
                        const userId = users[j]
                        if (userId == bot.user.id) { continue }

                        //const members = await bot.guilds.cache.get('737954264386764812').members.fetch({ limit: 20 })
                        const member = await bot.guilds.cache.get('737954264386764812').members.fetch({ user: userId })

                        if (currentAnswerEmoji == correctAnswerEmoji) {
                            usersWithCorrectAnswer.push(userId)
                            if (usersWithMultiplier.includes(userId) && HasQuizStreakRole(member)) {
                                finalText += '\n> <@!' + userId + '> nyert ' + (parseInt(awardAdd0) * 2) + ' \\\uD83C\uDF7At és ' + (parseInt(awardAdd1) * 2) + ' \\🎫t'
                            } else {
                                finalText += '\n> <@!' + userId + '> nyert ' + (awardAdd0) + ' \\\uD83C\uDF7At és ' + (awardAdd1) + ' \\🎫t'
                            }
                        } else {
                            usersWithWrongAnswer.push(userId)
                            if (usersWithMultiplier.includes(userId) && HasQuizStreakRole(member)) {
                                finalText += '\n> <@!' + userId + '> veszített ' + (parseInt(awardRemove0) * 2) + ' \\\uD83C\uDF7At és ' + (parseInt(awardRemove1) * 2) + ' \\🎫t'
                            } else {
                                finalText += '\n> <@!' + userId + '> veszített ' + (awardRemove0) + ' \\\uD83C\uDF7At és ' + (awardRemove1) + ' \\🎫t'
                            }
                        }
                    }
                })
            }
            bot.channels.cache.get(ChannelId.Quiz).send(finalText)
        })
    })
}
//#endregion

bot.on('interactionCreate', async interaction => {
    if (interaction.member == undefined) {
        database.SaveUserToMemoryAll(interaction.user, interaction.user.username)        
    } else {
        database.SaveUserToMemoryAll(interaction.user, interaction.member.displayName)
    }
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
                        '>   alap érték: ' + messageXpValue.messageBasicReward + '\\🍺' + '\n' +
                        '>   fájl bónusz: ' + messageXpValue.messageAttachmentBonus + '\\🍺' + '\n' +
                        '>   hossz bónusz: ' + messageXpValue.messageLengthBonus + '\\🍺' + '\n' +
                        '>   emoji bónusz: ' + messageXpValue.messageEmojiBonus + '\\🍺' + '\n' +
                        '>   link bónusz: ' + messageXpValue.otherBonuses + '\\🍺' + '\n' +
                        '>   egyedi emoji bónusz: ' + messageXpValue.messageCustomEmojiBonus + '\\🍺'
                    ,ephemeral: true
                })
            }
        }
    } else if (interaction.isUserContextMenuCommand()) {
        if (interaction.commandName == 'Megajándékozás') {
            try {
                const giftableMember = interaction.targetMember
                if (database.dataBackpacks[interaction.user.id].gifts > 0) {
                    if (giftableMember.id === interaction.user.id) {
                        interaction.reply({ content: '> **\\❌ Nem ajándékozhatod meg magad**', ephemeral: true })
                    } else {
                        if (database.dataBackpacks[giftableMember.id] != undefined && giftableMember.id != selfId) {
                            database.dataBackpacks[giftableMember.id].getGift += 1
                            database.dataBackpacks[interaction.user.id].gifts -= 1
                            interaction.reply({ content: '> \\✔️ **' + giftableMember.username.toString() + '** megajándékozva', ephemeral: true })
                            giftableMember.send('> **\\✨ ' + interaction.user.username + ' megajándékozott! \\🎆**')
                            database.SaveDatabase()
                        } else {
                            interaction.reply({ content: '> **\\❌ Úgy néz ki hogy nincs ' + giftableMember.displayName + ' nevű felhasználó az adatbázisban**', ephemeral: true })
                        }
                    }
                } else {
                    if (giftableMember.id === interaction.user.id) {
                        interaction.reply({ content: '> **\\❌ Nem ajándékozhatod meg magad. Sőt! Nincs is ajándékod**', ephemeral: true })
                    } else {
                        interaction.reply({ content: '> **\\❌ Nincs ajándékod, amit odaadhatnál**', ephemeral: true })
                    }
                }
            } catch (error) {
                interaction.reply({ content: '> **\\❌ ' + error.toString() + '**', ephemeral: true })
            }
        }
    } else if (interaction.isCommand()) {
        processApplicationCommand(interaction, privateCommand)
    } else if (interaction.isButton()) {
        if (interaction.component.customId.startsWith('redditsaveDeleteMain')) {
            if (interaction.component.customId.includes(interaction.user.id)) {
                interaction.channel.messages.cache.get(interaction.component.customId.split('.')[1]).delete()
                const button1 = interaction.message.components[0].components[0]
                const button2 = interaction.message.components[0].components[1]
                const row = new ActionRowBuilder()
                    .addComponents(button1, button2)
                interaction.update({ embeds: [interaction.message.embeds[0]], components: [row] })
                return
            }
        }
        if (interaction.component.customId.startsWith('redditsaveDelete')) {
            if (interaction.component.customId.includes(interaction.user.id)) {
                interaction.message.delete()
                return
            }
        }

        try {
            if (interaction.user.username === interaction.message.embeds[0].author.name) { } else {
                interaction.reply({ content: '> \\❗ **Ez nem a tied!**', ephemeral: true })
                return
            }
        } catch (error) { }

        let isOnPhone = false
        let isInDebugMode = false
        let playerIndex = 0

        if (interaction.component.customId === 'openDayCrate') {
            if (Math.floor((database.dataBot.day - database.dataBasic[interaction.user.id].day) / 7) <= 0) {
                interaction.reply({ content: '> **\\❌ Már kinyitottad a heti ládádat!*', ephemeral: true })
            } else {
                const rewald = openDayCrate(interaction.user.id)
                const rewaldIndex = rewald.split('|')[0]
                const rewaldValue = rewald.split('|')[1]
                let txt = ''

                if (rewaldIndex === '2') {
                    txt = '**\\🍺 ' + rewaldValue + '** xp-t'
                } else if (rewaldIndex === '3') {
                    txt = '**\\💵' + rewaldValue + '** pénzt'
                } else if (rewaldIndex === '1') {
                    txt = '**\\🧱 1 ládát**'
                } else if (rewaldIndex === '0') {
                    txt = '**\\🎟️ 1 kupont**'
                } else {
                    txt = rewald
                }

                interaction.reply({ content: '> \\🧰 Kaptál:  ' + txt, ephemeral: true })
            }

            database.dataBasic[interaction.user.id].day += 7
            if (database.dataBasic[interaction.user.id].day > database.dataBot.day) {
                database.dataBasic[interaction.user.id].day = database.dataBot.day
            }

            interaction.message.edit(commandStore(interaction.user, privateCommand))

            database.SaveDatabase()
            return
        }

        if (interaction.component.customId === 'openCrate') {
            if (database.dataBackpacks[interaction.user.id].crates > 0) {
                database.dataBackpacks[interaction.user.id].crates -= 1
                var replies = ['xp', 'money', 'gift']
                var random = Math.floor(Math.random() * 3)
                var out = replies[random]
                var val = 0
                var txt = ''

                if (out === 'xp') {
                    val = Math.floor(Math.random() * 110) + 10
                    txt = '**\\🍺 ' + val + '** xp-t'
                    database.dataBasic[interaction.user.id].score += val
                }
                if (out === 'money') {
                    val = Math.floor(Math.random() * 2000) + 3000
                    txt = '**\\💵' + val + '** pénzt'
                    database.dataBasic[interaction.user.id].money += val
                }
                if (out === 'gift') {
                    txt = '**\\🎁 1** ajándékot'
                    database.dataBackpacks[interaction.user.id].gifts += 1
                }

                interaction.message.edit(commandStore(interaction.user, privateCommand))
                interaction.reply({ content: '> \\🧱 Kaptál:  ' + txt, ephemeral: true })
                database.SaveDatabase()
            } else {
                interaction.message.edit(commandStore(interaction.user, privateCommand))
                interaction.reply({ content: '> \\🧱 Nincs több ládád!', ephemeral: true })
            }

            return
        }

        if (interaction.component.customId === 'useLuckyCardSmall') {
            database.dataBackpacks[interaction.user.id].luckyCards.small -= 1
            var val = 0

            var nyeroszam = Math.floor(Math.random() * 2)
            if (nyeroszam === 1) {
                val = Math.floor(Math.random() * 1001) + 1500
                database.dataBasic[interaction.user.id].money += val
            }

            if (val === 0) {
                interaction.reply({ content: '> \\💶 Nyertél:  **semmit**', ephemeral: true })
            } else {
                interaction.reply({ content: '> \\💶 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true })
            }

            interaction.message.edit(commandStore(interaction.user, privateCommand))

            database.SaveDatabase()
            return
        }

        if (interaction.component.customId === 'useLuckyCardMedium') {
            database.dataBackpacks[interaction.user.id].luckyCards.medium -= 1
            var val = 0

            var nyeroszam = Math.floor(Math.random() * 4)
            if (nyeroszam === 1) {
                val = Math.floor(Math.random() * 3001) + 3000
                database.dataBasic[interaction.user.id].money += val
            }

            if (val === 0) {
                interaction.reply({ content: '> \\💷 Nyertél:  **semmit**', ephemeral: true })
            } else {
                interaction.reply({ content: '> \\💷 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true })
            }

            interaction.message.edit(commandStore(interaction.user, privateCommand))

            database.SaveDatabase()
            return
        }

        if (interaction.component.customId === 'useLuckyCardLarge') {
            database.dataBackpacks[interaction.user.id].luckyCards.large -= 1
            var val = 0

            var nyeroszam = Math.floor(Math.random() * 9)
            if (nyeroszam === 1) {
                val = Math.floor(Math.random() * 5001) + 6500
                database.dataBasic[interaction.user.id].money += val
            }

            if (val === 0) {
                interaction.reply({ content: '> \\💴 Nyertél:  **semmit**', ephemeral: true })
            } else {
                interaction.reply({ content: '> \\💴 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true })
            }

            interaction.message.edit(commandStore(interaction.user, privateCommand))

            database.SaveDatabase()
            return
        }

        if (interaction.component.customId === 'openGift') {
            database.dataBackpacks[interaction.user.id].getGift -= 1
            var replies = ['xp', 'money']
            var random = Math.floor(Math.random() * 2)
            var out = replies[random]
            var val = 0
            var txt = ''

            if (out === 'xp') {
                val = Math.floor(Math.random() * 530) + 210
                txt = '**\\🍺 ' + val + '** xp-t'
                database.dataBasic[interaction.user.id].score += val
            }
            if (out === 'money') {
                val = Math.floor(Math.random() * 2300) + 1000
                txt = '**\\💵' + val + '** pénzt'
                database.dataBasic[interaction.user.id].money += val
            }

            interaction.reply({ content: '> \\🎀 Kaptál ' + txt, ephemeral: true })
            interaction.message.edit(commandStore(interaction.user, privateCommand))

            database.SaveDatabase()
            return
        }

        if (interaction.component.customId === 'sendGift') {
            interaction.reply({ content: '> **\\❔ Használd a **`/gift <felhasználó>`** parancsot egy személy megajándékozásához, vagy jobb klikk a felhasználóra > Alkalmazások > Megajándékozás**', ephemeral: true })
            interaction.message.edit(commandStore(interaction.user, privateCommand))

            database.SaveDatabase()
            return
        }

        if (interaction.component.customId.startsWith('game')) {
            if (game.gameMap == null) {
                interaction.reply('> \\❗ **Nincs létrehozva játék!**', true)
            } else {
                if (interaction.component.customId === 'gameW') {
                    game.gameMap.players[playerIndex].direction = Direction.Up
                    if (playerCanMoveToHere(game.gameMap.players[playerIndex].x, game.gameMap.players[playerIndex].y - 1, game.gameMap) === true) {
                        game.gameMap.players[playerIndex].y -= 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user, game)

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)

                } else if (interaction.component.customId === 'gameA') {
                    game.gameMap.players[playerIndex].direction = Direction.Left
                    if (playerCanMoveToHere(game.gameMap.players[playerIndex].x - 1, game.gameMap.players[playerIndex].y, game.gameMap) === true) {
                        game.gameMap.players[playerIndex].x -= 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user, game)

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)

                } else if (interaction.component.customId === 'gameS') {
                    game.gameMap.players[playerIndex].direction = Direction.Down
                    if (playerCanMoveToHere(game.gameMap.players[playerIndex].x, game.gameMap.players[playerIndex].y + 1, game.gameMap) === true) {
                        game.gameMap.players[playerIndex].y += 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user, game)

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)

                } else if (interaction.component.customId === 'gameD') {
                    game.gameMap.players[playerIndex].direction = Direction.Right
                    if (playerCanMoveToHere(game.gameMap.players[playerIndex].x + 1, game.gameMap.players[playerIndex].y, game.gameMap) === true) {
                        game.gameMap.players[playerIndex].x += 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user, game)

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)

                } else if (interaction.component.customId === 'gameHit') {
                    /**
                     * @type {MapPoint}
                     */
                    let mapPoint
                    if (game.gameMap.players[playerIndex].direction === Direction.Up) {
                        mapPoint = getMapPoint(game.gameMap.players[playerIndex].x, game.gameMap.players[playerIndex].y - 1, game.gameMap)
                    } else if (game.gameMap.players[playerIndex].direction === Direction.Right) {
                        mapPoint = getMapPoint(game.gameMap.players[playerIndex].x + 1, game.gameMap.players[playerIndex].y, game.gameMap)
                    } else if (game.gameMap.players[playerIndex].direction === Direction.Down) {
                        mapPoint = getMapPoint(game.gameMap.players[playerIndex].x, game.gameMap.players[playerIndex].y + 1, game.gameMap)
                    } else if (game.gameMap.players[playerIndex].direction === Direction.Left) {
                        mapPoint = getMapPoint(game.gameMap.players[playerIndex].x - 1, game.gameMap.players[playerIndex].y, game.gameMap)
                    }

                    if (mapPoint.object !== null) {
                        /**
                         * @type {MapObject}
                         */
                        let breakableObj
                        breakableObj = mapPoint.object
                        breakableObj.breakValue -= 1
                        if (breakableObj.breakValue <= 0) {
                            if (breakableObj.type === MapObjectType.bamboo) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Wood, 1)
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.blossom) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.cactus) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.cherryBlossom) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.hibiscus) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.igloo) {

                            } else if (breakableObj.type === MapObjectType.mushroom) {

                            } else if (breakableObj.type === MapObjectType.palm) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Wood, 3)
                            } else if (breakableObj.type === MapObjectType.plant) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.rice) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 2)
                            } else if (breakableObj.type === MapObjectType.rose) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.spruce) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Wood, 4)
                            } else if (breakableObj.type === MapObjectType.sunflower) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.tanabataTree) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Wood, 2)
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            } else if (breakableObj.type === MapObjectType.tree) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Wood, 4)
                            } else if (breakableObj.type === MapObjectType.tulip) {
                                addItemToPlayer(game.gameMap.players[playerIndex], ItemType.Grass, 1)
                            }
                            mapPoint.object = null
                        }
                    }

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)

                } else if (interaction.component.customId === 'gameUse') {

                } else if (interaction.component.customId === 'gameSwitchPhone') {
                    for (let i = 0; i < game.gameUserSettings.length; i++) {
                        if (game.gameUserSettings[i].userId === interaction.user.id) {
                            if (isOnPhone === true) {
                                game.gameUserSettings[i].isOnPhone = false
                            } else {
                                game.gameUserSettings[i].isOnPhone = true
                            }
                        }
                    }

                    if (getGameUserSettings(interaction.user.id, game) !== null) {
                        isOnPhone = getGameUserSettings(interaction.user.id, game).isOnPhone
                    }

                    gameResetCameraPos(isOnPhone, interaction.user, game)

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)
                } else if (interaction.component.customId === 'gameSwitchDebug') {
                    for (let i = 0; i < game.gameUserSettings.length; i++) {
                        if (game.gameUserSettings[i].userId === interaction.user.id) {
                            if (isInDebugMode === true) {
                                game.gameUserSettings[i].isInDebugMode = false
                            } else {
                                game.gameUserSettings[i].isInDebugMode = true
                            }
                        }
                    }

                    if (getGameUserSettings(interaction.user.id, game) !== null) {
                        isInDebugMode = getGameUserSettings(interaction.user.id, game).isInDebugMode
                    }

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)
                } else if (interaction.component.customId === 'gameRestart') {
                    game.gameMap = createGame(50, 50)
                    connectTogame(interaction.user, game)
                    gameResetCameraPos(isOnPhone, interaction.user, game)

                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction, game)
                }
            }
            return
        }

        if (interaction.component.customId == 'shopClose') {
            bot.channels.fetch(interaction.channelId)
                .then((channel) => {
                    channel.messages.fetch(interaction.message.id)
                        .then((message) => {
                            message.delete()
                        })
                })
        }

        if (interaction.component.customId.startsWith('shopBuy')) {
            const money = database.dataBasic[interaction.user.id].money
            const buyItem = interaction.component.customId.replace('shopBuy', '')
            if (buyItem == 'Crate') {
                if (money >= 2099) {
                    database.dataBasic[interaction.user.id].money -= 2099
                    database.dataBackpacks[interaction.user.id].crates += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1, '', privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'Gift') {
                if (money >= 3999) {
                    database.dataBasic[interaction.user.id].money -= 3999
                    database.dataBackpacks[interaction.user.id].gifts += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1, '', privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'Ticket') {
                if (money >= 8999) {
                    database.dataBasic[interaction.user.id].money -= 8999
                    database.dataBackpacks[interaction.user.id].tickets += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1, '', privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'WC') {
                if (money >= 799) {
                    database.dataBasic[interaction.user.id].money -= 799

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1, '', privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'LuckySmall') {
                if (money >= 1999) {
                    database.dataBasic[interaction.user.id].money -= 1999
                    database.dataBackpacks[interaction.user.id].luckyCards.small += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 2, '', privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'LuckyMedium') {
                if (money >= 3599) {
                    database.dataBasic[interaction.user.id].money -= 3599
                    database.dataBackpacks[interaction.user.id].luckyCards.medium += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 2, '', privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'LuckyLarge') {
                if (money >= 6999) {
                    database.dataBasic[interaction.user.id].money -= 6999
                    database.dataBackpacks[interaction.user.id].luckyCards.large += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 2, '', privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            }
            return
        }

        if (interaction.component.customId.startsWith('market')) {
            const money = database.dataBasic[interaction.user.id].money
            const buyItem = interaction.component.customId.replace('market', '')
            if (buyItem == 'TokenToMoney') {
                if (database.dataBackpacks[interaction.user.id].quizTokens > 0) {
                    database.dataBasic[interaction.user.id].money += Number.parseInt(database.dataMarket.prices.token)
                    database.dataBackpacks[interaction.user.id].quizTokens -= 1

                    interaction.update(CommandMarket(database, database.dataMarket, interaction.user, privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'TicketToMoney') {
                if (database.dataBackpacks[interaction.user.id].tickets > 0) {
                    database.dataBasic[interaction.user.id].money += Number.parseInt(database.dataMarket.prices.coupon)
                    database.dataBackpacks[interaction.user.id].tickets -= 1

                    interaction.update(CommandMarket(database, database.dataMarket, interaction.user, privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'JewelToMoney') {
                if (database.dataBackpacks[interaction.user.id].jewel > 0) {
                    database.dataBasic[interaction.user.id].money += Number.parseInt(database.dataMarket.prices.jewel)
                    database.dataBackpacks[interaction.user.id].jewel -= 1

                    interaction.update(CommandMarket(database, database.dataMarket, interaction.user, privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'MoneyToJewel') {
                if (money >= Number.parseInt(database.dataMarket.prices.jewel)) {
                    database.dataBasic[interaction.user.id].money -= Number.parseInt(database.dataMarket.prices.jewel)
                    database.dataBackpacks[interaction.user.id].jewel += 1

                    interaction.update(CommandMarket(database, database.dataMarket, interaction.user, privateCommand))
                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (buyItem == 'Close') {
                interaction.message.delete()
            }
            return
        }

        if (interaction.component.customId === 'mailFolderMain') {
            const message = mailManager.GetMailMessage(interaction.user, 0)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailFolderInbox') {
            const message = mailManager.GetMailMessage(interaction.user, 1)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailFolderOutbox') {
            const message = mailManager.GetMailMessage(interaction.user, 2)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailWrite') {

            mailManager.currentlyWritingEmails.push(
                new CurrentlyWritingMail(
                    interaction.user,
                    new Mail(
                        -1,
                        new MailUser(interaction.user.username, interaction.user.id),
                        new MailUser(interaction.user.username, interaction.user.id),
                        'Cím',
                        'Üzenet'
                    ),
                    interaction.message
                ))

            const message = mailManager.GetMailMessage(interaction.user, 3)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailWriteAbort') {
            const message = mailManager.GetMailMessage(interaction.user)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
            mailManager.currentlyWritingEmails.splice(mailManager.GetCurrentlyEditingMailIndex(interaction.user.id), 1)
        } else if (interaction.component.customId === 'mailWriteSend') {
            const editingMail = mailManager.currentlyWritingEmails[mailManager.GetCurrentlyEditingMailIndex(interaction.user.id)]
            let newMail = editingMail.mail
            newMail.date = Date.now()
            newMail.sender = new MailUser(editingMail.user.username, editingMail.user.id)
            newMail.id = mailManager.GenerateMailID()
            const sended = mailManager.sendMailOM(newMail)

            if (sended === true) {
                editingMail.message.channel.send('\\✔️ **A levél elküldve neki: ' + editingMail.mail.reciver.name + '**')

                const message = mailManager.GetMailMessage(interaction.user)
                interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
                mailManager.currentlyWritingEmails.splice(mailManager.GetCurrentlyEditingMailIndex(interaction.user.id), 1)
            } else {
                editingMail.message.channel.send('\\❌ **A levelet nem sikerült elküldeni**')
            }
        }

        
        if (interaction.customId == 'hangmanStart') {
            if (hangmanManager.GetUserSettingsIndex(interaction.user.id) == null) {
                interaction.reply({ content: '> **\\❌ Hiba: A beállításaid nem találhatók!**', ephemeral: true})
                return
            }

            const settings = hangmanManager.userSettings[hangmanManager.GetUserSettingsIndex(interaction.user.id)]
            
            var rawWordList = ''
            if (settings.language == 'EN') {
                rawWordList = fs.readFileSync('./word-list/english.txt', 'utf-8')
            } else if (settings.language == 'HU') {
                rawWordList = fs.readFileSync('./word-list/hungarian.txt', 'utf-8')
            } else {
                interaction.reply({ content: '> **\\❌ Hiba: Ismeretlen nyelv "' + settings.language + '"!**', ephemeral: true})
                return
            }
            var wordList = ['']
            if (settings.language == 'EN') {
                wordList = rawWordList.split('\n')
            } else if (settings.language == 'HU') {
                const wordListHU = rawWordList.split('\n')
                for (let i = 0; i < wordListHU.length; i++) {
                    const item = wordListHU[i]
                    wordList.push(item.split(' ')[0])
                }
            }

            const randomIndex = Math.floor(Math.random() * wordList.length)
            const randomWord = wordList[randomIndex]

            if (hangmanManager.GetPlayerIndex(interaction.user.id) == null) {
                hangmanManager.players.push({ userId: interaction.user.id, word: randomWord, guessedLetters: [] })
            } else {
                hangmanManager.players[hangmanManager.GetPlayerIndex(interaction.user.id)] = { userId: interaction.user.id, word: randomWord, guessedLetters: [] }
            }

            CommandHangman(interaction, hangmanManager, false)

            return
        }
    } else if (interaction.isSelectMenu()) {
        if (interaction.customId.startsWith('shopMenu')) {
            interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, interaction.values[0], '', privateCommand))
            return
        }

        if (interaction.customId == 'shopBackpackColors') {
            const selectedIndex = interaction.values[0]
            const money = database.dataBasic[interaction.user.id].money

            if (selectedIndex == 0) {
                if (money >= 3299) {
                    database.dataBasic[interaction.user.id].money -= 3299
                    database.dataBasic[interaction.user.id].color = '#fffff9'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 1) {
                if (money >= 99) {
                    database.dataBasic[interaction.user.id].money -= 99
                    database.dataBasic[interaction.user.id].color = '#000000'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 2) {
                if (money >= 2999) {
                    database.dataBasic[interaction.user.id].money -= 2999
                    database.dataBasic[interaction.user.id].color = 'brown'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 3) {
                if (money >= 1499) {
                    database.dataBasic[interaction.user.id].money -= 1499
                    database.dataBasic[interaction.user.id].color = 'red'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 4) {
                if (money >= 2499) {
                    database.dataBasic[interaction.user.id].money -= 2499
                    database.dataBasic[interaction.user.id].color = 'orange'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 5) {
                if (money >= 1499) {
                    database.dataBasic[interaction.user.id].money -= 1499
                    database.dataBasic[interaction.user.id].color = 'yellow'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 6) {
                if (money >= 2499) {
                    database.dataBasic[interaction.user.id].money -= 2499
                    database.dataBasic[interaction.user.id].color = 'green'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 7) {
                if (money >= 1499) {
                    database.dataBasic[interaction.user.id].money -= 1499
                    database.dataBasic[interaction.user.id].color = 'blue'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 8) {
                if (money >= 2499) {
                    database.dataBasic[interaction.user.id].money -= 2499
                    database.dataBasic[interaction.user.id].color = 'purple'

                    database.SaveDatabase()
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            }
            interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 4, '', privateCommand))

            return
        }

        if (interaction.customId == 'shopNameColors') {
            const { ColorRoles } = require('./functions/enums.js')

            const selectedIndex = interaction.values[0]
            const money = database.dataBasic[interaction.user.id].money

            var newColorRoleId = ''

            if (selectedIndex == 0) {
                if (money >= 9) {
                    database.dataBasic[interaction.user.id].money -= 9
                    removeAllColorRoles(interaction.member, '')
                    newColorRoleId = '0'
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 1) {
                if (money >= 2999) {
                    removeAllColorRoles(interaction.member, ColorRoles.red)
                    try {
                        interaction.member.roles.add(interaction.member.guild.roles.cache.get(ColorRoles.red))
                        database.dataBasic[interaction.user.id].money -= 2999
                        newColorRoleId = ColorRoles.red
                    } catch (error) { }
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 2) {
                if (money >= 3499) {
                    removeAllColorRoles(interaction.member, ColorRoles.orange)
                    try {
                        interaction.member.roles.add(interaction.member.guild.roles.cache.get(ColorRoles.orange))
                        database.dataBasic[interaction.user.id].money -= 3499
                        newColorRoleId = ColorRoles.orange
                    } catch (error) { }
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 3) {
                if (money >= 2999) {
                    removeAllColorRoles(interaction.member, ColorRoles.yellow)
                    try {
                        interaction.member.roles.add(interaction.member.guild.roles.cache.get(ColorRoles.yellow))
                        database.dataBasic[interaction.user.id].money -= 2999
                        newColorRoleId = ColorRoles.yellow
                    } catch (error) { }
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 4) {
                if (money >= 3499) {
                    removeAllColorRoles(interaction.member, ColorRoles.green)
                    try {
                        interaction.member.roles.add(interaction.member.guild.roles.cache.get(ColorRoles.green))
                        database.dataBasic[interaction.user.id].money -= 3499
                        newColorRoleId = ColorRoles.green
                    } catch (error) { }
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 5) {
                if (money >= 2999) {
                    removeAllColorRoles(interaction.member, ColorRoles.blue)
                    try {
                        interaction.member.roles.add(interaction.member.guild.roles.cache.get(ColorRoles.blue))
                        database.dataBasic[interaction.user.id].money -= 2999
                        newColorRoleId = ColorRoles.blue
                    } catch (error) { }
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 6) {
                if (money >= 3499) {
                    removeAllColorRoles(interaction.member, ColorRoles.purple)
                    try {
                        interaction.member.roles.add(interaction.member.guild.roles.cache.get(ColorRoles.purple))
                        database.dataBasic[interaction.user.id].money -= 3499
                        newColorRoleId = ColorRoles.purple
                    } catch (error) { }
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            } else if (selectedIndex == 7) {
                if (money >= 3999) {
                    removeAllColorRoles(interaction.member, ColorRoles.invisible)
                    try {
                        interaction.member.roles.add(interaction.member.guild.roles.cache.get(ColorRoles.invisible))
                        database.dataBasic[interaction.user.id].money -= 3999
                        newColorRoleId = ColorRoles.invisible
                    } catch (error) { }
                } else {
                    interaction.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
                }
            }

            interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 5, newColorRoleId, privateCommand))
            return
        }

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
                napiIdojaras: '978665941753806888'
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
                interaction.channel.send({ content: '> \\❌ **Error: ' + error + '**' })
            }

            return
        }

        if (interaction.customId == 'hangmanLang') {
            const languageSelected = interaction.values[0]
            
            if (hangmanManager.GetUserSettingsIndex(interaction.user.id) == null) {
                hangmanManager.userSettings.push({ userId: interaction.user.id, difficulty: 'HARD', language: languageSelected })
            } else {
                hangmanManager.userSettings[hangmanManager.GetUserSettingsIndex(interaction.user.id)].language = languageSelected
            }

            CommandHangman(interaction, hangmanManager, false)

            return
        }
        if (interaction.customId == 'hangmanDifficulty') {
            const difficultySelected = interaction.values[0]
            
            if (hangmanManager.GetUserSettingsIndex(interaction.user.id) == null) {
                hangmanManager.userSettings.push({ userId: interaction.user.id, difficulty: difficultySelected, language: 'HU' })
            } else {
                hangmanManager.userSettings[hangmanManager.GetUserSettingsIndex(interaction.user.id)].difficulty = difficultySelected
            }
            
            CommandHangman(interaction, hangmanManager, false)

            return
        }
        
    } else if (interaction.isModalSubmit()) {
        /** @type {Discord.ModalSubmitInteraction<Discord.CacheType>} */
        const modalInteraction = interaction
        
    }
})
bot.on('clickMenu', async (button) => {
    try {
        if (button.clicker.user.username === button.message.embeds[0].author.name) { } else {
            button.reply.send('> \\❗ **Ez nem a tied!**', true)
            return
        }
    } catch (error) { }

    let isOnPhone = false
    let isInDebugMode = false
    let playerIndex = 0

    try {

        if (getGameUserSettings(button.clicker.user.id, game) !== null) {
            isOnPhone = getGameUserSettings(button.clicker.user.id, game).isOnPhone
        }

        if (getGameUserSettings(button.clicker.user.id, game) !== null) {
            isInDebugMode = getGameUserSettings(button.clicker.user.id, game).isInDebugMode
        }
    } catch (error) { }

    try {
        playerIndex = getPlayerIndex(button.clicker.user.id)
    } catch (error) { }

    if (button.id.startsWith('pollOption')) {
        const optionIndex = button.id.replace('pollOption', '')
        try {
            /**
             * @type {string[]}
             */
            const usersAreVoted = database.dataPolls.messages[button.message.id].userIds
            if (usersAreVoted.includes(button.clicker.user.id)) {
                if (button.reply.has) {
                    button.reply.send('> \\❗ **Te már választottál egy opciót**', true)
                } else {
                    button.clicker.user.send('> \\❗ **Te már választottál egy opciót**')
                }
            } else {
                database.dataPolls.messages[button.message.id].optionValues[optionIndex] += 1
                database.dataPolls.messages[button.message.id].userIds.push(button.clicker.user.id)
                database.SaveDatabase()
            }
        } catch (error) {
            button.message.channel.send('> \\❌ **Hiba: ' + error.message + '**')
        }
        button.reply.defer()
    } else if (button.id === 'pollFinish') {
        try {
            const savedMessageInfo = database.dataPolls.messages[button.message.id]
            const title = savedMessageInfo.title
            const texts = savedMessageInfo.optionTexts
            const icons = savedMessageInfo.optionIcons
            /**
             * @type {number[]}
             */
            const values = savedMessageInfo.optionValues

            let optionAllValue = 0
            let optionMaxValue = 0
            let optionMaxValueIndex = 0
            for (let i = 0; i < values.length; i++) {
                const value = values[i]
                optionAllValue += value
                if (optionMaxValue < value) {
                    optionMaxValue = value
                    optionMaxValueIndex = i
                }
            }

            let optionText = ''
            for (let i = 0; i < texts.length; i++) {
                const optionPercent = (values[i] / optionAllValue) * 8
                let bar = ''
                if (i === optionMaxValueIndex) {
                    for (let v = 0; v < 8; v++) {
                        if (optionPercent > v) {
                            bar += '🟦'
                        } else {
                            bar += '⬛'
                        }
                    }
                } else {
                    for (let v = 0; v < 8; v++) {
                        if (optionPercent > v) {
                            bar += '⬜'
                        } else {
                            bar += '⬛'
                        }
                    }
                }

                optionText += '> ' + icons[i] + ' ' + texts[i] + '\n>    ' + bar + '  ||' + ((values[i] / optionAllValue) * 100) + '%||\n'
            }

            button.reply.defer().then(() => {
                button.message.edit(`**${title}**\n${optionText}`, { components: [] })
            })

        } catch (error) { }
    }

    button.reply.defer()
})

bot.once('ready', async () => {
    SystemLog('Bot is ready')
    statesManager.botLoadingState = 'Ready'

    const { Taxation } = require('./functions/tax')
    const { MarketOnStart } = require('./functions/market')
    const { TrySendWeatherReport } = require('./functions/dailyWeatherReport')
    const { activitiesDesktop } = require('./functions/enums.js')

    const lastDay = database.dataBot.day

    try {
        const { CreateCommands, DeleteCommands } = require('./functions/commands')
        // DeleteCommands(bot)
        // CreateCommands(bot, statesManager)
    } catch (error) {
        console.error(error)
    }

    setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesDesktop.length - 1))
        bot.user.setActivity(activitiesDesktop[index])
    }, 10000)

    TrySendWeatherReport(statesManager, bot, ChannelId.ProcessedNews)

    MarketOnStart(database)

    Taxation(database, lastDay)

    savePollDefaults(database)

    database.SaveDatabase()
    
    await newsManager.OnStart(bot, true)

    setInterval(() => {
        newsManager.TryProcessNext(bot)
    }, 2000)

    try {
        /** @type {string[]} */
        const channelsWithSettings = JSON.parse(fs.readFileSync('./settings.json')).channelSettings.channelsWithSettings
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
    const message = await msg.fetch()

    const thisIsPrivateMessage = (message.channel.type === Discord.ChannelType.DM)

    if (message.author.bot == true && thisIsPrivateMessage == false) { return }
    const sender = message.author

    console.log(sender.id)
    console.log(message.content)

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
        CommandRedditsave(message)
    }

    await newsManager.TryProcessMessage(message)

    if (thisIsPrivateMessage) {
        database.SaveUserToMemoryAll(sender, sender.username)
    } else {
        database.SaveUserToMemoryAll(sender, message.member.displayName.toString())
    }

    if (message.content.length > 2) {
        if (thisIsPrivateMessage === false) {
            addXp(sender, message.channel, calculateAddXp(message).total)
        }
    }

    if (message.content.startsWith(perfix)) {
        processCommand(message, thisIsPrivateMessage, sender, message.content.substring(1).trim())
        return
    }

    if (listOfHelpRequiestUsers.includes(message.author.id) === true) {
        if (message.content.toLowerCase().includes('igen')) {
            message.reply('Használd a `.help` parancsot!')
        } else if (message.content.toLowerCase().includes('nem')) {
            message.reply('...')
        }
        delete listOfHelpRequiestUsers[listOfHelpRequiestUsers.indexOf(message.author.id)]
    } else {
        if (message.content.includes('<@!738030244367433770>')) {
            message.reply('Segítség kell?')
            listOfHelpRequiestUsers.push(message.author.id)
        }
    }
})

/**
 * @param {Discord.Message} message
 * @param {boolean} thisIsPrivateMessage
 * @param {Discord.User} sender
 * @param {string} command
 */
async function processCommand(message, thisIsPrivateMessage, sender, command) {
    
    //#region Enabled in dm

    if (command === `pms`) {
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
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6], message.attachments.first())
        } else {
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6])
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
        quizDone(command.replace(`quizdone `, '').split(' ')[0], command.replace(`quizdone `, '').split(' ')[1])
        database.UserstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`poll simple\n`)) {
        const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], false)
        database.UserstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`poll wyr\n`)) {
        const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], true)
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

    if (command.commandName === `wordle`) {
        command.deferReply({ ephemeral: privateCommand }).then(() => {
            CrossoutTest(command, command.options.getString('search'), privateCommand)
        })
        return
    }

    if (command.commandName == `gift`) {
        database.UserstatsSendCommand(command.user)
        try {
            var giftableMember = command.options.getUser('user')
            if (database.dataBackpacks[command.user.id].gifts > 0) {
                if (giftableMember.id === command.user.id) {
                    command.reply({ content: '> **\\❌ Nem ajándékozhatod meg magad**', ephemeral: true })
                } else {
                    if (database.dataBackpacks[giftableMember.id] != undefined && giftableMember.id != selfId) {
                        database.dataBackpacks[giftableMember.id].getGift += 1
                        database.dataBackpacks[command.user.id].gifts -= 1
                        command.reply({ content: '> \\✔️ **' + giftableMember.username.toString() + '** megajándékozva', ephemeral: true })
                        giftableMember.send('> **\\✨ ' + command.user.username + ' megajándékozott! \\🎆**')
                        database.SaveDatabase()
                    } else {
                        command.reply({ content: '> **\\❌ Úgy néz ki hogy nincs ' + giftableMember.displayName + ' nevű felhasználó az adatbázisban**', ephemeral: true })
                    }
                }
            } else {
                if (giftableMember.id === command.user.id) {
                    command.reply({ content: '> **\\❌ Nem ajándékozhatod meg magad. Sőt! Nincs is ajándékod**', ephemeral: true })
                } else {
                    command.reply({ content: '> **\\❌ Nincs ajándékod, amit odaadhatnál**', ephemeral: true })
                }
            }
        } catch (error) {
            command.reply({ content: '> **\\❌ ' + error.toString() + '**', ephemeral: true })
        }

        return
    }

    if (command.commandName === `tesco`) {
        const CommandTesco = require('./commands/tesco')
        CommandTesco(command)
        return
    }

    if (command.commandName === `crossout`) {
        command.deferReply({ ephemeral: privateCommand }).then(() => {
            CrossoutTest(command, command.options.getString('search'), privateCommand)
        })
        return
    }

    if (command.commandName === `market` || command.commandName === `piac`) {
        command.reply(CommandMarket(database, database.dataMarket, command.user, privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `xp` || command.commandName === `score`) {
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
        command.reply({ embeds: [CommandHelp(isDm)], ephemeral: privateCommand })
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `crate`) {
        command.reply(commandAllCrate(command.member, command.options.getInteger("darab"), privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `heti`) {
        command.reply(commandAllNapi(command.member, command.options.getInteger("darab"), privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `napi`) {
        command.reply(commandAllNapi(command.member, command.options.getInteger("darab"), privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `profil` || command.commandName === `profile`) {
        CommandProfil(database, command, privateCommand)
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `backpack`) {
        command.reply(commandStore(command.user, privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `bolt` || command.commandName === `shop`) {
        command.reply(CommandShop(command.channel, command.user, command.member, database, 0, '', privateCommand))
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `quiz`) {
        await command.deferReply()
        bot.channels.fetch(ChannelId.Quiz)
            .then(async () => {
                try {
                    quiz(command.options.getString("title"), command.options.getString("options"), command.options.getString("option_emojis"), command.options.getInteger("add_xp"), command.options.getInteger("remove_xp"), command.options.getInteger("add_token"), command.options.getInteger("remove_token"))
                        .then(() => {
                            command.editReply({ content: '> \\✔️ **Kész**', ephemeral: true })
                        })
                        .catch((error) => {
                            command.editReply({ content: '> \\❌ **Hiba: ' + error.toString() + '**', ephemeral: true })
                        })
                } catch (error) {
                    command.editReply({ content: '> \\❌ **Hiba: ' + error.toString() + '**', ephemeral: true })
                }
            })
            .catch((error) => {
                command.editReply({ content: '> \\❌ **Hiba: ' + error.toString() + '**', ephemeral: true })
            })
        database.UserstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `font`) {
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

function StartBot() {
    SystemLog('Start bot...')
    bot.login(tokens.discord)
        .then((token) => {
            SystemLog('Logged in')
        })
        .catch((error) => {
            SystemLog('Error: ' + error.message)
            LogError(error)
        })
}

function StopBot() {
    bot.destroy()
    SystemLog('Destroyed')
    botStopped = true
}

const endDateTime = new Date(Date.now())
const ellapsedMilliseconds = endDateTime - startDateTime
SystemLog('Scripts loaded in ' + ellapsedMilliseconds + 'ms')

if (autoStartBot) {
    StartBot()
}
