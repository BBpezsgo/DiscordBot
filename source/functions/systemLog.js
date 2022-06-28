const fs = require('fs')
const { GetTime } = require('./functions')

const startedMessage = '====== Started ======'
const stoppedMessage = '====== Stopped ======'

function GetFilename() {
    const currentDate = new Date(Date.now())
    return currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
}

function GetTimePrefix() {
    const currentDate = new Date(Date.now())
    return GetTime(currentDate)
}

function Log(message) {
    fs.appendFile('./log/' + GetFilename() + '.log', '\n' + GetTimePrefix() + ' ' + message, function (err) {
        if (err) {
            throw err
        }
    })
}

function LogRaw(message) {
    fs.appendFile('./log/' + GetFilename() + '.log', message, function (err) {
        if (err) {
            throw err
        }
    })
}

function SystemLog(message) {
    if (fs.existsSync('./log')) {
        Log(message)
    } else {
        fs.mkdir('./log', (err) => {
            if (err) throw err
            Log(message)
        })
    }
}

function SystemStart(startedInvisible, startedByUser) {
    const message =
    '\n\n\n\n' + GetTimePrefix() + ' ' + startedMessage + '\n' +
    'Invisible: ' + startedInvisible + '\n' +
    'StartedbyUser: ' + startedByUser
    if (fs.existsSync('./log')) {
        LogRaw(message)
    } else {
        fs.mkdir('./log', (err) => {
            if (err) throw err
            LogRaw(message)
        })
    }
}

function SystemStop() {
    const message = '\n' + GetTimePrefix() + ' ' + stoppedMessage
    if (fs.existsSync('./log')) {
        LogRaw(message)
    } else {
        fs.mkdir('./log', (err) => {
            if (err) throw err
            LogRaw(message)
        })
    }
}

function GetLogs() {
    /** @type {{ dateText: string; content: string;}[]} */
    const filesRaw = []
    fs.readdirSync('./log/').forEach(filename => {
        filesRaw.push({
            dateText: filename.split('.')[0],
            content: fs.readFileSync('./log/' + filename, 'utf-8')
        })
    })

    const events = []

    for (let i = 0; i < filesRaw.length; i++) {
        const dateText = filesRaw[i].dateText
        const rawData = filesRaw[i].content
        
        const newEvent = { dateText: dateText, groups: [] }
        const lines = rawData.split('\n')

        var thereIsAnyLogGroup = false
        var newLogGroup = { }
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            if (line.length < 2) { continue }
            if (line.startsWith('Invisible')) {
                newLogGroup.isInvisible = line.split(' ')[1]
            } else if (line.startsWith('StartedbyUser')) {
                newLogGroup.startedByUser = line.split(' ')[1]                
            } else {
                const time = line.split(' ')[0]
                const logData = line.replace(time + ' ', '')

                if (logData == '====== Started ======') {
                    if (thereIsAnyLogGroup) {
                        thereIsAnyLogGroup = false
                        newEvent.groups.unshift(newLogGroup)
                    }
                    newLogGroup = { }
                    thereIsAnyLogGroup = true

                    newLogGroup.startTime = time
                    newLogGroup.endTime = time
                    newLogGroup.logs = []
                    newLogGroup.pings = []
                    newLogGroup.closedByUser = false
                    newLogGroup.running = false
                } else if (logData == '====== Stopped ======') {
                    if (thereIsAnyLogGroup) {
                        newLogGroup.endTime = time
                        thereIsAnyLogGroup = false
                        newEvent.groups.unshift(newLogGroup)
                    }
                } else if (logData.startsWith('Exit by user')) {
                    newLogGroup.logs.push({ time: time, log: logData })
                    newLogGroup.endTime = time
                    newLogGroup.closedByUser = true
                } else if (logData.startsWith('Ping: ')) {
                    const ping = logData.replace('Ping: ', '').replace('ms', '')
                    var pingBaddness = 'none'
                    if (ping < 115) {
                        pingBaddness = 'good'
                    } else if (ping < 125) {
                        pingBaddness = 'fair'
                    } else if (ping < 135) {
                        pingBaddness = 'bad'
                    } else {
                        pingBaddness = 'verybad'
                    }
                    newLogGroup.pings.push({ time: time, ping: ping, quality: pingBaddness })
                    newLogGroup.endTime = time
                } else {
                    newLogGroup.logs.push({ time: time, log: logData })
                    newLogGroup.endTime = time
                }
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

module.exports = { SystemLog, SystemStart, SystemStop, GetLogs }