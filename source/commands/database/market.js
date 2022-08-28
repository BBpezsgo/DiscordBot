const Discord = require('discord.js')
const fs = require('fs')
const { DatabaseManager } = require('../../functions/databaseManager.js')
const { Color } = require('../../functions/enums')
const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { abbrev } = require('../../functions/abbrev')

/**
 * @param {DatabaseManager} database
 * @param {boolean} privateCommand
*/
module.exports = (database, dataMarket, user, privateCommand = false) => {
    const newEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setTitle('Piac')
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/balance-scale_2696-fe0f.png')
        .addFields([
            {
                name: '\\💵 Egyenleged:',
                value: '**' + abbrev(database.dataBasic[user.id].money) + '**',
                inline: true
            },
            {
                name: 'Ajánlatok:',
                value:
                    '> 1\\🎫||' + database.dataBackpacks[user.id].quizTokens + ' db a hátizsákban|| ➜ ' + dataMarket.prices.token + '\\💵\n' +
                    '> 1\\🎟️||' + database.dataBackpacks[user.id].tickets + ' db a hátizsákban|| ➜ ' + dataMarket.prices.coupon + '\\💵\n' +
                    '> 1\\💍||' + database.dataBackpacks[user.id].jewel + ' db a hátizsákban|| ➜ ' + dataMarket.prices.jewel + '\\💵\n' +
                    '> ' + dataMarket.prices.jewel + '\\💵 ➜ 1\\💍||' + database.dataBackpacks[user.id].jewel + ' db a hátizsákban||'
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
    if (database.dataBasic[user.id].money < Number.parseInt(dataMarket.prices.jewel)) {
        buttonMoneyToJewel.setDisabled(true)
    }

    const buttonExit = new ButtonBuilder()
        .setLabel("❌")
        .setCustomId("marketClose")
        .setStyle(Discord.ButtonStyle.Secondary)

    const row = new ActionRowBuilder()
        .addComponents(buttonTokenToMoney, buttonTicketToMoney, buttonJewelToMoney, buttonMoneyToJewel)
    const row2 = new ActionRowBuilder()
    if (privateCommand == false) {
        row2.addComponents(buttonExit)
    }
    return { embeds: [newEmbed], components: [row, row2], ephemeral: privateCommand }
}
