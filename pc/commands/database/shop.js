const Discord = require('discord.js')
const fs = require('fs')

let dataBackpacks = JSON.parse(fs.readFileSync('./database/backpacks.json', 'utf-8'))
let dataBasic = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'))
let dataStickers = JSON.parse(fs.readFileSync('./database/stickers.json', 'utf-8'))

const ColorRoles = {
	red: "850016210422464534",
	yellow: "850016458544250891",
	blue: "850016589155401758",
	orange: "850016531848888340",
	green: "850016722039078912",
	purple: "850016668352643072",
	invisible: "850016786186371122"
}

async function saveDatabase(channel) {
    try {
        fs.writeFile('./database/backpacks.json', await JSON.stringify(dataBackpacks), (err) => { if (err) { channel.send('> ' + err.message) }; });
        fs.writeFile('./database/basic.json', await JSON.stringify(dataBasic), (err) => { if (err) { channel.send('> ' + err.message) }; });
        fs.writeFile('./database/stickers.json', await JSON.stringify(dataStickers), (err) => { if (err) { channel.send('> ' + err.message) }; });
    } catch (error) {
        channel.send('> ' + error.message);
    }
}

function sendFinishMessage(channel, finished) {
    if (finished === true) {
        channel.send('> \\✔️ **Köszönjük vásárlását!**')
    } else {
        channel.send('> \\❌ **Nincs elég pénzed!**')
    }
}
function sendLuckyMessage(channel, finished) {
    if (finished === true) {
        channel.send('> \\✔️ **Sok szerencsét!**')
    } else {
        channel.send('> \\❌ **Nincs elég pénzed!**')
    }
}
function sendColorMessage(channel, finished) {
    if (finished === true) {
        channel.send('> \\✔️ **A hátizsákod színe megváltozott!**')
    } else {
        channel.send('> \\❌ **Nincs elég pénzed!**')
    }
}
function abbrev(num) {
    if (!num || isNaN(num)) return "0";
    if (typeof num === "string") num = parseInt(num);
    let decPlaces = Math.pow(10, 1);
    var abbrev = ["E", "m", "M", "b", "B", "tr", "TR", "qa", "QA", "qi", "QI", "sx", "SX", "sp", "SP"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= num) {
            num = Math.round((num * decPlaces) / size) / decPlaces;
            if (num == 1000 && i < abbrev.length - 1) {
                num = 1;
                i++;
            }
            num += abbrev[i];
            break;
        }
    }
    return num;
}
/**
 * @param {Discord.GuildMember} member 
 */
function removeAllColorRoles(member) {
    member.roles.remove(member.guild.roles.cache.get(ColorRoles.blue))
    member.roles.remove(member.guild.roles.cache.get(ColorRoles.green))
    member.roles.remove(member.guild.roles.cache.get(ColorRoles.invisible))
    member.roles.remove(member.guild.roles.cache.get(ColorRoles.orange))
    member.roles.remove(member.guild.roles.cache.get(ColorRoles.purple))
    member.roles.remove(member.guild.roles.cache.get(ColorRoles.red))
    member.roles.remove(member.guild.roles.cache.get(ColorRoles.yellow))
}

 /**
 * @param {Discord.User} sender
 * @param {number} menuIndex 0: Main menu | 1: Basic | 2: Lucky cards | 3: Backpack colors | -1: None
 * @returns {Discord.MessageEmbed}
 */
