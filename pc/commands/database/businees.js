const { date } = require('assert-plus')
const Discord = require('discord.js')
const fs = require('fs')
let scores = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'))
let businesses = JSON.parse(fs.readFileSync('./database/businesses.json', 'utf-8'))

const now = new Date()
const start = new Date(now.getFullYear(), 0, 0)
const diff = now - start
const oneDay = 1000 * 60 * 60 * 24
const dayOfYear = Math.floor(diff / oneDay)

function dayName(dayOfWeek) {
    while (dayOfWeek > 6) {
        dayOfWeek -= 7
    }
    let dayName = '???'
    let days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
    dayName = days[dayOfWeek];
    return dayName
}
/**
 * @param {Date} date 
 * @returns {string}
 */
function toDateString(date) {
    return date.getFullYear().toString() + ':' + date.getMonth().toString() + ':' + date.getDate().toString()
}
function resetScores() {
    fs.writeFile('scores.json', JSON.stringify(scores), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
}
function resetBusiness() {
    fs.writeFile('./database/businesses.json', JSON.stringify(businesses), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
}
/**
* @param {Discord.User} sender
*/
function businessAddToMemory(sender) {
    if (!businesses[sender.id]) {
        businesses[sender.id] = {};
    };
    if (!businesses[sender.id].username) {
        businesses[sender.id].username = sender.username;
    };
    if (!businesses[sender.id].businessIndex) {
        businesses[sender.id].businessIndex = 0;
    };

    resetBusiness()
}
/**
* @param {Discord.User} sender
*/
function businessAddToMemoryDetails(sender) {
    if (!businesses[sender.id]) {
        businesses[sender.id] = {};
    };
    if (!businesses[sender.id].username) {
        businesses[sender.id].username = sender.username;
    };
    if (!businesses[sender.id].businessIndex) {
        businesses[sender.id].businessIndex = 0;
    };
    if (!businesses[sender.id].businessName) {
        businesses[sender.id].businessName = "Névtelen biznisz";
    };
    if (!businesses[sender.id].businessLevel) {
        businesses[sender.id].businessLevel = 0;
    };
    if (!businesses[sender.id].businessUses) {
        businesses[sender.id].businessUses = {};
    };
    if (!businesses[sender.id].businessUses.date) {
        businesses[sender.id].businessUses.date = toDateString(new Date());
    };
    if (!businesses[sender.id].businessUses.day) {
        businesses[sender.id].businessUses.day = dayOfYear;
    };

    resetBusiness()
}
/**
 * @returns {string}
 * @param {Discord.User} sender
 * @param {number} type
 */
function calculateAddMoney(sender, type) {
    const aaa = businesses[sender.id].businessUses.date.toString().split(':')
    const lastDate = new Date(aaa[0], aaa[1], aaa[2])
    const nowDate = new Date()
    const difference = nowDate - lastDate
    const differenceInDays = Math.floor(difference / oneDay)

    let returnTestString = ''
    returnTestString += 'last| ' + toDateString(lastDate) + '\n'
    returnTestString += '> now | ' + toDateString(nowDate) + '\n'
    returnTestString += '> diff| ' + differenceInDays.toString() + '\n'

    /**
     * @description 0 = Vasárnap; 6 = Szombat
     */
    let daysToCalculate = [0, 0, 0, 0, 0, 0, 0]

    for (let i = 1; i < (differenceInDays + 1); i++) {
        const date2 = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - i)
        returnTestString += '\n> ' + i + '|  ' + dayName(date2.getDay()) + '[' + date2.getDay() + ']  ' + toDateString(date2)
        daysToCalculate[date2.getDay()] += 1
    }
    returnTestString += '\n\n> | ' + daysToCalculate

    const differenceInWeeks = Math.min(daysToCalculate[0], daysToCalculate[1])

    returnTestString += '\n\n> | ' + differenceInWeeks

    let finalNumber = 0

    if (type === 1) {
        finalNumber = daysToCalculate[0]
    } else if (type === 2) {
        finalNumber = daysToCalculate[1] + daysToCalculate[2] + daysToCalculate[3] + daysToCalculate[4] + daysToCalculate[5] + daysToCalculate[6]
    } else if (type === 3) {
        finalNumber = daysToCalculate[1] + daysToCalculate[2] + daysToCalculate[3] + daysToCalculate[4] + daysToCalculate[5]
    } else if (type === 4) {
        finalNumber = 1
    }

    returnTestString += '\n\n\n> | ' + finalNumber

    return finalNumber
}

/**
* @param {Discord.Channel} channel
* @param {Discord.User} sender
* @param {boolean} isPrivate
*/
module.exports = (channel, sender, isPrivate) => {

    businessAddToMemory(sender)

    var businessIndex = businesses[sender.id].businessIndex

    var money = scores[sender.id].money;

    if (businesses[sender.id].businessIndex > 0) {
        var moneyMakerName = businesses[sender.id].businessName;
        var moneyMakerLevel = businesses[sender.id].businessLevel;

        var moneyMakerImage = ''
        var moneyMakerLevelText = ''

        var uprageCost = 0

        let addMoney = calculateAddMoney(sender, businesses[sender.id].businessIndex)
        if (businesses[sender.id].businessIndex === 1) {
            addMoney *= 1335 * businesses[sender.id].businessLevel
        } else if (businesses[sender.id].businessIndex === 2) {
            addMoney *= 181 * businesses[sender.id].businessLevel
        } else if (businesses[sender.id].businessIndex === 3) {
            addMoney *= 189 * businesses[sender.id].businessLevel
        } else if (businesses[sender.id].businessIndex === 4) {

        }

        if (businesses[sender.id].businessIndex === 1) {
            if (moneyMakerLevel === 1) {
                moneyMakerImage = '\\🚏'
                moneyMakerLevelText = 'Városi buszmegálló'
                uprageCost = 10000
            } else if (moneyMakerLevel === 2) {
                moneyMakerImage = '\\🚉'
                moneyMakerLevelText = 'Vasútállomás'
                uprageCost = 20000
            } else if (moneyMakerLevel === 3) {
                moneyMakerImage = '\\⚓'
                moneyMakerLevelText = 'Nemzetközi kikötő'
                uprageCost = 40000
            } else if (moneyMakerLevel === 4) {
                moneyMakerImage = '\\🛫'
                moneyMakerLevelText = 'Globális repülőtér'
            }
        } else if (businesses[sender.id].businessIndex === 2) {
            if (moneyMakerLevel === 1) {
                moneyMakerImage = '\\🏪'
                moneyMakerLevelText = 'Vegyesbolt'
                uprageCost = 40000
            } else if (moneyMakerLevel === 2) {
                moneyMakerImage = '\\🏬'
                moneyMakerLevelText = 'Bevásárló központ'
            }
        } else if (businesses[sender.id].businessIndex === 3) {
            if (moneyMakerLevel === 1) {
                moneyMakerImage = '\\🏗️'
                moneyMakerLevelText = 'Építőanyag gyár'
                uprageCost = 50000
            } else if (moneyMakerLevel === 2) {
                moneyMakerImage = '\\🏭'
                moneyMakerLevelText = 'Autógyár'
            }
        } else if (businesses[sender.id].businessIndex === 4) {
            if (moneyMakerLevel === 1) {
                moneyMakerImage = '\\🏤'
                moneyMakerLevelText = 'Városszintű irodák'
                uprageCost = 35000
            } else if (moneyMakerLevel === 2) {
                moneyMakerImage = '\\🏣'
                moneyMakerLevelText = 'Nagy irodaépület'
                uprageCost = 55000
            } else if (moneyMakerLevel === 3) {
                moneyMakerImage = '\\🏢'
                moneyMakerLevelText = 'Országszintű irodaépület'
            }
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle(moneyMakerName)
            .setDescription(moneyMakerImage + ' ' + moneyMakerLevelText + ' (lvl' + (moneyMakerLevel - 1) + ')')
            //.addField('Átnevezés', '`.pms name [új név]`')
            
            if (isPrivate === true) {
                embed.addField(
                    'Megszüntetés: 💥', 'Ez nem visszafordítható folyamat! Ha megszünteted a bizniszedet, minden elveszik, és nem kapsz vissza semmit!\n' + 
                    '\\⛔ Csak szerveren érhető el')
            } else {
                embed.addField('Megszüntetés: 💥', 'Ez nem visszafordítható folyamat! Ha megszünteted a bizniszedet, minden elveszik, és nem kapsz vissza semmit!')
            }
        if (uprageCost > 0 && money >= uprageCost) {
            if (isPrivate === true) {
                embed.addField('Fejlesztés: ⬆️',
                    '\\💵' + uprageCost + '\n' + 
                    '\\⛔ Csak szerveren érhető el')
            } else {
                embed.addField('Fejlesztés: ⬆️', '\\💵' + uprageCost)
            }
        }
        if (addMoney > 0) {
                const aaaaaaaaaaaaaa = businesses[sender.id].businessUses.date.toString().split(':')
                const lastDate = new Date(aaaaaaaaaaaaaa[0], aaaaaaaaaaaaaa[1], aaaaaaaaaaaaaa[2])
            if (isPrivate === true) {
                embed.addField('Beszedés: 💰',
                    'Utoljára ekkor szedted be: ' + lastDate.getFullYear() + '.' + (lastDate.getMonth() + 1) + '.' + lastDate.getDate() + '\n' +
                    'Kb ennyit tudsz beszedni: \\💵' + addMoney + '\n' + 
                    '\\⛔ Csak szerveren érhető el')
            } else {
                embed.addField('Beszedés: 💰',
                    'Utoljára ekkor szedted be: ' + lastDate.getFullYear() + '.' + (lastDate.getMonth() + 1) + '.' + lastDate.getDate() + '\n' +
                    'Kb ennyit tudsz beszedni: \\💵' + addMoney)
            }
        }
        channel.send({ embed }).then(embedMessage => {
            if (isPrivate === true) return;
            if (uprageCost > 0) { if (money >= uprageCost) { embedMessage.react('⬆️'); }; }
            if (addMoney > 0) { embedMessage.react('💰'); }
            embedMessage.react('💥')
            embedMessage.awaitReactions((reaction, user) => user.id == sender.id && (reaction.emoji.name == '⬆️' || reaction.emoji.name == '💰' || reaction.emoji.name == '💥'),
                { max: 1, time: 60000 }).then(collected => {
                    if (collected.first().emoji.name == '⬆️') {
                        if (uprageCost > 0) {
                            if (money >= uprageCost) {
                                businesses[sender.id].businessLevel += 1
                                scores[sender.id].money -= uprageCost
                                channel.send('> \\⬆️ **Fejlesztve!**')
                            } else {
                                channel.send('> \\❌ **Nincs elég pénzed!**')
                            }
                        } else {
                            channel.send('> \\⛔ **Nem lehet tovább fejleszteni**')
                        }
                    } else if (collected.first().emoji.name == '💰') {
                        if (addMoney > 0) {
                            try {
                                addMoney += Math.floor(Math.random() * 10) - 5

                                scores[sender.id].money += addMoney
                                businesses[sender.id].businessUses.day = dayOfYear;
                                businesses[sender.id].businessUses.date = toDateString(new Date());

                                channel.send('> \\💰 Beszedtél \\💵**' + addMoney + '** pénzt')
                            } catch (error) {
                                channel.send('> \\❌ ' + error.toString())
                            }
                        } else {
                            channel.send('> \\❌ **Még nem termelt semmit**')
                        }
                    } else if (collected.first().emoji.name == '💥') {
                        businesses[sender.id] = {}
                        businesses[sender.id].username = sender.username
                        businesses[sender.id].businessIndex = 0
                        channel.send('> \\💥 **A biznisz megszüntetve**')
                    }
                    resetScores()
                    resetBusiness()
                    embedMessage.reactions.removeAll()
                }).catch(() => {
                    embedMessage.reactions.removeAll()
                })
        })
    } else {
        if (isPrivate === true) {
            message.channel.send('> \\⛔ **Nincs bizniszed. Hogy vegyél egyet, használd a `.pms` parancsot egy szerveren.**')
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(sender.username, sender.displayAvatarURL())
                .setTitle('Bizniszek')
                .addField('Utasszállító szolgálat',
                    '> **Ikon:** 🚗\n' +
                    '> **Ár:** 21300 \\💵\n' +
                    '> **Haszonszerzés:** Minden héten egyszer termel\n' +
                    '> **Maximum szint:** 4\n' +
                    '> **Egyéb:** ' +
                    'Járműveket venni kell hozzá. Minnél több van belőle, annál többet termel. Maximum 5 jármű lehet!')
                .addField('Kereskedelmi szaküzlet',
                    '> **Ikon:** 📠\n' +
                    '> **Ár:** 7100 \\💵\n' +
                    '> **Haszonszerzés:** Minden nap, kivéve Vasárnap termel\n' +
                    '> **Maximum szint:** 2')
                .addField('Gyár',
                    '> **Ikon:** ⚙️\n' +
                    '> **Ár:** 11200 \\💵\n' +
                    '> **Haszonszerzés:** Minden nap, kivéve hétvégén termel\n' +
                    '> **Maximum szint:** 2\n' +
                    '> **Egyéb:** ' +
                    'Alkalmazottakat felvenni kell hozzá, minnél több van belőle, annál többet termel. Maximum 20 alkalmazott lehet!')
                .addField('Pénzügyi szervezet [Nem elérhető]',
                    '> **Ikon:** 💳\n' +
                    '> **Ár:** 36800 \\💵\n' +
                    '> **Haszonszerzés:** Ha megoldasz egy matematikai műveletet, azonnal termel hasznot. Naponta maximum 3-szor lehet használni!\n' +
                    '> **Maximum szint:** 3')
            channel.send({ embed }).then(embedMessage => {
                if (money >= 21300) { embedMessage.react('🚗'); }
                if (money >= 7100) { embedMessage.react('📠'); }
                if (money >= 11200) { embedMessage.react('⚙️'); }
                //if (money >= 36800) { embedMessage.react('💳'); }

                embedMessage.awaitReactions((reaction, user) => user.id == sender.id && (reaction.emoji.name == '🚗' || reaction.emoji.name == '📠' || reaction.emoji.name == '⚙️' || reaction.emoji.name == '💳'),
                    { max: 1, time: 60000 }).then(collected => {
                        if (collected.first().emoji.name == '🚗') {
                            if (money >= 6040) {
                                businessAddToMemoryDetails(sender)
                                scores[sender.id].money -= 6040
                                businesses[sender.id].businessIndex = 1
                                businesses[sender.id].businessLevel = 1
                                businesses[sender.id].businessName = sender.username + ' utasszállító szolgálata'
                                channel.send('> \\✔️ **Sikeresen megvásároltad: Utasszállító szolgálat**')
                            } else {
                                channel.send('> \\❌ **Nincs elég pénzed!**')
                            }
                        } else if (collected.first().emoji.name == '📠') {
                            if (money >= 7100) {
                                businessAddToMemoryDetails(sender)
                                scores[sender.id].money -= 7100
                                businesses[sender.id].businessIndex = 2
                                businesses[sender.id].businessLevel = 1
                                businesses[sender.id].businessName = sender.username + ' kereskedelmi szaküzlete'
                                channel.send('> \\✔️ **Sikeresen megvásároltad: Kereskedelmi szaküzlet**')
                            } else {
                                channel.send('> \\❌ **Nincs elég pénzed!**')
                            }
                        } else if (collected.first().emoji.name == '⚙️') {
                            if (money >= 11200) {
                                businessAddToMemoryDetails(sender)
                                scores[sender.id].money -= 11200
                                businesses[sender.id].businessIndex = 3
                                businesses[sender.id].businessLevel = 1
                                businesses[sender.id].businessName = sender.username + ' gyára'
                                channel.send('> \\✔️ **Sikeresen megvásároltad: Gyár**')
                            } else {
                                channel.send('> \\❌ **Nincs elég pénzed!**')
                            }
                        } else if (collected.first().emoji.name == '💳') {
                            /*if (money >= 36800) {
                                businessAddToMemoryDetails(sender)
                                scores[sender.id].money -= 36800
                                businesses[sender.id].businessIndex = 4
                                businesses[sender.id].businessLevel = 1
                                businesses[sender.id].businessName = sender.username + ' pénzügyi szervezete'
                                channel.send('> \\✔️ **Sikeresen megvásároltad!**')
                            } else {
                                channel.send('> \\❌ **Nincs elég pénzed!**')
                            }*/
                            channel.send('> \\❌ **Nem elérhető**')
                        }
                        embedMessage.reactions.removeAll()
                    }).catch(() => {
                        embedMessage.reactions.removeAll()
                    })
            });
        }
    }

    resetScores()
    resetBusiness()
}