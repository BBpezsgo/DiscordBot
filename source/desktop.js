//#region Imports, variables



const CommandWeather = require('./commands/weather')
const CommandHelp = require('./commands/help')
const CommandXp = require('./commands/database/xp')
const CommandShop = require('./commands/database/shop')
const CommandBusiness = require('./commands/database/businees')

const { xpRankIcon, xpRankNext, xpRankPrevoius, xpRankText } = require('./commands/database/xpFunctions')
const { CreateCommands, DeleteCommands } = require('./functions/commands')

const { LogManager } = require('./functions/log.js')
const { TranslateMessage } = require('./functions/translator.js')
const { StatesManager } = require('./functions/statesManager.js')
const { databaseManager } = require('./functions/databaseManager.js')

const logManager = new LogManager()
const statesManager = new StatesManager()

const ColorRoles = {
	red: "850016210422464534",
	yellow: "850016458544250891",
	blue: "850016589155401758",
	orange: "850016531848888340",
	green: "850016722039078912",
	purple: "850016668352643072",
	invisible: "850016786186371122"
}

/**
* @param {string} message
*/
function log(message = '') {
    logManager.Log(message, false)
}

const {INFO, ERROR, WARNING, SHARD, DEBUG, DONE, Color, activitiesDesktop, usersWithTax} = require('./functions/enums.js')

const consoleWidth = 80 - 2

const fs = require('fs')

/** @type {string[]} */
let listOfHelpRequiestUsers = []

loadingProcess('Bővítmények, változók betöltése...')
const Discord = require('discord.js')
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { perfix, token } = require('./config.json')
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] })
statesManager.botLoaded = true

let userstats = JSON.parse(fs.readFileSync('./database/userstats.json', 'utf-8'))

let dataStickers = JSON.parse(fs.readFileSync('./database/stickers.json', 'utf-8'))
let dataBot = JSON.parse(fs.readFileSync('./database/bot.json', 'utf-8'))
let dataUsernames = JSON.parse(fs.readFileSync('./database/userNames.json', 'utf-8'))
let dataMail = JSON.parse(fs.readFileSync('./database/mails.json', 'utf-8'))
let dataPolls = JSON.parse(fs.readFileSync('./database/polls.json', 'utf-8'))

const database = new databaseManager()
database.dataBasic = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'))
database.dataBackpacks = JSON.parse(fs.readFileSync('./database/backpacks.json', 'utf-8'))

const ytdl = require('ytdl-core')

const dayOfYear = Math.floor(((new Date()) - (new Date(new Date().getFullYear(), 0, 0))) / (1000 * 60 * 60 * 24))

const WS = require('./ws/ws')
var ws = new WS('1234', 5665, bot, logManager, database)

let musicArray = []
let musicFinished = true

const settings = JSON.parse(fs.readFileSync('settings.json', 'utf-8'))

const readline = require('readline')
const { abbrev } = require('./functions/abbrev')
const { DateToString } = require('./functions/dateToString')
const { DateToStringNews, ConvertNewsIdToName, NewsMessage } = require('./functions/news')

//#region Game Variables
/** @type {GameMap} */
let gameMap = null

/** @type {number} */
let gameCameraX = 0

/** @type {number} */
let gameCameraY = 0

/** @type {GameUserSettings[]} */
let gameUserSettings = []


/** @type {savedGameMessage[]} */
let allGameMessages = []
//#endregion

/** @type {CurrentlyWritingMail[]} */
let currentlyWritingEmails = []

//#endregion

/** @type [NewsMessage] */
const listOfNews = []
const incomingNewsChannel = '902894789874311198'
const processedNewsChannel = '746266528508411935'



loadingProcess('Betöltés...')

//#region Functions 

/**
 * @param {Discord.User} user
 * @param {string} username
 */
