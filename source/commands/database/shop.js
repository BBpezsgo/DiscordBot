const Discord = require('discord.js')
const fs = require('fs')
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { DatabaseManager } = require('../../functions/databaseManager')

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
        fs.writeFile('../database/backpacks.json', await JSON.stringify(databaseManager.dataBackpacks), (err) => { if (err) { channel.send('> ' + err.message) }; });
        fs.writeFile('../database/basic.json', await JSON.stringify(databaseManager.dataBasic), (err) => { if (err) { channel.send('> ' + err.message) }; });
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
/** @param {Discord.GuildMember} member  */
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
 * @param {DatabaseManager} databaseManager
 * @returns {Discord.MessageEmbed}
 */
function getEmbedMessage(sender, menuIndex, databaseManager) {
    if (menuIndex == 0) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**', true)
            .addField('Menük: ',
                '> \\🛒 Alap dolgok\n' +
                '> \\🍀 Sorsjegyek\n' +
                '> \\🎨 Profil testreszabása')
            .setFooter('Bezárás: ❌')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')

        return embed
    } else if (menuIndex == 1) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**', true)
            .addField('Alap dolgok:',
                '> \\🧱 Láda   [\\💵 2099] [' + databaseManager.dataBackpacks[sender.id].crates + ' db]\n' +
                '> \\🎁 Ajándék   [\\💵 3999] [' + databaseManager.dataBackpacks[sender.id].gifts + ' db]\n' +
                '> \\🎟️ Kupon   [\\💵 8999] [' + databaseManager.dataBackpacks[sender.id].tickets + ' db]\n' +
                '> \\🧻 WC papír   [\\💵 799]')
            .setFooter('Bezárás: ❌')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 2) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**', true)
            .addField('Sorsjegyek:',
                '> \\💶 Black Jack   [\\💵 1999]  50% hogy nyersz, főnyeremény: 2500 [' + databaseManager.dataBackpacks[sender.id].luckyCards.small + ' db]\n' +
                '> \\💷 Buksza   [\\💵 3599]  20% hogy nyersz, főnyeremény: 6000 [' + databaseManager.dataBackpacks[sender.id].luckyCards.medium + ' db]\n' +
                '> \\💴 Fáraók Kincse   [\\💵 6999]  10% hogy nyersz, főnyeremény: 1150 [' + databaseManager.dataBackpacks[sender.id].luckyCards.large + ' db]')
            .setFooter('Bezárás: ❌')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 3) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**', true)
            .addField('Profil testreszabása: ',
                '> \\🖍️ Neved színe\n' +
                '> \\🛍️ Hátizsákod színe')
            .setFooter('Bezárás: ❌')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 4) {
        let colorEmoji = '❔'
        const userColor = databaseManager.dataBasic[sender.id].color
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
            .addField('\\💵 Egyenleged:', '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**', true).addField('Hátizsák színek:  [\\' + colorEmoji + ']',
                '> \\⬛ Nincs szín   [\\💵 99]\n> \\🟥\\🟨\\🟦 Alap színek   [\\💵 1499]\n' +
                '> \\🟧\\🟪\\🟩 Alap kevert színek   [\\💵 2499]\n' +
                '> \\🟫 Barna   [\\💵 2999]\n' +
                '> \\⬜ Fehér   [\\💵 3299]')
            .setFooter('Bezárás: ❌')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 5) {
    
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**', true)
            .addField('Név színek:',
                '> \\⚫ Alap   [\\💵 9]\n' +
                '> \\🔴\\🟡\\🔵 Alap színek   [\\💵 2999]\n' +
                '> \\🟠\\🟣\\🟢 Alap kevert színek   [\\💵 3499]\n' +
                '> \\🚫 Láthatatlan   [\\💵 3999]')
            .setFooter('Bezárás: ❌')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == -1) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Bolt')
            .addField('\\💵 Egyenleged:', '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**', true)
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
 * @param {number} currentMenuIndex
 * @param {Discord.GuildMember} senderMember
 */
