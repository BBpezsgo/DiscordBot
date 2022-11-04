const Discord = require("discord.js")
const fs = require("fs")
const { Color } = require('./enums.js')
const { StatesManager } = require('./statesManager')
const { FormatError } = require('./formatError')
const { SystemLog } = require('./systemLog')
const ytdl = require("ytdl-core")

class NewsMessage {
    /**
     * @param {Discord.EmbedBuilder} embed
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
async function CreateNews(message) {
    if (message.content == '[Original Message Deleted]') {
        return null
    }

    if (message.author.id == '726127512521932880' && message.content.startsWith('https://www.youtube.com/watch?v=')) {
        const info = await ytdl.getInfo(message.content)
        const vidInfo = info.videoDetails

        var channelIconUrl = undefined
        if (info.videoDetails.author.thumbnails.length > 0) {
            channelIconUrl = info.videoDetails.author.thumbnails[0].url
        }

        const embedYt = new Discord.EmbedBuilder()
        embedYt
            .setAuthor({ name: info.videoDetails.author.name, url: info.videoDetails.author.channel_url, iconURL: channelIconUrl })
            .setTitle(vidInfo.title)
            .setURL(vidInfo.video_url)
            .setImage(`https://i.ytimg.com/vi/${vidInfo.videoId}/maxresdefault.jpg`)
            .setColor('#ff0000')
            .setTimestamp(Date.parse(vidInfo.uploadDate))

        return new NewsMessage(embedYt, '', message)
    }

    let role = ''
    const newDate = new Date(message.createdTimestamp)
    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: 'Bejelentés', iconURL: message.author.displayAvatarURL() })
        .setDescription(message.cleanContent)
        .setColor(Color.Highlight)
        .setTimestamp(newDate)
    
    if (message.author.id == '802864588877856789') { // Crossout
        embed.setAuthor({ name: 'Crossout', iconURL: message.author.displayAvatarURL(), url: 'https://crossout.net/en/#/' })
        
        var NewsContent = message.content.trim()
        
        /** @type {null | "Entertainment" | "General News" | "PC News" | "Console News"} */
        var NewsType = null
        if (NewsContent.startsWith('@')) {
            NewsType = NewsContent.split('\n')[0].trim().substring(1).trim()
            NewsContent = NewsContent.substring(NewsType.length + 1).trim()
        }

        switch (NewsType) {
            case "Console News":
                role = '902878741364105238'
                break
            case "Entertainment":
                role = '902881176719622145'
                break
            case "PC News":
                role = '902878695742652437'
                break
            default:
                role = '902877945876598784'
                break
        }

