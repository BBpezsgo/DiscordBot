const https = require('https')
const fs = require('fs')
const Discord = require('discord.js')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')

const ERROR = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/cross-mark_274c.png'
const SPINNER = 'https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif'
const DONE = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/check-mark-button_2705.png'
const WARNING = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/warning_26a0-fe0f.png'

/**
 * @param {string} redditLink
 */
function ConvertToRedditsaveLink(redditLink) {
    return "https://redditsave.com/info?url=" + encodeURIComponent(redditLink)
}

/**
 * @param {string} rawHtmlFile @returns {number} 1: Video | 2: GIF
 */
function GifOrVideo(rawHtmlFile) {
    if (rawHtmlFile.includes('<a onclick="gtag(\'event\', \'click\', {\'event_category\' : \'downloads\',\'event_label\' : \'download_sound_video\'});"') == true) {
        return 1
    } else if (rawHtmlFile.includes('<a onclick="gtag(\'event\', \'click\', {\'event_category\' : \'downloads\',\'event_label\' : \'download_ireddit_gif\'});"') == true) {
        return 2
    }
    return 0
}

/**@param {string} rawHtmlFile @returns {string} */
function GetVideoLink(rawHtmlFile) {
    const dom = new JSDOM(rawHtmlFile)
    return dom.window.document.getElementsByClassName('downloadbutton')[0].getAttribute('href')
}

/**@param {string} rawHtmlFile @returns {string} */
function GetGifLink(rawHtmlFile) {
    const dom = new JSDOM(rawHtmlFile)
    return 'https://redditsave.com' + dom.window.document.getElementsByClassName('downloadbutton')[0].getAttribute('href')
}

/**@param {string} rawHtmlFile @param {string} redditLink */
function GetInformations(rawHtmlFile, redditLink) {
    const info = { subreddit: '?', filesize: '? MB', permalink: redditLink }
    const dom = new JSDOM(rawHtmlFile)
    const infoTable = dom.window.document.getElementsByClassName('table')[0].getElementsByTagName('tbody')[0]
    info.subreddit = 'r/' + infoTable.getElementsByTagName('tr')[2].getElementsByTagName('td')[1].textContent
    info.filesize = infoTable.getElementsByTagName('tr')[4].getElementsByTagName('td')[1].textContent.trimEnd()
    return info
}

/** @param {Discord.Message} message @param {string} url @param {Discord.Message} replymessage */
async function DownloadVideo(message, url, replymessage, postInfo) {
    const videoFile = fs.createWriteStream(message.id + '.mp4')
    const request = https.get(url, function (response) {
        let cur = 0

        response.on('data', function (chunk) {
            cur += chunk.length
        })

        response.on('end', async function () {
            setTimeout(async () => {
                fs.unlinkSync('./' + message.id)
                const button1 = new ButtonBuilder()
                    .setLabel("Letöltés")
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(url)
                const button2 = new ButtonBuilder()
                    .setLabel("Törlés")
                    .setCustomId("redditsaveDelete" + message.author.id)
                    .setStyle(Discord.ButtonStyle.Secondary)
                const button3 = new ButtonBuilder()
                    .setLabel("Üzenetem törlése")
                    .setCustomId("redditsaveDeleteMain" + message.author.id + '.' + message.id)
                    .setStyle(Discord.ButtonStyle.Secondary)
                const row = new ActionRowBuilder()
                    .addComponents(button1, button2, button3)
                const embed = new EmbedBuilder()
                    .setAuthor({ iconURL: 'https://www.reddit.com/favicon.ico', name: postInfo.subreddit, url: postInfo.permalink })
                    .setURL(url)
                try {
                    await replymessage.edit({ embeds: [embed], components: [row] })
                } catch (error) {
                    console.error(error)
                }
                fs.unlinkSync('./' + message.id + '.mp4')
            }, 1000)
        })

        response.pipe(videoFile)
    })

    request.on("error", (err) => {
        message.reply("Error: " + err.message)
    })
}

/** @param {string} text @returns {boolean} */
function IsLargerThan8Mb(text) {
    const hahaha = text.split(' ')
    const xd = hahaha[1]
    const number = Number.parseFloat(hahaha[0])
    if (xd.includes('MB')) {
        if (number >= 8) {
            return true
        } else {
            return false
        }
    } else if (xd.includes('KB')) {
        return false
    }
    return true
}

