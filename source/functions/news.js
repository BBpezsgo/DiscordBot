const Discord = require("discord.js")
const { Color } = require('./enums.js')

/**
 * @param {Date} date
 * @returns {string}
 */
 function DateToStringNews(date) {
    let str = ''
    str += date.getFullYear() + '.'
    let monthStr = (date.getMonth() + 1) + '.'
    if (monthStr == '1') {
        monthStr = 'Jan.'
    } else if (monthStr == '2') {
        monthStr = 'Febr.'
    } else if (monthStr == '3') {
        monthStr = 'Márc.'
    } else if (monthStr == '4') {
        monthStr = 'Ápr.'
    } else if (monthStr == '5') {
        monthStr = 'Máj.'
    } else if (monthStr == '6') {
        monthStr = 'Jún.'
    } else if (monthStr == '7') {
        monthStr = 'Júl.'
    } else if (monthStr == '8') {
        monthStr = 'Aug.'
    } else if (monthStr == '9') {
        monthStr = 'Szept.'
    } else if (monthStr == '10') {
        monthStr = 'Okt.'
    } else if (monthStr == '11') {
        monthStr = 'Nov.'
    } else if (monthStr == '12') {
        monthStr = 'Dec.'
    }
    str += ' ' + monthStr
    str += ' ' + date.getDate() + '.'
    str += ' ' + date.getHours() + ':' + date.getMinutes()
    return str
}

/**
 * @param {string} id
 * @returns {string}
 */
function ConvertNewsIdToName(id) {
    if (id == '802864588877856789') {
        return 'Crossout - Bejelentés'
    } else if (id == '802864713323118603') {
        return 'Ingyenes Játékok'
    } else if (id == '813398275305898014') {
        return 'Warzone 2100 - Bejelentés'
    } else if (id == '875340034537062400') {
        return 'Minecraft - Frissítés'
    } else if (id == '726127512521932880') {
        return 'Bejelentés'
    } else {
        return id
    }
}

class NewsMessage {
    /**
     * @param {Discord.MessageEmbed} embed
     * @param {string} NotifyRoleId
     * @param {Discord.Message} message
    */
    constructor(embed, NotifyRoleId, message) {
        this.embed = embed
        this.NotifyRoleId = NotifyRoleId
        this.message = message
    }
}

