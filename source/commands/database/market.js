const Discord = require('discord.js')
const fs = require('fs')
const { DatabaseManager } = require('../../functions/databaseManager.js')
const { Color } = require('../../functions/enums')
const { MessageActionRow, MessageButton } = require('discord.js')
const { abbrev } = require('../../functions/abbrev')

/**
 * @param {DatabaseManager} database
 * @param {boolean} privateCommand
*/
module.exports = (database, dataMarket, user, privateCommand = false) => {
    const newEmbed = new Discord.MessageEmbed()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setTitle('Piac')
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/balance-scale_2696-fe0f.png')
        .addField('\\💵 Egyenleged:', '**' + abbrev(database.dataBasic[user.id].money) + '**', true)
        .addField('Ajánlatok: ',
            '> 1\\🎫||' + database.dataBackpacks[user.id].quizTokens + ' db a hátizsákban|| ➜ ' + dataMarket.prices.token + '\\💵\n' +
            '> 1\\🎟️||' + database.dataBackpacks[user.id].tickets + ' db a hátizsákban|| ➜ ' + dataMarket.prices.coupon + '\\💵\n' +
            '> 1\\💍||' + database.dataBackpacks[user.id].jewel + ' db a hátizsákban|| ➜ ' + dataMarket.prices.jewel + '\\💵\n' +
            '> ' + dataMarket.prices.jewel + '\\💵 ➜ 1\\💍||' + database.dataBackpacks[user.id].jewel + ' db a hátizsákban||')
        .setColor(Color.Highlight)
    const buttonTokenToMoney = new MessageButton()
        .setLabel("🎫➜💵")
        .setCustomId("marketTokenToMoney")
        .setStyle("SECONDARY")
    const buttonTicketToMoney = new MessageButton()
        .setLabel("🎟️➜💵")
        .setCustomId("marketTicketToMoney")
        .setStyle("SECONDARY")
    const buttonJewelToMoney = new MessageButton()
        .setLabel("💍➜💵")
        .setCustomId("marketJewelToMoney")
        .setStyle("SECONDARY")
    const buttonMoneyToJewel = new MessageButton()
        .setLabel("💵➜💍")
        .setCustomId("marketMoneyToJewel")
        .setStyle("SECONDARY")

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

    const buttonExit = new MessageButton()
        .setLabel("❌")
        .setCustomId("marketClose")
        .setStyle("SECONDARY")

    const row = new MessageActionRow()
        .addComponents(buttonTokenToMoney, buttonTicketToMoney, buttonJewelToMoney, buttonMoneyToJewel)
    const row2 = new MessageActionRow()
    if (privateCommand == false) {
        row2.addComponents(buttonExit)
    }
    return { embeds: [newEmbed], components: [row, row2], ephemeral: privateCommand }
}
