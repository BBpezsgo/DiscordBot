const fs = require('fs')
const { GetTime } = require('../functions/functions')

const startedMessage = '====== Started ======'

function GetFilename() {
    const currentDate = new Date(Date.now())
    return currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
}

function GetTimePrefix() {
    const currentDate = new Date(Date.now())
    return GetTime(currentDate)
}

function Log(message) {
    fs.appendFile('./ws/log/' + GetFilename() + '.log', '\n' + GetTimePrefix() + ' ' + message, function (err) {
        if (err) {
            throw err
        }
    })
}

function LogRaw(message) {
    fs.appendFile('./ws/log/' + GetFilename() + '.log', message, function (err) {
        if (err) {
            throw err
        }
    })
}

/**
 * @param {{
 *  type: 'NORMAL' | 'ERROR' | 'CLIENT_ERROR' | 'CONNECT' | 'REQUIEST';
 *  IP: string;
 *  url: string;
 *  method: string;
 *  message: string;
 *  helperMessage: string;
 * }} message
 */
function HbLog(message) {
    if (fs.existsSync('./ws/log')) {
        Log(JSON.stringify(message))
    } else {
        fs.mkdir('./ws/log', (err) => {
            if (err) throw err
            Log(JSON.stringify(message))
        })
    }
}

function HbStart() {
    const message =
        '\n\n\n\n' + GetTimePrefix() + ' ' + startedMessage
    if (fs.existsSync('./ws/log')) {
        LogRaw(message)
    } else {
        fs.mkdir('./ws/log', (err) => {
            if (err) throw err
            LogRaw(message)
        })
    }
}

/** @param {string} invisibleIp */
function HbGetLogs(invisibleIp) {
    /** @type {{ dateText: string; content: string;}[]} */
    const filesRaw = []
    fs.readdirSync('./ws/log/').forEach(filename => {
        filesRaw.push({
            dateText: filename.split('.')[0],
            content: fs.readFileSync('./ws/log/' + filename, 'utf-8')
        })
    })

    const events = []

    for (let i = 0; i < filesRaw.length; i++) {
        const dateText = filesRaw[i].dateText
        const rawData = filesRaw[i].content

        const newEvent = { dateText: dateText, groups: [] }
        const lines = rawData.split('\n')

        var thereIsAnyLogGroup = false
        var newLogGroup = {}
        var lastTime = '--:--:--'
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            if (line.length < 2) { continue }
            const time = line.split(' ')[0]
            const logData = line.replace(time + ' ', '')

            if (logData == '====== Started ======') {
                if (thereIsAnyLogGroup) {
                    thereIsAnyLogGroup = false
                    newEvent.groups.unshift(newLogGroup)
                }

                newLogGroup = {}
                thereIsAnyLogGroup = true

                newLogGroup.startTime = time
                newLogGroup.endTime = time
                newLogGroup.logs = []
                newLogGroup.running = false
                lastTime = '--:--:--'
            } else {
                if (newLogGroup.logs == undefined) {
                    newLogGroup.logs = []
                }
                /**
                 *  type: 'NORMAL' | 'ERROR' | 'CLIENT_ERROR' | 'CONNECT' | 'REQUIEST';
                 *  IP: string;
                 *  url: string;
                 *  method: string;
                 *  message: string;
                 *  helperMessage: string;
                 */
                const jsonData = JSON.parse(logData)
                if (jsonData.IP === invisibleIp) {
                    newLogGroup.endTime = time
                    lastTime = time
                    continue
                }
                newLogGroup.logs.push(jsonData)
                newLogGroup.logs[newLogGroup.logs.length-1].time = time
                newLogGroup.logs[newLogGroup.logs.length-1].sameTime = (time == lastTime)
                newLogGroup.logs[newLogGroup.logs.length-1].haveDetails = (jsonData.method != undefined || jsonData.url != undefined || jsonData.IP != undefined)
                newLogGroup.endTime = time
                lastTime = time
            }
        }

        if (thereIsAnyLogGroup) {
            thereIsAnyLogGroup = false
            newLogGroup.running = true
            newEvent.groups.unshift(newLogGroup)
        }

        events.unshift(newEvent)
    }

    return events
}

module.exports = { HbLog, HbStart, HbGetLogs }