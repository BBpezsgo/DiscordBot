const Discord = require('discord.js')
const { DatabaseManager } = require('../functions/databaseManager.js')
const GetUserColor = require('./userColor')

const roles = {
    szavazas: '795935996982198272',
    quiz: '799342836931231775',
    crossoutBejelentes: '902877945876598784',
    crossoutBejelentesPC: '902878695742652437',
    crossoutBejelentesKonzol: '902878741364105238',
    crossoutEgyeb: '902881176719622145',
    ingyenesJatek: '902878798956093510',
    warzone: '902878851938517043',
    minecraft: '902878964438143026',
    napiIdojaras: '978665941753806888',
    electricityReport: '1055067472123940944'
}

/** @param {boolean} bool */
function BoolToIcon(bool) {
    if (bool == true) {
        return '️️\\☑️'
    } else if (bool == false) {
        return '\\⬛'
    } else {
        return '\\❔'
    }
}

/**
 * @param {DatabaseManager} database
 * @param {Discord.GuildMember} member
 * @param {boolean} privateCommand
*/
module.exports = (database, member, privateCommand) => {
    const userRoles = member.roles.cache
    const embed = new Discord.EmbedBuilder()
        .setColor(GetUserColor(database.dataBasic[member.id].color))
        .setTitle('Beállítások')
        .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
        .addFields([
            {
                name: '\\🔔 Értesítés beállítások',
                value:
                    '> 📊 Szavazás: ' + BoolToIcon(userRoles.some(role => role.id === roles.szavazas)) + '\n' +
                    '> ❔ Quiz: ' + BoolToIcon(userRoles.some(role => role.id === roles.quiz)) + '\n' +
                    '> 🌦️ Napi időjárás: ' + BoolToIcon(userRoles.some(role => role.id === roles.napiIdojaras)) + '\n' +
                    '> 🔌 Tervezett áramszünetek: ' + BoolToIcon(userRoles.some(role => role.id === roles.electricityReport)) + '\n' +
                    '> 🧱 Minecraft: ' + BoolToIcon(userRoles.some(role => role.id === roles.minecraft)) + '\n' +
                    '> 🚸 Crossout: ' + BoolToIcon(userRoles.some(role => role.id === roles.crossoutBejelentes)) + '\n' +
                    '> 🚸 Crossout bejelentés [PC]: ' + BoolToIcon(userRoles.some(role => role.id === roles.crossoutBejelentesPC)) + '\n' +
                    '> 🚸 Crossout bejelentés [Konzol]: ' + BoolToIcon(userRoles.some(role => role.id === roles.crossoutBejelentesKonzol)) + '\n' +
                    '> 🚸 Crossout szórakozás: ' + BoolToIcon(userRoles.some(role => role.id === roles.crossoutEgyeb)) + '\n' +
                    '> 🛢️ Warzone 2100: ' + BoolToIcon(userRoles.some(role => role.id === roles.warzone)) + '\n' +
                    '> 💸 Ingyenes játék: ' + BoolToIcon(userRoles.some(role => role.id === roles.ingyenesJatek))
            },
            {
                name: '\\🤖 BOT beállítások',
                value:
                    '> 👁‍🗨 Privált válasz: ' + BoolToIcon(database.dataBasic[member.id].privateCommands)
            },
            {
                name: 'Mást keresel?',
                value:
                    'Statisztika és jelvények: `/profil`\n' + 
                    'Profil testreszabása: `/shop`',
                inline: false
            }
        ])
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/gear_2699-fe0f.png')
        .setFooter({ text: 'Válaszd ki az egyik opciót, hogy megváltoztasd a beállítást (bekapcs => kikapcs, és vissza)'})
    const row = new Discord.ActionRowBuilder()
    const contextMenu = new Discord.SelectMenuBuilder()
        .setCustomId('userSettings')
        .setPlaceholder('Beállítások')
        .addOptions([
            {
                label: 'Szavazás',
                value: 'szavazas',
                emoji: '📊'
            },
            {
                label: 'Quiz',
                value: 'quiz',
                emoji: '❔'
            },
            {
                label: 'Napi időjárás',
                value: 'napiIdojaras',
                emoji: '🌦️'
            },
            {
                label: 'Tervezett áramszünetek',
                value: 'electricityReport',
                emoji: '🔌'
            },
            {
                label: 'Minecraft',
                value: 'minecraft',
                emoji: '🧱'
            },
            {
                label: 'Crossout',
                value: 'crossoutBejelentes',
                emoji: '🚸'
            },
            {
                label: 'Crossout bejelentés [PC]',
                value: 'crossoutBejelentesPC',
                emoji: '🚸'
            },
            {
                label: 'Crossout bejelentés [Konzol]',
                value: 'crossoutBejelentesKonzol',
                emoji: '🚸'
            },
            {
                label: 'Crossout szórakozás',
                value: 'crossoutEgyeb',
                emoji: '🚸'
            },
            {
                label: 'Warzone 2100',
                value: 'warzone',
                emoji: '🛢️'
            },
            {
                label: 'Ingyenes játék',
                value: 'ingyenesJatek',
                emoji: '💸'
            },
            {
                label: 'Privált válasz',
                description: 'A BOT parancs válaszüzenetei csak neked lesznek láthatóak',
                value: 'privateCommands',
                emoji: '👁‍🗨'
            },
        ])
        row.addComponents(contextMenu)
    return { components: [row], embeds: [embed], ephemeral: privateCommand }
}
