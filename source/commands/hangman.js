const Discord = require('discord.js')
const fs = require('fs')
const request = require("request")
const { Color } = require('../functions/enums')

/**
 * @param {boolean} isMenu
 * @param {HangmanManager} manager
 * @param {Discord.User} user
 */
function GetMessage(isMenu, manager, user) {
    const embed = new Discord.EmbedBuilder()
        .setTitle('Hangman')
        .setAuthor({ iconURL: user.avatarURL(), name: user.username })
        .setColor(Color.Silver)
        .setThumbnail('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/hangmanThumbnail.png')
    
    if (isMenu == true) {
        embed.setDescription('Válassz nyelvet, és nehézségi szintet!')

        var defaultValue_lang_hu = true
        var defaultValue_lang_en = false
        var defaultValue_difficulty_hard = true
    
        if (manager.GetUserSettingsIndex(user.id) != null) {
            const userSettings = manager.userSettings[manager.GetUserSettingsIndex(user.id)]
            embed.addFields([{
                name: 'Beállítások',
                value:
                    'Nyelv: ' + userSettings.language + '\n' +
                    'Nehézség: ' + userSettings.difficulty,
                inline: false
            }])
    
            defaultValue_lang_en = (userSettings.language == 'EN')
            defaultValue_lang_hu = (userSettings.language == 'HU')
    
            defaultValue_difficulty_hard = (userSettings.difficulty == 'HARD')
        }
    
        const row1 = new Discord.ActionRowBuilder()
        const row2 = new Discord.ActionRowBuilder()
        const row3 = new Discord.ActionRowBuilder()
    
        const languageSelectMenu = new Discord.SelectMenuBuilder()
            .setCustomId('hangmanLang')
            .setPlaceholder('Nyelv')
            .addOptions([
                { emoji: '🇺🇲', label: 'Angol', value: 'EN', default: defaultValue_lang_en },
                { emoji: '🇭🇺', label: 'Magyar', value: 'HU', default: defaultValue_lang_hu }
            ])
        const difficultySelectMenu = new Discord.SelectMenuBuilder()
            .setCustomId('hangmanDifficulty')
            .setPlaceholder('Nehézség')
            .addOptions([
                { emoji: '🧠', label: 'Nehéz', value: 'HARD', default: defaultValue_difficulty_hard }
            ])
        const startButton = new Discord.ButtonBuilder()
            .setCustomId('hangmanStart')
            .setLabel('Indítás')
            .setStyle(Discord.ButtonStyle.Success)
        
        row1.addComponents([ languageSelectMenu ])
        row2.addComponents([ difficultySelectMenu ])
        row3.addComponents([ startButton ])
    
        return { embeds: [embed], components: [row1, row2, row3] }
    } else {
        const player = manager.players[0] //manager.players[manager.GetPlayerIndex(user.id)]
        embed.addFields([{ name: 'Játék', value: player.word, inline: false }])

        const chars = player.word.split('')
        var finalStr = ''
        for (let i = 0; i < chars.length; i++) {
            const letter = chars[i]
            
            var guessed = false

            for (let j = 0; j < player.guessedLetters.length; j++) {
                const guessedLetter = player.guessedLetters[j];
                if (guessedLetter == letter) {
                    guessed = true
                    break
                }
            }

            if (guessed == true) {
                finalStr += letter
            } else {
                finalStr += '\\_'
            }
        }
        embed.setDescription(
            '__' + finalStr + '__'
        )

        return { embeds: [embed], components: [] }
    }
}

class HangmanManager {
    constructor() {
        /**
         * @type {{
         *   userId: string;
         *   word: string;
         *   guessedLetters: string[];
         *  }[]}
         */
        this.players = []
        /**
         * @type {{
         *   userId: string;
         *   difficulty: 'HARD';
         *   language: 'HU' | 'EN';
         *  }[]}
         */
        this.userSettings = []
    }

    /** @param {string} userId */
    GetPlayerIndex(userId) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].userId == userId) {
                return i
            }
        }
        return null
    }

    /** @param {string} userId */
    GetUserSettingsIndex(userId) {
        for (let i = 0; i < this.userSettings.length; i++) {
            if (this.userSettings[i].userId == userId) {
                return i
            }
        }
        return null
    }    
}

/**
 * @param {Discord.Interaction} interaction
 * @param {HangmanManager} manager
 */
function CommandHangman(interaction, manager, isCommand) {
    var isMenu = (manager.GetPlayerIndex(interaction.user.id) == null)
    if (isCommand) {
        interaction.reply(GetMessage(isMenu, manager, interaction.user))
    } else {
        interaction.update(GetMessage(isMenu, manager, interaction.user))
    }
}

module.exports = { CommandHangman, HangmanManager }