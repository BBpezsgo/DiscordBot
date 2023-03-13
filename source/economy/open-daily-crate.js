// @ts-check

/**
 * @param {string} userID
 * @param {number} ammount
 * @param {import('../functions/databaseManager').DatabaseManager} database
 * @param {import('./economy').Economy} economy
 */
function On(userID, ammount, database, economy) {
    const privateCommand = database.dataBasic[userID].privateCommands

    if (Math.floor((database.dataBot.day - database.dataBasic[userID].day) / 7) <= 0) {
        return { content: '> **\\❌ Nincs heti ládád! \\🧰**', ephemeral: privateCommand }
    } else {
        var dayCrateCountRaw = (database.dataBot.day - database.dataBasic[userID].day) / 7
        let dayCrates = Math.min(dayCrateCountRaw, ammount)

        let getXpS = 0
        let getChestS = 0
        let getMoney = 0
        let getTicket = 0
        for (let i = 0; i < Math.floor(dayCrates); i++) {
            const rewald = economy.OpenDayCrate(userID)
            const rewaldIndex = rewald.split('|')[0]
            const rewaldValue = parseInt(rewald.split('|')[1])

            if (rewaldIndex === '2') {
                getXpS += rewaldValue
            } else if (rewaldIndex === '3') {
                getMoney += rewaldValue
            } else if (rewaldIndex === '1') {
                getChestS += 1
            } else if (rewaldIndex === '0') {
                getTicket += 1
            }
        }

        database.dataBasic[userID].day = database.dataBasic[userID].day + (Math.floor(dayCrates) * 7)
        database.SaveDatabase()

        return {
            content: '> ' + Math.floor(dayCrates) + 'x \\🧰 Kaptál:\n' +
                '>     \\💵 **' + getMoney + '** pénzt\n' +
                '>     \\🍺 **' + getXpS + '** xpt\n' +
                '>     \\🧱 **' + getChestS + '** ládát\n' +
                '>     \\🎟️ **' + getTicket + '** kupont',
            ephemeral: privateCommand
        }
    }
}

module.exports = { On }