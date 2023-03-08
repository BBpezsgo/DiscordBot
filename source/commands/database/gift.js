const Discord = require('discord.js')
const { DatabaseManager } = require('../../functions/databaseManager')

/**
 * @param {Discord.ButtonInteraction<Discord.CacheType>} e
 * @param {DatabaseManager} database
 */
function OnButtonClick(e, database) {
    const privateCommand = database.dataBasic[e.user.id].privateCommands

    if (e.component.customId === 'openGift') {
        database.dataBackpacks[e.user.id].getGift -= 1
        var replies = ['xp', 'money']
        var random = Math.floor(Math.random() * 2)
        var out = replies[random]
        var val = 0
        var txt = ''

        if (out === 'xp') {
            val = Math.floor(Math.random() * 530) + 210
            txt = '**\\🍺 ' + val + '** xp-t'
            database.dataBasic[e.user.id].score += val
        }
        if (out === 'money') {
            val = Math.floor(Math.random() * 2300) + 1000
            txt = '**\\💵' + val + '** pénzt'
            database.dataBasic[e.user.id].money += val
        }

        e.reply({ content: '> \\🎀 Kaptál ' + txt, ephemeral: true })
        e.message.edit(commandStore(e.user, privateCommand))

        database.SaveDatabase()
        return true
    }

    if (e.component.customId === 'sendGift') {
        e.reply({ content: '> **\\❔ Használd a **`/gift <felhasználó>`** parancsot egy személy megajándékozásához, vagy jobb klikk a felhasználóra > Alkalmazások > Megajándékozás**', ephemeral: true })
        e.message.edit(commandStore(e.user, privateCommand))

        database.SaveDatabase()
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
        command.reply({ content: '> **\\❌ ' + error.toString() + '**', ephemeral: true })
    }
}

module.exports = { OnButtonClick, OnCommand }