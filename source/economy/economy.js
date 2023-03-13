// @ts-check

const Discord = require('discord.js')
const fs = require('fs')
/** @type {import('../config').Config} */
// @ts-ignore
const CONFIG = require('../config.json')
const Path = require('path')

class EconomyMember {
    /**
     * @param {Economy} economy
     * @param {string} userID
     */
    constructor(economy, userID) {
        this.economy = economy
        this.userID = userID
    }
}

class Economy {
    /**
     * @param {import('../functions/databaseManager').DatabaseManager} database
     */
    constructor(database) {
        this.database = database
    }

    /**
     * @param {Discord.GuildMember} user
     * @param {number} ammount
     * @param {Discord.GuildTextBasedChannel} notifyChannel
     */
    AddScore(user, ammount, notifyChannel) {
        const oldScore = this.database.dataBasic[user.id].score
        this.database.dataBasic[user.id].score += ammount
        const newScore = this.database.dataBasic[user.id].score
    
        if (oldScore < 1000 && newScore > 999 || oldScore < 5000 && newScore > 4999 || oldScore < 10000 && newScore > 9999 || oldScore < 50000 && newScore > 49999 || oldScore < 100000 && newScore > 99999) {
            let rank = xpRankIcon(newScore)
            let rankName = xpRankText(newScore)
            let addMoney = 0
            if (newScore < 1000) {
            } else if (newScore < 5000) {
                addMoney = 500
            } else if (newScore < 10000) {
                addMoney = 1000
            } else if (newScore < 50000) {
                addMoney = 1400
            } else if (newScore < 80000) {
                addMoney = 1800
            } else if (newScore < 100000) {
                addMoney = 2300
            } else if (newScore < 140000) {
                addMoney = 2500
            } else if (newScore < 180000) {
                addMoney = 2900
            } else if (newScore < 250000) {
                addMoney = 3300
            } else if (newScore < 350000) {
                addMoney = 3500
            } else if (newScore < 500000) {
                addMoney = 3800
            } else if (newScore < 780000) {
                addMoney = 4700
            } else if (newScore < 1000000) {
                addMoney = 5800
            } else if (newScore < 1500000) {
                addMoney = 10000
            } else if (newScore < 1800000) {
                addMoney = 11000
            } else {
                addMoney = 15000
            }
    
            this.database.dataBasic[user.id].money += addMoney
            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
                .setTitle('Szintet léptél!')
                .addFields([
                    {
                        name: 'Rang',
                        value: '\\' + rank.toString() + '  (' + rankName + ')',
                        inline: true
                    },
                    {
                        name: 'Jutalmad',
                        value: addMoney.toString() + '\\💵',
                        inline: true
                    }
                ])
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clinking-beer-mugs_1f37b.png')
                .setColor(Discord.Colors.Blurple)
            notifyChannel.send({ embeds: [embed] })
        }
    
        this.database.SaveDatabase()
    }

    /**
     * @param {string} userID
     */
    OpenDayCrate(userID) {
        const RandomPercente = Math.floor(Math.random() * 100)
        let val = 0
        if (RandomPercente < 10) { // 10%
            val = 1
            this.database.dataBackpacks[userID].tickets += val
    
            return 0 + '|' + val
        } else if (RandomPercente < 30) { // 20%
            val = 1
            this.database.dataBackpacks[userID].crates += val
    
            return 1 + '|' + val
        } else if (RandomPercente < 60) { // 30%
            val = Math.floor(Math.random() * 50) + 30
            this.database.dataBasic[userID].score += val
    
            return 2 + '|' + val
        } else { // 40%
            val = Math.floor(Math.random() * 300) + 100
            this.database.dataBasic[userID].money += val
    
            return 3 + '|' + val
        }
    }

    /**
     * @param {string} userID
     */
    Member(userID) {
        const dataBasic = this.database.dataBasic[userID]
        if (!dataBasic) return null
        return new EconomyMember(this, userID)
    }
}

/**
 * @param {Discord.Message} message
 */
function calculateAddXp(message) {
    const linkRegex = /((https{0,1})(:\/\/)([\w]+)(\.)([\w]+)(\.[\w]+)*((\/)[\w]+){0,}(\/){0,1}((\?)[\w\_\-]+(\=)([\w\-\+\_]+\+{0,1})+((\&)[\w\_\-]+(\=)([\w\-\+\_]+))*){0,1}((\#)[\w\-\+\_]*){0,1})/g
    const customEmojiRegex = /(<:[a-zA-Z]+:[0-9]{18}>)/
    const builtinEmojiRegex = /(:[a-z_]+:)/
    
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

    settings = JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, 'settings.json'), 'utf-8'))

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

/**
 * @param {number} score
 */
function xpRankIconModern(score) {
    if (score < 1000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/japanese-symbol-for-beginner_1f530.png'
    } else if (score < 5000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/circled-m_24c2-fe0f.png'
    } else if (score < 10000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/name-badge_1f4db.png'
    } else if (score < 50000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/diamond-with-a-dot_1f4a0.png'
    } else if (score < 80000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/fleur-de-lis_269c-fe0f.png'
    } else if (score < 100000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/trident-emblem_1f531.png'
    } else if (score < 140000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/japanese-congratulations-button_3297-fe0f.png'
    } else if (score < 180000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/japanese-bargain-button_1f250.png'
    } else if (score < 250000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/japanese-acceptable-button_1f251.png'
    } else if (score < 350000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/dizzy_1f4ab.png'
    } else if (score < 500000) {
        return 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/shooting-star_1f320.png'
    } else if (score < 780000) {
        return 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/comet_2604-fe0f.png'
    } else if (score < 1000000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/ringed-planet_1fa90.png'
    } else if (score < 1500000) {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/291/cyclone_1f300.png'
    } else if (score < 1800000) {
        return 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/milky-way_1f30c.png'
    } else {
        return 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/nazar-amulet_1f9ff.png'
    }
}
/**
 * @param {number} score
 */
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
/**
 * @param {number} score
 */
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
/**
 * @param {number} score
 */
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
/**
 * @param {number} score
 */
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

module.exports = { Economy }