const fontColor = '\033[37m'
const timestampForeColor = '\033[30m'

const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + '\033[37m' + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + '\033[37m' + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + '\033[37m' + ']'
const SHARD = '[' + '\033[35m' + 'SHARD' + '\033[40m' + '' + '\033[37m' + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + '\033[37m' + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + '\033[37m' + ']'
const SERVER = '[' + '\033[36m' + 'SERVER' + '\033[40m' + '' + '\033[37m' + ']'

const MessageCodes = {
    HandlebarsStartLoading: 0,
    HandlebarsFinishLoading: 1
}

const spinner = ['─','\\','|','/']

const { TranslateResult } = require('./translator.js')

/**Reprints a line on the console */
const reprint = (text) => {
    process.stdout.cursorTo(0, 0)
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

class LogManager {
    constructor() {
        /** @type {[LogMsg]}*/
        this.logs = []
        /** @type {number}*/
        this.timer = 0

        /** @type {number}*/
        this.loggedCount = 0

        /** @type {LoadingProgress}*/
        this.loading = new LoadingProgress();
        /** @type {number}*/
        this.loadingIndex = 0

        /**@type {boolean} */
        this.enableLog = true

        setInterval(async () => {
            if (this.enableLog == true) {
                if (this.timer > 3) {
                    for (let i = 0; i < this.logs.length; i++) {
                        const log = this.logs[i];
                        if (log.printed == false) {
                            var nl = (this.loggedCount == 0) ? '\n' : ''
                            if (log.count == 1) {
                                print(nl + ' ' + fontColor + timestampForeColor + log.time + ' | ' + log.count + ' │' + fontColor + '  ' + log.prefix + ': ' + log.message + '\x1b[1m' + fontColor)
                            } else {
                                print(nl + ' ' + fontColor + timestampForeColor + log.time + ' | \x1b[31m' + log.count + timestampForeColor + ' │' + fontColor + '  ' + log.prefix + ': ' + log.message + '\x1b[1m' + fontColor)
                            }
                            this.loggedCount += 1
                            this.logs[i].printed = true
                        }
                    }
                } else {
                    this.timer += 1
                }
            }

            if (this.loading.botLoading == true || this.loading.handlebarsLoading == true) {
                var txt = ''
                if (this.loading.botLoading) {
                    txt += '\nBot        ' + spinner[this.loadingIndex] + ' (' + this.loading.botPercent + ')  |'
                }
                if (this.loading.handlebarsLoading) {
                    txt += '\nHandlebars ' + spinner[this.loadingIndex] + '  |'
                }
                if (txt.startsWith('\n')) {
                    txt = txt.trimStart()
                }
                reprint(txt)
                this.loadingIndex += 1
                if (this.loadingIndex >= spinner.length) {
                    this.loadingIndex = 0
                }
            }
        }, 100);
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
