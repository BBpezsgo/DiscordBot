





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

SystemStart(false, true)

const startDateTime = new Date(Date.now())

const { LogManager } = require('./functions/log.js')
var logManager = new LogManager(true, null, null)

logManager.Loading('Loading packet', "fs")
const fs = require('fs')

process.__defineGetter__('stderr', function() { return fs.createWriteStream('./node.error.log', {flags:'a'}) })

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


logManager.Loading("Loading commands", 'help')
const CommandHelp = require('./commands/help')

















logManager.Loading("Loading commands", 'crossout')
const { CrossoutTest } = require('./commands/crossout')
logManager.Loading("Loading commands", 'redditsave')
const CommandRedditsave = require('./commands/redditsave')
logManager.Loading("Loading commands", 'fonts')
const { CommandFont } = require('./commands/fonts')




logManager.Loading("Loading extensions", 'commands')
const { CreateCommands, DeleteCommands } = require('./functions/commands')
logManager.Loading("Loading extensions", 'translator')
const { TranslateMessage } = require('./functions/translator.js')
logManager.Loading("Loading extensions", 'statesManager')
const { StatesManager } = require('./functions/statesManager.js')



logManager.Loading('Loading packet', "ytdl-core")
const ytdl = require('ytdl-core')

const { musicGetLengthText } = require('./commands/music/functions')

logManager.Loading('Loading', "WS")
const WebInterface = require('./web-interface/manager')
const { GetHash, GetID, AddNewUser } = require('./functions/userHashManager')

logManager.Loading('Loading packet', "discord.js")
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, GatewayIntentBits } = require('discord.js')

const { perfix, tokens } = require('./config.json')

logManager.Loading('Loading packet', "other functions")


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
    activitiesMobile,
    usersWithTax,
    ChannelId,
    CliColor
} = require('./functions/enums.js')


logManager.BlankScreen()



/** @type {string[]} */
let listOfHelpRequiestUsers = []

const bot = new Discord.Client({ properties: { $browser: "Discord iOS" }, intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates]})
logManager.Destroy()

const statesManager = new StatesManager()
logManager = new LogManager(true, bot, statesManager)

statesManager.botLoaded = true

/** @param {string} message */
function log(message = '', translateResult = null) {
    logManager.Log(message, false, translateResult)
}

























const ws = new WebInterface('1234', '192.168.1.101', 5665, bot, logManager, null, StartBot, StopBot, statesManager, 'RASPBERRY')
logManager.BlankScreen()





/**@type {string[]} */
let musicArray = []
let musicFinished = true

let lastNoNews = false






//#endregion

/** @type {NewsMessage[]} */
const listOfNews = []
const incomingNewsChannel = '902894789874311198'
const processedNewsChannel = '746266528508411935'
//#region Functions

/**@param {number} days @returns {number} */
function DaysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000
}

//#endregion

//#region Listener-ek

bot.on('reconnecting', () => {
    log(INFO + ': Újracsatlakozás...')
    statesManager.botLoadingState = 'Reconnecting'
})

bot.on('disconnect', () => {
    log(ERROR + ': Megszakadt a kapcsolat!')
    statesManager.botLoadingState = 'Disconnect'
})

bot.on('resume', () => {
    log(INFO + ': Folytatás')
    statesManager.botLoadingState = 'Resume'
})

bot.on('error', error => {
    log(ERROR + ': ' + error)
    statesManager.botLoadingState = 'Error'
})

