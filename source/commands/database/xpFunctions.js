const { Message } = require('discord.js')
const fs = require('fs')

/*
((https{0,1})(:\/\/)([\w]+)(\.)([\w]+)(\.[\w]+)*((\/)[\w]+){0,}(\/){0,1}((\?)[\w\_\-]+(\=)([\w\-\+\_]+\+{0,1})+((\&)[\w\_\-]+(\=)([\w\-\+\_]+))*){0,1}((\#)[\w\-\+\_]*){0,1})
*/

const linkRegex = /((https{0,1})(:\/\/)([\w]+)(\.)([\w]+)(\.[\w]+)*((\/)[\w]+){0,}(\/){0,1}((\?)[\w\_\-]+(\=)([\w\-\+\_]+\+{0,1})+((\&)[\w\_\-]+(\=)([\w\-\+\_]+))*){0,1}((\#)[\w\-\+\_]*){0,1})/g
const customEmojiRegex = /(<:[a-zA-Z]+:[0-9]{18}>)/
const builtinEmojiRegex = /(:[a-z_]+:)/

/**
 * @param {Message} message
 */
function calculateAddXp(message) {
    var settings = {
        "xpRewards": {
            "messageContents": {
                "attachment": { "xp": 100 },
                "GIF": { "xp": 22 },
                "attachmentLink": { "xp": 50 },
                "emoji": { "xp": 10 },
                "customEmoji": { "xp": 10 },
                "link": { "xp": 25 },
                "specialLinks": [
                    {
                        "link": "https://www.youtube.com/",
                        "xp": 40
                    },
                    {
                        "link": "https://www.reddit.com/",
                        "xp": 34
                    }
                ]
            },
            "messageSizes": [
                {
                    "minChar": 100,
                    "xp": 50
                },
                {
                    "minChar": 300,
                    "xp": 200
                }
            ]
        }
    }

    settings = JSON.parse(fs.readFileSync('settings.json', 'utf-8'))

    var msg = message.content

    const _msg_lnk_rw = msg.match(linkRegex)
    const _msg_wrd_rw = msg.match(/\b(\w+)\b/)
    const _msg_ej_rw = msg.match(/[\p{Emoji}]+/)
    const _msg_dcej_rw = msg.match(customEmojiRegex)
    const _msg_dbej_rw = msg.match(builtinEmojiRegex)

    var allLinkLength = 0
    if (_msg_lnk_rw != null) {
        _msg_lnk_rw.forEach(link => {
            if (link != undefined) {
                allLinkLength += link.length
            }
        })
    }
    const messageCharacters = Math.max(1, msg.length - allLinkLength)

    var messageEmojis = 0
    if (_msg_dbej_rw != null) {
        messageEmojis += _msg_dbej_rw.length
    }
    if (_msg_ej_rw != null) {
        messageEmojis += _msg_ej_rw.length
    }
    messageEmojis = 0
    var messageCustomEmojis = 0
    if (_msg_dcej_rw != null) {
        messageCustomEmojis += _msg_dcej_rw.length
    }
    var messageLinkCount = 0
    var messageLinks = []
    if (_msg_lnk_rw != null) {
        messageLinkCount = _msg_lnk_rw.length
        for (let i = 0; i < messageLinkCount; i++) {
            const link = _msg_lnk_rw.at(i)
            messageLinks.push(link)
        }
    }

    var messageLengthBonus = 0
    for (let i = 0; i < settings.xpRewards.messageSizes.length; i++) {
        const item = settings.xpRewards.messageSizes[i];
        if (item.minChar <= messageCharacters) {
            if (messageLengthBonus < item.xp) {
                messageLengthBonus = item.xp
            }
        }
    }

    const messageEmojiBonus = messageEmojis * settings.xpRewards.messageContents.emoji.xp
    const messageCustomEmojiBonus = messageCustomEmojis * settings.xpRewards.messageContents.customEmoji.xp

    const messageBasicReward = Math.min(msg.length, 20)

    const messageAttachmentBonus = message.attachments.size * settings.xpRewards.messageContents.attachment.xp

    var otherBonuses = 0
    if (msg.toLowerCase().includes('https://cdn.discordapp.com/attachments/')) {
        otherBonuses += settings.xpRewards.messageContents.attachmentLink.xp
    } else if (msg.toLowerCase().includes('https://tenor.com/view/')) {
        otherBonuses += settings.xpRewards.messageContents.GIF.xp
    } else {
        messageLinks.forEach(link => {
            var bonus = settings.xpRewards.messageContents.link.xp

            for (let i = 0; i < settings.xpRewards.messageContents.specialLinks.length; i++) {
                const specialLink = settings.xpRewards.messageContents.specialLinks[i];
                if (link.startsWith(specialLink.link)) {
                    if (bonus < specialLink.xp) {
                        bonus = specialLink.xp
                        break
                    }
                }
            }

            otherBonuses += bonus
        })
    }

    return {
        total: (messageLengthBonus + messageBasicReward + messageAttachmentBonus + otherBonuses + messageEmojiBonus + messageCustomEmojiBonus),
        messageLengthBonus: messageLengthBonus,
        messageBasicReward: messageBasicReward,
        messageAttachmentBonus: messageAttachmentBonus,
        otherBonuses: otherBonuses,
        messageEmojiBonus: messageEmojiBonus,
        messageCustomEmojiBonus: messageCustomEmojiBonus
    }
}

function xpRankIcon(score) {
    if (score < 1000) {
        return '🔰' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/japanese-symbol-for-beginner_1f530.png'
    } else if (score < 5000) {
        return 'Ⓜ️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-latin-capital-letter-m_24c2.png'
    } else if (score < 10000) {
        return '📛' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/name-badge_1f4db.png'
    } else if (score < 50000) {
        return '💠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/diamond-shape-with-a-dot-inside_1f4a0.png'
    } else if (score < 80000) {
        return '⚜️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/fleur-de-lis_269c.png'
    } else if (score < 100000) {
        return '🔱' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/trident-emblem_1f531.png'
    } else if (score < 140000) {
        return '㊗️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-congratulation_3297.png'
    } else if (score < 180000) {
        return '🉐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-advantage_1f250.png'
    } else if (score < 250000) {
        return '🉑' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-accept_1f251.png'
    } else if (score < 350000) {
        return '💫' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/dizzy-symbol_1f4ab.png'
    } else if (score < 500000) {
        return '🌠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/shooting-star_1f320.png'
    } else if (score < 780000) {
        return '☄️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/comet_2604.png'
    } else if (score < 1000000) {
        return '🪐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/ringed-planet_1fa90.png'
    } else if (score < 1500000) {
        return '🌀' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/cyclone_1f300.png'
    } else if (score < 1800000) {
        return '🌌' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/milky-way_1f30c.png'
    } else {
        return '🧿' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png'
    }
}
function xpRankText(score) {
    if (score < 1000) {
        return 'Ujjonc'
    } else if (score < 5000) {
        return 'Zöldfülű'
    } else if (score < 10000) {
        return 'Felfedező'
    } else if (score < 50000) {
        return 'Haladó'
    } else if (score < 80000) {
        return 'Törzsvendég'
    } else if (score < 100000) {
        return 'Állampolgár'
    } else if (score < 140000) {
        return 'Csoportvezető'
    } else if (score < 180000) {
        return 'Csoportvezér'
    } else if (score < 250000) {
        return 'Vezér'
    } else if (score < 350000) {
        return 'Polgárelnök'
    } else if (score < 500000) {
        return 'Miniszterelnök'
    } else if (score < 780000) {
        return 'Elnök'
    } else if (score < 1000000) {
        return 'Világdiktátor'
    } else if (score < 1500000) {
        return 'Galaxis hódító'
    } else if (score < 1800000) {
        return 'Univerzum birtokló'
    } else {
        return 'Isten'
    }
}
function xpRankPrevoius(score) {
    if (score < 1000) {
        return 0
    } else if (score < 5000) {
        return 1000
    } else if (score < 10000) {
        return 5000
    } else if (score < 50000) {
        return 10000
    } else if (score < 80000) {
        return 50000
    } else if (score < 100000) {
        return 80000
    } else if (score < 140000) {
        return 100000
    } else if (score < 180000) {
        return 140000
    } else if (score < 250000) {
        return 180000
    } else if (score < 350000) {
        return 250000
    } else if (score < 500000) {
        return 350000
    } else if (score < 780000) {
        return 500000
    } else if (score < 1000000) {
        return 780000
    } else if (score < 1500000) {
        return 1000000
    } else if (score < 1800000) {
        return 1500000
    }
}
function xpRankNext(score) {
    if (score < 1000) {
        return 1000
    } else if (score < 5000) {
        return 5000
    } else if (score < 10000) {
        return 10000
    } else if (score < 50000) {
        return 50000
    } else if (score < 80000) {
        return 80000
    } else if (score < 100000) {
        return 100000
    } else if (score < 140000) {
        return 140000
    } else if (score < 180000) {
        return 180000
    } else if (score < 250000) {
        return 250000
    } else if (score < 350000) {
        return 350000
    } else if (score < 500000) {
        return 500000
    } else if (score < 780000) {
        return 780000
    } else if (score < 1000000) {
        return 1000000
    } else if (score < 1500000) {
        return 1500000
    } else if (score < 1800000) {
        return 1800000
    }
}

module.exports =  {xpRankIcon, xpRankNext, xpRankPrevoius, xpRankText, calculateAddXp }