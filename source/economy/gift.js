const Discord = require('discord.js')
const { DatabaseManager } = require('../functions/databaseManager')

/**
 * @param {string} userID
 * @param {DatabaseManager} database
 * @returns {{ammount: number, type: 'MONEY' | 'XP'}?}
 */
function OpenGift(userID, database) {
    if (database.dataBackpacks[userID].getGift <= 0) return null
    
    const typeResult = ['xp', 'money'][Math.floor(Math.random() * 2)]
    const result = { }

    if (typeResult === 'xp') {
        const ammount = Math.floor(Math.random() * 530) + 210
        result.ammount = ammount
        result.type = 'XP'
        database.dataBasic[e.user.id].score += ammount
        database.dataBackpacks[userID].getGift -= 1
    } else if (typeResult === 'money') {
        const ammount = Math.floor(Math.random() * 2300) + 1000
        result.ammount = ammount
        result.type = 'MONEY'
        database.dataBasic[e.user.id].money += ammount
        database.dataBackpacks[userID].getGift -= 1
    }

    database.SaveDatabase()

    return result
}

/**
 * @param {Discord.ButtonInteraction<Discord.CacheType>} e
 * @param {DatabaseManager} database
 */
function OnButtonClick(e, database) {
    const privateCommand = database.dataBasic[e.user.id].privateCommands

    if (e.component.customId === 'openGift') {
        const result = OpenGift(e.user.id, database)

        if (result === null) {
            e.reply({ content: '> \\🎀 Nincs ajándékod amit kinyithatnál!', ephemeral: true })
            e.message.edit(commandStore(e.user, privateCommand))
        } else {
            switch (result.type) {
                case 'MONEY':
                    {
                        e.reply({ content: '> \\🎀 Kaptál **\\💵' + result.ammount + '** pénzt', ephemeral: true })
                        e.message.edit(commandStore(e.user, privateCommand))
                        break
                    }
                case 'XP':
                    {
                        e.reply({ content: '> \\🎀 Kaptál **\\🍺 ' + result.ammount + '** xp-t', ephemeral: true })
                        e.message.edit(commandStore(e.user, privateCommand))
                        break
                    }
                default:
                    break
            }
        }
        return true
    }

    if (e.component.customId === 'sendGift') {
        e.reply({ content: '> **\\❔ Használd a **`/gift <felhasználó>`** parancsot egy személy megajándékozásához, vagy jobb klikk a felhasználóra > Alkalmazások > Megajándékozás**', ephemeral: true })
        return true
    }

    return false
}

/**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {DatabaseManager} database
*/
function OnCommand(command, database) {
    try {
        const giftableMember = command.options.getUser('user')
        if (database.dataBackpacks[command.user.id].gifts > 0) {
            if (giftableMember.id === command.user.id) {
                command.reply({ content: '> **\\❌ Nem ajándékozhatod meg magad**', ephemeral: true })
            } else {
                if (database.dataBackpacks[giftableMember.id] != undefined && giftableMember.id != selfId) {
                    database.dataBackpacks[giftableMember.id].getGift += 1
                    database.dataBackpacks[command.user.id].gifts -= 1
                    command.reply({ content: '> \\✔️ **' + giftableMember.username.toString() + '** megajándékozva', ephemeral: true })
                    giftableMember.send('> **\\✨ ' + command.user.username + ' megajándékozott! \\🎆**')
                    database.SaveDatabase()
                } else {
                    command.reply({ content: '> **\\❌ Úgy néz ki hogy nincs ' + giftableMember.displayName + ' nevű felhasználó az adatbázisban**', ephemeral: true })
                }
            }
        } else {
            if (giftableMember.id === command.user.id) {
                command.reply({ content: '> **\\❌ Nem ajándékozhatod meg magad. Sőt! Nincs is ajándékod**', ephemeral: true })
            } else {
                command.reply({ content: '> **\\❌ Nincs ajándékod, amit odaadhatnál**', ephemeral: true })
            }
        }
    } catch (error) {
        command.reply({ content: '> **\\❗ ' + error.toString() + '**', ephemeral: true })
    }
}

module.exports = { OnButtonClick, OnCommand, OpenGift }