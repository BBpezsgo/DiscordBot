const Tesco = require('../services/tesco')
const Discord = require('discord.js')
const fs = require('fs')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

/** @param {Discord.CommandInteraction<Discord.CacheType>} command */
module.exports = async (command) => {
    await command.deferReply()
    Tesco.SearchFor(command.options.get('search').value.toString())
        .then(async searchResult => {
            const result = searchResult.result
            if (!result) {
                await command.editReply({ content: `> \\❌ Recived nothing` })
                return
            }
        
            if (result.products.length === 0) {
                await command.editReply({ content: `> \\❌ No results` })
                return
            }

            if (!fs.existsSync(Path.join(CONFIG.paths.base, './cache/tesco/'))) { fs.mkdirSync(Path.join(CONFIG.paths.base, './cache/tesco/'), { recursive: true }) }
            fs.writeFileSync(Path.join(CONFIG.paths.base, './cache/tesco/result.json'), JSON.stringify(result, null, ' '), 'utf-8')
            
            /** @type {(Discord.APIEmbed | Discord.JSONEncodable<Discord.APIEmbed>)[]} */
            const embeds = []
            result.products.forEach(item => {
                try {
                    if (embeds.length < 5) {
                        const embed = new EmbedBuilder()
                        embed.setColor('#00539f')

                        if (typeof item === 'string') {
                            embed.setTitle('ℹ️ ' + item)                    
                            embeds.push(embed)
                            return
                        }
                
                        embed.setTitle(item.name)
                        embed.setThumbnail(item.imageUrl)
                        embed.setURL(item.url)
                        embed.setDescription(
                            `💶 ${item.price} ||${item.price2}||`
                        )
                        if (item.discount) {
                            embed.addFields([{
                                name: '💸' + item.discount.desc,
                                value: item.discount.validUntil
                            }])
                        }
                
                        embeds.push(embed)
                    }
                } catch (error) {
                    require('../functions/errorLog').LogError(error)
                }
            })

            var content = 'Categories:'
            for (const category of result.categories) {
                content += `\n> ${category.name} (${category.size})`
            }

            await command.editReply({ embeds: embeds })
        })
        .catch(async error => {
            await command.editReply({ content: `> \\❗ ${error}` })
        })
}