bot.on('debug', debug => {
    statesManager.ProcessDebugMessage(debug)
    const translatedDebug = TranslateMessage(debug)

    if (translatedDebug == null) return

    if (translatedDebug.translatedText.startsWith('Heartbeat nyugtázva')) {
        logManager.AddTimeline(2)
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
    log(ERROR + ': Lecsatlakozva')
    statesManager.Shard.IsLoading = true
    statesManager.Shard.LoadingText = 'Lecsatlakozva'
})

bot.on('shardReady', (shardID) => {
    const mainGuild = bot.guilds.cache.get('737954264386764812')
    const quizChannel = mainGuild.channels.cache.get('799340273431478303')
    quizChannel.messages.fetch()
    statesManager.Shard.IsLoading = false
})

bot.on('shardReconnecting', (shardID) => {
    statesManager.Shard.IsLoading = true
    statesManager.Shard.LoadingText = 'Újracsatlakozás...'
})

bot.on('shardResume', (shardID, replayedEvents) => {
    log(SHARD & ': Folytatás: ' + replayedEvents.toString())
    statesManager.Shard.IsLoading = false
})

bot.on('raw', async event => {
    log(DEBUG & ': raw')
})

bot.on('close', () => {
    log(SHARD & ': close')
    statesManager.botLoadingState = 'Close'
})

bot.on('destroyed', () => {
    log(SHARD & ': destroyed')
    statesManager.botLoadingState = 'Destroyed'
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

bot.on('voiceStateUpdate', (voiceStateOld, voiceStateNew) => { })

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
        .on("start", () => { statesManager.Ytdl.IsPlaying = true; log('') })
        .on("debug", (message) => { log(DEBUG + ': ytdl: ' + message) })
        .on("close", () => { statesManager.Ytdl.IsPlaying = false; log('') })
    */

    const embed = new Discord.EmbedBuilder()
        .setColor(Color.Purple)
        .setURL(info.videoDetails.video_url)
        .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
        .setTitle(info.videoDetails.title)
        .setThumbnail(info.videoDetails.thumbnails[0].url)
        .addFields([
            { name: 'Csatorna', value: info.videoDetails.author.name, inline: true },
            { name: 'Hossz', value: musicGetLengthText(info.videoDetails.lengthSeconds), inline: true }
        ])
    if (command.replied == true) {
        command.editReply({ content: '> **\\✔️ Most hallható: \\🎧**', embeds: [embed] })
    } else {
        command.reply({ content: '> **\\✔️ Most hallható: \\🎧**', embeds: [embed] })
    }
    statesManager.Ytdl.PlayingText = info.videoDetails.title
    statesManager.Ytdl.PlayingUrl = link
    return true
}

//#endregion

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
    if (musicArray.length === 0 && statesManager.Ytdl.IsPlaying === false) {
        command.reply({ content: '> **\\➖ A lejátszólista üres \\🎧**' })
    } else {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: command.member.displayName, iconURL: command.member.avatarURL() })
        embed.setColor(Color.Purple)
        await ytdl.getBasicInfo(statesManager.Ytdl.PlayingUrl).then(info => {
            embed.addFields([{ name: '\\🎧 Most hallható: ' + info.videoDetails.title, value: '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), inline: false}])
        })
        musicArray.forEach(async (_link) => {
            await ytdl.getBasicInfo(_link).then(info => {
                embed.addFields([{ name: info.videoDetails.title, value: '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), inline: false }])
            })
        })
        command.reply({ content: '> **\\🔜 Lejátszólista: [' + musicArray.length + ']\\🎧**', embeds: [embed] })
    }
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
async function commandSkip(command) {
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

/**@param {Discord.MessageAttachment} image */
function quiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, image = undefined) {
    const optionEmojis = listOfOptionEmojis.toString().replace(' ', '').split(';')
    const optionTexts = listOfOptionText.toString().replace(' ', '').split(';')
    let optionText = ''
    for (let i = 0; i < optionTexts.length; i++) {
        optionText += `> ${optionEmojis[i]}  ${optionTexts[i]}\n`
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
        .addFields([{ name: `${titleText}`, value: `${optionText}` }])
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/direct-hit_1f3af.png')
        .setFooter({ text: "Vége:" })
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
    const embed = new Discord.EmbedBuilder()
        .setColor(Color.DarkPink)
        .setTitle('Szavazás!')
        .addFields([{ name: `${titleText}`, value: `${optionText}` }])

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
                const currentAnswerEmoji = answersEmoji[i]
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
                })
            }
            bot.channels.cache.get('799340273431478303').send(finalText)
        })
    })
}
//#endregion

bot.on('interactionCreate', async interaction => {
    if (interaction.type === "APPLICATION_COMMAND") {
        processApplicationCommand(interaction)
    } else if (interaction.isButton()) {
        if (interaction.component.customId.startsWith('redditsaveDeleteMain')) {
            if (interaction.component.customId.includes(interaction.user.id)) {
                interaction.channel.messages.cache.get(interaction.component.customId.split('.')[1]).delete()
                const button1 = interaction.message.components[0].components[0]
                const button2 = interaction.message.components[0].components[1]
                const row = new ActionRowBuilder()
                    .addComponents(button1, button2)
                interaction.update({embeds: [interaction.message.embeds[0]], components: [row]})
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
                interaction.reply({content: '> \\❗ **Ez nem a tied!**', ephemeral: true})
                return
            }
        } catch (error) { }
    }
})

