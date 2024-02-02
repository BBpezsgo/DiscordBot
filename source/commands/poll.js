const { DatabaseManager } = require('../functions/databaseManager')
const Discord = require('discord.js')
const {
    Color
} = require('../functions/enums')

/**
 * @param {DatabaseManager} database
 */
function savePollDefaults(database) {
    if (!database.dataPolls.messageIds) {
        database.dataPolls.messageIds = ''
    }
    if (!database.dataPolls.messages) {
        database. dataPolls.messages = {}
    }
}

/**
 * @param {string} messageId
 * @param {string} title
 * @param {string[]} optionTexts
 * @param {string[]} optionIcons
 * @param {DatabaseManager} database
 */
function addNewPoll(messageId, title, optionTexts, optionIcons, database) {
    savePollDefaults(database)

    /**
     * @type {number[]}
     */
    let vals = []
    /**
     * @type {string[]}
     */
    let usrs = []
    for (let v = 0; v < optionTexts.length; v++) {
        vals.push(0)
    }

    database.dataPolls.messages[messageId] = {
        title: title,
        optionTexts: optionTexts,
        optionIcons: optionIcons,
        optionValues: vals,
        userIds: usrs,
    }

    database.dataPolls.messageIds += "|" + messageId

    database.SaveDatabase()
}

/**
* @param {Discord.Client} client
* @param {string} titleText
* @param {string} listOfOptionText
* @param {string} listOfOptionEmojis
* @param {boolean} wouldYouRather
*/
function poll(client, titleText, listOfOptionText, listOfOptionEmojis, wouldYouRather) {
    const optionEmojis = listOfOptionEmojis.toString().replace(' ', '').split(';')
    const optionTexts = listOfOptionText.toString().replace(' ', '').split(';')
    let optionText = ''
    if (wouldYouRather) {
        for (let i = 0; i < optionTexts.length; i++) {
            optionText += `${optionEmojis[i]}  ${optionTexts[i]}\n`
            if (i < optionTexts.length - 1) {
                optionText += `   vagy\n`
            }
        }
    } else {
        for (let i = 0; i < optionTexts.length; i++) {
            optionText += `${optionEmojis[i]}  ${optionTexts[i]}\n`
        }
    }
    const embed = new Discord.EmbedBuilder()
        .setColor(Color.DarkPink)
        .setTitle('Szavazás!')
        .addFields([{
            name: titleText,
            value: optionText
        }])

    /** @ts-ignore @type {Discord.TextBasedChannel} */
    const channel = client.channels.cache.get('795935090026086410')
    channel.send({ embeds: [embed] })
        .then(message => {
            message.channel.send('> <@&795935996982198272>')
            for (let i = 0; i < optionEmojis.length; i++) {
                if (optionEmojis[i].includes('<')) {
                    message.react(optionEmojis[i].split(':')[2].replace('>', ''))
                } else {
                    message.react(optionEmojis[i])
                }
            }
        })
}

module.exports = { addNewPoll, savePollDefaults, poll }