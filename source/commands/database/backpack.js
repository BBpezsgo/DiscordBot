const Discord = require('discord.js')
const GetUserColor = require('../../functions/userColor')
const { abbrev } = require('../../functions/abbrev')
const { DatabaseManager } = require('../../functions/databaseManager')

/**
 * @param {Discord.BaseInteraction<Cached>} e 
 * @param {DatabaseManager} database
 * @param {boolean} privateCommand
 * @returns {Discord.InteractionReplyOptions}
 */
function GetEmbed(e, database, privateCommand) {
    const sender = e.user
    var dayCrates = (database.dataBot.day - database.dataBasic[sender.id].day) / 7
    var crates = database.dataBackpacks[sender.id].crates
    var gifts = database.dataBackpacks[sender.id].gifts
    var tickets = database.dataBackpacks[sender.id].tickets
    var getGifts = database.dataBackpacks[sender.id].getGift
    var quizTokens = database.dataBackpacks[sender.id].quizTokens
    var smallLuckyCard = database.dataBackpacks[sender.id].luckyCards.small
    var mediumLuckyCard = database.dataBackpacks[sender.id].luckyCards.medium
    var largeLuckyCard = database.dataBackpacks[sender.id].luckyCards.large
    var money = database.dataBasic[sender.id].money

    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: sender.username, iconURL: sender.avatarURL() })
        .setTitle('Hátizsák')
        .addFields([
            { name: 'Pénz', value: '\\💵 ' + abbrev(money), inline: false },
            {
                name: 'Alap cuccok', value: 
                '> \\🧱 ' + crates + ' láda\n' +
                '> \\🎁 ' + gifts + ' ajándék\n' +
                '> \\🎟️ ' + tickets + ' kupon\n' +
                '> \\🎫 ' + quizTokens + ' Quiz Token\n' +
                '> \\🧰 ' + Math.floor(dayCrates) + ' heti láda',
                inline: false
            },
            {
                name: 'Sorsjegyek', value: 
                '> \\💶 ' + smallLuckyCard + ' Black Jack\n' +
                '> \\💷 ' + mediumLuckyCard + ' Buksza\n' +
                '> \\💴 ' + largeLuckyCard + ' Fáraók Kincse',
                inline: false
            }
        ])
        .setFooter({ text: 'Ha használni szeretnéd az egyik cuccodat, kattints az ikonjára!' })
        .setColor(GetUserColor(database.dataBasic[sender.id].color))
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/281/briefcase_1f4bc.png')
    if (getGifts > 0) {
        if (getGifts == 1) {
            embed.addFields([{ name: 'Van egy ajándékod, ami kicsomagolásra vár', value: 'Kattints a \\🎀-ra a kicsomagoláshoz!' }])
        } else {
            embed.addFields([{ name: 'Van ' + getGifts + ' ajándékod, ami kicsomagolásra vár', value: 'Kattints a \\🎀-ra a kicsomagoláshoz!' }])
        }
    }
    const buttonCrate = new Discord.ButtonBuilder()
        .setLabel("🧱")
        .setCustomId("openCrate")
        .setStyle(Discord.ButtonStyle.Primary)
    const buttonDayCrate = new Discord.ButtonBuilder()
        .setLabel("🧰")
        .setCustomId("openDayCrate")
        .setStyle(Discord.ButtonStyle.Primary)
    const buttonLuckyCardSmall = new Discord.ButtonBuilder()
        .setLabel("💶")
        .setCustomId("useLuckyCardSmall")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonLuckyCardMedium = new Discord.ButtonBuilder()
        .setLabel("💷")
        .setCustomId("useLuckyCardMedium")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonLuckyCardLarge = new Discord.ButtonBuilder()
        .setLabel("💴")
        .setCustomId("useLuckyCardLarge")
        .setStyle(Discord.ButtonStyle.Secondary)
    const buttonOpenGift = new Discord.ButtonBuilder()
        .setLabel("🎀")
        .setCustomId("openGift")
        .setStyle(Discord.ButtonStyle.Primary)
    const buttonSendGift = new Discord.ButtonBuilder()
        .setLabel("🎁")
        .setCustomId("sendGift")
        .setStyle(Discord.ButtonStyle.Secondary)
    if (!crates > 0) { buttonCrate.setDisabled(true) }
    if (!(Math.floor(dayCrates)) > 0) { buttonDayCrate.setDisabled(true) }
    if (!smallLuckyCard > 0) { buttonLuckyCardSmall.setDisabled(true) }
    if (!mediumLuckyCard > 0) { buttonLuckyCardMedium.setDisabled(true) }
    if (!largeLuckyCard > 0) { buttonLuckyCardLarge.setDisabled(true) }
    if (!getGifts > 0) { buttonOpenGift.setDisabled(true) }
    if (!gifts > 0) { buttonSendGift.setDisabled(true) }
    const rowPrimary = new Discord.ActionRowBuilder()
        .addComponents(buttonCrate, buttonDayCrate, buttonLuckyCardSmall, buttonLuckyCardMedium, buttonLuckyCardLarge)
    const rowSecondary = new Discord.ActionRowBuilder()
        .addComponents(buttonSendGift)
    if (getGifts > 0) { rowSecondary.addComponents(buttonOpenGift) }
    return { embeds: [embed], components: [rowPrimary, rowSecondary], ephemeral: privateCommand }
}

/**
 * @param {Discord.CommandInteraction<Discord.CacheType>} e 
 * @param {DatabaseManager} database
 * @param {boolean} privateCommand
 */
function OnCommand(e, database, privateCommand) { e.reply(GetEmbed(e, database, privateCommand)) }

/**
 * @param {number} userId
 * @param {DatabaseManager} database
 * @returns {string} The result string
 */