function saveUserToMemoryAll(user, username) {
    if (!database.dataBackpacks[user.id]) {
        database. dataBackpacks[user.id] = {}
    }
    database.dataBackpacks[user.id].username = username
    if (!database.dataBackpacks[user.id].crates) {
        database. dataBackpacks[user.id].crates = 0
    }
    if(!database.dataBackpacks[user.id].gifts) {
        database.  dataBackpacks[user.id].gifts = 0
    }
    if (!database.dataBackpacks[user.id].getGift) {
        database. dataBackpacks[user.id].getGift = 0
    }
    if (!database.dataBackpacks[user.id].tickets) {
        database. dataBackpacks[user.id].tickets = 0
    }
    if (!database.dataBackpacks[user.id].quizTokens) {
        database.   dataBackpacks[user.id].quizTokens = 0
    }
    if (!database.dataBackpacks[user.id].luckyCards) {
        database.  dataBackpacks[user.id].luckyCards = {}
    }
    if (!database.dataBackpacks[user.id].luckyCards.small) {
        database.  dataBackpacks[user.id].luckyCards.small = 0
    }
    if (!database.dataBackpacks[user.id].luckyCards.medium) {
        database.  dataBackpacks[user.id].luckyCards.medium = 0
    }
    if (!database.dataBackpacks[user.id].luckyCards.large) {
        database.dataBackpacks[user.id].luckyCards.large = 0
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
    fs.writeFile('./database/backpacks.json', JSON.stringify(database.dataBackpacks), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/basic.json', JSON.stringify(database.dataBasic), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/stickers.json', JSON.stringify(dataStickers), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/userNames.json', JSON.stringify(dataUsernames), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/mails.json', JSON.stringify(dataMail), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
    fs.writeFile('./database/polls.json', JSON.stringify(dataPolls), (err) => { if (err) { log(ERROR & ': ' & err.message) }; });
}

function reloadDatabase() {
    try {
        database. dataBackpacks = JSON.parse(fs.readFileSync('./database/backpacks.json', 'utf-8'))
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

    } else {

        if (message.channel.guild) {
            log(`<${username}> - ${message.content}`, 0)
        } else {
            log(`<${username}> ` + '\033[30m<Privált>' + '\033[37m' + '' + ` - ${message.content.slice(0, consoleWidth)}`, 16)
        }
    };

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
        channel.send({embeds: [ embed ]})
    }

    saveDatabase()
}

//#endregion
//#region Listener-ek

bot.on('reconnecting', () => {
    log(INFO + ': Újracsatlakozás...');
});

bot.on('disconnect', () => {
    log(ERROR + ': Megszakadt a kapcsolat!');
});

bot.on('resume', () => {
    log(INFO + ': Folytatás');
});

bot.on('error', error => {
    log(ERROR + ': ' + error);
});

bot.on('debug', debug => {
    statesManager.ProcessDebugMessage(debug)
    const translatedDebug = TranslateMessage(debug)

    if (translatedDebug == null) return;
    if (translatedDebug.secret == true) return;

    log(translatedDebug.messagePrefix + ': ' + translatedDebug.translatedText)
});

bot.on('warn', warn => {
    log(WARNING + ': ' + warn);
});

bot.on('shardError', (error, shardID) => {
    log(ERROR + ': shardError: ' + error);
});

bot.on('invalidated', () => {
    log(ERROR + ': Érvénytelen');
});

bot.on('shardDisconnect', (colseEvent, shardID) => {
    log(ERROR + ': Lecsatlakozva');
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Lecsatlakozva'
});

bot.on('shardReady', (shardID) => {
    const mainGuild = bot.guilds.cache.get('737954264386764812')
    const quizChannel = mainGuild.channels.cache.get('799340273431478303')
    quizChannel.messages.fetch()
    statesManager.shardCurrentlyLoading = false
});

bot.on('shardReconnecting', (shardID) => {
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Újracsatlakozás...'
});

bot.on('shardResume', (shardID, replayedEvents) => {
    log(SHARD & ': Folytatás: ' + replayedEvents.toString())
    statesManager.shardCurrentlyLoading = false
});

bot.on('raw', async event => {
    log(DEBUG & ': raw');

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
    //log(DEBUG + ': rateLimit: ' + RateLimitData.limit + '; timeout: ' + RateLimitData.timeout + '; route: "' + RateLimitData.route + '"; method: "' + RateLimitData.method + '"; path: "' + RateLimitData.path + '"');
});

bot.on('close', () => {
    log(SHARD & ': close');
});

bot.on('destroyed', () => {
    log(SHARD & ': destroyed');
});

bot.on('invalidSession', () => {
    log(SHARD & ': invalidSession');
});
bot.on('allReady', () => {
    log(SHARD & ': allReady');
});

bot.on('presenceUpdate', (oldPresence, newPresence) => {
    log(DEBUG & ': newStatus: ' + newPresence.status.toString());
})

bot.ws.on('READY', (data, shardID) => {
})

bot.ws.on('RESUMED', (data, shardID) => {
})

bot.ws.on('PRESENCE_UPDATE', (data, shardID) => {
})

bot.ws.on('VOICE_SERVER_UPDATE', (data, shardID) => {
})

bot.ws.on('VOICE_STATE_UPDATE', (data, shardID) => {
})

bot.on('voiceStateUpdate', (voiceStateOld, voiceStateNew) => {
    
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
        message.channel.send('> **\\✔️ Most hallható: \\🎧**', {embeds: [ embed ]})
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
        database.dataBackpacks[userId].tickets += val

        return 0 + '|' + val
    } else if (RandomPercente < 30) { // 20%
        val = 1
        database. dataBackpacks[userId].crates += val

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
 */
function commandStore(sender) {
    var currentDay = new Date().getDay();
    var dayCrates = dataBot.day - database.dataBasic[sender.id].day
    var crates = database.dataBackpacks[sender.id].crates
    var gifts =database. dataBackpacks[sender.id].gifts
    var tickets = database.dataBackpacks[sender.id].tickets
    var getGifts =database. dataBackpacks[sender.id].getGift
    var quizTokens = database.dataBackpacks[sender.id].quizTokens
    var smallLuckyCard = database.dataBackpacks[sender.id].luckyCards.small
    var mediumLuckyCard =database. dataBackpacks[sender.id].luckyCards.medium
    var largeLuckyCard =database. dataBackpacks[sender.id].luckyCards.large
    var money = database.dataBasic[sender.id].money

    const embed = new Discord.MessageEmbed()
        .setAuthor(sender.username, sender.displayAvatarURL())
        .setTitle('Hátizsák')
        .addField('Pénz', '\\💵 ' + abbrev(money), false)
        .addField('Alap cuccok',
            '> \\🧱 ' + crates + ' láda\n' +
            '> \\🎁 ' + gifts + ' ajándék\n' +
            '> \\🎟️ ' + tickets + ' kupon\n' +
            '> \\🎫 ' + quizTokens + ' Quiz Token\n' +
            '> \\🧰 ' + dayCrates + ' napi láda'
            , false)
        .addField('Sorsjegyek', '> \\💶 ' + smallLuckyCard + ' Black Jack\n> \\💷 ' + mediumLuckyCard + ' Buksza\n> \\💴 ' + largeLuckyCard + ' Fáraók Kincse', false)
        .setFooter('Ha használni szeretnéd az egyik cuccodat, kattints az ikonjára!')
        .setColor(database.dataBasic[sender.id].color)
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
        .setStyle("PRIMARY");
    const buttonDayCrate = new MessageButton()
        .setLabel("🧰")
        .setCustomId("openDayCrate")
        .setStyle("PRIMARY");
    const buttonLuckyCardSmall = new MessageButton()
        .setLabel("💶")
        .setCustomId("useLuckyCardSmall")
        .setStyle("SECONDARY");
    const buttonLuckyCardMedium = new MessageButton()
        .setLabel("💷")
        .setCustomId("useLuckyCardMedium")
        .setStyle("SECONDARY");
    const buttonLuckyCardLarge = new MessageButton()
        .setLabel("💴")
        .setCustomId("useLuckyCardLarge")
        .setStyle("SECONDARY");
    const buttonOpenGift = new MessageButton()
        .setLabel("🎀")
        .setCustomId("openGift")
        .setStyle("PRIMARY");
    const buttonSendGift = new MessageButton()
        .setLabel("🎁")
        .setCustomId("sendGift")
        .setStyle("SECONDARY");
    if (!crates > 0) { buttonCrate.setDisabled(true) };
    if (!dayCrates > 0) { buttonDayCrate.setDisabled(true) };
    if (!smallLuckyCard > 0) { buttonLuckyCardSmall.setDisabled(true) };
    if (!mediumLuckyCard > 0) { buttonLuckyCardMedium.setDisabled(true) };
    if (!largeLuckyCard > 0) { buttonLuckyCardLarge.setDisabled(true) };
    if (!getGifts > 0) { buttonOpenGift.setDisabled(true) };
    if (!gifts > 0) { buttonSendGift.setDisabled(true) };
    const rowPrimary = new MessageActionRow()
        .addComponents(buttonCrate, buttonDayCrate, buttonLuckyCardSmall, buttonLuckyCardMedium, buttonLuckyCardLarge)
    const rowSecondary = new MessageActionRow()
        .addComponents(buttonSendGift)
    if (getGifts > 0) { rowSecondary.addComponents(buttonOpenGift) };
   return {embeds: [ embed ], components: [rowPrimary, rowSecondary]}
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
 * @param {Discord.GuildMember} sender 
 * @param {number} ammount
 */
async function commandAllNapi(sender, ammount) {
    if (dayOfYear === database.dataBasic[sender.id].day) {
        return {content: '> **\\❌ Nincs napi ládád! \\🧰**'}
    } else {
        let dayCrates = Math.min(dataBot.day - database.dataBasic[sender.id].day, ammount)

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


        database.dataBasic[sender.id].day = database.dataBasic[sender.id].day + dayCrates
        saveDatabase()
    
        return {content: '> ' + dayCrates + 'x \\🧰 Kaptál:\n' +
            '>     \\💵 **' + getMoney + '** pénzt\n' +
            '>     \\🍺 **' + getXpS + '** xpt\n' +
            '>     \\🧱 **' + getChestS + '** ládát\n' +
            '>     \\🎟️ **' + getTicket + '** kupont'
        }
    };
}

/**
 * @param {Discord.GuildMember} sender 
 * @param {number} ammount
 */
async function commandAllCrate(sender, ammount) {
    if (database.dataBackpacks[sender.id].crates === 0) {
        return {content: '> **\\❌ Nincs ládád! \\🧱**'}
    } else {
        let Crates = Math.min(database.dataBackpacks[sender.id].crates, ammount)

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
                database.dataBackpacks[sender.id].gifts += 1
            };
        }

        database.  dataBackpacks[sender.id].crates = database.dataBackpacks[sender.id].crates - Crates
        saveDatabase()

        return {content: '> ' + Crates + 'x \\🧱 Kaptál:\n' +
            '>     \\🍺 **' + getXpS + '** xpt\n' +
            '>     \\💵 **' + getMoney + '** pénzt\n' +
            '>     \\🎁 **' + getGiftS + '** ajándékot'
        }

    };
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
        message.channel.send('> **\\🔜 Lejátszólista: [' + musicArray.length + ']\\🎧**', {embeds: [ embed ]})
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
 * @param {Discord.GuildMember} member
 */
function commandProfil(member) {
    const embed = new Discord.MessageEmbed()
        .setColor(database.dataBasic[member.id].color)
        .setTitle('Profil')
        .setAuthor(member.displayName, member.displayAvatarURL())
        .addField('Matricák',
            '> ' + dataStickers[member.id].stickersMusic + ' \\🎼 Zene\n' +
            '> ' + dataStickers[member.id].stickersMeme + ' \\🎭 Meme\n' +
            '> ' + dataStickers[member.id].stickersYoutube + ' \\🎬 YouTube\n' +
            '> ' + dataStickers[member.id].stickersMessage + ' \\📋 Üzenet\n' +
            '> ' + dataStickers[member.id].stickersCommand + ' \\🖥️ Parancs\n' +
            '> ' + dataStickers[member.id].stickersTip + ' \\💡 Ötlet'
        )
        .addField('Statisztika',
            '> \\🎼 Zenék: ' + abbrev(userstats[member.id].memes) + '\n' +
            '> \\🎭 Vicces dolgok: ' + abbrev(userstats[member.id].musics) + '\n' +
            '> \\🎬 YouTube linkek: ' + abbrev(userstats[member.id].youtubevideos) + '\n' +
            '> \\📋 Üzenetek: ' + abbrev(userstats[member.id].messages) + '\n' +
            '> \\🖥️ Parancsok:' + abbrev(userstats[member.id].commands) + '\n' +
            '> \\👁‍🗨 Összes karakter: ' + abbrev(userstats[member.id].chars)
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
    return {embeds: [ embed ]}
}

function quiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken) {
    const optionEmojis = listOfOptionEmojis.toString().replace(' ', '').split(';')
    const optionTexts = listOfOptionText.toString().replace(' ', '').split(';')
    let optionText = ''
    for (let i = 0; i < optionTexts.length; i++) {
        optionText += `> ${optionEmojis[i]}  ${optionTexts[i]}\n`
    }
    const embed = new Discord.MessageEmbed()
        .setColor(Color.Pink)
        .setTitle('Quiz!')
        .setDescription(
            `\\✔️  **${addXpValue}\\🍺** és **${addToken}\\🎫**\n` +
            `\\❌ **-${removeXpValue}\\🍺** és **-${removeToken}\\🎫**\n` +
            `Ha van **\`Quiz - Answer Streak\`** rangod, bejelölheted a 🎯 opciót is, hogy a fenti értékek számodra megduplázódjanak.`
            )
        .addField(`${titleText}`, `${optionText}`)

    bot.channels.cache.get('799340273431478303').send({ embeds: [embed] }).then(message => {
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
        .addField(`${titleText}`, `${optionText}`);

    bot.channels.cache.get('795935090026086410').send({embeds: [ embed ]}).then(message => {
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
    const channel = bot.channels.cache.get('799340273431478303')
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
        const correctAnswer =  message.embeds[0].fields[0].value.split('\n')[correctIndex].replace('>', '').trimStart()
        const correctAnswerEmoji = correctAnswer.split(' ')[0]
        const correctAnswerText = correctAnswer.replace(correctAnswerEmoji, '').trimStart()
        const awardAdd0 = message.embeds[0].description.split('\n')[0].replace('✔️', '').replace('\\', '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[0].replace('🍺', '')
        const awardAdd1 = message.embeds[0].description.split('\n')[0].replace('✔️', '').replace('\\', '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[1].replace('🎫', '')
        const awardRemove0 = message.embeds[0].description.split('\n')[1].replace('❌', '').replace('\\', '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[0].replace('🍺', '').replace('-', '')
        const awardRemove1 = message.embeds[0].description.split('\n')[1].replace('❌', '').replace('\\', '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[1].replace('🎫', '').replace('-', '')
        
        message.reactions.resolve('🎯').users.fetch().then(async (userList0) => {
            /**@type {string[]} */
            const usersWithCorrectAnswer = []
            /**@type {string[]} */
            const usersWithWrongAnswer = []
            const usersWithMultiplier = userList0.map((user) => user.id)

            let finalText = '**A helyes válasz: ' + correctAnswerEmoji + ' ' + correctAnswerText + '**'

            var Mittomen = ''
            for (let i = 0; i < answersEmoji.length; i++) {
                const currentAnswerEmoji = answersEmoji[i];
                await message.reactions.resolve(currentAnswerEmoji).users.fetch().then(async (userList1) => {
                    const users = userList1.map((user) => user.id)
                    for (let j = 0; j < users.length; j++) {
                        const userId = users[j]
                        if (userId == bot.user.id) { continue }
            
                        //const members = await bot.guilds.cache.get('737954264386764812').members.fetch({ limit: 20 })
                        const member = await bot.guilds.cache.get('737954264386764812').members.fetch({user: userId})

                        if (currentAnswerEmoji == correctAnswerEmoji) {
                            usersWithCorrectAnswer.push(userId)
                            if (usersWithMultiplier.includes(userId) && HasQuizStreakRole(member)) {
                                finalText += '\n> <@!' + userId + '> nyert ' + (parseInt(awardAdd0) * 2) + Mittomen + '🍺t és ' + (parseInt(awardAdd1) * 2) + Mittomen + '🎫t'
                            } else {
                                finalText += '\n> <@!' + userId + '> nyert ' + (awardAdd0) + Mittomen + '🍺t és ' + (awardAdd1) + Mittomen + '🎫t'
                            }
                        } else {
                            usersWithWrongAnswer.push(userId)
                            if (usersWithMultiplier.includes(userId) && HasQuizStreakRole(member)) {
                                finalText += '\n> <@!' + userId + '> veszített ' + (parseInt(awardRemove0) * 2) + Mittomen + '🍺t és ' + (parseInt(awardRemove1) * 2) + Mittomen + '🎫t'
                            } else {
                                finalText += '\n> <@!' + userId + '> veszített ' + (awardRemove0) + Mittomen + '🍺t és ' + (awardRemove1) + Mittomen + '🎫t'
                            }
                        }
                    }
                });
                Mittomen = '\\'
            }
            bot.channels.cache.get('799340273431478303').send(finalText + '\n\n||\\⚠️ Ez ALFA verzió! A hibát itt jelentsd: <#930166957062357062> ||')
        });
    })
}
//#endregion

/** @param {Discord.GuildMember} member  @param {string} exceptRoleId  */
async function removeAllColorRoles(member, exceptRoleId) {
    const roleList = [ColorRoles.blue, ColorRoles.green, ColorRoles.invisible, ColorRoles.orange, ColorRoles.purple, ColorRoles.red, ColorRoles.yellow]
    for (let i = 0; i < roleList.length; i++) {
        const role = roleList[i];
        if (role == exceptRoleId) { continue; }
        if (member == undefined || member == null) { break; }
        if (member.roles.cache.some(role => role.id == role)) {
            member.roles.remove(member.guild.roles.cache.get(role))
        }
    }
}

bot.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        processApplicationCommand(interaction)
    } else if (interaction.isButton()) {
        try {
            if (interaction.user.username === interaction.message.embeds[0].author.name) { } else {
                interaction.reply({content: '> \\❗ **Ez nem a tied!**', ephemeral: true})
                return;
            }
        } catch (error) { }

        let isOnPhone = false
        let isInDebugMode = false
        let playerIndex = 0

        if (interaction.component.customId === 'openDayCrate') {
            if (dayOfYear === database.dataBasic[interaction.user.id].day) {
                interaction.reply({content: '> **\\❌ Már kinyitottad a napi ládádat!*', ephemeral: true});
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
        
                interaction.reply({content: '> \\🧰 Kaptál:  ' + txt, ephemeral: true});
            };
        
            database.dataBasic[interaction.user.id].day += 1
            if (database.dataBasic[interaction.user.id].day > dataBot.day) {
                database.dataBasic[interaction.user.id].day = dataBot.day
            }

            interaction.message.edit(commandStore(interaction.user))

            saveDatabase()
            return;
        }

        if (interaction.component.customId === 'openCrate') {
            database.dataBackpacks[interaction.user.id].crates -= 1
            var replies = ['xp', 'money', 'gift'];
            var random = Math.floor(Math.random() * 3);
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

            interaction.message.edit(commandStore(interaction.user))
            interaction.reply({content: '> \\🧱 Kaptál:  ' + txt, ephemeral: true});

            saveDatabase()
            return
        }

        if (interaction.component.customId === 'useLuckyCardSmall') {
            database. dataBackpacks[interaction.user.id].luckyCards.small -= 1
            var val = 0

            var nyeroszam = Math.floor(Math.random() * 2)
            if (nyeroszam === 1) {
                val = Math.floor(Math.random() * 1001) + 1500
                database.dataBasic[interaction.user.id].money += val
            }

            if (val === 0) {
                interaction.reply({content: '> \\💶 Nyertél:  **semmit**', ephemeral: true});
            } else {
                interaction.reply({content: '> \\💶 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true});
            }

            interaction.message.edit(commandStore(interaction.user))
            
            saveDatabase()
            return;
        }

        if (interaction.component.customId === 'useLuckyCardMedium') {
            database. dataBackpacks[interaction.user.id].luckyCards.medium -= 1
            var val = 0

            var nyeroszam = Math.floor(Math.random() * 4)
            if (nyeroszam === 1) {
                val = Math.floor(Math.random() * 3001) + 3000
                database.dataBasic[interaction.user.id].money += val
            }

            if (val === 0) {
                interaction.reply({content: '> \\💷 Nyertél:  **semmit**', ephemeral: true});
            } else {
                interaction.reply({content: '> \\💷 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true});
            }

            interaction.message.edit(commandStore(interaction.user))
            
            saveDatabase()
            return;
        }

        if (interaction.component.customId === 'useLuckyCardLarge') {
            database.   dataBackpacks[interaction.user.id].luckyCards.large -= 1
            var val = 0

            var nyeroszam = Math.floor(Math.random() * 9)
            if (nyeroszam === 1) {
                val = Math.floor(Math.random() * 5001) + 6500
                database.dataBasic[interaction.user.id].money += val
            }

            if (val === 0) {
                interaction.reply({content: '> \\💴 Nyertél:  **semmit**', ephemeral: true});
            } else {
                interaction.reply({content: '> \\💴 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true});
            }

            interaction.message.edit(commandStore(interaction.user))
            
            saveDatabase()
            return;
        }

        if (interaction.component.customId === 'openGift') {
            database.  dataBackpacks[interaction.user.id].getGift -= 1
            var replies = ['xp', 'money'];
            var random = Math.floor(Math.random() * 2);
            var out = replies[random]
            var val = 0
            var txt = ''

            if (out === 'xp') {
                val = Math.floor(Math.random() * 530) + 210
                txt = '**\\🍺 ' + val + '** xp-t'
                database.dataBasic[interaction.user.id].score += val
            };
            if (out === 'money') {
                val = Math.floor(Math.random() * 2300) + 1000
                txt = '**\\💵' + val + '** pénzt'
                database.dataBasic[interaction.user.id].money += val
            };

            interaction.reply({content: '> \\🎀 Kaptál ' + txt, ephemeral: true});
            interaction.message.edit(commandStore(interaction.user))
            
            saveDatabase()
            return;
        }

        if (interaction.component.customId === 'sendGift') {
            interaction.reply({content: '> **\\❔ Használd a **`.gift @Felhasználó`** parancsot, egy személy megajándékozásához!**', ephemeral: true});
            interaction.message.edit(commandStore(interaction.user))
            
            saveDatabase()
            return;
        }

        if (interaction.component.customId.startsWith('game')) {
            if (gameMap == null) {
                interaction.reply('> \\❗ **Nincs létrehozva játék!**', true)
            } else {
                if (interaction.component.customId === 'gameW') {
                    gameMap.players[playerIndex].direction = Direction.Up
                    if (playerCanMoveToHere(gameMap.players[playerIndex].x, gameMap.players[playerIndex].y - 1, gameMap) === true) {
                        gameMap.players[playerIndex].y -= 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user)
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)

                } else if (interaction.component.customId === 'gameA') {
                    gameMap.players[playerIndex].direction = Direction.Left
                    if (playerCanMoveToHere(gameMap.players[playerIndex].x - 1, gameMap.players[playerIndex].y, gameMap) === true) {
                        gameMap.players[playerIndex].x -= 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user)
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)

                } else if (interaction.component.customId === 'gameS') {
                    gameMap.players[playerIndex].direction = Direction.Down
                    if (playerCanMoveToHere(gameMap.players[playerIndex].x, gameMap.players[playerIndex].y + 1, gameMap) === true) {
                        gameMap.players[playerIndex].y += 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user)
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)

                } else if (interaction.component.customId === 'gameD') {
                    gameMap.players[playerIndex].direction = Direction.Right
                    if (playerCanMoveToHere(gameMap.players[playerIndex].x + 1, gameMap.players[playerIndex].y, gameMap) === true) {
                        gameMap.players[playerIndex].x += 1
                    }
                    gameResetCameraPos(isOnPhone, interaction.user)
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)

                } else if (interaction.component.customId === 'gameHit') {
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
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)

                } else if (interaction.component.customId === 'gameUse') {
    
                } else if (interaction.component.customId === 'gameSwitchPhone') {
                    for (let i = 0; i < gameUserSettings.length; i++) {
                        if (gameUserSettings[i].userId === interaction.user.id) {
                            if (isOnPhone === true) {
                                gameUserSettings[i].isOnPhone = false
                            } else {
                                gameUserSettings[i].isOnPhone = true
                            }
                        }
                    }
    
                    if (getGameUserSettings(interaction.user.id) !== null) {
                        isOnPhone = getGameUserSettings(interaction.user.id).isOnPhone
                    }
    
                    gameResetCameraPos(isOnPhone, interaction.user)
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)
    
                    log(gameUserSettings);
                } else if (interaction.component.customId === 'gameSwitchDebug') {
                    for (let i = 0; i < gameUserSettings.length; i++) {
                        if (gameUserSettings[i].userId === interaction.user.id) {
                            if (isInDebugMode === true) {
                                gameUserSettings[i].isInDebugMode = false
                            } else {
                                gameUserSettings[i].isInDebugMode = true
                            }
                        }
                    }
    
                    if (getGameUserSettings(interaction.user.id) !== null) {
                        isInDebugMode = getGameUserSettings(interaction.user.id).isInDebugMode
                    }
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)
    
                    log(gameUserSettings);
                } else if (interaction.component.customId === 'gameRestart') {
                    gameMap = createGame(50, 50)
                    connectTogame(interaction.user)
                    gameResetCameraPos(isOnPhone, interaction.user)
    
                    resetGameMessage(interaction.user, interaction.message, isOnPhone, isInDebugMode, interaction)
                }
            }
            return;
        }

        if (interaction.component.customId == 'shopClose') {
            interaction.message.delete()
        }

        if (interaction.component.customId.startsWith('shopBuy')) {
            const money = database.dataBasic[interaction.user.id].money;
            const buyItem = interaction.component.customId.replace('shopBuy', '')
            if (buyItem == 'Crate') {
                if (money >= 2099) {
                    database.dataBasic[interaction.user.id].money -= 2099
                    database.dataBackpacks[interaction.user.id].crates += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1))
                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (buyItem == 'Gift') {
                if (money >= 3999) {
                    database.dataBasic[interaction.user.id].money -= 3999
                    database.dataBackpacks[interaction.user.id].gifts += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1))
                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (buyItem == 'Ticket') {
                if (money >= 8999) {
                    database.dataBasic[interaction.user.id].money -= 8999
                    database.dataBackpacks[interaction.user.id].tickets += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1))
                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (buyItem == 'WC') {
                if (money >= 799) {
                    database.dataBasic[interaction.user.id].money -= 799

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 1))
                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (buyItem == 'LuckySmall') {
                if (money >= 1999) {
                    database.dataBasic[interaction.user.id].money -= 1999
                    database.dataBackpacks[interaction.user.id].luckyCards.small += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 2))
                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (buyItem == 'LuckyMedium') {
                if (money >= 3599) {
                    database.dataBasic[interaction.user.id].money -= 3599
                    database.dataBackpacks[interaction.user.id].luckyCards.medium += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 2))
                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (buyItem == 'LuckyLarge') {
                if (money >= 6999) {
                    database.dataBasic[interaction.user.id].money -= 6999
                    database.dataBackpacks[interaction.user.id].luckyCards.large += 1

                    interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database,2))
                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            }
            return
        }
    } else if (interaction.isSelectMenu()) {
        if (interaction.customId.startsWith('shopMenu')) {
            interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, interaction.values[0]))
            return
        }

        if (interaction.customId == 'shopBackpackColors') {
            const selectedIndex = interaction.values[0]
            const money = database.dataBasic[interaction.user.id].money;
            
            if (selectedIndex == 0) {
                if (money >= 3299) {
                    database.dataBasic[interaction.user.id].money -= 3299
                    database.dataBasic[interaction.user.id].color = '#fffff9'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 1) {
                if (money >= 99) {
                    database.dataBasic[interaction.user.id].money -= 99
                    database.dataBasic[interaction.user.id].color = '#000000'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 2) {
                if (money >= 2999) {
                    database.dataBasic[interaction.user.id].money -= 2999
                    database.dataBasic[interaction.user.id].color = '#734c09'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 3) {
                if (money >= 1499) {
                    database.dataBasic[interaction.user.id].money -= 1499
                    database.dataBasic[interaction.user.id].color = '#ff0000'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 4) {
                if (money >= 2499) {
                    database.dataBasic[interaction.user.id].money -= 2499
                    database.dataBasic[interaction.user.id].color = '#ffbb00'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 5) {
                if (money >= 1499) {
                    database.dataBasic[interaction.user.id].money -= 1499
                    database.dataBasic[interaction.user.id].color = '#ffff00'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 6) {
                if (money >= 2499) {
                    database.dataBasic[interaction.user.id].money -= 2499
                    database.dataBasic[interaction.user.id].color = '#00ff00'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 7) {
                if (money >= 1499) {
                    database.dataBasic[interaction.user.id].money -= 1499
                    database.dataBasic[interaction.user.id].color = '#0000ff'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            } else if (selectedIndex == 8) {
                if (money >= 2499) {
                    database.dataBasic[interaction.user.id].money -= 2499
                    database.dataBasic[interaction.user.id].color = '#9d00ff'

                    saveDatabase()
                } else {
                    interaction.reply({content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true})
                }
            }
            interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 4))
            
            return
        }

        if (interaction.customId == 'shopNameColors') {
            const selectedIndex = interaction.values[0]
            const money = database.dataBasic[interaction.user.id].money;

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

            interaction.update(CommandShop(interaction.channel, interaction.user, interaction.member, database, 5, newColorRoleId))
            return
        }
    }
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        bot.destroy()
        process.exit()
    } else if (key.ctrl && key.name === 't') {
        let x = ''
        uptimeTimes.forEach((time) => {
            if (time == true) {
                x += 'X'
            } else {
                x += 'O'
            }
        })
    }
});

bot.on('clickMenu', async (button) => {
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
    
    if (button.id === 'mailFolderMain') {
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

const getApp = (guildId) => {
    const app = bot.api.applications(bot.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

bot.once('ready', async () => {
    if (false) {
        await DeleteCommands(bot)
    } else {
        CreateCommands(bot)
    }

    const lastDay = dataBot.day
    dataBot.day = dayOfYear
    fs.writeFile('./database/bot.json', JSON.stringify(dataBot), (err) => { if (err) { log(ERROR & ': ' & err.message, 37) }; });

    log(DONE + ': A BOT kész!')

    for (let i = 0; i < dayOfYear - lastDay; i++) {
        for (let i = 0; i < usersWithTax.length; i++) {
            const element = usersWithTax[i];
            try {
                const userMoney = database.dataBasic[element].money
                const finalTax = Math.floor(userMoney * 0.001) * 2
                const userMoneyFinal = userMoney - finalTax
                log("[" + userMoney + " ---1%-->" + finalTax + " ======>" + userMoneyFinal + "]")
                database.dataBasic[element].money = userMoneyFinal
            } catch (error) {
                log(ERROR + ': ' + error)
            }
        }
        log("Mindenki megadózva")
    }
    savePollDefaults()
    saveDatabase()

    const channel = bot.channels.cache.get(incomingNewsChannel)
    channel.messages.fetch({ limit: 10 }).then(async (messages) => {
        /**
         * @type {[Discord.Message]}
         */
        const listOfMessage = []

        messages.forEach((message) => {
            listOfMessage.push(message)
        })

        listOfMessage.reverse()
        listOfMessage.forEach(message => {
            processNewsMessage(message)
        })
        log(`Received ${listOfMessage.length} news`)
    })
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
    } else {
        if (message.author.bot == false && message.author.system == false) {
            const senderMember = message.guild.members.cache.get(message.author.id)
            if (senderMember != undefined) {
                embed.setAuthor(senderMember.displayName, message.author.displayAvatarURL())
            } else {
                embed.setAuthor(message.author.username, message.author.displayAvatarURL())
            }
        }
    }

    listOfNews.push(new NewsMessage(embed, role, message))
}

bot.on('ready', () => { //Change status
    setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesDesktop.length - 1) + 1);
        bot.user.setActivity(activitiesDesktop[index]);
    }, 10000);
    setInterval(() => {
        if (listOfNews.length > 0) {
            const newsMessage = listOfNews.shift()
            /**
             * @type {Discord.TextChannel}
             */
            const newsChannel = bot.channels.cache.get(processedNewsChannel)
            const embed = newsMessage.embed
            if (newsMessage.NotifyRoleId.length == 0) {
                newsChannel.send({ embeds: [ embed ] })
                    .then(() => { newsMessage.message.delete() })
            } else {
                newsChannel.send({ content: `<@&${newsMessage.NotifyRoleId}>`, embeds: [ embed ] })
                    .then(() => { newsMessage.message.delete() })
            }
        }

    }, 2000);
})
bot.on('messageCreate', async message => { //Message
    const thisIsPrivateMessage = message.channel.type === 'dm'
    if (message.author.bot && thisIsPrivateMessage === false) return
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
        processNewsMessage(message)

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
    if (user.bot) return

    if (!dataUsernames[user.id]) {
        dataUsernames[user.id] = {}
        dataUsernames[user.id].username = user.username
    }
    dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })
})
bot.on('messageReactionAdd', (messageReaction, user) => { //React
    if (user.bot) return

    if (!dataUsernames[user.id]) {
        dataUsernames[user.id] = {}
        dataUsernames[user.id].username = user.username
    }
    dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })
})
bot.on('messageDelete', (message) => { //React
})

/**
 * @param {Discord.Message} message
 * @param {boolean} thisIsPrivateMessage
 * @param {Discord.User} sender
 * @param {string} command
 */
function processCommand(message, thisIsPrivateMessage, sender, command) {

    //#region Enabled in dm

    if (command === `pms`) {
        CommandBusiness(message.channel, sender, thisIsPrivateMessage)
        userstatsSendCommand(sender)
        return;
    };

    if (command === `test`) {
        /*
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

    if (command.startsWith(`gift `)) {
        if (thisIsPrivateMessage === false) {
            if (message.channel.guild.id === '737954264386764812') {
                userstatsSendCommand(sender)
                try {

                    var giftableMember = message.mentions.users.first()
                    if (database.dataBackpacks[sender.id].gifts > 0) {
                        if (giftableMember.id === sender.id) {
                            message.channel.send('> \\❌ **Nem ajándékozhatod meg magad!**');
                        } else {
                            database.dataBackpacks[giftableMember.id].getGift += 1;
                            database.dataBackpacks[sender.id].gifts -= 1
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(sender.username, sender.displayAvatarURL())
                                .setTitle('\\✔️ ' + giftableMember.username.toString() + ' megajándékozva.')
                                .setColor(Color.Highlight)
                            message.channel.send({embeds: [ embed ]});
                            message.mentions.users.first().send('> **\\✨ ' + sender.username + ' megajándékozott! \\🎆**');
                            saveDatabase()
                        }
                    } else {
                        if (giftableMember.id === sender.id) {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(sender.username, sender.displayAvatarURL())
                                .setTitle('\\❌ Nem ajándékozhatod meg magad. Sőt! Nincs is ajándékod.')
                                .setColor(Color.Error)
                            message.channel.send({embeds: [ embed ]});
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(sender.username, sender.displayAvatarURL())
                                .setTitle('\\❌ Nincs ajándékod, amit odaadhatnál.')
                                .setColor(Color.Error)
                            message.channel.send({embeds: [ embed ]});
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

    if (command.startsWith(`pms name `)) {
        message.channel.send('> \\⛔ **Ez a parancs átmenetileg nem elérhető!**')
        //commandPmsName(message.channel, sender, command.replace(`pms name `, ''))
        userstatsSendCommand(sender)
        return;
    }

    if (command.startsWith(`quiz\n`)) {
        const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
        quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6])
        userstatsSendCommand(sender)
        return;
    } else if (command.startsWith(`quiz help`)) {
        userstatsSendCommand(sender)
        const embed = new Discord.MessageEmbed()
            .addField('Quiz szintaxis',
                '.quiz\n' +
                'Cím\n' +
                'Opció;Opció;Opció\n' + 
                '💥;💥;💥\n' +
                '5000 (add XP)\n' +
                '2500 (remove XP)\n' +
                '10 (add Token)\n' +
                '5 (remove Token)'
            )
            .setColor(Color.Highlight)
        message.channel.send({embeds: [ embed ]})
        return;
    } else if (command.startsWith(`quizdone help`)) {
        userstatsSendCommand(sender)
        const embed = new Discord.MessageEmbed()
            .addField('Quizdone szintaxis',
                '.quizdone messageId correctIndex(0 - ...)'
            )
            .setColor(Color.Highlight)
        message.channel.send({embeds: [ embed ]})
        return;
    } else if (command.startsWith(`quizdone `)) {
        quizDone(command.replace(`quizdone `, '').split(' ')[0], command.replace(`quizdone `, '').split(' ')[1])
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
        message.channel.send({ embeds: [_message.embed], components: _message.actionRows }).then(msg => {
            allGameMessages.push(new savedGameMessage(msg, sender))
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
         * @type {disbut.MessageButton[]}
         */
        /*
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
        */
    }

    message.channel.send("> \\❌ **Ismeretlen parancs! **`.help`** a parancsok listájához!**");
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command */
async function processApplicationCommand(command) {

    if (command.commandName === `xp`) {
        CommandXp(command)
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
            .addField('\\🖥️ BOT:',
                '> Készen áll: ' + DateToString(bot.readyAt) + '\n' +
                '> Készen áll: ' + DateToString(new Date(bot.readyTimestamp)) + '\n' +
                '> Üzemidő: ' + Math.floor(bot.uptime / 1000) + ' másodperc'
            )
            .addField('\\📡 WebSocket:',
                '> Átjáró: ' + bot.ws.gateway + '\n' +
                '> Ping: ' + bot.ws.ping + ' ms\n' +
                '> Státusz: ' + WsStatus
            )
        if (bot.shard != null) {
            embed.addField('Shard:',
                '> Fő port: ' + bot.shard.parentPort + '\n' +
                '> Mód: ' + bot.shard.mode
            )
        }
        command.reply({embeds: [ embed ]})
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `weather`) {
        CommandWeather(command)
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
        command.reply({ embeds: [CommandHelp(false)]})
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `crate`) {
        command.reply(await commandAllCrate(command.member, command.options.getInteger("darab")))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `napi`) {
        command.reply(await commandAllNapi(command.member, command.options.getInteger("darab")))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `profil`) {
        command.reply(commandProfil(command.member))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `store`) {
        command.reply(commandStore(command.user))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `bolt`) {
        command.reply(CommandShop(command.channel, command.user, command.member, database, 0))
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `quiz`) {
        try {
            quiz(command.options.getString("title"), command.options.getString("options"), command.options.getString("option_emojis"), command.options.getInteger("add_xp"), command.options.getInteger("remove_xp"), command.options.getInteger("add_token"), command.options.getInteger("remove_token"))
            command.reply({content: '> \\✔️ **Kész**', ephemeral: true})
        } catch (error) {
            command.reply({content: '> \\❌ **Hiba: ' + error.toString() + '**', ephemeral: true})
        }
        userstatsSendCommand(command.user)
        return
    }
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

    const buttonW = new MessageButton()
        .setLabel("  ↑  ")
        .setCustomId("gameW")
        .setStyle("SECONDARY");
    const buttonA = new MessageButton()
        .setLabel(" ←")
        .setCustomId("gameA")
        .setStyle("SECONDARY");
    const buttonS = new MessageButton()
        .setLabel("  ↓  ")
        .setCustomId("gameS")
        .setStyle("SECONDARY");
    const buttonD = new MessageButton()
        .setLabel(" →")
        .setCustomId("gameD")
        .setStyle("SECONDARY");
    const buttonHit = new MessageButton()
        .setLabel("👊")
        .setCustomId("gameHit")
        .setStyle("SECONDARY");
    const buttonUse = new MessageButton()
        .setLabel("🤚")
        .setCustomId("gameUse")
        .setStyle("SECONDARY");
    const buttonSwitchPhone = new MessageButton()
        .setLabel("📱 Telefonon vagyok")
        .setCustomId("gameSwitchPhone")
        .setStyle("SECONDARY");
    const buttonSwitchDebug = new MessageButton()
        .setLabel("📟")
        .setCustomId("gameSwitchDebug")
        .setStyle("SECONDARY");
    const buttonRestart = new MessageButton()
        .setLabel("↺")
        .setCustomId("gameRestart")
        .setStyle("DANGER");



    if (playerDirection === Direction.Up) {
        buttonW.setStyle("PRIMARY")
    } else if (playerDirection === Direction.Left) {
        buttonA.setStyle("PRIMARY")
    } else if (playerDirection === Direction.Down) {
        buttonS.setStyle("PRIMARY")
    } else if (playerDirection === Direction.Right) {
        buttonD.setStyle("PRIMARY")
    }

    if (isOnPhone === true) {
        buttonSwitchPhone.setLabel("🖥️")
    } else {
        buttonSwitchPhone.setLabel("📱 Telefonon vagyok")
    }

    if (getGameUserSettings(user.id).isInDebugMode === true) {
        buttonSwitchDebug.setStyle("PRIMARY")
    } else {
        buttonSwitchDebug.setStyle("SECONDARY")
    }

    const row0 = new MessageActionRow()
        .addComponents(buttonUse, buttonW, buttonHit, buttonSwitchPhone)
    const row1 = new MessageActionRow()
        .addComponents(buttonA, buttonS, buttonD, buttonSwitchDebug, buttonRestart)

    return new GameMessage(getGameEmbed(user, isOnPhone, isInDebugMode), [row0, row1])
}

/**
 * @param {Discord.User} user
 * @param {Discord.Message} message
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 * @param {Discord.ButtonInteraction<Discord.CacheType>} integration
 */
function resetGameMessage(user, message, isOnPhone, isInDebugMode, integration) {
    log('resetGameMessage.isOnPhone: ' + isOnPhone)

    for (let i = 0; i < allGameMessages.length; i++) {
        const savedGameMsg = allGameMessages[i];

        const _message = getGameMessage(savedGameMsg.user, isOnPhone, isInDebugMode)
        savedGameMsg.message.edit({ embeds: [_message.embed], components: _message.actionRows })
        integration.update({ embeds: [_message.embed], components: _message.actionRows })
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
    channel.send({embeds: [ message.embed ], components: message.actionRows[0]} )
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
