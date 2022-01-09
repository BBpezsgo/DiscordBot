const Discord = require('discord.js')
const fs = require('fs');
const { send } = require('process');
let scores = JSON.parse(fs.readFileSync('./database/basic.json', 'utf-8'));

let coloredProgressBarPart = '⬜'

function xpRankIcon(score) {
    let rank = ''
    if (score < 1000) {
        rank = '🔰' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/japanese-symbol-for-beginner_1f530.png'
    } else if (score < 5000) {
        rank = 'Ⓜ️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-latin-capital-letter-m_24c2.png'
    } else if (score < 10000) {
        rank = '📛' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/name-badge_1f4db.png'
    } else if (score < 50000) {
        rank = '💠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/diamond-shape-with-a-dot-inside_1f4a0.png'
    } else if (score < 80000) {
        rank = '⚜️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/fleur-de-lis_269c.png'
    } else if (score < 100000) {
        rank = '🔱' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/trident-emblem_1f531.png'
    } else if (score < 140000) {
        rank = '㊗️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-congratulation_3297.png'
    } else if (score < 180000) {
        rank = '🉐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-advantage_1f250.png'
    } else if (score < 250000) {
        rank = '🉑' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-accept_1f251.png'
    } else if (score < 350000) {
        rank = '💫' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/dizzy-symbol_1f4ab.png'
    } else if (score < 500000) {
        rank = '🌠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/shooting-star_1f320.png'
    } else if (score < 780000) {
        rank = '☄️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/comet_2604.png'
    } else if (score < 1000000) {
        rank = '🪐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/ringed-planet_1fa90.png'
    } else if (score < 1500000) {
        rank = '🌀' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/cyclone_1f300.png'
    } else if (score < 1800000) {
        rank = '🌌' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/milky-way_1f30c.png'
    } else {
        rank = '🧿' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png'
    }
    return rank
}
function xpRankText(score) {
    let rankName = ''
    if (score < 1000) {
        rankName = 'Ujjonc'
    } else if (score < 5000) {
        rankName = 'Zöldfülű'
    } else if (score < 10000) {
        rankName = 'Felfedező'
    } else if (score < 50000) {
        rankName = 'Haladó'
    } else if (score < 80000) {
        rankName = 'Törzsvendég'
    } else if (score < 100000) {
        rankName = 'Állampolgár'
    } else if (score < 140000) {
        rankName = 'Csoportvezető'
    } else if (score < 180000) {
        rankName = 'Csoportvezér'
    } else if (score < 250000) {
        rankName = 'Vezér'
    } else if (score < 350000) {
        rankName = 'Polgárelnök'
    } else if (score < 500000) {
        rankName = 'Miniszterelnök'
    } else if (score < 780000) {
        rankName = 'Elnök'
    } else if (score < 1000000) {
        rankName = 'Világdiktátor'
    } else if (score < 1500000) {
        rankName = 'Galaxis hódító'
    } else if (score < 1800000) {
        rankName = 'Univerzum birtokló'
    } else {
        rankName = 'Isten'
    }
    return rankName
}
function xpRankPrevoius(score) {
    let prevoius = 0
    if (score < 1000) {
        prevoius = 0
    } else if (score < 5000) {
        prevoius = 1000
    } else if (score < 10000) {
        prevoius = 5000
    } else if (score < 50000) {
        prevoius = 10000
    } else if (score < 80000) {
        prevoius = 50000
    } else if (score < 100000) {
        prevoius = 80000
    } else if (score < 140000) {
        prevoius = 100000
    } else if (score < 180000) {
        prevoius = 140000
    } else if (score < 250000) {
        prevoius = 180000
    } else if (score < 350000) {
        prevoius = 250000
    } else if (score < 500000) {
        prevoius = 350000
    } else if (score < 780000) {
        prevoius = 500000
    } else if (score < 1000000) {
        prevoius = 780000
    } else if (score < 1500000) {
        prevoius = 1000000
    } else if (score < 1800000) {
        prevoius = 1500000
    }
    return prevoius
}
function xpRankNext(score) {
    let next = 0
    if (score < 1000) {
        next = 1000
    } else if (score < 5000) {
        next = 5000
    } else if (score < 10000) {
        next = 10000
    } else if (score < 50000) {
        next = 50000
    } else if (score < 80000) {
        next = 80000
    } else if (score < 100000) {
        next = 100000
    } else if (score < 140000) {
        next = 140000
    } else if (score < 180000) {
        next = 180000
    } else if (score < 250000) {
        next = 250000
    } else if (score < 350000) {
        next = 350000
    } else if (score < 500000) {
        next = 500000
    } else if (score < 780000) {
        next = 780000
    } else if (score < 1000000) {
        next = 1000000
    } else if (score < 1500000) {
        next = 1500000
    } else if (score < 1800000) {
        next = 1800000
    }
    return next
}
function abbrev(num) {
    if (!num || isNaN(num)) return "0";
    if (typeof num === "string") num = parseInt(num);
    let decPlaces = Math.pow(10, 1);
    var abbrev = ["E", "m", "M", "b", "B", "tr", "TR", "qa", "QA", "qi", "QI", "sx", "SX", "sp", "SP"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= num) {
            num = Math.round((num * decPlaces) / size) / decPlaces;
            if (num == 1000 && i < abbrev.length - 1) {
                num = 1;
                i++;
            }
            num += abbrev[i];
            break;
        }
    }
    return num;
}

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.User} sender
 */
