var state = 'Loading   '
var stateDetails = ''
const spinner = ['─','\\','|','/']
var spinnerIndex = 0

/**Reprints a line on the console */
const reprint = (text) => {
    process.stdout.clearLine()
    process.stdout.cursorTo(0, 0)
    process.stdout.clearLine()
    process.stdout.write(text)
    process.stdout.write('\n')
}

const timer = setInterval(() => {
    reprint(state + spinner[spinnerIndex] + ' ' + stateDetails)
    spinnerIndex += 1
    if (spinnerIndex >= spinner.length) {
        spinnerIndex = 0
    }
}, 100);

const https = require('https')
const fs = require('fs')
const AdmZip = require('adm-zip')

const fileName = 'file.zip'
const url = 'https://codeload.github.com/BBpezsgo/DiscordBot/zip/main'

const file = fs.createWriteStream(fileName)
state = 'Download  '
const request = https.get(url, function(response) {
    var cur = 0;

    response.on('data', function(chunk) {
        cur += chunk.length;
        showProgress(cur);
    })

    response.on('end', function() {
        state = 'Install   '
        stateDetails = ''

        setTimeout(()=> {
            state = 'Install   '
            Unzip()
    
            stateDetails = 'Finishing up'
            fs.unlinkSync('./' + fileName)

            clearInterval(timer)
            
            reprint('Finished')
        }, 1000)
    })

    response.pipe(file)
})

request.on("error", (err) => {
    clearInterval(timer)
    if (err.message == 'getaddrinfo ENOTFOUND codeload.github.com') {
        reprint('\033[31mNem sikerült letölteni: codeload.github.com nem található\033[0m\033[1m')
    } else {
        reprint('\033[31m' + err.message + '\033[0m\033[1m')
    }
})

function showProgress(cur) {
    stateDetails = 'Downloading ' + (cur / 1048576).toFixed(2) + ' MB'
}

function Unzip() {
    try {
        const zip = new AdmZip('./' + fileName)
        zip.extractAllTo('./', true)
    } catch (error) {
        clearInterval(timer)
        if (fs.readFileSync('./' + fileName) == '404: Not Found') {
            reprint('\033[31mReposity not found.\033[0m\033[1m')
        } else {
            reprint('\033[31m' + error + '\033[0m\033[1m')
        }
    }
}