const { DatabaseManager } = require('../functions/databaseManager')
const Discord = require('discord.js')
const { Color } = require('../functions/enums')
const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { Abbrev } = require('../functions/utils')
const seedrandom = require('seedrandom')

function GetValues() {    
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

    const randomGenerator1 = seedrandom((dayOfYear + 0).toString().padStart(3, '0'))
    const randomGenerator2 = seedrandom((dayOfYear + 400).toString().padStart(3, '0'))
    const randomGenerator3 = seedrandom((dayOfYear + 800).toString().padStart(3, '0'))
    
    return {
        'token': (Math.floor(randomGenerator1() * 1000) + 5000),
        'coupon': (Math.floor(randomGenerator2() * 1000) + 4000),
        'jewel': (Math.floor(randomGenerator3() * 100) + 11000)
    }
}

/**
 * @param {DatabaseManager} database
 * @param {boolean} privateCommand
*/
function OnCommand(database, dataMarket, user, privateCommand = false) {
    const values = GetValues()
    const newEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setTitle('Piac')
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/balance-scale_2696-fe0f.png')
        .addFields([
            {
                name: '\\💵 Egyenleged:',
                value: '**' + Abbrev(database.dataBasic[user.id].money) + '**',
                inline: true
            },
            {
                name: 'Ajánlatok:',
                value:
                    '> 1\\🎫||' + database.dataBackpacks[user.id].quizTokens + ' db a hátizsákban|| ➜ ' + values.token + '\\💵\n' +
                    '> 1\\🎟️||' + database.dataBackpacks[user.id].tickets + ' db a hátizsákban|| ➜ ' + values.coupon + '\\💵\n' +
                    '> 1\\💍||' + database.dataBackpacks[user.id].jewel + ' db a hátizsákban|| ➜ ' + values.jewel + '\\💵\n' +
                    '> ' + values.jewel + '\\💵 ➜ 1\\💍||' + database.dataBackpacks[user.id].jewel + ' db a hátizsákban||'
            }
        ])
        .setColor(Color.Highlight)
    const buttonTokenToMoney = new ButtonBuilder()
        .setLabel("🎫➜💵")
        .setCustomId("marketTokenToMoney")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonTicketToMoney = new ButtonBuilder()
        .setLabel("🎟️➜💵")
        .setCustomId("marketTicketToMoney")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonJewelToMoney = new ButtonBuilder()
        .setLabel("💍➜💵")
        .setCustomId("marketJewelToMoney")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonMoneyToJewel = new ButtonBuilder()
        .setLabel("💵➜💍")
        .setCustomId("marketMoneyToJewel")
        .setStyle(Discord.ButtonStyle.Secondary)

    if (database.dataBackpacks[user.id].quizTokens <= 0) {
        buttonTokenToMoney.setDisabled(true)
    }
    if (database.dataBackpacks[user.id].tickets <= 0) {
        buttonTicketToMoney.setDisabled(true)
    }
    if (database.dataBackpacks[user.id].jewel <= 0) {
        buttonJewelToMoney.setDisabled(true)
    }
    if (database.dataBasic[user.id].money < values.jewel) {
        buttonMoneyToJewel.setDisabled(true)
    }

    const buttonExit = new ButtonBuilder()
        .setLabel("❌")
        .setCustomId("marketClose")
        .setStyle(Discord.ButtonStyle.Secondary)

    const mainRow = new ActionRowBuilder()
        .addComponents(buttonTokenToMoney, buttonTicketToMoney, buttonJewelToMoney, buttonMoneyToJewel)
    if (privateCommand === false) {
        const secondaryRow = new ActionRowBuilder()
        secondaryRow.addComponents(buttonExit)
        return { embeds: [ newEmbed ], components: [ mainRow, secondaryRow ], ephemeral: false }
    }
    return { embeds: [ newEmbed ], components: [ mainRow ], ephemeral: true }
}

/**
 * @param {Discord.ButtonInteraction<Discord.CacheType>} e
 * @param {DatabaseManager} database
 */
function OnButton(e, database) {
    const privateCommand = database.dataBasic[e.user.id].privateCommands

    if (e.component.customId.startsWith('market')) {
        const values = GetValues()
        const money = database.dataBasic[e.user.id].money
        const buyItem = e.component.customId.replace('market', '')
        if (buyItem == 'TokenToMoney') {
            if (database.dataBackpacks[e.user.id].quizTokens > 0) {
                database.dataBasic[e.user.id].money += values.token
                database.dataBackpacks[e.user.id].quizTokens -= 1
                database.SaveDatabase()

                e.update(OnCommand(database, database.dataMarket, e.user, privateCommand))
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'TicketToMoney') {
            if (database.dataBackpacks[e.user.id].tickets > 0) {
                database.dataBasic[e.user.id].money += values.coupon
                database.dataBackpacks[e.user.id].tickets -= 1
                database.SaveDatabase()

                e.update(OnCommand(database, database.dataMarket, e.user, privateCommand))
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'JewelToMoney') {
            if (database.dataBackpacks[e.user.id].jewel > 0) {
                database.dataBasic[e.user.id].money += Number.parseInt(values.jewel)
                database.dataBackpacks[e.user.id].jewel -= 1
                database.SaveDatabase()

                e.update(OnCommand(database, database.dataMarket, e.user, privateCommand))
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'MoneyToJewel') {
            if (money >= Number.parseInt(database.dataMarket.prices.jewel)) {
                database.dataBasic[e.user.id].money -= Number.parseInt(values.jewel)
                database.dataBackpacks[e.user.id].jewel += 1
                database.SaveDatabase()

                e.update(OnCommand(database, database.dataMarket, e.user, privateCommand))
            } else {
                e.reply({ content: '> \\❌ **Nincs elég pénzed!**', ephemeral: true })
            }
        } else if (buyItem == 'Close') {
            e.message.delete()
        }
        return true
    }

    return false
}

module.exports = { GetValues, OnCommand, OnButton }