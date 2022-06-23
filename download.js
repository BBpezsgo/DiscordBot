var state = '  Loading'
var error = ''
const spinner = ['─', '\\', '|', '/']
var spinnerIndex = 0

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

    FgDefault: '\033[37m'
}
/**Reprints a line on the console */
const reprint = (text, x = 0, y = 0) => {
    process.stdout.cursorTo(x, y)
    process.stdout.clearLine()
    process.stdout.write(text)
    process.stdout.write('\n')
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
        txt = txt.substring(0, width - 3) + '...'
    }
    txt += chars(' ', width - RemoveColorcodes(text).length)
    return txt
}

/**@param {number} bytes */
function GetDataSize(bytes) {
    var txt = "bytes"
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

function RefreshScreen() {
    const window = { width: 40, height: 5 }
    var txt = '┌' + chars('─', window.width - 2) + '┒\n'

    if (error == '') {
        txt += '│ ' + genLine(state, window.width - 4) + ' ┃\n'
    } else {
        txt += '│ ' + genLine(CliColor.FgRed + error + CliColor.FgDefault, window.width - 4) + ' ┃\n'
    }

    const remaingHeight = window.height - txt.split('\n').length - 1 - 1
    for (let i = 0; i < remaingHeight; i++) {
        txt += '│ ' + genLine('', window.width - 4) + ' ┃\n'
    }
    txt += '┕' + chars('━', window.width - 2) + '┛\n'
    txt += chars(' ', window.width) + '\n'

    reprint(txt)
}

const timer = setInterval(() => {
    RefreshScreen()
    spinnerIndex += 1
    if (spinnerIndex >= spinner.length) {
        spinnerIndex = 0
    }
}, 100)

const https = require('https')
const fs = require('fs')
const AdmZip = require('adm-zip')

const fileName = 'file.zip'
const url = 'https://codeload.github.com/BBpezsgo/DiscordBot/zip/main'

const file = fs.createWriteStream(fileName)
const request = https.get(url, function (response) {
    var cur = 0

    response.on('data', function (chunk) {
        cur += chunk.length
        showProgress(cur)
    })

    response.on('end', function () {
        state = spinner[spinnerIndex] + ' Install'

        setTimeout(async () => {
            state = spinner[spinnerIndex] + ' Install'
            Unzip()

            state = spinner[spinnerIndex] + ' Finishing up'
            fs.unlinkSync('./' + fileName)

            clearInterval(timer)

            state = 'Finished'
            RefreshScreen()
        }, 1000)
    })

    response.pipe(file)
})

request.on("error", (err) => {
    clearInterval(timer)
    if (err.message == 'getaddrinfo ENOTFOUND codeload.github.com') {
        error = 'Nem sikerült letölteni: codeload.github.com nem található'
    } else {
        error = err.message
    }
    if (fs.existsSync('./' + fileName)) {
        fs.unlinkSync('./' + fileName)
    }

    RefreshScreen()
})

function showProgress(cur) {
    state = spinner[spinnerIndex] + ' Downloading (' + GetDataSize(cur) + ')'
    RefreshScreen()
}

function Unzip() {
    try {
        const zip = new AdmZip('./' + fileName)
        zip.extractAllTo('./', true)
        RefreshScreen()
    } catch (err) {
        clearInterval(timer)
        if (fs.readFileSync('./' + fileName) == '404: Not Found') {
            error = 'Reposity not found.'
        } else {
            error = err
        }
        if (fs.existsSync('./' + fileName)) {
            fs.unlinkSync('./' + fileName)
        }
        RefreshScreen()
    }
}