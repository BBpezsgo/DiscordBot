//#region Imports, variables

console.clear()

const CommandWeather = require('./commands/weather')
const CommandHelp = require('./commands/help')





const { CreateCommands, DeleteCommands } = require('./functions/commands')

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

const {INFO, ERROR, WARNING, SHARD, DEBUG, DONE, Color, activitiesMobile} = require('./functions/enums.js')

const consoleWidth = 80 - 2



/** @type {string[]} */
let listOfHelpRequiestUsers = []








const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');
const { perfix, token } = require('./config.json')
const bot = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" } }, intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] })















const ytdl = require('ytdl-core')









const WS = require('./ws/ws')
var ws = new WS('1234', 5665, bot, logManager, null)

let musicArray = []
let musicFinished = true



let lastNoNews = false

const readline = require('readline')
const { abbrev } = require('./functions/abbrev')
const { DateToString } = require('./functions/dateToString')
const { DateToStringNews, ConvertNewsIdToName, NewsMessage } = require('./functions/news')






//#endregion

/** @type [NewsMessage] */
const listOfNews = []
const incomingNewsChannel = '902894789874311198'
const processedNewsChannel = '746266528508411935'


//#region Functions
/**@param {number} days @returns {number} */
function DaysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000
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

//#region Listener-ek

bot.on('interactionCreate', interaction => {
    if (interaction.isCommand()) {
        processApplicationCommand(interaction)
    }
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        bot.destroy()
        process.exit()
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

bot.on('close', () => {
    log(SHARD & ': close')
});

bot.on('destroyed', () => {
    log(SHARD & ': destroyed')
});

bot.on('invalidSession', () => {
    log(SHARD & ': invalidSession')
});

bot.on('allReady', () => {
    log(SHARD & ': allReady')
});

bot.on('presenceUpdate', (oldPresence, newPresence) => {
    log(DEBUG & ': newStatus: ' + newPresence.status.toString())
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
        .addField(`${titleText}`, `${optionText}`)
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/direct-hit_1f3af.png')
        .setFooter("Vége:")
        .setTimestamp(dateNow)
    if (image != undefined) {
        embed.setImage(image.url)
    }
    
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
                });
            }
            bot.channels.cache.get('799340273431478303').send(finalText + '\n\n||\\⚠️ Ez ALFA verzió! A hibát itt jelentsd: <#930166957062357062> ||')
        });
    })
}
//#endregion

bot.on('clickButton', async (button) => {
    try {
        if (button.clicker.user.username === button.message.embeds[0].author.name) { } else {
            button.reply.send('> \\❗ **Ez nem a tied!**', true)
            return;
        }
    } catch (error) { }

    if (button.id === 'sendHelp') {
        const thisIsPrivateMessage = button.channel.type === 'dm'
        CommandHelp(button.channel, button.clicker.user, thisIsPrivateMessage, true)

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

bot.once('ready', async () => { //Ready
    if (false) {
        await DeleteCommands(bot)
    } else {
        CreateCommands(bot)
    }

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
};

bot.on('ready', () => { //Change status
    setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesMobile.length - 1) + 1);
        bot.user.setActivity(activitiesMobile[index], { type: 3, browser: "DISCORD IOS" });
    }, 10000);
    setInterval(() => {
        if (listOfNews.length > 0) {
            const newsMessage = listOfNews.shift()
            const newsChannel = bot.channels.cache.get(processedNewsChannel)
            const embed = newsMessage.embed
            if (true && newsMessage.NotifyRoleId.length == 0) {
                newsChannel.send({ embeds: [ embed ] })
                    .then(() => { newsMessage.message.delete() })
            } else {
                newsChannel.send({ content: '<@&' + newsMessage.NotifyRoleId + '>', embeds: [ embed ] })
                    .then(() => { newsMessage.message.delete() })
            }
            lastNoNews = false
        } else if (lastNoNews == false) {
            lastNoNews = true
            log(DONE + ': Minden hír közzétéve')
        }

    }, 2000);
});

bot.on('messageCreate', async message => { //Message
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

    if (command === `pms`) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
        return;
    };
    
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

    if (command.startsWith(`gift `)) {
        channel.send('> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.')
    }

    if (command.startsWith(`pms name `)) {
        message.channel.send('> \\⛔ **Ez a parancs átmenetileg nem elérhető!**')
        return;
    }

    if (command.startsWith(`quiz\n`)) {
        const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
        if (message.attachments.size == 1) {
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6], message.attachments.first())
        } else {
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6])
        }
        return;
    } else if (command.startsWith(`quiz help`)) {
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
        const embed = new Discord.MessageEmbed()
            .addField('Quizdone szintaxis',
                '.quizdone messageId correctIndex(0 - ...)'
            )
            .setColor(Color.Highlight)
        message.channel.send({embeds: [ embed ]})
        return;
    } else if (command.startsWith(`quizdone `)) {
        quizDone(command.replace(`quizdone `, '').split(' ')[0], command.replace(`quizdone `, '').split(' ')[1])
        return
    } else if (command.startsWith(`poll simple\n`)) {
        const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], false)
        return
    } else if (command.startsWith(`poll wyr\n`)) {
        const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
        poll(msgArgs[0], msgArgs[1], msgArgs[2], true)
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

    channel.send("> \\❌ **Ismeretlen parancs! **`/help`** a parancsok listájához!**");
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command */
async function processApplicationCommand(command) {

    if (command.commandName === `xp`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
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
                '> \\⛔ **Telefonról vagyok bejelentkezve.** A legtöbb funkció nem elérhető.\n' +
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
        return
    }

    if (command.commandName === `weather`) {
        CommandWeather(command)
        return
    }

    if (command.commandName === `dev`) {
        if (command.user.id === '726127512521932880') {
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
        command.reply({ embeds: [CommandHelp(false, true)]})
        return
    }

    if (command.commandName === `crate`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `napi`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return;
    }

    if (command.commandName === `profil`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return;
    }

    if (command.commandName === `store`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `bolt`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem elérhető.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }
}

bot.login(token).catch((err) => {
    if (err == 'FetchError: request to https://discord.com/api/v9/gateway/bot failed, reason: getaddrinfo ENOTFOUND discord.com') {
        log(ERROR + ': Nem sikerült csatlakozni: discord.com nem található')
    } else {
        log(ERROR + ': ' + err)
    }
})
