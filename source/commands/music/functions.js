
function musicGetLengthText(videoLengthSeconds) {
    let videoLengthMinutes = 0
    let videoLengthHours = 0
    for (let l = 0; videoLengthSeconds > 60; l += 1) {
        videoLengthMinutes += 1
        videoLengthSeconds -= 60
    }
    for (let l = 0; videoLengthMinutes > 60; l += 1) {
        videoLengthHours += 1
        videoLengthMinutes -= 60
    }

    let lengthText = '--:--'
    let hours = '' + videoLengthHours
    if (videoLengthHours < 10) {
        hours = '0' + hours
    }
    let minutes = '' + videoLengthMinutes
    if (videoLengthMinutes < 10) {
        minutes = '0' + minutes
    }
    let seconds = '' + videoLengthSeconds
    if (videoLengthSeconds < 10) {
        seconds = '0' + seconds
    }

    if (videoLengthHours === 0) {
        lengthText = minutes + ':' + seconds
    } else {
        lengthText = hours + ':' + minutes + ':' + seconds
    }

    return lengthText
}

module.exports = { musicGetLengthText }