const Tesco = require('../services/tesco')
const Discord = require('discord.js')
const fs = require('fs')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')

/** @param {Discord.CommandInteraction<Discord.CacheType>} command */
module.exports = async (command) => {
    await command.deferReply()
    Tesco.SearchFor(command.options.get('search').value)
        .then(async searchResult => {
            if (searchResult.result === undefined) {
                await command.editReply({ content: `> \\❌ Recived nothing` })
                return
            }
        
            if (searchResult.result.length === 0) {
                await command.editReply({ content: `> \\❌ No results` })
                return
            }

            if (!fs.existsSync('./cache/tesco/')) { fs.mkdirSync('./cache/tesco/', { recursive: true }) }
            fs.writeFileSync('./cache/tesco/result.json', JSON.stringify(searchResult.result, null, ' '), 'utf-8')
            
            /** @type {(Discord.APIEmbed | Discord.JSONEncodable<Discord.APIEmbed>)[]} */
            const embeds = []
            searchResult.result.forEach(item => {
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
                    const LogError = require('../functions/errorLog')
                    LogError(error)
                }
            })
            await command.editReply({ embeds: embeds })
        })
        .catch(async error => {
            await command.editReply({ content: `> \\❌ ${error}` })
        })
}
