//#region Imports, variables

const CommandWeather = require('./commands/weather')
const CommandHelp = require('./commands/help')
const CommandXp = require('./commands/database/xp')
const CommandShop = require('./commands/database/shop')
const CommandGoHome = require('./commands/database/goHome')
const CommandBusiness = require('./commands/database/businees')
const { LogManager } = require('./functions/log.js')
const { TranslateMessage } = require('./functions/translator.js')
const { StatesManager } = require('./functions/statesManager.js')
const { databaseManager } = require('./functions/databaseManager.js')

const logManager = new LogManager()
const statesManager = new StatesManager()

/**
* @param {string} message
*/
function log(message = '') {
    logManager.Log(message, false)
}

const consoleWidth = 80 - 2

const fs = require('fs')

/**
 * @type {string[]}
 */
let listOfHelpRequiestUsers = []

const listOfUserIDs = ['726127512521932880',
    '591218715803254784', '494126778336411648',
    '575727604708016128', '583709720834080768',
    '415078291574226955', '750748417373896825',
    '504304776033468438', '551299555698671627']

const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + '\033[37m' + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + '\033[37m' + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + '\033[37m' + ']'
const SHARD = '[' + '\033[35m' + 'SHARD' + '\033[40m' + '' + '\033[37m' + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + '\033[37m' + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + '\033[37m' + ']'

loadingProcess('Bővítmények, változók betöltése...')
const Discord = require('discord.js')
const { perfix, token } = require('./config.json')
const bot = new Discord.Client()
require('discord-buttons')(bot);
statesManager.botLoaded = true

let userstats = JSON.parse(fs.readFileSync('./database/userstats.json', 'utf-8'))

let dataBackpacks = JSON.parse(fs.readFileSync('./database/backpacks.json', 'utf-8'))
let dataStickers = JSON.parse(fs.readFileSync('./database/stickers.json', 'utf-8'))
let dataBot = JSON.parse(fs.readFileSync('./database/bot.json', 'utf-8'))
let dataUsernames = JSON.parse(fs.readFileSync('./database/userNames.json', 'utf-8'))
let dataMail = JSON.parse(fs.readFileSync('./database/mails.json', 'utf-8'))
let dataPolls = JSON.parse(fs.readFileSync('./database/polls.json', 'utf-8'))

const database = new databaseManager()
database.dataBasic = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'))
database.dataBackpacks = JSON.parse(fs.readFileSync('./database/backpacks.json', 'utf-8'))

const ytdl = require('ytdl-core')

const disbut = require('discord-buttons');

const dayOfYear = Math.floor(
    (
        (new Date()) - (new Date(new Date().getFullYear(), 0, 0))
    ) / (
        1000 * 60 * 60 * 24
    )
)

const WS = require('./ws/ws')
var ws = new WS('1234', 5665, bot, logManager, database)

let musicArray = []
let musicFinished = true

const settings = JSON.parse(fs.readFileSync('settings.json', 'utf-8'))

let lastInput = ''

const activities_list = [
    "GTA V",
    "Minecraft",
    "Fortnite",
    "Mindustry",
    "GTA IV",
    "CS:GO",
    "Terrira",
    "Crossout",
    "Apex Legends",
    "Factorio",
    "World of Tanks",
    "Warthunder",
    "Warzone 2100",
    "Genshin Impact",
    "Valoriant"
];

const FileDebugType = {
    simple: "SIMPLE",
    warning: "WARNING",
    error: "ERROR",
    debug: "DEBUG",
    discordMessage: "DISCORDMESSAGE",
    discordMessageDelete: "DISCORDMESSAGEDELETE",
    discordReactionAdd: "DISCORDREACT",
    discordReactionRemove: "DISCORDREACTDELETE"
}

const Color = {
    Error: "#ed4245",
    ErrorLight: "#f57531",
    Warning: "#faa81a",
    Done: "#3ba55d",
    White: "#dcddde",
    Silver: "#b9bbbe",
    Gray: "#8e9297",
    DimGray: "#72767d",
    Highlight: "#5865f2",
    Purple: "#9b59b6",
    Pink: "#e91e63",
    DarkPink: "#ad1457"
}

const readline = require('readline')

let request = require(`request`);
const { send } = require('process')
const { number } = require('assert-plus')
function download(url) {
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream('meme.png'));
}

/**
 * @type {GameMap}
 */
let gameMap = null

/**
 * @type {number}
 */
let gameCameraX = 0

/**
 * @type {number}
 */
let gameCameraY = 0

/**
 * @type {GameUserSettings[]}
 */
let gameUserSettings = []


/**
 * @type {savedGameMessage[]}
 */
let allGameMessages = []

/**
 * @type {CurrentlyWritingMail[]}
 */
let currentlyWritingEmails = []

//#endregion

/**
 * @type [NewsMessage]
 */
const listOfNews = []
const incomingNewsChannel = '902894789874311198'
const processedNewsChannel = '746266528508411935'
const newsSaveProcessedMessages = true

loadingProcess('Betöltés...')

//#region Functions 

/**
 * @param {Discord.User} user
 * @param {string} username
 */
function saveUserToMemoryAll(user, username) {
    if (!dataBackpacks[user.id]) {
        dataBackpacks[user.id] = {}
    }
    dataBackpacks[user.id].username = username
    if (!dataBackpacks[user.id].crates) {
        dataBackpacks[user.id].crates = 0
    }
    if (!dataBackpacks[user.id].gifts) {
        dataBackpacks[user.id].gifts = 0
    }
    if (!dataBackpacks[user.id].getGift) {
        dataBackpacks[user.id].getGift = 0
    }
    if (!dataBackpacks[user.id].tickets) {
        dataBackpacks[user.id].tickets = 0
    }
    if (!dataBackpacks[user.id].luckyCards) {
        dataBackpacks[user.id].luckyCards = {}
    }
    if (!dataBackpacks[user.id].luckyCards.small) {
        dataBackpacks[user.id].luckyCards.small = 0
    }
    if (!dataBackpacks[user.id].luckyCards.medium) {
        dataBackpacks[user.id].luckyCards.medium = 0
    }
    if (!dataBackpacks[user.id].luckyCards.large) {
        dataBackpacks[user.id].luckyCards.large = 0
    }

    if (!database.dataBasic[user.id]) {
        database.dataBasic[user.id] = {}
    }
    database.dataBasic[user.id].username = username
    if (!database.dataBasic[user.id].score) {
        database.dataBasic[user.id].score = 0
    }
    if (!database.dataBasic[user.id].money) {
        database.dataBasic[user.id].money = 0
    }
    if (!database.dataBasic[user.id].day) {
        database.dataBasic[user.id].day = 0
    }
    if (!database.dataBasic[user.id].color) {
        database.dataBasic[user.id].color = 0
    }
    if (!database.dataBasic[user.id].customname) {
        database.dataBasic[user.id].customname = username
    }

    if (!dataStickers[user.id]) {
        dataStickers[user.id] = {}
    }
    dataStickers[user.id].username = username
    if (!dataStickers[user.id].stickersMeme) {
        dataStickers[user.id].stickersMeme = 0
    }
    if (!dataStickers[user.id].stickersMusic) {
        dataStickers[user.id].stickersMusic = 0
    }
    if (!dataStickers[user.id].stickersYoutube) {
        dataStickers[user.id].stickersYoutube = 0
    }
    if (!dataStickers[user.id].stickersMessage) {
        dataStickers[user.id].stickersMessage = 0
    }
    if (!dataStickers[user.id].stickersCommand) {
        dataStickers[user.id].stickersCommand = 0
    }
    if (!dataStickers[user.id].stickersTip) {
        dataStickers[user.id].stickersTip = 0
    }

    if (!dataMail.mailIds) {
        dataMail.mailIds = ''
    }
    if (!dataMail[user.id]) {
        dataMail[user.id] = {}
    }
    dataMail[user.id].username = username
    if (!dataMail[user.id].inbox) {
        dataMail[user.id].inbox = {}
    }
    if (!dataMail[user.id].outbox) {
        dataMail[user.id].outbox = {}
    }

    if (!dataUsernames[user.id]) {
        dataUsernames[user.id] = {}
    }
    dataUsernames[user.id].username = username
    dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })

    saveDatabase()
}

function savePollDefaults() {
    if (!dataPolls.messageIds) {
        dataPolls.messageIds = ''
    }
    if (!dataPolls.messages) {
        dataPolls.messages = {}
    }
}

/**
 * @param {string} messageId
 * @param {string} title
 * @param {string[]} optionTexts
 * @param {string[]} optionIcons
 */
function addNewPoll(messageId, title, optionTexts, optionIcons) {
    savePollDefaults()

    /**
     * @type {number[]}
     */
    let vals = []
    /**
     * @type {string[]}
     */
    let usrs = []
    for (let v = 0; v < optionTexts.length; v++) {
        vals.push(0)
    }

    dataPolls.messages[messageId] = {}
    dataPolls.messages[messageId].title = title
    dataPolls.messages[messageId].optionTexts = optionTexts
    dataPolls.messages[messageId].optionIcons = optionIcons
    dataPolls.messages[messageId].optionValues = vals
    dataPolls.messages[messageId].userIds = usrs

    dataPolls.messageIds += "|" + messageId

    saveDatabase()
}

function saveDatabase() {
    fs.writeFile('./database/backpacks.json', JSON.stringify(dataBackpacks), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/basic.json', JSON.stringify(database.dataBasic), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/stickers.json', JSON.stringify(dataStickers), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/userNames.json', JSON.stringify(dataUsernames), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/mails.json', JSON.stringify(dataMail), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/polls.json', JSON.stringify(dataPolls), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
}

function reloadDatabase() {
    try {
        dataBackpacks = JSON.parse(fs.readFileSync('./database/backpacks.json', 'utf-8'))
        database.dataBasic = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'))
        dataStickers = JSON.parse(fs.readFileSync('./database/stickers.json', 'utf-8'))
        dataBot = JSON.parse(fs.readFileSync('./database/bot.json', 'utf-8'))
        dataUsernames = JSON.parse(fs.readFileSync('./database/userNames.json', 'utf-8'))
        dataMail = JSON.parse(fs.readFileSync('./database/mails.json', 'utf-8'))
        dataPolls = JSON.parse(fs.readFileSync('./database/polls.json', 'utf-8'))
    } catch (error) {
        log(error.message)
    }
}

function abbrev(num) {
    if (!num || isNaN(num)) return "0";
    if (typeof num === "string") num = parseInt(num);
    let decPlaces = Math.pow(10, 1);
    var abbrev = ["E", "m", "M", "b", "B", "tr", "TR", "qa", "QA", "qi", "QI", "sx", "SX", "sp", "SP"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= num) {
            num = Math.round((num * decPlaces) / size) / decPlaces;
            if (num == 1000 && i < abbrev.length - 1) {
                num = 1;
                i++;
            }
            num += abbrev[i];
            break;
        }
    }
    return num;
}

/**
 * Shorten text.
 * @param {string} text Text to shorten 
 * @param {number} len Max Length
 * @returns {string}
 */
function shorten(text, len) {
    if (typeof text !== "string") return "";
    if (text.length <= len) return text;
    return text.substr(0, len).trim() + "...";
}

/**
* @param {Discord.Message} message The message context
* @param {string} username The message's author name
* @param {boolean} private This is a private message?
* @param {Discord.User} author This is a private message?
*/
async function logMessage(message, username, private = false.valueOf, author) {
    if (private === false) {
        if (message.content.startsWith('https://tenor.com/view/')) {
            log(`<${username}> - <GIF>`, 0);
        } else if (message.content.startsWith('https://www.youtube.com/') || message.content.startsWith('https://youtu.be/')) {
            log(`<${username}> - ${message.content}`, 0)

            const link = message.content

            let info = await ytdl.getInfo(link);

            let videoLengthSeconds = info.videoDetails.lengthSeconds
            let videoLengthMinutes = 0
            let videoLengthHours = 0
            for (let l = 0; videoLengthSeconds > 60; l += 1) {
                videoLengthMinutes += 1
                videoLengthSeconds -= 60
            }
            for (let l = 0; videoLengthMinutes > 60; l += 1) {
                videoLengthHours += 1
                videoLengthMinutes -= 60
            }

            let lengthText = '0:00'
            let minutes = videoLengthMinutes
            if (videoLengthMinutes < 10) { minutes = '0' + minutes }
            let seconds = videoLengthSeconds
            if (videoLengthSeconds < 10) { seconds = '0' + seconds }

            if (videoLengthHours = 0) {
                lengthText = videoLengthMinutes + ':' + seconds
            } else {
                lengthText = videoLengthHours + ':' + minutes + ':' + seconds
            }

        } else if (message.content.startsWith('https://www.reddit.com/')) {
            log(`<${username}> - ${message.content}`, 0)
        } else if (message.content.startsWith('https://cdn.discordapp.com/attachments/')) {
            log(`<${username}> - <Discord fájl>`, 0)
        } else if (message.content.startsWith('https://')) {
            log(`<${username}> - ${message.content}`, 0)
        } else if (message.attachments.size) {
            log(`<${username}> - <fájl>`, 0)
        } else {
            log(`<${username}> - ${message.content}`, 0)
        }

        logToFile(FileDebugType.discordMessage + username + "Ϊ" +
            message.content + "Ϊ" +
            message.author.avatarURL({ format: 'png', size: 64 }) + "Ϊ" +
            message.id + "Ϊ" +
            message.channel.id + "Ϊ" +
            message.guild.id + "Ϊ" +
            author.id
        )

    } else {

        logToFile(FileDebugType.discordMessage + username + "Ϊ" +
            message.content + "Ϊ" +
            message.author.avatarURL({ format: 'png', size: 64 }) + "Ϊ" +
            message.id + "Ϊ" +
            000000000000000000 + "Ϊ" +
            000000000000000000 + "Ϊ" +
            author.id
        )

        if (message.channel.guild) {
            log(`<${username}> - ${message.content}`, 0)
        } else {
            log(`<${username}> ` + '\033[30m<Privált>' + '\033[37m' + '' + ` - ${message.content.slice(0, consoleWidth)}`, 16)
        }
    };

}

/**
* @param {string} data
*/
function logToFile(data) {
    return;
    let text = ''
    text = data
    if (data === '') text = null
    if (data === ' ') text = null
    if (!data) text = null
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    if (minute < 10) {
        minute = '0' + new Date().getMinutes();
    };
    let seconds = new Date().getSeconds();
    if (seconds < 10) {
        seconds = '0' + new Date().getSeconds();
    };
    const timeStamp = hour + ':' + minute + ':' + seconds
    let asfasfasdf = ""
    asfasfasdf = "\n¶" + timeStamp + "»" + text + "»"
    fs.appendFile('out.txt', asfasfasdf, function (err) { if (err) return log(err); });
}

/**
* @param {string} title
*/
function loadingProcess(title) {
    statesManager.loadingProgressText = title
    log(DEBUG + ': ' + title)
}

/**
* @param {Discord.User} user
* @param {Discord.TextChannel} channel
* @param {number} ammount
 */
function addXp(user, channel, ammount) {

    oldScore = database.dataBasic[user.id].score
    database.dataBasic[user.id].score += ammount
    const newScore = database.dataBasic[user.id].score

    log(DEBUG + ': Add XP: ' + ammount);

    if (oldScore < 1000 && newScore > 999 || oldScore < 5000 && newScore > 4999 || oldScore < 10000 && newScore > 9999 || oldScore < 50000 && newScore > 49999 || oldScore < 100000 && newScore > 99999) {

        log(DEBUG + ': New level');
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
            .setAuthor(user.username, user.displayAvatarURL())
            .setTitle('Szintet léptél!')
            .addField('Rang', '\\' + rank.toString() + '  (' + rankName + ')', true)
            .addField('Jutalmad', addMoney.toString() + '\\💵', true)
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clinking-beer-mugs_1f37b.png')
            .setColor(Color.Highlight)
        channel.send(embed)
    }

    saveDatabase()
}

//#endregion
//#region Listener-ek

bot.on('reconnecting', () => {
    log(INFO & ': Újracsatlakozás...');
    logToFile(FileDebugType.debug + 'reconnecting')
});

bot.on('disconnect', () => {
    log(ERROR & ': Megszakadt a kapcsolat!');
    logToFile(FileDebugType.debug + 'disconnect')
});

bot.on('resume', () => {
    log(INFO & ': Folytatás');
    logToFile(FileDebugType.debug + 'resume')
});

bot.on('error', error => {
    log(ERROR & ': ' + error);
    logToFile(FileDebugType.debug + 'error:' + error)
});

