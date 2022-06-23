const { DatabaseManager } = require('../functions/databaseManager')

/**
 * @param {DatabaseManager} database
 */
function savePollDefaults(database) {
    if (!database.dataPolls.messageIds) {
        database.dataPolls.messageIds = ''
    }
    if (!database.dataPolls.messages) {
        database. dataPolls.messages = {}
    }
}

/**
 * @param {string} messageId
 * @param {string} title
 * @param {string[]} optionTexts
 * @param {string[]} optionIcons
 * @param {DatabaseManager} database
 */
function addNewPoll(messageId, title, optionTexts, optionIcons, database) {
    savePollDefaults(database)

    /**
     * @type {number[]}
     */
    let vals = []
    /**
     * @type {string[]}
     */
    let usrs = []
    for (let v = 0; v < optionTexts.length; v++) {
        vals.push(0)
    }

    database.dataPolls.messages[messageId] = {}
    database.dataPolls.messages[messageId].title = title
    database.dataPolls.messages[messageId].optionTexts = optionTexts
    database.dataPolls.messages[messageId].optionIcons = optionIcons
    database.dataPolls.messages[messageId].optionValues = vals
    database.dataPolls.messages[messageId].userIds = usrs

    database.dataPolls.messageIds += "|" + messageId

    database.SaveDatabase()
}

module.exports = { addNewPoll, savePollDefaults }