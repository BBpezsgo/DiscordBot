const fontColor = '\033[37m'
const timestampForeColor = '\033[30m'

const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + fontColor + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + fontColor + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + fontColor + ']'
const SHARD = '[' + '\033[35m' + 'SHARD' + '\033[40m' + '' + fontColor + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + fontColor + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + fontColor + ']'
const SERVER = '[' + '\033[36m' + 'SERVER' + '\033[40m' + '' + fontColor + ']'

const timelineStepSize = 20000

const enabled = false

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

    FgDefault: fontColor
}

const { StatesManager } = require('./statesManager.js')

const Discord = require('discord.js')

const MessageCodes = {
    HandlebarsStartLoading: 0,
    HandlebarsFinishLoading: 1
}

const spinner = ['─', '\\', '|', '/']
const timeline = [' ', '▓', '█']
const timeout = ['◌', '○', '●']

const { TranslateResult } = require('./translator.js')

/**Reprints a line on the console */
const reprint = (text, x = 0, y = 0) => {
    process.stdout.cursorTo(x, y)
    process.stdout.clearLine()
    process.stdout.write(text)
    process.stdout.write('\n')
}

/**Prints a text to the console */
const print = async (text) => {
    process.stdout.write(text)
    process.stdout.write('\n')
}

/**Sleep for 'ms' milliseconds */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function chars(char, len) {
    txt = ""
    for (let i = 0; i < len; i++) {
        txt += char
    }
    return txt
}

/**@param {string} str */
function ThisContainsColorcode(str) {
    return (
        str.includes(CliColor.BgBlack) ||
        str.includes(CliColor.BgBlue) ||
        str.includes(CliColor.BgCyan) ||
        str.includes(CliColor.BgGreen) ||
        str.includes(CliColor.BgMagenta) ||
        str.includes(CliColor.BgRed) ||
        str.includes(CliColor.BgWhite) ||
        str.includes(CliColor.BgYellow) ||
        str.includes(CliColor.FgBlack) ||
        str.includes(CliColor.FgBlue) ||
        str.includes(CliColor.FgCyan) ||
        str.includes(CliColor.FgDefault) ||
        str.includes(CliColor.FgGreen) ||
        str.includes(CliColor.FgMagenta) ||
        str.includes(CliColor.FgRed) ||
        str.includes(CliColor.FgWhite) ||
        str.includes(CliColor.FgYellow)
    )
}

function RemoveColorcodes(text) {
    var txt = text + ''
    while (ThisContainsColorcode(txt)) {
        txt = txt.replace(CliColor.BgBlack, '')
        txt = txt.replace(CliColor.BgBlue, '')
        txt = txt.replace(CliColor.BgCyan, '')
        txt = txt.replace(CliColor.BgGreen, '')
        txt = txt.replace(CliColor.BgMagenta, '')
        txt = txt.replace(CliColor.BgRed, '')
        txt = txt.replace(CliColor.BgWhite, '')
        txt = txt.replace(CliColor.BgYellow, '')
        txt = txt.replace(CliColor.FgBlack, '')
        txt = txt.replace(CliColor.FgBlue, '')
        txt = txt.replace(CliColor.FgCyan, '')
        txt = txt.replace(CliColor.FgDefault, '')
        txt = txt.replace(CliColor.FgGreen, '')
        txt = txt.replace(CliColor.FgMagenta, '')
        txt = txt.replace(CliColor.FgRed, '')
        txt = txt.replace(CliColor.FgWhite, '')
        txt = txt.replace(CliColor.FgYellow, '')
    }
    return txt
}

/**@param {string} text @param {number} width */
function genLine(text, width) {
    var txt = text + ''
    if (RemoveColorcodes(text).length > width) {
        txt = txt.substring(0, width - 3) + CliColor.FgDefault + '...'
    }
    txt += chars(' ', width - RemoveColorcodes(text).length)
    return txt
}

const WsStatus = [
    'READY',
    'CONNECTING',
    'RECONNECTING',
    'IDLE',
    'NEARLY',
    'DISCONNECTED',
    'WAITING_FOR_GUILDS',
    'IDENTIFYING',
    'RESUMING'
]

