console.log('The script is executing!')



const { LogError, LogCrash } = require('./functions/errorLog')
const fs = require('fs')
const Path = require('path')
/** @type {import('./config').Config} */
const CONFIG = require('./config.json')
process.on('uncaughtException', function (err) {
    fs.appendFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), 'CRASH\n', { encoding: 'utf-8' })
    LogError(err)
})



















const LogManager = require('./functions/log')
var logManager = new LogManager(null, null)

logManager.scriptLoadingText = 'Loading script... (set process things)'

process.__defineGetter__('stderr', function() { return fs.createWriteStream(Path.join(CONFIG.paths.base, 'node.stderr.log'), {flags:'a'}) })

var botStopped = false

process.stdin.on('mousepress', function (info) { })

process.stdin.resume()

const ConsoleUtilities = new (require('./functions/consoleUtilities')).ConsoleUtilities()
ConsoleUtilities.on('onKeyDown', key => {
    logManager.OnKeyDown(key)

    if (key === '\u0003') {
        if (botStopped == true) {

            SystemStop()
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





logManager.Loading("Loading commands", 'help')
const CommandHelp = require('./commands/help')







logManager.Loading("Loading commands", 'quiz')
const QuizManager = require('./economy/quiz')
logManager.Loading("Loading commands", 'poll')
const PollManager = require('./commands/poll')









































logManager.Loading("Loading extensions", 'StatesManager')
const { StatesManager } = require('./functions/statesManager.js')
logManager.Loading('Loading packet', "ytdl-core")
const ytdl = require('ytdl-core')

logManager.Loading("Loading extensions", "MusicPlayer")
const MusicPlayer = require('./commands/music/functions')

logManager.Loading('Loading', "WS")
const WebInterface = require('./web-interface/manager')


logManager.Loading('Loading packet', "discord.js")
const Discord = require('discord.js')
const { GatewayIntentBits } = require('discord.js')



logManager.Loading('Loading packet', "other functions")

const NewsManager = require('./functions/news')

const {
    Color,
    activitiesMobile

} = require('./functions/enums.js')
logManager.Loading('Loading packet', "config.json")
const { perfix, tokens } = require('./config.json')
logManager.scriptLoadingText = 'Loading script... (create Discord client instance)'

logManager.BlankScreen()

logManager.Loading('Loading packet', "Other functions")
const GetAddress = require('./functions/getAddress')
const { ToUnix } = require('./functions/utils')

/** @type {string[]} */
let listOfHelpRequiestUsers = []

const bot = new Discord.Client({ properties: { $browser: "Discord iOS" }, intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates ], partials: [ Discord.Partials.Channel ]})
logManager.Destroy()

const statesManager = new StatesManager()
logManager = new LogManager(bot, statesManager)
const newsManager = new NewsManager(statesManager, false)

statesManager.botLoaded = true
































logManager.scriptLoadingText = 'Loading script... (create WebInterface instance)'

const wsExternal = new WebInterface('1234', GetAddress(), 5665, bot, null, null, StartBot, StopBot, statesManager, 'MOBILE')
const wsInternal = new WebInterface('1234', '127.0.0.1', 5665, bot, null, null, StartBot, StopBot, statesManager, 'MOBILE')
logManager.BlankScreen()





/**@type {string[]} */
let musicArray = []
let musicFinished = true




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
    LogError(error)
    statesManager.botLoadingState = 'Error'
})

bot.on('debug', debug => {
    statesManager.ProcessDebugMessage(debug)
})

bot.on('warn', warn => {
    statesManager.botLoadingState = 'Warning'
})

bot.on('shardError', (error, shardID) => {
    LogError(error, { key: 'ShardID', value: shardID })
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

bot.on('voiceStateUpdate', (voiceStateOld, voiceStateNew) => { })

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
            embed.addFields([{
                name: '\\🎧 Most hallható: ' + info.videoDetails.title,
                value: '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds),
                inline: false
            }])
        })
        musicArray.forEach(async (_link) => {
            await ytdl.getBasicInfo(_link).then(info => {
                embed.addFields([{
                    name: info.videoDetails.title,
                    value: '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds),
                    inline: false
                }])
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

//#endregion

bot.on('interactionCreate', interaction => {
    if (interaction.type === "APPLICATION_COMMAND") {
        processApplicationCommand(interaction)
    } else if (interaction.isButton()) {
        if (interaction.component.customId.startsWith('redditsaveDeleteMain')) {
            if (interaction.component.customId.includes(interaction.user.id)) {
                interaction.channel.messages.cache.get(interaction.component.customId.split('.')[1]).delete()
                const button1 = interaction.message.components[0].components[0]
                const button2 = interaction.message.components[0].components[1]
                const row = new Discord.ActionRowBuilder()
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

bot.once('ready', async () => {
    statesManager.botLoadingState = 'Ready'

    const { TrySendWeatherReport } = require('./functions/dailyWeatherReport')
    const { TrySendMVMReport } = require('./functions/dailyElectricityReport')

    const { CreateCommands, DeleteCommands } = require('./functions/commands')
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

    TrySendWeatherReport(statesManager, bot, '746266528508411935')
    TrySendMVMReport(statesManager, bot, '746266528508411935')

    newsManager.OnStart(bot)
    setInterval(() => {
        newsManager.TryProcessNext(bot)
    }, 2000)
})

bot.on('messageCreate', async message => { //Message
    const thisIsPrivateMessage = message.channel.type === 'dm'
    if (message.author.bot && thisIsPrivateMessage === false) { return }
    if (!message.type) return
    let sender = message.author

    message.fetch().then(async (msg) => {
        if (msg.content.startsWith('https://www.reddit.com/r/')) {
            const CommandRedditsave = require('./commands/redditsave')
            CommandRedditsave.Redditsave(msg)
        }

        await newsManager.TryProcessMessage(msg)
    })

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









const CommandNotAvailable = '> \\⛔ **Ez a parancs nem használható 😕.**\n> Telefonról vagyok bejelentkezve, az adatbázis nem elérhető.'

/**
 * @param {Discord.Message} message
 * @param {boolean} thisIsPrivateMessage
 * @param {Discord.User} sender
 * @param {string} command
 */
function processCommand(message, thisIsPrivateMessage, sender, command, channel, interaction) {

    //#region Enabled in dm

    if (command === `pms`) {
        channel.send(CommandNotAvailable)
        return
    }

    if (command === `mail`) {
        channel.send(CommandNotAvailable)
        return
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
        return
    } else if (command.startsWith(`quiz help`)) {
        const embed = new Discord.EmbedBuilder()
            .addFields([{
                name: 'Quiz szintaxis',
                value:
                '.quiz\n' +
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
            .addFields([{
                name: 'Quizdone szintaxis',
                value: '.quizdone messageId correctIndex(0 - ...)'
            }])
            .setColor(Color.Highlight)
        message.channel.send({embeds: [ embed ]})
        return
    } else if (command.startsWith(`quizdone `)) {
        QuizManager.QuizDone(bot, command.replace(`quizdone `, '').split(' ')[0], command.replace(`quizdone `, '').split(' ')[1])
        return
    } else if (command.startsWith(`poll simple\n`)) {
        const msgArgs = command.toString().replace(`poll simple\n`, '').split('\n')
        PollManager.poll(bot, msgArgs[0], msgArgs[1], msgArgs[2], false)
        return
    } else if (command.startsWith(`poll wyr\n`)) {
        const msgArgs = command.toString().replace(`poll wyr\n`, '').split('\n')
        PollManager.poll(bot, msgArgs[0], msgArgs[1], msgArgs[2], true)
        return
    }

    //#endregion
}

/**@param {Discord.CommandInteraction<Discord.CacheType>} command */
async function processApplicationCommand(command) {

    if (command.commandName == `gift`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `crossout`) {
        const Crossout = require('./commands/crossout')
        command.deferReply().then(() => {
            Crossout.GetItem(command, command.options.getString('search'))
        })
    }

    if (command.commandName === `market` || command.commandName === `piac`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `xp` || command.commandName === `score`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
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
                    '> \\📱 **Telefonról vagyok bejelentkezve.** A legtöbb funkció nem elérhető.\n' +
                    `> Készen áll: <t:${ToUnix(new Date(bot.readyTimestamp))}:T> óta`
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
        const CommandWeather = require('./commands/weather')
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
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `heti`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `napi`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `profil` || command.commandName === `profile`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `backpack`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `bolt` || command.commandName === `shop`) {
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    if (command.commandName === `font`) {
        const { CommandFont } = require('./commands/fonts')
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
        command.reply({content: CommandNotAvailable, ephemeral: true})
        return
    }

    command.reply({ content: "> \\❌ **Ismeretlen parancs! **`/help`** a parancsok listájához!**" })
}

function StartBot() {
    bot.login(tokens.discord).catch((err) => {
        if (err == 'FetchError: request to https://discord.com/api/v9/gateway/bot failed, reason: getaddrinfo ENOTFOUND discord.com') {

        } else {

        }
    })
}

function StopBot() {
    bot.destroy()
}






StartBot()