bot.on('debug', debug => {
    statesManager.ProcessDebugMessage(debug)
    const translatedDebug = TranslateMessage(debug)

    if (translatedDebug == null) return;
    if (translatedDebug.secret == true) return;

    log(translatedDebug.messagePrefix + ': ' + translatedDebug.translatedText)

    /*
    if (debug.startsWith('Provided token: ')) { } else {
        logToFile(FileDebugType.debug + debug)
        if (debug.startsWith('Preparing to connect to the gateway...')) {
            loadingProcess('Csatlakozás...')
            //logToFile(FileDebugType.debug + "Client: Csatlakozás...")
            log()
        } else if (debug.startsWith('[WS => Manager] Fetched Gateway Information')) {
        } else if (debug.startsWith('[WS => Manager] Session Limit Information')) {
        } else if (debug.startsWith('[WS => Manager] Spawning shards: ')) {
            loadingProcess('Shard-ok létrehozása')
            //logToFile(FileDebugType.debug + "WebSocket: Shard-ok létrehozása...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [CONNECT]')) {
            loadingProcess('Csatlakozva')
            //logToFile(FileDebugType.debug + "Shard: Csatlakozva")
            log()
        } else if (debug.startsWith('[WS => Shard 0] Setting a HELLO timeout for ')) {
            loadingProcess('\'HELLO\' időtúllépés beállítása')
            //logToFile(FileDebugType.debug + "Shard: 'HELLO' időtúllépés beállítása...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [CONNECTED] wss://gateway.discord.gg/?v=6&encoding=json in ')) {
            loadingProcess('Csatlakozva a szerverhez')
            //logToFile(FileDebugType.debug + "Shard: Csatlakozva a szerverhez")
            log()
        } else if (debug.startsWith('[WS => Shard 0] Clearing the HELLO timeout.')) {
            loadingProcess('\'HELLO\' időtúllépés törölve')
            //logToFile(FileDebugType.debug + "Shard: 'HELLO' időtúllépés törölve")
            log()
        } else if (debug.startsWith('[WS => Shard 0] Setting a heartbeat interval for ')) {
            loadingProcess('\'heartbeat\' beállítása')
            //logToFile(FileDebugType.debug + "Shard: 'heartbeat' beállítása..")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [IDENTIFY] Shard 0/1')) {
            loadingProcess('Shard ellenőrizve')
            //logToFile(FileDebugType.debug + "Shard: Shard ellenőrizve")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [READY] Session ')) {
            loadingProcess('Szerver kész')
            //logToFile(FileDebugType.debug + "Shard: A szerver kész")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [ReadyHeartbeat] Sending a heartbeat.')) {
            loadingProcess('\'heartbeat\' küldése')
            //logToFile(FileDebugType.debug + "Shard: 'heartbeat' küldése...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] Shard received all its guilds. Marking as fully ready.')) {
            loadingProcess('Befejezés')
            //logToFile(FileDebugType.debug + "Shard: Befejezés...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] Heartbeat acknowledged, latency of ')) {
            //logToFile("Ω" + ping)
            log()
        } else if (debug.startsWith('[WS => Shard 0] [HeartbeatTimer] Sending a heartbeat.')) {
            log()
        } else if (debug.startsWith('[WS => Manager] Couldn\'t reconnect or fetch information about the gate')) {
            log(ERROR + ': Nem sikerült újracsatlakozni.')
            //logToFile(FileDebugType.error + 'WebSocket: Nem sikerült újracsatlakozni')
        } else if (debug.startsWith('[WS => Manager] Possible network error occurred. Retrying in 5s...')) {
            //logToFile(FileDebugType.debug + "WebSocket: Újracsatlakozás 5s múlva...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [DESTROY]')) {
            //logToFile(FileDebugType.warning + 'Shard: Shard törölve.')
            log()
        } else if (debug.startsWith('[WS => Shard 0] Tried to send packet \'{')) {
            log(ERROR + ': Nem sikerült elküldeni a csomagot.')
            //logToFile(FileDebugType.error + 'Shard: Nem sikerült elküldeni a csomagot')
        } else if (debug.startsWith('[WS => Shard 0] Shard was destroyed but no WebSocket connection was present! Reconnecting...')) {
            //logToFile(FileDebugType.warning + 'Shard: A Shard törölve, de nincs WebSocket csatlakozás! Újracsatlakozás...')
            log()
        } else if (debug.startsWith('[WS => Manager] Manager was destroyed. Called by:')) {
            log(WARNING + ': A Kezelő törölve.')
            //logToFile(FileDebugType.error + 'WebSocket: Nem sikerült csatlakozni')
        } else if (debug.startsWith('[WS => Shard 0] [CLOSE]')) {
            //logToFile(FileDebugType.warning + 'Shard: Kilépés...')
            log()
        } else if (debug.startsWith('[WS => Shard 0] Clearing the heartbeat interval.')) {
            log()
            //logToFile(FileDebugType.warning + 'Shard: \'heartbeat\' időtúllépés törölve')
        } else if (debug.startsWith('[WS => Shard 0] Session ID is present, attempting an immediate reconnect...')) {
            //logToFile(FileDebugType.debug + 'Shard: A szerver ID az azonnali újracsatlakozásra törekszik...')
            log()
        } else if (debug.startsWith('[WS => Shard 0] WS State: CLOSED')) {
            //logToFile(FileDebugType.warning + 'Shard: Kilépve')
            log()
        } else if (debug.startsWith('[WS => Shard 0] A connection object was found. Cleaning up before continuing.')) {
            //logToFile(FileDebugType.debug + "Shard: Tisztítás, mielőtt folytatnánk...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] WS State: CONNECTING')) {
            //logToFile(FileDebugType.debug + "Shard: Csatlakozás...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] Failed to connect to the gateway, requeueing...')) {
            //logToFile(FileDebugType.warning + 'Shard: Nem sikerült csatlakozni, újrapróbálkozás...')
            log()
        } else if (debug.startsWith('[WS => Manager] Shard Queue Size: 1; continuing in 5 seconds...')) {
            //logToFile(FileDebugType.debug + "WebSocket: Shard Sor Mérete: 1, folytatás 5s múlva...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [RESUME]')) {
            //logToFile(FileDebugType.debug + "Shard: Folytatás...")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [RESUMED]')) {
            //logToFile(FileDebugType.debug + "Shard: Folytatva")
            log()
        } else if (debug.startsWith('[WS => Shard 0] [ResumeHeartbeat] Sending a heartbeat')) {
            log(DONE + ':  Csatlakozva')
            //logToFile(FileDebugType.debug + "Shard: \'heartbeat\' küldése folytatva")
        } else if (debug.startsWith('[WS => Shard 0] [INVALID SESSION] Resumable: false.')) {
            log(ERROR + ': Érvénytelen session. Nem folytatható.')
            //logToFile(FileDebugType.error + 'Shard: Érvénytelen session. Nem folytatható.')
        } else if (debug.startsWith('[WS => Shard 0] An open connection was found, attempting an immediate identify.')) {
            log(SHARD + ': Egy nyitott csatlakozást észleltünk, azonnali azonosítás megpróbálása...')
            //logToFile(FileDebugType.warning + 'Shard: Egy nyitott csatlakozást észleltünk, azonnali azonosítás megpróbálása...')
        } else if (debug.startsWith('[WS => Shard 0] [RECONNECT] Discord asked us to reconnect')) {
            log(SHARD + ': Újracsatlakozás... A Discord arra kért minket, hogy csatlakozzunk újra.')
            //logToFile(FileDebugType.warning + 'Shard: Újracsatlakozás... A Discord arra kért minket, hogy csatlakozzunk újra.')
        } else if (debug.startsWith('429 hit on route /gateway/bot')) {
            log(ERROR + ': Shard spam!')
            //logToFile(FileDebugType.error + 'WebSocket: Shard spam!')
        } else if (debug.startsWith('[VOICE (') && debug.includes(')]: [WS] >> {')) {
            //logToFile(FileDebugType.debug + "ytdl: Kommunikálás a szerverrel...")
            log('')
        } else if (debug.includes('Ready with authentication details:')) {
            //logToFile(FileDebugType.debug + "ytdl: Hitelesítés kész")
            log('')
        } else if (debug.startsWith('[VOICE (') && debug.includes(')]: [WS] << {')) {
            //logToFile(FileDebugType.debug + "ytdl: A szerverrel való kapcsolat megfelelő")
            log('')
        } else if (debug.includes(')]: Sending voice state update: {')) {
            //logToFile(FileDebugType.debug + "ytdl: Hangállapot-frissítés küldése...")
            log('')
        } else if (debug.includes('received voice state update:')) {
            //logToFile(FileDebugType.debug + "ytdl: Hangállapot-frissítés kész")
            log('')
        } else if (debug.includes('connection? true')) {
            //logToFile(FileDebugType.debug + "ytdl: Kapcsolat: Kész")
            log('')
        } else if (debug.includes('Setting sessionID')) {
            //logToFile(FileDebugType.debug + "ytdl: Szerver azonosító kész")
            log('')
        } else if (debug.includes('Authenticated with sessionID')) {
            //logToFile(FileDebugType.debug + "ytdl: A szerver azonosítóval hitelesítve")
            log('')
        } else if (debug.includes('received voice server')) {
            //logToFile(FileDebugType.debug + "ytdl: Fogadott hangszerver")
            log('')
        } else if (debug.includes('voiceServer guild')) {
            //logToFile(FileDebugType.debug + "ytdl: voiceServer guild")
            log('')
        } else if (debug.includes(')]: Token "')) {
            //logToFile(FileDebugType.debug + "ytdl: Token")
            log('')
        } else if (debug.includes('Endpoint resolved as')) {
            //logToFile(FileDebugType.debug + "ytdl: Végpont feloldva")
            log('')
        } else if (debug.includes('Connect triggered')) {
            //logToFile(FileDebugType.debug + "ytdl: Csatlakozás előkészítve")
            log('')
        } else if (debug.includes('connect requested')) {
            //logToFile(FileDebugType.debug + "ytdl: Csatlakozás...")
            log('')
        } else if (debug.includes(')]: [WS] connecting,')) {
            //logToFile(FileDebugType.debug + "ytdl: Csatlakozás...")
            log('')
        } else if (debug.includes(')]: [WS] opened at gateway')) {
            //logToFile(FileDebugType.debug + "ytdl: Csatlakozás...")
            log('')
        } else if (debug.includes(')]: Selecting the')) {
            //logToFile(FileDebugType.debug + "ytdl: Csatlakozás...")
            log('')
        } else if (debug.includes(')]: [UDP] created socket')) {
            //logToFile(FileDebugType.debug + "ytdl: [UDP] created socket")
            log('')
        } else if (debug.includes(' Sending IP discovery packet: ')) {
            //logToFile(FileDebugType.debug + "ytdl: Sending IP discovery packet...")
            log('')
        } else if (debug.includes('Successfully sent IP discovery packet')) {
            //logToFile(FileDebugType.debug + "ytdl: Successfully sent IP discovery packet")
            log('')
        } else if (debug.includes(')]: [UDP] message: ')) {
            //logToFile(FileDebugType.debug + "ytdl: [UDP] message")
            log('')
        } else if (debug.includes(')]: [UDP] << {')) {
            //logToFile(FileDebugType.debug + "ytdl: Videó betöltése...")
            log('')
        } else if (debug.includes('Connection clean up')) {
            //logToFile(FileDebugType.debug + "ytdl: A kapcsolat tisztítása...")
            log('')
        } else if (debug.includes('[WS] shutdown requested')) {
            //logToFile(FileDebugType.debug + "ytdl: Lecsatlakozás...")
            log('')
        } else if (debug.includes('[WS] reset requested')) {
            //logToFile(FileDebugType.debug + "ytdl: Visszaállítás...")
            log('')
        } else if (debug.includes('[WS] closed')) {
            //logToFile(FileDebugType.debug + "ytdl: Kilépve")
            log('')
        } else if (debug.includes(')]: Error [WS_NOT_OPEN]: Websocket not open to send')) {
            //logToFile(FileDebugType.error + "ytdl: A Websocket nem nyitott küldésre")
        } else if (debug.includes(')]: [UDP] >> ERROR: Error: send')) {
            //logToFile(FileDebugType.error + "ytdl: Küldési hiba")
        } else {
            log(DEBUG + ': ' + debug, 37)
            //logToFile(FileDebugType.simple + debug)
        }
    };
    */
});

bot.on('warn', warn => {
    log(WARNING & ': ' + warn);
    logToFile(FileDebugType.warning + 'warn:' + warn)
});

bot.on('shardError', (error, shardID) => {
    log(ERROR + ': shardError: ' + error);
    logToFile(FileDebugType.error + 'shardError[' + shardID + ']:' + error)
});

bot.on('invalidated', () => {
    log(ERROR + ': Érvénytelen');
    logToFile(FileDebugType.debug + 'invalidated')
});

bot.on('shardDisconnect', (colseEvent, shardID) => {
    log(ERROR + ': Lecsatlakozva');
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Lecsatlakozva'
    logToFile(FileDebugType.debug + 'shardDisconnect[' + shardID + ']:' + colseEvent.reason + 'Ϊ' + colseEvent.wasClean.toString())
});

bot.on('shardReady', (shardID) => {
    const mainGuild = bot.guilds.cache.get('737954264386764812')
    const quizChannel = mainGuild.channels.cache.get('799340273431478303')
    quizChannel.messages.fetch()
    statesManager.shardCurrentlyLoading = false
    logToFile(FileDebugType.debug + 'shardReady[' + shardID + ']')
});

bot.on('shardReconnecting', (shardID) => {
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Újracsatlakozás...'
    logToFile(FileDebugType.debug + 'shardReconnecting[' + shardID + ']')
});

bot.on('shardResume', (shardID, replayedEvents) => {
    log(SHARD & ': Folytatás: ' + replayedEvents.toString())
    statesManager.shardCurrentlyLoading = false
    logToFile(FileDebugType.debug + 'shardResume[' + shardID + ']:' + replayedEvents.toString())
});

bot.on('raw', async event => {
    log(DEBUG & ': raw');
    logToFile(FileDebugType.debug + 'RAW' + event.toString())

    return

    // `event.t` is the raw event name
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = bot.users.get(data.user_id);
    const channel = bot.channels.get(data.channel_id) || await user.createDM();

    // if the message is already in the cache, don't re-emit the event
    if (channel.messages.has(data.message_id)) return;

    // if you're on the master/v12 branch, use `channel.messages.fetch()`
    const message = await channel.fetchMessage(data.message_id);

    // custom emojis reactions are keyed in a `name:ID` format, while unicode emojis are keyed by names
    // if you're on the master/v12 branch, custom emojis reactions are keyed by their ID
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);

    bot.emit(events[event.t], reaction, user);
});

bot.on('rateLimit', (RateLimitData) => {
    log(DEBUG + ': rateLimit: ' + RateLimitData.limit + '; timeout: ' + RateLimitData.timeout + '; route: "' + RateLimitData.route + '"; method: "' + RateLimitData.method + '"; path: "' + RateLimitData.path + '"');
    logToFile(FileDebugType.debug + 'rateLimit:' + RateLimitData.limit + '; timeout: ' + RateLimitData.timeout + '; route: ' + RateLimitData.route + '; method: ' + RateLimitData.method + '; path: ' + RateLimitData.path)
});

bot.on('close', () => {
    log(SHARD & ': close');
    logToFile(FileDebugType.debug + 'close')
});

bot.on('destroyed', () => {
    log(SHARD & ': destroyed');
    logToFile(FileDebugType.debug + 'destroyed')
});

bot.on('invalidSession', () => {
    log(SHARD & ': invalidSession');
    logToFile(FileDebugType.debug + 'invalidSession')
});
bot.on('allReady', () => {
    log(SHARD & ': allReady');
    logToFile(FileDebugType.debug + 'allReady')
});

bot.on('presenceUpdate', (oldPresence, newPresence) => {
    log(DEBUG & ': newStatus: ' + newPresence.status.toString());
    logToFile(FileDebugType.debug + 'presenceUpdate:' + newPresence.status.toString())
})

bot.ws.on('READY', (data, shardID) => {
    logToFile(FileDebugType.debug + "ws.ready:" + shardID)
})

bot.ws.on('RESUMED', (data, shardID) => {
    logToFile(FileDebugType.debug + "ws.resumed:" + shardID)
})

bot.ws.on('PRESENCE_UPDATE', (data, shardID) => {
    logToFile(FileDebugType.debug + "ws.presenceUpdate:" + shardID)
})

bot.ws.on('VOICE_SERVER_UPDATE', (data, shardID) => {
    logToFile(FileDebugType.debug + "ws.VoiceServerUpdate:" + data)
})

bot.ws.on('VOICE_STATE_UPDATE', (data, shardID) => {
    logToFile(FileDebugType.debug + "ws.VoiceStateUpdate:" + data)
})

