const { usersWithTax } = require('../functions/enums')
const { DatabaseManager } = require('../functions/databaseManager')
const LogError = require('../functions/errorLog').LogError

/** @param {DatabaseManager} database @param {number} lastDay */
function Taxation(database, lastDay) {
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    for (let day = 0; day < dayOfYear - lastDay; day++) {
        for (let i = 0; i < usersWithTax.length; i++) {
            const userID = usersWithTax[i]
            try {
                const currentMoney = database.dataBasic[userID].money
                const taxValue = Math.floor(currentMoney * 0.001) * 2
                database.dataBasic[userID].money = currentMoney - taxValue
            } catch (error) {
                LogError(error)
            }
        }
    }
}

module.exports = { Taxation }