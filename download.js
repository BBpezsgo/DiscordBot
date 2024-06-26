const spinner = ['─', '\\', '|', '/']
let spinnerIndex = 0
/** @type {string[]} */
let logs = []

const useDefaultLogSystem = false

/** @param {string} log */
const ProcessLogMessage = (log, i = 0) => {
    let logText = log

    if (useDefaultLogSystem) {
        logText = logText.replace('%SPINNER%', ' ')
        logText = logText.replace('%TASK%', ' ')
    } else {
        logText = logText.replace('%SPINNER%', spinner[spinnerIndex])

        if (i == logs.length - 1) {
            logText = logText.replace('%TASK%', spinner[spinnerIndex])
        } else {
            logText = logText.replace('%TASK%', ' ')
        }
    }

    return logText
}

/** @param {string | number | object | boolean} msg */
function Log(msg) {
    if (useDefaultLogSystem) {
        if (typeof msg === 'string') {
            console.log(ProcessLogMessage(msg))
        } else {
            console.log(msg)
        }
    } else {
        logs.push(msg.toString())
    }
}

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

/**
 * Reprints a line on the console
 * @param {string | Uint8Array} text
 */
const reprint = (text, x = 0, y = 0) => {
    process.stdout.cursorTo(x, y)
    process.stdout.clearLine(0)
    process.stdout.write(text)
    process.stdout.write('\n')
}

/**
 * @param {string} char
 * @param {number} len
 */
function chars(char, len) {
    let txt = ""
    for (let i = 0; i < len; i++) {
        txt += char
    }
    return txt
}

/** @param {number} bytes */
function GetDataSize(bytes) {
    let txt = "bytes"
    let val = bytes
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

function RefreshScreen() {
    if (useDefaultLogSystem) { return }

    const window = { width: 40, height: 5 }

    let txt = ''

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        let logText = ProcessLogMessage(log, i)

        if (window.width - logText.length > 0) {
            logText += chars(' ', window.width - logText.length)
        }

        txt += logText + '\n'
    }

    const remaingHeight = window.height - txt.split('\n').length
    for (let i = 0; i < remaingHeight; i++) {
        txt += chars(' ', window.width) + '\n'
    }

    reprint(txt)
}

const timer = setInterval(() => {
    if (useDefaultLogSystem == false) {
        RefreshScreen()
        spinnerIndex += 1
        if (spinnerIndex >= spinner.length) {
            spinnerIndex = 0
        }
    }
}, 100)

Log('  Loading npm packages')
const https = require('https')
const fs = require('fs')
const AdmZip = require('adm-zip')

const fileName = 'file.zip'
const url = 'https://codeload.github.com/BBpezsgo/DiscordBot/zip/main'

Log('%TASK% Create fs write stream')
const file = fs.createWriteStream(fileName)

Log(`%TASK% Request sent`)
const requestedAt = Date.now()
let showRequestEllapsed = true

/** @param {number} ms Milliseconds */
function GetTime(ms) {
    if (ms < 1000) {
        return ms + ' ms'
    } else if (ms < 60) {
        return (ms/1000) + ' secs'
    } else if (ms < 60*60) {
        return (ms/1000/60) + ':' + (ms/1000)
    }
}

const requestEllapsedTimer = setInterval(() => {
    let j = -1
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        if (log.includes(' Request sent')) {
            j = i
        }
    }
    if (j > -1) {
        logs[j] = `%TASK% Request sent (${GetTime(new Date(Date.now() - requestedAt).getMilliseconds())})`
    }
    if (showRequestEllapsed == false) {
        clearInterval(requestEllapsedTimer)
    }
}, 100)

const request = https.get(url, function (res) {
    showRequestEllapsed = false
    Log(`  Got a response: ${res.statusCode} ${res.statusMessage}`)

    let cur = 0

    res.on('data', function (chunk) {
        cur += chunk.length

        if (logs.length > 0) {
            if (logs[logs.length - 1].includes(' Downloading ')) {
                logs[logs.length - 1] = `%TASK% Downloading (${GetDataSize(cur)})`
            } else {
                Log(`%TASK% Downloading (${GetDataSize(cur)})`)
            }
        } else {
            Log(`%TASK% Downloading (${GetDataSize(cur)})`)
        }
        RefreshScreen()
    })

    res.on('end', function () {
        Log(`  Downloaded ${cur} bytes`)
        Log('%TASK% Waiting 1s before unzip')

        setTimeout(async () => {
            Log('%TASK% Unzip')
            Unzip()

            Log('%TASK% Cleanup')
            fs.unlinkSync('./' + fileName)

            clearInterval(timer)

            Log('  Done')
            RefreshScreen()
        }, 1000)
    })

    res.on('error', (err) => {
        Log(`  ${CliColor.FgRed}Response error:${CliColor.FgDefault} ${err.message}`)
    })

    res.on('close', () => {
        Log('  Response closed')
    })

    res.pipe(file)
})

request.on("error", (err) => {
    showRequestEllapsed = false
    clearInterval(timer)
    Log(`  ${CliColor.FgRed}Requiest error:${CliColor.FgDefault}`)
    Log(`    Name: ${err.name}`)
    Log(`    Message: ${err.message}`)

    if (fs.existsSync('./' + fileName)) {
        Log(`  Cleanup`)
        fs.unlinkSync('./' + fileName)
    }

    RefreshScreen()
})

request.on('abort', () => { Log(`  Request aborted`) })
request.on('close', () => { Log(`  Request closed`) })
request.on('connect', (res, soc, head) => { Log(`  Request connected`) })
request.on('timeout', () => {
    Log(`  Request timeout`)
})

function Unzip() {
    try {
        const zip = new AdmZip('./' + fileName)
        zip.extractAllTo('./', true)
        RefreshScreen()
    } catch (err) {
        clearInterval(timer)
        if (fs.readFileSync('./' + fileName, 'utf-8') == '404: Not Found') {
            Log(`  ${CliColor.FgRed}Reposity not found${CliColor.FgDefault}`)
        } else {
            Log(`  ${err}`)
        }
        if (fs.existsSync('./' + fileName)) {
            Log(`  Cleanup`)
            fs.unlinkSync('./' + fileName)
        }
        RefreshScreen()
    }
}