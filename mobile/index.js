//#region Imports, variables

console.clear()
console.log('[NodeJS]: Betöltés...\x1b[0m')

const CommandWeather = require('./commands/weather')
const CommandHelp = require('./commands/help')

const { LogManager } = require('./functions/log.js')
const { TranslateMessage } = require('./functions/translator.js')
const { StatesManager } = require('./functions/statesManager.js')

const logManager = new LogManager()
const statesManager = new StatesManager()

/**
* @param {string} message
*/
function log(message = '') {
    logManager.Log(message, false)
}

const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + '\033[37m' + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + '\033[37m' + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + '\033[37m' + ']'
const SHARD = '[' + '\033[35m' + 'SHARD' + '\033[40m' + '' + '\033[37m' + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + '\033[37m' + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + '\033[37m' + ']'

/**
 * @type {string[]}
 */
let listOfHelpRequiestUsers = [];

const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { perfix, token } = require('./config.json')
const bot = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" } }, intents: ["GUILDS", "GUILD_MESSAGES"] })

//const WS = require('./ws/ws')
//var ws = new WS('1234', 5665, bot)

const ytdl = require('ytdl-core')

let musicArray = []
let musicFinished = true

let lastNoNews = false

const activities_list = [
    "Manga",
    "Discord.js documentation",
    "Reddit",
    "Twitter",
    "Facebook",
    "Instagram",
    "Wiki"
];

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

//#endregion

/**
 * @type [NewsMessage]
 */
const listOfNews = []
const incomingNewsChannel = '902894789874311198'
const processedNewsChannel = '746266528508411935'
/**
 * @type [boolean]
 */
const uptimeTimes = []
let uptimeSaved = true

//#region Functions

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

        } else if (message.content.startsWith('https://www.youtube.com/') || message.content.startsWith('https://youtu.be/')) {

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
        } else if (message.content.startsWith('https://cdn.discordapp.com/attachments/')) {
        } else if (message.content.startsWith('https://')) {
        } else if (message.attachments.size) {
        } else {
        }
    } else {
        if (message.channel.guild) {
        } else {
        }
    };

}

//#endregion
setInterval(() => {
    if (uptimeSaved == false) {
        uptimeTimes.push(true)
    } else {
        uptimeTimes.push(false)
    }
    log('newUptimeTime')
}, 60000)
//#region Listener-ek

bot.on('interactionCreate', interaction => {
    console.log(interaction)
    if (interaction.isButton()) {
        if (interaction.customId === 'sendHelp') {
            const thisIsPrivateMessage = interaction.message.channel.type === 'dm'
            CommandHelp(interaction.message.channel, interaction.user, thisIsPrivateMessage)

            //interaction.deferReply()
            interaction.message.delete()

            return;
        }

    } else if (true) {
        if (interaction.commandName == 'ping') {
            processCommand(null, false, interaction.member, 'ping', interaction.channel, interaction)
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
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Lecsatlakozva'
    log(ERROR + ': Lecsatlakozva');
});

bot.on('shardReady', (shardID) => {
    statesManager.shardCurrentlyLoading = false
});

bot.on('shardReconnecting', (shardID) => {
    statesManager.shardCurrentlyLoading = true
    statesManager.shardCurrentlyLoadingText = 'Újracsatlakozás...'
});

bot.on('shardResume', (shardID, replayedEvents) => {
    statesManager.shardCurrentlyLoading = false
    log(SHARD & ': Folytatás: ' + replayedEvents.toString())
});

bot.on('raw', async event => {
});

bot.on('rateLimit', (RateLimitData) => {
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
});

bot.ws.on('READY', (data, shardID) => {
});

bot.ws.on('RESUMED', (data, shardID) => {
});

bot.ws.on('PRESENCE_UPDATE', (data, shardID) => {
});

bot.ws.on('VOICE_SERVER_UPDATE', (data, shardID) => {
});

bot.ws.on('VOICE_STATE_UPDATE', (data, shardID) => {
});

bot.on('voiceStateUpdate', (voiceStateOld, voiceStateNew) => {
});

//#endregion

//#region Commands

//#region Command Functions

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
            .on("error", (error) => { })
            .on("start", () => { })
            .on("debug", (message) => { })
            .on("close", () => { });

        const embed = new Discord.MessageEmbed()
            .setColor(Color.Purple)
            .setURL(info.videoDetails.video_url)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(info.videoDetails.title)
            .setThumbnail(info.videoDetails.thumbnails[0].url)
            .addField('Csatorna', info.videoDetails.author.name, true)
            .addField('Hossz', musicGetLengthText(info.videoDetails.lengthSeconds), true)
        message.channel.send('> **\\✔️ Most hallható: \\🎧**', { embeds: [embed] })
        return true
    }).catch(err => {
        if (err.toString().startsWith('Error: No video id found:')) {
            message.channel.send('> **\\❌ A videó nem található! \\🎧**')
        } else {
            message.channel.send('> **\\❌ ' + err.toString() + '**')
        }
    });
    return false
};

