const Discord = require('discord.js')
const fs = require('fs')
const GetUserColor = require('../../functions/userColor')
const { DatabaseManager } = require('../../functions/databaseManager')

let dataBackpacks = JSON.parse(fs.readFileSync('./database/backpacks.json', 'utf-8'))
let dataBasic = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'))
let dataStickers = JSON.parse(fs.readFileSync('./database/stickers.json', 'utf-8'))
let dataBot = JSON.parse(fs.readFileSync('./database/bot.json', 'utf-8'))

function saveDatabase() {
    fs.writeFile('./database/backpacks.json', JSON.stringify(dataBackpacks), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
    fs.writeFile('./database/basic.json', JSON.stringify(dataBasic), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
    fs.writeFile('./database/stickers.json', JSON.stringify(dataStickers), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
}

/**
* @param {Discord.Message} message
* @param {Discord.User} sender
* @param {boolean} isPrivate
* @param {DatabaseManager} database
*/
module.exports = (message, sender, isPrivate, database) => {
    return;
    var currentDay = new Date().getDay()
    var dayCrates = dataBot.day - dataBasic[sender.id].day
    var crates = dataBackpacks[sender.id].crates
    var gifts = dataBackpacks[sender.id].gifts
    var tickets = dataBackpacks[sender.id].tickets
    var getGifts = dataBackpacks[sender.id].getGift
    var smallLuckyCard = dataBackpacks[sender.id].luckyCards.small
    var mediumLuckyCard = dataBackpacks[sender.id].luckyCards.medium
    var largeLuckyCard = dataBackpacks[sender.id].luckyCards.large
    var money = dataBasic[sender.id].money

    const embed = new Discord.MessageEmbed()
        .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
        .setTitle('Hátizasák')
        .addField('Pénz', '\\💵 ' + abbrev(money), false)
        .addField('Alap cuccok',
            '> \\🧱 ' + crates + ' láda\n' +
            '> \\🎁 ' + gifts + ' ajándék\n' +
            '> \\🎟️ ' + tickets + ' kupon\n' +
            '> \\🧰 ' + dayCrates + ' heti láda'
            , false)
        .addField('Sorsjegyek', '> \\💶 ' + smallLuckyCard + ' Black Jack\n> \\💷 ' + mediumLuckyCard + ' Buksza\n> \\💴 ' + largeLuckyCard + ' Fáraók Kincse', false)
    if (isPrivate === true) {
        embed.setFooter({ text: 'Ha használni szeretnéd az egyik cuccodat, használd a /backpack parancsot egy szerveren!' })
    } else {
        embed.setFooter({ text: 'Ha használni szeretnéd az egyik cuccodat, kattints az ikonjára!' })
    }
    embed.setColor(GetUserColor(dataBasic[sender.id].color))
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/briefcase_1f4bc.png')
    if (getGifts > 0) {
        if (isPrivate === true) {
            if (getGifts = 1) {
                embed.addField('Van egy ajándékod, ami kicsomagolásra vár!', 'Kattints a 🎀 ikionra, a kicsomagoláshoz')
            } else {
                embed.addField('Van ' + getGifts + ' ajándékod, ami kicsomagolásra vár!', 'Kattints a 🎀 ikionra, a kicsomagoláshoz')
            }
        } else {
            if (getGifts = 1) {
                embed.addField('Van egy ajándékod, ami kicsomagolásra vár!', 'Hogy kicsomagolhasd, használd a `/backpack` parancsot egy szerveren.')
            } else {
                embed.addField('Van ' + getGifts + ' ajándékod, ami kicsomagolásra vár!', 'Hogy kicsomagolhasd, használd a `/backpack` parancsot egy szerveren.')
            }
        }
    }

    message.channel.send({ embeds: [embed] }).then(embedMessage => {
        if (isPrivate === true) return;
        if (crates > 0) { embedMessage.react('🧱') }
        if (gifts > 0) { embedMessage.react('🎁') }
        if (getGifts > 0) { embedMessage.react('🎀') }
        if (smallLuckyCard > 0) { embedMessage.react('💶') }
        if (mediumLuckyCard > 0) { embedMessage.react('💷') }
        if (largeLuckyCard > 0) { embedMessage.react('💴') }
        if (dayCrates > 0) { embedMessage.react('🧰') }

        const filter = (reaction, user) => {
            return ['🧱', '🎁', '🎀', '💶', '💷', '💴', '🧰'].includes(reaction.emoji.name) && user.id == sender.id
        }

        embedMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected => {
            if (collected.first().emoji.name == '🧱') {
                dataBackpacks[sender.id].crates -= 1
                { //Láda kinyitása
                    let replies = ['xp', 'money', 'gift']
                    let random = Math.floor(Math.random() * 3)
                    let out = replies[random]
                    let val = 0
                    let txt = ''

                    if (out === 'xp') {
                        val = Math.floor(Math.random() * 110) + 10
                        txt = '**\\🍺 ' + val + '** xp-t'
                        dataBasic[sender.id].score += val
                    }
                    if (out === 'money') {
                        val = Math.floor(Math.random() * 2000) + 3000
                        txt = '**\\💵' + val + '** pénzt'
                        dataBasic[sender.id].money += val
                    }
                    if (out === 'gift') {
                        txt = '**\\🎁 1** ajándékot'
                        dataBackpacks[sender.id].gifts += 1
                    }

                    message.channel.send('> \\🧱 Kaptál:  ' + txt)
                }
            } else if (collected.first().emoji.name == '🎁') {
                message.channel.send('> **\\❔ Használd a **`/gift @Felhasználó`** parancsot, egy személy megajándékozásához!**')
            } else if (collected.first().emoji.name == '🎀') {
                dataBackpacks[sender.id].getGift -= 1
                { //Ajándék kinyitása
                    let replies = ['xp', 'money']
                    let random = Math.floor(Math.random() * 2)
                    let out = replies[random]
                    let val = 0
                    let txt = ''

                    if (out === 'xp') {
                        val = Math.floor(Math.random() * 530) + 210
                        txt = '**\\🍺 ' + val + '** xp-t'
                        dataBasic[sender.id].score += val
                    }
                    if (out === 'money') {
                        val = Math.floor(Math.random() * 2300) + 1000
                        txt = '**\\💵' + val + '** pénzt'
                        dataBasic[sender.id].money += val
                    }

                    message.channel.send('> \\🎀 Kaptál:  ' + txt + ' pénzt')
                }
            } else if (collected.first().emoji.name == '💶') {
                dataBackpacks[sender.id].luckyCards.small -= 1
                let val = 0

                var nyeroszam = Math.floor(Math.random() * 2)
                if (nyeroszam === 1) {
                    val = Math.floor(Math.random() * 1001) + 1500
                    dataBasic[sender.id].money += val
                }

                if (val === 0) {
                    message.channel.send('> \\💶 Kaptál:  **semmit**')
                } else {
                    message.channel.send('> \\💶 Kaptál:  **\\💵' + val + '** pénzt')
                }
            } else if (collected.first().emoji.name == '💷') {
                dataBackpacks[sender.id].luckyCards.medium -= 1
                let val = 0

                var nyeroszam = Math.floor(Math.random() * 4)
                if (nyeroszam === 1) {
                    val = Math.floor(Math.random() * 3001) + 3000
                    dataBasic[sender.id].money += val
                }

                if (val === 0) {
                    message.channel.send('> \\💷 Kaptál:  **semmit**')
                } else {
                    message.channel.send('> \\💷 Kaptál:  **\\💵' + val + '** pénzt')
                }
            } else if (collected.first().emoji.name == '💴') {
                dataBackpacks[sender.id].luckyCards.large -= 1
                let val = 0

                var nyeroszam = Math.floor(Math.random() * 9)
                if (nyeroszam === 1) {
                    val = Math.floor(Math.random() * 5001) + 6500
                    dataBasic[sender.id].money += val
                }

                if (val === 0) {
                    message.channel.send('> \\💴 Kaptál:  **semmit**')
                } else {
                    message.channel.send('> \\💴 Kaptál:  **\\💵' + val + '** pénzt')
                }

            } else if (collected.first().emoji.name == '🧰') {
                commandNapi(message, sender)
            }
            embedMessage.reactions.removeAll()
            saveDatabase()
        }).catch(() => {
            embedMessage.reactions.removeAll()
        })
    })
}