bot.on('voiceStateUpdate', (voiceStateOld, voiceStateNew) => {
    if (voiceStateNew.connection === null) {
        logToFile(FileDebugType.debug + "voiceStateUpdate: connection.status:4" +
            ";connection.voice.deaf:false" +
            ";connection.voice.mute:false" +
            ";connection.voice.speaking:false" +
            ";connection.voice.streaming:false")
    } else {
        let voiceSpeaking = ''
        let voiceStreaming = ''
        if (voiceStateNew.connection.voice.speaking === null) {
            voiceSpeaking = "null"
        } else {
            voiceSpeaking = voiceStateNew.connection.voice.speaking.toString()
        }
        if (voiceStateNew.connection.voice.streaming === null) {
            voiceStreaming = "null"
        } else {
            voiceStreaming = voiceStateNew.connection.voice.streaming.toString()
        }

        logToFile(FileDebugType.debug + "voiceStateUpdate: connection.status:" + voiceStateNew.connection.status.toString() +
            ";connection.voice.deaf:" + voiceStateNew.connection.voice.deaf.toString() +
            ";connection.voice.mute:" + voiceStateNew.connection.voice.mute.toString() +
            ";connection.voice.speaking:" + voiceSpeaking +
            ";connection.voice.streaming:" + voiceStreaming)
    }
})
//#endregion
//#region Commands
//#region Command Functions

/**
* @param {Discord.Message} message
* @returns {number}
*/
function calculateAddXp(message) {
    let addScoreValue = message.content.length;
    if (addScoreValue > 20) {
        addScoreValue = 20
    }

    for (let i = 0; i < 5; i++) {
        if (message.content.includes(settings['addXp'][i].link.toString())) {
            addScoreValue = settings['addXp'][i].xp
        }
    }
    if (message.attachments.size) {
        addScoreValue = settings['addXp'][5].xp
    }

    return addScoreValue
};

/**
* @param {number} score
*/
function xpRankIcon(score) {
    let rank = ''
    if (score < 1000) {
        rank = '🔰'
    } else if (score < 5000) {
        rank = 'Ⓜ️'
    } else if (score < 10000) {
        rank = '📛'
    } else if (score < 50000) {
        rank = '💠'
    } else if (score < 80000) {
        rank = '⚜️'
    } else if (score < 100000) {
        rank = '🔱'
    } else if (score < 140000) {
        rank = '㊗️'
    } else if (score < 180000) {
        rank = '🉐'
    } else if (score < 250000) {
        rank = '🉑'
    } else if (score < 350000) {
        rank = '💫'
    } else if (score < 500000) {
        rank = '🌠'
    } else if (score < 780000) {
        rank = '☄️'
    } else if (score < 1000000) {
        rank = '🪐'
    } else if (score < 1500000) {
        rank = '🌀'
    } else if (score < 1800000) {
        rank = '🌌'
    } else {
        rank = '🧿'
    }
    return rank
};

/**
* @param {number} score
*/
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
};

/**
* @param {number} score
*/
function xpRankPrevoius(score) {
    let prevoius = 0
    if (score < 1000) {
        prevoius = 0
    } else if (score < 5000) {
        prevoius = 1000
    } else if (score < 10000) {
        prevoius = 5000
    } else if (score < 50000) {
        prevoius = 10000
    } else if (score < 80000) {
        prevoius = 50000
    } else if (score < 100000) {
        prevoius = 80000
    } else if (score < 140000) {
        prevoius = 100000
    } else if (score < 180000) {
        prevoius = 140000
    } else if (score < 250000) {
        prevoius = 180000
    } else if (score < 350000) {
        prevoius = 250000
    } else if (score < 500000) {
        prevoius = 350000
    } else if (score < 780000) {
        prevoius = 500000
    } else if (score < 1000000) {
        prevoius = 780000
    } else if (score < 1500000) {
        prevoius = 1000000
    } else if (score < 1800000) {
        prevoius = 1500000
    }
    return prevoius
};

/**
* @param {number} score
*/
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
};

function musicGetLengthText(videoLengthSeconds) {
    let videoLengthMinutes = 0
    let videoLengthHours = 0
    for (let l = 0; videoLengthSeconds > 60; l += 1) {
        videoLengthMinutes += 1
        videoLengthSeconds -= 60
    }
    for (let l = 0; videoLengthMinutes > 60; l += 1) {
        videoLengthHours += 1
        videoLengthMinutes -= 60
    }

    let lengthText = '--:--'
    let hours = '' + videoLengthHours
    if (videoLengthHours < 10) {
        hours = '0' + hours
    }
    let minutes = '' + videoLengthMinutes
    if (videoLengthMinutes < 10) {
        minutes = '0' + minutes
    }
    let seconds = '' + videoLengthSeconds
    if (videoLengthSeconds < 10) {
        seconds = '0' + seconds
    }

    if (videoLengthHours === 0) {
        lengthText = minutes + ':' + seconds
    } else {
        lengthText = hours + ':' + minutes + ':' + seconds
    }

    return lengthText
}

/**
* @param {Discord.Message} message
* @returns {boolean}
*/
async function playAudio(message) {
    const link = musicArray[musicArray.length - 1]

    var voiceChannel = message.member.voice.channel;
    voiceChannel.join().then(async connection => {
        musicFinished = false
        musicArray.shift()

        let stream = ytdl(link)
        let info = await ytdl.getInfo(link);
        const dispatcher = connection.play(stream)
            .on("finish", () => {
                musicFinished = true
                if (musicArray.length > 0) {
                    playAudio(message)
                }
            })
            .on("error", (error) => { log(ERROR + ': ' + error, 24) })
            .on("start", () => { statesManager.ytdlCurrentlyPlaying = true; log('') })
            .on("debug", (message) => { log(DEBUG + ': ytdl: ' + message) })
            .on("close", () => { statesManager.ytdlCurrentlyPlaying = false; log('') });

        const embed = new Discord.MessageEmbed()
            .setColor(Color.Purple)
            .setURL(info.videoDetails.video_url)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(info.videoDetails.title)
            .setThumbnail(info.videoDetails.thumbnails[0].url)
            .addField('Csatorna', info.videoDetails.author.name, true)
            .addField('Hossz', musicGetLengthText(info.videoDetails.lengthSeconds), true)
        message.channel.send('> **\\✔️ Most hallható: \\🎧**', embed)
        statesManager.ytdlCurrentlyPlayingText = info.videoDetails.title
        statesManager.ytdlCurrentlyPlayingUrl = link
        return true
    }).catch(err => {
        if (err.toString().startsWith('Error: No video id found:')) {
            message.channel.send('> **\\❌ A videó nem található! \\🎧**')
        } else {
            message.channel.send('> **\\❌ ' + err.toString() + '**')
            log(ERROR + ": " + err, 37)
        }
    });
    return false
};