/** @param {Discord.Message} message */
function CreateNews(message) {
    let role = ''
    const newDate = new Date(message.createdTimestamp)
    const embed = new Discord.MessageEmbed()
        .setAuthor({ name: ConvertNewsIdToName(message.author.id), iconURL: message.author.displayAvatarURL() })
        .setDescription(message.content)
        .setColor(Color.Highlight)
        .setFooter({ text: '• ' + DateToStringNews(newDate) })
    if (message.author.id == '802864588877856789') { // Crossout
        embed.setAuthor({ name: ConvertNewsIdToName(message.author.id), iconURL: message.author.displayAvatarURL(), url: 'https://crossout.net/en/#/' })
        if (message.embeds.length > 0) {
            if (message.content.includes('@Entertainment')) {
                role = '902881176719622145'
            } else if (message.content.includes('@Console News')) {
                role = '902878741364105238'
            } else if (message.content.includes('@PC News')) {
                role = '902878695742652437'
            } else {
                role = '902877945876598784'
            }

            const embed2 = message.embeds[0]

            let title = embed2.title
            if (title.includes('PS4') || title.includes('Xbox') || title.includes('PlayStation')) {
                role = '902878741364105238'
            } else if (title.includes('PC')) {
                role = '902878695742652437'
            }
            title = title
                .replace('[Sale]', '')
                .replace('[Developer blog]', '')
                .replace('[Panorama]', '')
                .replace('[Announcement]', '')
                .replace('[PS4]', '')
                .replace('[Xbox]', '')
                .replace('[Update]', '')
                .replace('[Video]', '')
                .replace('[Special]', '')
                .replace('[PC]', '')
                .replace('[Stories]', '')
                .replace('[Calendar]', '')
            while (title.startsWith(' ')) {
                title = title.substring(1)
            }
            embed.setTitle(title)
            embed.setURL(embed2.url)
            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            embed.setDescription(embed2.description)
            embed.setFooter({ text: message.content.replace('@', '• #') + '\n• ' + DateToStringNews(newDate) })
        }
    } else if (message.author.id == '813398275305898014') { // Warzone 2100
        embed.setAuthor({ name: ConvertNewsIdToName(message.author.id), iconURL: message.author.displayAvatarURL(), url: 'https://wz2100.net/' })
        if (message.embeds.length > 0) {
            const embed2 = message.embeds[0]

            let content = message.content.replace('@everyone:', '').replace('@everyone', '')
            while (content.startsWith(' ')) {
                content = content.substring(1)
            }
            embed.setDescription(content)

            embed.setTitle(embed2.title)
            embed.setURL(embed2.url)
            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            if (embed2.thumbnail != null) {
                embed.setImage(embed2.thumbnail.url)
            }
        }
        role = '902878851938517043'
    } else if (message.author.id == '802864713323118603') { // Free games
        embed.setAuthor({ name: ConvertNewsIdToName(message.author.id), iconURL: message.author.displayAvatarURL() })
        if (message.embeds.length == 1) {
            let content = message.content.replace('@Free Games Ping', '')
            let title = ''
            let url = ''
            while (content.startsWith(' ')) {
                content = content.substring(1)
            }
            const aaaaaa = content.split('\n')
            for (let i = 0; i < aaaaaa.length; i++) {
                const bbbbbb = aaaaaa[i]
                if (i == 0) {
                    title = bbbbbb
                    content = content.replace(bbbbbb, '')
                } else if (i == 1) {
                    url = bbbbbb
                    if (url.startsWith('<http')) {
                        url = url.substring(1)
                    }
                    if (url.endsWith('>')) {
                        url = url.substring(0, url.length - 1)
                    }
                    content = content.replace(bbbbbb, '')
                }
            }

            const embed2 = message.embeds[0]

            embed.setDescription(content)
            embed.setTitle(title)
            embed.setURL(url)

            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            if (embed2.thumbnail != null) {
                embed.setImage(embed2.thumbnail.url)
            }
        }
        role = '902878798956093510'
    } else if (message.author.id == '875340034537062400') { // Minecraft
        embed.setAuthor({ name: ConvertNewsIdToName(message.author.id), iconURL: 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon-32x32.png', url: 'https://www.minecraft.net/en-us' })

        let content = message.content
        let title = ''
        let url = ''
        while (content.startsWith(' ')) {
            content = content.substring(1)
        }
        const contentLines = content.split('\n')
        for (let i = 0; i < contentLines.length; i++) {
            const line = contentLines[i]
            if (i == 0) {
                title = line
                content = content.replace(line, '')
            } else if (i == 1) {
                url = line
                content = content.replace(line, '')
            } else if (i == 2) {
                content = content.substring(1)
            }
        }
        embed.setDescription(content)
        embed.setTitle(title)
        embed.setURL(url)

        if (message.embeds.length == 1) {
            const embed2 = message.embeds[0]

            if (embed2.image != null) {
                embed.setImage(embed2.image.url)
            }
            if (embed2.thumbnail != null) {
                embed.setImage(embed2.thumbnail.url)
            }
        }
        role = '902878964438143026'
    } else { // Other
        if (message.author.bot == false && message.author.system == false) {
            const senderMember = message.guild.members.cache.get(message.author.id)
            if (senderMember != undefined) {
                embed.setAuthor({ name: senderMember.displayName, iconURL: message.author.displayAvatarURL() })
            } else {
                embed.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            }
        }
        if (message.attachments.size > 0) {
            embed.image.url = message.attachments.at(0).url
        }
    }

    return new NewsMessage(embed, role, message)
}

module.exports = { DateToStringNews, ConvertNewsIdToName, NewsMessage, CreateNews }