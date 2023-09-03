const { GetTime, GetDataSize, Capitalize } = require('./utils')
const { WsStatus } = require('../functions/enums')

/** @type {boolean} */
let enabled = false

const CliColor = {
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",

    FgDefault: '\x1b[37m'
}

const { StatesManager } = require('./statesManager.js')

const Discord = require('discord.js')

const spinner = ['─', '\\', '|', '/']
const timeout = ['◌', '○', '●']

const terminalSize = {
    width: process.stdout.columns,
    height: process.stdout.rows
}

const window = {
    width: terminalSize.width,
    height: 20
}

process.stdout.addListener('resize', () => {
    terminalSize.width = process.stdout.columns
    terminalSize.height = process.stdout.rows
    window.width = terminalSize.width
})

/**Reprints a line on the console */
const reprint = (text, x = 0, y = 0) => {
    process.stdout.cursorTo(x, y)
    process.stdout.clearLine()
    process.stdout.write(text)
    process.stdout.write('\n')
}

function chars(char, len) {
    let txt = ""
    for (let i = 0; i < len; i++) {
        txt += char
    }
    return txt
}

/**@param {string} error @param {boolean} ready @param {string} url */
function StateText_HB(error, ready, url) {
    if (error.length > 0) {
        return CliColor.FgRed + error + CliColor.FgDefault + chars(' ', 15)
    }
    if (ready == true) {
        if (url.length > 0) {
            return CliColor.FgGreen + 'Listening' + CliColor.FgDefault + ' on ' + url
        }
        return CliColor.FgGreen + 'Ready' + CliColor.FgDefault
    } else {
        return "Loading"
    }
}

function StateText(state) {
    if (state == 'IDLE') {
        return CliColor.FgYellow + 'Idle' + CliColor.FgDefault
    }
    if (state == 'READY') {
        return CliColor.FgGreen + 'Ready' + CliColor.FgDefault
    }
    if (state == 'CONNECTING') {
        return CliColor.FgYellow + 'Connecting' + CliColor.FgDefault
    }
    if (state == 'RECONNECTING') {
        return CliColor.FgYellow + 'Reconnecting' + CliColor.FgDefault
    }
    if (state == 'NEARLY') {
        return CliColor.FgYellow + 'Nearly' + CliColor.FgDefault
    }
    if (state == 'DISCONNECTED') {
        return CliColor.FgRed + 'Disconnected' + CliColor.FgDefault
    }
    if (state == 'WAITING_FOR_GUILDS') {
        return CliColor.FgYellow + 'Waiting for guilds' + CliColor.FgDefault
    }
    if (state == 'IDENTIFYING') {
        return CliColor.FgYellow + 'Identifying' + CliColor.FgDefault
    }
    if (state == 'RESUMING') {
        return CliColor.FgYellow + 'Resuming' + CliColor.FgDefault
    }
    return Capitalize(state)
}
/**
 * @param {string} state
 * Error; Warning; Close; Destroyed; Invalid Session; All Ready; Ready; Reconnecting; Disconnect; Resume
 */
function StateTextBot(state) {
    if (state == 'Error') {
        return CliColor.FgRed + 'Error' + CliColor.FgDefault
    }
    if (state == 'Warning') {
        return CliColor.FgYellow + 'Warning' + CliColor.FgDefault
    }
    if (state == 'Close') {
        return CliColor.FgYellow + 'Close' + CliColor.FgDefault
    }
    if (state == 'Destroyed') {
        return CliColor.FgRed + 'Destroyed' + CliColor.FgDefault
    }
    if (state == 'Invalid Session') {
        return CliColor.FgRed + 'Invalid Session' + CliColor.FgDefault
    }
    if (state == 'All Ready') {
        return CliColor.FgGreen + 'Ready' + CliColor.FgDefault
    }
    if (state == 'Ready') {
        return CliColor.FgGreen + 'Ready' + CliColor.FgDefault
    }
    if (state == 'Reconnecting') {
        return CliColor.FgYellow + 'Reconnecting...' + CliColor.FgDefault
    }
    if (state == 'Disconnect') {
        return CliColor.FgYellow + 'Disconnect' + CliColor.FgDefault
    }
    if (state == 'Resume') {
        return CliColor.FgYellow + 'Resume' + CliColor.FgDefault
    }
    return Capitalize(state)
}

