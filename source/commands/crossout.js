const Discord = require('discord.js')
const { Color } = require('../functions/enums')
const CrossoutDB = require('../services/crossoutdb')

function lbl(txt) {
    return '**`' + txt + '`**'
}

/** @param {string} key @param {CrossoutDB.SearchResult} data */
function GetObjectFromKey(key, data) {
    const dataList = data.sortedStats
    if (!dataList) { return null }
    for (let i = 0; i < dataList.length; i++) {
        const dataElement = dataList[i]
        if (dataElement.key == key) {
            return dataElement
        }
    }
    return null
}

/** @param {string} key @param {CrossoutDB.SearchResult} data @param {(result: CrossoutDB.SearchResultStat) => void} callback */
function TryGetKey(key, data, callback) {
    const result = GetObjectFromKey(key, data)
    if (result) {
        callback(result)
    }
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

/** @param {Discord.CommandInteraction<Discord.CacheType>} command */
function CrossoutTest(command, searchName, privateCommand) {
    CrossoutDB.SearchFor(searchName)
        .catch(error => {
            command.editReply({ content: '> \\❌ **Requiest error:** ' + error.toString() })
        })
        .then(result => {
            if (!result) {
                command.editReply({ content: '> \\❌ **Nem található ilyen tárgy**' })
                return
            }

            const embed = new Discord.EmbedBuilder()
                .setColor(Color.Warning)
                .setAuthor({name: 'Crossout DB', iconURL: 'https://crossoutdb.com/favicon.ico', url: 'https://crossoutdb.com/'})
                .setThumbnail('https://crossoutdb.com' + result.imagePath)
                .setTitle(result.name)
                .setDescription(
                    lbl(result.rarityName) + '  ' +
                    lbl(result.categoryName) + '  ' +
                    lbl(result.typeName) + '  ' +
                    lbl(result.faction) + '  ' + '\n\n' +
                    result.description.replace(/\<br\>/g, '\n')
                )
                .addFields([{
                    name: '⚖️ Market',
                    value:
                        '\\👥 Sell Offers: ' + result.sellOffers + '\n' +
                        '\\💲 Sell Price: ' + result.formatSellPrice + ' 🅒\n' +
                        '\\👥 Buy Orders: ' + result.buyOrders + '\n' +
                        '\\💲 Buy Price: ' + result.formatBuyPrice + ' 🅒\n' +
                        '\\🎭 Popularity: ' + result.popularity
                }])
            if (result.craftingResultAmount > 0) {
                embed.addFields([{
                    name: '🛠️ Crafting ' + result.craftingResultAmount + 'x',
                    value:
                        '\\💲 Crafting Cost (Sell): ' + result.formatCraftingSellSum + ' 🅒\n' +
                        '\\💲 Crafting Cost (Buy): ' + result.formatCraftingBuySum + ' 🅒'
                }])
            }
            if (result.sortedStats != undefined && result.sortedStats != null) {
                var statsBuilder = ''

                const statIcons = {
                    'StatPercentDamageRating': '\\💥 ',
                    'StatPercentRangeRating': '\\☄️ ',
                    'StatPercentAccuracyRating': '\\🎯 ',
                    'StatPercentOverheatRating': '\\🔥 ',
                    'StatAmmo': '\\🧰 ',
                    'StatAmmoMultiplier': '\\🧰 ',
                    'StatStructure': '\\🛡️ ',
                    'StatEnergyDrain': '\\⚡ ',
                    'StatPower': '\\⚡ ',
                    'StatPowerScore': '\\⚙️ ',
                    'StatPercentFireRateRating': '\\⏱️ ',

                    'StatBlastDamage': '\\🧨 ',
                    'StatBlastImpulse': '\\🧨 ',
                    'StatBlastRadius': '\\🧨 ',

                    'StatSpreadStatic': '\\💫 ',
                    'StatMaximumSpreadStatic': '\\💫 ',
                    
                    'StatRecoil': '\\🥊 ',
                    'StatRequiredLevel': '\\🏅 ',

                    'StatProjectileVelocity': '\\🥏 ',
                    'StatBallisticImpulse': '\\🥏 ',
                    'StatBallisticDamage': '\\🥏 ',
                }
                const statPrefix = {
                    'StatAmmoMultiplier': '+',
                    'StatEngineSpeedMultiplier': '+',
                    'StatMassLimit': '+',
                }
                const statSuffix = {
                    'StatPercentDamageRating': '%',
                    'StatPercentRangeRating': '%',
                    'StatPercentAccuracyRating': '%',
                    'StatPercentOverheatRating': '%',
                    'StatAmmo': 'pts',
                    'StatAmmoMultiplier': '%',
                    'StatStructure': 'pts',
                    'StatEnergyDrain': 'pts',
                    'StatPower': 'pts',
                    'StatEngineSpeedMultiplier': '%',
                    'StatMassLimit': 'kg',
                    'StatMass': 'kg',
                }
                const statHide = [
                    'StatHeatIncrease',
                    'StatMaximumHeat',
                    'StatGunDepression',
                    'StatGunElevation',
                    'StatSpreadMoving',
                    'StatMaximumSpreadMoving',
                    'StatSpreadIncrease',
                    'StatSpreadDecrese',
                    'StatSpreadRotationIncrease',

                ]

                result.sortedStats.sort((a, b) => a.stat.order - b.stat.order)

                result.sortedStats.forEach(stat => {
                    if (stat.value === 0 || statHide.includes(stat.key)) { return }

                    if (statIcons[stat.key])
                    { statsBuilder += statIcons[stat.key] }

                    statsBuilder += stat.stat.name

                    if (stat.stat.showProgressBar) {
                        statsBuilder += '\n'
                        statsBuilder += ProgressBar(stat.value, 16) + '  ' + stat.value + '%'
                    } else {
                        statsBuilder += ': '

                        if (statPrefix[stat.key])
                        { statsBuilder += statPrefix[stat.key] }

                        statsBuilder += stat.value

                        if (stat.stat.showPercentage)
                        {  statsBuilder += ' %'}
                        else if (statSuffix[stat.key])
                        { statsBuilder += ' ' + statSuffix[stat.key] }
                    }
                    statsBuilder += '\n'
                })

                /*
                TryGetKey('StatPercentDamageRating', result, (stat) => {
                    statsBuilder +=
                    '\\💥 Damage:\n' + ProgressBar(stat.value, 16) + '  ' + stat.value + '%'
                    +'\n'
                })
                TryGetKey('StatPercentFireRateRating', result, (stat) => {
                    statsBuilder +=
                    'FireRate:\n' + ProgressBar(stat.value, 16) + '  ' + stat.value + '%'
                    +'\n'
                })
                TryGetKey('StatPercentRangeRating', result, (stat) => {
                    statsBuilder +=
                    '\\☄️ Range:\n' + ProgressBar(stat.value, 16) + '  ' + stat.value + '%'
                    +'\n'
                })
                TryGetKey('StatPercentAccuracyRating', result, (stat) => {
                    statsBuilder +=
                    '\\🎯 Accuracy:\n' + ProgressBar(stat.value, 16) + '  ' + stat.value + '%'
                    +'\n'
                })
                TryGetKey('StatPercentOverheatRating', result, (stat) => {
                    statsBuilder +=
                    '\\🔥 Overheat:\n' + ProgressBar(stat.value, 16) + '  ' + stat.value + '%'
                    +'\n'
                })
                TryGetKey('StatAmmo', result, (stat) => {
                    statsBuilder +=
                    '\\🧰 Ammo: ' + stat.value + ' pcs'
                    +'\n'
                })
                TryGetKey('StatStructure', result, (stat) => {
                    statsBuilder +=
                    '\\🛡️ Structure: ' + stat.value + ' pts'
                    +'\n'
                })
                TryGetKey('StatEnergyDrain', result, (stat) => {
                    statsBuilder +=
                    '\\⚡ EnergyDrain: ' + stat.value
                    +'\n'
                })
                TryGetKey('StatMass', result, (stat) => {
                    statsBuilder +=
                    'Mass: ' + stat.value + ' kg'
                    +'\n'
                })
                TryGetKey('StatPowerScore', result, (stat) => {
                    statsBuilder +=
                    'Power Score: ' + stat.value
                    +'\n'
                })
                TryGetKey('StatMaximumDeployablesUnits', result, (stat) => {
                    statsBuilder +=
                    'Maximum Deployable Units: ' + stat.value
                    +'\n'
                })
                TryGetKey('StatEngineSpeedMultiplier', result, (stat) => {
                    statsBuilder +=
                    'Max. Speed: ' + stat.value
                    +'\n'
                })
                TryGetKey('StatEnginePowerMultiplier', result, (stat) => {
                    statsBuilder +=
                    'Power: ' + stat.value
                    +'\n'
                })
                TryGetKey('StatMassLimit', result, (stat) => {
                    statsBuilder +=
                    'Mass Limit: +' + stat.value + ' kg'
                    +'\n'
                })
                */

                embed.addFields([{
                    name: '📊 Stats',
                    value: statsBuilder
                }])
            }
            embed.setTimestamp(new Date(result.timestamp))

            command.editReply({ embeds: [embed] })
        })
}

module.exports = { CrossoutTest }