//#endregion

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
    if (musicArray.length === 0 && ytdlCurrentlyPlaying === false) {
        message.channel.send('> **\\➖ A lejátszólista üres \\🎧**')
    } else {
        const embed = new Discord.MessageEmbed()
        embed.setAuthor(message.member.displayName, message.author.avatarURL())
        embed.setColor(Color.Purple)
        await ytdl.getBasicInfo(ytdlCurrentlyPlayingUrl).then(info => {
            embed.addField('\\🎧 Most hallható: ' + info.videoDetails.title, '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), false)
        })
        musicArray.forEach(async (_link) => {
            await ytdl.getBasicInfo(_link).then(info => {
                embed.addField(info.videoDetails.title, '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), false)
            })
        });
        message.channel.send('> **\\🔜 Lejátszólista: [' + musicArray.length + ']\\🎧**', { embeds: [embed] })
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

    bot.channels.cache.get('799340273431478303').send({ embeds: [embed] }).then(message => {
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
};

bot.on('clickButton', async (button) => {
    try {
        if (button.clicker.user.username === button.message.embeds[0].author.name) { } else {
            button.reply.send('> \\❗ **Ez nem a tied!**', true)
            return;
        }
    } catch (error) { }

    if (button.id === 'sendHelp') {
        const thisIsPrivateMessage = button.channel.type === 'dm'
        CommandHelp(button.channel, button.clicker.user, thisIsPrivateMessage)

        button.reply.defer()
        button.message.delete()

        return;
    }

    button.reply.defer()
});

bot.on('clickMenu', async (menu) => {
    menu.message.channel.send(menu.id)
    menu.reply.defer()
});

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
    } else if (id == '726127512521932880') {
        return 'Bejelentés'
    } else {
        return id
    }
};

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
};

bot.once('ready', async () => { //Ready
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

    const guild = bot.guilds.cache.get('737954264386764812')
    let commands
    if (guild) {
        commands = guild.commands
    } else {
        commands = bot.application?.commands
    }
    commands?.create({
        name: 'ping',
        description: 'A BOT ping-elése, avagy megnézni hogy most épp elérhető e'
    })
    commands?.create({
        name: 'weather',
        description: 'Békéscsaba időjárása'
    })

    log(DONE + ': A BOT kész!')
});

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
};

bot.on('ready', () => { //Change status
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        bot.user.setActivity(activities_list[index], { type: 3, browser: "DISCORD IOS" });
    }, 10000);
    setInterval(() => {
        if (listOfNews.length > 0) {
            const newsMessage = listOfNews.shift()
            const newsChannel = bot.channels.cache.get(processedNewsChannel)
            const embed = newsMessage.embed
            if (true && newsMessage.NotifyRoleId.length == 0) {
                newsChannel.send({ embeds: [embed] })
                    .then(() => { newsMessage.message.delete() });
            } else {
                newsChannel.send({ content: '<@&' + newsMessage.NotifyRoleId + '>', embeds: [embed] })
                    .then(() => { newsMessage.message.delete() });
            }
            lastNoNews = false
        } else if (lastNoNews == false) {
            lastNoNews = true
            log(DONE + ': Minden hír közzétéve')
        }

    }, 2000);
});

bot.on('message', async message => { //Message
    const thisIsPrivateMessage = message.channel.type === 'dm'
    if (message.author.bot && thisIsPrivateMessage === false) { return }
    if (!message.type) return
    let args = message.content.substring(perfix.length).split(' ')
    let sender = message.author

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
    if (message.channel.id === '744979145460547746') { //Memes channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
        }
        if (message.content.includes('https://www.reddit.com/r/')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
        }
        if (message.content.includes('https://tenor.com/view/')) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
        }
        if (message.attachments.size) {
            message.react('😂')
            message.react('😐')
            message.react('😕')
        }
    }
    if (message.channel.id === '775430473626812447') { //Youtube channel
        if (message.content.includes('https://www.youtube.com/')) {
            message.react('👍')
            message.react('👎')
            message.react('😲')
        }
        if (message.content.includes('https://youtu.be/')) {
            message.react('👍')
            message.react('👎')
            message.react('😲')
        }
    }
    if (message.channel.id === '738772392385577061') { //Music channel
        if (message.content.includes('https://cdn.discordapp.com/attachments')) {
            message.react('👍')
            message.react('👎')
        }
        if (message.content.includes('https://www.youtube.com/watch?v=')) {
            message.react('👍')
            message.react('👎')
        }
        if (message.content.includes('https://media.discordapp.net/attachments/')) {
            message.react('👍')
            message.react('👎')
        }
        if (message.content.includes('https://youtu.be/')) {
            message.react('👍')
            message.react('👎')
        }
        if (message.attachments.size) {
            message.react('👍')
            message.react('👎')
        }
    }

    //#endregion

    //#region News
    if (message.channel.id == incomingNewsChannel) {
        processNewsMessage(message)
    }
    //#endregion

    if (message.content.startsWith(`${perfix}`)) {
        processCommand(message, thisIsPrivateMessage, sender, message.content.replace('. ', '.').substring(1), message.channel, null)
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
});

