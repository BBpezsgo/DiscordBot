const Discord = require('discord.js')

/**
 * @param {boolean} isPrivate
 * @param {boolean} isMobile
 * @returns {Discord.MessageEmbed}
 */
function getEmbedMessage(isPrivate, isMobile) {
    if (isMobile === true) {
        if (isPrivate === true) {
            const embed = new Discord.MessageEmbed()
                .setAuthor('Parancsok', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                .addField('Alap',
                    '>  \\ℹ    `/help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `/weather` Békéscsaba időjárása.\n' +
                    '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.'
                )
                .setColor(0x00A6FF)
            return embed
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor('Parancsok', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                .addField('Alap',
                    '>  \\ℹ    `/help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `/weather` Békéscsaba időjárása.\n' +
                    '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.'
                )
                .addField('Zene \\❗ Alfa verzió \\❗',
                    '>  \\🎶  `.music [youtube link]` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                    '>     ├   `.music skip` Az aktuális zene átugrása.\n' +
                    '>     └   `.music list` A lejátszólista megtekintése.'
                )
                .addField('Fejlesztői \\⛔ Csak moderátor használhatja \\⛔',
                    '>  \\💻  `/dev`'
                )
                .setColor(0x00A6FF)
            return embed
        }
    } else {
        if (isPrivate === true) {
            const embed = new Discord.MessageEmbed()
                .setAuthor('Parancsok', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                .addField('Alap',
                    '>  \\ℹ    `/help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `/weather` Békéscsaba időjárása.\n' +
                    '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.\n' +
                    '>  \\📯  `.mail` E-mailek megtekintése vagy írása.'
                )
                .addField('Pénzek',
                    '>  \\🍺   `/xp` Rangod.\n' +
                    '>  \\💼  `/store` A hátizsákod tartalmának megtekintése. \\⛔ **Korlátozott** \\⛔\n' +
                    '>  \\🧰  `/napi <darab>` Napi ládák kinyitása.\n' +
                    '>  \\🧱  `/crate <darab>` Ládák kinyitása.\n' +
                    '>  \\👤  `/profil` Statisztikák és matricák megtekintése.\n' +
                    '>  \\💰   `.pms` Biznisz, ami pénzt termel. \\❗ **Alfa verzió** \\❗ \\⛔ **Korlátozott** \\⛔'
                )
                .setColor(0x00A6FF)
            return embed
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor('Parancsok', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                .addField('Alap',
                    '>  \\\u2139    `/help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `/weather` Békéscsaba időjárása.\n' +
                    '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.\n' +
                    '>  \\📯  `.mail` E-mailek megtekintése vagy írása.'
                )
                .addField('Pénzek',
                    '>  \\🍺   `/xp` Rangod.\n' +
                    '>  \\💼  `/store` A hátizsákod tartalmának megtekintése.\n' +
                    '>  \\🧰  `/napi <darab>` A napi ládák kinyitása.\n' +
                    '>  \\🧱  `/crate <darab>` A ládák kinyitása.\n' +
                    '>  \\🏪  `/bolt`\n' +
                    '>  \\👤  `/profil` Statisztikák és matricák megtekintése.\n' +
                    '>  \\💰   `.pms` Biznisz, ami pénzt termel. \\❗ **Alfa verzió** \\❗\n' +
                    //'>     └    `.pms name [új név]` \\⛔ **Nem elérhető** \\⛔\n' +
                    '>  \\🎁   `.gift @Felhasználó` Egy felhasználó megajándékozása.'
                )
                .addField('Zene \\❗ Alfa verzió \\❗',
                    '>  \\🎶  `.music [youtube link]` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                    '>     ├   `.music skip` Az aktuális zene átugrása.\n' +
                    '>     └   `.music list` A lejátszólista megtekintése.'
                )
                .addField('Fejlesztői \\⛔ Csak moderátor használhatja \\⛔',
                    '>  \\💻  `/dev`'
                )
                .addField('Játék \\❗ Alfa verzió \\❗',
                    '>  \\🎮  `.game`'
                )
                .setColor(0x00A6FF)
            return embed
        }
    }
}

/**
* @param {boolean} isPrivate
* @param {boolean} isMobile
* @returns {Discord.MessageEmbed}
*/
module.exports = (isPrivate, isMobile = false) => {
    return getEmbedMessage(isPrivate, isMobile)
}