/** @param {Discord.Message} message */
async function Redditsave(message) {
    const messageContentUrl = message.content

    const button1 = new ButtonBuilder()
        .setLabel("⬇️ Letöltés")
        .setStyle(Discord.ButtonStyle.Link)
        .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        .setDisabled(true)
    const button2 = new ButtonBuilder()
        .setLabel("🗑️ Törlés")
        .setCustomId("redditsaveDelete" + message.author.id)
        .setStyle(Discord.ButtonStyle.Secondary)
        .setDisabled(true)
    const button3 = new ButtonBuilder()
        .setLabel("🗑️ Üzenetem törlése")
        .setCustomId("redditsaveDeleteMain" + message.author.id + '.' + message.id)
        .setStyle(Discord.ButtonStyle.Danger)
        .setDisabled(true)
    const row = new ActionRowBuilder()
        .addComponents(button1, button2, button3)
    const embed = new EmbedBuilder()
        .setFooter({ text: 'Betöltés...', iconURL: SPINNER })

    const replyMessage = await message.reply({ embeds: [embed], components: [row] })

    const rawHtmlFile = fs.createWriteStream(message.id)
    const request = https.get(ConvertToRedditsaveLink(messageContentUrl), function (response) {
        let cur = 0

        response.on('data', function (chunk) {
            cur += chunk.length
        })

        response.on('end', async function () {
            setTimeout(async () => {
                const rawHtml = fs.readFileSync(message.id)
                const videoOrGif = GifOrVideo(rawHtml)

                if (videoOrGif == 1) {
                    const postInfo = GetInformations(rawHtml.toString('utf8'), messageContentUrl)
                    const videoUrl = GetVideoLink(rawHtml.toString('utf8'))

                    const button1 = new ButtonBuilder()
                        .setLabel("⬇️ Letöltés (" + postInfo.filesize + ")")
                        .setStyle(Discord.ButtonStyle.Link)
                        .setURL(videoUrl)
                    const button2 = new ButtonBuilder()
                        .setLabel("🗑️ Törlés")
                        .setCustomId("redditsaveDelete" + message.author.id)
                        .setStyle(Discord.ButtonStyle.Secondary)
                    const button3 = new ButtonBuilder()
                        .setLabel("🗑️ Üzenetem törlése")
                        .setCustomId("redditsaveDeleteMain" + message.author.id + '.' + message.id)
                        .setStyle(Discord.ButtonStyle.Danger)
                    const row = new ActionRowBuilder()
                        .addComponents(button1, button2, button3)

                    const embed = new EmbedBuilder()
                        .setFooter({ text: 'Kész!', iconURL: DONE })
                        .setURL(videoUrl)
                        .setColor('#ff4500')

                    if (IsLargerThan8Mb(postInfo.filesize) == true) {
                        embed.setFooter({ text: 'Vigyázat! Nagyobb mint 8 MB', iconURL: WARNING })
                    }

                    await replyMessage.edit({ embeds: [embed], components: [row] })

                    fs.unlinkSync('./' + message.id)
                    //DownloadVideo(message, videoUrl, replyMessage, postInfo)
                } else if (videoOrGif == 2) {
                    const postInfo = GetInformations(rawHtml.toString('utf8'), messageContentUrl)
                    const videoUrl = GetGifLink(rawHtml.toString('utf8'))

                    const button1 = new ButtonBuilder()
                        .setLabel("⬇️ Letöltés (" + postInfo.filesize + ")")
                        .setStyle(Discord.ButtonStyle.Link)
                        .setURL(videoUrl)
                    const button2 = new ButtonBuilder()
                        .setLabel("🗑️ Törlés")
                        .setCustomId("redditsaveDelete" + message.author.id)
                        .setStyle(Discord.ButtonStyle.Secondary)
                    const button3 = new ButtonBuilder()
                        .setLabel("🗑️ Üzenetem törlése")
                        .setCustomId("redditsaveDeleteMain" + message.author.id + '.' + message.id)
                        .setStyle(Discord.ButtonStyle.Danger)
                    const row = new ActionRowBuilder()
                        .addComponents(button1, button2, button3)

                    const embed = new EmbedBuilder()
                        .setFooter({ text: 'Kész!', iconURL: DONE })
                        .setURL(videoUrl)
                        .setColor('#ff4500')

                    if (IsLargerThan8Mb(postInfo.filesize) == true) {
                        embed.setFooter({ text: 'Vigyázat! Nagyobb mint 8 MB', iconURL: WARNING })
                    }

                    await replyMessage.edit({ embeds: [embed], components: [row] })

                    fs.unlinkSync('./' + message.id)
                } else {
                    const button2 = new ButtonBuilder()
                        .setLabel("🗑️ Törlés")
                        .setCustomId("redditsaveDelete" + message.author.id)
                        .setStyle(Discord.ButtonStyle.Secondary)
                    const button3 = new ButtonBuilder()
                        .setLabel("🗑️ Üzenetem törlése")
                        .setCustomId("redditsaveDeleteMain" + message.author.id + '.' + message.id)
                        .setStyle(Discord.ButtonStyle.Danger)
                    const row = new ActionRowBuilder()
                        .addComponents(button2, button3)

                    const embed = new EmbedBuilder()
                        .setFooter({ text: 'Ez nem egy videó/GIF!', iconURL: ERROR })
                        .setColor('#ff4500')

                    await replyMessage.edit({ embeds: [embed], components: [row] })

                    fs.unlinkSync('./' + message.id)
                }

            }, 1000)
        })

        response.pipe(rawHtmlFile)
    })

    request.on("error", (err) => {
        message.reply("Error: " + err.message)
    })
}

/** @param {Discord.ButtonInteraction<Discord.CacheType>} e */
function OnButtonClick(e) {
    if (e.component.customId.startsWith('redditsaveDeleteMain')) {
        if (e.component.customId.includes(e.user.id)) {
            e.channel.messages.cache.get(e.component.customId.split('.')[1]).delete()
            const button1 = e.message.components[0].components[0]
            const button2 = e.message.components[0].components[1]
            const row = new ActionRowBuilder()
                .addComponents(button1, button2)
            e.update({ embeds: [e.message.embeds[0]], components: [row] })
            return true
        }
    }
    if (e.component.customId.startsWith('redditsaveDelete')) {
        if (e.component.customId.includes(e.user.id)) {
            e.message.delete()
            return true
        }
    }
    return false
}

module.exports = { Redditsave, OnButtonClick }