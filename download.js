console.log("Loading")
const https = require('https')
const fs = require('fs')
const AdmZip = require('adm-zip')

const fileName = "file.zip"
const url = "https://codeload.github.com/BBpezsgo/DiscordBot/zip/main"

const file = fs.createWriteStream(fileName)
console.log("Download")
const request = https.get(url, function(response) {
    var cur = 0;

    response.on('data', function(chunk) {
        cur += chunk.length;
        showProgress(cur);
    })

    response.on('end', function() {
        console.log("Download complete")

        setTimeout(()=> {
            console.log("Install")
            Unzip()
    
            console.log("Finishing up")
            fs.unlinkSync("./" + fileName)

            console.log("Finished")
        }, 1000)
    })

    response.pipe(file)
})

function showProgress(cur) {
    console.clear()
    console.log("Downloading " + (cur / 1048576).toFixed(2) + " MB")
}

function Unzip() {
    try {
        const zip = new AdmZip("./" + fileName)
        zip.extractAllTo("./", true)
    } catch (error) {
        if (fs.readFileSync("./" + fileName) == "404: Not Found") {
            console.log("\033[31mReposity not found.\033[0m\033[1m")
        } else {
            console.log("\033[31m" + error + "\033[0m\033[1m")
        }
    }
}