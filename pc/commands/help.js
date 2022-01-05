const Discord = require('discord.js')
const maxMenuIndex = 2

/**
 * @type {Discord.Message}
 */
let ruleMessage0
/**
 * @type {Discord.Message}
 */
let ruleMessage1
/**
 * @type {Discord.Message}
 */
let ruleMessage2

/**
 * @param {number} menuIndex
 * @returns {Discord.MessageEmbed}
 * @param {boolean} isPrivate
 */
function getEmbedMessage(menuIndex, guildId, isPrivate) {
    if (isPrivate === true) {
        const embed = new Discord.MessageEmbed()
            .setAuthor('Információk', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
            .setTitle('Parancsok')
            .addField('Alap',
                '>  \\ℹ    `.help` Segítség kérése a parancsok iránt.\n' +
                '>  \\⛅  `.weather` Békéscsaba időjárása.\n' +
                '>     └`.weather help` Időjárás jelzések\n' +
                '>  \\🏓  `.ping` A BOT ping-elése, avagy megnézni hogy most épp online e.\n' +
                '>  \\📯  `.mail` E-mailek megtekintése vagy írása.'
            )
            .addField('Pénzek',
                '>  \\🍺   `.xp` Rangod.\n' +
                '>  \\💼  `.store` A hátizsákod tartalmának megtekintése. \\⛔ **Korlátozott** \\⛔\n' +
                '>  \\🧰  `.napi` Napi láda kinyitása.\n' +
                '>    └    `.napi all` Az összes napi láda kinyitása.\n' +
                '>  \\🧱  `.crate all` Az összes láda kinyitása.\n' +
                '>  \\👤  `.profil` Statisztikák és matricák megtekintése.\n' +
                '>  \\💰   `.pms` Biznisz, ami pénzt termel. \\❗ **Alfa verzió** \\❗ \\⛔ **Korlátozott** \\⛔'
            )
            .setColor(0x00A6FF)
        return embed
    } else {
        if (menuIndex === -1) {
            const embed = new Discord.MessageEmbed()
                .setAuthor('Információk', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                .setTitle('Jelenleg nem elérhető.')
                .setDescription('Hogy újra használhasd, használd a `.help` parancsot!')
                .setColor(0x00A6FF)
                .setFooter('-/' + (maxMenuIndex + 1), 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/open-book_1f4d6.png')
            return embed
        } else if (menuIndex === 0) {
            const embed = new Discord.MessageEmbed()
                .setAuthor('Információk', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                .setTitle('Főmenü')
                .addField('Tartalom:',
                    '>  \\📎    Parancsok\n' +
                    '>  \\📎    Szabályok'
                )
                .setColor(0x00A6FF)
                .setFooter((menuIndex + 1) + '/' + (maxMenuIndex + 1), 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/open-book_1f4d6.png')
            return embed
        } else if (menuIndex === 1) {
            const embed = new Discord.MessageEmbed()
                .setAuthor('Információk', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                .setTitle('Parancsok')
                .addField('Alap',
                    '>  \\ℹ    `.help` Segítség kérése a parancsok iránt.\n' +
                    '>  \\⛅  `.weather` Békéscsaba időjárása.\n' +
                    '>     └`.weather help` Időjárás jelzések\n' +
                    '>  \\🏓  `.ping` A BOT ping-elése, avagy megnézni hogy most épp online e.\n' +
                    '>  \\📯  `.mail` E-mailek megtekintése vagy írása.'
                )
                .addField('Pénzek',
                    '>  \\🍺   `.xp` Rangod.\n' +
                    '>  \\💼  `.store` A hátizsákod tartalmának megtekintése.\n' +
                    '>  \\🧰  `.napi` Napi láda kinyitása.\n' +
                    '>    └    `.napi all` Az összes napi láda kinyitása.\n' +
                    '>  \\🧱  `.crate all` Az összes láda kinyitása.\n' +
                    '>  \\🏪  `.bolt`\n' +
                    '>  \\👤  `.profil` Statisztikák és matricák megtekintése.\n' +
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
                    '>  \\💻  `.dev`'
                )
                .addField('Játék \\❗ Alfa verzió \\❗',
                    '>  \\🎮  `.game`'
                )
                .setColor(0x00A6FF)
                .setFooter((menuIndex + 1) + '/' + (maxMenuIndex + 1), 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/open-book_1f4d6.png')
            return embed
        } else if (menuIndex === 2) {
            if (guildId === '737954264386764812') {
                const embed = new Discord.MessageEmbed()
                    .setAuthor('Információk', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                    .setTitle('Szabályok')
                    .addField('Fő szabályok',
                        ruleMessage0.content.replace('**Fő szabályok**\n', '')
                    )
                    .addField('Fő csatornák',
                        ruleMessage1.content.replace('**Fő csatornák**\n', '')
                    )
                    .addField('Egyéb csatornák',
                        ruleMessage2.content.replace('**Egyéb csatornák**\n', '')
                    )
                    .setColor(0x00A6FF)
                    .setFooter((menuIndex + 1) + '/' + (maxMenuIndex + 1), 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/open-book_1f4d6.png')
                return embed
            } else {
                const embed = new Discord.MessageEmbed()
                    .setAuthor('Információk', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
                    .setTitle('Szabályok')
                    .setDescription('\❌ Ezen a szerveren nincsenek elmentve a szabályok. \❌')
                    .setColor(0x00A6FF)
                    .setFooter((menuIndex + 1) + '/' + (maxMenuIndex + 1), 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/open-book_1f4d6.png')
                return embed
            }
        } else {
            return null
        }
    }
}

/**
* @param {Discord.User} sender
* @param {Discord.Message} embedMessage
* @param {number} currentMenuIndex
*/
async function awaitReactionsThis(embedMessage, currentMenuIndex, sender) {
    embedMessage.awaitReactions((reaction, user) => user.id == sender.id && (
        reaction.emoji.name == '➡️' ||
        reaction.emoji.name == '⬅️'
    ), { max: 1, time: 900000 }).then(async collected => {
        let newMenuIndex = currentMenuIndex
        if (collected.first().emoji.name == '➡️') {
            if (currentMenuIndex < maxMenuIndex) {
                newMenuIndex += 1
            }
        } else if (collected.first().emoji.name == '⬅️') {
            if (currentMenuIndex > 0) {
                newMenuIndex -= 1
            }
        }
        await collected.first().users.remove(sender.id)
        await embedMessage.edit(getEmbedMessage(newMenuIndex, embedMessage.guild.id))
        awaitReactionsThis(embedMessage, newMenuIndex, sender)
    }).catch(() => {
        embedMessage.reactions.removeAll();
        embedMessage.edit(getEmbedMessage(-1, embedMessage.guild.id))
    });
}

/**
* @param {Discord.TextChannel} channel
* @param {Discord.User} sender
* @param {boolean} isPrivate
*/
module.exports = (channel, sender, isPrivate) => {
    if (isPrivate) {
        channel.send(getEmbedMessage(0, '0', true));
    } else {
        if (channel.guild.id === '737954264386764812') {
            /**
             * @type {Discord.TextChannel}
             */
            const ruleChannel = channel.guild.channels.cache.get('843865064042004490')
            ruleChannel.messages.fetch().then(() => {
                ruleMessage0 = ruleChannel.messages.cache.get('843874805795389471')
                ruleMessage1 = ruleChannel.messages.cache.get('843874865516773376')
                ruleMessage2 = ruleChannel.messages.cache.get('843874885436571739')
            })
        }
        channel.send(getEmbedMessage(0, channel.guild.id, false)).then(embedMessage => {
            embedMessage.react('⬅️')
            embedMessage.react('➡️')
            awaitReactionsThis(embedMessage, 0, sender)
        });
    }
}