/** @param {string} text */
function RemoveColors(text) {
    return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}

/** @param {string} text @param {number} width @param {number} marginLeft */
function FixedWidth(text, width, marginLeft = undefined) {
    var txt = text + ''
    const textLength = RemoveColors(txt).length
    if (marginLeft !== undefined) {
        if (textLength + marginLeft > width) {
            txt = txt.substring(0, width - 3 - marginLeft) + '...'
        }
        txt += chars(' ', width - textLength - marginLeft)
        txt = chars(' ', marginLeft) + txt
    } else {
        if (textLength > width) {
            txt = txt.substring(0, width - 3) + CliColor.FgDefault + CliColor.BgBlack + '...'
        }
        txt += chars(' ', width - textLength)
    }
    return txt
}

class LogManager {
    constructor(bot, statesManager) {
        /** @type {LoadingProgress}*/
        this.loading = new LoadingProgress()
        /** @type {number}*/
        this.loadingIndex = 0

        /**@type {Discord.Client} */
        this.bot = bot

        /**@type {StatesManager} */
        this.statesManager = statesManager

        /** @type {number}*/
        this.deltaTime = 0
        /** @type {number}*/
        this.lastTime = 0

        /** @type {string}*/
        this.loadingOverride = ''

        /** @type {NodeJS.Timer} */
        this.timer = null

        /** @type {number} */
        this.dailyWeatherReportLoadingTextTimeout = 0
        /** @type {number} */
        this.newsLoadingTextTimeout = 0

        this.scriptLoadingText = ''

        if (bot != null && statesManager != null) {
            if (enabled === false) { return }
            this.timer = setInterval(async () => {
                this.loadingIndex += (this.deltaTime * 12)
                if (Math.round(this.loadingIndex) >= spinner.length) {
                    this.loadingIndex = 0
                }

                const webInterfaceIDs = Object.keys(this.statesManager.WebInterface)
                for (const webInterfaceID of webInterfaceIDs) {
                    var delIndex = -1
                    for (let i = 0; i < this.statesManager.WebInterface[webInterfaceID].Requests.length; i++) {
                        this.statesManager.WebInterface[webInterfaceID].Requests[i] -= this.deltaTime
                        if (this.statesManager.WebInterface[webInterfaceID].Requests[i] <= 0) delIndex = i
                    }
                    if (delIndex > -1) this.statesManager.WebInterface[webInterfaceID].Requests.splice(delIndex)
                }

                if (this.statesManager.WeatherReport.Text.length == 0) {
                    this.dailyWeatherReportLoadingTextTimeout += this.deltaTime
                } else if (this.statesManager.WeatherReport.Text == 'I don\'t need to send a new report') {
                    this.dailyWeatherReportLoadingTextTimeout += this.deltaTime
                } else {
                    this.dailyWeatherReportLoadingTextTimeout = 0
                }

                if (this.statesManager.News.LoadingText.length == 0) {
                    this.newsLoadingTextTimeout += this.deltaTime
                } else {
                    this.newsLoadingTextTimeout = 0
                }

                const now = (Date.now() / 1000)
                this.deltaTime = now - this.lastTime
                if (this.deltaTime < 0) { this.deltaTime = 0 }
                this.lastTime = now

                for (const webInterfaceID of webInterfaceIDs) {
                    var removeIndex = -1
                    for (let i = 0; i < this.statesManager.WebInterface[webInterfaceID].Clients.length; i++) {
                        const element = this.statesManager.WebInterface[webInterfaceID].Clients[i]
                        if (element.destroyed == true) {
                            this.statesManager.WebInterface[webInterfaceID].ClientsTime[i] -= 1
                            if (this.statesManager.WebInterface[webInterfaceID].ClientsTime[i] <= 0) {
                                removeIndex = i
                            }
                        }
                    }
                    if (removeIndex > -1) {
                        this.statesManager.WebInterface[webInterfaceID].Clients.splice(removeIndex, 1)
                        this.statesManager.WebInterface[webInterfaceID].ClientsTime.splice(removeIndex, 1)
                    }
                }

                this.RefreshScreen()
            }, 100)
        } else {
            if (enabled == false) { return }
            this.timer = setInterval(async () => {
                this.loadingIndex += (this.deltaTime * 12)
                if (Math.round(this.loadingIndex) >= spinner.length) {
                    this.loadingIndex = 0
                }

                const now = (Date.now() / 1000)
                this.deltaTime = now - this.lastTime
                if (this.deltaTime < 0) { this.deltaTime = 0 }
                this.lastTime = now

                this.RefreshScreen()
            }, 100)
        }
    }

