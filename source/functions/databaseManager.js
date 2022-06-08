const Discord = require('discord.js')
const fs = require('fs')

function IsNone(obj) {
    if (obj == undefined) { return false }
    if (obj == null) { return false }
    if (obj === {}) { return false }
    return true
}

class DatabaseManager {
    /**
     * @param {string} databaseFolderPath Something like this.databaseFolderPath + ''
     */
    constructor(databaseFolderPath) {
        /** @type {string} */
        this.databaseFolderPath = databaseFolderPath
        this.dataBasic = {}
        this.dataMarket = {}
        this.dataBackpacks = {}
        this.dataPolls = {}
        this.dataMail = {}
        this.dataUsernames = {}
        this.dataBot = {}
        this.dataStickers = {}
        this.dataUserstats = {}
        this.dataBusinesses = {}
    }

    /**
     * @param {Discord.User} user
     * @param {string} username
     */
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
            this.dataBusinesses[user.id] = {};
        };
        if (!this.dataBusinesses[user.id].username) {
            this.dataBusinesses[user.id].username = user.username;
        };
        if (!this.dataBusinesses[user.id].businessIndex) {
            this.dataBusinesses[user.id].businessIndex = 0;
        };

        this.SaveDatabase()
    }

    SaveDatabase() {
        if (IsNone(this.dataBackpacks)) {
            fs.writeFile(this.databaseFolderPath + 'backpacks.json', JSON.stringify(this.dataBackpacks), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataBasic)) {
            fs.writeFile(this.databaseFolderPath + 'basic.json', JSON.stringify(this.dataBasic), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataStickers)) {
            fs.writeFile(this.databaseFolderPath + 'stickers.json', JSON.stringify(this.dataStickers), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataUsernames)) {
            fs.writeFile(this.databaseFolderPath + 'userNames.json', JSON.stringify(this.dataUsernames), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataMail)) {
            fs.writeFile(this.databaseFolderPath + 'mails.json', JSON.stringify(this.dataMail), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataPolls)) {
            fs.writeFile(this.databaseFolderPath + 'polls.json', JSON.stringify(this.dataPolls), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataUserstats)) {
            fs.writeFile(this.databaseFolderPath + 'userstats.json', JSON.stringify(this.dataUserstats), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataBusinesses)) {
            fs.writeFile(this.databaseFolderPath + 'businesses.json', JSON.stringify(this.dataBusinesses), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataBot)) {
            fs.writeFile(this.databaseFolderPath + 'bot.json', JSON.stringify(this.dataBot), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
        if (IsNone(this.dataMarket)) {
            fs.writeFile(this.databaseFolderPath + 'market.json', JSON.stringify(this.dataMarket), (err) => { if (err) { console.log(ERROR & ': ' & err.message) }; });
        }
    }

    LoadDatabase() {
        this.dataBackpacks = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'backpacks.json', 'utf-8'))
        this.dataBasic = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'basic.json', 'utf-8'))
        this.dataStickers = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'stickers.json', 'utf-8'))
        this.dataBot = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'bot.json', 'utf-8'))
        this.dataMarket = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'market.json', 'utf-8'))
        this.dataUsernames = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'userNames.json', 'utf-8'))
        this.dataMail = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'mails.json', 'utf-8'))
        this.dataPolls = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'polls.json', 'utf-8'))
        this.dataUserstats = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'userstats.json', 'utf-8'))
        this.dataBusinesses = JSON.parse(fs.readFileSync(this.databaseFolderPath + 'businesses.json', 'utf-8'))
    }
}

module.exports = { DatabaseManager }