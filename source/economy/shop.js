const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js');
const { DatabaseManager } = require('../functions/databaseManager')
const { Abbrev } = require('../functions/utils')

const ColorRoles = {
	red: "850016210422464534",
	yellow: "850016458544250891",
	blue: "850016589155401758",
	orange: "850016531848888340",
	green: "850016722039078912",
	purple: "850016668352643072",
	invisible: "850016786186371122"
}

const ThumbnailImageURL = 'https://em-content.zobj.net/thumbs/160/microsoft/319/shopping-cart_1f6d2.png'

 /**
 * @param {Discord.User} sender
 * @param {number} menuIndex 0: Main menu | 1: Basic | 2: Lucky cards | 3: Backpack colors | -1: None
 * @param {DatabaseManager} databaseManager
 * @param {boolean} privateCommand
 * @returns {Discord.EmbedBuilder}
 */
function getEmbedMessage(sender, menuIndex, databaseManager, privateCommand) {
    if (menuIndex == 0) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + Abbrev(databaseManager.dataBasic[sender.id].money) + '**',
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
            .setThumbnail(ThumbnailImageURL)

        if (!privateCommand) embed.setFooter({ text: 'Bezárás: ❌' })

        return embed
    } else if (menuIndex == 1) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + Abbrev(databaseManager.dataBasic[sender.id].money) + '**',
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
            .setThumbnail(ThumbnailImageURL)
    
        if (!privateCommand) embed.setFooter({ text: 'Bezárás: ❌' })

        return embed
    } else if (menuIndex == 2) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + Abbrev(databaseManager.dataBasic[sender.id].money) + '**',
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
            .setThumbnail(ThumbnailImageURL)
    
        if (!privateCommand) embed.setFooter({ text: 'Bezárás: ❌' })

        return embed
    } else if (menuIndex == 3) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + Abbrev(databaseManager.dataBasic[sender.id].money) + '**',
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
            .setThumbnail(ThumbnailImageURL)
    
        if (!privateCommand) embed.setFooter({ text: 'Bezárás: ❌' })

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
        } else if (userColor === "black") {
            colorEmoji = '⬛'
        } else if (userColor === "white") {
            colorEmoji = '⬛'
        }
    
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + Abbrev(databaseManager.dataBasic[sender.id].money) + '**',
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
            .setThumbnail(ThumbnailImageURL)
    
        if (!privateCommand) embed.setFooter({ text: 'Bezárás: ❌' })

        return embed
    } else if (menuIndex == 5) {
    
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + Abbrev(databaseManager.dataBasic[sender.id].money) + '**',
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
            .setThumbnail(ThumbnailImageURL)
    
        if (!privateCommand) embed.setFooter({ text: 'Bezárás: ❌' })

        return embed
    } else if (menuIndex == -1) {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: sender.username, iconURL: sender.displayAvatarURL() })
            .setTitle('Bolt')
            .addFields([
                {
                    name: '\\💵 Egyenleged:',
                    value: '**' + Abbrev(databaseManager.dataBasic[sender.id].money) + '**',
                    inline: true
                },
                {
                    name: 'A bolt nem használható',
                    value: 'Hogy újra használhasd a boltot, használd a `/shop` parancsot!'
                }
            ])
            .setThumbnail(ThumbnailImageURL)
    
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
        if (member.roles.cache.some(_role => _role.id == role)) {
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
 * @returns {Discord.InteractionReplyOptions & { fetchReply: true }}
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
            selectMenuBackpackColors.options[backpackColorIndex(databaseManager, sender.id)].setDefault(true)
        }
    if (menuIndex == 5) {
        const RankIndex = (newColorRole == '') ? colorRankToIndex(senderMember) : colorRankToIndex2(newColorRole)
        selectMenuNameColors.options[RankIndex].setDefault(true)
    }
    if (menuIndex > 0) {
        selectMenu.options[Math.min(menuIndex, 3) - 1].setDefault(true)
    }
    if (menuIndex > 3) {
        selectMenu2.options[menuIndex - 4].setDefault(true)
    }
    
    /** @type {Discord.ActionRowBuilder<Discord.AnyComponentBuilder>[]} */
    const components = []

    const rowSelectMenuPrimary = new ActionRowBuilder().addComponents(selectMenu)
    const rowSelectMenuSecondary = new ActionRowBuilder().addComponents(selectMenu2)

    if (menuIndex == -1) {

    } else if (menuIndex == 0) {
        components.push(rowSelectMenuPrimary)
    } else if (menuIndex == 1) {
        components.push(rowSelectMenuPrimary)
        components.push(new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("🧱")
                .setCustomId("shopBuyCrate")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(money < 2099),
            new ButtonBuilder()
                .setLabel("🎁")
                .setCustomId("shopBuyGift")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(money < 3999),
            new ButtonBuilder()
                .setLabel("🎟️")
                .setCustomId("shopBuyTicket")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(money < 8999),
            new ButtonBuilder()
                .setLabel("🧻")
                .setCustomId("shopBuyWC")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(money < 799)
        ))
    } else if (menuIndex == 2) {
        components.push(rowSelectMenuPrimary)
        components.push(
            new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("💶")
                .setCustomId("shopBuyLuckySmall")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(money < 1999),
            new ButtonBuilder()
                .setLabel("💷")
                .setCustomId("shopBuyLuckyMedium")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(money < 3599),
            new ButtonBuilder()
                .setLabel("💴")
                .setCustomId("shopBuyLuckyLarge")
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(money < 6999)
        ))
    } else if (menuIndex == 3) {
        components.push(rowSelectMenuPrimary)
        components.push(rowSelectMenuSecondary)
    } else if (menuIndex == 4) {
        components.push(rowSelectMenuPrimary)
        components.push(rowSelectMenuSecondary)
        components.push(new ActionRowBuilder().addComponents(
            selectMenuBackpackColors
        ))
    } else if (menuIndex == 5) {
        components.push(rowSelectMenuPrimary)
        components.push(rowSelectMenuSecondary)
        components.push(new ActionRowBuilder().addComponents(
            selectMenuNameColors
        ))
    } else {
        components.push(rowSelectMenuPrimary)
    }

    if (privateCommand === false) {
        components.push(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("❌")
                        .setCustomId("shopClose")
                        .setStyle(Discord.ButtonStyle.Secondary)
                )
        )
    }

    return {
        embeds: [ getEmbedMessage(sender, menuIndex, databaseManager, privateCommand) ],
        components: components,
        ephemeral: privateCommand,
    }
}

