const { Message } = require('discord.js')
const fs = require('fs')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')
const LogError = require('./errorLog')

/** @param {Message} message */
function AutoReact(message) {
    try {
        var isHaveMusic = false
        if (message.content.includes('https://youtu.be/') === true) { isHaveMusic = true }
        if (message.content.includes('https://www.youtube.com/watch') === true) { isHaveMusic = true }
        if (message.content.includes('https://open.spotify.com/') === true) { isHaveMusic = true }
        if (message.content.includes('https://soundcloud.com/') === true) { isHaveMusic = true }

        if (isHaveMusic === false) { return }

        const settingsRaw = fs.readFileSync(Path.join(CONFIG.paths.base, './settings.json'), 'utf8')
        const settings = JSON.parse(settingsRaw)
        const channelSettings = settings.channelSettings
        const messageChannelId = message.channel.id
        if (channelSettings[messageChannelId] != undefined) {
            /** @type {string[]} */
            const autoReactions = channelSettings[messageChannelId].autoReactions
            autoReactions.forEach(async (autoReaction) => {
                const reaction = message.reactions.resolve(autoReaction)
                if (reaction == null) {
                    await message.react(autoReaction)
                } else {
                    const users = await reaction.users.fetch();
                    var botIsReacted = false
                    users.forEach(async (user) => {
                        if (user.id == '738030244367433770') {
                            botIsReacted = true
                        }
                    })
                    if (botIsReacted == false) {
                        await message.react(autoReaction)
                    }
                }
            })
        }
    } catch (error) {
        LogError(error)
    }
}

module.exports = { AutoReact }