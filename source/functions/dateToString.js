/**
 * @param {Date} date
 */
 function DateToString(date) {
    var now = new Date(Date.now())
    if (now.getFullYear() == date.getFullYear()) {
        if (now.getMonth() == date.getMonth()) {
            if (now.getDay() == date.getDay()) {
                if (now.getHours() == date.getHours()) {
                    if (now.getMinutes() == date.getMinutes()) {
                        if (now.getSeconds() == date.getSeconds()) {
                            return "most"
                        } else {
                            return (now.getSeconds() - date.getSeconds()) + " másodperce"
                        }
                    } else {
                        return (now.getMinutes() - date.getMinutes()) + " perce"
                    }
                } else {
                    return (now.getHours() - date.getHours()) + " órája"
                }
            } else {
                return (now.getDay() - date.getDay()) + " napja"
            }
        } else {
            return (now.getMonth() - date.getMonth()) + " hónapja"
        }
    } else {
        return (now.getFullYear() - date.getFullYear()) + " éve"
    }
}

module.exports = { DateToString }