/**
 * @param {Discord.Message} message
 * @param {boolean} thisIsPrivateMessage
 * @param {Discord.User} sender
 * @param {string} command
 */
function processCommand(message, thisIsPrivateMessage, sender, command, channel, interaction) {

    //#region Enabled in dm

    if (command === `xp`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return;
    };

    if (command === `crate all`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return;
    };

    if (command === `napi all`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return;
    };

    if (command == `napi`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return;
    };

    if (command === `profil`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return;
    };

    if (command === `store`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
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
                '\\⛔ **Telefonról vagyok bejelentkezve.** A legtöbb funkció nem elérhető.\n' +
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
        if (interaction == null) {
            channel.send({ embeds: [embed] })
        } else {
            interaction.reply({ embeds: [embed] })
        }
        return;
    };

    if (command === `pms`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return;
    };

    if (command === `weather`) {
        CommandWeather(channel, sender)
        return
    } else if (command === `weather help`) {
        channel.send('**Időjárás jelzések**\n' +
            '> ᲼\\💧: Eső valószínűsége\n' +
            '> ᲼\\☁️: Az ég felhővel borított része\n' +
            '> ᲼\\🏙️: Napkelte\n' +
            '> ᲼\\🌆: Napnyugta\n' +
            '> ᲼\\⬛: Légnyomás\n' +
            '> ᲼  ├\\🔶: Nagyon magas\n' +
            '> ᲼  ├\\🔸: Magas\n' +
            '> ᲼  ├\\🔹: Alacsony\n' +
            '> ᲼  └\\🔷: Nagyon alacsomy')
        return
    } else if (command === `help`) { // /help parancs
        CommandHelp(channel, sender, thisIsPrivateMessage)
        return
    } else if (command === `?`) { // /help parancs
        CommandHelp(channel, sender, thisIsPrivateMessage)
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
        channel.send("Message with a button!", { components: [row0, row1] });
        return
    }

    if (command === `mail`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return
    }

    //#endregion

    //#region Disabled in dm

    if (command === `bolt`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return
    }

    if (command.startsWith(`gift `)) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
    }

    if (command.startsWith(`pms name `)) {
        message.channel.send('> \\⛔ **Ez a parancs átmenetileg nem elérhető!**')
        return;
    }

    if (command.startsWith(`quiz\n`)) {
        const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
        quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4])
        return;
    } else if (command.startsWith(`quizdone `)) {
        quizDone(command.replace(`quizdone `, ''))
        return
    } else if (command.startsWith(`poll simple\n`)) {
        const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], false)
        return
    } else if (command.startsWith(`poll wyr\n`)) {
        const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], true)
        return
    } else if (command === `dev`) {
        if (sender.id === '726127512521932880') {
            const embed = new Discord.MessageEmbed()
                .addField('Fejlesztői parancsok',
                    '> \\❔  `.quiz`\n' +
                    '>  \\📊  `.poll simple`\n' +
                    '>  \\📊  `.poll wyr`'
                )
                .setColor(Color.Highlight)
            channel.send({ embeds: [embed] })
        } else {
            channel.send('> \\⛔ **Ezt a parancsot te nem használhatod!**')
        }
        return
    }

    if (command === `music skip`) { //Music
        if (thisIsPrivateMessage === false) {
            commandSkip(message)
            return
        } else {
            channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
    } else if (command === `music list`) {
        if (thisIsPrivateMessage === false) {
            commandMusicList(message)
            return
        } else {
            channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
    } else if (command.startsWith(`music `)) {
        if (thisIsPrivateMessage === false) {
            commandMusic(message, command.toString().replace(`music `, ''))
            return
        } else {
            channel.send('> \\⛔ **Ez a parancs csak szerveren használható.**')
        }
    }

    //#endregion

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('sendHelp')
                .setLabel('Help')
                .setStyle('PRIMARY'),
        );

    channel.send({ content: "> \\❌ **Ismeretlen parancs! **`.help`** a parancsok listájához!**", components: [row] });
}

try {
    bot.login(token)
} catch (err) {
    log(ERROR + ': ' + err)
}

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
