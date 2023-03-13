const Discord = require('discord.js')
const fs = require('fs')
const { StatesManager } = require('../functions/statesManager')
const { userstatsSendMeme, userstatsSendMusic, userstatsSendYoutube, userstatsSendMessage, userstatsSendChars, userstatsSendCommand, userstatsAddUserToMemory } = require('../economy/userstats.js')

function IsAnything(obj) {
    if (obj == undefined) { return false }
    if (obj == null) { return false }
    if (obj === {}) { return false }
    return true
}

/** @type {import('./databaseManager').DatabaseManager} */
class DatabaseManager {
    /**
     * @param {string} databaseFolderPath this.databaseFolderPath + 'dataFilename.json'
     * @param {string} backupFolderPath this.backupFolderPath + 'dataFilename.json'
     * @param {StatesManager} statesManager
     */
    constructor(databaseFolderPath, backupFolderPath, statesManager) {
        /** @type {string} */
        this.databaseFolderPath = databaseFolderPath
        this.backupFolderPath = backupFolderPath
        this.dataBasic = {}
        // this.dataMarket = {}
        this.dataBackpacks = {}
        this.dataPolls = {}
        this.dataMail = {}
        this.dataUsernames = {}
        this.dataBot = {}
        this.dataStickers = {}
        this.dataUserstats = {}
        this.dataBusinesses = {}

        this.statesManager = statesManager
    }

    /** @param {Discord.User} user @param {string} username */
    SaveUserToMemoryAll(user, username) {
        if (!this.dataBackpacks[user.id]) {
            this.dataBackpacks[user.id] = {}
        }
        this.dataBackpacks[user.id].username = username
        if (!this.dataBackpacks[user.id].crates) {
            this.dataBackpacks[user.id].crates = 0
        }
        if (!this.dataBackpacks[user.id].gifts) {
            this.dataBackpacks[user.id].gifts = 0
        }
        if (!this.dataBackpacks[user.id].getGift) {
            this.dataBackpacks[user.id].getGift = 0
        }
        if (!this.dataBackpacks[user.id].tickets) {
            this.dataBackpacks[user.id].tickets = 0
        }
        if (!this.dataBackpacks[user.id].quizTokens) {
            this.dataBackpacks[user.id].quizTokens = 0
        }
        if (!this.dataBackpacks[user.id].luckyCards) {
            this.dataBackpacks[user.id].luckyCards = {}
        }
        if (!this.dataBackpacks[user.id].luckyCards.small) {
            this.dataBackpacks[user.id].luckyCards.small = 0
        }
        if (!this.dataBackpacks[user.id].luckyCards.medium) {
            this.dataBackpacks[user.id].luckyCards.medium = 0
        }
        if (!this.dataBackpacks[user.id].luckyCards.large) {
            this.dataBackpacks[user.id].luckyCards.large = 0
        }

        if (!this.dataBasic[user.id]) {
            this.dataBasic[user.id] = {}
        }
        this.dataBasic[user.id].username = username
        if (!this.dataBasic[user.id].score) {
            this.dataBasic[user.id].score = 0
        }
        if (!this.dataBasic[user.id].money) {
            this.dataBasic[user.id].money = 0
        }
        if (!this.dataBasic[user.id].day) {
            this.dataBasic[user.id].day = 0
        }
        if (!this.dataBasic[user.id].color) {
            this.dataBasic[user.id].color = 0
        }
        if (!this.dataBasic[user.id].customname) {
            this.dataBasic[user.id].customname = username
        }
        if (!this.dataBasic[user.id].privateCommands) {
            this.dataBasic[user.id].privateCommands = false
        }

        if (!this.dataStickers[user.id]) {
            this.dataStickers[user.id] = {}
        }
        this.dataStickers[user.id].username = username
        if (!this.dataStickers[user.id].stickersMeme) {
            this.dataStickers[user.id].stickersMeme = 0
        }
        if (!this.dataStickers[user.id].stickersMusic) {
            this.dataStickers[user.id].stickersMusic = 0
        }
        if (!this.dataStickers[user.id].stickersYoutube) {
            this.dataStickers[user.id].stickersYoutube = 0
        }
        if (!this.dataStickers[user.id].stickersMessage) {
            this.dataStickers[user.id].stickersMessage = 0
        }
        if (!this.dataStickers[user.id].stickersCommand) {
            this.dataStickers[user.id].stickersCommand = 0
        }
        if (!this.dataStickers[user.id].stickersTip) {
            this.dataStickers[user.id].stickersTip = 0
        }

        if (!this.dataMail.mailIds) {
            this.dataMail.mailIds = ''
        }
        if (!this.dataMail[user.id]) {
            this.dataMail[user.id] = {}
        }
        this.dataMail[user.id].username = username
        if (!this.dataMail[user.id].inbox) {
            this.dataMail[user.id].inbox = {}
        }
        if (!this.dataMail[user.id].outbox) {
            this.dataMail[user.id].outbox = {}
        }

        if (!this.dataUsernames[user.id]) {
            this.dataUsernames[user.id] = {}
        }
        this.dataUsernames[user.id].username = username
        this.dataUsernames[user.id].avatarURL = user.avatarURL({ format: 'png' })

        if (!this.dataBusinesses[user.id]) {
            this.dataBusinesses[user.id] = {}
        }
        if (!this.dataBusinesses[user.id].username) {
            this.dataBusinesses[user.id].username = user.username
        }
        if (!this.dataBusinesses[user.id].businessIndex) {
            this.dataBusinesses[user.id].businessIndex = 0
        }

        this.SaveDatabase()
    }