function getEmbedMessage(sender, menuIndex) {
    if (menuIndex === 0) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(dataBasic[sender.id].money) + '**', true)
            .addField('Menük: ',
                '> \\🛒 Alap dolgok\n' +
                '> \\🍀 Sorsjegyek\n' +
                '> \\🎨 Profil testreszabása')
            .setFooter('Bezárás: ❌')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')

        return embed
    } else if (menuIndex === 1) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(dataBasic[sender.id].money) + '**', true)
            .addField('Alap dolgok:',
                '> \\🧱 Láda   [\\💵 2099] [' + dataBackpacks[sender.id].crates + ' db]\n' +
                '> \\🎁 Ajándék   [\\💵 3999] [' + dataBackpacks[sender.id].gifts + ' db]\n' +
                '> \\🎟️ Kupon   [\\💵 8999] [' + dataBackpacks[sender.id].tickets + ' db]\n' +
                '> \\🧻 WC papír   [\\💵 799]')
            .setFooter('• Bezárás: ❌\n• Vissza: ◀️')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex === 2) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(dataBasic[sender.id].money) + '**', true)
            .addField('Sorsjegyek:',
                '> \\💶 Black Jack   [\\💵 1999]  50% hogy nyersz, főnyeremény: 2500 [' + dataBackpacks[sender.id].luckyCards.small + ' db]\n' +
                '> \\💷 Buksza   [\\💵 3599]  20% hogy nyersz, főnyeremény: 6000 [' + dataBackpacks[sender.id].luckyCards.medium + ' db]\n' +
                '> \\💴 Fáraók Kincse   [\\💵 6999]  10% hogy nyersz, főnyeremény: 1150 [' + dataBackpacks[sender.id].luckyCards.large + ' db]')
            .setFooter('• Bezárás: ❌\n• Vissza: ◀️')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex === 3) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(dataBasic[sender.id].money) + '**', true)
            .addField('Profil testreszabása: ',
                '> \\🖍️ Neved színe\n' +
                '> \\🛍️ Hátizsákod színe')
            .setFooter('• Bezárás: ❌\n• Vissza: ◀️')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex === 4) {
        let colorEmoji = '❔'
        const userColor = dataBasic[sender.id].color
        if (userColor === "#ff0000") {
            colorEmoji = '🟥'
        } else if (userColor === "#ffff00") {
            colorEmoji = '🟨'
        } else if (userColor === "#0000ff") {
            colorEmoji = '🟦'
        } else if (userColor === "#ffbb00") {
            colorEmoji = '🟧'
        } else if (userColor === "#9d00ff") {
            colorEmoji = '🟪'
        } else if (userColor === "#00ff00") {
            colorEmoji = '🟩'
        } else if (userColor === "#734c09") {
            colorEmoji = '🟫'
        } else if (userColor === "#000000") {
            colorEmoji = '⬛'
        }
    
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(dataBasic[sender.id].money) + '**', true).addField('Hátizsák színek:  [\\' + colorEmoji + ']',
                '> \\⬛ Nincs szín   [\\💵 99]\n> \\🟥\\🟨\\🟦 Alap színek   [\\💵 1499]\n' +
                '> \\🟧\\🟪\\🟩 Alap kevert színek   [\\💵 2499]\n' +
                '> \\🟫 Barna   [\\💵 2999]\n' +
                '> \\⬜ Fehér   [\\💵 3299]')
            .setFooter('• Bezárás: ❌\n• Vissza: ◀️')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex === 5) {
    
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(dataBasic[sender.id].money) + '**', true)
            .addField('Név színek:',
                '> \\⚫ Alap   [\\💵 9]\n' +
                '> \\🔴\\🟡\\🔵 Alap színek   [\\💵 2999]\n' +
                '> \\🟠\\🟣\\🟢 Alap kevert színek   [\\💵 3499]\n' +
                '> \\🚫 Láthatatlan   [\\💵 3999]')
            .setFooter('• Bezárás: ❌\n• Vissza: ◀️')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex === -1) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(dataBasic[sender.id].money) + '**', true)
            .addField('A bolt nem használható.', 'Hogy újra használhasd a boltot, használd a `.bolt` parancsot!')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else {
        return
    }
}

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.User} sender
 * @param {Discord.Message} embedMessage
 * @param {Discord.GuildMember} senderMember
 */