function userstatsSendMeme(user) {
    userstats[user.id].memes += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(userstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
};
function userstatsSendMusic(user) {
    userstats[user.id].musics += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(userstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
};
function userstatsSendYoutube(user) {
    userstats[user.id].youtubevideos += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(userstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
};
function userstatsSendMessage(user) {
    userstats[user.id].messages += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(userstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
};
function userstatsSendChars(user, text) {
    userstats[user.id].chars += text.length
    fs.writeFile('./database/userstats.json', JSON.stringify(userstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
};
function userstatsSendCommand(user) {
    userstats[user.id].commands += 1
    fs.writeFile('./database/userstats.json', JSON.stringify(userstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
};
function userstatsAddUserToMemory(user) {
    if (!userstats[user.id]) {
        userstats[user.id] = {}
    }
    if (!userstats[user.id].name) {
        userstats[user.id].name = user.username
    }
    if (!userstats[user.id].memes) {
        userstats[user.id].memes = 0
    }
    if (!userstats[user.id].musics) {
        userstats[user.id].musics = 0
    }
    if (!userstats[user.id].youtubevideos) {
        userstats[user.id].youtubevideos = 0
    }
    if (!userstats[user.id].messages) {
        userstats[user.id].messages = 0
    }
    if (!userstats[user.id].chars) {
        userstats[user.id].chars = 0
    }
    if (!userstats[user.id].commands) {
        userstats[user.id].commands = 0
    }
    fs.writeFile('./database/userstats.json', JSON.stringify(userstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
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
        dataBackpacks[userId].tickets += val

        return 0 + '|' + val
    } else if (RandomPercente < 30) { // 20%
        val = 1
        dataBackpacks[userId].crates += val

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
 * @param {Discord.Message} message 
 * @param {Discord.User} sender 
 * @param {boolean} isPrivate
 */
function commandStore(message, sender, isPrivate) {
    var currentDay = new Date().getDay();
    var dayCrates = dataBot.day - database.dataBasic[sender.id].day
    var crates = dataBackpacks[sender.id].crates
    var gifts = dataBackpacks[sender.id].gifts
    var tickets = dataBackpacks[sender.id].tickets
    var getGifts = dataBackpacks[sender.id].getGift
    var smallLuckyCard = dataBackpacks[sender.id].luckyCards.small
    var mediumLuckyCard = dataBackpacks[sender.id].luckyCards.medium
    var largeLuckyCard = dataBackpacks[sender.id].luckyCards.large
    var money = database.dataBasic[sender.id].money

    const embed = new Discord.MessageEmbed()
        .setAuthor(sender.username, sender.displayAvatarURL())
        .setTitle('Hátizsák')
        .addField('Pénz', '\\💵 ' + abbrev(money), false)
        .addField('Alap cuccok',
            '> \\🧱 ' + crates + ' láda\n' +
            '> \\🎁 ' + gifts + ' ajándék\n' +
            '> \\🎟️ ' + tickets + ' kupon\n' +
            '> \\🧰 ' + dayCrates + ' napi láda'
            , false)
        .addField('Sorsjegyek', '> \\💶 ' + smallLuckyCard + ' Black Jack\n> \\💷 ' + mediumLuckyCard + ' Buksza\n> \\💴 ' + largeLuckyCard + ' Fáraók Kincse', false)
    if (isPrivate === true) {
        embed.setFooter('Ha használni szeretnéd az egyik cuccodat, használd a .store parancsot egy szerveren!')
    } else {
        embed.setFooter('Ha használni szeretnéd az egyik cuccodat, kattints az ikonjára!')
    }
    embed.setColor(database.dataBasic[sender.id].color)
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/briefcase_1f4bc.png')
    if (getGifts > 0) {
        if (isPrivate === true) {
            if (getGifts = 1) {
                embed.addField('Van egy ajándékod, ami kicsomagolásra vár!', 'Kattints a 🎀 ikionra, a kicsomagoláshoz')
            } else {
                embed.addField('Van ' + getGifts + ' ajándékod, ami kicsomagolásra vár!', 'Kattints a 🎀 ikionra, a kicsomagoláshoz')
            }
        } else {
            if (getGifts = 1) {
                embed.addField('Van egy ajándékod, ami kicsomagolásra vár!', 'Hogy kicsomagolhasd, használd a `.store` parancsot egy szerveren.')
            } else {
                embed.addField('Van ' + getGifts + ' ajándékod, ami kicsomagolásra vár!', 'Hogy kicsomagolhasd, használd a `.store` parancsot egy szerveren.')
            }
        }
    }

    message.channel.send({ embed }).then(embedMessage => {
        if (isPrivate === true) return;
        if (crates > 0) { embedMessage.react('🧱') };
        if (gifts > 0) { embedMessage.react('🎁') };
        if (getGifts > 0) { embedMessage.react('🎀') };
        if (smallLuckyCard > 0) { embedMessage.react('💶') };
        if (mediumLuckyCard > 0) { embedMessage.react('💷') };
        if (largeLuckyCard > 0) { embedMessage.react('💴') };
        if (dayCrates > 0) { embedMessage.react('🧰') };

        embedMessage.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '🎁' || reaction.emoji.name == '🧱' || reaction.emoji.name == '🎀' || reaction.emoji.name == '💶' || reaction.emoji.name == '💷' || reaction.emoji.name == '💴' || reaction.emoji.name == '🧰'),
            { max: 1, time: 30000 }).then(collected => {
                if (collected.first().emoji.name == '🧱') {
                    dataBackpacks[sender.id].crates -= 1
                    { //Láda kinyitása
                        let replies = ['xp', 'money', 'gift'];
                        let random = Math.floor(Math.random() * 3);
                        let out = replies[random]
                        let val = 0
                        let txt = ''

                        if (out === 'xp') {
                            val = Math.floor(Math.random() * 110) + 10
                            txt = '**\\🍺 ' + val + '** xp-t'
                            database.dataBasic[sender.id].score += val
                        }
                        if (out === 'money') {
                            val = Math.floor(Math.random() * 2000) + 3000
                            txt = '**\\💵' + val + '** pénzt'
                            database.dataBasic[sender.id].money += val
                        }
                        if (out === 'gift') {
                            txt = '**\\🎁 1** ajándékot'
                            dataBackpacks[sender.id].gifts += 1
                        }

                        message.channel.send('> \\🧱 Kaptál:  ' + txt);
                    };
                } else if (collected.first().emoji.name == '🎁') {
                    message.channel.send('> **\\❔ Használd a **`' + perfix + 'gift @Felhasználó`** parancsot, egy személy megajándékozásához!**');
                } else if (collected.first().emoji.name == '🎀') {
                    dataBackpacks[sender.id].getGift -= 1
                    { //Ajándék kinyitása
                        let replies = ['xp', 'money'];
                        let random = Math.floor(Math.random() * 2);
                        let out = replies[random]
                        let val = 0
                        let txt = ''

                        if (out === 'xp') {
                            val = Math.floor(Math.random() * 530) + 210
                            txt = '**\\🍺 ' + val + '** xp-t'
                            database.dataBasic[sender.id].score += val
                        };
                        if (out === 'money') {
                            val = Math.floor(Math.random() * 2300) + 1000
                            txt = '**\\💵' + val + '** pénzt'
                            database.dataBasic[sender.id].money += val
                        };

                        message.channel.send('> \\🎀 Kaptál:  ' + txt + ' pénzt');
                    };
                } else if (collected.first().emoji.name == '💶') {
                    dataBackpacks[sender.id].luckyCards.small -= 1
                    let val = 0

                    var nyeroszam = Math.floor(Math.random() * 2)
                    if (nyeroszam === 1) {
                        val = Math.floor(Math.random() * 1001) + 1500
                        database.dataBasic[sender.id].money += val
                    }

                    if (val === 0) {
                        message.channel.send('> \\💶 Kaptál:  **semmit**')
                    } else {
                        message.channel.send('> \\💶 Kaptál:  **\\💵' + val + '** pénzt')
                    }
                } else if (collected.first().emoji.name == '💷') {
                    dataBackpacks[sender.id].luckyCards.medium -= 1
                    let val = 0

                    var nyeroszam = Math.floor(Math.random() * 4)
                    if (nyeroszam === 1) {
                        val = Math.floor(Math.random() * 3001) + 3000
                        database.dataBasic[sender.id].money += val
                    }

                    if (val === 0) {
                        message.channel.send('> \\💷 Kaptál:  **semmit**')
                    } else {
                        message.channel.send('> \\💷 Kaptál:  **\\💵' + val + '** pénzt')
                    }
                } else if (collected.first().emoji.name == '💴') {
                    dataBackpacks[sender.id].luckyCards.large -= 1
                    let val = 0

                    var nyeroszam = Math.floor(Math.random() * 9)
                    if (nyeroszam === 1) {
                        val = Math.floor(Math.random() * 5001) + 6500
                        database.dataBasic[sender.id].money += val
                    }

                    if (val === 0) {
                        message.channel.send('> \\💴 Kaptál:  **semmit**')
                    } else {
                        message.channel.send('> \\💴 Kaptál:  **\\💵' + val + '** pénzt')
                    }

                } else if (collected.first().emoji.name == '🧰') {
                    commandNapi(message, sender)
                };
                embedMessage.reactions.removeAll()
                saveDatabase()
            }).catch(() => {
                embedMessage.reactions.removeAll();
            });
    });
}

/**
 * @param {Discord.Message} message 
 * @param {Discord.User} sender 
 */
async function commandNapi(message, sender) {
    if (dayOfYear === database.dataBasic[sender.id].day) {
        message.channel.send('> **\\❌ Már kinyitottad a napi ládádat! \\🧰**')
    } else {
        const rewald = openDayCrate(sender.id)
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

        message.channel.send('> \\🧰 Kaptál:  ' + txt);
    };

    database.dataBasic[sender.id].day += 1
    if (database.dataBasic[sender.id].day > dataBot.day) {
        database.dataBasic[sender.id].day = dataBot.day
    }

    await saveDatabase()
}
/**
 * @param {Discord.Message} message 
 * @param {Discord.User} sender 
 */
function commandPms(message, sender) {

}
/**
 * @param {Discord.Message} message 
 * @param {Discord.User} sender 
 */
async function commandAllNapi(message, sender) {
    if (dayOfYear === database.dataBasic[sender.id].day) {
        message.channel.send('> **\\❌ Nincs napi ládád! \\🧰**')
    } else {
        let dayCrates = dataBot.day - database.dataBasic[sender.id].day

        let getXpS = 0
        let getChestS = 0
        let getMoney = 0
        let getTicket = 0
        for (let i = 0; i < dayCrates; i++) {

            const rewald = await openDayCrate(sender.id)
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

        message.channel.send('> ' + dayCrates + 'x \\🧰 Kaptál:\n' +
            '>     \\💵 **' + getMoney + '** pénzt\n' +
            '>     \\🍺 **' + getXpS + '** xpt\n' +
            '>     \\🧱 **' + getChestS + '** ládát\n' +
            '>     \\🎟️ **' + getTicket + '** kupont'
        )
    };

    database.dataBasic[sender.id].day = dataBot.day
    saveDatabase()
}

/**
 * @param {Discord.Message} message 
 * @param {Discord.User} sender 
 */
async function commandAllCrate(message, sender) {
    if (dataBackpacks[sender.id].crates === 0) {
        message.channel.send('> **\\❌ Nincs ládád! \\🧱**')
    } else {
        let Crates = dataBackpacks[sender.id].crates

        let getXpS = 0
        let getGiftS = 0
        let getMoney = 0
        for (let i = 0; i < Crates; i++) {

            let replies = ['xp', 'money', 'gift'];
            let random = Math.floor(Math.random() * 3);
            let out = replies[random]
            let val = 0

            if (out === 'xp') {
                val = Math.floor(Math.random() * 110) + 100
                getXpS += val
                database.dataBasic[sender.id].score += val
            };
            if (out === 'money') {
                val = Math.floor(Math.random() * 2000) + 2000
                getMoney += val
                database.dataBasic[sender.id].money += val
            };
            if (out === 'gift') {
                getGiftS += 1
                dataBackpacks[sender.id].gifts += 1
            };
        }


        message.channel.send('> ' + Crates + 'x \\🧱 Kaptál:\n' +
            '>     \\🍺 **' + getXpS + '** xpt\n' +
            '>     \\💵 **' + getMoney + '** pénzt\n' +
            '>     \\🎁 **' + getGiftS + '** ajándékot'
        )

    };

    dataBackpacks[sender.id].crates = 0
    saveDatabase()
}

/**
* @param {Discord.Message} message
* @param {Discord.Use} sender
* @param {string} newName
*/
function commandPmsName(message, sender, newName) {
    message.channel.send('> **\\⛔ Ez a parancs nem elérhető!**')
}

/**
* @param {Discord.Message} message
*/
async function commandMusic(message, link) {
    if (message.member.voice.channel) {
        musicArray.unshift(link)
        message.channel.send('> **\\➕ Hozzáadva a lejátszólistába \\🎧**')
        if (musicFinished) {
            playAudio(message)
        }

    } else {
        message.channel.send('> **\\❗  Előbb jépj be egy hangcsatornába! \\🎧**')
    }
}

/**
* @param {Discord.Message} message
*/
async function commandMusicList(message) {
    if (musicArray.length === 0 && statesManager.ytdlCurrentlyPlaying === false) {
        message.channel.send('> **\\➖ A lejátszólista üres \\🎧**')
    } else {
        const embed = new Discord.MessageEmbed()
        embed.setAuthor(message.member.displayName, message.author.avatarURL())
        embed.setColor(Color.Purple)
        await ytdl.getBasicInfo(statesManager.ytdlCurrentlyPlayingUrl).then(info => {
            embed.addField('\\🎧 Most hallható: ' + info.videoDetails.title, '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), false)
        })
        musicArray.forEach(async (_link) => {
            await ytdl.getBasicInfo(_link).then(info => {
                embed.addField(info.videoDetails.title, '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), false)
            })
        });
        message.channel.send('> **\\🔜 Lejátszólista: [' + musicArray.length + ']\\🎧**', embed)
    }
}

/**
 * @param {Discord.Message} message 
 */
async function commandSkip(message) {
    if (message.member.voice.channel) {
        musicFinished = true
        if (musicArray.length === 0) {
            message.channel.send('> **\\❌ Nincs következő zene! \\🎧**')
            return
        }
        playAudio(message)
        message.channel.send('> **\\▶️ Zene átugorva \\🎧**')
    } else {
        message.channel.send('> **\\❗  Előbb jépj be egy hangcsatornába! \\🎧**')
    }
}

/**
 * @param {Discord.Message} message 
 * @param {Discord.User} sender 
 */
function commandProfil(message, sender) {
    const embed = new Discord.MessageEmbed()
        .setColor(database.dataBasic[sender.id].color)
        .setTitle('Profil')
        .setAuthor(sender.username, sender.displayAvatarURL())
        .addField('Matricák',
            '> ' + dataStickers[sender.id].stickersMusic + ' \\🎼 Zene\n' +
            '> ' + dataStickers[sender.id].stickersMeme + ' \\🎭 Meme\n' +
            '> ' + dataStickers[sender.id].stickersYoutube + ' \\🎬 YouTube\n' +
            '> ' + dataStickers[sender.id].stickersMessage + ' \\📋 Üzenet\n' +
            '> ' + dataStickers[sender.id].stickersCommand + ' \\🖥️ Parancs\n' +
            '> ' + dataStickers[sender.id].stickersTip + ' \\💡 Ötlet'
        )
        .addField('Statisztika',
            '> \\🎼 Zenék: ' + abbrev(userstats[sender.id].memes) + '\n' +
            '> \\🎭 Vicces dolgok: ' + abbrev(userstats[sender.id].musics) + '\n' +
            '> \\🎬 YouTube linkek: ' + abbrev(userstats[sender.id].youtubevideos) + '\n' +
            '> \\📋 Üzenetek: ' + abbrev(userstats[sender.id].messages) + '\n' +
            '> \\🖥️ Parancsok:' + abbrev(userstats[sender.id].commands) + '\n' +
            '> \\👁‍🗨 Összes karakter: ' + abbrev(userstats[sender.id].chars)
        )
        .addField('meta',
            '> \\🏆 medal-0a: 0\n' +
            '> \\🥇 medal-1a: 0\n' +
            '> \\🥈 medal-1b: 0\n' +
            '> \\🥉 medal-1c: 0\n' +
            '> \\🏅 medal-1d: 0\n' +
            '> \\🎖️ medal-2a: 0\n' +
            '> \\🀄 card-0a: 0\n' +
            '> \\🃏 card-0b: 0\n' +
            '> \\🎴 card-0c: 0\n' +
            '> \\🧧 card-1a: 0'
        )
    message.channel.send(embed);
}

function quiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue) {
    const optionEmojis = listOfOptionEmojis.toString().replace(' ', '').split(';')
    const optionTexts = listOfOptionText.toString().replace(' ', '').split(';')
    let optionText = ''
    for (let i = 0; i < optionTexts.length; i++) {
        optionText += `${optionEmojis[i]}  ${optionTexts[i]}\n`
    }
    const embed = new Discord.MessageEmbed()
        .setColor(Color.Pink)
        .setTitle('Quiz!')
        .setDescription(`\\✔️  **${addXpValue}\\🍺**\n\\❌ **-${removeXpValue}\\🍺**`)
        .addField(`${titleText}`, `${optionText}`)

    bot.channels.cache.get('799340273431478303').send(embed).then(message => {
        message.channel.send('> <@&799342836931231775>')
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
        .addField(`${titleText}`, `${optionText}`);

    bot.channels.cache.get('795935090026086410').send(embed).then(message => {
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

function quizDone(correctText) {
    const embed = new Discord.MessageEmbed()
        .setColor(Color.Pink)
        .setTitle('Quiz...')
        .setDescription(`A helyes válasz: **${correctText}**!`)
        .setFooter('A nyertesek, minnél előbb megkapját a jutalmat, aki pedig rosszul tippelt, annak levonásra kerül az összeg.')

    bot.channels.cache.get('799340273431478303').send(embed).then(message => {
        message.channel.send('> <@&799342836931231775>')
    })
}
//#endregion

/**
 * @param {Date} date
 */
function DateToString(date) {
    var now = new Date(Date.now())
    if (now.getFullYear() == date.getFullYear()) {
        if (now.getMonth() == date.getMonth()) {
            if (now.getDay() == date.getDay()) {
                if (now.getHours() == date.getHours()) {
                    if (now.getMinutes() == date.getMinutes()) {
                        if (now.getSeconds() == date.getSeconds()) {
                            return "most"
                        } else {
                            return (now.getSeconds() - date.getSeconds()) + " másodperce"
                        }
                    } else {
                        return (now.getMinutes() - date.getMinutes()) + " perce"
                    }
                } else {
                    return (now.getHours() - date.getHours()) + " órája"
                }
            } else {
                return (now.getDay() - date.getDay()) + " napja"
            }
        } else {
            return (now.getMonth() - date.getMonth()) + " hónapja"
        }
    } else {
        return (now.getFullYear() - date.getFullYear()) + " éve"
    }
}

bot.on('clickButton', async (button) => {
    try {
        if (button.clicker.user.username === button.message.embeds[0].author.name) { } else {
            button.reply.send('> \\❗ **Ez nem a tied!**', true)
            return;
        }
    } catch (error) { }

    let isOnPhone = false
    let isInDebugMode = false
    let playerIndex = 0

    try {

        if (getGameUserSettings(button.clicker.user.id) !== null) {
            isOnPhone = getGameUserSettings(button.clicker.user.id).isOnPhone
        }

        if (getGameUserSettings(button.clicker.user.id) !== null) {
            isInDebugMode = getGameUserSettings(button.clicker.user.id).isInDebugMode
        }
    } catch (error) { }

    try {
        playerIndex = getPlayerIndex(button.clicker.user.id)
    } catch (error) { }

    if (button.id === 'sendHelp') {
        const thisIsPrivateMessage = button.channel.type === 'dm'
        CommandHelp(button.channel, button.clicker.user, thisIsPrivateMessage)

        button.reply.defer()
        button.message.delete()

        return;
    } else if (button.id === 'mailFolderMain') {
        const message = getMailMessage(button.clicker.user, 0)
        button.message.edit({ embed: message.embed, component: message.actionRows[0] })
    } else if (button.id === 'mailFolderInbox') {
        const message = getMailMessage(button.clicker.user, 1)
        button.message.edit({ embed: message.embed, component: message.actionRows[0] })
    } else if (button.id === 'mailFolderOutbox') {
        const message = getMailMessage(button.clicker.user, 2)
        button.message.edit({ embed: message.embed, component: message.actionRows[0] })
    } else if (button.id === 'mailWrite') {

        currentlyWritingEmails.push(
            new CurrentlyWritingMail(
                button.clicker.user,
                new Mail(
                    -1,
                    new MailUser(button.clicker.user.username, button.clicker.user.id),
                    new MailUser(button.clicker.user.username, button.clicker.user.id),
                    'Cím',
                    'Üzenet'
                ),
                button.message
            ))

        const message = getMailMessage(button.clicker.user, 3)
        button.message.edit({ embed: message.embed, component: message.actionRows[0] })
    } else if (button.id === 'mailWriteAbort') {
        const message = getMailMessage(button.clicker.user)
        button.message.edit({ embed: message.embed, component: message.actionRows[0] })
        currentlyWritingEmails.splice(getCurrentlyEditingMailIndex(button.clicker.user.id), 1)
    } else if (button.id === 'mailWriteSend') {
        const editingMail = currentlyWritingEmails[getCurrentlyEditingMailIndex(button.clicker.user.id)]
        let newMail = editingMail.mail
        newMail.date = Date.now()
        newMail.sender = new MailUser(editingMail.user.username, editingMail.user.id)
        newMail.id = generateMailId()
        const sended = sendMailOM(newMail)

        if (sended === true) {
            editingMail.message.channel.send('\\✔️ **A levél elküldve neki: ' + editingMail.mail.reciver.name + '**')

            const message = getMailMessage(button.clicker.user)
            button.message.edit({ embed: message.embed, component: message.actionRows[0] })
            currentlyWritingEmails.splice(getCurrentlyEditingMailIndex(button.clicker.user.id), 1)
        } else {
            editingMail.message.channel.send('\\❌ **A levelet nem sikerült elküldeni**')
        }
    }
    if (button.id.startsWith('game')) {
        if (gameMap == null) {
            button.channel.send('> \\❗ **Nincs létrehozva játék!**', true)
        } else {
            if (button.id === 'gameW') {
                gameMap.players[playerIndex].direction = Direction.Up
                if (playerCanMoveToHere(gameMap.players[playerIndex].x, gameMap.players[playerIndex].y - 1, gameMap) === true) {
                    gameMap.players[playerIndex].y -= 1
                }
                gameResetCameraPos(isOnPhone, button.clicker.user)

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)
            } else if (button.id === 'gameA') {
                gameMap.players[playerIndex].direction = Direction.Left
                if (playerCanMoveToHere(gameMap.players[playerIndex].x - 1, gameMap.players[playerIndex].y, gameMap) === true) {
                    gameMap.players[playerIndex].x -= 1
                }
                gameResetCameraPos(isOnPhone, button.clicker.user)

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)
            } else if (button.id === 'gameS') {
                gameMap.players[playerIndex].direction = Direction.Down
                if (playerCanMoveToHere(gameMap.players[playerIndex].x, gameMap.players[playerIndex].y + 1, gameMap) === true) {
                    gameMap.players[playerIndex].y += 1
                }
                gameResetCameraPos(isOnPhone, button.clicker.user)

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)
            } else if (button.id === 'gameD') {
                gameMap.players[playerIndex].direction = Direction.Right
                if (playerCanMoveToHere(gameMap.players[playerIndex].x + 1, gameMap.players[playerIndex].y, gameMap) === true) {
                    gameMap.players[playerIndex].x += 1
                }
                gameResetCameraPos(isOnPhone, button.clicker.user)

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)
            } else if (button.id === 'gameHit') {
                /**
                 * @type {MapPoint}
                 */
                let mapPoint
                if (gameMap.players[playerIndex].direction === Direction.Up) {
                    mapPoint = getMapPoint(gameMap.players[playerIndex].x, gameMap.players[playerIndex].y - 1, gameMap)
                } else if (gameMap.players[playerIndex].direction === Direction.Right) {
                    mapPoint = getMapPoint(gameMap.players[playerIndex].x + 1, gameMap.players[playerIndex].y, gameMap)
                } else if (gameMap.players[playerIndex].direction === Direction.Down) {
                    mapPoint = getMapPoint(gameMap.players[playerIndex].x, gameMap.players[playerIndex].y + 1, gameMap)
                } else if (gameMap.players[playerIndex].direction === Direction.Left) {
                    mapPoint = getMapPoint(gameMap.players[playerIndex].x - 1, gameMap.players[playerIndex].y, gameMap)
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
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Wood, 1)
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.blossom) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.cactus) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.cherryBlossom) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.hibiscus) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.igloo) {

                        } else if (breakableObj.type === MapObjectType.mushroom) {

                        } else if (breakableObj.type === MapObjectType.palm) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Wood, 3)
                        } else if (breakableObj.type === MapObjectType.plant) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.rice) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 2)
                        } else if (breakableObj.type === MapObjectType.rose) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.spruce) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Wood, 4)
                        } else if (breakableObj.type === MapObjectType.sunflower) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.tanabataTree) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Wood, 2)
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        } else if (breakableObj.type === MapObjectType.tree) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Wood, 4)
                        } else if (breakableObj.type === MapObjectType.tulip) {
                            addItemToPlayer(gameMap.players[playerIndex], ItemType.Grass, 1)
                        }
                        mapPoint.object = null
                    }
                }

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)
            } else if (button.id === 'gameUse') {

            } else if (button.id === 'gameSwitchPhone') {
                for (let i = 0; i < gameUserSettings.length; i++) {
                    if (gameUserSettings[i].userId === button.clicker.user.id) {
                        if (isOnPhone === true) {
                            gameUserSettings[i].isOnPhone = false
                        } else {
                            gameUserSettings[i].isOnPhone = true
                        }
                    }
                }

                if (getGameUserSettings(button.clicker.user.id) !== null) {
                    isOnPhone = getGameUserSettings(button.clicker.user.id).isOnPhone
                }

                gameResetCameraPos(isOnPhone, button.clicker.user)

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)

                log(gameUserSettings);
            } else if (button.id === 'gameSwitchDebug') {
                for (let i = 0; i < gameUserSettings.length; i++) {
                    if (gameUserSettings[i].userId === button.clicker.user.id) {
                        if (isInDebugMode === true) {
                            gameUserSettings[i].isInDebugMode = false
                        } else {
                            gameUserSettings[i].isInDebugMode = true
                        }
                    }
                }

                if (getGameUserSettings(button.clicker.user.id) !== null) {
                    isInDebugMode = getGameUserSettings(button.clicker.user.id).isInDebugMode
                }

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)

                log(gameUserSettings);
            } else if (button.id === 'gameRestart') {
                gameMap = createGame(50, 50)
                connectTogame(button.clicker.user)
                gameResetCameraPos(isOnPhone, button.clicker.user)

                resetGameMessage(button.clicker.user, button.message, isOnPhone, isInDebugMode)
            }
        }
    }
    if (button.id.startsWith('pollOption')) {
        const optionIndex = button.id.replace('pollOption', '')
        try {
            /**
             * @type {string[]}
             */
            const usersAreVoted = dataPolls.messages[button.message.id].userIds
            if (usersAreVoted.includes(button.clicker.user.id)) {
                if (button.reply.has) {
                    button.reply.send('> \\❗ **Te már választottál egy opciót**', true)
                } else {
                    button.clicker.user.send('> \\❗ **Te már választottál egy opciót**')
                }
            } else {
                dataPolls.messages[button.message.id].optionValues[optionIndex] += 1
                dataPolls.messages[button.message.id].userIds.push(button.clicker.user.id)
                saveDatabase()
                reloadDatabase()
            }
        } catch (error) {
            button.message.channel.send('> \\❌ **Hiba: ' + error.message + '**')
        }
        button.reply.defer()
        console.log(dataPolls);
    } else if (button.id === 'pollFinish') {
        try {
            const savedMessageInfo = dataPolls.messages[button.message.id]
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
});