    SaveDatabase() {
        if (IsAnything(this.dataBackpacks)) {
            this.statesManager.Database.SaveText = 'backpacks'
            fs.writeFile(this.databaseFolderPath + 'backpacks.json', JSON.stringify(this.dataBackpacks), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataBasic)) {
            this.statesManager.Database.SaveText = 'basic'
            fs.writeFile(this.databaseFolderPath + 'basic.json', JSON.stringify(this.dataBasic), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataStickers)) {
            this.statesManager.Database.SaveText = 'stickers'
            fs.writeFile(this.databaseFolderPath + 'stickers.json', JSON.stringify(this.dataStickers), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataUsernames)) {
            this.statesManager.Database.SaveText = 'userNames'
            fs.writeFile(this.databaseFolderPath + 'userNames.json', JSON.stringify(this.dataUsernames), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataMail)) {
            this.statesManager.Database.SaveText = 'mails'
            fs.writeFile(this.databaseFolderPath + 'mails.json', JSON.stringify(this.dataMail), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataPolls)) {
            this.statesManager.Database.SaveText = 'polls'
            fs.writeFile(this.databaseFolderPath + 'polls.json', JSON.stringify(this.dataPolls), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataUserstats)) {
            this.statesManager.Database.SaveText = 'userstats'
            fs.writeFile(this.databaseFolderPath + 'userstats.json', JSON.stringify(this.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataBusinesses)) {
            this.statesManager.Database.SaveText = 'businesses'
            fs.writeFile(this.databaseFolderPath + 'businesses.json', JSON.stringify(this.dataBusinesses), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        if (IsAnything(this.dataBot)) {
            this.statesManager.Database.SaveText = 'bot'
            fs.writeFile(this.databaseFolderPath + 'bot.json', JSON.stringify(this.dataBot), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        }
        // if (IsAnything(this.dataMarket)) {
        //     this.statesManager.Database.SaveText = 'market'
        //     fs.writeFile(this.databaseFolderPath + 'market.json', JSON.stringify(this.dataMarket), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; })
        // }
        this.statesManager.Database.SaveText = ''
    }

    LoadDatabase() {
        var success = true

        this.statesManager.Database.LoadText = 'backpacks'
        const rawJsonBackpacks = fs.readFileSync(this.databaseFolderPath + 'backpacks.json', 'utf-8')
        this.statesManager.Database.LoadText = 'basic'
        const rawJsonBasic = fs.readFileSync(this.databaseFolderPath + 'basic.json', 'utf-8')
        this.statesManager.Database.LoadText = 'stickers'
        const rawJsonStickers = fs.readFileSync(this.databaseFolderPath + 'stickers.json', 'utf-8')
        this.statesManager.Database.LoadText = 'bot'
        const rawJsonBot = fs.readFileSync(this.databaseFolderPath + 'bot.json', 'utf-8')
        this.statesManager.Database.LoadText = 'market'
        // const rawJsonMarket = fs.readFileSync(this.databaseFolderPath + 'market.json', 'utf-8')
        this.statesManager.Database.LoadText = 'userNames'
        const rawJsonUsernames = fs.readFileSync(this.databaseFolderPath + 'userNames.json', 'utf-8')
        this.statesManager.Database.LoadText = 'mails'
        const rawJsonMail = fs.readFileSync(this.databaseFolderPath + 'mails.json', 'utf-8')
        this.statesManager.Database.LoadText = 'polls'
        const rawJsonPolls = fs.readFileSync(this.databaseFolderPath + 'polls.json', 'utf-8')
        this.statesManager.Database.LoadText = 'userstats'
        const rawJsonUserstats = fs.readFileSync(this.databaseFolderPath + 'userstats.json', 'utf-8')
        this.statesManager.Database.LoadText = 'businesses'
        const rawJsonBusinesses = fs.readFileSync(this.databaseFolderPath + 'businesses.json', 'utf-8')
        this.statesManager.Database.LoadText = ''

        this.statesManager.Database.ParsingText = 'backpacks'
        if (rawJsonBackpacks != undefined && rawJsonBackpacks != null && rawJsonBackpacks != '') {
            this.dataBackpacks = JSON.parse(rawJsonBackpacks)
        } else { success = false }
        this.statesManager.Database.ParsingText = 'basic'
        if (rawJsonBasic != undefined && rawJsonBasic != null && rawJsonBasic != '') {
            this.dataBasic = JSON.parse(rawJsonBasic)
        } else { success = false }
        this.statesManager.Database.ParsingText = 'stickers'
        if (rawJsonStickers != undefined && rawJsonStickers != null && rawJsonStickers != '') {
            this.dataStickers = JSON.parse(rawJsonStickers)
        } else { success = false }
        this.statesManager.Database.ParsingText = 'bot'
        if (rawJsonBot != undefined && rawJsonBot != null && rawJsonBot != '') {
            this.dataBot = JSON.parse(rawJsonBot)
        } else { success = false }
        // this.statesManager.Database.ParsingText = 'market'
        // if (rawJsonMarket != undefined && rawJsonMarket != null && rawJsonMarket != '') {
        //     this.dataMarket = JSON.parse(rawJsonMarket)
        // } else { success = false }
        this.statesManager.Database.ParsingText = 'userNames'
        if (rawJsonUsernames != undefined && rawJsonUsernames != null && rawJsonUsernames != '') {
            this.dataUsernames = JSON.parse(rawJsonUsernames)
        } else { success = false }
        this.statesManager.Database.ParsingText = 'mails'
        if (rawJsonMail != undefined && rawJsonMail != null && rawJsonMail != '') {
            this.dataMail = JSON.parse(rawJsonMail)
        } else { success = false }
        this.statesManager.Database.ParsingText = 'polls'
        if (rawJsonPolls != undefined && rawJsonPolls != null && rawJsonPolls != '') {
            this.dataPolls = JSON.parse(rawJsonPolls)
        } else { success = false }
        this.statesManager.Database.ParsingText = 'userstats'
        if (rawJsonUserstats != undefined && rawJsonUserstats != null && rawJsonUserstats != '') {
            this.dataUserstats = JSON.parse(rawJsonUserstats)
        } else { success = false }
        this.statesManager.Database.ParsingText = 'businesses'
        if (rawJsonBusinesses != undefined && rawJsonBusinesses != null && rawJsonBusinesses != '') {
            this.dataBusinesses = JSON.parse(rawJsonBusinesses)
        } else { success = false }
        this.statesManager.Database.ParsingText = ''
        return success
    }

    BackupDatabase() {
        this.statesManager.Database.BackupText = 'backpacks'
        fs.copyFileSync(this.backupFolderPath + 'backpacks.json', this.databaseFolderPath + 'backpacks.json', )
        this.statesManager.Database.BackupText = 'basic'
        fs.copyFileSync(this.backupFolderPath + 'basic.json', this.databaseFolderPath + 'basic.json', )
        this.statesManager.Database.BackupText = 'stickers'
        fs.copyFileSync(this.backupFolderPath + 'stickers.json', this.databaseFolderPath + 'stickers.json', )
        this.statesManager.Database.BackupText = 'bot'
        fs.copyFileSync(this.backupFolderPath + 'bot.json', this.databaseFolderPath + 'bot.json', )
        this.statesManager.Database.BackupText = 'market'
        fs.copyFileSync(this.backupFolderPath + 'market.json', this.databaseFolderPath + 'market.json', )
        this.statesManager.Database.BackupText = 'userNames'
        fs.copyFileSync(this.backupFolderPath + 'userNames.json', this.databaseFolderPath + 'userNames.json', )
        this.statesManager.Database.BackupText = 'mails'
        fs.copyFileSync(this.backupFolderPath + 'mails.json', this.databaseFolderPath + 'mails.json', )
        this.statesManager.Database.BackupText = 'polls'
        fs.copyFileSync(this.backupFolderPath + 'polls.json', this.databaseFolderPath + 'polls.json', )
        this.statesManager.Database.BackupText = 'userstats'
        fs.copyFileSync(this.backupFolderPath + 'userstats.json', this.databaseFolderPath + 'userstats.json', )
        this.statesManager.Database.BackupText = 'businesses'
        fs.copyFileSync(this.backupFolderPath + 'businesses.json', this.databaseFolderPath + 'businesses.json', )
        this.statesManager.Database.BackupText = ''
    }

    /** @param {Discord.User} user */
    UserstatsSendMeme(user) { userstatsSendMeme(this, user) }
    /** @param {Discord.User} user */
    UserstatsSendMusic(user) { userstatsSendMusic(this, user) }
    /** @param {Discord.User} user */
    UserstatsSendYoutube(user) { userstatsSendYoutube(this, user) }
    /** @param {Discord.User} user */
    UserstatsSendMessage(user) { userstatsSendMessage(this, user) }
    /** @param {Discord.User} user @param {string} text */
    UserstatsSendChars(user, text) { userstatsSendChars(this, user, text) }
    /** @param {Discord.User} user */
    UserstatsSendCommand(user) { userstatsSendCommand(this, user) }
    /** @param {Discord.User} user */
    UserstatsAddUserToMemory(user) { userstatsAddUserToMemory(this, user) }

    Fix() {
        let users = Object.keys(this.dataBackpacks)
        for (const user of users) {
            this.dataBackpacks[user].crates = Number.parseInt((this.dataBackpacks[user].crates ?? 0).toString())
            this.dataBackpacks[user].getGift = Number.parseInt((this.dataBackpacks[user].getGift ?? 0).toString())
            this.dataBackpacks[user].gifts = Number.parseInt((this.dataBackpacks[user].gifts ?? 0).toString())
            this.dataBackpacks[user].jewel = Number.parseInt((this.dataBackpacks[user].jewel ?? 0).toString())
            this.dataBackpacks[user].luckyCards.large = Number.parseInt((this.dataBackpacks[user].luckyCards.large ?? 0).toString())
            this.dataBackpacks[user].luckyCards.medium = Number.parseInt((this.dataBackpacks[user].luckyCards.medium ?? 0).toString())
            this.dataBackpacks[user].luckyCards.small = Number.parseInt((this.dataBackpacks[user].luckyCards.small ?? 0).toString())
            this.dataBackpacks[user].quizTokens = Number.parseInt((this.dataBackpacks[user].quizTokens ?? 0).toString())
            this.dataBackpacks[user].tickets = Number.parseInt((this.dataBackpacks[user].tickets ?? 0).toString())
        }
    
        users = Object.keys(this.dataBasic)
        for (const user of users) {
            this.dataBasic[user].day = Number.parseInt((this.dataBasic[user].day ?? 0).toString())
            this.dataBasic[user].money = Number.parseInt((this.dataBasic[user].money ?? 0).toString())
            this.dataBasic[user].score = Number.parseInt((this.dataBasic[user].score ?? 0).toString())
        }
    
        this.dataBot.day = Number.parseInt((this.dataBot.day ?? 0).toString())
    
        users = Object.keys(this.dataUserstats)
        for (const user of users) {
            this.dataUserstats[user].chars = Number.parseInt((this.dataUserstats[user].chars ?? 0).toString())
            this.dataUserstats[user].commands = Number.parseInt((this.dataUserstats[user].commands ?? 0).toString())
            this.dataUserstats[user].memes = Number.parseInt((this.dataUserstats[user].memes ?? 0).toString())
            this.dataUserstats[user].messages = Number.parseInt((this.dataUserstats[user].messages ?? 0).toString())
            this.dataUserstats[user].musics = Number.parseInt((this.dataUserstats[user].musics ?? 0).toString())
            this.dataUserstats[user].youtubevideos = Number.parseInt((this.dataUserstats[user].youtubevideos ?? 0).toString())
        }
    }
}

module.exports = { DatabaseManager }