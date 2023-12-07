const Discord = require('discord.js')
const { Color } = require('../functions/enums')

/**
 * @param {boolean} isPrivate
 * @param {boolean} isMobile
 * @returns {Discord.EmbedBuilder}
 */
function GetEmbed(isPrivate, isMobile) {
    if (isMobile === true) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Parancsok')
            .setColor(Color.Highlight)
            .addFields([{
                name: 'Alap',
                value:
                    '>  \\ℹ    `/help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `/weather <earth|mars>` Időjárása.\n' +
                    '>  \\🚸  `/crossout <search>` Egy Crossout-os tárgy adatai.\n' +
                    '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.'
            }])
        if (isPrivate == false) {
            embed.addFields([{
                name: 'Zene \\❗ Alfa verzió \\❗',
                value:
                    '>  \\🎶  `/music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                    '>     ├   `/music skip` Az aktuális zene átugrása.\n' +
                    '>     └   `/music list` A lejátszólista megtekintése.'
            }])
        } else {
            embed.addFields([{
                name: 'Zene \\❗ Alfa verzió \\❗ \\⛔ Csak szerveren elérhető \\⛔',
                value:
                    '>  \\🎶  `/music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                    '>     ├   `/music skip` Az aktuális zene átugrása.\n' +
                    '>     └   `/music list` A lejátszólista megtekintése.'
            }])
        }
        if (isPrivate == false) {
            embed.addFields([{
                name: 'Fejlesztői \\⛔ Csak moderátor használhatja \\⛔',
                value:
                    '>  \\💻  `/dev`'
            }])
        }
        return embed
    } else {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Parancsok')
            .setColor(Color.Highlight)
        if (isPrivate == true) {
            embed.addFields([{
                name: 'Alap',
                value:
                    '>  \\\u2139    `/help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `/weather <earth|mars>` Időjárása.\n' +
                    '>  \\🚸  `/crossout <search>` Egy Crossout-os tárgy adatai.\n' +
                    '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.'
            }])
        } else {
            embed.addFields([{
                name: 'Alap',
                value:
                    '>  \\\u2139    `/help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `/weather <earth|mars>` Időjárása.\n' +
                    '>  \\🚸  `/crossout <search>` Egy Crossout-os tárgy adatai.\n' +
                    '>  \\🏓  `/ping` A BOT ping-elése, avagy megnézni hogy most épp online e.\n' +
                    '>  \\📯  `.mail` E-mailek megtekintése vagy írása.\n' +
                    '>  \\⚙️   `/settings` Beállítások.'
            }])
        }
        if (isPrivate == false) {
            embed.addFields([{
                name: 'Pénzek',
                value:
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
            }])
        }
        if (isPrivate == false) {
            embed.addFields([{
                name: 'Zene \\❗ Alfa verzió \\❗',
                value:
                    '>  \\🎶  `/music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                    '>     ├   `/music skip` Az aktuális zene átugrása.\n' +
                    '>     └   `/music list` A lejátszólista megtekintése.'
            }])
        } else {
            embed.addFields([{
                name: 'Zene \\❗ Alfa verzió \\❗ \\⛔ Csak szerveren elérhető \\⛔',
                value:
                    '>  \\🎶  `/music <youtube link>` Zene lejátszása *(Előbb lépj be egy hangcsatornába)*\n' +
                    '>     ├   `/music skip` Az aktuális zene átugrása.\n' +
                    '>     └   `/music list` A lejátszólista megtekintése.'
            }])
        }
        if (isPrivate == false) {
            embed.addFields([{
                name: 'Fejlesztői \\⛔ Csak moderátor használhatja \\⛔',
                value:
                    '>  \\💻  `/dev`'
            }])
            embed.addFields([{
                name: 'Játék \\❗ Alfa verzió \\❗',
                value:
                    '>  \\🎮  `.game`'
            }])
        }
        return embed
    }
}

/** @type {import("./base").Command} */
const Command = {
    Data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('A parancsok listája'),
    Execute: async function(interaction, ephemeral, sender) {
        await interaction.reply({
            embeds: [ GetEmbed(ephemeral, sender.Platform === 'MOBILE') ],
            ephemeral,
        })
    },
    Guild: null,
}

module.exports = Command