const Discord = require('discord.js')
const fs = require('fs')
const { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js');
const { DatabaseManager } = require('../../functions/databaseManager')
const { abbrev } = require('../../functions/abbrev')

const ColorRoles = {
	red: "850016210422464534",
	yellow: "850016458544250891",
	blue: "850016589155401758",
	orange: "850016531848888340",
	green: "850016722039078912",
	purple: "850016668352643072",
	invisible: "850016786186371122"
}

 /**
 * @param {Discord.User} sender
 * @param {number} menuIndex 0: Main menu | 1: Basic | 2: Lucky cards | 3: Backpack colors | -1: None
 * @param {DatabaseManager} databaseManager
 * @returns {Discord.EmbedBuilder}
 */
function getEmbedMessage(sender, menuIndex, databaseManager) {
    if (menuIndex == 0) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'Menük:',
                    value:
                        '> \\🛒 Alap dolgok\n' +
                        '> \\🍀 Sorsjegyek\n' +
                        '> \\🎨 Profil testreszabása'
                }
            ])
            .setFooter({ text: 'Bezárás: ❌' })
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')

        return embed
    } else if (menuIndex == 1) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'Alap dolgok:',
                    value:
                        '> \\🧱 Láda   [\\💵 2099] [' + databaseManager.dataBackpacks[sender.id].crates + ' db]\n' +
                        '> \\🎁 Ajándék   [\\💵 3999] [' + databaseManager.dataBackpacks[sender.id].gifts + ' db]\n' +
                        '> \\🎟️ Kupon   [\\💵 8999] [' + databaseManager.dataBackpacks[sender.id].tickets + ' db]\n' +
                        '> \\🧻 WC papír   [\\💵 799]'
                }
            ])
            .setFooter({ text: 'Bezárás: ❌' })
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 2) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'Sorsjegyek:',
                    value:
                        '> \\💶 Black Jack   [\\💵 1999]  50% hogy nyersz, főnyeremény: 2500 [' + databaseManager.dataBackpacks[sender.id].luckyCards.small + ' db]\n' +
                        '> \\💷 Buksza   [\\💵 3599]  20% hogy nyersz, főnyeremény: 6000 [' + databaseManager.dataBackpacks[sender.id].luckyCards.medium + ' db]\n' +
                        '> \\💴 Fáraók Kincse   [\\💵 6999]  10% hogy nyersz, főnyeremény: 1150 [' + databaseManager.dataBackpacks[sender.id].luckyCards.large + ' db]'
                }
            ])
            .setFooter({ text: 'Bezárás: ❌' })
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 3) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'Profil testreszabása:',
                    value:
                        '> \\🖍️ Neved színe\n' +
                        '> \\🛍️ Hátizsákod színe'
                },
                {
                    name: 'Mást keresel?',
                    value:
                        'Statisztika és jelvények: `/profil`\n' + 
                        'Beállítások: `/settings`'
                }
            ])
            .setFooter({ text: 'Bezárás: ❌' })
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 4) {
        let colorEmoji = '❔'
        const userColor = databaseManager.dataBasic[sender.id].color
        if (userColor === "red") {
            colorEmoji = '🟥'
        } else if (userColor === "yellow") {
            colorEmoji = '🟨'
        } else if (userColor === "blue") {
            colorEmoji = '🟦'
        } else if (userColor === "orange") {
            colorEmoji = '🟧'
        } else if (userColor === "purple") {
            colorEmoji = '🟪'
        } else if (userColor === "green") {
            colorEmoji = '🟩'
        } else if (userColor === "brown") {
            colorEmoji = '🟫'
        } else if (userColor === "#000000") {
            colorEmoji = '⬛'
        }
    
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'Hátizsák színek:  [\\' + colorEmoji + ']',
                    value:
                        '> \\⬛ Nincs szín   [\\💵 99]\n> \\🟥\\🟨\\🟦 Alap színek   [\\💵 1499]\n' +
                        '> \\🟧\\🟪\\🟩 Alap kevert színek   [\\💵 2499]\n' +
                        '> \\🟫 Barna   [\\💵 2999]\n' +
                        '> \\⬜ Fehér   [\\💵 3299]'
                },
                {
                    name: 'Mást keresel?',
                    value:
                        'Statisztika és jelvények: `/profil`\n' + 
                        'Beállítások: `/settings`'
                }
            ])
            .setFooter({ text: 'Bezárás: ❌' })
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == 5) {
    
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'Név színek:',
                    value:
                        '> \\⚫ Alap   [\\💵 9]\n' +
                        '> \\🔴\\🟡\\🔵 Alap színek   [\\💵 2999]\n' +
                        '> \\🟠\\🟣\\🟢 Alap kevert színek   [\\💵 3499]\n' +
                        '> \\🚫 Láthatatlan   [\\💵 3999]'
                },
                {
                    name: 'Mást keresel?',
                    value:
                        'Statisztika és jelvények: `/profil`\n' + 
                        'Beállítások: `/settings`'
                }
            ])
            .setFooter({ text: 'Bezárás: ❌' })
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else if (menuIndex == -1) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'A bolt nem használható',
                    value: 'Hogy újra használhasd a boltot, használd a `/shop` parancsot!'
                }
            ])
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/convenience-store_1f3ea.png')
    
        return embed
    } else {
        return
    }
}

