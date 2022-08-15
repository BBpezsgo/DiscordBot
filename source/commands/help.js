const Discord = require('discord.js')
const { Color } = require('../functions/enums')

/**
 * @param {boolean} isPrivate
 * @param {boolean} isMobile
 * @returns {Discord.MessageEmbed}
 */
function getEmbedMessage(isPrivate, isMobile) {
    if (isMobile === true) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Parancsok')
            .setColor(Color.Highlight)
            .addField('Alap',
                '>  \\ℹ    `/help` Segítség kérése a parancsok iránt.\n' +
                '>  \\⛅  `/weather <earth|mars>` Időjárása.\n' +
                '>  \\🚸  `/crossout <search>` Egy Crossout-os tárgy adatai.\n' +
                '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.'
            )
        if (isPrivate == false) {
            embed.addField('Zene \\❗ Alfa verzió \\❗',
                '>  \\🎶  `.music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                '>     ├   `.music skip` Az aktuális zene átugrása.\n' +
                '>     └   `.music list` A lejátszólista megtekintése.'
            )
        } else {
            embed.addField('Zene \\❗ Alfa verzió \\❗ \\⛔ Csak szerveren elérhető \\⛔',
                '>  \\🎶  `.music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                '>     ├   `.music skip` Az aktuális zene átugrása.\n' +
                '>     └   `.music list` A lejátszólista megtekintése.'
            )
        }
        if (isPrivate == false) {
            embed.addField('Fejlesztői \\⛔ Csak moderátor használhatja \\⛔',
                '>  \\💻  `/dev`'
            )
        }
        return embed
    } else {
        const embed = new Discord.MessageEmbed()
            .setTitle('Parancsok')
            .setColor(Color.Highlight)
        if (isPrivate == true) {
            embed.addField('Alap',
                '>  \\\u2139    `/help` Segítség kérése a parancsok iránt.\n' +
                '>  \\⛅  `/weather <earth|mars>` Időjárása.\n' +
                '>  \\🚸  `/crossout <search>` Egy Crossout-os tárgy adatai.\n' +
                '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.'
            )
        } else {
            embed.addField('Alap',
                '>  \\\u2139    `/help` Segítség kérése a parancsok iránt.\n' +
                '>  \\⛅  `/weather <earth|mars>` Időjárása.\n' +
                '>  \\🚸  `/crossout <search>` Egy Crossout-os tárgy adatai.\n' +
                '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.\n' +
                '>  \\📯  `.mail` E-mailek megtekintése vagy írása.\n' +
                '>  \\⚙️   `/settings` Beállítások.'
            )
        }
        if (isPrivate == false) {
            embed.addField('Pénzek',
                '>  \\🍺   `/xp` Rangod.\n' +
                '>  \\💼  `/backpack` A hátizsákod tartalmának megtekintése.\n' +
                '>  \\🧰  `/heti <darab>` A heti ládák kinyitása. \\❗ **Alfa verzió** \\❗\n' +
                '>  \\🧱  `/crate <darab>` A ládák kinyitása.\n' +
                '>  \\🏪  `/shop`\n' +
                '>  \\⚖️  `/market`\n' +
                '>  \\👤  `/profil` Statisztikák és matricák megtekintése.\n' +
                '>  \\💰   `.pms` Biznisz, ami pénzt termel. \\❗ **Alfa verzió** \\❗\n' +
                //'>     └    `.pms name [új név]` \\⛔ **Nem elérhető** \\⛔\n' +
                '>  \\🎁   `/gift <felhasználó>` Egy felhasználó megajándékozása.'
            )
        }
        if (isPrivate == false) {
            embed.addField('Zene \\❗ Alfa verzió \\❗',
                '>  \\🎶  `.music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                '>     ├   `.music skip` Az aktuális zene átugrása.\n' +
                '>     └   `.music list` A lejátszólista megtekintése.'
            )
        } else {
            embed.addField('Zene \\❗ Alfa verzió \\❗ \\⛔ Csak szerveren elérhető \\⛔',
                '>  \\🎶  `.music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                '>     ├   `.music skip` Az aktuális zene átugrása.\n' +
                '>     └   `.music list` A lejátszólista megtekintése.'
            )
        }
        if (isPrivate == false) {
            embed.addField('Fejlesztői \\⛔ Csak moderátor használhatja \\⛔',
                '>  \\💻  `/dev`'
            )
            .addField('Játék \\❗ Alfa verzió \\❗',
                '>  \\🎮  `.game`'
            )
        }
        return embed
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