/**
 * @param {Discord.ButtonInteraction<Discord.CacheType>} e
 * @param {DatabaseManager} database
 */
function OnButtonClick(e, database) {
    const privateCommand = database.dataBasic[e.user.id].privateCommands

    if (e.component.customId == 'shopClose') {
        e.client.channels.fetch(e.channelId)
            .then((channel) => {
                if (channel.isTextBased()) {
                    channel.messages.fetch(e.message.id)
                        .then(message => {
                            message.delete()
                        })
                }
            })
        return true
    }

    if (e.component.customId.startsWith('shopBuy')) {
        const money = database.dataBasic[e.user.id].money
        const buyItem = e.component.customId.replace('shopBuy', '')
        if (buyItem == 'Crate') {
            if (money >= 2099) {
                database.dataBasic[e.user.id].money -= 2099
                database.dataBackpacks[e.user.id].crates += 1

                e.update(CommandShop(e.channel, e.user, e.member, database, 1, '', privateCommand))
                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'Gift') {
            if (money >= 3999) {
                database.dataBasic[e.user.id].money -= 3999
                database.dataBackpacks[e.user.id].gifts += 1

                e.update(CommandShop(e.channel, e.user, e.member, database, 1, '', privateCommand))
                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'Ticket') {
            if (money >= 8999) {
                database.dataBasic[e.user.id].money -= 8999
                database.dataBackpacks[e.user.id].tickets += 1

                e.update(CommandShop(e.channel, e.user, e.member, database, 1, '', privateCommand))
                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'WC') {
            if (money >= 799) {
                database.dataBasic[e.user.id].money -= 799

                e.update(CommandShop(e.channel, e.user, e.member, database, 1, '', privateCommand))
                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'LuckySmall') {
            if (money >= 1999) {
                database.dataBasic[e.user.id].money -= 1999
                database.dataBackpacks[e.user.id].luckyCards.small += 1

                e.update(CommandShop(e.channel, e.user, e.member, database, 2, '', privateCommand))
                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'LuckyMedium') {
            if (money >= 3599) {
                database.dataBasic[e.user.id].money -= 3599
                database.dataBackpacks[e.user.id].luckyCards.medium += 1

                e.update(CommandShop(e.channel, e.user, e.member, database, 2, '', privateCommand))
                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'LuckyLarge') {
            if (money >= 6999) {
                database.dataBasic[e.user.id].money -= 6999
                database.dataBackpacks[e.user.id].luckyCards.large += 1

                e.update(CommandShop(e.channel, e.user, e.member, database, 2, '', privateCommand))
                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        }
        return true
    }
    return false
}

/**
 * @param {Discord.SelectMenuInteraction<Discord.CacheType>} e
 * @param {DatabaseManager} database
 */
function OnSelectMenu(e, database) {
    const privateCommand = database.dataBasic[e.user.id].privateCommands

    if (e.customId.startsWith('shopMenu')) {
        e.update(CommandShop(e.channel, e.user, e.member, database, e.values[0], '', privateCommand))
        return true
    }

    if (e.customId == 'shopBackpackColors') {
        const selectedIndex = Number.parseInt(e.values[0])
        const money = database.dataBasic[e.user.id].money

        if (selectedIndex === 0) {
            if (money >= 3299) {
                database.dataBasic[e.user.id].money -= 3299
                database.dataBasic[e.user.id].color = '#fffff9'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 1) {
            if (money >= 99) {
                database.dataBasic[e.user.id].money -= 99
                database.dataBasic[e.user.id].color = '#000000'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 2) {
            if (money >= 2999) {
                database.dataBasic[e.user.id].money -= 2999
                database.dataBasic[e.user.id].color = 'brown'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 3) {
            if (money >= 1499) {
                database.dataBasic[e.user.id].money -= 1499
                database.dataBasic[e.user.id].color = 'red'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 4) {
            if (money >= 2499) {
                database.dataBasic[e.user.id].money -= 2499
                database.dataBasic[e.user.id].color = 'orange'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 5) {
            if (money >= 1499) {
                database.dataBasic[e.user.id].money -= 1499
                database.dataBasic[e.user.id].color = 'yellow'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 6) {
            if (money >= 2499) {
                database.dataBasic[e.user.id].money -= 2499
                database.dataBasic[e.user.id].color = 'green'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 7) {
            if (money >= 1499) {
                database.dataBasic[e.user.id].money -= 1499
                database.dataBasic[e.user.id].color = 'blue'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 8) {
            if (money >= 2499) {
                database.dataBasic[e.user.id].money -= 2499
                database.dataBasic[e.user.id].color = 'purple'

                database.SaveDatabase()
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        }
        e.update(CommandShop(e.channel, e.user, e.member, database, 4, '', privateCommand))

        return true
    }

    if (e.customId == 'shopNameColors') {
        const { ColorRoles } = require('../functions/enums.js')

        const selectedIndex = Number.parseInt(e.values[0])
        const money = database.dataBasic[e.user.id].money

        var newColorRoleId = ''

        if (selectedIndex === 0) {
            if (money >= 9) {
                database.dataBasic[e.user.id].money -= 9
                removeAllColorRoles(e.member, '')
                newColorRoleId = '0'
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 1) {
            if (money >= 2999) {
                removeAllColorRoles(e.member, ColorRoles.red)
                try {
                    e.member.roles.add(e.member.guild.roles.cache.get(ColorRoles.red))
                    database.dataBasic[e.user.id].money -= 2999
                    newColorRoleId = ColorRoles.red
                } catch (error) { }
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 2) {
            if (money >= 3499) {
                removeAllColorRoles(e.member, ColorRoles.orange)
                try {
                    e.member.roles.add(e.member.guild.roles.cache.get(ColorRoles.orange))
                    database.dataBasic[e.user.id].money -= 3499
                    newColorRoleId = ColorRoles.orange
                } catch (error) { }
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 3) {
            if (money >= 2999) {
                removeAllColorRoles(e.member, ColorRoles.yellow)
                try {
                    e.member.roles.add(e.member.guild.roles.cache.get(ColorRoles.yellow))
                    database.dataBasic[e.user.id].money -= 2999
                    newColorRoleId = ColorRoles.yellow
                } catch (error) { }
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 4) {
            if (money >= 3499) {
                removeAllColorRoles(e.member, ColorRoles.green)
                try {
                    e.member.roles.add(e.member.guild.roles.cache.get(ColorRoles.green))
                    database.dataBasic[e.user.id].money -= 3499
                    newColorRoleId = ColorRoles.green
                } catch (error) { }
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 5) {
            if (money >= 2999) {
                removeAllColorRoles(e.member, ColorRoles.blue)
                try {
                    e.member.roles.add(e.member.guild.roles.cache.get(ColorRoles.blue))
                    database.dataBasic[e.user.id].money -= 2999
                    newColorRoleId = ColorRoles.blue
                } catch (error) { }
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 6) {
            if (money >= 3499) {
                removeAllColorRoles(e.member, ColorRoles.purple)
                try {
                    e.member.roles.add(e.member.guild.roles.cache.get(ColorRoles.purple))
                    database.dataBasic[e.user.id].money -= 3499
                    newColorRoleId = ColorRoles.purple
                } catch (error) { }
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (selectedIndex === 7) {
            if (money >= 3999) {
                removeAllColorRoles(e.member, ColorRoles.invisible)
                try {
                    e.member.roles.add(e.member.guild.roles.cache.get(ColorRoles.invisible))
                    database.dataBasic[e.user.id].money -= 3999
                    newColorRoleId = ColorRoles.invisible
                } catch (error) { }
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        }

        e.update(CommandShop(e.channel, e.user, e.member, database, 5, newColorRoleId, privateCommand))
        return true
    }

    return false
}

module.exports = { CommandShop, removeAllColorRoles, OnButtonClick, OnSelectMenu }