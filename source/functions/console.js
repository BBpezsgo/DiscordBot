const { exec } = require('child_process')

/** @param {string} packet @param {(exists: boolean) => void} callback */
const NpmPacketExists = function(packet, callback) {
    exec('npm ls sunclc', (err, stdout, stderr) => {
        if (err) {
            callback(false)
        } else {
            callback(true)
        }
    })
}

const SetTitle = function(title) { 
    exec('title ' + title, (err, stdout, stderr) => {})
}

module.exports = { SetTitle, NpmPacketExists }