function backpackColorIndex(databaseManager, userId) {
    const userColor = databaseManager.dataBasic[userId].color
    if (userColor === "red") {
        return 3
    } else if (userColor === "#ffff00") {
        return 5
    } else if (userColor === "#0000ff") {
        return 7
    } else if (userColor === "orange") {
        return 4
    } else if (userColor === "purple") {
        return 8
    } else if (userColor === "green") {
        return 6
    } else if (userColor === "brown") {
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

/** @param {Discord.GuildMember} member  @param {string} exceptRoleId  */
async function removeAllColorRoles(member, exceptRoleId) {
    const roleList = [ColorRoles.blue, ColorRoles.green, ColorRoles.invisible, ColorRoles.orange, ColorRoles.purple, ColorRoles.red, ColorRoles.yellow]
    for (let i = 0; i < roleList.length; i++) {
        const role = roleList[i]
        if (role == exceptRoleId) { continue; }
        if (member == undefined || member == null) { break; }
        if (member.roles.cache.some(role => role.id == role)) {
            member.roles.remove(member.guild.roles.cache.get(role))
        }
    }
}

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.User} sender
 * @param {Discord.GuildMember} senderMember
 * @param {number} menuIndex
 * @param {DatabaseManager} databaseManager
 * @param {boolean} privateCommand
 */
function CommandShop(channel, sender, senderMember, databaseManager, menuIndex = 0, newColorRole = '', privateCommand = false) {
    const money = databaseManager.dataBasic[sender.id].money

    const selectMenu = new SelectMenuBuilder()
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
    const selectMenu2 = new SelectMenuBuilder()
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
    const selectMenuBackpackColors = new SelectMenuBuilder()
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

    const selectMenuNameColors = new SelectMenuBuilder()
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
    const buttonExit = new ButtonBuilder()
        .setLabel("❌")
        .setCustomId("shopClose")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonBuyCrate = new ButtonBuilder()
        .setLabel("🧱")
        .setCustomId("shopBuyCrate")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonBuyGift = new ButtonBuilder()
        .setLabel("🎁")
        .setCustomId("shopBuyGift")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonBuyTicket = new ButtonBuilder()
        .setLabel("🎟️")
        .setCustomId("shopBuyTicket")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonBuyWC = new ButtonBuilder()
        .setLabel("🧻")
        .setCustomId("shopBuyWC")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonBuyLuckySmall = new ButtonBuilder()
        .setLabel("💶")
        .setCustomId("shopBuyLuckySmall")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonBuyLuckyMedium = new ButtonBuilder()
        .setLabel("💷")
        .setCustomId("shopBuyLuckyMedium")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonBuyLuckyLarge = new ButtonBuilder()
        .setLabel("💴")
        .setCustomId("shopBuyLuckyLarge")
        .setStyle(Discord.ButtonStyle.Secondary)

    if (!money >= 2099) { buttonBuyCrate.setDisabled(true) }
    if (!money >= 3999) { buttonBuyGift.setDisabled(true) }
    if (!money >= 8999) { buttonBuyTicket.setDisabled(true) }
    if (!money >= 799) { buttonBuyWC.setDisabled(true) }
    if (!money >= 1999) { buttonBuyLuckySmall.setDisabled(true) }
    if (!money >= 3599) { buttonBuyLuckyMedium.setDisabled(true) }
    if (!money >= 6999) { buttonBuyLuckyLarge.setDisabled(true) }

    const rowSecondary0 = new ActionRowBuilder()
        .addComponents(buttonBuyCrate, buttonBuyGift, buttonBuyTicket, buttonBuyWC)
    const rowSecondary1 = new ActionRowBuilder()
        .addComponents(buttonBuyLuckySmall, buttonBuyLuckyMedium, buttonBuyLuckyLarge)
    const rowSecondary2 = new ActionRowBuilder()
        .addComponents(selectMenuBackpackColors)
    const rowSecondary3 = new ActionRowBuilder()
        .addComponents(selectMenuNameColors)
    const rowSelectMenuPrimary = new ActionRowBuilder()
        .addComponents(selectMenu)
    const rowSelectMenuSecondary = new ActionRowBuilder()
        .addComponents(selectMenu2)
    const rowPrimary = new ActionRowBuilder()
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
}

module.exports = { CommandShop, removeAllColorRoles }