async function execute(channel, sender) {
    try {
        const userColor = scores[sender.id].color

        if (userColor === "#ff0000") {
            coloredProgressBarPart = '🟥'
        } else if (userColor === "#ffff00") {
            coloredProgressBarPart = '🟨'
        } else if (userColor === "#0000ff") {
            coloredProgressBarPart = '🟦'
        } else if (userColor === "#ffbb00") {
            coloredProgressBarPart = '🟧'
        } else if (userColor === "#9d00ff") {
            coloredProgressBarPart = '🟪'
        } else if (userColor === "#00ff00") {
            coloredProgressBarPart = '🟩'
        } else if (userColor === "#734c09") {
            coloredProgressBarPart = '🟫'
        }

        var score = scores[sender.id].score
        var rankName = xpRankText(score)
        var next = xpRankNext(score)

        let progressBar = ''

        const progressBarLength = 10

        let scorePercent = score / next * progressBarLength

        let progressBarFilled = ''
        for (let l = 0; l < scorePercent; l++) {
            progressBarFilled += '\\' + coloredProgressBarPart
        }
        progressBar += progressBarFilled
        for (let l = 0; l < progressBarLength - (progressBarFilled.length / 3); l++) {
            progressBar += '\\⬛'
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(sender.username, sender.displayAvatarURL())
            .setTitle('Rang')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/beer-mug_1f37a.png')
            .addField(rankName,'\\' + xpRankIcon(score) + ' ' + progressBar + ' \\❔')
            .setColor(userColor)
            .setFooter(abbrev(score) + ' / ' + abbrev(next) + '\nKell még: 🍺' + abbrev(next - score) + ' xp')
        channel.send({embeds: [embed]});
    } catch (error) {
        const filter = (reaction, user) => {
            return ['🔄'].includes(reaction.emoji.name) && user.id === sender.id;
        };
        channel.send('> \\❌ ' + error.toString()).then(message => {
            message.react('🔄');

            message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] }).then(collected => {
                    if (collected.first().emoji.name == '🔄') {
                        execute(channel, sender)
                    };
                    message.reactions.removeAll();
                }).catch(() => {
                    message.reactions.removeAll();
                });
        });
    }
}

 /**
 * @param {Discord.Channel} channel
 * @param {Discord.User} sender
 */
module.exports = (channel, sender) => {
    execute(channel, sender)
}