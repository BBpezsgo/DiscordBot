const fs = require('fs')

/** @returns {number} */
function calculateAddXp(message) {
    const settings = JSON.parse(fs.readFileSync('settings.json', 'utf-8'))

    let addScoreValue = message.content.length;
    if (addScoreValue > 20) {
        addScoreValue = 20
    }

    for (let i = 0; i < 5; i++) {
        if (message.content.includes(settings['addXp'][i].link.toString())) {
            addScoreValue = settings['addXp'][i].xp
        }
    }
    if (message.attachments.size) {
        addScoreValue = settings['addXp'][5].xp
    }

    return addScoreValue
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