function awaitReactionsThis(embedMessage, sender, channel, currentMenuIndex, senderMember) {
    var money = databaseManager.dataBasic[sender.id].money;

    const filter = (reaction, user) => {
        return ['🎁', '🧱', '🎟️', '🧻', '💶', '💷', '💴', '⬛',
                '🟥', '🟨', '🟦', '🟧', '🟪', '🟩', '🟫', '⬜',
                '🎨', '🛒', '🍀', '◀️', '❌', '🖍️', '🛍️', '🔴',
                '🟡', '🔵', '🟠', '🟣', '🟢', '🟤', '⚫', '🚫',].includes(reaction.emoji.name) && user.id === sender.id;
    };

    embedMessage.awaitReactions({ filter, max: 1, time: 900000, errors: ['time'] }).then(async collected => {
            if (collected.first().emoji.name == '🧱') {
                if (money >= 2099) {
                    databaseManager.dataBasic[sender.id].money -= 2099
                    databaseManager.dataBackpacks[sender.id].crates += 1
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🎁') {
                if (money >= 3999) {
                    databaseManager.dataBasic[sender.id].money -= 3999
                    databaseManager.dataBackpacks[sender.id].gifts += 1
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🎟️') {
                if (money >= 8999) {
                    databaseManager.dataBasic[sender.id].money -= 8999
                    databaseManager.dataBackpacks[sender.id].tickets += 1
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🧻') {
                if (money >= 799) {
                    databaseManager.dataBasic[sender.id].money -= 799
                } else {
                    sendFinishMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '💶') {
                if (money >= 1999) {
                    databaseManager.dataBasic[sender.id].money -= 1999
                    databaseManager.dataBackpacks[sender.id].luckyCards.small += 1
                } else {
                    sendLuckyMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '💷') {
                if (money >= 3599) {
                    databaseManager.dataBasic[sender.id].money -= 3599
                    databaseManager.dataBackpacks[sender.id].luckyCards.medium += 1
                } else {
                    sendLuckyMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '💴') {
                if (money >= 6999) {
                    databaseManager.dataBasic[sender.id].money -= 6999
                    databaseManager.dataBackpacks[sender.id].luckyCards.large += 1
                } else {
                    sendLuckyMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '⬛') {
                if (money >= 99) {
                    databaseManager.dataBasic[sender.id].money -= 99
                    databaseManager.dataBasic[sender.id].color = '#000000'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟥') {
                if (money >= 1499) {
                    databaseManager.dataBasic[sender.id].money -= 1499
                    databaseManager.dataBasic[sender.id].color = '#ff0000'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟨') {
                if (money >= 1499) {
                    databaseManager.dataBasic[sender.id].money -= 1499
                    databaseManager.dataBasic[sender.id].color = '#ffff00'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟦') {
                if (money >= 1499) {
                    databaseManager.dataBasic[sender.id].money -= 1499
                    databaseManager.dataBasic[sender.id].color = '#0000ff'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟧') {
                if (money >= 2499) {
                    databaseManager.dataBasic[sender.id].money -= 2499
                    databaseManager.dataBasic[sender.id].color = '#ffbb00'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟪') {
                if (money >= 2499) {
                    databaseManager.dataBasic[sender.id].money -= 2499
                    databaseManager.dataBasic[sender.id].color = '#9d00ff'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟩') {
                if (money >= 2499) {
                    databaseManager.dataBasic[sender.id].money -= 2499
                    databaseManager.dataBasic[sender.id].color = '#00ff00'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟫') {
                if (money >= 2999) {
                    databaseManager.dataBasic[sender.id].money -= 2999
                    databaseManager.dataBasic[sender.id].color = '#734c09'
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '⬜') {
                if (money >= 3299) {
                    databaseManager.dataBasic[sender.id].money -= 3299
                    databaseManager.dataBasic[sender.id].color = '#fffff9'
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
                    databaseManager.dataBasic[sender.id].money -= 2999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.red))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟡') {
                if (money >= 2999) {
                    databaseManager.dataBasic[sender.id].money -= 2999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.yellow))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🔵') {
                if (money >= 2999) {
                    databaseManager.dataBasic[sender.id].money -= 2999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.blue))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟠') {
                if (money >= 3499) {
                    databaseManager.dataBasic[sender.id].money -= 3499
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.orange))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟣') {
                if (money >= 3499) {
                    databaseManager.dataBasic[sender.id].money -= 3499
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.purple))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🟢') {
                if (money >= 3499) {
                    databaseManager.dataBasic[sender.id].money -= 3499
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.green))
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '⚫') {
                if (money >= 9) {
                    databaseManager.dataBasic[sender.id].money -= 9
                    removeAllColorRoles(senderMember)
                } else {
                    sendColorMessage(channel, false)
                }
            } else if (collected.first().emoji.name == '🚫') {
                if (money >= 3999) {
                    databaseManager.dataBasic[sender.id].money -= 3999
                    removeAllColorRoles(senderMember)
                    senderMember.roles.add(senderMember.guild.roles.cache.get(ColorRoles.invisible))
                } else {
                    sendColorMessage(channel, false)
                }
            }

            saveDatabase(channel)

            if (collected.first().emoji.name == '🎨') {
                embedMessage.edit({embeds: [getEmbedMessage(sender, 3)]}).then(msg00 => {
                    embedMessage.react('🖍️')
                    embedMessage.react('🛍️')
                    embedMessage.react('◀️')
                    embedMessage.react('❌')
                    awaitReactionsThis(msg00, sender, channel, 3, senderMember)
                })
            } else if (collected.first().emoji.name == '🛒') {
                embedMessage.edit({embeds: [getEmbedMessage(sender, 1)]}).then(msg00 => {
                    if (money >= 2099) { embedMessage.react('🧱'); }
                    if (money >= 3999) { embedMessage.react('🎁'); }
                    if (money >= 8999) { embedMessage.react('🎟️'); }
                    if (money >= 799) { embedMessage.react('🧻'); }
                    embedMessage.react('◀️')
                    embedMessage.react('❌')
                    awaitReactionsThis(msg00, sender, channel, 1, senderMember)
                })
            } else if (collected.first().emoji.name == '🍀') {
                embedMessage.edit({embeds: [getEmbedMessage(sender, 2)]}).then(msg00 => {
                    if (money >= 1999) { embedMessage.react('💶'); }
                    if (money >= 3599) { embedMessage.react('💷'); }
                    if (money >= 6999) { embedMessage.react('💴'); }
                    embedMessage.react('◀️')
                    embedMessage.react('❌')
                    awaitReactionsThis(msg00, sender, channel, 2, senderMember)
                })
            } else if (collected.first().emoji.name == '◀️') {
                embedMessage.edit({embeds: [getEmbedMessage(sender, 0)]}).then(msg00 => {
                    msg00.react('🛒');
                    msg00.react('🍀');
                    msg00.react('🎨');
                    msg00.react('❌');
                    awaitReactionsThis(msg00, sender, channel, 0, senderMember)
                })
            } else if (collected.first().emoji.name == '❌') {
                embedMessage.edit({embeds: [getEmbedMessage(sender, -1)]})
            } else if (collected.first().emoji.name == '🖍️') {
                embedMessage.edit({embeds: [getEmbedMessage(sender, 5)]}).then(msg00 => {
                    if (money >= 2999) { embedMessage.react('🔴'); }
                    if (money >= 2999) { embedMessage.react('🟡'); }
                    if (money >= 2999) { embedMessage.react('🔵'); }
                    if (money >= 3499) { embedMessage.react('🟠'); }
                    if (money >= 3499) { embedMessage.react('🟣'); }
                    if (money >= 3499) { embedMessage.react('🟢'); }
                    if (money >= 9) { embedMessage.react('⚫'); }
                    if (money >= 3999) { embedMessage.react('🚫'); }
                    embedMessage.react('◀️')
                    embedMessage.react('❌')
                    awaitReactionsThis(msg00, sender, channel, 5, senderMember)
                })
            } else if (collected.first().emoji.name == '🛍️') {
                embedMessage.edit({embeds: [getEmbedMessage(sender, 4)]}).then(msg00 => {
                    if (money >= 99) { embedMessage.react('⬛'); }
                    if (money >= 1499) { embedMessage.react('🟥'); }
                    if (money >= 1499) { embedMessage.react('🟨'); }
                    if (money >= 1499) { embedMessage.react('🟦'); }
                    if (money >= 2499) { embedMessage.react('🟧'); }
                    if (money >= 2499) { embedMessage.react('🟪'); }
                    if (money >= 2499) { embedMessage.react('🟩'); }
                    if (money >= 2999) { embedMessage.react('🟫'); }
                    if (money >= 3299) { embedMessage.react('⬜'); }
                    embedMessage.react('◀️')
                    embedMessage.react('❌')
                    awaitReactionsThis(msg00, sender, channel, 4, senderMember)
                })
            } else {
                try {
                    collected.first().users.remove(sender.id)
                    embedMessage.edit({embeds: [getEmbedMessage(sender, currentMenuIndex)]}).then(msg00 => {
                        awaitReactionsThis(msg00, sender, channel, currentMenuIndex, senderMember)
                    })
                } catch (error) {
                    channel.send('> **' + error + '**');
                }
            }
    }).catch(() => {
        embedMessage.reactions.removeAll();
        embedMessage.edit({embeds: [getEmbedMessage(sender, -1)]})
    });
}

function backpackColorIndex(databaseManager, userId) {
    const userColor = databaseManager.dataBasic[userId].color
    if (userColor === "#ff0000") {
        return 3
    } else if (userColor === "#ffff00") {
        return 5
    } else if (userColor === "#0000ff") {
        return 7
    } else if (userColor === "#ffbb00") {
        return 4
    } else if (userColor === "#9d00ff") {
        return 8
    } else if (userColor === "#00ff00") {
        return 6
    } else if (userColor === "#734c09") {
        return 2
    } else if (userColor === "#000000") {
        return 1
    } else if (userColor === "#fffff9") {
        return 0
    }
}

/**@param {Discord.GuildMember} member */
function colorRankToIndex(member) {
    if (member.roles.cache.some(role => role.id == "850016210422464534")) {
        return 1
    } else if (member.roles.cache.some(role => role.id == "850016531848888340")) {
        return 2
    } else if (member.roles.cache.some(role => role.id == "850016458544250891")) {
        return 3
    } else if (member.roles.cache.some(role => role.id == "850016722039078912")) {
        return 4
    } else if (member.roles.cache.some(role => role.id == "850016589155401758")) {
        return 5
    } else if (member.roles.cache.some(role => role.id == "850016668352643072")) {
        return 6
    } else if (member.roles.cache.some(role => role.id == "850016786186371122")) {
        return 7
    }
    return 0
}

/**@param {string} roleId */
function colorRankToIndex2(roleId) {
    if (roleId == "850016210422464534") {
        return 1
    } else if (roleId == "850016531848888340") {
        return 2
    } else if (roleId == "850016458544250891") {
        return 3
    } else if (roleId == "850016722039078912") {
        return 4
    } else if (roleId == "850016589155401758") {
        return 5
    } else if (roleId == "850016668352643072") {
        return 6
    } else if (roleId == "850016786186371122") {
        return 7
    }
    return 0
}

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.User} sender
 * @param {Discord.GuildMember} senderMember
 * @param {number} menuIndex
 * @param {DatabaseManager} databaseManager
 * @param {boolean} privateCommand
 */
module.exports = (channel, sender, senderMember, databaseManager, menuIndex = 0, newColorRole = '', privateCommand = false) => {
    const money = databaseManager.dataBasic[sender.id].money;

    const selectMenu = new MessageSelectMenu()
        .setCustomId("shopMenu")
        .setPlaceholder('Menük')
        .addOptions([
            {
                label: 'Alap',
                value: '1',
                emoji: '🛒'
            },
            {
                label: 'Sorsjegyek',
                value: '2',
                emoji: '🍀'
            },
            {
                label: 'Profil',
                value: '3',
                emoji: '🎨'
            }
        ])
    const selectMenu2 = new MessageSelectMenu()
        .setCustomId("shopMenu2")
        .setPlaceholder('Menük')
        .addOptions([
            {
                label: 'Hátizsákod színe',
                value: '4',
                emoji: '🛍️'
            },
            {
                label: 'Neved színe',
                value: '5',
                emoji: '🖍️'
            }
        ])
    const selectMenuBackpackColors = new MessageSelectMenu()
        .setCustomId("shopBackpackColors")
        .setPlaceholder('Színek')
        .addOptions([
            {
                label: 'Fehér',
                value: '0',
                emoji: '⬜'
            },
            {
                label: 'Fekete',
                value: '1',
                emoji: '⬛'
            },
            {
                label: 'Barna',
                value: '2',
                emoji: '🟫'
            },
            {
                label: 'Vörös',
                value: '3',
                emoji: '🟥'
            },
            {
                label: 'Narancssárga',
                value: '4',
                emoji: '🟧'
            },
            {
                label: 'Sárga',
                value: '5',
                emoji: '🟨'
            },
            {
                label: 'Zöld',
                value: '6',
                emoji: '🟩'
            },
            {
                label: 'Kék',
                value: '7',
                emoji: '🟦'
            },
            {
                label: 'Lila',
                value: '8',
                emoji: '🟪'
            }
        ])

    const selectMenuNameColors = new MessageSelectMenu()
        .setCustomId("shopNameColors")
        .setPlaceholder('Színek')
        .addOptions([
            {
                label: 'Alap',
                value: '0',
                emoji: '⚫'
            },
            {
                label: 'Vörös',
                value: '1',
                emoji: '🔴'
            },
            {
                label: 'Narancssárga',
                value: '2',
                emoji: '🟠'
            },
            {
                label: 'Sárga',
                value: '3',
                emoji: '🟡'
            },
            {
                label: 'Zöld',
                value: '4',
                emoji: '🟢'
            },
            {
                label: 'Kék',
                value: '5',
                emoji: '🔵'
            },
            {
                label: 'Lila',
                value: '6',
                emoji: '🟣'
            },
            {
                label: 'Láthatatlan',
                value: '7',
                emoji: '🚫'
            }
        ])
        if (menuIndex == 4) {
            selectMenuBackpackColors.options[backpackColorIndex(databaseManager, sender.id)].default = true
        }
    if (menuIndex == 5) {
        const RankIndex = (newColorRole == '') ? colorRankToIndex(senderMember) : colorRankToIndex2(newColorRole)
        selectMenuNameColors.options[RankIndex].default = true
    }
    if (menuIndex > 0) {
        selectMenu.options[Math.min(menuIndex, 3) - 1].default = true
    }
    if (menuIndex > 3) {
        selectMenu2.options[menuIndex - 4].default = true
    }
    const buttonExit = new MessageButton()
        .setLabel("❌")
        .setCustomId("shopClose")
        .setStyle("SECONDARY");
    const buttonBuyCrate = new MessageButton()
        .setLabel("🧱")
        .setCustomId("shopBuyCrate")
        .setStyle("SECONDARY");
    const buttonBuyGift = new MessageButton()
        .setLabel("🎁")
        .setCustomId("shopBuyGift")
        .setStyle("SECONDARY");
    const buttonBuyTicket = new MessageButton()
        .setLabel("🎟️")
        .setCustomId("shopBuyTicket")
        .setStyle("SECONDARY");
    const buttonBuyWC = new MessageButton()
        .setLabel("🧻")
        .setCustomId("shopBuyWC")
        .setStyle("SECONDARY");
    const buttonBuyLuckySmall = new MessageButton()
        .setLabel("💶")
        .setCustomId("shopBuyLuckySmall")
        .setStyle("SECONDARY");
    const buttonBuyLuckyMedium = new MessageButton()
        .setLabel("💷")
        .setCustomId("shopBuyLuckyMedium")
        .setStyle("SECONDARY");
    const buttonBuyLuckyLarge = new MessageButton()
        .setLabel("💴")
        .setCustomId("shopBuyLuckyLarge")
        .setStyle("SECONDARY");

    if (!money >= 2099) { buttonBuyCrate.setDisabled(true) }
    if (!money >= 3999) { buttonBuyGift.setDisabled(true) }
    if (!money >= 8999) { buttonBuyTicket.setDisabled(true) }
    if (!money >= 799) { buttonBuyWC.setDisabled(true) }
    if (!money >= 1999) { buttonBuyLuckySmall.setDisabled(true) }
    if (!money >= 3599) { buttonBuyLuckyMedium.setDisabled(true) }
    if (!money >= 6999) { buttonBuyLuckyLarge.setDisabled(true) }

    const rowSecondary0 = new MessageActionRow()
        .addComponents(buttonBuyCrate, buttonBuyGift, buttonBuyTicket, buttonBuyWC)
    const rowSecondary1 = new MessageActionRow()
        .addComponents(buttonBuyLuckySmall, buttonBuyLuckyMedium, buttonBuyLuckyLarge)
    const rowSecondary2 = new MessageActionRow()
        .addComponents(selectMenuBackpackColors)
    const rowSecondary3 = new MessageActionRow()
        .addComponents(selectMenuNameColors)
    const rowSelectMenuPrimary = new MessageActionRow()
        .addComponents(selectMenu)
    const rowSelectMenuSecondary = new MessageActionRow()
        .addComponents(selectMenu2)
    const rowPrimary = new MessageActionRow()
    if (privateCommand == false) {
        rowPrimary.addComponents(buttonExit)
    }
    if (menuIndex == -1) {
        return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], ephemeral:privateCommand }
    } else if (menuIndex == 0) {
        return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], components: [rowSelectMenuPrimary, rowPrimary], ephemeral:privateCommand }
    } else if (menuIndex == 1) {
        return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], components: [rowSelectMenuPrimary, rowSecondary0, rowPrimary], ephemeral:privateCommand }
    } else if (menuIndex == 2) {
        return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], components: [rowSelectMenuPrimary, rowSecondary1, rowPrimary], ephemeral:privateCommand }
    } else if (menuIndex == 3) {
        return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], components: [rowSelectMenuPrimary, rowSelectMenuSecondary, rowPrimary], ephemeral:privateCommand }
    } else if (menuIndex == 4) {
        return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], components: [rowSelectMenuPrimary, rowSelectMenuSecondary, rowSecondary2, rowPrimary], ephemeral:privateCommand }
    } else if (menuIndex == 5) {
        return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], components: [rowSelectMenuPrimary, rowSelectMenuSecondary, rowSecondary3, rowPrimary], ephemeral:privateCommand }
    }

    return { embeds: [getEmbedMessage(sender, menuIndex, databaseManager)], components: [rowSelectMenuPrimary, rowPrimary] }
    /*.then(embedMessage => {

        embedMessage.react('🛒');
        embedMessage.react('🍀');
        embedMessage.react('🎨');
        embedMessage.react('❌');

        awaitReactionsThis(embedMessage, sender, channel, 0, senderMember)
    });*/
}