function AddZeros(num) {
    if (num < 10) {
        return '0' + num
    } else {
        return num
    }
}
/**@param {Date} date */
function GetTime(date) {
    if (date) {
        return date.getHours() + ':' + AddZeros(date.getMinutes()) + ':' + AddZeros(date.getSeconds())
    } else {
        return '--:--:--'
    }
}

/**@param {number} bytes */
function GetDataSize(bytes) {
    var txt = "byte"
    var val = bytes
    if (val > 1024) {
        txt = "Kb"
        val = val / 1024
    }
    if (val > 1024) {
        txt = "Mb"
        val = val / 1024
    }
    if (val > 1024) {
        txt = "Gb"
        val = val / 1024
    }

    return Math.floor(val) + " " + txt
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

/**@param {string} text */
function Capitalize(text) {
    var str = text
    if (str.includes(' ') == true) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    const str2 = arr.join(" ");
    return str2
}

function StateText(state) {
    if (state == 'IDLE') {
        return CliColor.FgYellow + 'Idle' + CliColor.FgDefault
    }
    if (state == 'READY') {
        return CliColor.FgGreen + 'Ready' + CliColor.FgDefault
    }
    if (state == 'CONNECTING') {
        return CliColor.FgYellow + 'Connecting...' + CliColor.FgDefault
    }
    if (state == 'RECONNECTING') {
        return CliColor.FgYellow + 'Reconnecting...' + CliColor.FgDefault
    }
    if (state == 'NEARLY') {
        return CliColor.FgYellow + 'Nearly...' + CliColor.FgDefault
    }
    if (state == 'DISCONNECTED') {
        return CliColor.FgRed + 'Disconnected' + CliColor.FgDefault
    }
    if (state == 'WAITING_FOR_GUILDS') {
        return CliColor.FgYellow + 'Waiting for guilds...' + CliColor.FgDefault
    }
    if (state == 'IDENTIFYING') {
        return CliColor.FgYellow + 'Identifying...' + CliColor.FgDefault
    }
    if (state == 'RESUMING') {
        return CliColor.FgYellow + 'Resuming...' + CliColor.FgDefault
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

class LogManager {
    /**@param {boolean} isPhone */
    constructor(isPhone, bot, statesManager) {

        /** @type {[LogMsg]}*/
        this.logs = []
        /** @type {number}*/
        this.timer = 0

        /** @type {number}*/
        this.loggedCount = 0

        /** @type {string}*/
        this.currentlyTyping = ""
        /** @type {number}*/
        this.blinkerTime = 0

        /** @type {LoadingProgress}*/
        this.loading = new LoadingProgress();
        /** @type {number}*/
        this.loadingIndex = 0

        /**@type {boolean} */
        this.enableLog = true

        /**@type {boolean} */
        this.isPhone = isPhone

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

        /** @type {number[]} */
        this.timeline = []

        /** @type {number} */
        this.lastTimelineTime = 0

        /** @type {number} */
        this.dailyWeatherReportLoadingTextTimeout = 0
        /** @type {number} */
        this.newsLoadingTextTimeout = 0

        /** @type {(pressedButton: string) => void} */
        this.promtCallback
        /** @type {string[]} */
        this.promtButtons
        /** @type {string} */
        this.promtMessage

        if (bot != null && statesManager != null) {
            this.timer = setInterval(async () => {
                if (this.enableLog == true) {
                    if (this.timer > 3) {
                        for (let i = 0; i < this.logs.length; i++) {
                            const log = this.logs[i];
                            if (log.printed == false) {
                                if (log.priv == false && this.isPhone == false) { } else {
                                    var nl = (this.loggedCount == 0) ? '\n' : ''
                                    if (log.count == 1) {
                                        //print(nl + ' ' + fontColor + timestampForeColor + log.time + ' | ' + log.count + ' │' + fontColor + '  ' + log.prefix + ': ' + log.message + '\x1b[1m' + fontColor)
                                    } else {
                                        //print(nl + ' ' + fontColor + timestampForeColor + log.time + ' | \x1b[31m' + log.count + timestampForeColor + ' │' + fontColor + '  ' + log.prefix + ': ' + log.message + '\x1b[1m' + fontColor)
                                    }
                                }
                                this.loggedCount += 1
                                this.logs[i].printed = true
                            }
                        }
                    } else {
                        this.timer += 1
                    }
                }

                this.loadingIndex += (this.deltaTime * 12)
                if (Math.round(this.loadingIndex) >= spinner.length) {
                    this.loadingIndex = 0
                }

                var delIndex = -1
                for (let i = 0; i < this.statesManager.handlebarsRequiests.length; i++) {
                    this.statesManager.handlebarsRequiests[i] -= this.deltaTime
                    if (this.statesManager.handlebarsRequiests[i] <= 0) {
                        delIndex = i
                    }
                }

                if (delIndex > -1) {
                    this.statesManager.handlebarsRequiests.splice(delIndex)
                }

                this.blinkerTime += this.deltaTime

                if (this.blinkerTime > 1000) {
                    this.blinkerTime = -1000
                }

                if (this.statesManager.dailyWeatherReportLoadingText.length == 0) {
                    this.dailyWeatherReportLoadingTextTimeout += this.deltaTime
                } else {
                    this.dailyWeatherReportLoadingTextTimeout = 0
                }

                if (this.statesManager.newsLoadingText.length == 0) {
                    this.newsLoadingTextTimeout += this.deltaTime
                } else {
                    this.newsLoadingTextTimeout = 0
                }



                const now = (Date.now() / 1000)
                this.deltaTime = now - this.lastTime
                if (this.deltaTime < 0) { this.deltaTime = 0 }
                this.lastTime = now

                if (this.lastTimelineTime < Date.now() - timelineStepSize) {
                    this.lastTimelineTime = Date.now()
                    this.AddTimeline(1)
                }

                var removeIndex = -1
                for (let i = 0; i < this.statesManager.handlebarsClients.length; i++) {
                    const element = this.statesManager.handlebarsClients[i]
                    if (element.destroyed == true) {
                        this.statesManager.handlebarsClientsTime[i] -= 1
                        if (this.statesManager.handlebarsClientsTime[i] <= 0) {
                            removeIndex = i
                        }
                    }
                }
                if (removeIndex > -1) {
                    this.statesManager.handlebarsClients.splice(removeIndex, 1)
                    this.statesManager.handlebarsClientsTime.splice(removeIndex, 1)
                }

                this.RefreshScreen()
            }, 100);
        } else {
            this.timer = setInterval(async () => {
                this.loadingIndex += (this.deltaTime * 12)
                if (Math.round(this.loadingIndex) >= spinner.length) {
                    this.loadingIndex = 0
                }

                this.blinkerTime += this.deltaTime

                if (this.blinkerTime > 1) {
                    this.blinkerTime = -1
                }

                if (this.statesManager.dailyWeatherReportLoadingText.length == 0) {
                    this.dailyWeatherReportLoadingTextTimeout += this.deltaTime
                } else {
                    this.dailyWeatherReportLoadingTextTimeout = 0
                }

                if (this.statesManager.newsLoadingText.length == 0) {
                    this.newsLoadingTextTimeout += this.deltaTime
                } else {
                    this.newsLoadingTextTimeout = 0
                }


                const now = (Date.now() / 1000)
                this.deltaTime = now - this.lastTime
                if (this.deltaTime < 0) { this.deltaTime = 0 }
                this.lastTime = now

                if (this.lastTimelineTime < Date.now() - timelineStepSize) {
                    this.lastTimelineTime = Date.now()
                    this.AddTimeline(1)
                }

                this.RefreshScreen()
            }, 100);
        }
    }

    AddTimeline(val) {
        this.timeline.push(Date.now(), val)
    }

    GetTimelineText() {
        var str = '|'
        const width = 30
        for (let i = Date.now() - (timelineStepSize * width); i < Date.now(); i += timelineStepSize) {
            var x = ' '
            for (let j = 0; j < this.timeline.length; j += 2) {
                if (this.timeline[j] >= (i - timelineStepSize) && this.timeline[j] <= i) {
                    x = timeline[this.timeline[j + 1]]
                    if (this.timeline[j + 1] == 2) { break }
                }
            }
            str += x
        }
        if ((str.length - 1) > width) {
            str = str.substring(0, width + 1)
        }
        return str + '|'
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
        this.loadingOverride = loadingName + ': ' + packetName
        this.RefreshScreen()

        this.loadingIndex += (this.deltaTime / 2)
        if (Math.round(this.loadingIndex) >= spinner.length) {
            this.loadingIndex = 0
        }

        this.blinkerTime += this.deltaTime

        if (this.blinkerTime > 1) {
            this.blinkerTime = -1
        }
        const now = Date.now()
        this.deltaTime = now - this.lastTime
        this.lastTime = now

        this.RefreshScreen()
    }

    BlankScreen() {
        if (enabled == false) { return }
        this.loadingOverride = ''

        const window = { width: 80, height: 20 }
        if (this.isPhone == true) {
            window.width = 48
        } else {
            window.width = 80
        }

        var txt = '┌' + chars('─', window.width - 2) + '┒\n'
        txt += '│ ' + genLine('', window.width - 4) + ' ┃\n'
        const remaingHeight = window.height - txt.split('\n').length - 1
        for (let i = 0; i < remaingHeight; i++) {
            txt += '│ ' + genLine('', window.width - 4) + ' ┃\n'
        }
        txt += '┕' + chars('━', window.width - 2) + '┛\n'
        txt += chars(' ', window.width) + '\n'

        reprint(txt)
    }

    //txt += '˥ ˦ ˧ ˨ ˩' + '\n'
    //txt += '˹˺˻˼' + '\n'

    RefreshScreen() {
        if (enabled == false) { return }
        const window = { width: 80, height: 20 }
        if (this.isPhone == true) {
            window.width = 48
        } else {
            window.width = 80
        }

        var txt = '┌' + chars('─', window.width - 2) + '┒\n'

        if (this.loadingOverride == '') {
            txt += '│ ' + genLine(genLine('Delta time:', 20) + genLine(Math.round((this.deltaTime-0.1)*1000)/1000, 5) + ' sec', window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine('Ready at:', 20) + GetTime(this.bot.readyAt), window.width - 4) + ' ┃\n'
            var dfdfdf = new Date(0)
            dfdfdf.setSeconds(this.bot.uptime / 1000)
            dfdfdf.setHours(dfdfdf.getHours() - 1)
            txt += '│ ' + genLine(genLine('Uptime:', 20) + GetTime(dfdfdf), window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine('Ping:', 20) + (this.bot.ws.ping.toString().replace('NaN', '-')) + ' ms', window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine('WS State:', 20) + StateText(WsStatus[this.bot.ws.status]), window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine('BOT State:', 20) + StateTextBot(this.statesManager.botLoadingState), window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine('Timeouts:', 20) + timeout[this.statesManager.heartbeat] + ' ' + timeout[this.statesManager.hello], window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine('', window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine('HB State:', 20) + StateText_HB(this.statesManager.handlebarsErrorMessage, this.statesManager.handlebarsDone, this.statesManager.handlebarsURL), window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine('HB Requiests:', 20) + this.statesManager.handlebarsRequiests.length, window.width - 4) + ' ┃\n'
            for (let i = 0; i < this.statesManager.handlebarsClients.length; i++) {
                const socket = this.statesManager.handlebarsClients[i];
                if (i == 0) {
                    txt += '│ ' + genLine(genLine('HB Clients:', 20) + "[" + socket.remoteAddress + ", " + this.GetSocketState(socket) + ", In: " + GetDataSize(socket.bytesRead) + ", Out: " + GetDataSize(socket.bytesWritten) + "]", window.width - 4) + ' ┃\n'
                } else {
                    txt += '│ ' + genLine(genLine('', 20) + "[" + socket.remoteAddress + ", " + this.GetSocketState(socket) + ", In: " + GetDataSize(socket.bytesRead) + ", Out: " + GetDataSize(socket.bytesWritten) + ", " + "]", window.width - 4) + ' ┃\n'
                }
            }
            if (this.bot.ws.shards.size == 0) {
                txt += '│ ' + genLine(genLine('Shard State:', 20) + 'None', window.width - 4) + ' ┃\n'
            } else {
                txt += '│ ' + genLine(genLine('Shard State:', 20) + StateText(WsStatus[this.bot.ws.shards.first().status]), window.width - 4) + ' ┃\n'
            }
            if (this.statesManager.shardCurrentlyLoading == true) {
                txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' Loading Shard:', 20) + this.statesManager.shardCurrentlyLoadingText, window.width - 4) + ' ┃\n'
            }
            if (this.statesManager.shardErrorText.length > 0) {
                txt += '│ ' + genLine(genLine('Shard:', 20) + CliColor.FgRed + this.statesManager.shardErrorText + CliColor.FgDefault, window.width - 4) + ' ┃\n'
            }
            if (this.statesManager.ytdlCurrentlyLoading == true) {
                txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' YTDL:', 20) + this.statesManager.ytdloadingText, window.width - 4) + ' ┃\n'
            }
            txt += '│ ' + genLine(genLine('Timeline:', 20) + this.GetTimelineText(), window.width - 4) + ' ┃\n'
            if (this.statesManager.commandAllCommandCount != this.statesManager.commandCreatedCount) {
                txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' Loading commands:', 20) + Math.round(this.statesManager.commandCreatedCount / this.statesManager.commandAllCommandCount * 100) + "%", window.width - 4) + ' ┃\n'
            }
            if (this.dailyWeatherReportLoadingTextTimeout < 30) {
                if (this.statesManager.dailyWeatherReportLoadingText.length > 0) {
                    txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' Weather report:', 20) + this.statesManager.dailyWeatherReportLoadingText, window.width - 4) + ' ┃\n'
                } else {
                    txt += '│ ' + genLine(genLine('Weather report:', 20) + 'Done', window.width - 4) + ' ┃\n'
                }
            }
            if (this.newsLoadingTextTimeout < 30) {
                if (this.statesManager.newsLoadingText.length > 0) {
                    if (this.statesManager.newsLoadingText2.length > 0) {
                        txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' News:', 20) + this.statesManager.newsLoadingText + ' (' + this.statesManager.newsLoadingText2 + ')', window.width - 4) + ' ┃\n'
                    } else {
                        txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' News:', 20) + this.statesManager.newsLoadingText, window.width - 4) + ' ┃\n'
                    }
                } else {
                    txt += '│ ' + genLine(genLine('News:', 20) + 'Done', window.width - 4) + ' ┃\n'
                }
            } else if (this.statesManager.allNewsProcessed == false) {
                txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' News:', 20) + 'Loading...', window.width - 4) + ' ┃\n'
            }
        } else {
            txt += '│ ' + genLine(genLine('Delta time:', 20) + genLine(Math.round((this.deltaTime-0.1)*1000)/1000, 5) + ' sec', window.width - 4) + ' ┃\n'
            txt += '│ ' + genLine(genLine(spinner[Math.round(this.loadingIndex)] + ' Loading:', 20) + this.loadingOverride, window.width - 4) + ' ┃\n'
        }

        const remaingHeight = window.height - txt.split('\n').length - 2 - 1
        for (let i = 0; i < remaingHeight; i++) {
            txt += '│ ' + genLine('', window.width - 4) + ' ┃\n'
        }

        var cursor = ''
        if (this.blinkerTime > 0) {
            cursor = '_'
        } else {
            cursor = ' '
        }

        txt += '│ ' + genLine('> ' + this.currentlyTyping + cursor, window.width - 4) + ' ┃\n'
        txt += '│ ' + genLine(CliColor.BgWhite + CliColor.FgBlack + 'Ctrl+C: Disconnect' + CliColor.BgBlack + CliColor.FgDefault, window.width - 4) + ' ┃\n'
        txt += '┕' + chars('━', window.width - 2) + '┛\n'
        txt += chars(' ', window.width) + '\n'

        reprint(txt)
    }

    /**
     * @param {string} message
     * @param {boolean} privateLog
     * @param {TranslateResult} translateResult
     * @param {number} code
     */
    Log(message, privateLog, translateResult = null, code = null) {
        if (message === '') return;
        if (message === ' ') return;
        if (!message) return;
        if (message.length == 0) return;

        if (this.logs.length == 0) {
            console.log('\x1b[1m' + fontColor)
            console.clear()
        }

        /*
        if (code == MessageCodes.HandlebarsStartLoading) {
            this.loading.handlebarsLoading = true
            this.loading.handlebarsState = 'Betöltés'
        } else  if (code == MessageCodes.HandlebarsFinishLoading) {
            this.loading.handlebarsLoading = false
            this.loading.handlebarsState = ''
        }

        if (translateResult != null) {
            if (translateResult.status != null) {
                this.loading.botPercent = translateResult.status.percent
                if (translateResult.status.percent == 100) {
                    this.loading.botLoading = false
                    process.stdout.cursorTo(0, 0)
                    process.stdout.clearLine()
                    this.enableLog = true
                }
                return
            }
        }
        */

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

        var msg = message
        var type = 0
        var prefix = DEBUG
        if (msg.includes(INFO)) {
            msg = msg.replace(INFO + ": ", "")
            type = this.type.Info
            prefix = INFO
        }
        if (msg.includes(ERROR)) {
            msg = msg.replace(ERROR + ": ", "")
            type = this.type.Err
            prefix = ERROR
        }
        if (msg.includes(WARNING)) {
            msg = msg.replace(WARNING + ": ", "")
            type = this.type.Warn
            prefix = WARNING
        }
        if (msg.includes(SHARD)) {
            msg = msg.replace(SHARD + ": ", "")
            type = this.type.Shard
            prefix = SHARD
        }
        if (msg.includes(DEBUG)) {
            msg = msg.replace(DEBUG + ": ", "")
            type = this.type.Debug
            prefix = DEBUG
        }
        if (msg.includes(DONE)) {
            msg = msg.replace(DONE + ": ", "")
            type = this.type.Done
            prefix = DONE
        }
        if (msg.includes(SERVER)) {
            msg = msg.replace(SERVER + ": ", "")
            prefix = SERVER
        }

        if (this.logs.length == 0) {
            this.logs.push(new LogMsg(msg, timeStamp, type, privateLog, prefix, translateResult))
        } else if (this.timer < 3 && msg == this.logs[this.logs.length - 1].message && this.logs[this.logs.length - 1].printed == false) {
            this.logs[this.logs.length - 1].count += 1
        } else {
            this.logs.push(new LogMsg(msg, timeStamp, type, privateLog, prefix, translateResult))
        }

        this.timer = 0
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
     * @param {string} captionText
     * @param {string[]} buttons
     * @param {(pressedButton: string) => void} callback
     */
    Promt(captionText, buttons, callback) {
        this.promtCallback = callback


    }

    /**
     * @param {string} key
     */
    OnKeyDown(key) {

    }

    CurrentlyPromt() {
        return (this.promtCallback != null)
    }
}

class LoadingProgress {
    /**
     * @param {string} botState
     * @param {number} botPercent
     * @param {boolean} botLoading
     * @param {string} handlebarsState
     * @param {boolean} handlebarsLoading
    */
    constructor() {
        this.botState = 'Betöltés';
        this.botPercent = 0;
        this.botLoading = false;
        this.handlebarsState = 'Betöltés';
        this.handlebarsLoading = false;
    }
}

class LogMsg {
    /**
     * @param {string} message
     * @param {string} time
     * @param {number} type
     * @param {number} count
     * @param {boolean} priv
     * @param {boolean} printed
     * @param {string} prefix
     * @param {TranslateResult} translateResult
    */
    constructor(message, time, type, priv, prefix, translateResult) {
        this.message = message;
        this.time = time;
        this.type = type;
        this.count = 1;
        this.priv = priv;
        this.printed = false;
        this.prefix = prefix;
        this.translateResult = translateResult
    }
}

module.exports = { LogManager, LogMsg, INFO, DEBUG, SERVER, WARNING, ERROR, SHARD, DONE, MessageCodes }
