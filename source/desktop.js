
var startedInvisible = false
var startedByUser = false
process.argv.forEach(function (val, index, array) {
    if (val == 'invisible') {
        startedInvisible = true
    } else if (val == 'user') {
        startedByUser = true
    }
})

/** @param {Error} err */
function FormatError(err) {
    var str = ""
    str += err.name + ': ' + err.message
    if (err.stack != undefined) {
        str += '\n' + err.stack
    }
    return str
}

process.on('uncaughtException', function (err) {
    fs.appendFileSync('./node.error.log', 'CRASH\n', { encoding: 'utf-8' })
    fs.appendFileSync('./node.error.log', FormatError(err) + '\n', { encoding: 'utf-8' })
})

var autoStartBot = true

const { SystemLog, SystemStart, SystemStop } = require('./functions/systemLog')

SystemStart(startedInvisible, startedByUser)

const startDateTime = new Date(Date.now())

const { LogManager } = require('./functions/log.js')
var logManager = new LogManager(false, null, null)

logManager.Loading('Loading packet', "fs")
const fs = require('fs')

process.__defineGetter__('stderr', function() { return fs.createWriteStream('C:/Users/bazsi/Documents/GitHub/DiscordBot/source/node.error.log', {flags:'a'}) })

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
        // console.error('s.length:', s.length)
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
    require('tty').setRawMode(true)
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

logManager.Loading("Loading commands", 'weather')
const CommandWeather = require('./commands/weather')
const CommandDailyWeatherReport = require('./commands/dailyWeatherReport')
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

logManager.Loading("Loading extensions", 'commands')
const { CreateCommands, DeleteCommands } = require('./functions/commands')
logManager.Loading("Loading extensions", 'translator')
const { TranslateMessage } = require('./functions/translator.js')
logManager.Loading("Loading extensions", 'statesManager')
const { StatesManager } = require('./functions/statesManager.js')
logManager.Loading("Loading extensions", 'DatabaseManager')
const { DatabaseManager } = require('./functions/databaseManager.js')

logManager.Loading('Loading packet', "ytdl-core")
const ytdl = require('ytdl-core')

const { musicGetLengthText } = require('./commands/music/functions')

logManager.Loading('Loading', "WS")
const { WebSocket } = require('./ws/ws')
const { GetHash, GetID, AddNewUser } = require('./functions/userHashManager')

logManager.Loading('Loading packet', "discord.js")
const Discord = require('discord.js')
const { MessageActionRow, MessageButton, GatewayIntentBits } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const { perfix, tokens } = require('./config.json')

logManager.Loading('Loading packet', "other functions")
const GetUserColor = require('./functions/userColor')
const { abbrev } = require('./functions/abbrev')
const { DateToString } = require('./functions/dateToString')
const { NewsMessage, CreateNews } = require('./functions/news')
const {
    INFO,
    ERROR,
    WARNING,
    SHARD,
    DEBUG,
    DONE,
    Color,
    ColorRoles,
    activitiesDesktop,
    usersWithTax,
    ChannelId,
    CliColor
} = require('./functions/enums.js')
const { CommandHangman, HangmanManager } = require('./commands/hangman.js')

logManager.BlankScreen()

const selfId = '738030244367433770'

/** @type {string[]} */
let listOfHelpRequiestUsers = []

const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"] })
logManager.Destroy()

const statesManager = new StatesManager()
logManager = new LogManager(false, bot, statesManager)

statesManager.botLoaded = true

/** @param {string} message */
function log(message = '', translateResult = null) {
    logManager.Log(message, false, translateResult)
}

logManager.Loading('Loading database', 'Manager')
const database = new DatabaseManager('./database/', './database-copy/', statesManager)
logManager.Loading('Loading database', 'datas')
const databaseIsSuccesfullyLoaded = database.LoadDatabase()

