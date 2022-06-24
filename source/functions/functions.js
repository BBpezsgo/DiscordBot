/**@param {Date} date */
function GetTime(date) {
    if (date) {
        return date.getHours() + ':' + AddZeros(date.getMinutes()) + ':' + AddZeros(date.getSeconds())
    } else {
        return '--:--:--'
    }
}

/**@param {Date} date */
function GetDate(date) {
    if (date) {
        return date.getFullYear() + '. ' + AddZeros(date.getMonth() + 1) + '. ' + AddZeros(date.getDate()) + '. ' + GetTime(date)
    } else {
        return '----. --. --. --:--:--'
    }
}

function AddZeros(num) {
    if (num < 10) {
        return '0' + num
    } else {
        return num
    }
}

/**@param {number} bytes */
function GetDataSize(bytes) {
    var txt = "byte"
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

/**@param {string} text */
function Capitalize(text) {
    var str = text
    if (str.includes(' ') == true) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const arr = str.split(" ")

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }

    const str2 = arr.join(" ")
    return str2
}

module.exports = { GetTime, GetDataSize, Capitalize, GetDate }