function awaitReactionsThis(embedMessage, sender, channel, currentMenuIndex, senderMember) {
    var money = dataBasic[sender.id].money;

    embedMessage.awaitReactions((reaction, user) => user.id == sender.id && (
        reaction.emoji.name == '🎁' ||
        reaction.emoji.name == '🧱' ||
        reaction.emoji.name == '🎟️' ||
        reaction.emoji.name == '🧻' ||
        reaction.emoji.name == '💶' ||
        reaction.emoji.name == '💷' ||
        reaction.emoji.name == '💴' ||
        reaction.emoji.name == '⬛' ||
        reaction.emoji.name == '🟥' ||
        reaction.emoji.name == '🟨' ||
        reaction.emoji.name == '🟦' ||
        reaction.emoji.name == '🟧' ||
        reaction.emoji.name == '🟪' ||
        reaction.emoji.name == '🟩' ||
        reaction.emoji.name == '🟫' ||
        reaction.emoji.name == '⬜' ||
        reaction.emoji.name == '🎨' ||
        reaction.emoji.name == '🛒' ||
        reaction.emoji.name == '🍀' ||
        reaction.emoji.name == '◀️' ||
        reaction.emoji.name == '❌' ||
        reaction.emoji.name == '🖍️' ||
        reaction.emoji.name == '🛍️' ||
        reaction.emoji.name == '🔴' ||
        reaction.emoji.name == '🟡' ||
        reaction.emoji.name == '🔵' ||
        reaction.emoji.name == '🟠' ||
        reaction.emoji.name == '🟣' ||
        reaction.emoji.name == '🟢' ||
        reaction.emoji.name == '🟤' ||
        reaction.emoji.name == '⚫' ||
        reaction.emoji.name == '🚫'
    ), { max: 1, time: 900000 }).then(async collected => {
            if (collected.first().emoji.name == '🧱') {
                if (money >= 2099) {
                    dataBasic[sender.id].money -= 2099
                    dataBackpacks[sender.id].crates += 1
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🎁') {
                if (money >= 3999) {
                    dataBasic[sender.id].money -= 3999
                    dataBackpacks[sender.id].gifts += 1
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🎟️') {
                if (money >= 8999) {
                    dataBasic[sender.id].money -= 8999
                    dataBackpacks[sender.id].tickets += 1
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🧻') {
                if (money >= 799) {
                    dataBasic[sender.id].money -= 799
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '💶') {
                if (money >= 1999) {
                    dataBasic[sender.id].money -= 1999
                    dataBackpacks[sender.id].luckyCards.small += 1
                } else {
                    sendLuckyMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '💷') {
                if (money >= 3599) {
                    dataBasic[sender.id].money -= 3599
                    dataBackpacks[sender.id].luckyCards.medium += 1
                } else {
                    sendLuckyMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '💴') {
                if (money >= 6999) {
                    dataBasic[sender.id].money -= 6999
                    dataBackpacks[sender.id].luckyCards.large += 1
                } else {
                    sendLuckyMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '⬛') {
                if (money >= 99) {
                    dataBasic[sender.id].money -= 99
                    dataBasic[sender.id].color = '#000000'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟥') {
                if (money >= 1499) {
                    dataBasic[sender.id].money -= 1499
                    dataBasic[sender.id].color = '#ff0000'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟨') {
                if (money >= 1499) {
                    dataBasic[sender.id].money -= 1499
                    dataBasic[sender.id].color = '#ffff00'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟦') {
                if (money >= 1499) {
                    dataBasic[sender.id].money -= 1499
                    dataBasic[sender.id].color = '#0000ff'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟧') {
                if (money >= 2499) {
                    dataBasic[sender.id].money -= 2499
                    dataBasic[sender.id].color = '#ffbb00'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟪') {
                if (money >= 2499) {
                    dataBasic[sender.id].money -= 2499
                    dataBasic[sender.id].color = '#9d00ff'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟩') {
                if (money >= 2499) {
                    dataBasic[sender.id].money -= 2499
                    dataBasic[sender.id].color = '#00ff00'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟫') {
                if (money >= 2999) {
                    dataBasic[sender.id].money -= 2999
                    dataBasic[sender.id].color = '#734c09'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '⬜') {
                if (money >= 3299) {
                    dataBasic[sender.id].money -= 3299
                    dataBasic[sender.id].color = '#fffff9'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🎨') {
                embedMessage.reactions.removeAll()
            } else if (collected.first().emoji.name == '🛒') {
                embedMessage.reactions.removeAll()
            } else if (collected.first().emoji.name == '🍀') {
                embedMessage.reactions.removeAll()
            } else if (collected.first().emoji.name == '◀️') {
                embedMessage.reactions.removeAll()
            } else if (collected.first().emoji.name == '❌') {
                embedMessage.reactions.removeAll()
            } else if (collected.first().emoji.name == '🖍️') {
                embedMessage.reactions.removeAll()
            } else if (collected.first().emoji.name == '🛍️') {
                embedMessage.reactions.removeAll()
            } else if (collected.first().emoji.name == '🔴') {
                if (money >= 2999) {
                    dataBasic[sender.id].money -= 2999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.red))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟡') {
                if (money >= 2999) {
                    dataBasic[sender.id].money -= 2999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.yellow))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🔵') {
                if (money >= 2999) {
                    dataBasic[sender.id].money -= 2999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.blue))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟠') {
                if (money >= 3499) {
                    dataBasic[sender.id].money -= 3499
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.orange))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟣') {
                if (money >= 3499) {
                    dataBasic[sender.id].money -= 3499
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.purple))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟢') {
                if (money >= 3499) {
                    dataBasic[sender.id].money -= 3499
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.green))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '⚫') {
                if (money >= 9) {
                    dataBasic[sender.id].money -= 9
                    removeAllColorRoles(senderMember)
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🚫') {
                if (money >= 3999) {
                    dataBasic[sender.id].money -= 3999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.invisible))
                } else {
                    sendColorMessage(channel, false)
                }
            }

            saveDatabase(channel)

            if (collected.first().emoji.name == '🎨') {
                embedMessage.edit(getEmbedMessage(sender, 3)).then(msg00 => {
                    embedMessage.react('🖍️')
                    embedMessage.react('🛍️')
                    embedMessage.react('❌')
                    embedMessage.react('◀️')
                    awaitReactionsThis(msg00, sender, channel, 3, senderMember)
                })
            } else if (collected.first().emoji.name == '🛒') {
                embedMessage.edit(getEmbedMessage(sender, 1)).then(msg00 => {
                    if (money >= 2099) { embedMessage.react('🧱'); }
                    if (money >= 3999) { embedMessage.react('🎁'); }
                    if (money >= 8999) { embedMessage.react('🎟️'); }
                    if (money >= 799) { embedMessage.react('🧻'); }
                    embedMessage.react('❌')
                    embedMessage.react('◀️')
                    awaitReactionsThis(msg00, sender, channel, 1, senderMember)
                })
            } else if (collected.first().emoji.name == '🍀') {
                embedMessage.edit(getEmbedMessage(sender, 2)).then(msg00 => {
                    if (money >= 1999) { embedMessage.react('💶'); }
                    if (money >= 3599) { embedMessage.react('💷'); }
                    if (money >= 6999) { embedMessage.react('💴'); }
                    embedMessage.react('❌')
                    embedMessage.react('◀️')
                    awaitReactionsThis(msg00, sender, channel, 2, senderMember)
                })
            } else if (collected.first().emoji.name == '◀️') {
                embedMessage.edit(getEmbedMessage(sender, 0)).then(msg00 => {
                    msg00.react('🛒');
                    msg00.react('🍀');
                    msg00.react('🎨');
                    msg00.react('❌');
                    awaitReactionsThis(msg00, sender, channel, 0, senderMember)
                })
            } else if (collected.first().emoji.name == '❌') {
                embedMessage.edit(getEmbedMessage(sender, -1))
            } else if (collected.first().emoji.name == '🖍️') {
                embedMessage.edit(getEmbedMessage(sender, 5)).then(msg00 => {
                    if (money >= 2999) { embedMessage.react('🔴'); }
                    if (money >= 2999) { embedMessage.react('🟡'); }
                    if (money >= 2999) { embedMessage.react('🔵'); }
                    if (money >= 3499) { embedMessage.react('🟠'); }
                    if (money >= 3499) { embedMessage.react('🟣'); }
                    if (money >= 3499) { embedMessage.react('🟢'); }
                    if (money >= 9) { embedMessage.react('⚫'); }
                    if (money >= 3999) { embedMessage.react('🚫'); }
                    embedMessage.react('❌')
                    embedMessage.react('◀️')
                    awaitReactionsThis(msg00, sender, channel, 5, senderMember)
                })
            } else if (collected.first().emoji.name == '🛍️') {
                embedMessage.edit(getEmbedMessage(sender, 4)).then(msg00 => {
                    if (money >= 99) { embedMessage.react('⬛'); }
                    if (money >= 1499) { embedMessage.react('🟥'); }
                    if (money >= 1499) { embedMessage.react('🟨'); }
                    if (money >= 1499) { embedMessage.react('🟦'); }
                    if (money >= 2499) { embedMessage.react('🟧'); }
                    if (money >= 2499) { embedMessage.react('🟪'); }
                    if (money >= 2499) { embedMessage.react('🟩'); }
                    if (money >= 2999) { embedMessage.react('🟫'); }
                    if (money >= 3299) { embedMessage.react('⬜'); }
                    embedMessage.react('❌')
                    embedMessage.react('◀️')
                    awaitReactionsThis(msg00, sender, channel, 4, senderMember)
                })
            } else {
                try {
                    collected.first().users.remove(sender.id)
                    embedMessage.edit(getEmbedMessage(sender, currentMenuIndex)).then(msg00 => {
                        awaitReactionsThis(msg00, sender, channel, currentMenuIndex, senderMember)
                    })
                } catch (error) {
                    channel.send('> **' + error + '**');
                }
            }
    }).catch(() => {
        embedMessage.reactions.removeAll();
        embedMessage.edit(getEmbedMessage(sender, -1))
    });
}

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.User} sender
 * @param {Discord.GuildMember} senderMember
 */
module.exports = (channel, sender, senderMember) => {
    var money = dataBasic[sender.id].money;

    channel.send(getEmbedMessage(sender, 0)).then(embedMessage => {

        embedMessage.react('🛒');
        embedMessage.react('🍀');
        embedMessage.react('🎨');
        embedMessage.react('❌');

        awaitReactionsThis(embedMessage, sender, channel, 0, senderMember)
    });
}