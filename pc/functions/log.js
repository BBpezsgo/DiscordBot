const backgroundColor = '\033[40m'
const fontColor = '\033[37m'
const errorMessageFontColor = '\033[31m'
const warningMessageFontColor = '\033[33m'
const infoMessageFontColor = '\033[34m'
const shardMessageFontColor = '\033[35m'
const debugMessageFontColor = '\033[30m'
const doneMessageFontColor = '\033[32m'
const timestampForeColor = '\033[30m'

const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + '\033[37m' + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + '\033[37m' + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + '\033[37m' + ']'
const SHARD = '[' + '\033[35m' + 'SHARD' + '\033[40m' + '' + '\033[37m' + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + '\033[37m' + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + '\033[37m' + ']'
const SERVER = '[' + '\033[36m' + 'SERVER' + '\033[40m' + '' + '\033[37m' + ']'

class LogManager {
    constructor() {
        /**
         * @type {[LogMsg]}
         */
        this.logs = [];
        /**
         * @type {number}
         */
        this.timer = 0;

        setInterval(() => {
            if (this.timer > 3) {
                for (let i = 0; i < this.logs.length; i++) {
                    const log = this.logs[i];
                    if (log.printed == false) {
                        if (log.count == 1) {
                            console.log(' ' + timestampForeColor + log.time + ' | '+ log.count +' │' + fontColor + '  ' + log.prefix + ': ' + log.message + '\x1b[1m' + fontColor)
                        } else {
                            console.log(' ' + timestampForeColor + log.time + ' | \x1b[31m' + log.count + timestampForeColor + ' │' + fontColor + '  ' + log.prefix + ': ' + log.message + '\x1b[1m' + fontColor)
                        }
                        this.logs[i].printed = true
                    }
                }
            } else {
                this.timer += 1
            }
        }, 100);
    }

    /**
     * @param {string} message
     * @param {boolean} privateLog
     */
    Log(message, privateLog) {
        if (message === '') return;
        if (message === ' ') return;
        if (!message) return;
        if (message.length == 0) return;

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
            this.logs.push(new LogMsg(msg, timeStamp, type, privateLog, prefix))
        } else if (this.timer < 3 && msg == this.logs[this.logs.length-1].message && this.logs[this.logs.length-1].printed == false) {
            this.logs[this.logs.length-1].count += 1
        } else {
            this.logs.push(new LogMsg(msg, timeStamp, type, privateLog, prefix))
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

class LogMsg {
    /**
     * @param {string} message
     * @param {string} time
     * @param {number} type
     * @param {number} count
     * @param {boolean} priv
     * @param {boolean} printed
     * @param {string} prefix
    */
    constructor(message, time, type, priv, prefix) {
        this.message = message;
        this.time = time;
        this.type = type;
        this.count = 1;
        this.priv = priv;
        this.printed = false;
        this.prefix = prefix;
    }
}

module.exports = { LogManager, LogMsg, INFO, DEBUG, SERVER, WARNING, ERROR, SHARD, DONE }