bot.on('clickMenu', async (menu) => {
    menu.message.channel.send(menu.id)
    menu.reply.defer()
})

async function readIncomingDatas(_data) {
    let data = ''
    data = _data
    if (data.includes('ά')) {
        let channelId = ''
        let messageText = ''
        const inputPieces = data.split('ά')
        channelId = inputPieces[0].substring(1)
        messageText = inputPieces[1]

        console.log(data)
        console.log(inputPieces)
        console.log(channelId)

        let channel = Discord.Channel
        channel = bot.channels.cache.get(channelId).send(messageText).then(() => {
            logToFile("ΣÜzenet elküldve")
        })
        /*} else if (data.includes('READSCORES')) {
            let finalOutputData = ''
            finalOutputData += 'δDAY' + dataBot.day + '\n'
            const memberList = ['726127512521932880', '551299555698671627', '494126778336411648', '750748417373896825', '575727604708016128', '504304776033468438', '638644689507057683', '591218715803254784', '583709720834080768', '415078291574226955']
            for (let i = 0; i < memberList.length; i++) {
                try {
                    const member = bot.users.cache.get(memberList[i])
                    if (member) { if (scores[member.id]) {
                        finalOutputData += 'δSTARTSCORESDATA' + member.id + '\n'
                        finalOutputData += 'δSCORESDATAscoreĂ' + scores[member.id].score + '\n'
                        finalOutputData += 'δSCORESDATAmoneyĂ' + scores[member.id].money + '\n'
                        finalOutputData += 'δSCORESDATAcratesĂ' + scores[member.id].crates + '\n'
                        finalOutputData += 'δSCORESDATAgiftsĂ' + scores[member.id].gifts + '\n'
                        finalOutputData += 'δSCORESDATAdayĂ' + scores[member.id].day + '\n'
                        finalOutputData += 'δSCORESDATAgetGiftĂ' + scores[member.id].getGift + '\n'
                        finalOutputData += 'δSCORESDATAusernameĂ' + scores[member.id].username + '\n'
                        finalOutputData += 'δSCORESDATAsmallLuckyCardĂ' + scores[member.id].smallLuckyCard + '\n'
                        finalOutputData += 'δSCORESDATAmediumLuckyCardĂ' + scores[member.id].mediumLuckyCard + '\n'
                        finalOutputData += 'δSCORESDATAlargeLuckyCardĂ' + scores[member.id].largeLuckyCard + '\n'
                        finalOutputData += 'δSCORESDATAhaveMoneyMakerĂ' + scores[member.id].haveMoneyMaker + '\n'
                        finalOutputData += 'δSCORESDATAmoneyMakerLevelĂ' + scores[member.id].moneyMakerLevel + '\n'
                        finalOutputData += 'δSCORESDATAmoneyMakerNameĂ' + scores[member.id].moneyMakerName + '\n'
                        finalOutputData += 'δSCORESDATAmoneyMakerDayĂ' + scores[member.id].moneyMakerDay + '\n'
                        finalOutputData += 'δSCORESDATAstickersMemeĂ' + scores[member.id].stickersMeme + '\n'
                        finalOutputData += 'δSCORESDATAstickersMusicĂ' + scores[member.id].stickersMusic + '\n'
                        finalOutputData += 'δSCORESDATAstickersYoutubeĂ' + scores[member.id].stickersYoutube + '\n'
                        finalOutputData += 'δSCORESDATAstickersMessageĂ' + scores[member.id].stickersMessage + '\n'
                        finalOutputData += 'δSCORESDATAchallengeDayĂ' + scores[member.id].challengeDay + '\n'
                        finalOutputData += 'δSCORESDATAchallengeWeekĂ' + scores[member.id].challengeWeek + '\n'
                        finalOutputData += 'δSCORESDATAdayChallengeAĂ' + scores[member.id].dayChallengeA + '\n'
                        finalOutputData += 'δSCORESDATAdayChallengeBĂ' + scores[member.id].dayChallengeB + '\n'
                        finalOutputData += 'δSCORESDATAdayChallengeCĂ' + scores[member.id].dayChallengeC + '\n'
                        finalOutputData += 'δSCORESDATAweekChallengeAĂ' + scores[member.id].weekChallengeA + '\n'
                        finalOutputData += 'δSCORESDATAweekChallengeBĂ' + scores[member.id].weekChallengeB + '\n'
                        finalOutputData += 'δSCORESDATAweekChallengeCĂ' + scores[member.id].weekChallengeC + '\n'
                        finalOutputData += 'δSCORESDATAstickersChallengeĂ' + scores[member.id].stickersChallenge + '\n'
                        finalOutputData += 'δSCORESDATAstickersCommandĂ' + scores[member.id].stickersCommand + '\n'
                        finalOutputData += 'δSCORESDATAstickersTipĂ' + scores[member.id].stickersTip + '\n'
                        finalOutputData += 'δENDSCORESDATA'
                    }}
                } catch (error) {
                    logToFile(FileDebugType.error + error)
                    log(ERROR + ": " + error)
                }
            }
            logToFile(finalOutputData)
        } else if (data.includes('SEND')) {
            if (data.includes('MONEY')) {
                let id = ''
                let value = 0
                id = data.split("|")[1]
                value = data.split("|")[2]
                console.log(data)
                console.log("Money")
                console.log(id)
                console.log(value)
    
                const member = bot.users.cache.get(id)
                console.log(member.username)
    
                console.log(scores[member.id].money)
                scores[member.id].money += parseInt(value)
                console.log(scores[member.id].money)
                
                logToFile("MONEYADDED|" + member.username + "|" + value)
            }
            if (data.includes('XP')) {
                let id = ''
                let value = 0
                id = data.split("|")[1]
                value = data.split("|")[2]
                console.log(data)
                console.log("Score")
                console.log(id)
                console.log(value)
    
                const member = bot.users.cache.get(id)
                console.log(member.username)
    
                console.log(scores[member.id].score)
                scores[member.id].score += parseInt(value)
                console.log(scores[member.id].score)
    
                logToFile("XPADDED|" + member.username + "|" + value)
            }*/
    } else if (data.includes('REACT')) {
        let messageId = ''
        let reactIco = ''
        messageId = data.replace('REACT', '').split("|")[1]
        reactIco = data.replace('REACT', '').split("|")[2]
        console.log(messageId)
        console.log(reactIco)
    } else if (data.includes('PING')) {
        logToFile('PONG')
    } else if (data.includes('GETINFO')) {
        try {
            await logToFile(FileDebugType.debug + "READYAT" + bot.readyTimestamp)
            if (bot.shard !== null) {
                await logToFile(FileDebugType.debug + "SHARD.COUNT" + bot.shard.count)
                await logToFile(FileDebugType.debug + "SHARD.MODE" + bot.shard.mode.toString())
                await logToFile(FileDebugType.debug + "SHARD.PARENTPORT" + bot.shard.parentPort.toString())
            }
            await logToFile(FileDebugType.debug + "WS.GATEWAY" + bot.ws.gateway)
            await logToFile(FileDebugType.debug + "WS.STATUS" + bot.ws.status)
        } catch (error) {
            await logToFile(FileDebugType.error + error.message)
        }
        logToFile(FileDebugType.debug + "GETINFOEND")
    }
}
const getApp = (guildId) => {
    const app = bot.api.applications(bot.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

bot.ws.on('INTERACTION_CREATE', async (interaction) => {
    const command = interaction.data.name.toLowerCase()

    if (command == 'ping') {
        bot.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: 'pong',
                },
            },
        })
    }
    console.log(interaction)
})

/**
 * @param {string} id
 * @returns {string}
 */
function ConvertNewsIdToName(id) {
    if (id == '802864588877856789') {
        return 'Crossout - Bejelentés'
    } else if (id == '802864713323118603') {
        return 'Ingyenes Játékok'
    } else if (id == '813398275305898014') {
        return 'Warzone 2100 - Bejelentés'
    } else if (id == '875340034537062400') {
        return 'Minecraft - Frissítés'
    } else {
        return id
    }
}

/**
 * @param {Date} date
 * @returns {string}
 */
function DateToStringNews(date) {
    let str = ''
    str += date.getFullYear() + '.'
    let monthStr = (date.getMonth() + 1) + '.'
    if (monthStr == '1') {
        monthStr = 'Jan.'
    } else if (monthStr == '2') {
        monthStr = 'Febr.'
    } else if (monthStr == '3') {
        monthStr = 'Márc.'
    } else if (monthStr == '4') {
        monthStr = 'Ápr.'
    } else if (monthStr == '5') {
        monthStr = 'Máj.'
    } else if (monthStr == '6') {
        monthStr = 'Jún.'
    } else if (monthStr == '7') {
        monthStr = 'Júl.'
    } else if (monthStr == '8') {
        monthStr = 'Aug.'
    } else if (monthStr == '9') {
        monthStr = 'Szept.'
    } else if (monthStr == '10') {
        monthStr = 'Okt.'
    } else if (monthStr == '11') {
        monthStr = 'Nov.'
    } else if (monthStr == '12') {
        monthStr = 'Dec.'
    }
    str += ' ' + monthStr
    str += ' ' + date.getDate() + '.'
    str += ' ' + date.getHours() + ':' + date.getMinutes()
    return str
}

bot.once('ready', async () => { //Ready
    const commands = await getApp('737954264386764812').commands.get()
    //log(commands)

    await getApp('737954264386764812').commands.post({
        data: {
            name: 'ping',
            description: 'A simple ping command'
        },
    })

    const lastDay = dataBot.day
    dataBot.day = dayOfYear
    fs.writeFile('./database/bot.json', JSON.stringify(dataBot), (err) => { if (err) { log(ERROR & ': ' & err.message, 37) }; });

    console.clear()
    log(DONE + ': A BOT kész!')

    for (let i = 0; i < dayOfYear - lastDay; i++) {
        for (let i = 0; i < listOfUserIDs.length; i++) {
            const element = listOfUserIDs[i];
            try {
                const userMoney = database.dataBasic[element].money
                const finalTax = Math.floor(userMoney * 0.001) * 2
                const userMoneyFinal = userMoney - finalTax
                log("[" + userMoney + " ---1%-->" + finalTax + " ======>" + userMoneyFinal + "]")
                database.dataBasic[element].money = userMoneyFinal
                logToFile("TAX:" + database.dataBasic[element].username + "   " + userMoney + " ===[" + finalTax + "]===>" + database.dataBasic[element].money)
            } catch (error) {
                log(ERROR + ': ' + error)
            }
        }
        log("Mindenki megadózva")
        logToFile("TAX COMPLETED")
    }
    savePollDefaults()
    saveDatabase()

    const channel = bot.channels.cache.get(incomingNewsChannel)
    channel.messages.fetch({ limit: 10 }).then(async (messages) => {
        /**
         * @type {[Discord.Message]}
         */
        const listOfMessage = []
        /**
         * @type {[Discord.Message]}
         */
        const listOfMessageAll = []

        const fileContent = fs.readFileSync('C:/Users/bazsi/Desktop/Discord/processedNewsMessageIDs.txt', 'utf-8')
        const listOfProcessedMessageIDs = fileContent.split('\n')

        messages.forEach((message) => {
            if (listOfProcessedMessageIDs.includes(message.id) == false) {
                listOfMessage.push(message)
            }
            listOfMessageAll.push(message)
        })



        listOfMessage.reverse()
        listOfMessage.forEach(message => {
            processNewsMessage(message)
        })
        log(`Received ${listOfMessage.length} news`)

        if (newsSaveProcessedMessages == true) {
            await fs.writeFileSync('C:/Users/bazsi/Desktop/Discord/processedNewsMessageIDs.txt', '')
            listOfMessageAll.forEach(async (message) => {
                await fs.appendFileSync('C:/Users/bazsi/Desktop/Discord/processedNewsMessageIDs.txt', `\n${message.id}`)
            })
        }

    })

    logToFile('PONG')
})

/**
 * @param {Discord.Message} message
 */
