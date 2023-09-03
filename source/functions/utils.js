/**
 * @param {Date | null | undefined} date
 */
function GetTime(date) {
    if (date) {
        return date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
    } else {
        return '--:--:--'
    }
}

/**
 * @param {Date | null | undefined} date
 */
function GetDate(date) {
    if (date) {
        return date.getFullYear() + '. ' + (date.getMonth() + 1).toString().padStart(2, '0') + '. ' + date.getDate().toString().padStart(2, '0') + '. ' + GetTime(date)
    } else {
        return '----. --. --. --:--:--'
    }
}

/**
 * @param {number} bytes
 */
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

/**
 * @param {string} text
 */
function Capitalize(text) {
    var str = text
    if (str.includes(' ') == true) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const arr = str.split(' ')

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }

    return arr.join(' ')
}
/**
 * Converts numbers into units like `1K`, `1M`, `1B` etc.
 * @param {number | string} num
 * @returns {string}
 */
function Abbrev(num) {
    if (!num ) return '0'
    if (typeof num === 'string') num = parseInt(num)
    if (isNaN(num)) return '0'
    
    let result = num.toString()
    let decPlaces = Math.pow(10, 1)
    var abbrev = ["E", "m", "M", "b", "B", "tr", "TR", "qa", "QA", "qi", "QI", "sx", "SX", "sp", "SP"]
    
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3)
        if (size <= num) {
            num = Math.round((num * decPlaces) / size) / decPlaces
            if (num == 1000 && i < abbrev.length - 1) {
                num = 1
                i++
            }
            result += abbrev[i]
            break
        }
    }

    return result
}

/**
 * @param {Date} date
 */
function ToUnix(date) {
    return Math.round(date.getTime() / 1000)
}

/**
 * @param {number} a
 * @param {number} b
 */
function Average(a, b) {
    return Math.round((a + b) / 2)
}

module.exports = {
    GetTime,
    GetDataSize,
    Capitalize,
    GetDate,
    Abbrev,
    ToUnix,
    Average,
}