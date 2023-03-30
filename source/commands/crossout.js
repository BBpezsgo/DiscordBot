// @ts-check

const Discord = require('discord.js')
const { Color } = require('../functions/enums')
const LogError = require('../functions/errorLog')
const CrossoutDB = require('../services/crossoutdb')

function lbl(txt) { return '**`' + txt + '`**' }

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
 * @param {string | CrossoutDB.SearchOptions} searchName
 */
function GetItem(command, searchName) {
    GetItemEmbed(searchName)
        .then(result => command.editReply(result))
        .catch(error => {
            if (typeof error === 'string') {
                command.editReply(error)
                return
            }
            command.editReply({ content: '> \\❌ **Error:** ' + error.toString() })
            LogError(error)
        })
}

/**
 * @param {string | number | CrossoutDB.SearchOptions} options
 * @returns {Promise<Discord.BaseMessageOptions>}
 */
function GetItemEmbed(options) {
    /** @returns {Discord.BaseMessageOptions} */
    const GetItemEmbed_ = function(/** @type {CrossoutDB.Item<CrossoutDB.ItemStats[]>} */ item) {
        const embed = new Discord.EmbedBuilder()
            .setColor(Color.Warning)
            .setAuthor({name: 'Crossout DB', iconURL: 'https://crossoutdb.com/img/crossoutdb_logo_compact.png', url: 'https://crossoutdb.com/'})
            .setThumbnail('https://crossoutdb.com' + item.imagePath)
            .setTitle(item.name)
            .setDescription(
                lbl(item.rarityName) + '  ' +
                lbl(item.categoryName) + '  ' +
                lbl(item.typeName) + '  ' +
                lbl(item.faction) + '  ' + '\n\n' +
                item.description.replace(/\<br\>/g, '\n')
            )
            .addFields([{
                name: '⚖️ Market',
                value:
                    `\\💲 Sell Price: ${item.formatSellPrice} 🅒 (\\👥 ${item.sellOffers} Offers)\n` +
                    `\\💲 Buy Price: ${item.formatBuyPrice} 🅒 (\\👥 ${item.buyOrders} Orders)\n` +
                    `\\🎭 Popularity: ${item.popularity}`
            }])
        if (item.craftingResultAmount > 0) {
            embed.addFields([{
                name: '🛠️ Crafting ' + item.craftingResultAmount + 'x',
                value:
                    '\\💲 Crafting Cost (Sell): ' + item.formatCraftingSellSum + ' 🅒\n' +
                    '\\💲 Crafting Cost (Buy): ' + item.formatCraftingBuySum + ' 🅒'
            }])
        }
        if (item.sortedStats != undefined && item.sortedStats != null) {
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

                'StatMass': '\\🗜️ ',
                'StatTonnageAdd': '\\🗜️ ',

                'StatSolidSurfaceTraction': '\\🛞 ',
                'StatDenseSurfaceTraction': '\\🛞 ',
                'StatCrumblySurfaceTraction': '\\🛞 ',

                'StatEngineSpeedMultiplier': '\\🚗 ',
                'StatEnginePowerMultiplier': '\\🚗 ',
            }
            const statPrefix = {
                'StatAmmoMultiplier': '+',
                'StatEngineSpeedMultiplier': '+',
                'StatEnginePowerMultiplier': '+',
                'StatMassLimit': '+',
                'StatTonnageAdd': '+',
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
                'StatEnginePowerMultiplier': '%',
                'StatMassLimit': 'kg',
                'StatMass': 'kg',
                'StatTonnageAdd': 'kg',
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

            const statEnums = {
                'tires_behaviour.good_epic': 'Good (Epic)',
                'tires_behaviour.normal_epic': 'Normal (Epic)',
                'tires_behaviour.bad_epic': 'Bad (Epic)',
            }

            const statMultiply = {
                'StatEnginePowerMultiplier': 100,
            }

            item.sortedStats.sort((a, b) => a.stat.order - b.stat.order)

            for (const stat of item.sortedStats) {
                if (stat.value === 0 || statHide.includes(stat.key)) { continue }

                if (statIcons[stat.key])
                { statsBuilder += statIcons[stat.key] }

                statsBuilder += stat.stat.name

                if (stat.stat.showProgressBar) {
                    statsBuilder += '\n'
                    statsBuilder += ProgressBar(stat.value, 16) + '  ' + stat.value + '%'
                } else {
                    statsBuilder += ': '

                    if (statPrefix[stat.key]) if (statPrefix[stat.key] !== '+' || stat.value >= 0)
                    { statsBuilder += statPrefix[stat.key] }

                    if (statEnums[stat.value])
                    { statsBuilder += statEnums[stat.value] }
                    else if (statMultiply[stat.key])
                    { statsBuilder += stat.value * statMultiply[stat.key] }
                    else
                    { statsBuilder += stat.value }

                    if (stat.stat.showPercentage)
                    { statsBuilder += ' %'}
                    else if (statSuffix[stat.key])
                    { statsBuilder += ' ' + statSuffix[stat.key] }
                }
                statsBuilder += '\n'
            }

            embed.addFields([{
                name: '📊 Stats',
                value: statsBuilder
            }])
        }
        embed.setTimestamp(new Date(item.timestamp))

        const row = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder({
                style: Discord.ButtonStyle.Secondary,
                customId: `CrossoutDbGetItem-${item.id}`,
                label: 'Refresh',
                emoji: '🔄',
            }))
            .addComponents(new Discord.ButtonBuilder({
                style: Discord.ButtonStyle.Primary,
                customId: `CrossoutDbGetItemRecipe-${item.id}`,
                label: 'Recipe',
            }))

        return {
            embeds: [ embed ],
            // @ts-ignore
            components: [ row ],
        }
    }

    return new Promise((resolve, reject) => {
        if (typeof options === 'number') {
            CrossoutDB.GetItem(options)
                .catch(error => {
                    reject('> \\❌ **Requiest error:** ' + error.toString())
                })
                .then(result => {
                    if (!result) {
                        reject('> \\❌ **Nem található ilyen tárgy**')
                        return
                    }
                
                    resolve(GetItemEmbed_(result))
                })
            return
        }
        CrossoutDB.GetItems(options)
            .catch(error => {
                reject('> \\❌ **Requiest error:** ' + error.toString())
            })
            .then(rawResult => {
                if (!rawResult) {
                    reject('> \\❌ **Nem található ilyen tárgy**')
                    return
                }
                if (rawResult.length === 0) {
                    reject('> \\❌ **Nem található ilyen tárgy**')
                    return
                }
                resolve(GetItemEmbed_(rawResult[0]))
            })
    })
}