function processNewsMessage(message) {
    let role = ''
    const newDate = new Date(message.createdTimestamp)
    const embed = new Discord.MessageEmbed()
        .setAuthor(ConvertNewsIdToName(message.author.id), message.author.displayAvatarURL())
        .setDescription(message.content)
        .setColor(Color.Highlight)
        .setFooter('• ' + DateToStringNews(newDate));
    if (message.author.id == '802864588877856789') {
        embed.setAuthor(ConvertNewsIdToName(message.author.id), message.author.displayAvatarURL(), 'https://crossout.net/en/#/')
        if (message.embeds.length > 0) {
            if (message.content.includes('@Entertainment')) {
                role = '902881176719622145'
            } else if (message.content.includes('@Console News')) {
                role = '902878741364105238'
            } else if (message.content.includes('@PC News')) {
                role = '902878695742652437'
            } else {
                role = '902877945876598784'
            }

            const embed2 = message.embeds[0]

            let title = embed2.title
            if (title.includes('PS4') || title.includes('Xbox') || title.includes('PlayStation')) {
                role = '902878741364105238'
            } else if (title.includes('PC')) {
                role = '902878695742652437'
            }
            title = title
                .replace('[Sale]', '')
                .replace('[Developer blog]', '')
                .replace('[Panorama]', '')
                .replace('[Announcement]', '')
                .replace('[PS4]', '')
                .replace('[Xbox]', '')
                .replace('[Update]', '')
                .replace('[Video]', '')
                .replace('[Special]', '')
                .replace('[PC]', '')
                .replace('[Stories]', '')
                .replace('[Calendar]', '');
            while (title.startsWith(' ')) {
                title = title.substring(1)
            }
            embed.setTitle(title)
            embed.setURL(embed2.url)
            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            embed.setDescription(embed2.description)
            embed.setFooter(message.content.replace('@', '• #') + '\n• ' + DateToStringNews(newDate))
        }
    } else if (message.author.id == '813398275305898014') {
        embed.setAuthor(ConvertNewsIdToName(message.author.id), message.author.displayAvatarURL(), 'https://wz2100.net/')
        if (message.embeds.length > 0) {
            const embed2 = message.embeds[0]

            let content = message.content.replace('@everyone:', '').replace('@everyone', '')
            while (content.startsWith(' ')) {
                content = content.substring(1)
            }
            embed.setDescription(content)

            embed.setTitle(embed2.title)
            embed.setURL(embed2.url)
            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            if (embed2.thumbnail != null) {
                embed.setImage(embed2.thumbnail.url)
            }
        }
        role = '902878851938517043'
    } else if (message.author.id == '802864713323118603') {
        embed.setAuthor(ConvertNewsIdToName(message.author.id), message.author.displayAvatarURL())
        if (message.embeds.length == 1) {
            let content = message.content.replace('@Free Games Ping', '')
            let title = ''
            let url = ''
            while (content.startsWith(' ')) {
                content = content.substring(1)
            }
            const aaaaaa = content.split('\n')
            for (let i = 0; i < aaaaaa.length; i++) {
                const bbbbbb = aaaaaa[i]
                if (i == 0) {
                    title = bbbbbb
                    content = content.replace(bbbbbb, '')
                } else if (i == 1) {
                    url = bbbbbb
                    if (url.startsWith('<http')) {
                        url = url.substring(1)
                    }
                    if (url.endsWith('>')) {
                        url = url.substring(0, url.length - 1)
                    }
                    content = content.replace(bbbbbb, '')
                }
            }

            const embed2 = message.embeds[0]

            embed.setDescription(content)
            embed.setTitle(title)
            embed.setURL(url)

            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            if (embed2.thumbnail != null) {
                embed.setImage(embed2.thumbnail.url)
            }
        }
        role = '902878798956093510'
    } else if (message.author.id == '875340034537062400') {
        embed.setAuthor(ConvertNewsIdToName(message.author.id), 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/apple-icon-180x180.png', 'https://www.minecraft.net/en-us')

        let content = message.content
        let title = ''
        let url = ''
        while (content.startsWith(' ')) {
            content = content.substring(1)
        }
        const aaaaaa = content.split('\n')
        for (let i = 0; i < aaaaaa.length; i++) {
            const bbbbbb = aaaaaa[i]
            if (i == 0) {
                title = bbbbbb
                content = content.replace(bbbbbb, '')
            } else if (i == 1) {
                url = bbbbbb
                content = content.replace(bbbbbb, '')
            } else if (i == 2) {
                content = content.substring(1)
            }
        }
        embed.setDescription(content)
        embed.setTitle(title)
        embed.setURL(url)

        if (message.embeds.length == 1) {
            console.log(message.embeds[0])

            const embed2 = message.embeds[0]

            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            if (embed2.thumbnail != null) {
                embed.setImage(embed2.thumbnail.url)
            }
        }
        role = '902878964438143026'
    }

    listOfNews.push(new NewsMessage(embed, role, message))
}

bot.on('ready', () => { //Change status
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        bot.user.setActivity(activities_list[index]);
    }, 10000);
    setInterval(() => {
        try {
            const input = fs.readFileSync('in.txt', 'utf-8')
            if (input === lastInput) { } else {
                readIncomingDatas(input)

                lastInput = input
            }
        }
        catch (err) {
            logToFile(FileDebugType.error + err)
            console.log(err)
        }

        if (listOfNews.length > 0) {
            const newsMessage = listOfNews.shift()
            /**
             * @type {Discord.TextChannel}
             */
            const newsChannel = bot.channels.cache.get(processedNewsChannel)
            const embed = newsMessage.embed
            if (newsMessage.NotifyRoleId.length == 0) {
                newsChannel.send({ embed }).then((result) => {
                    newsMessage.message.delete()
                }).catch((err) => {

                });
            } else {
                newsChannel.send(`<@&${newsMessage.NotifyRoleId}>`, { embed }).then((result) => {
                    newsMessage.message.delete()
                }).catch((err) => {

                });
            }
        }

    }, 2000);
})
bot.on('message', async message => { //Message
    const thisIsPrivateMessage = message.channel.type === 'dm'
    if (message.author.bot && thisIsPrivateMessage === false) {
        logToFile(FileDebugType.discordMessage + bot.user.username + "Ϊ" + message.content + "Ϊ" + bot.user.avatarURL({ format: 'png', size: 64 }) + "Ϊ" + message.id + "Ϊ" + message.channel.id + "Ϊ" + message.guild.id)
        return
    }
    if (!message.type) return
    let args = message.content.substring(perfix.length).split(' ')
    let sender = message.author

    reloadDatabase()

    //#region Log
    if (!message.member === null) {
        logMessage(message, message.member.displayName, false, sender)
    } else {
        if (message.channel.guild) {
            logMessage(message, sender.username, false, sender)
        } else {
            logMessage(message, sender.username, true, sender)
        }
    };
    userstatsAddUserToMemory(sender)
    if (message.channel.id === '744979145460547746') { //Memes channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://www.reddit.com/r/')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
            userstatsSendMeme(sender)
        }
        if (message.content.includes('https://tenor.com/view/')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
            userstatsSendMeme(sender)
        }
        if (message.attachments.size) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
            userstatsSendMeme(sender)
        }
    }
    if (message.channel.id === '775430473626812447') { //Youtube channel
        if (message.content.includes('https://www.youtube.com/')) {
            message.react('👍')
            message.react('👎')
            message.react('😲')
            userstatsSendYoutube(sender)
        }
        if (message.content.includes('https://youtu.be/')) {
            message.react('👍')
            message.react('👎')
            message.react('😲')
            userstatsSendYoutube(sender)
        }
    }
    if (message.channel.id === '738772392385577061') { //Music channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            message.react('👍')
            message.react('👎')
            userstatsSendMusic(sender)
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            message.react('👍')
            message.react('👎')
            userstatsSendMusic(sender)
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            message.react('👍')
            message.react('👎')
            userstatsSendMusic(sender)
        }
        if (message.content.includes('https://youtu.be/')) {
            message.react('👍')
            message.react('👎')
            userstatsSendMusic(sender)
        }
        if (message.attachments.size) {
            message.react('👍')
            message.react('👎')
            userstatsSendMusic(sender)
        }
    }

    userstatsSendMessage(sender)
    userstatsSendChars(sender, message.content.toString())
    //#endregion

    //#region News
    if (message.channel.id == incomingNewsChannel) {
        const fileContent = fs.readFileSync('C:/Users/bazsi/Desktop/Discord/processedNewsMessageIDs.txt', 'utf-8')
        const listOfProcessedMessageIDs = fileContent.split('\n')

        if (listOfProcessedMessageIDs.includes(message.id) == false) {
            processNewsMessage(message)
            if (newsSaveProcessedMessages == true) {
                await fs.appendFileSync('C:/Users/bazsi/Desktop/Discord/processedNewsMessageIDs.txt', `\n${message.id}`)
            }
        }

        log(`Received a news message`)
    }
    //#endregion

    log(thisIsPrivateMessage.toString())

    if (thisIsPrivateMessage) {
        saveUserToMemoryAll(sender, sender.username)
    } else {
        saveUserToMemoryAll(sender, message.member.displayName.toString())
    }


    if (message.content.length > 2) {
        if (thisIsPrivateMessage === false) {
            addXp(sender, message.channel, calculateAddXp(message))
        }
    }


    if (message.content.startsWith(`${perfix}`)) {
        processCommand(message, thisIsPrivateMessage, sender, message.content.substring(1))
        return;
    }

    if (listOfHelpRequiestUsers.includes(message.author.id) === true) {
        if (message.content.toLowerCase().includes('igen')) {
            message.reply('Használd a `.help` parancsot!')
        } else if (message.content.toLowerCase().includes('nem')) {
            message.reply('Ja ok')
        }
        delete listOfHelpRequiestUsers[listOfHelpRequiestUsers.indexOf(message.author.id)];
    } else {
        if (message.content.includes('<@!738030244367433770>')) {
            message.reply('Segítség kell?')
            listOfHelpRequiestUsers.push(message.author.id)
        }
    }
})
bot.on('messageReactionRemove', (messageReaction, user) => { //React
    logToFile(FileDebugType.discordReactionRemove + messageReaction.message.id + "Ϊ" + messageReaction.emoji.name + "Ϊ" + user.id)

    if (user.bot) { return }

    if (!dataUsernames[user.id]) {
        dataUsernames[user.id] = {}
        dataUsernames[user.id].username = user.username
    }
    dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })
})
bot.on('messageReactionAdd', (messageReaction, user) => { //React
    logToFile(FileDebugType.discordReactionAdd + messageReaction.message.id + "Ϊ" + messageReaction.emoji.name + "Ϊ" + user.id)

    if (user.bot) { return }

    if (!dataUsernames[user.id]) {
        dataUsernames[user.id] = {}
        dataUsernames[user.id].username = user.username
    }
    dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })
})
bot.on('messageDelete', (message) => { //React
    logToFile(FileDebugType.discordMessageDelete + message.id)
})

/**
 * @param {Discord.Message} message
 * @param {boolean} thisIsPrivateMessage
 * @param {Discord.User} sender
 * @param {string} command
 */
function processCommand(message, thisIsPrivateMessage, sender, command) {

    //#region Enabled in dm

    if (command === `xp`) {
        CommandXp(message.channel, sender)
        userstatsSendCommand(sender)
        return;
    };

    if (command === `crate all`) {
        commandAllCrate(message, sender)
        userstatsSendCommand(sender)
        return;
    };

    if (command === `napi all`) {
        commandAllNapi(message, sender)
        userstatsSendCommand(sender)
        return;
    };

    if (command == `napi`) {
        commandNapi(message, sender)
        userstatsSendCommand(sender)
        return;
    };

    if (command === `profil`) {
        commandProfil(message, sender)
        userstatsSendCommand(sender)
        return;
    };

    if (command === `store`) {
        commandStore(message, sender, thisIsPrivateMessage)
        userstatsSendCommand(sender)
        return;
    };

    if (command === `ping`) {
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
            .addField('\\🖥️ BOT:',
                'Készen áll: ' + DateToString(bot.readyAt) + '\n' +
                'Készen áll: ' + DateToString(new Date(bot.readyTimestamp)) + '\n' +
                'Üzemidő: ' + Math.floor(bot.uptime / 1000) + ' másodperc'
            )
            .addField('\\📡 WebSocket:',
                'Átjáró: ' + bot.ws.gateway + '\n' +
                'Ping: ' + bot.ws.ping + ' ms\n' +
                'Státusz: ' + WsStatus
            )
        if (bot.shard != null) {
            embed.addField('Shard:',
                'Fő port: ' + bot.shard.parentPort + '\n' +
                'Mód: ' + bot.shard.mode
            )
        }
        message.channel.send({ embed })
        userstatsSendCommand(sender)
        return;
    };

    if (command === `pms`) {
        CommandBusiness(message.channel, sender, thisIsPrivateMessage)
        userstatsSendCommand(sender)
        return;
    };

    if (command === `weather`) {
        CommandWeather(message.channel, sender)
        userstatsSendCommand(sender)
        return
    } else if (command === `weather help`) {
        message.channel.send('**Időjárás jelzések**\n' +
            '> \\💧: Eső valószínűsége\n' +
            '> \\☁️: Az ég felhővel borított része\n' +
            '> \\🌇: Hajnal\n' +
            '> \\🏙️: Napkelte\n' +
            '> \\🌆: Napnyugta\n' +
            '> \\🌃: Alkonyat\n' +
            '> \\⬛: Légnyomás\n' +
            '>   ├\\🔶: Nagyon magas\n' +
            '>   ├\\🔸: Magas\n' +
            '>   ├\\🔹: Alacsony\n' +
            '>   └\\🔷: Nagyon alacsomy')

        userstatsSendCommand(sender)
        return
    } else if (command === `help`) { // /help parancs
        CommandHelp(message.channel, sender, thisIsPrivateMessage)
        userstatsSendCommand(sender)
        return
    } else if (command === `?`) { // /help parancs
        CommandHelp(message.channel, sender, thisIsPrivateMessage)
        userstatsSendCommand(sender)
        return
    }

    if (command === `test`) {
        const button0 = new disbut.MessageButton()
            .setLabel("This is a button!")
            .setID("myid0")
            .setStyle("grey");
        const button1 = new disbut.MessageButton()
            .setLabel("This is a button!")
            .setID("myid1")
            .setStyle("blurple");
        const option = new disbut.MessageMenuOption()
            .setLabel('Your Label')
            .setEmoji('🍔')
            .setValue('menuid')
            .setDescription('Custom Description!')

        const select = new disbut.MessageMenu()
            .setID('customid')
            .setPlaceholder('Click me! :D')
            .setMaxValues(1)
            .setMinValues(1)
            .addOption(option)

        const row0 = new disbut.MessageActionRow()
            .addComponents(button0, button1);
        const row1 = new disbut.MessageActionRow()
            .addComponents(select);
        message.channel.send("Message with a button!", { components: [row0, row1] });

        userstatsSendCommand(sender)
        return
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

    if (command === `bolt`) {
        if (thisIsPrivateMessage === false) {
            CommandShop(message.channel, sender, message.member)
            userstatsSendCommand(sender)
        } else {
            message.channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
        return
    }

    if (command.startsWith(`gift `)) {
        if (thisIsPrivateMessage === false) {
            if (message.channel.guild.id === '737954264386764812') {
                userstatsSendCommand(sender)
                try {

                    var giftableMember = message.mentions.users.first()
                    if (dataBackpacks[sender.id].gifts > 0) {
                        if (giftableMember.id === sender.id) {
                            message.channel.send('> \\❌ **Nem ajándékozhatod meg magad!**');
                        } else {
                            dataBackpacks[giftableMember.id].getGift += 1;
                            dataBackpacks[sender.id].gifts -= 1
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(sender.username, sender.displayAvatarURL())
                                .setTitle('\\✔️ ' + giftableMember.username.toString() + ' megajándékozva.')
                                .setColor(Color.Highlight)
                            message.channel.send({ embed });
                            message.mentions.users.first().send('> **\\✨ ' + sender.username + ' megajándékozott! \\🎆**');
                            saveDatabase()
                        }
                    } else {
                        if (giftableMember.id === sender.id) {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(sender.username, sender.displayAvatarURL())
                                .setTitle('\\❌ Nem ajándékozhatod meg magad. Sőt! Nincs is ajándékod.')
                                .setColor(Color.Error)
                            message.channel.send({ embed });
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(sender.username, sender.displayAvatarURL())
                                .setTitle('\\❌ Nincs ajándékod, amit odaadhatnál.')
                                .setColor(Color.Error)
                            message.channel.send({ embed });
                        }
                    }
                } catch (error) {
                    message.channel.send('> **\\❌ ' + error.toString() + '**')
                }

            } else {
                message.channel.send('> **\\⛔ Ez a parancs ezen a szerveren nem használható!**')
            }
        } else {
            message.channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
        return;
    }

    if (command === `home go`) {
        message.channel.send('> **\\⛔ Ez a parancs nem elérhető!**')
        return
        if (thisIsPrivateMessage === false) {
        } else {
            message.channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
        if (message.channel.guild.id === '737954264386764812') {
            CommandGoHome(sender, message.guild, message.channel)
            userstatsSendCommand(sender)
        } else {
            message.channel.send('> **\\⛔ Ez a parancs ezen a szerveren nem használható!**')
        }
    }

    if (command.startsWith(`pms name `)) {
        message.channel.send('> \\⛔ **Ez a parancs átmenetileg nem elérhető!**')
        //commandPmsName(message.channel, sender, command.replace(`pms name `, ''))
        userstatsSendCommand(sender)
        return;
    }

    if (command.startsWith(`quiz\n`)) {
        const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
        quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4])
        userstatsSendCommand(sender)
        return;
    } else if (command.startsWith(`quizdone `)) {
        quizDone(command.replace(`quizdone `, ''))
        userstatsSendCommand(sender)
        return
    } else if (command.startsWith(`poll simple\n`)) {
        const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], false)
        userstatsSendCommand(sender)
        return
    } else if (command.startsWith(`poll wyr\n`)) {
        const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], true)
        userstatsSendCommand(sender)
        return
    } else if (command === `dev`) {
        if (sender.id === '726127512521932880') {
            userstatsSendCommand(sender)
            const embed = new Discord.MessageEmbed()
                .addField('Fejlesztői parancsok',
                    '> \\❔  `.quiz`\n' +
                    '>  \\📊  `.poll simple`\n' +
                    '>  \\📊  `.poll wyr`'
                )
                .setColor(Color.Highlight)
            message.channel.send({ embed })
        } else {
            message.channel.send('> \\⛔ **Ezt a parancsot te nem használhatod!**')
        }
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
        if (gameMap == null) {
            gameMap = createGame(50, 50)
        }

        connectTogame(sender)
        gameResetCameraPos(false, sender)

        if (getGameUserSettings(sender.id) == null) {
            gameUserSettings.push(new GameUserSettings(sender.id))
        }

        const _message = getGameMessage(sender, false, false)
        message.channel.send({ embed: _message.embed, components: _message.actionRows }).then(msg => {
            allGameMessages.push(new savedGameMessage(msg, sender))
        })
        return
    }

    if (command.startsWith('test')) {
        const aaaaaaaaaaaa = command.split('|')
        const title = aaaaaaaaaaaa[1]
        const texts = aaaaaaaaaaaa[2].split(';')
        const icons = aaaaaaaaaaaa[3].split(';')
        if (texts.length > 5) {
            message.channel.send("> Az opciók száma nem lehet több 5-nél")
            return
        }

        /**
         * @type {disbut.MessageButton[]}
         */
        let buttons = []
        for (let i = 0; i < icons.length; i++) {
            const icon = icons[i];
            const button0 = new disbut.MessageButton()
                .setLabel(icon)
                .setID("pollOption" + i)
                .setStyle("gray");
            buttons.push(button0)
        }
        const row0 = new disbut.MessageActionRow()
            .addComponents(buttons);

        const buttonFinish = new disbut.MessageButton()
            .setLabel('Befejezés')
            .setID("pollFinish")
            .setStyle("green");
        const row1 = new disbut.MessageActionRow()
            .addComponent(buttonFinish);

        let optionText = ''
        for (let i = 0; i < texts.length; i++) {
            optionText += '> ' + icons[i] + ' ' + texts[i] + '\n'
        }

        message.channel.send(`**${title}**\n${optionText}`, { components: [row0, row1] }).then(msg => {
            addNewPoll(msg.id, title, texts, icons)
        })
        return
    }

    const button1 = new disbut.MessageButton()
        .setLabel("Help")
        .setID("sendHelp")
        .setStyle("blurple");
    message.channel.send("> \\❌ **Ismeretlen parancs! **`.help`** a parancsok listájához!**", button1);
}

loadingProcess('Belépés...')
bot.login(token)

//#region Game

function distance(x1, y1, x2, y2) {
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
}

function distanceNearestPoint(x, y, points) {
    let z = -1
    points.forEach(point => {
        if (z === -1) {
            z = distance(x, y, point[0], point[1])
        } else {
            z = Math.min(z, distance(x, y, point[0], point[1]))
        }
    })
    return z
}

