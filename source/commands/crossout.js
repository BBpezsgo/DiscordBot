const Discord = require('discord.js')
const fs = require('fs')
const request = require("request")
const { Color } = require('../functions/enums')

function lbl(txt) {
    return '**`' + txt + '`**'
}

/**@param {string} key */
function GetObjectFromKey(key, data) {
    /**@type {any[]} */
    const dataList = data.sortedStats
    for (let i = 0; i < dataList.length; i++) {
        const dataElement = dataList[i];
        if (dataElement.key == key) {
            return dataElement
        }
    }
    return null
}

/**@param {number} val @param {number} width Width in characters @param {number} max */
function ProgressBar(val, width, max = 100) {
    let bar = ''
    const valPercent = val / max
    for (let x = 0; x < width; x++) {
        const xPercent = x / width
        if (xPercent < valPercent) {
            bar += '█'
        } else {
            bar += '░'
        }
    }
    return bar
}

/**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
*/
function CrossoutTest(command) {
    let url = 'https://crossoutdb.com/api/v1/items?query=Lupara'

    request(url, function (err, response, body) {
        if (err) {
            command.editReply('> \\❌ **Requiest error:** ' + err.toString())
        } else {
            const data = JSON.parse(fs.readFileSync('C:/Users/bazsi/Desktop/items.json', 'utf-8'))[0]  //JSON.parse(body)[0]

            if (data == undefined) {
                command.editReply('> \\❌ **Nem található ilyen tárgy**')
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(Color.Warning)
                    .setAuthor({name: 'Crossout DB', iconURL: 'https://crossoutdb.com/favicon.ico', url: 'https://crossoutdb.com/'})
                    .setThumbnail('https://crossoutdb.com' + data.imagePath)
                    .setTitle(data.name)
                    .setDescription(
                        lbl(data.rarityName) + '  ' +
                        lbl(data.categoryName) + '  ' +
                        lbl(data.typeName) + '  ' +
                        lbl(data.faction) + '  ' + '\n\n' +
                        data.description
                    )
                    .addField('Market',
                        'Sell Offers: ' + data.sellOffers + '\n' +
                        'Sell Price: ' + data.formatSellPrice + ' 🅒\n' +
                        'Buy Orders: ' + data.buyOrders + '\n' +
                        'Buy Price: ' + data.formatBuyPrice + ' 🅒\n' +
                        'Popularity: ' + data.popularity + '\n' +
                        'Demand/Supply: ' + data.popularity
                    )
                    .addField('Crafting ' + data.craftingResultAmount + 'x',
                        'Crafting Cost (Sell): ' + data.formatCraftingSellSum + ' 🅒\n' +
                        'Crafting Cost (Buy): ' + data.formatCraftingBuySum + ' 🅒'
                    )
                    .addField('Stats',
                        'StatPercentDamageRating:\n' + ProgressBar(GetObjectFromKey('StatPercentDamageRating', data).value, 16) + '  ' + GetObjectFromKey('StatPercentDamageRating', data).value + '%' + '\n' +
                        'StatPercentFireRateRating:\n' + ProgressBar(GetObjectFromKey('StatPercentFireRateRating', data).value, 16) + '  ' + GetObjectFromKey('StatPercentFireRateRating', data).value + '%' + '\n' +
                        'StatPercentRangeRating:\n' + ProgressBar(GetObjectFromKey('StatPercentRangeRating', data).value, 16) + '  ' + GetObjectFromKey('StatPercentRangeRating', data).value + '%' + '\n' +
                        'StatPercentAccuracyRating:\n' + ProgressBar(GetObjectFromKey('StatPercentAccuracyRating', data).value, 16) + '  ' + GetObjectFromKey('StatPercentAccuracyRating', data).value + '%' + '\n' +
                        'StatPercentOverheatRating:\n' + ProgressBar(GetObjectFromKey('StatPercentOverheatRating', data).value, 16) + '  ' + GetObjectFromKey('StatPercentOverheatRating', data).value + '%' + '\n\n' +
                        'Ammo: ' + GetObjectFromKey('StatAmmo', data).value + ' pcs\n' +
                        'StatStructure: ' + GetObjectFromKey('StatStructure', data).value + ' pts\n' +
                        'StatEnergyDrain: ' + GetObjectFromKey('StatEnergyDrain', data).value + ' pts\n' +
                        'StatMass: ' + GetObjectFromKey('StatMass', data).value + ' kg'
                    )
                    .setTimestamp(new Date(data.timestamp))
    
                command.editReply({embeds: [embed]})
            }
        }
    })
}

module.exports = { CrossoutTest }