    Destroy() {
        clearInterval(this.timer)
    }

    GetSocketState(socket) {
        if (socket.connecting == true) {
            return spinner[Math.round(this.loadingIndex)]
        }
        if (socket.destroyed == true) {
            return CliColor.FgRed + "X" + CliColor.FgDefault
        }

        return CliColor.FgGreen + '√' + CliColor.FgDefault
    }

    Loading(loadingName, packetName) {
        if (enabled == false) { return }
        this.loadingOverride = loadingName + ': ' + packetName
        this.RefreshScreen()

        this.loadingIndex += (this.deltaTime / 2)
        if (Math.round(this.loadingIndex) >= spinner.length) {
            this.loadingIndex = 0
        }

        const now = Date.now()
        this.deltaTime = now - this.lastTime
        this.lastTime = now

        this.RefreshScreen()
    }

    BlankScreen() {
        if (enabled == false) return
        this.loadingOverride = ''
        var txt = ''
        txt += '\n'
        const remaingHeight = window.height - txt.split('\n').length - 1
        for (let i = 0; i < remaingHeight; i++) txt += '\n'
        txt += '\n'
        reprint(txt)
    }

    RefreshScreen() {
        if (enabled == false) { return }

        var txt = ''

        if (this.scriptLoadingText !== null && this.scriptLoadingText !== undefined && this.scriptLoadingText !== '' && this.scriptLoadingText.length > 0) {
            txt += FixedWidth(this.scriptLoadingText, window.width) + '\n'
        }

        if (this.loadingOverride == '') {
            if (this.bot !== undefined) {
                txt += FixedWidth('┌──── Client', window.width)
                if (this.bot.readyAt) txt += FixedWidth('│' + FixedWidth('Ready at:', 20) + GetTime(this.bot.readyAt), window.width) + '\n'
                var dfdfdf = new Date(0)
                dfdfdf.setSeconds(this.bot.uptime / 1000)
                dfdfdf.setHours(dfdfdf.getHours() - 1)
                if (dfdfdf !== '0:00:00') txt += FixedWidth('│' + FixedWidth('Uptime:', 20) + GetTime(dfdfdf), window.width) + '\n'
                if (this.bot.ws.ping.toString() !== 'NaN') txt += FixedWidth('│' + FixedWidth('Ping:', 20) + (this.bot.ws.ping.toString().replace('NaN', '-')) + ' ms', window.width) + '\n'
                txt += FixedWidth('│' + FixedWidth('WS State:', 20) + StateText(WsStatus[this.bot.ws.status]), window.width) + '\n'
                if (this.bot.ws.shards.size == 0) {
                    txt += FixedWidth('│' + FixedWidth('Shard State:', 20) + CliColor.FgYellow + 'No shard' + CliColor.FgDefault, window.width) + '\n'
                } else {
                    txt += FixedWidth('│' + FixedWidth('Shard State:', 20) + StateText(WsStatus[this.bot.ws.shards.first().status]), window.width) + '\n'
                }   
            }
            
            if (this.statesManager !== undefined) {
                if (this.statesManager.botLoadingState.length > 0) txt += FixedWidth('│' + FixedWidth('Client State:', 20) + StateTextBot(this.statesManager.botLoadingState), window.width) + '\n'
                txt += FixedWidth('│' + FixedWidth('Timeouts:', 20) + timeout[this.statesManager.heartbeat] + ' ' + timeout[this.statesManager.hello], window.width) + '\n'
                if (this.statesManager.Shard.IsLoading == true) {
                    let shardText = this.statesManager.Shard.LoadingText
                    if (this.statesManager.Shard.LoadingTextColor) {
                        shardText = this.statesManager.Shard.LoadingTextColor + shardText + CliColor.FgDefault
                    }
                    txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' Loading Shard:', 20) + shardText, window.width) + '\n'
                }
                if (this.statesManager.Shard.Error.length > 0) {
                    txt += FixedWidth('│' + FixedWidth('Shard:', 20) + CliColor.FgRed + this.statesManager.Shard.Error + CliColor.FgDefault, window.width) + '\n'
                }

                const webInterfaceIDs = Object.keys(this.statesManager.WebInterface)
                for (const webInterfaceID of webInterfaceIDs) {
                    txt += FixedWidth('', window.width) + '\n'
                    txt += FixedWidth('┌──── Web Interface ' + webInterfaceID, window.width)
                    txt += FixedWidth('│' + FixedWidth('HB State:', 20) + StateText_HB(this.statesManager.WebInterface[webInterfaceID].Error, this.statesManager.WebInterface[webInterfaceID].IsDone, this.statesManager.WebInterface[webInterfaceID].URL), window.width) + '\n'
                    if (this.statesManager.WebInterface[webInterfaceID].Clients.length > 0) {
                        txt += FixedWidth('│' + FixedWidth('HB Requiests:', 20) + this.statesManager.WebInterface[webInterfaceID].Requests.length, window.width) + '\n'
                        for (let i = 0; i < this.statesManager.WebInterface[webInterfaceID].Clients.length; i++) {
                            const socket = this.statesManager.WebInterface[webInterfaceID].Clients[i]
                            if (i == 0) {
                                txt += FixedWidth('│' + FixedWidth('HB Clients:', 20) + "[" + socket.remoteAddress + ", " + this.GetSocketState(socket) + ", In: " + GetDataSize(socket.bytesRead) + ", Out: " + GetDataSize(socket.bytesWritten) + "]", window.width) + '\n'
                            } else {
                                txt += FixedWidth('│' + FixedWidth('', 20) + "[" + socket.remoteAddress + ", " + this.GetSocketState(socket) + ", In: " + GetDataSize(socket.bytesRead) + ", Out: " + GetDataSize(socket.bytesWritten) + "]", window.width) + '\n'
                            }
                        }
                    }
                }
                
                const needPrintThis =
                    (this.dailyWeatherReportLoadingTextTimeout < 30) ||
                    (this.statesManager.Commands.All != this.statesManager.Commands.Created) ||
                    (this.statesManager.Ytdl.IsLoading == true) ||
                    (this.newsLoadingTextTimeout < 30) ||
                    (this.statesManager.News.AllProcessed == false) ||
                    (this.statesManager.ExchangeReport.Text.length > 0) ||
                    (this.statesManager.MVMReport.Text.length > 0)

                if (needPrintThis) {
                    txt += FixedWidth('', window.width) + '\n'
                    txt += FixedWidth('┌──── Other', window.width)
                    if (this.statesManager.Ytdl.IsLoading == true) {
                        txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' YTDL:', 20) + this.statesManager.Ytdl.LoadingText, window.width) + '\n'
                    }
                    if (this.statesManager.Commands.All != this.statesManager.Commands.Created) {
                        txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' Loading commands:', 20) + Math.round(this.statesManager.Commands.Created / this.statesManager.Commands.All * 100) + "%", window.width) + '\n'
                    }
                    if (this.dailyWeatherReportLoadingTextTimeout < 30) {
                        if (this.statesManager.WeatherReport.Text.length > 0 && this.statesManager.WeatherReport.Text !== 'I don\'t need to send a new report') {
                            txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' Weather report:', 20) + this.statesManager.WeatherReport.Text, window.width) + '\n'
                        } else {
                            if (this.statesManager.WeatherReport.Text.length > 0) {
                                txt += FixedWidth('│' + FixedWidth('Weather report:', 20) + this.statesManager.WeatherReport.Text, window.width) + '\n'
                            } else {
                                txt += FixedWidth('│' + FixedWidth('Weather report:', 20) + `${CliColor.FgGreen}Done${CliColor.FgWhite}`, window.width) + '\n'
                            }
                        }
                    }
                    if (this.newsLoadingTextTimeout < 30) {
                        if (this.statesManager.News.LoadingText.length > 0 && this.statesManager.News.LoadingText !== 'I don\'t need to send a new report') {
                            if (this.statesManager.News.LoadingText2.length > 0) {
                                txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' News:', 20) + this.statesManager.News.LoadingText + ' (' + this.statesManager.News.LoadingText2 + ')', window.width) + '\n'
                            } else {
                                txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' News:', 20) + this.statesManager.News.LoadingText, window.width) + '\n'
                            }
                        } else {
                            txt += FixedWidth('│' + FixedWidth('News:', 20) + `${CliColor.FgGreen}Done${CliColor.FgWhite}`, window.width) + '\n'
                        }
                    } else if (this.statesManager.News.AllProcessed === false) {
                        txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' News:', 20) + 'Loading...', window.width) + '\n'
                    }
                    
                    if (this.statesManager.ExchangeReport.Text.length > 0) {
                        txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' ExchangeReport:', 20) + this.statesManager.ExchangeReport.Text, window.width) + '\n'
                    } else {
                        txt += FixedWidth('│' + FixedWidth('ExchangeReport:', 20) + `${CliColor.FgGreen}Done${CliColor.FgWhite}`, window.width) + '\n'
                    }
                    
                    if (this.statesManager.MVMReport.Text.length > 0 || this.statesManager.MVMReport.Service.length > 0) {
                        if (this.statesManager.MVMReport.Text.length > 0)
                        { txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' MVM Report:', 20) + this.statesManager.MVMReport.Text, window.width) + '\n' }
                        if (this.statesManager.MVMReport.Service.length > 0)
                        { txt += FixedWidth('│' + FixedWidth(spinner[Math.round(this.loadingIndex)] + ' MVM Service:', 20) + this.statesManager.MVMReport.Service, window.width) + '\n' }
                    } else {
                        txt += FixedWidth('│' + FixedWidth('MVMReport:', 20) + `${CliColor.FgGreen}Done${CliColor.FgWhite}`, window.width) + '\n'
                    }
                }
            }
        } else {
            txt += FixedWidth(FixedWidth('Delta time:', 20) + FixedWidth(Math.max(0, Math.round((this.deltaTime-0.1)*1000)/1000).toString(), 5) + ' sec', window.width) + '\n'
            txt += FixedWidth(FixedWidth(spinner[Math.round(this.loadingIndex)] + ' Loading:', 20) + this.loadingOverride, window.width) + '\n'
        }
        if (this.statesManager != undefined) {
            if (this.statesManager.Database.LoadText.length > 0) {
                txt += FixedWidth(FixedWidth('Loading database:', 20) + this.statesManager.Database.LoadText, window.width) + '\n'
            }
            if (this.statesManager.Database.ParsingText.length > 0) {
                txt += FixedWidth(FixedWidth('Parsing database:', 20) + this.statesManager.Database.ParsingText, window.width) + '\n'
            }
            if (this.statesManager.Database.SaveText.length > 0) {
                txt += FixedWidth(FixedWidth('Saving database:', 20) + this.statesManager.Database.SaveText, window.width) + '\n'
            }
        }

        const remaingHeight = terminalSize.height - txt.split('\n').length - 4
        for (let i = 0; i < remaingHeight; i++) txt += FixedWidth('', window.width) + '\n'

        reprint(txt)
    }

    type = {
        Debug: 0,
        Msg: 1,
        Info: 2,
        Done: 3,
        Shard: 4,
        Warn: 5,
        Err: 6,
    }

    /**
     * @param {string} key
     */
    OnKeyDown(key) {
        
    }
}

class LoadingProgress {
    constructor() {
        this.botState = 'Betöltés'
        this.botPercent = 0
        this.botLoading = false
        this.handlebarsState = 'Betöltés'
        this.handlebarsLoading = false
    }
}

module.exports = LogManager