/**
 * @param {number} cameraX
 * @param {number} cameraY
 * @param {GameMap} gameMap
 * @param {boolean} isOnPhone
 */
function getView(cameraX, cameraY, gameMap, isOnPhone) {
    log('getView.isOnPhone: ' + isOnPhone)

    let viewText = ''
    let map = gameMap.map

    let viewWidth
    let viewHeight

    if (isOnPhone === true) {
        viewWidth = 15
        viewHeight = 18
    } else {
        viewWidth = 25
        viewHeight = 25
    }

    for (let y = 0; y < viewHeight; y++) {
        for (let x = 0; x < viewWidth; x++) {

            const xVal = x + cameraX
            const yVal = y + cameraY

            /**
             * @type {MapPoint}
             */
            let mapP
            for (let i = 0; i < map.length; i++) {
                if (map[i].x === xVal && map[i].y === yVal) {
                    mapP = map[i]
                    break;
                }
            }

            if (mapP === undefined) {
                mapP = new MapPoint(xVal, yVal, MapBiome.void, MapHeight.normal)
            }

            const height = mapP.height
            const biome = mapP.biome

            let newPixel = '\\⬛'

            if (biome === MapBiome.ocean) {
                newPixel = '\\🟦'
            } else if (biome === MapBiome.plain || biome === MapBiome.flowerPlain || biome === MapBiome.forest || biome === MapBiome.spruceForest) {
                newPixel = '\\🟩'
            } else if (biome === MapBiome.mountains) {
                newPixel = '\\🟫'
            } else if (biome === MapBiome.desertHills) {
                newPixel = '\\🟨'
            } else if (biome === MapBiome.desert || biome === MapBiome.beach) {
                newPixel = '\\🟨'
            }

            if (height === MapHeight.mountainSnow && biome !== MapBiome.desertHills) {
                newPixel = '\\⬜'
            }

            if (mapP.object == null) { } else {
                if (mapP.object.type == MapObjectType.plant) {
                    newPixel = '\\🌱'
                } else if (mapP.object.type == MapObjectType.bamboo) {
                    newPixel = '\\🎍'
                } else if (mapP.object.type == MapObjectType.tanabataTree) {
                    newPixel = '\\🎋'
                } else if (mapP.object.type == MapObjectType.rice) {
                    newPixel = '\\🌾'
                } else if (mapP.object.type == MapObjectType.mushroom) {
                    newPixel = '\\🍄'
                } else if (mapP.object.type == MapObjectType.sunflower) {
                    newPixel = '\\🌻'
                } else if (mapP.object.type == MapObjectType.blossom) {
                    newPixel = '\\🌼'
                } else if (mapP.object.type == MapObjectType.cherryBlossom) {
                    newPixel = '\\🌸'
                } else if (mapP.object.type == MapObjectType.hibiscus) {
                    newPixel = '\\🌺'
                } else if (mapP.object.type == MapObjectType.rose) {
                    newPixel = '\\🌹'
                } else if (mapP.object.type == MapObjectType.tulip) {
                    newPixel = '\\🌷'
                } else if (mapP.object.type == MapObjectType.palm) {
                    newPixel = '\\🌴'
                } else if (mapP.object.type == MapObjectType.spruce) {
                    newPixel = '\\🌲'
                } else if (mapP.object.type == MapObjectType.tree) {
                    newPixel = '\\🌳'
                } else if (mapP.object.type == MapObjectType.cactus) {
                    newPixel = '\\🌵'
                }
            }

            gameMap.players.forEach(player => {
                if (player.x === mapP.x && player.y === mapP.y) {
                    newPixel = '\\🧍'
                }
            })

            viewText += newPixel
        }
        viewText += '\n'
    }

    return viewText
}

/**
 * @param {GamePlayer} player
 * @returns {string}
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 */
function getPlayerStatText(player, isOnPhone, isInDebugMode) {
    log('getPlayerStatText.isInDebugMode: ' + isInDebugMode)

    let text = ''
    for (let v = 0; v < player.health; v++) {
        text += '\\❤️'
    }
    for (let v = 0; v < 10 - player.health; v++) {
        text += '\\🖤'
    }
    if (isInDebugMode === true) {
        text += ' | '
        if (player.direction === Direction.Up) {
            text += '⇑'
        } else if (player.direction === Direction.Right) {
            text += '⇒'
        } else if (player.direction === Direction.Down) {
            text += '⇓'
        } else if (player.direction === Direction.Left) {
            text += '⇐'
        }
        try {
            text += ' | '
            text += getMapPoint(player.x, player.y, gameMap).biome.toString()
        } catch (error) { }
        text += ' | cam: ' + gameCameraX + ' ' + gameCameraY
        text += ' | pos: ' + player.x + ' ' + player.y
    }
    text += '\n\\👊'
    text += '\n\n**Felszerelés:**\n'
    text += '\\👊|'
    player.tools.forEach(tool => {
        if (tool.type === ToolType.Axe) {
            text += '\\🪓'
        } else if (tool.type === ToolType.Fix) {
            if (tool.efficiency === 1) {
                text += '\\🔨'
            } else if (tool.efficiency === 2) {
                text += '\\🔧'
            }
        } else if (tool.type === ToolType.MeleeWeapon) {
            if (tool.efficiency === 1) {
                text += '\\🔪'
            } else if (tool.efficiency === 2) {
                text += '\\🗡️'
            }
        } else if (tool.type === ToolType.Pickaxe) {
            text += '\\⛏️'
        } else if (tool.type === ToolType.RangeWeapon) {
            text += '\\🏹'
        }
        text += '|'
    })
    if (text.endsWith('|')) {
        text = text.slice(0, text.length - 1)
    }
    player.items.forEach(item => {
        text += item.count + 'x '
        if (item.type === ItemType.Brick) {
            text += '\\🧱'
        } else if (item.type === ItemType.Gem) {
            text += '\\💎'
        } else if (item.type === ItemType.Grass) {
            text += '\\🌿'
        } else if (item.type === ItemType.Map) {
            text += '\\🗺️'
        } else if (item.type === ItemType.Sponge) {
            text += '\\🧽'
        } else if (item.type === ItemType.Stick) {
            text += '\\🥢'
        } else if (item.type === ItemType.Stone) {
            text += '\\🌑'
        } else if (item.type === ItemType.Whool) {
            text += '\\🧶'
        } else if (item.type === ItemType.Wood) {
            text += '\\📏'
        }
        text += '|'
    })

    return text
}

/**
 * @param {number} x
 * @param {number} y
 * @param {GameMap} map
 * @returns {MapPoint}
 */
function getMapPoint(x, y, map) {
    for (let i = 0; i < map.map.length; i++) {
        if (map.map[i].x === x && map.map[i].y === y) {
            return map.map[i]
        }
    }
}

/**
 * @param {Discord.User} user
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 */
function getGameEmbed(user, isOnPhone, isInDebugMode) {
    log('getGameEmbed.isOnPhone: ' + isOnPhone)

    const embed = new Discord.MessageEmbed()
        .setAuthor(user.username, user.avatarURL())
        .setTitle('Game')
        .setDescription(getView(gameCameraX, gameCameraY, gameMap, isOnPhone) +
            '\n' +
            getPlayerStatText(gameMap.players[0], isOnPhone, isInDebugMode))

    return embed
}

/**
 * @param {Table} parentNoise
 * @param {Table} overlayNoise
 * @return {Table}
 */
function combineNoises(parentNoise, overlayNoise) {
    /**
     * @type {Table}
     */
    let newNoise = new Table(parentNoise.width, parentNoise.height, [])

    for (let i = 0; i < parentNoise.points.length; i++) {
        const parentValue = parentNoise.points[i]
        const overlayValue = overlayNoise.points[i]

        const newValue = (parentValue + parentValue + overlayValue) / 3
        newNoise.push(newValue)
    }

    return newNoise
}

function createGame(width, height) {
    let newMap = new GameMap(width, height, generateMap(width, height), [])
    return newMap
}

function generateMap(width, height) {

    const heightScale = 4
    const biomeScale = 5
    const treesScale = 5
    const plantsScale = 3

    const heightNoise = combineNoises(generateNoise(width, height, heightScale), generateNoise(width, height, 1))
    const biomeNoise = generateNoise(width, height, biomeScale)
    const treesNoise = generateNoise(width, height, treesScale)
    const plantsNoise = generateNoise(width, height, plantsScale)

    /**
     * @type {MapPoint[]}
     */
    let newMap = []

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            /**
             * @type {MapObject}
             */
            let newObj = null

            const heightValue = heightNoise.valueAt(x, y) / heightScale
            const biomeValue = biomeNoise.valueAt(x, y) / biomeScale
            const treesValue = treesNoise.valueAt(x, y) / treesScale
            const plantsValue = plantsNoise.valueAt(x, y) / plantsScale

            /**
             * @type {MapPoint}
             */
            let newMapPoint

            if (heightValue < 0) {
                newMapPoint = new MapPoint(x, y, MapBiome.void, MapHeight.normal, null)
            } else if (heightValue < 1.2) {
                newMapPoint = new MapPoint(x, y, MapBiome.ocean, MapHeight.water, null)
            } else if (heightValue < 1.4) {
                newMapPoint = new MapPoint(x, y, MapBiome.beach, MapHeight.normal, null)
            } else if (heightValue < 3) {
                if (biomeValue < 2) {
                    if (treesValue < 2) {
                        newMapPoint = new MapPoint(x, y, MapBiome.forest, MapHeight.normal)
                    } else if (plantsValue < 3) {
                        newMapPoint = new MapPoint(x, y, MapBiome.flowerPlain, MapHeight.normal)
                    } else {
                        newMapPoint = new MapPoint(x, y, MapBiome.plain, MapHeight.normal)
                    }
                } else {
                    newMapPoint = new MapPoint(x, y, MapBiome.desert, MapHeight.normal)
                }
            } else if (heightValue < 4) {
                if (biomeValue < 2) {
                    if (treesValue < 2) {
                        newMapPoint = new MapPoint(x, y, MapBiome.spruceForest, MapHeight.mountain)
                    } else {
                        newMapPoint = new MapPoint(x, y, MapBiome.mountains, MapHeight.mountain)
                    }
                } else {
                    newMapPoint = new MapPoint(x, y, MapBiome.desertHills, MapHeight.mountain)
                }
            } else {
                if (biomeValue < 2) {
                    newMapPoint = new MapPoint(x, y, MapBiome.mountains, MapHeight.mountainSnow)
                } else {
                    newMapPoint = new MapPoint(x, y, MapBiome.desertHills, MapHeight.mountainSnow)
                }
            }

            if (newMapPoint.biome === MapBiome.desert) {
                if ((Math.random() * 10) < 0.1) {
                    newObj = new MapObject(MapObjectType.cactus, false, 2)
                }
            } else if (newMapPoint.biome === MapBiome.flowerPlain) {
                if ((Math.random() * 10) < 0.7) {
                    const randomValue = Math.random()
                    if (randomValue < 0.14) {
                        newObj = new MapObject(MapObjectType.plant, true, 1)
                    } else if (randomValue < 0.29) {
                        newObj = new MapObject(MapObjectType.blossom, true, 1)
                    } else if (randomValue < 0.43) {
                        newObj = new MapObject(MapObjectType.cherryBlossom, true, 1)
                    } else if (randomValue < 0.57) {
                        newObj = new MapObject(MapObjectType.hibiscus, true, 1)
                    } else if (randomValue < 0.71) {
                        newObj = new MapObject(MapObjectType.rose, true, 1)
                    } else if (randomValue < 0.86) {
                        newObj = new MapObject(MapObjectType.sunflower, true, 1)
                    } else {
                        newObj = new MapObject(MapObjectType.tulip, true, 1)
                    }
                }
            } else if (newMapPoint.biome === MapBiome.forest) {
                if (Math.random() < 0.1) {
                    newObj = new MapObject(MapObjectType.plant, true, 1)
                }
                if ((Math.random()) < 0.2) {
                    newObj = new MapObject(MapObjectType.tree, false, 3)
                }
            } else if (newMapPoint.biome === MapBiome.spruceForest) {
                if ((Math.random()) < 0.17) {
                    newObj = new MapObject(MapObjectType.spruce, false, 3)
                }
            } else if (newMapPoint.biome === MapBiome.beach) {
                if (Math.random() < 0.1) {
                    newObj = new MapObject(MapObjectType.rice, true, 1)
                }
                if ((Math.random()) < 0.07) {
                    newObj = new MapObject(MapObjectType.palm, false, 3)
                }
            } else if (newMapPoint.biome === MapBiome.mountains && newMapPoint.height === MapHeight.mountainSnow) {
                if (Math.random() < 0.01) {
                    newObj = new MapObject(MapObjectType.igloo, false, 5)
                }
            }

            newMapPoint.object = newObj
            newMap.push(newMapPoint)
        }
    }

    return newMap
}

/**
 * @param {Discord.User} user
 */
function connectTogame(user) {
    if (gameMap !== null) {
        if (getPlayerIndex(user.id) === -1) {
            const spawnpoint = getSpawnPoint(gameMap)
            gameMap.players.push(new GamePlayer(spawnpoint[0], spawnpoint[1], user, 10, Direction.Up, 0, [new GameTool(ToolType.Axe, 100, 1)]))
            return true
        }
    }

    return false
}

/**
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @returns {Table}
 */
function generateNoise(width, height, scale) {
    /**
     * @type {number[][]}
     */
    const points = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (Math.random() * 100 < 10) {
                points.push([x * scale, y * scale])
            }
        }
    }

    /**
     * @type {Table}
     */
    let noise = new Table(width, height, [])

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (distanceNearestPoint(x, y, points) > -1) {
                noise.push(distanceNearestPoint(x, y, points))
            } else {
                noise.push(0)
            }
        }
    }

    return noise
}

/**
 * @param {string} userId
 */
function getPlayerIndex(userId) {
    let index = -1

    if (gameMap == null) {
        return index;
    }

    for (let i = 0; i < gameMap.players.length; i++) {
        const player = gameMap.players[i]
        if (player.ownerUser.id === userId) {
            index = i
            break;
        }
    }

    return index
}

/**
 * @param {GamePlayer} player
 * @param {ItemType} item
 * @param {number} count
 */