bot.on('clickButton', async (button) => {
    try {
        if (button.clicker.user.username === button.message.embeds[0].author.name) { } else {
            button.reply.send('> \\❗ **Ez nem a tied!**', true)
            return
        }
    } catch (error) { }

    if (button.id === 'sendHelp') {
        const thisIsPrivateMessage = button.channel.type === 'dm'
        CommandHelp(button.channel, button.clicker.user, thisIsPrivateMessage, true)

        button.reply.defer()
        button.message.delete()

        return
    }

    button.reply.defer()
})

bot.on('clickMenu', async (menu) => {
    menu.message.channel.send(menu.id)
    menu.reply.defer()
})

/** @returns {Promise<Discord.Message>} */
async function GetOldDailyWeatherReport(channelId) {
    /** @type {Discord.TextChannel} */
    const channel = bot.channels.cache.get(channelId)
    statesManager.WeatherReport.Text = 'Fetch old messages...'
    await channel.messages.fetch({ limit: 10 })
    statesManager.WeatherReport.Text = 'Loop messages...'
    for (let i = 0; i < channel.messages.cache.size; i++) {
        const element = channel.messages.cache.at(i)
        if (element.embeds.length == 1) {
            if (element.embeds[0].title == 'Napi időjárás jelentés') {
                statesManager.WeatherReport.Text = 'Old report message found'
                return element
            }
        }
    }

    statesManager.WeatherReport.Text = 'No messages found'
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
        const index = Math.floor(Math.random() * (activitiesMobile.length - 1))
        bot.user.setActivity(activitiesMobile[index])
    }, 10000)

    statesManager.WeatherReport.Text = 'Fetch news channel...'
    await bot.channels.fetch(ChannelId.ProcessedNews)
    setTimeout(async () => {
        statesManager.WeatherReport.Text = 'Search old weather report message...'
        const oldWeatherMessage = await GetOldDailyWeatherReport(ChannelId.ProcessedNews)
        if (oldWeatherMessage == null) {
            if (new Date(Date.now()).getHours() < 10) {
                CommandDailyWeatherReport(bot.channels.cache.get(ChannelId.ProcessedNews), statesManager)
            }
        } else {
            if (new Date(oldWeatherMessage.createdTimestamp).getDate() != new Date(Date.now()).getDate() && new Date(Date.now()).getHours() < 10) {
                statesManager.WeatherReport.Text = 'Delete old weather report message...'
                await oldWeatherMessage.delete()
                CommandDailyWeatherReport(bot.channels.cache.get(ChannelId.ProcessedNews), statesManager)
            } else {
                statesManager.WeatherReport.Text = ''
            }
        }
    }, 100)
    
    logManager.AddTimeline(2)









    log(DONE + ': A BOT kész!')






    statesManager.News.LoadingText = 'Fetch news...'
    const channel = bot.channels.cache.get(ChannelId.IncomingNews)
    channel.messages.fetch({ limit: 10 }).then(async (messages) => {
        /** @type {[Discord.Message]} */
        const listOfMessage = []

        statesManager.News.LoadingText = 'Looping messages...'
        messages.forEach((message) => {
            listOfMessage.push(message)
        })

        statesManager.News.LoadingText = 'Processing messages...'
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
            if (newsMessage == null || newsMessage == undefined) { return }
            
            /** @type {Discord.TextChannel} */
            const newsChannel = bot.channels.cache.get(ChannelId.ProcessedNews)
            const embed = newsMessage.embed
            statesManager.News.LoadingText2 = 'Send new message...'
            if (newsMessage.NotifyRoleId.length == 0) {
                newsChannel.send({ embeds: [embed] })
                    .then(() => {
                        statesManager.News.LoadingText2 = 'Delete raw message...'
                        newsMessage.message.delete().then(() => {
                            statesManager.News.LoadingText2 = ''
                        })
                    })
            } else {
                newsChannel.send({ content: `<@&${newsMessage.NotifyRoleId}>`, embeds: [embed] })
                    .then(() => {
                        statesManager.News.LoadingText2 = 'Delete raw message...'
                        newsMessage.message.delete().then(() => {
                            statesManager.News.LoadingText2 = ''
                        })
                    })
            }
            lastNoNews = false
            statesManager.News.AllProcessed = false
        } else if (lastNoNews == false) {
            statesManager.News.LoadingText = ''
            statesManager.News.LoadingText2 = ''
            lastNoNews = true
            statesManager.News.AllProcessed = true
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
    statesManager.News.AllProcessed = false
    listOfNews.push(CreateNews(message))
}
bot.on('messageCreate', async message => { //Message
    const thisIsPrivateMessage = message.channel.type === 'dm'
    if (message.author.bot && thisIsPrivateMessage === false) { return }
    if (!message.type) return
    let sender = message.author

    

    ProcessMessage(message)



    if (message.content.startsWith('https://www.reddit.com/r/')) {
        CommandRedditsave(message)
    }

    //#region News
    if (message.channel.id == incomingNewsChannel) {
        processNewsMessage(message)

        log(`Received a news message`)
    }
    //#endregion










    if (message.content.startsWith(`${perfix}`)) {
        processCommand(message, thisIsPrivateMessage, sender, message.content.replace('. ', '.').substring(1), message.channel, null)
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
function processCommand(message, thisIsPrivateMessage, sender, command, channel, interaction) {

    //#region Enabled in dm

    if (command.commandName === `handlebars` || command.commandName === `webpage`) {
        channel.send('> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.')
        return
    }

    if (command === `pms`) {
        channel.send('> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.')
        return
    }

    if (command === `mail`) {
        channel.send('> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.')
        return
    }

    //#endregion

    //#region Disabled in dm

    if (command.startsWith(`pms name `)) {
        message.channel.send('> \\⛔ **Ez a parancs átmenetileg nem elérhető!**')
        return
    }

    if (command.startsWith(`quiz\n`)) {
        const msgArgs = command.toString().replace(`quiz\n`, '').split('\n')
        if (message.attachments.size == 1) {
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6], message.attachments.first())
        } else {
            quiz(msgArgs[0], msgArgs[1], msgArgs[2], msgArgs[3], msgArgs[4], msgArgs[5], msgArgs[6])
        }
        return
    } else if (command.startsWith(`quiz help`)) {
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
        message.channel.send({embeds: [ embed ]})
        return
    } else if (command.startsWith(`quizdone help`)) {
        const embed = new Discord.EmbedBuilder()
            .addFields([{ name: 'Quizdone szintaxis', value: '.quizdone messageId correctIndex(0 - ...)' }])
            .setColor(Color.Highlight)
        message.channel.send({embeds: [ embed ]})
        return
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
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command */
async function processApplicationCommand(command) {

    if (command.commandName == `gift`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `crossout`) {
        command.deferReply().then(() => {
            CrossoutTest(command, command.options.getString('search'))
        })
    }

    if (command.commandName === `market` || command.commandName === `piac`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `xp` || command.commandName === `score`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
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
                    '> \\🍓 **Raspberry-ről vagyok bejelentkezve.** A legtöbb funkció nem elérhető.\n' +
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
        command.reply({embeds: [ embed ]})
        return
    }


    if (command.commandName === `weather`) {
        if (command.options.getSubcommand() == 'mars') {
            CommandWeather(command, privateCommand, false)
        } else {            
            CommandWeather(command, privateCommand)
        }
        return
    }

    if (command.commandName === `dev`) {
        if (command.user.id === '726127512521932880') {
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
        command.reply({ embeds: [CommandHelp(false, true)]})
        return
    }

    if (command.commandName === `crate`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `heti`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `napi`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `profil` || command.commandName === `profile`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `backpack`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `bolt` || command.commandName === `shop`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    if (command.commandName === `font`) {
        CommandFont(command)
        return
    }

    if (command.commandName === `music`) {
        if (command.options.getSubcommand() == 'play') {
            commandMusic(command, command.options.getString('url'))
        } else if (command.options.getSubcommand() == `skip`) {
            commandSkip(command)
        } else if (command.options.getSubcommand() == `list`) {
            commandMusicList(command)
        }
        userstatsSendCommand(command.user)
        return
    }

    if (command.commandName === `settings` || command.commandName === `preferences`) {
        command.reply({content: '> \\⛔ **Ez a parancs nem használható 😕.**\n> Raspberry-ről vagyok bejelentkezve, az adatbázis nem elérhető.', ephemeral: true})
        return
    }

    command.reply({ content: "> \\❌ **Ismeretlen parancs! **`/help`** a parancsok listájához!**" })
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


StartBot()


