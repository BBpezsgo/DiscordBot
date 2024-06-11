Error.stackTraceLimit = 128
console.log('[Script]: Loaded')
const discordAppInterface = require('discord-app-interface')

process.title = "Discord BOT"

console.log('[Script]: Init process ...')

const ConsoleUtilities = new (require('./functions/consoleUtilities')).ConsoleUtilities()
ConsoleUtilities.on('onKeyDown', key => {
    DiscordBot.LogManager.OnKeyDown(key)
    if (key === '\u0003') {
        if (DiscordBot.IsStopped) {
            process.stdin.pause()
            setTimeout(() => { process.exit() }, 500)
        } else {
            DiscordBot.Destroy()
        }
    }
})
ConsoleUtilities.Listen()

console.log('[Script]: Instantiating app ...')

const DiscordBot = new(require('./discord-bot'))('DESKTOP')

DiscordBot.LogManager.BlankScreen()
DiscordBot.LogManager.scriptLoadingText = ''

if (!DiscordBot.Database?.LoadDatabase()) {
    DiscordBot.LogManager.Destroy()

    const { CliColor } = require('./functions/enums.js')
    console.log('[Script]: ' + CliColor.FgRed + "Can't read database!" + CliColor.FgDefault)
    setTimeout(() => { process.exit(-1) }, 2000)
} else {
    discordAppInterface({
        discordClient: DiscordBot.Client,
    })
    DiscordBot.Login()
}