function openDayCrate(userId, database) {
    const RandomPercente = Math.floor(Math.random() * 100)
    let val = 0
    if (RandomPercente < 10) { // 10%
        val = 1
        database.dataBackpacks[userId].tickets += val

        return 0 + '|' + val
    } else if (RandomPercente < 30) { // 20%
        val = 1
        database.dataBackpacks[userId].crates += val

        return 1 + '|' + val
    } else if (RandomPercente < 60) { // 30%
        val = Math.floor(Math.random() * 50) + 30
        database.dataBasic[userId].score += val

        return 2 + '|' + val
    } else { // 40%
        val = Math.floor(Math.random() * 300) + 100
        database.dataBasic[userId].money += val

        return 3 + '|' + val
    }
}

/**
 * @param {Discord.ButtonInteraction<Discord.CacheType>} e
 * @param {DatabaseManager} database
 */
function OnButtonClick(e, database) {
    const privateCommand = database.dataBasic[e.user.id].privateCommands

    if (e.component.customId === 'openDayCrate') {
        if (Math.floor((database.dataBot.day - database.dataBasic[e.user.id].day) / 7) <= 0) {
            e.reply({ content: '> **\\❌ Már kinyitottad a heti ládádat!*', ephemeral: true })
        } else {
            const rewald = openDayCrate(e.user.id, database)
            const rewaldIndex = rewald.split('|')[0]
            const rewaldValue = rewald.split('|')[1]
            let txt = ''

            if (rewaldIndex === '2') {
                txt = '**\\🍺 ' + rewaldValue + '** xp-t'
            } else if (rewaldIndex === '3') {
                txt = '**\\💵' + rewaldValue + '** pénzt'
            } else if (rewaldIndex === '1') {
                txt = '**\\🧱 1 ládát**'
            } else if (rewaldIndex === '0') {
                txt = '**\\🎟️ 1 kupont**'
            } else {
                txt = rewald
            }

            e.reply({ content: '> \\🧰 Kaptál:  ' + txt, ephemeral: true })
        }

        database.dataBasic[e.user.id].day += 7
        if (database.dataBasic[e.user.id].day > database.dataBot.day) {
            database.dataBasic[e.user.id].day = database.dataBot.day
        }

        e.message.edit(GetEmbed(e, database, privateCommand))

        database.SaveDatabase()
        return true
    }

    if (e.component.customId === 'openCrate') {
        if (database.dataBackpacks[e.user.id].crates > 0) {
            database.dataBackpacks[e.user.id].crates -= 1
            var replies = ['xp', 'money', 'gift']
            var random = Math.floor(Math.random() * 3)
            var out = replies[random]
            var val = 0
            var txt = ''

            if (out === 'xp') {
                val = Math.floor(Math.random() * 110) + 10
                txt = '**\\🍺 ' + val + '** xp-t'
                database.dataBasic[e.user.id].score += val
            }
            if (out === 'money') {
                val = Math.floor(Math.random() * 2000) + 3000
                txt = '**\\💵' + val + '** pénzt'
                database.dataBasic[e.user.id].money += val
            }
            if (out === 'gift') {
                txt = '**\\🎁 1** ajándékot'
                database.dataBackpacks[e.user.id].gifts += 1
            }

            e.message.edit(GetEmbed(e, database, privateCommand))
            e.reply({ content: '> \\🧱 Kaptál:  ' + txt, ephemeral: true })
            database.SaveDatabase()
        } else {
            e.message.edit(GetEmbed(e, database, privateCommand))
            e.reply({ content: '> \\🧱 Nincs több ládád!', ephemeral: true })
        }

        return true
    }

    if (e.component.customId === 'useLuckyCardSmall') {
        database.dataBackpacks[e.user.id].luckyCards.small -= 1
        var val = 0

        var nyeroszam = Math.floor(Math.random() * 2)
        if (nyeroszam === 1) {
            val = Math.floor(Math.random() * 1001) + 1500
            database.dataBasic[e.user.id].money += val
        }

        if (val === 0) {
            e.reply({ content: '> \\💶 Nyertél:  **semmit**', ephemeral: true })
        } else {
            e.reply({ content: '> \\💶 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true })
        }

        e.message.edit(GetEmbed(e, database, privateCommand))

        database.SaveDatabase()
        return true
    }

    if (e.component.customId === 'useLuckyCardMedium') {
        database.dataBackpacks[e.user.id].luckyCards.medium -= 1
        var val = 0

        var nyeroszam = Math.floor(Math.random() * 4)
        if (nyeroszam === 1) {
            val = Math.floor(Math.random() * 3001) + 3000
            database.dataBasic[e.user.id].money += val
        }

        if (val === 0) {
            e.reply({ content: '> \\💷 Nyertél:  **semmit**', ephemeral: true })
        } else {
            e.reply({ content: '> \\💷 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true })
        }

        e.message.edit(GetEmbed(e, database, privateCommand))

        database.SaveDatabase()
        return true
    }

    if (e.component.customId === 'useLuckyCardLarge') {
        database.dataBackpacks[e.user.id].luckyCards.large -= 1

        if (Math.floor(Math.random() * 9) === 1) {
            const val = Math.floor(Math.random() * 5001) + 6500
            database.dataBasic[e.user.id].money += val
            e.reply({ content: '> \\💴 Nyertél:  **\\💵' + val + '** pénzt', ephemeral: true })
        } else {
            e.reply({ content: '> \\💴 Nyertél:  **semmit**', ephemeral: true })
        }

        e.message.edit(GetEmbed(e, database, privateCommand))

        database.SaveDatabase()
        return true
    }

    return false
}

module.exports = { OnCommand, OnButtonClick }