// @ts-check

/**
 * @param {string} userID
 * @param {number} ammount
 * @param {import('../functions/databaseManager').DatabaseManager} database
 */
function On(userID, ammount, database) {
    const privateCommand = database.dataBasic[userID].privateCommands

    if (database.dataBackpacks[userID].crates === 0) {
        return {
            content: '> **\\❌ Nincs ládád! \\🧱**',
            ephemeral: privateCommand
        }
    } else {
        let Crates = Math.min(database.dataBackpacks[userID].crates, ammount)

        let getXpS = 0
        let getGiftS = 0
        let getMoney = 0
        for (let i = 0; i < Crates; i++) {

            let replies = ['xp', 'money', 'gift']
            let random = Math.floor(Math.random() * 3)
            let out = replies[random]
            let val = 0

            if (out === 'xp') {
                val = Math.floor(Math.random() * 110) + 100
                getXpS += val
                database.dataBasic[userID].score += val
            }
            if (out === 'money') {
                val = Math.floor(Math.random() * 2000) + 2000
                getMoney += val
                database.dataBasic[userID].money += val
            }
            if (out === 'gift') {
                getGiftS += 1
                database.dataBackpacks[userID].gifts += 1
            }
        }

        database.dataBackpacks[userID].crates = database.dataBackpacks[userID].crates - Crates
        database.SaveDatabase()

        return {
            content: '> ' + Crates + 'x \\🧱 Kaptál:\n' +
                '>     \\🍺 **' + getXpS + '** xpt\n' +
                '>     \\💵 **' + getMoney + '** pénzt\n' +
                '>     \\🎁 **' + getGiftS + '** ajándékot',
            ephemeral: privateCommand
        }

    }
}

module.exports = { On }