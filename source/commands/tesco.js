const Tesco = require('../functions/tesco')
const Discord = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')

/** @param {Discord.CommandInteraction<Discord.CacheType>} command */
module.exports = async (command) => {
    await command.deferReply()
    const searchResult = await Tesco.SearchFor(command.options.get('search').value)
    if (searchResult.error) {
        await command.editReply({ content: `> \\❌ ${searchResult.error}` })
        return
    }

    if (searchResult.result === undefined) {
        await command.editReply({ content: `> \\❌ Recived nothing` })
        return
    }
    
    /** @type {(Discord.APIEmbed | Discord.JSONEncodable<Discord.APIEmbed>)[]} */
    const embeds = []
    searchResult.result.forEach(item => {
        try {
            if (embeds.length < 5) {
                const embed = new EmbedBuilder()
        
                embed.setTitle(item.name)
                embed.setThumbnail(item.imageUrl)
                embed.setURL(item.url)
                embed.setDescription(
                    `💶 ${item.price} ||${item.price2}||`
                )
                embed.setColor('#00539f')
                if (item.discount) {
                    embed.addFields([{
                        name: '💸' + item.discount.desc,
                        value: item.discount.validUntil
                    }])
                }
        
                embeds.push(embed)
            }
        } catch (error) {}
    })
    await command.editReply({ embeds: embeds })
}