        const title = NewsContent.split('\n')[0].trim()
        try {
            embed.setTitle(title)
            NewsContent = NewsContent.substring(NewsContent.split('\n')[0].length).trim()
        } catch (e) { }
        embed.setURL('https://crossout.net/en/news/')
        if (message.attachments.size > 0) {
            embed.setImage(message.attachments.first().url)
        }
        if (NewsContent.endsWith('#crossout')) {
            NewsContent = NewsContent.substring(0, NewsContent.length - 9).trim()
        }
        embed.setDescription(NewsContent)
        embed.setFooter({ text: '• #' + NewsType })
    } else if (message.author.id == '813398275305898014') { // Warzone 2100
        embed.setAuthor({ name: 'Warzone 2100', iconURL: 'https://wz2100.net/img/warzone2100.large.png', url: 'https://wz2100.net/' })
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
        embed.setAuthor({ name: 'Game sales', iconURL: message.author.displayAvatarURL() })
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
        embed.setAuthor({ name: 'Minecraft', iconURL: 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon-32x32.png', url: 'https://www.minecraft.net/en-us' })

        let content = message.content.trim()

        const contentLines = content.split('\n')
        for (let i = 0; i < contentLines.length; i++) {
            const line = contentLines[i].trim()
            if (i === 0) {
                embed.setTitle(line)
                content = content.replace(line, '')
            } else if (i === 1) {
                try
                { embed.setURL(line) }
                catch (e)
                { content = line + '\n' + content.trim() }
                content = content.replace(line, '')
            }
        }
        embed.setDescription(content.trim())

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

class NewsManager {
    /** @param {StatesManager} statesManager @param {boolean} enableLogs */
    constructor(statesManager, enableLogs) {
        /** @type {NewsMessage[]} */
        this.listOfNews = []
        /** @type {StatesManager} */
        this.statesManager = statesManager
        /** @type {boolean} */
        this.enableLogs = enableLogs
        /** @type {boolean} */
        this.lastNoNews = false
    }

    /** @param {Discord.Client} client */
    async OnStart(client,) {
        if (this.enableLogs) SystemLog('[NEWS]: Fetch processed news channel...')
        const fetchedProcessedNewsChannel = await client.channels.fetch(NewsProcessedChannel)
        if (fetchedProcessedNewsChannel == null) {
            if (this.enableLogs) SystemLog(`[NEWS]: Can't fetch processed news channel!`)
        }
    
        if (this.enableLogs) SystemLog('[NEWS]: Fetch test news channel...')
        const fetchedCopyNewsChannel = await client.channels.fetch('1010110583800078397')
        if (fetchedCopyNewsChannel == null) {
            if (this.enableLogs) SystemLog(`[NEWS]: Can't fetch test news channel!`)
        }

        if (this.enableLogs) SystemLog('[NEWS]: Fetch news channel...')
        this.statesManager.News.LoadingText = 'Fetch news channel...'
        client.channels.fetch(NewsIncomingChannel, { force: true })
            .then((c) => {
                /** @type {Discord.GuildTextBasedChannel | null} */
                const channel = c
                if (this.enableLogs) SystemLog('[NEWS]: Fetch news messages...')
                this.statesManager.News.LoadingText = 'Fetch news messages...'
                channel.messages.fetch()
                    .then((messages) => {
                        /** @type {Discord.Message<true>[]} */
                        const listOfMessage = []
            
                        if (this.enableLogs) SystemLog(`[NEWS]: Looping messages... (${messages.size})`)
                        this.statesManager.News.LoadingText = 'Looping messages...'
                        messages.forEach((message) => {
                            listOfMessage.push(message)
                        })
            
                        if (this.enableLogs) SystemLog(`[NEWS]: Processing messages... (${listOfMessage.length})`)
                        this.statesManager.News.LoadingText = 'Processing messages...'
                        listOfMessage.reverse()
                        listOfMessage.forEach(message => {
                            this.ProcessMessage(message)
                        })
                    })
                    .catch((error) => {
                        if (this.enableLogs) SystemLog(`[NEWS]: Can't fetch news messages! Reason: ${error}`)
                        if (this.enableLogs) fs.appendFileSync('../node.error.log', FormatError(error) + '\n', { encoding: 'utf-8' })
                    })
            })
            .catch((error) => {
                if (this.enableLogs) SystemLog(`[NEWS]: Can't fetch news channel! Reason: ${error}`)
                if (this.enableLogs) fs.appendFileSync('../node.error.log', FormatError(error) + '\n', { encoding: 'utf-8' })
            })
    }
    
    /** @param {Discord.Client} client */
    TryProcessNext(client) {        
        const DeleteRawNewsMessages = true

        if (this.listOfNews.length > 0) {
            /** @type {Discord.GuildTextBasedChannel | undefined} */
            const newsChannel = client.channels.cache.get(NewsProcessedChannel)

            const newsMessage = this.listOfNews.shift()
            if (newsMessage == null || newsMessage == undefined) { return }
            const embed = newsMessage.embed
            this.statesManager.News.LoadingText2 = 'Send new message...'

            if (this.enableLogs) SystemLog(`[NEWS]: Send copy of news message...`)
            /** @type {Discord.GuildTextBasedChannel | null} */
            const newsTestChannel = client.channels.cache.get('1010110583800078397')
            if (newsTestChannel != null) {
                newsTestChannel.send({
                    tts: newsMessage.message.tts,
                    content: newsMessage.message.content,
                    embeds: newsMessage.message.embeds,
                    components: newsMessage.message.components
                })
                .then(() => {
                    if (this.enableLogs) SystemLog(`[NEWS]: Send processed news message...`)
                    if (newsMessage.NotifyRoleId.length == 0) {
                        newsChannel.send({ embeds: [embed] })
                            .then(() => {
                                if (DeleteRawNewsMessages) {
                                    if (this.enableLogs) SystemLog(`[NEWS]: Delete raw message...`)
                                    this.statesManager.News.LoadingText2 = 'Delete raw message...'
                                    newsMessage.message.delete()
                                        .catch((error) => {
                                            if (this.enableLogs) SystemLog(`[NEWS]: Can't delete raw message! Reason: ${error}`)
                                        })
                                        .finally(() => {
                                            this.statesManager.News.LoadingText2 = ''
                                        })                                    
                                } else {
                                    this.statesManager.News.LoadingText2 = ''
                                }
                            })
                            .catch((error) => {                    
                                if (this.enableLogs) SystemLog(`[NEWS]: Can't send processed news message! Reason: ${error}`)
                            })
                    } else {
                        newsChannel.send({ content: `<@&${newsMessage.NotifyRoleId}>`, embeds: [embed] })
                            .then(() => {
                                if (DeleteRawNewsMessages) {
                                    if (this.enableLogs) SystemLog(`[NEWS]: Delete raw message...`)
                                    this.statesManager.News.LoadingText2 = 'Delete raw message...'
                                    newsMessage.message.delete()
                                        .catch((error) => {
                                            if (this.enableLogs) SystemLog(`[NEWS]: Can't delete raw message! Reason: ${error}`)
                                        })
                                        .finally(() => {
                                            this.statesManager.News.LoadingText2 = ''
                                        })
                                } else {
                                    this.statesManager.News.LoadingText2 = ''
                                }
                            })
                            .catch((error) => {                    
                                if (this.enableLogs) SystemLog(`[NEWS]: Can't send processed news message! Reason: ${error}`)
                            })
                    }
                })
                .catch((error) => {                    
                    if (this.enableLogs) SystemLog(`[NEWS]: Can't send copy of news message! Reason: ${error}`)
                })
            }
            this.lastNoNews = false
            this.statesManager.News.AllProcessed = false
        } else if (this.lastNoNews == false) {
            this.statesManager.News.LoadingText = ''
            this.statesManager.News.LoadingText2 = ''
            this.lastNoNews = true
            this.statesManager.News.AllProcessed = true
            if (this.enableLogs) SystemLog(`[NEWS]: All news processed!`)
        }
    }

    /** @param {Discord.Message} message */
    async ProcessMessage(message) {
        this.statesManager.News.AllProcessed = false
        this.listOfNews.push(await CreateNews(message))
    }
    
    /** @param {Discord.Message} message */
    async TryProcessMessage(message) {
        if (message.channel.id == NewsIncomingChannel) {
            await this.ProcessMessage(message)
        }
    }
}

const NewsIncomingChannel = '902894789874311198'
const NewsProcessedChannel = '746266528508411935'

module.exports = NewsManager