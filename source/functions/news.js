/**
 * @param {Date} date
 * @returns {string}
 */
 function DateToStringNews(date) {
    let str = ''
    str += date.getFullYear() + '.'
    let monthStr = (date.getMonth() + 1) + '.'
    if (monthStr == '1') {
        monthStr = 'Jan.'
    } else if (monthStr == '2') {
        monthStr = 'Febr.'
    } else if (monthStr == '3') {
        monthStr = 'Márc.'
    } else if (monthStr == '4') {
        monthStr = 'Ápr.'
    } else if (monthStr == '5') {
        monthStr = 'Máj.'
    } else if (monthStr == '6') {
        monthStr = 'Jún.'
    } else if (monthStr == '7') {
        monthStr = 'Júl.'
    } else if (monthStr == '8') {
        monthStr = 'Aug.'
    } else if (monthStr == '9') {
        monthStr = 'Szept.'
    } else if (monthStr == '10') {
        monthStr = 'Okt.'
    } else if (monthStr == '11') {
        monthStr = 'Nov.'
    } else if (monthStr == '12') {
        monthStr = 'Dec.'
    }
    str += ' ' + monthStr
    str += ' ' + date.getDate() + '.'
    str += ' ' + date.getHours() + ':' + date.getMinutes()
    return str
}

/**
 * @param {string} id
 * @returns {string}
 */
function ConvertNewsIdToName(id) {
    if (id == '802864588877856789') {
        return 'Crossout - Bejelentés'
    } else if (id == '802864713323118603') {
        return 'Ingyenes Játékok'
    } else if (id == '813398275305898014') {
        return 'Warzone 2100 - Bejelentés'
    } else if (id == '875340034537062400') {
        return 'Minecraft - Frissítés'
    } else if (id == '726127512521932880') {
        return 'Bejelentés'
    } else {
        return id
    }
}

class NewsMessage {
    /**
     * @param {Discord.MessageEmbed} embed
     * @param {string} NotifyRoleId
     * @param {Discord.Message} message
    */
    constructor(embed, NotifyRoleId, message) {
        this.embed = embed;
        this.NotifyRoleId = NotifyRoleId;
        this.message = message;
    }
}

module.exports = { DateToStringNews, ConvertNewsIdToName, NewsMessage }