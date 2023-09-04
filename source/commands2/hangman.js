const Discord = require('discord.js')
const fs = require('fs')
const Path = require("path")
const { Color } = require('../functions/enums')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')

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

    /**
     * @param {Discord.ButtonInteraction<Discord.CacheType>} e
     */
    OnButton(e) {
        if (e.customId == 'hangmanStart') {
            if (this.GetUserSettingsIndex(e.user.id) == null) {
                e.reply({ content: '> **\\❌ Hiba: A beállításaid nem találhatók!**', ephemeral: true})
                return true
            }

            const settings = this.userSettings[this.GetUserSettingsIndex(e.user.id)]
            
            var rawWordList = ''
            if (settings.language == 'EN') {
                rawWordList = fs.readFileSync(Path.join(CONFIG.paths.base, './word-list/english.txt'), 'utf-8')
            } else if (settings.language == 'HU') {
                rawWordList = fs.readFileSync(Path.join(CONFIG.paths.base, './word-list/hungarian.txt'), 'utf-8')
            } else {
                e.reply({ content: '> **\\❌ Hiba: Ismeretlen nyelv "' + settings.language + '"!**', ephemeral: true})
                return true
            }
            var wordList = ['']
            if (settings.language == 'EN') {
                wordList = rawWordList.split('\n')
            } else if (settings.language == 'HU') {
                const wordListHU = rawWordList.split('\n')
                for (let i = 0; i < wordListHU.length; i++) {
                    const item = wordListHU[i]
                    wordList.push(item.split(' ')[0])
                }
            }

            const randomIndex = Math.floor(Math.random() * wordList.length)
            const randomWord = wordList[randomIndex]

            if (this.GetPlayerIndex(e.user.id) == null) {
                this.players.push({ userId: e.user.id, word: randomWord, guessedLetters: [] })
            } else {
                this.players[this.GetPlayerIndex(e.user.id)] = { userId: e.user.id, word: randomWord, guessedLetters: [] }
            }

            CommandHangman(e, this, false)

            return true
        }

        return false
    }

    /**
     * @param {Discord.SelectMenuInteraction<Discord.CacheType>} e
     */
    OnSelectMenu(e) {
        if (e.customId == 'hangmanLang') {
            const languageSelected = e.values[0]
            
            if (this.GetUserSettingsIndex(e.user.id) == null) {
                this.userSettings.push({ userId: e.user.id, difficulty: 'HARD', language: languageSelected })
            } else {
                this.userSettings[this.GetUserSettingsIndex(e.user.id)].language = languageSelected
            }

            CommandHangman(e, this, false)

            return true
        }

        if (e.customId == 'hangmanDifficulty') {
            const difficultySelected = e.values[0]
            
            if (this.GetUserSettingsIndex(e.user.id) == null) {
                this.userSettings.push({ userId: e.user.id, difficulty: difficultySelected, language: 'HU' })
            } else {
                this.userSettings[this.GetUserSettingsIndex(e.user.id)].difficulty = difficultySelected
            }
            
            CommandHangman(e, this, false)

            return true
        }

        return false
    }
}

/**
 * @param {Discord.ChatInputCommandInteraction} e
 * @param {HangmanManager} manager
 */
async function CommandHangman(e, manager, isCommand) {
    var isMenu = (manager.GetPlayerIndex(e.user.id) == null)
    if (isCommand) {
        await e.reply(GetMessage(isMenu, manager, e.user))
    } else {
        await e.editReply(GetMessage(isMenu, manager, e.user))
    }
}

/** @type {import("./base").Command} */
const Command = {
    Data: {},
    Execute: async (interaction, ephemeral, sender) => {
        await CommandHangman(interaction, sender.HangmanManager, true)
    }
}

module.exports = {
    ...Command,
    HangmanManager,
}