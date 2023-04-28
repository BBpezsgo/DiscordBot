Error.stackTraceLimit = 128
console.log('The script is executing!')

process.title = "Discord BOT"

console.log('Listening to uncaught exceptions ...')

const LogError = require('./functions/errorLog')
const fs = require('fs')
const Path = require('path')
/** @type {import('./config').Config} */
const CONFIG = require('./config.json')
process.on('uncaughtException', (error, origin) => {
    fs.appendFileSync(Path.join(CONFIG.paths.base, 'node.error.log'), 'CRASH\n', { encoding: 'utf-8' })
    LogError(error, { key: 'Origin', value: origin })
})

console.log('Init process ...')

process.__defineGetter__('stderr', () => { return fs.createWriteStream(Path.join(CONFIG.paths.base, 'node.error.log'), { flags: 'a' }) })
process.stdin.on('mousepress', (info) => { })
process.stdin.resume()

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
ConsoleUtilities.EnableMouse()

process.on('exit', (code, a) => {
    ConsoleUtilities.DisableMouse()
    console.log('Exit with code ' + code)
})

console.log('Create BOT instance ...')

const DiscordBot = new(require('./discord-bot'))('DESKTOP')

const WebInterface = require('./web-interface/manager')
const WebInterfaceExternal = new WebInterface('1234', '192.168.1.100', 5665, DiscordBot.Client, null, DiscordBot.Database, DiscordBot.Login, DiscordBot.Destroy, DiscordBot.StatesManager, DiscordBot.Platform)
const WebInterfaceLoopback = new WebInterface('1234', '127.0.0.1', 5665, DiscordBot.Client, null, DiscordBot.Database, DiscordBot.Login, DiscordBot.Destroy, DiscordBot.StatesManager, DiscordBot.Platform)

DiscordBot.LogManager.BlankScreen()
DiscordBot.LogManager.scriptLoadingText = ''

if (!DiscordBot.Database.LoadDatabase()) {
    DiscordBot.LogManager.Destroy()

    const { CliColor } = require('./functions/enums.js')
    console.log(CliColor.FgRed + "Can't read database!" + CliColor.FgDefault)
    setTimeout(() => { process.exit() }, 2000)
} else {
    DiscordBot.Login()
}