if (!databaseIsSuccesfullyLoaded) {
    SystemLog('Error: Database is not found')
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

const ws = new WebSocket('1234', '192.168.1.100', 5665, bot, logManager, database, StartBot, StopBot, statesManager, 'DESKTOP')
logManager.BlankScreen()

const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

const hangmanManager = new HangmanManager()

/**@type {string[]} */
let musicArray = []
let musicFinished = true

let lastNoNews = false

const game = new Game()

/** @type {CurrentlyWritingMail[]} */
let currentlyWritingEmails = []

//#endregion

/** @type {NewsMessage[]} */
const listOfNews = []


//#region Functions 

/**
* @param {Discord.User} user
* @param {Discord.TextChannel} channel
* @param {number} ammount
 */
function addXp(user, channel, ammount) {

    oldScore = database.dataBasic[user.id].score
    database.dataBasic[user.id].score += ammount
    const newScore = database.dataBasic[user.id].score

    log(DEBUG + ': Add XP: ' + ammount)

    if (oldScore < 1000 && newScore > 999 || oldScore < 5000 && newScore > 4999 || oldScore < 10000 && newScore > 9999 || oldScore < 50000 && newScore > 49999 || oldScore < 100000 && newScore > 99999) {

        log(DEBUG + ': New level')
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
        const embed = new Discord.MessageEmbed()
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
    log(INFO + ': Újracsatlakozás...')
    statesManager.botLoadingState = 'Reconnecting'
    SystemLog('Reconnecting')
})

bot.on('disconnect', () => {
    log(ERROR + ': Megszakadt a kapcsolat!')
    statesManager.botLoadingState = 'Disconnect'
    SystemLog('Disconnect')
})

bot.on('resume', () => {
    log(INFO + ': Folytatás')
    statesManager.botLoadingState = 'Resume'
    SystemLog('Resume')
})

bot.on('error', error => {
    log(ERROR + ': ' + error)
    statesManager.botLoadingState = 'Error'
    SystemLog('Error: ' + error.message)
})

bot.on('debug', debug => {
    statesManager.ProcessDebugMessage(debug)
    const translatedDebug = TranslateMessage(debug)

    if (translatedDebug == null) return

    if (translatedDebug.translatedText.startsWith('Heartbeat nyugtázva')) {
        logManager.AddTimeline(2)
        SystemLog('Ping: ' + translatedDebug.translatedText.replace('Heartbeat nyugtázva: ', ''))
    }

    if (translatedDebug.secret == true) return

    log(translatedDebug.messagePrefix + ': ' + translatedDebug.translatedText, translatedDebug)
})

bot.on('warn', warn => {
    log(WARNING + ': ' + warn)
    statesManager.botLoadingState = 'Warning'
})

bot.on('shardError', (error, shardID) => {
    log(ERROR + ': shardError: ' + error)
})

bot.on('invalidated', () => {
    log(ERROR + ': Érvénytelen')
})

bot.on('shardDisconnect', (colseEvent, shardID) => {
    log(SHARD + ': Lecsatlakozva')
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Lecsatlakozva'
})

bot.on('shardReady', (shardID) => {
    const mainGuild = bot.guilds.cache.get('737954264386764812')
    const quizChannel = mainGuild.channels.cache.get('799340273431478303')
    quizChannel.messages.fetch()
    statesManager.shardCurrentlyLoading = false
})

bot.on('shardReconnecting', (shardID) => {
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Újracsatlakozás...'
})

bot.on('shardResume', (shardID, replayedEvents) => {
    log(SHARD & ': Folytatás: ' + replayedEvents.toString())
    statesManager.shardCurrentlyLoading = false
})

bot.on('raw', async event => {
    log(DEBUG & ': raw')
})

bot.on('close', () => {
    log(SHARD & ': close')
    statesManager.botLoadingState = 'Close'
    SystemLog('Close')
})

bot.on('destroyed', () => {
    log(SHARD & ': destroyed')
    statesManager.botLoadingState = 'Destroyed'
    SystemLog('Destroyed')
})

bot.on('invalidSession', () => {
    log(SHARD & ': invalidSession')
    statesManager.botLoadingState = 'Invalid Session'
})

bot.on('allReady', () => {
    log(SHARD & ': allReady')
    statesManager.botLoadingState = 'All Ready'
})

bot.on('presenceUpdate', (oldPresence, newPresence) => {
    log(DEBUG & ': newStatus: ' + newPresence.status.toString())
})

//#endregion

//#region Commands

//#region Command Functions

/**@param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand @returns {boolean} */
async function playAudio(command) {
    const link = musicArray[musicArray.length - 1]

    musicFinished = false
    musicArray.shift()

    const stream = ytdl(link, { filter: 'audioonly' })
    const player = createAudioPlayer()

    /** @type {Discord.VoiceChannel} */
    const voiceChannel = command.member.voice.channel
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    })

    let resource = createAudioResource(stream)

    connection.subscribe(player)
    
    player.play(resource)

    const info = await ytdl.getInfo(link)

    /*const dispatcher = connection.play(stream)
        .on("finish", () => {
            musicFinished = true
            if (musicArray.length > 0) {
                playAudio(command)
            }
        })
        .on("error", (error) => { log(ERROR + ': ' + error, 24) })
        .on("start", () => { statesManager.ytdlCurrentlyPlaying = true; log('') })
        .on("debug", (message) => { log(DEBUG + ': ytdl: ' + message) })
        .on("close", () => { statesManager.ytdlCurrentlyPlaying = false; log('') })
    */

    const embed = new Discord.MessageEmbed()
        .setColor(Color.Purple)
        .setURL(info.videoDetails.video_url)
        .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
        .setTitle(info.videoDetails.title)
        .setThumbnail(info.videoDetails.thumbnails[0].url)
        .addField('Csatorna', info.videoDetails.author.name, true)
        .addField('Hossz', musicGetLengthText(info.videoDetails.lengthSeconds), true)
    if (command.replied == true) {
        command.editReply({ content: '> **\\✔️ Most hallható: \\🎧**', embeds: [embed] })
    } else {
        command.reply({ content: '> **\\✔️ Most hallható: \\🎧**', embeds: [embed] })
    }
    statesManager.ytdlCurrentlyPlayingText = info.videoDetails.title
    statesManager.ytdlCurrentlyPlayingUrl = link
    return true
}

function userstatsSendMeme(user) {
    database.dataUserstats[user.id].memes += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}
function userstatsSendMusic(user) {
    database.dataUserstats[user.id].musics += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}
function userstatsSendYoutube(user) {
    database.dataUserstats[user.id].youtubevideos += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}
function userstatsSendMessage(user) {
    database.dataUserstats[user.id].messages += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}
function userstatsSendChars(user, text) {
    database.dataUserstats[user.id].chars += text.length
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}
function userstatsSendCommand(user) {
    database.dataUserstats[user.id].commands += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}