function addItemToPlayer(player, item, count) {
    let thisIsNewItem = true
    player.items.forEach(_item => {
        if (_item.type === item) {
            thisIsNewItem = false
            _item.count += count
        }
    })
    if (thisIsNewItem === true) {
        player.items.push(new GameItem(item, count))
    }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {gameMap} map
 * @returns {boolean}
 */
function playerCanMoveToHere(x, y, map) {
    let canMove = true
    map.map.forEach(mapP => {
        if (mapP.x === x && mapP.y === y) {
            if (mapP.object == null) { } else {
                if (mapP.object.walkable === false) {
                    canMove = false
                }
            }
            if (mapP.biome === MapBiome.ocean || mapP.biome === MapBiome.void) {
                canMove = false
            }

            map.players.forEach(player => {
                if (player.x === x && player.y === y) {
                    canMove = false
                }
            })
        }
    })
    return canMove
}

/**
 * @param {boolean} isOnPhone
 * @param {Discord.User} user
 */
function gameResetCameraPos(isOnPhone, user) {
    const playerIndex = getPlayerIndex(user.id)

    if (isOnPhone === true) {
        gameCameraX = Math.max(Math.min(gameMap.players[playerIndex].x - 7, 50), 0)
        gameCameraY = Math.max(Math.min(gameMap.players[playerIndex].y - 9, 50), 0)
    } else {
        gameCameraX = Math.max(Math.min(gameMap.players[playerIndex].x - 12, 50), 0)
        gameCameraY = Math.max(Math.min(gameMap.players[playerIndex].y - 12, 50), 0)
    }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {NoisePoint[]} noise
 * @returns {number}
 */
function getValueAt(x, y, noise) {
    /**
     * @type {number}
     */
    let val = null
    noise.forEach(noiseP => {
        if (noiseP.x === x && noiseP.y === y) {
            val = noiseP.value
        }
    })
    return val
}

/**
 * @param {GameMap} map
 * @param {GameMap} map
 * @returns {number[]} [x,y]
 */
function getSpawnPoint(map) {
    let x = 5
    let y = 5
    while (playerCanMoveToHere(x, y, map) === false) {
        x += 1
        y += 1
        if (x > map.width) {
            x = 6
            y = 5
        }
        if (y > map.height) {
            x = 6
            y = 5
        }
    }
    return [x, y]
}

/**
 * @param {Discord.User} user
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 */
function getGameMessage(user, isOnPhone, isInDebugMode) {
    log('getGameMessage.isOnPhone: ' + isOnPhone)

    const playerIndex = getPlayerIndex(user.id)
    const playerDirection = gameMap.players[playerIndex].direction

    const buttonW = new disbut.MessageButton()
        .setLabel("  ↑  ")
        .setID("gameW")
        .setStyle("grey");
    const buttonA = new disbut.MessageButton()
        .setLabel(" ←")
        .setID("gameA")
        .setStyle("grey");
    const buttonS = new disbut.MessageButton()
        .setLabel("  ↓  ")
        .setID("gameS")
        .setStyle("grey");
    const buttonD = new disbut.MessageButton()
        .setLabel(" →")
        .setID("gameD")
        .setStyle("grey");
    const buttonHit = new disbut.MessageButton()
        .setLabel("👊")
        .setID("gameHit")
        .setStyle("grey");
    const buttonUse = new disbut.MessageButton()
        .setLabel("🤚")
        .setID("gameUse")
        .setStyle("grey");
    const buttonSwitchPhone = new disbut.MessageButton()
        .setLabel("📱 Telefonon vagyok")
        .setID("gameSwitchPhone")
        .setStyle("grey");
    const buttonSwitchDebug = new disbut.MessageButton()
        .setLabel("📟")
        .setID("gameSwitchDebug")
        .setStyle("grey");
    const buttonRestart = new disbut.MessageButton()
        .setLabel("↺")
        .setID("gameRestart")
        .setStyle("red");



    if (playerDirection === Direction.Up) {
        buttonW.setStyle("blurple")
    } else if (playerDirection === Direction.Left) {
        buttonA.setStyle("blurple")
    } else if (playerDirection === Direction.Down) {
        buttonS.setStyle("blurple")
    } else if (playerDirection === Direction.Right) {
        buttonD.setStyle("blurple")
    }

    if (isOnPhone === true) {
        buttonSwitchPhone.setLabel("🖥️")
    } else {
        buttonSwitchPhone.setLabel("📱 Telefonon vagyok")
    }

    if (getGameUserSettings(user.id).isInDebugMode === true) {
        buttonSwitchDebug.setStyle("blurple")
    } else {
        buttonSwitchDebug.setStyle("grey")
    }

    const row0 = new disbut.MessageActionRow()
        .addComponents(buttonUse, buttonW, buttonHit, buttonSwitchPhone)
    const row1 = new disbut.MessageActionRow()
        .addComponents(buttonA, buttonS, buttonD, buttonSwitchDebug, buttonRestart)

    return new GameMessage(getGameEmbed(user, isOnPhone, isInDebugMode), [row0, row1])
}

/**
 * @param {Discord.User} user
 * @param {Discord.Message} message
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 */
function resetGameMessage(user, message, isOnPhone, isInDebugMode) {
    log('resetGameMessage.isOnPhone: ' + isOnPhone)

    for (let i = 0; i < allGameMessages.length; i++) {
        const savedGameMsg = allGameMessages[i];

        const _message = getGameMessage(savedGameMsg.user, isOnPhone, isInDebugMode)
        savedGameMsg.message.edit({ embed: _message.embed, components: _message.actionRows })
    }
}

function getGameUserSettings(userId) {
    for (let i = 0; i < gameUserSettings.length; i++) {
        const userSettings = gameUserSettings[i];
        if (userSettings.userId === userId) {
            return userSettings
        }
    }
    return null
}

class Table {
    /**
     * @param {number} width
     * @param {number} height
     * @param {number[]} points
     */
    constructor(width, height, points) {
        this.width = width;
        this.height = height;
        this.points = points;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    valueAt(x, y) {
        return this.points[y * this.width + x];
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} value
     */
    setValue(x, y, value) {
        this.points[y * this.width + x] = value;
    }

    /**
     * @param {number} value
     */
    push(value) {
        this.points.push(value);
    }
}

class NoisePoint {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} value 
     */
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    /*
        get xValue() {
            return this.x;
        }
    
        get yValue() {
            return this.y;
        }
    
        get zValue() {
            return this.value;
        }
        */
}

const MapBiome = {
    void: 'void',
    plain: 'plains',
    desert: 'desert',
    ocean: 'ocean',
    beach: 'beach',
    mountains: 'mountains',
    desertHills: 'deserthills',
    flowerPlain: 'flowerplains',
    spruceForest: 'spruceforest',
    forest: 'forest'
}

const MapHeight = {
    water: 0,
    normal: 1,
    mountain: 2,
    mountainSnow: 3
}

const MapObjectType = {
    plant: 0, //🌱
    bamboo: 1, //🎍
    tanabataTree: 2, //🎋
    rice: 3, //🌾
    mushroom: 4, //🍄
    sunflower: 5, //🌻
    blossom: 6, //🌼
    cherryBlossom: 7, //🌸
    hibiscus: 8, //🌺
    rose: 9, //🌹
    tulip: 10, //🌷
    palm: 11, //🌴
    spruce: 12, //🌲
    tree: 13, //🌳
    cactus: 14, //🌵
    igloo: 15, //🍙
}

const Direction = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3
}

const ToolType = {
    Fix: 0,
    Pickaxe: 1,
    Axe: 2,
    MeleeWeapon: 3,
    RangeWeapon: 4
}

const ItemType = {
    Wood: 0, //📏
    Whool: 1, //🧶
    Grass: 2, //🌿
    Sponge: 3, //🧽
    Stone: 4, //🌑
    Gem: 5, //💎
    Stick: 6, //🥢
    Brick: 7, //🧱
    Map: 8 //🗺️
}

class GameItem {
    /**
     * @param {ItemType} type
     * @param {number} count
     */
    constructor(type, count) {
        this.type = type;
        this.count = count;
    }
}

class GameTool {
    /**
     * @param {ToolType} type
     * @param {number} health
     * @param {number} maxHealth
     * @param {number} efficiency
     */
    constructor(type, health, efficiency) {
        this.type = type;
        this.health = health;
        this.maxHealth = health;
        this.efficiency = efficiency;
    }
}

class GameMap {
    /**
     * @param {number} width
     * @param {number} height
     * @param {MapPoint[]} map
     * @param {GamePlayer[]} players
     */
    constructor(width, height, map, players) {
        this.width = width;
        this.height = height;
        this.map = map;
        this.players = players;
    }
}

class MapPoint {
    /**
     * @param {number} x
     * @param {number} y
     * @param {MapBiome} biome
     * @param {MapHeight} height
     * @param {MapObject} object
     */
    constructor(x, y, biome, height, object) {
        this.x = x;
        this.y = y;
        this.biome = biome;
        this.height = height;
        this.object = object;
    }
    /*
        get xValue() {
            return this.x;
        }
    
        get yValue() {
            return this.y;
        }
    
        get biomeValue() {
            return this.biome;
        }
    
        get heightValue() {
            return this.height;
        }
    
        get objectValue() {
            return this.object;
        }
        */
}

class MapObject {
    /**
     * @param {MapObjectType} type
     * @param {boolean} walkable
     * @param {number} breakValue
     */
    constructor(type, walkable, breakValue) {
        this.type = type;
        this.walkable = walkable;
        this.breakValue = breakValue;
    }
    /*
        get typeValue() {
            return this.type;
        }
        */
}

class GamePlayer {
    /**
     * @param {number} x
     * @param {number} y
     * @param {Discord.User} ownerUser
     * @param {number} health
     * @param {Direction} direction
     * @param {number} selectedToolIndex
     * @param {GameTool[]} tools
     * @param {GameItem[]} items
     * @param {boolean} aggreeToRestart
     */
    constructor(x, y, ownerUser, health = 10, direction = 0, selectedToolIndex = 0, tools = [], items = [], aggreeToRestart = false) {
        this.x = x;
        this.y = y;
        this.ownerUser = ownerUser;
        this.health = health;
        this.direction = direction;
        this.selectedToolIndex = selectedToolIndex;
        this.tools = tools;
        this.items = items;
        this.aggreeToRestart = false;
    }
}

class GameMessage {
    /**
     * @param {Discord.MessageEmbed} embed
     * @param {disbut.MessageActionRow[]} actionRows
     */
    constructor(embed, actionRows) {
        this.embed = embed;
        this.actionRows = actionRows;
    }
}

class GameUserSettings {
    /**
     * @param {string} userId
     * @param {boolean} isOnPhone
     * @param {boolean} isInDebugMode
     */
    constructor(userId, isOnPhone = false, isInDebugMode = false) {
        this.userId = userId;
        this.isOnPhone = isOnPhone;
        this.isInDebugMode = isInDebugMode;
    }
}

class savedGameMessage {
    /**
     * @param {Discord.Message} message
     * @param {Discord.User]} user
     */
    constructor(message, user) {
        this.message = message;
        this.user = user;
    }
}

//#endregion

//#region Mails

/**
 * @param {number} userId
 * @returns {number}
 */
function getCurrentlyEditingMailIndex(userId) {
    for (let i = 0; i < currentlyWritingEmails.length; i++) {
        const mail = currentlyWritingEmails[i];
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
    channel.send(message.embed, message.actionRows[0])
}

/**
 * @param {Discord.User} user
 * @param {number} selectedIndex 0: main | 1: inbox | 2: outbox | 3: writing
 */
function getMailMessage(user, selectedIndex = 0) {
    const button0 = new disbut.MessageButton()
        .setLabel("Kezdőlap")
        .setID("mailFolderMain")
        .setStyle("grey");
    const button1 = new disbut.MessageButton()
        .setLabel("Beérkező e-mailek")
        .setID("mailFolderInbox")
        .setStyle("grey");
    const button2 = new disbut.MessageButton()
        .setLabel("Elküldött e-mailek")
        .setID("mailFolderOutbox")
        .setStyle("grey");
    const button3 = new disbut.MessageButton()
        .setLabel("✍️ Levél írása")
        .setID("mailWrite")
        .setStyle("blurple");

    const row0 = new disbut.MessageActionRow()

    const embed = new Discord.MessageEmbed()
        .setAuthor(user.username, user.avatarURL())

    if (selectedIndex === 0) {
        embed.setTitle("Kezdőlap");
        const allInboxMails = getAllEMails(user.id, MailFolder.inbox)
        const allOutboxMails = getAllEMails(user.id, MailFolder.outbox)
        let unreaded = 0
        allInboxMails.forEach(mail => {
            if (mail.readed === false) {
                unreaded += 1
            }
        });
        embed.addField("📥 Beérkező levelek", 'Olvasatlan: ' + unreaded + '\nÖsszes: ' + allInboxMails.length)
        embed.addField("📤 Elküldött levelek", 'Összes: ' + allOutboxMails.length)

        button0.setLabel("↻")
        button0.setStyle('blurple')
        row0.addComponents(button3, button0, button1, button2);
    } else if (selectedIndex === 1) {
        embed.setTitle("📥 Beérkező levelek");

        const allMails = getAllEMails(user.id, MailFolder.inbox)
        log(allMails)
        allMails.forEach(mail => {
            embed.addField(
                mail.icon + ' ' + mail.sender.name + ' - ' + mail.title,
                mail.context + '\n[' + new Date(mail.date).toDateString() + ']\n',
                false)
        })

        button1.setLabel("↻")
        button1.setStyle('blurple')
        row0.addComponents(button3, button1, button0, button2);

        setReadAllMessages(user.id)
    } else if (selectedIndex === 2) {
        embed.setTitle("📤 Elküldött levelek");

        const allMails = getAllEMails(user.id, MailFolder.outbox)
        log(allMails)
        allMails.forEach(mail => {
            embed.addField(
                mail.icon + ' ' + mail.reciver.name + ' - ' + mail.title,
                mail.context + '\n[' + new Date(mail.date).toDateString() + ']\n',
                false)
        })

        button2.setLabel("↻")
        button2.setStyle('blurple')
        row0.addComponents(button3, button2, button0, button1);
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
        });

        embed.addField('Cím: "' + mail.title + '"', 'Üzenet: "' + mail.context + '"\n' + 'Fogadó: @' + mail.reciver.name)
            .setFooter('.mail wt [cím] Cím beállítása\n' +
                '.mail wc [üzenet] Üzenet beállítása\n' +
                '.mail wr [@Felhasználó | Azonosító] Címzet beállítása')

        const button4 = new disbut.MessageButton()
            .setLabel("Küldés")
            .setID("mailWriteSend")
            .setStyle("green");
        const button5 = new disbut.MessageButton()
            .setLabel("Elvetés")
            .setID("mailWriteAbort")
            .setStyle("red");
        row0.addComponents(button4, button5);
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
    if (!dataMail[mail.reciver.id]) return false;
    if (!dataMail[mail.sender.id]) return false;
    if (!dataMail[mail.reciver.id].inbox) return false;
    if (!dataMail[mail.sender.id].outbox) return false;

    dataMail[mail.reciver.id].inbox[mail.id] = {}
    dataMail[mail.reciver.id].inbox[mail.id].sender = {}
    dataMail[mail.reciver.id].inbox[mail.id].sender.name = dataMail[mail.sender.id].username
    dataMail[mail.reciver.id].inbox[mail.id].sender.id = mail.sender.id
    dataMail[mail.reciver.id].inbox[mail.id].reciver = {}
    dataMail[mail.reciver.id].inbox[mail.id].reciver.name = dataMail[mail.reciver.id].username
    dataMail[mail.reciver.id].inbox[mail.id].reciver.id = mail.reciver.id
    dataMail[mail.reciver.id].inbox[mail.id].title = mail.title
    dataMail[mail.reciver.id].inbox[mail.id].context = mail.context
    dataMail[mail.reciver.id].inbox[mail.id].date = mail.date
    dataMail[mail.reciver.id].inbox[mail.id].readed = false
    dataMail[mail.reciver.id].inbox[mail.id].icon = "✉️"
    dataMail.mailIds += '|' + mail.id

    const newMailId = generateMailId()
    dataMail[mail.sender.id].outbox[mail.id] = {}
    dataMail[mail.sender.id].outbox[mail.id].sender = {}
    dataMail[mail.sender.id].outbox[mail.id].sender.name = dataMail[mail.sender.id].username
    dataMail[mail.sender.id].outbox[mail.id].sender.id = mail.sender.id
    dataMail[mail.sender.id].outbox[mail.id].reciver = {}
    dataMail[mail.sender.id].outbox[mail.id].reciver.name = dataMail[mail.reciver.id].username
    dataMail[mail.sender.id].outbox[mail.id].reciver.id = mail.reciver.id
    dataMail[mail.sender.id].outbox[mail.id].title = mail.title
    dataMail[mail.sender.id].outbox[mail.id].context = mail.context
    dataMail[mail.sender.id].outbox[mail.id].date = mail.date
    dataMail[mail.sender.id].outbox[mail.id].readed = true
    dataMail[mail.sender.id].outbox[mail.id].icon = "✉️"
    dataMail.mailIds += '|' + newMailId

    saveDatabase()

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
    return dataMail.mailIds.toString().split('|')
}

/**
 * @param {string} userId
 * @param {MailFolder} folder
 */
function getAllEMails(userId, folder) {
    if (!dataMail[userId]) return [];
    if (!dataMail[userId].inbox) return [];

    const allMailIds = getAllMailIds()
    /**
     * @type {Mail[]}
     */
    let allMails = []

    for (let i = 0; i < allMailIds.length; i++) {
        const mailId = allMailIds[i];
        if (folder === MailFolder.inbox) {
            if (dataMail[userId].inbox[mailId]) {
                allMails.push(getMailFromRawJSON(dataMail[userId].inbox[mailId], mailId))
            }
        } else if (folder === MailFolder.outbox) {
            if (dataMail[userId].outbox[mailId]) {
                allMails.push(getMailFromRawJSON(dataMail[userId].outbox[mailId], mailId))
            }
        }
    }
    allMails = allMails.reverse()
    return allMails
}

function getMailFromRawJSON(rawJSON, id) {
    console.log(rawJSON)
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
    if (!dataMail[userId]) return;
    if (!dataMail[userId].inbox) return;

    const allMailIds = getAllMailIds()
    for (let i = 0; i < allMailIds.length; i++) {
        const mailId = allMailIds[i];
        if (dataMail[userId].inbox[mailId]) {
            dataMail[userId].inbox[mailId].readed = true
        }
    }

    saveDatabase()
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
        this.id = id;
        this.sender = sender;
        this.reciver = reciver;
        this.title = title;
        this.context = context;
        this.date = date;
        this.readed = readed;
        this.icon = icon;
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
        this.name = name;
        this.id = id;
        this.type = type;
    }
}

class MailMessage {
    /**
     * @param {Discord.MessageEmbed} embed
     * @param {disbut.MessageActionRow[]} actionRows
     */
    constructor(embed, actionRows) {
        this.embed = embed;
        this.actionRows = actionRows;
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
        this.user = user;
        this.mail = mail;
        this.message = message;
    }
}

//#endregion

//#region News

class NewsMessage {
    /**
     * @param {Discord.MessageEmbed} embed
     * @param {string} NotifyRoleId
     * @param {Discord.Message} message
    */
    constructor(embed, NotifyRoleId, message) {
        this.embed = embed;
        this.NotifyRoleId = NotifyRoleId;
        this.message = message;
    }
}
//#endregion