/**
 * @param {number} itemID
 * @returns {Promise<Discord.BaseMessageOptions>}
 */
function GetRecipeEmbed(itemID) {
    return new Promise((resolve, reject) => {
        CrossoutDB.GetRecipe(itemID)
            .catch(error => {
                reject('> \\❌ **Requiest error:** ' + error.toString())
            })
            .then(result => {
                if (!result) {
                    reject('> \\❌ **No content recived**')
                    return
                }
    
                const recipe = result.recipe
                const item = recipe.item
    
                const embed = new Discord.EmbedBuilder()
                    .setColor(Color.Warning)
                    .setAuthor({name: 'Crossout DB', iconURL: 'https://crossoutdb.com/img/crossoutdb_logo_compact.png', url: 'https://crossoutdb.com/'})
                    .setThumbnail('https://crossoutdb.com' + item.imagePath)
                    .setTitle(item.name)
                    .setDescription(
                        lbl(item.rarityName) + '  ' +
                        lbl(item.categoryName) + '  ' +
                        lbl(item.typeName) + '  ' +
                        lbl(item.faction) + '\n' +
                        `${
                            item.craftVsBuy === 'Buy' ? 'You should buy it' :
                            item.craftVsBuy === 'cRAFT' ? 'You should CRAFT it' :
                            ''
                        }`
                    )
    
                embed.addFields({
                    inline: false,
                    name: `🛠️ Crafting ${recipe.number}x`,
                    value:
                        `\\💲 Crafting Cost (Sell): ${recipe.sumBuyFormat} 🅒\n` +
                        `\\💲 Crafting Cost (Buy): ${recipe.sumSellFormat} 🅒`
                })
    
                const benches = [ 447 ]
    
                for (const ingredient of recipe.ingredients) {
                    if (benches.includes(ingredient.item.id)) {
                        embed.addFields({
                            inline: true,
                            name: `Bench Cost`,
                            value: `${ingredient.item.formatBuyPrice} 🅒`
                        })
                        continue
                    }
    
                    embed.addFields({
                        inline: true,
                        name: `${ingredient.item.name} ${ingredient.number}x`,
                        value: `${ingredient.formatBuyPriceTimesNumber} 🅒`
                    })
                }
    
                embed.setTimestamp(new Date(item.timestamp))
    
                const row = new Discord.ActionRowBuilder()
                    .addComponents(new Discord.ButtonBuilder({
                        style: Discord.ButtonStyle.Secondary,
                        customId: `CrossoutDbGetItemRecipe-${item.id}`,
                        label: 'Refresh',
                        emoji: '🔄',
                    }))
                    .addComponents(new Discord.ButtonBuilder({
                        style: Discord.ButtonStyle.Primary,
                        customId: `CrossoutDbGetItem-${item.id}`,
                        label: 'Item',
                    }))
    
                resolve({
                    embeds: [ embed ],
                    // @ts-ignore
                    components: [ row ],
                })
            })
    })
}

/**
 * @param {Discord.ButtonInteraction<Discord.CacheType>} e
 * @param {boolean} ephemeral
 */
function OnButton(e, ephemeral) {
    if (e.customId.startsWith('CrossoutDbGetItemRecipe')) {
        GetRecipeEmbed(Number.parseInt(e.customId.split('-')[1]))
            .then(result => e.update(result))
            .catch(error => {
                if (typeof error === 'string') {
                    e.reply({ content: error.toString(), ephemeral })
                    return
                }
                e.reply({ content: '> \\❌ **Error:** ' + error.toString(), ephemeral })
                LogError(error)
            })
        return true
    }
    if (e.customId.startsWith('CrossoutDbGetItem')) {
        GetItemEmbed(Number.parseInt(e.customId.split('-')[1]))
            .then(result => e.update(result))
            .catch(error => {
                if (typeof error === 'string') {
                    e.reply({ content: error, ephemeral })
                    return
                }
                e.reply({ content: '> \\❌ **Error:** ' + error.toString(), ephemeral })
                LogError(error)
            })
        return true
    }

    return false
}

module.exports = { GetItem, OnButton }