function userstatsAddUserToMemory(user) {
    if (!database.dataUserstats[user.id]) {
        database.dataUserstats[user.id] = {}
    }
    if (!database.dataUserstats[user.id].name) {
        database.dataUserstats[user.id].name = user.username
    }
    if (!database.dataUserstats[user.id].memes) {
        database.dataUserstats[user.id].memes = 0
    }
    if (!database.dataUserstats[user.id].musics) {
        database.dataUserstats[user.id].musics = 0
    }
    if (!database.dataUserstats[user.id].youtubevideos) {
        database.dataUserstats[user.id].youtubevideos = 0
    }
    if (!database.dataUserstats[user.id].messages) {
        database.dataUserstats[user.id].messages = 0
    }
    if (!database.dataUserstats[user.id].chars) {
        database.dataUserstats[user.id].chars = 0
    }
    if (!database.dataUserstats[user.id].commands) {
        database.dataUserstats[user.id].commands = 0
    }
    fs.writeFile('./database/userstats.json', JSON.stringify(database.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

/**
 * @param {number} userId
 * @returns {String} The result string
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

    const embed = new Discord.MessageEmbed()
        .setAuthor({ name: sender.username, iconURL: sender.avatarURL() })
        .setTitle('Hátizsák')
        .addField('Pénz', '\\💵 ' + abbrev(money), false)
        .addField('Alap cuccok',
            '> \\🧱 ' + crates + ' láda\n' +
            '> \\🎁 ' + gifts + ' ajándék\n' +
            '> \\🎟️ ' + tickets + ' kupon\n' +
            '> \\🎫 ' + quizTokens + ' Quiz Token\n' +
            '> \\🧰 ' + Math.floor(dayCrates) + ' heti láda'
            , false)
        .addField('Sorsjegyek', '> \\💶 ' + smallLuckyCard + ' Black Jack\n> \\💷 ' + mediumLuckyCard + ' Buksza\n> \\💴 ' + largeLuckyCard + ' Fáraók Kincse', false)
        .setFooter({ text: 'Ha használni szeretnéd az egyik cuccodat, kattints az ikonjára!' })
        .setColor(GetUserColor(database.dataBasic[sender.id].color))
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/briefcase_1f4bc.png')
    if (getGifts > 0) {
        if (getGifts == 1) {
            embed.addField('Van egy ajándékod, ami kicsomagolásra vár', 'Kattints a \\🎀-ra a kicsomagoláshoz!')
        } else {
            embed.addField('Van ' + getGifts + ' ajándékod, ami kicsomagolásra vár', 'Kattints a \\🎀-ra a kicsomagoláshoz!')
        }
    }
    const buttonCrate = new MessageButton()
        .setLabel("🧱")
        .setCustomId("openCrate")
        .setStyle("PRIMARY")
    const buttonDayCrate = new MessageButton()
        .setLabel("🧰")
        .setCustomId("openDayCrate")
        .setStyle("PRIMARY")
    const buttonLuckyCardSmall = new MessageButton()
        .setLabel("💶")
        .setCustomId("useLuckyCardSmall")
        .setStyle("SECONDARY")
    const buttonLuckyCardMedium = new MessageButton()
        .setLabel("💷")
        .setCustomId("useLuckyCardMedium")
        .setStyle("SECONDARY")
    const buttonLuckyCardLarge = new MessageButton()
        .setLabel("💴")
        .setCustomId("useLuckyCardLarge")
        .setStyle("SECONDARY")
    const buttonOpenGift = new MessageButton()
        .setLabel("🎀")
        .setCustomId("openGift")
        .setStyle("PRIMARY")
    const buttonSendGift = new MessageButton()
        .setLabel("🎁")
        .setCustomId("sendGift")
        .setStyle("SECONDARY")
    if (!crates > 0) { buttonCrate.setDisabled(true) }
    if (!(Math.floor(dayCrates)) > 0) { buttonDayCrate.setDisabled(true) }
    if (!smallLuckyCard > 0) { buttonLuckyCardSmall.setDisabled(true) }
    if (!mediumLuckyCard > 0) { buttonLuckyCardMedium.setDisabled(true) }
    if (!largeLuckyCard > 0) { buttonLuckyCardLarge.setDisabled(true) }
    if (!getGifts > 0) { buttonOpenGift.setDisabled(true) }
    if (!gifts > 0) { buttonSendGift.setDisabled(true) }
    const rowPrimary = new MessageActionRow()
        .addComponents(buttonCrate, buttonDayCrate, buttonLuckyCardSmall, buttonLuckyCardMedium, buttonLuckyCardLarge)
    const rowSecondary = new MessageActionRow()
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

/**@param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand @param {string} link */
async function commandMusic(command, link) {
    if (command.member.voice.channel) {
        if (link.startsWith('https://www.youtube.com/watch?v=')) {
            musicArray.unshift(link)
            await command.reply({ content: '> **\\➕ Hozzáadva a lejátszólistába! \\🎧**' })
            if (musicFinished) {
                playAudio(command)
            }
        } else {
            command.reply({ content: '> **\\❌ Érvénytelen URL! \\🎧**' })
        }
    } else {
        command.reply({ content: '> **\\❗  Előbb jépj be egy hangcsatornába! \\🎧**' })
    }
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
async function commandMusicList(command) {
    if (musicArray.length === 0 && statesManager.ytdlCurrentlyPlaying === false) {
        command.reply({ content: '> **\\➖ A lejátszólista üres \\🎧**' })
    } else {
        const embed = new Discord.MessageEmbed()
            .setAuthor({ name: command.member.displayName, iconURL: command.member.avatarURL() })
        embed.setColor(Color.Purple)
        await ytdl.getBasicInfo(statesManager.ytdlCurrentlyPlayingUrl).then(info => {
            embed.addField('\\🎧 Most hallható: ' + info.videoDetails.title, '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), false)
        })
        musicArray.forEach(async (_link) => {
            await ytdl.getBasicInfo(_link).then(info => {
                embed.addField(info.videoDetails.title, '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), false)
            })
        })
        command.reply({ content: '> **\\🔜 Lejátszólista: [' + musicArray.length + ']\\🎧**', embeds: [embed] })
    }
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
function commandSkip(command) {
    if (command.member.voice.channel) {
        musicFinished = true
        if (musicArray.length === 0) {
            command.reply({ content: '> **\\❌ Nincs következő zene! \\🎧**' })
            return
        }
        playAudio(command)
        command.reply({ content: '> **\\▶️ Zene átugorva! \\🎧**' })
    } else {
        command.reply({ content: '> **\\❗  Előbb jépj be egy hangcsatornába! \\🎧**' })
    }
}

/**@param {number} days @returns {number} */
function DaysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000
}

/**@param {Discord.MessageAttachment} image */
function quiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, image = undefined) {
    const optionEmojis = listOfOptionEmojis.toString().replace(' ', '').split(';')
    const optionTexts = listOfOptionText.toString().replace(' ', '').split(';')
    let optionText = ''
    for (let i = 0; i < optionTexts.length; i++) {
        optionText += `> ${optionEmojis[i]}  ${optionTexts[i]}\n`
    }

    const dateNow = Date.now() + DaysToMilliseconds(2)

    const embed = new Discord.MessageEmbed()
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

    bot.channels.cache.get(ChannelId.Quiz).send({ embeds: [embed] }).then(message => {
        message.channel.send('> <@&799342836931231775>')
        message.react('🎯')
        for (let i = 0; i < optionEmojis.length; i++) {
            if (optionEmojis[i].includes('<')) {
                message.react(optionEmojis[i].split(':')[2].replace('>', ''))
            } else {
                message.react(optionEmojis[i])
            }
        }
    })

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
    const embed = new Discord.MessageEmbed()
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
    if (interaction.isCommand()) {
        processApplicationCommand(interaction, privateCommand)
    } else if (interaction.isButton()) {
        if (interaction.component.customId.startsWith('redditsaveDeleteMain')) {
            if (interaction.component.customId.includes(interaction.user.id)) {
                interaction.channel.messages.cache.get(interaction.component.customId.split('.')[1]).delete()
                const button1 = interaction.message.components[0].components[0]
                const button2 = interaction.message.components[0].components[1]
                const row = new MessageActionRow()
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

                    log(game.gameUserSettings)
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

                    log(game.gameUserSettings)
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
            interaction.message.delete()
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
            const message = getMailMessage(interaction.user, 0)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailFolderInbox') {
            const message = getMailMessage(interaction.user, 1)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailFolderOutbox') {
            const message = getMailMessage(interaction.user, 2)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailWrite') {

            currentlyWritingEmails.push(
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

            const message = getMailMessage(interaction.user, 3)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
        } else if (interaction.component.customId === 'mailWriteAbort') {
            const message = getMailMessage(interaction.user)
            interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
            currentlyWritingEmails.splice(getCurrentlyEditingMailIndex(interaction.user.id), 1)
        } else if (interaction.component.customId === 'mailWriteSend') {
            const editingMail = currentlyWritingEmails[getCurrentlyEditingMailIndex(interaction.user.id)]
            let newMail = editingMail.mail
            newMail.date = Date.now()
            newMail.sender = new MailUser(editingMail.user.username, editingMail.user.id)
            newMail.id = generateMailId()
            const sended = sendMailOM(newMail)

            if (sended === true) {
                editingMail.message.channel.send('\\✔️ **A levél elküldve neki: ' + editingMail.mail.reciver.name + '**')

                const message = getMailMessage(interaction.user)
                interaction.update({ embeds: [message.embed], components: [message.actionRows[0]] })
                currentlyWritingEmails.splice(getCurrentlyEditingMailIndex(interaction.user.id), 1)
            } else {
                editingMail.message.channel.send('\\❌ **A levelet nem sikerült elküldeni**')
            }
        }

        
        if (interaction.customId == 'hangmanStart') {
            if (hangmanManager.GetUserSettingsIndex(interaction.user.id) == null) {
                interaction.reply('> **\\❌ Hiba: A beállításaid nem találhatók!**')
                return
            }

            const settings = hangmanManager.userSettings[hangmanManager.GetUserSettingsIndex(interaction.user.id)]
            
            var rawWordList = ''
            if (settings.language == 'EN') {
                rawWordList = fs.readFileSync('./word-list/english.txt', 'utf-8')
            } else if (settings.language == 'HU') {
                rawWordList = fs.readFileSync('./word-list/hungarian.txt', 'utf-8')
            } else {
                interaction.reply('> **\\❌ Hiba: Ismeretlen nyelv "' + settings.language + '"!**')
                return
            }
            var wordList = ['']
            if (settings.language == 'EN') {
                wordList = rawWordList.split('\n')
            } else if (settings.language == 'HU') {
                const wordListHU = rawWordList.split('\n')
                for (let i = 0; i < wordListHU.length; i++) {
                    const item = wordListHU[i];
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

    } else if (interaction.isUserContextMenu()) {
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
    } else if (interaction.isMessageContextMenu()) {
        if (interaction.commandName ==  'Xp érték') {
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

/** @returns {Promise<Discord.Message>} */
async function GetOldDailyWeatherReport(channelId) {
    /** @type {Discord.TextChannel} */
    const channel = bot.channels.cache.get(channelId)
    statesManager.dailyWeatherReportLoadingText = 'Fetch old messages...'
    await channel.messages.fetch({ limit: 10 })
    statesManager.dailyWeatherReportLoadingText = 'Loop messages...'
    for (let i = 0; i < channel.messages.cache.size; i++) {
        const element = channel.messages.cache.at(i)
        if (element.embeds.length == 1) {
            if (element.embeds[0].title == 'Napi időjárás jelentés') {
                statesManager.dailyWeatherReportLoadingText = 'Old report message found'
                return element
            }
        }
    }

    statesManager.dailyWeatherReportLoadingText = 'No messages found'
    return null
}

bot.once('ready', async () => {
    SystemLog('Bot is ready')

    statesManager.botLoadingState = 'Ready'
    try {
        //DeleteCommands(bot)
        //CreateCommands(bot, statesManager)
    } catch (error) {
        console.error(error)
    }

    setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesDesktop.length - 1))
        bot.user.setActivity(activitiesDesktop[index])
    }, 10000)

    statesManager.dailyWeatherReportLoadingText = 'Fetch channels...'
    await bot.channels.fetch(ChannelId.ProcessedNews)
    setTimeout(async () => {
        statesManager.dailyWeatherReportLoadingText = 'Search old report message...'
        const oldWeatherMessage = await GetOldDailyWeatherReport(ChannelId.ProcessedNews)
        if (oldWeatherMessage == null) {
            CommandDailyWeatherReport(bot.channels.cache.get(ChannelId.ProcessedNews), statesManager)
        } else {
            if (new Date(oldWeatherMessage.createdTimestamp).getDate() != new Date(Date.now()).getDate()) {
                statesManager.dailyWeatherReportLoadingText = 'Delete old report message...'
                await oldWeatherMessage.delete()
                CommandDailyWeatherReport(bot.channels.cache.get(ChannelId.ProcessedNews), statesManager)
            } else {
                statesManager.dailyWeatherReportLoadingText = ''
            }
        }
    }, 100)

    logManager.AddTimeline(2)

    const lastDay = database.dataBot.day
    database.dataBot.day = dayOfYear

    const marketLastDay = (database.dataMarket.day == undefined) ? dayOfYear : dayOfYear
    database.dataMarket.day = dayOfYear

    if (database.dataMarket.prices == undefined || dayOfYear - marketLastDay >= 3) { database.dataMarket.prices = { 'token': (Math.floor(Math.random() * 1000) + 5000), 'coupon': (Math.floor(Math.random() * 1000) + 4000), 'jewel': (Math.floor(Math.random() * 100) + 11000) } }

    log(DONE + ': A BOT kész!')

    for (let i = 0; i < dayOfYear - lastDay; i++) {
        for (let i = 0; i < usersWithTax.length; i++) {
            const element = usersWithTax[i]
            try {
                const userMoney = database.dataBasic[element].money
                const finalTax = Math.floor(userMoney * 0.001) * 2
                const userMoneyFinal = userMoney - finalTax
                log("Adó:  " + userMoney + " ---1%-->" + finalTax + " ------->" + userMoneyFinal)
                database.dataBasic[element].money = userMoneyFinal
            } catch (error) {
                log(ERROR + ': Adó hiba (id: ' + element + '): ' + error)
            }
        }
        log("Mindenki megadózva")
    }
    savePollDefaults(database)
    database.SaveDatabase()

    statesManager.newsLoadingText = 'Fetch news...'
    const channel = bot.channels.cache.get(ChannelId.IncomingNews)
    channel.messages.fetch({ limit: 10 }).then(async (messages) => {
        /** @type {[Discord.Message]} */
        const listOfMessage = []

        statesManager.newsLoadingText = 'Looping messages...'
        messages.forEach((message) => {
            listOfMessage.push(message)
        })

        statesManager.newsLoadingText = 'Processing messages...'
        listOfMessage.reverse()
        listOfMessage.forEach(message => {
            processNewsMessage(message)
        })
        if (listOfMessage.length > 0) {
            log(`Received ${listOfMessage.length} news`)
        } else {
            log(`No news recived`)
        }
    })

    setInterval(() => {
        if (listOfNews.length > 0) {
            const newsMessage = listOfNews.shift()
            /** @type {Discord.TextChannel} */
            const newsChannel = bot.channels.cache.get(ChannelId.ProcessedNews)
            const embed = newsMessage.embed
            statesManager.newsLoadingText2 = 'Send new message...'

            /** @type {Discord.TextChannel | undefined} */
            const newsTestChannel = bot.channels.cache.get('1010110583800078397')
            if (newsTestChannel != undefined) {
                newsTestChannel.send({
                    tts: newsMessage.message.tts,
                    nonce: newsMessage.message.nonce,
                    content: newsMessage.message.content,
                    embeds: newsMessage.message.embeds,
                    components: newsMessage.message.components
                }).finally(() => {
                    if (newsMessage.NotifyRoleId.length == 0) {
                        newsChannel.send({ embeds: [embed] })
                            .then(() => {
                                statesManager.newsLoadingText2 = 'Delete raw message...'
                                newsMessage.message.delete().then(() => {
                                    statesManager.newsLoadingText2 = ''
                                })
                            })
                    } else {
                        newsChannel.send({ content: `<@&${newsMessage.NotifyRoleId}>`, embeds: [embed] })
                            .then(() => {
                                statesManager.newsLoadingText2 = 'Delete raw message...'
                                newsMessage.message.delete().then(() => {
                                    statesManager.newsLoadingText2 = ''
                                })
                            })
                    }
                })
            }
            lastNoNews = false
            statesManager.allNewsProcessed = false
        } else if (lastNoNews == false) {
            statesManager.newsLoadingText = ''
            statesManager.newsLoadingText2 = ''
            lastNoNews = true
            statesManager.allNewsProcessed = true
            log(DONE + ': Minden hír közzétéve')
        }
    }, 2000)

    try {
        /** @type {string[]} */
        const channelsWithSettings = JSON.parse(fs.readFileSync('./settings.json')).channelSettings.channelsWithSettings
        channelsWithSettings.forEach(channelWithSettings => {
            const chn = bot.channels.cache.get(channelWithSettings)
            chn.messages.fetch({ limit: 10 }).then(async (messages) => {
                messages.forEach(message => {
                    ProcessMessage(message)
                })
            })
        })
    } catch (err) {
        console.log('  Error: ' + err.message)
    }
})

/** @param {Discord.Message} message */
function processNewsMessage(message) {
    statesManager.allNewsProcessed = false
    listOfNews.push(CreateNews(message))
}
bot.on('messageCreate', async message => { //Message
    const thisIsPrivateMessage = message.channel.type === 'dm'
    if (message.author.bot && thisIsPrivateMessage === false) { return }
    if (!message.type) return
    let sender = message.author

    database.LoadDatabase()

    ProcessMessage(message)

    //#region Log
   
    userstatsAddUserToMemory(sender)
    if (message.channel.id === '744979145460547746') { //Memes channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://www.reddit.com/r/')) {
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://tenor.com/view/')) {
            userstatsSendMeme(sender)
        }
        if (message.attachments.size) {
            userstatsSendMeme(sender)
        }
    }
    if (message.channel.id === '775430473626812447') { //Youtube channel
        if (message.content.includes('https://www.youtube.com/')) {
            userstatsSendYoutube(sender)
        }
        if (message.content.includes('https://youtu.be/')) {
            userstatsSendYoutube(sender)
        }
    }
    if (message.channel.id === '738772392385577061') { //Music channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            userstatsSendMusic(sender)
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            userstatsSendMusic(sender)
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            userstatsSendMusic(sender)
        }
        if (message.content.includes('https://youtu.be/')) {
            userstatsSendMusic(sender)
        }
        if (message.attachments.size) {
            userstatsSendMusic(sender)
        }
    }

    userstatsSendMessage(sender)
    userstatsSendChars(sender, message.content.toString())
    //#endregion

    if (message.content.startsWith('https://www.reddit.com/r/')) {
        CommandRedditsave(message)
    }

    //#region News
    if (message.channel.id == ChannelId.IncomingNews) {
        processNewsMessage(message)

        log(`Received a news message`)
    }
    //#endregion

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


    if (message.content.startsWith(`${perfix}`)) {
        processCommand(message, thisIsPrivateMessage, sender, message.content.substring(1))
        return
    }

    if (listOfHelpRequiestUsers.includes(message.author.id) === true) {
        if (message.content.toLowerCase().includes('igen')) {
            message.reply('Használd a `.help` parancsot!')
        } else if (message.content.toLowerCase().includes('nem')) {
            message.reply('Ja ok')
        }
        delete listOfHelpRequiestUsers[listOfHelpRequiestUsers.indexOf(message.author.id)]
    } else {
        if (message.content.includes('<@!738030244367433770>')) {
            message.reply('Segítség kell?')
            listOfHelpRequiestUsers.push(message.author.id)
        }
    }
})
bot.on('messageReactionRemove', (messageReaction, user) => {
    if (user.bot) return

    if (!database.dataUsernames[user.id]) {
        database.dataUsernames[user.id] = {}
        database.dataUsernames[user.id].username = user.username
    }
    database.dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })
})
bot.on('messageReactionAdd', (messageReaction, user) => {
    if (user.bot) return

    if (!database.dataUsernames[user.id]) {
        database.dataUsernames[user.id] = {}
        database.dataUsernames[user.id].username = user.username
    }
    database.dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })
})

/** Auto reactions
 *  @param {Discord.Message} message */
function ProcessMessage(message) {
    try {
        var isHaveMusic = false
        if (message.content.includes('https://youtu.be/') == true) { isHaveMusic = true }
        if (message.content.includes('https://www.youtube.com/watch') == true) { isHaveMusic = true }
        if (message.content.includes('https://open.spotify.com/') == true) { isHaveMusic = true }

        if (isHaveMusic == false) { return }

        const settingsRaw = fs.readFileSync('./settings.json')
        const settings = JSON.parse(settingsRaw)
        const channelSettings = settings.channelSettings
        const messageChannelId = message.channel.id
        if (channelSettings[messageChannelId] != undefined) {
            /** @type {string[]} */
            const autoReactions = channelSettings[messageChannelId].autoReactions
            autoReactions.forEach(async (autoReaction) => {
                const reaction = message.reactions.resolve(autoReaction)
                if (reaction == null) {
                    await message.react(autoReaction)
                } else {
                    const users = await reaction.users.fetch();
                    var botIsReacted = false
                    users.forEach(async (user) => {
                        if (user.id == '738030244367433770') {
                            botIsReacted = true
                        }
                    })
                    if (botIsReacted == false) {
                        await message.react(autoReaction)
                    }
                }
            })
        }
    } catch (err) {
        console.log('  Error: ' + err.message)
    }
}

/**
 * @param {Discord.Message} message
 * @param {boolean} thisIsPrivateMessage
 * @param {Discord.User} sender
 * @param {string} command
 */
function processCommand(message, thisIsPrivateMessage, sender, command) {

    //#region Enabled in dm

    if (command === `pms`) {
        CommandBusiness(message.channel, sender, thisIsPrivateMessage, database)
        userstatsSendCommand(sender)
        return
    }

    if (command === `test`) {
        /*
        const button0 = new MessageButton()
            .setLabel("This is a button!")
            .setID("myid0")
            .setStyle("grey")
        const button1 = new MessageButton()
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

        const row0 = new MessageActionRow()
            .addComponents(button0, button1)
        const row1 = new MessageActionRow()
            .addComponents(select)
        message.channel.send("Message with a button!", { components: [row0, row1] })

        userstatsSendCommand(sender)
        return
        */
    }

    const currEditingMailI = getCurrentlyEditingMailIndex(sender.id)
    if (command === `mail`) {
        commandMail(sender, message.channel)

        userstatsSendCommand(sender)
        return
    }
    if (currEditingMailI > -1) {
        if (command.startsWith(`mail wt `)) {
            const mailNewValue = command.replace(`mail wt `, '')

            currentlyWritingEmails[currEditingMailI].mail.title = mailNewValue

            const _message = getMailMessage(sender, 3)
            currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            userstatsSendCommand(sender)
            return
        } else if (command.startsWith(`mail wc `)) {
            const mailNewValue = command.replace(`mail wc `, '')

            currentlyWritingEmails[currEditingMailI].mail.context = mailNewValue

            const _message = getMailMessage(sender, 3)
            currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            userstatsSendCommand(sender)
            return
        } else if (command.startsWith(`mail wr `) && message.mentions.users.first()) {
            const mailNewValue = message.mentions.users.first()

            currentlyWritingEmails[currEditingMailI].mail.reciver.id = mailNewValue.id
            currentlyWritingEmails[currEditingMailI].mail.reciver.name = mailNewValue.username

            const _message = getMailMessage(sender, 3)
            currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            userstatsSendCommand(sender)
            return
        } else if (command.startsWith(`mail wr `) && command.length == 26) {
            const mailNewValue = command.replace(`mail wr `, '')

            let userName = '???'
            try {
                userName = bot.users.cache.get(mailNewValue).username
            } catch (error) { }

            currentlyWritingEmails[currEditingMailI].mail.reciver.id = mailNewValue
            currentlyWritingEmails[currEditingMailI].mail.reciver.name = userName

            const _message = getMailMessage(sender, 3)
            currentlyWritingEmails[currEditingMailI].message.edit({ embed: _message.embed, component: _message.actionRows[0] })
            try { message.delete() } catch (error) { }

            userstatsSendCommand(sender)
            return
        }
    }

    //#endregion

    //#region Disabled in dm

    if (command.startsWith(`pms name `)) {
        message.channel.send('> \\⛔ **Ez a parancs átmenetileg nem elérhető!**')
        //commandPmsName(message.channel, sender, command.replace(`pms name `, ''))
        userstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`quiz\n`)) {
        const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
        if (message.attachments.size == 1) {
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6], message.attachments.first())
        } else {
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6])
        }
        userstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`quiz help`)) {
        userstatsSendCommand(sender)
        const embed = new Discord.MessageEmbed()
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
        userstatsSendCommand(sender)
        const embed = new Discord.MessageEmbed()
            .addField('Quizdone szintaxis',
                '.quizdone messageId correctIndex(0 - ...)'
            )
            .setColor(Color.Highlight)
        message.channel.send({ embeds: [embed] })
        return
    }

    if (command.startsWith(`quizdone `)) {
        quizDone(command.replace(`quizdone `, '').split(' ')[0], command.replace(`quizdone `, '').split(' ')[1])
        userstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`poll simple\n`)) {
        const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], false)
        userstatsSendCommand(sender)
        return
    }

    if (command.startsWith(`poll wyr\n`)) {
        const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], true)
        userstatsSendCommand(sender)
        return
    }

    if (command === `music skip`) { //Music
        if (thisIsPrivateMessage === false) {
            userstatsSendCommand(sender)
            commandSkip(message)
            return
        } else {
            message.channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
    } else if (command === `music list`) {
        if (thisIsPrivateMessage === false) {
            userstatsSendCommand(sender)
            commandMusicList(message)
            return
        } else {
            message.channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
    } else if (command.startsWith(`music `)) {
        if (thisIsPrivateMessage === false) {
            userstatsSendCommand(sender)
            commandMusic(message, command.toString().replace(`music `, ''))
            return
        } else {
            message.channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
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
         * @type {MessageButton[]}
         */
        /*
        let buttons = []
        for (let i = 0; i < icons.length; i++) {
            const icon = icons[i]
            const button0 = new MessageButton()
                .setLabel(icon)
                .setID("pollOption" + i)
                .setStyle("gray")
            buttons.push(button0)
        }
        const row0 = new MessageActionRow()
            .addComponents(buttons)

        const buttonFinish = new MessageButton()
            .setLabel('Befejezés')
            .setID("pollFinish")
            .setStyle("green")
        const row1 = new MessageActionRow()
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

    if (command.commandName === `handlebars` || command.commandName === `webpage`) {
        await command.deferReply({ ephemeral: true })
        var http = require('http')
        http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
            resp.on('data', function(ip) {
                const row = new MessageActionRow()
                const button = new MessageButton()
                    .setLabel('Weboldal')
                    .setStyle('LINK')
                    .setURL('http://' + ip + ':5665/public?user=' + GetHash(command.user.id))
                row.addComponents(button)
                command.editReply({ components: [row], ephemeral: true })
            })
        })
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
        userstatsSendCommand(command.user)
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

    if (command.commandName === `crossout`) {
        command.deferReply({ ephemeral: privateCommand }).then(() => {
            CrossoutTest(command, command.options.getString('search'), privateCommand)
        })
        return
    }

    if (command.commandName === `market` || command.commandName === `piac`) {
        command.reply(CommandMarket(database, database.dataMarket, command.user, privateCommand))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `xp` || command.commandName === `score`) {
        CommandXp(command, database, privateCommand)
        userstatsSendCommand(command.user)
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
        const embed = new Discord.MessageEmbed()
            .setTitle('Pong!')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/ping-pong_1f3d3.png')
            .setColor(Color.Highlight)
            .addField('\\🤖 BOT:',
                '> Készen áll: ' + DateToString(new Date(bot.readyTimestamp))
            )
            .addField('\\📡 WebSocket:',
                '> Ping: ' + bot.ws.ping + ' ms\n' +
                '> Státusz: ' + WsStatus
            )
        if (bot.shard != null) {
            embed.addField('Shard:',
                '> Fő port: ' + bot.shard.parentPort + '\n' +
                '> Mód: ' + bot.shard.mode
            )
        }
        command.reply({ embeds: [embed], ephemeral: privateCommand })
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `weather`) {
        /** @type {"earth" | "mars" | null} */
        const weatherLocation = command.options.getString('location', false)
        if (weatherLocation == 'mars') {
            CommandWeather(command, privateCommand, false)
        } else if (weatherLocation == 'earth' || weatherLocation == null) {            
            CommandWeather(command, privateCommand)
        } else {
            command.reply({ content: '> \\❌ **Nem tudok ilyen helyről <:wojakNoBrain:985043138471149588>**' })
        }
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `dev`) {
        if (command.user.id === '726127512521932880') {
            userstatsSendCommand(command.user)
            const embed = new Discord.MessageEmbed()
                .addField('Fejlesztői parancsok',
                    '> \\❔  `.quiz`\n' +
                    '>  \\📊  `.poll simple`\n' +
                    '>  \\📊  `.poll wyr`'
                )
                .setColor(Color.Highlight)
            command.reply({ embeds: [embed], ephemeral: true })
        } else {
            command.reply({ content: '> \\⛔ **Nincs jogosultságod a parancs használatához!**', ephemeral: true })
        }
        return
    }

    if (command.commandName === `help`) {
        command.reply({ embeds: [CommandHelp(isDm)], ephemeral: privateCommand })
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `crate`) {
        command.reply(commandAllCrate(command.member, command.options.getInteger("darab"), privateCommand))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `heti`) {
        command.reply(commandAllNapi(command.member, command.options.getInteger("darab"), privateCommand))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `napi`) {
        command.reply(commandAllNapi(command.member, command.options.getInteger("darab"), privateCommand))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `profil` || command.commandName === `profile`) {
        CommandProfil(database, command, privateCommand)
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `backpack`) {
        command.reply(commandStore(command.user, privateCommand))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `bolt` || command.commandName === `shop`) {
        command.reply(CommandShop(command.channel, command.user, command.member, database, 0, '', privateCommand))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `quiz`) {
        try {
            quiz(command.options.getString("title"), command.options.getString("options"), command.options.getString("option_emojis"), command.options.getInteger("add_xp"), command.options.getInteger("remove_xp"), command.options.getInteger("add_token"), command.options.getInteger("remove_token"))
            command.reply({ content: '> \\✔️ **Kész**', ephemeral: true })
        } catch (error) {
            command.reply({ content: '> \\❌ **Hiba: ' + error.toString() + '**', ephemeral: true })
        }
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `font`) {
        CommandFont(command, privateCommand)
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `music`) {
        if (isDm == false) {
            if (command.options.getSubcommand() == 'play') {
                commandMusic(command, command.options.getString('url'))
            } else if (command.options.getSubcommand() == `skip`) {
                commandSkip(command)
            } else if (command.options.getSubcommand() == `list`) {
                commandMusicList(command)
            }
        } else {
            command.reply("> \\❌ **Ez a parancs csak szerveren használható!**")
        }
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `settings` || command.commandName === `preferences`) {
        command.reply(CommandSettings(database, command.member, privateCommand))
        userstatsSendCommand(command.user)
        return
    }

    command.reply("> \\❌ **Ismeretlen parancs `" + command.commandName + "`! **`/help`** a parancsok listájához!**")
}

function StartBot() {
    SystemLog('Start bot...')
    bot.login(tokens.discord).catch((err) => {
        if (err == 'FetchError: request to https://discord.com/api/v9/gateway/bot failed, reason: getaddrinfo ENOTFOUND discord.com') {
            log(ERROR + ': Nem sikerült csatlakozni: discord.com nem található')
        } else {
            log(ERROR + ': ' + err)
        }
    })
}

function StopBot() {
    bot.destroy()
    botStopped = true
}

const endDateTime = new Date(Date.now())
const ellapsedMilliseconds = endDateTime - startDateTime
SystemLog('Scripts loaded in ' + ellapsedMilliseconds + 'ms')

if (autoStartBot) {
    StartBot()
}

//#region Mails

/**
 * @param {number} userId
 * @returns {number}
 */
function getCurrentlyEditingMailIndex(userId) {
    for (let i = 0; i < currentlyWritingEmails.length; i++) {
        const mail = currentlyWritingEmails[i]
        if (mail.user.id === userId) {
            return i
        }
    }

    return -1
}

/**
 * @param {Discord.User} sender
 * @param {Discord.TextChannel} channel
 */
function commandMail(sender, channel) {
    const message = getMailMessage(sender)
    channel.send({ embeds: [message.embed], components: [message.actionRows[0]] })
}

/**
 * @param {Discord.User} user
 * @param {number} selectedIndex 0: main | 1: inbox | 2: outbox | 3: writing
 */
function getMailMessage(user, selectedIndex = 0) {
    const button0 = new MessageButton()
        .setLabel("Kezdőlap")
        .setCustomId("mailFolderMain")
        .setStyle("SECONDARY")
    const button1 = new MessageButton()
        .setLabel("Beérkező e-mailek")
        .setCustomId("mailFolderInbox")
        .setStyle("SECONDARY")
    const button2 = new MessageButton()
        .setLabel("Elküldött e-mailek")
        .setCustomId("mailFolderOutbox")
        .setStyle("SECONDARY")
    const button3 = new MessageButton()
        .setLabel("✍️ Levél írása")
        .setCustomId("mailWrite")
        .setStyle("PRIMARY")

    const row0 = new MessageActionRow()

    const embed = new Discord.MessageEmbed()
        .setAuthor({ name: user.username, iconURL: user.avatarURL() })

    if (selectedIndex === 0) {
        embed.setTitle("Kezdőlap")
        const allInboxMails = getAllEMails(user.id, MailFolder.inbox)
        const allOutboxMails = getAllEMails(user.id, MailFolder.outbox)
        let unreaded = 0
        allInboxMails.forEach(mail => {
            if (mail.readed === false) {
                unreaded += 1
            }
        })
        embed.addField("📥 Beérkező levelek", 'Olvasatlan: ' + unreaded + '\nÖsszes: ' + allInboxMails.length)
        embed.addField("📤 Elküldött levelek", 'Összes: ' + allOutboxMails.length)

        button0.setLabel("↻")
        button0.setStyle('PRIMARY')
        row0.addComponents(button3, button0, button1, button2)
    } else if (selectedIndex === 1) {
        embed.setTitle("📥 Beérkező levelek")

        const allMails = getAllEMails(user.id, MailFolder.inbox)
        log(allMails)
        allMails.forEach(mail => {
            embed.addField(
                mail.icon + ' ' + mail.sender.name + ' - ' + mail.title,
                mail.context + '\n[' + new Date(mail.date).toDateString() + ']\n',
                false)
        })

        button1.setLabel("↻")
        button1.setStyle('PRIMARY')
        row0.addComponents(button3, button1, button0, button2)

        setReadAllMessages(user.id)
    } else if (selectedIndex === 2) {
        embed.setTitle("📤 Elküldött levelek")

        const allMails = getAllEMails(user.id, MailFolder.outbox)
        log(allMails)
        allMails.forEach(mail => {
            embed.addField(
                mail.icon + ' ' + mail.reciver.name + ' - ' + mail.title,
                mail.context + '\n[' + new Date(mail.date).toDateString() + ']\n',
                false)
        })

        button2.setLabel("↻")
        button2.setStyle('PRIMARY')
        row0.addComponents(button3, button2, button0, button1)
    } else if (selectedIndex === 3) {
        embed.setTitle("Levél írása")

        /**
         * @type {Mail}
         */
        let mail
        currentlyWritingEmails.forEach(wMail => {
            if (wMail.user.id === user.id) {
                mail = wMail.mail
            }
        })

        embed.addField('Cím: "' + mail.title + '"', 'Üzenet: "' + mail.context + '"\n' + 'Fogadó: @' + mail.reciver.name)
            .setFooter({
                text: '.mail wt [cím] Cím beállítása\n' +
                    '.mail wc [üzenet] Üzenet beállítása\n' +
                    '.mail wr [@Felhasználó | Azonosító] Címzet beállítása'
            })

        const button4 = new MessageButton()
            .setLabel("Küldés")
            .setCustomId("mailWriteSend")
            .setStyle("SUCCESS")
        const button5 = new MessageButton()
            .setLabel("Elvetés")
            .setCustomId("mailWriteAbort")
            .setStyle("DANGER")
        row0.addComponents(button4, button5)
    }
    return new MailMessage(embed, [row0])
}

/**
 * @param {Discord.User} userSender
 * @param {Discord.User} userReciver
 * @param {Mail} mail
 */
function sendMail(userSender, userReciver, mail) {
    let newMail = mail
    newMail.sender = new MailUser(userSender.username, userSender.id)
    newMail.reciver = new MailUser(userReciver.username, userReciver.id)
    return sendMailOM(newMail)
}

/**
 * @param {Mail} mail
 */
function sendMailOM(mail) {
    if (!database.dataMail[mail.reciver.id]) return false
    if (!database.dataMail[mail.sender.id]) return false
    if (!database.dataMail[mail.reciver.id].inbox) return false
    if (!database.dataMail[mail.sender.id].outbox) return false

    database.   dataMail[mail.reciver.id].inbox[mail.id] = {}
    database.  dataMail[mail.reciver.id].inbox[mail.id].sender = {}
    database.   dataMail[mail.reciver.id].inbox[mail.id].sender.name = database.dataMail[mail.sender.id].username
    database.   dataMail[mail.reciver.id].inbox[mail.id].sender.id = mail.sender.id
    database.   dataMail[mail.reciver.id].inbox[mail.id].reciver = {}
    database. dataMail[mail.reciver.id].inbox[mail.id].reciver.name = database.dataMail[mail.reciver.id].username
    database. dataMail[mail.reciver.id].inbox[mail.id].reciver.id = mail.reciver.id
    database. dataMail[mail.reciver.id].inbox[mail.id].title = mail.title
    database. dataMail[mail.reciver.id].inbox[mail.id].context = mail.context
    database.  dataMail[mail.reciver.id].inbox[mail.id].date = mail.date
    database.   dataMail[mail.reciver.id].inbox[mail.id].readed = false
    database.  dataMail[mail.reciver.id].inbox[mail.id].icon = "✉️"
    database.  dataMail.mailIds += '|' + mail.id

    const newMailId = generateMailId()
    database.  dataMail[mail.sender.id].outbox[mail.id] = {}
    database.  dataMail[mail.sender.id].outbox[mail.id].sender = {}
    database.  dataMail[mail.sender.id].outbox[mail.id].sender.name =database. dataMail[mail.sender.id].username
    database.  dataMail[mail.sender.id].outbox[mail.id].sender.id = mail.sender.id
    database.  dataMail[mail.sender.id].outbox[mail.id].reciver = {}
    database.  dataMail[mail.sender.id].outbox[mail.id].reciver.name =database. dataMail[mail.reciver.id].username
    database.  dataMail[mail.sender.id].outbox[mail.id].reciver.id = mail.reciver.id
    database. dataMail[mail.sender.id].outbox[mail.id].title = mail.title
    database.dataMail[mail.sender.id].outbox[mail.id].context = mail.context
    database. dataMail[mail.sender.id].outbox[mail.id].date = mail.date
    database. dataMail[mail.sender.id].outbox[mail.id].readed = true
    database.  dataMail[mail.sender.id].outbox[mail.id].icon = "✉️"
    database. dataMail.mailIds += '|' + newMailId

    database.SaveDatabase()

    log(getAllMailIds())

    return true
}

function generateMailId() {
    const allMailIds = getAllMailIds()
    let generatedMailId = 0
    while (allMailIds.includes(generatedMailId.toString()) === true) {
        generatedMailId += 1
    }
    return generatedMailId.toString()
}

/**
 * @returns {string[]}
 */
function getAllMailIds() {
    return database.dataMail.mailIds.toString().split('|')
}

/**
 * @param {string} userId
 * @param {MailFolder} folder
 */
function getAllEMails(userId, folder) {
    if (!database.dataMail[userId]) return []
    if (!database.dataMail[userId].inbox) return []

    const allMailIds = getAllMailIds()
    /**
     * @type {Mail[]}
     */
    let allMails = []

    for (let i = 0; i < allMailIds.length; i++) {
        const mailId = allMailIds[i]
        if (folder === MailFolder.inbox) {
            if (database.dataMail[userId].inbox[mailId]) {
                allMails.push(getMailFromRawJSON(database.dataMail[userId].inbox[mailId], mailId))
            }
        } else if (folder === MailFolder.outbox) {
            if (database.dataMail[userId].outbox[mailId]) {
                allMails.push(getMailFromRawJSON(database.dataMail[userId].outbox[mailId], mailId))
            }
        }
    }
    allMails = allMails.reverse()
    return allMails
}

function getMailFromRawJSON(rawJSON, id) {
    return new Mail(id,
        new MailUser(rawJSON.sender.name, rawJSON.sender.id),
        new MailUser(rawJSON.reciver.name, rawJSON.reciver.id),
        rawJSON.title,
        rawJSON.context,
        rawJSON.date,
        rawJSON.readed,
        rawJSON.icon)
}

function setReadAllMessages(userId) {
    if (!database.dataMail[userId]) return
    if (!database.dataMail[userId].inbox) return

    const allMailIds = getAllMailIds()
    for (let i = 0; i < allMailIds.length; i++) {
        const mailId = allMailIds[i]
        if (database.dataMail[userId].inbox[mailId]) {
            database.dataMail[userId].inbox[mailId].readed = true
        }
    }

    database.SaveDatabase()
}

class Mail {
    /**
 * @param {string} id
 * @param {MailUser} sender
 * @param {MailUser} reciver
 * @param {string} title
 * @param {string} context
 * @param {number} date
 * @param {boolean} readed
 * @param {string} icon
 */
    constructor(id, sender, reciver, title, context, date = Date.now(), readed = false, icon = "✉️") {
        this.id = id
        this.sender = sender
        this.reciver = reciver
        this.title = title
        this.context = context
        this.date = date
        this.readed = readed
        this.icon = icon
    }
}

const MailUserType = {
    unknown: 0,
    user: 1,
    system: 2
}

class MailUser {
    /**
     * @param {string} name
     * @param {string} id
     * @param {MailUserType} type
     */
    constructor(name, id, type = MailUserType.user) {
        this.name = name
        this.id = id
        this.type = type
    }
}

class MailMessage {
    /**
     * @param {Discord.MessageEmbed} embed
     * @param {MessageActionRow[]} actionRows
     */
    constructor(embed, actionRows) {
        this.embed = embed
        this.actionRows = actionRows
    }
}

const MailFolder = {
    inbox: 0,
    outbox: 1
}

class CurrentlyWritingMail {
    /**
     * @param {Discord.User} user
     * @param {Mail} mail
     * @param {Discord.Message} message
     */
    constructor(user, mail, message) {
        this.user = user
        this.mail = mail
        this.message = message
    }
}

//#endregion
