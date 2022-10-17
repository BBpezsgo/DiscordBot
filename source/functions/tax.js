const { usersWithTax } = require('./enums')
const { DatabaseManager } = require('./databaseManager')
const { FormatError } = require('./formatError')
const { SystemLog } = require('./systemLog')
const fs = require('fs')

/** @param {DatabaseManager} database @param {number} lastDay */
function Taxation(database, lastDay) {
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

    for (let i = 0; i < dayOfYear - lastDay; i++) {
        for (let i = 0; i < usersWithTax.length; i++) {
            const element = usersWithTax[i]
            try {
                const userMoney = database.dataBasic[element].money
                const finalTax = Math.floor(userMoney * 0.001) * 2
                const userMoneyFinal = userMoney - finalTax
                // console.log("Adó:  " + userMoney + " ---1%-->" + finalTax + " ------->" + userMoneyFinal)
                database.dataBasic[element].money = userMoneyFinal
            } catch (error) {
                SystemLog('Tax error: ' + error.message)
                fs.appendFileSync('./node.error.log', FormatError(error) + '\n', { encoding: 'utf-8' })
            }
        }
        // console.log("Mindenki megadózva")
    }
}

module.exports = { Taxation }