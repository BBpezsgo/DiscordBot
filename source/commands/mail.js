const Discord = require('discord.js')
const { DatabaseManager } = require('../functions/databaseManager')

class MailManager {
    /** @param {DatabaseManager} database */
    constructor(database) {
        /** @type {CurrentlyWritingMail[]} */
        this.currentlyWritingEmails = []
        /** @type {DatabaseManager} */
        this.database = database
    }

    /** @param {number} userID @returns {number} */
    GetCurrentlyEditingMailIndex(userID) {
        for (let i = 0; i < this.currentlyWritingEmails.length; i++) {
            const mail = this.currentlyWritingEmails[i]
            if (mail.user.id === userID) {
                return i
            }
        }

        return -1
    }

    /** @param {Discord.User} sender @param {Discord.TextBasedChannel} channel */
    CommandMail(sender, channel) {
        const message = this.GetMailMessage(sender)
        channel.send({ embeds: [message.embed], components: [message.actionRows[0]] })
    }

    /**
     * @param {Discord.User} user
     * @param {number} selectedIndex 0: main | 1: inbox | 2: outbox | 3: writing
     */
    GetMailMessage(user, selectedIndex = 0) {
        const button0 = new Discord.ButtonBuilder()
            .setLabel("Kezdőlap")
            .setCustomId("mailFolderMain")
            .setStyle(Discord.ButtonStyle.Secondary)
        const button1 = new Discord.ButtonBuilder()
            .setLabel("Beérkező e-mailek")
            .setCustomId("mailFolderInbox")
            .setStyle(Discord.ButtonStyle.Secondary)
        const button2 = new Discord.ButtonBuilder()
            .setLabel("Elküldött e-mailek")
            .setCustomId("mailFolderOutbox")
            .setStyle(Discord.ButtonStyle.Secondary)
        const button3 = new Discord.ButtonBuilder()
            .setLabel("✍️ Levél írása")
            .setCustomId("mailWrite")
            .setStyle(Discord.ButtonStyle.Primary)

        const row0 = new Discord.ActionRowBuilder()

        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.avatarURL() })

        if (selectedIndex === 0) {
            embed.setTitle("Kezdőlap")
            const allInboxMails = this.GetAllMails(user.id, MailFolder.inbox)
            const allOutboxMails = this.GetAllMails(user.id, MailFolder.outbox)
            let unreaded = 0
            allInboxMails.forEach(mail => {
                if (mail.readed === false) {
                    unreaded += 1
                }
            })
            embed.addFields([
                { name: '📥 Beérkező levelek', value: 'Olvasatlan: ' + unreaded + '\nÖsszes: ' + allInboxMails.length },
                { name: '📤 Elküldött levelek', value: 'Összes: ' + allOutboxMails.length }
            ])

            button0.setLabel("↻")
            button0.setStyle(Discord.ButtonStyle.Primary)
            row0.addComponents(button3, button0, button1, button2)
        } else if (selectedIndex === 1) {
            embed.setTitle("📥 Beérkező levelek")

            const allMails = this.GetAllMails(user.id, MailFolder.inbox)
            allMails.forEach(mail => {
                embed.addFields([{
                    name: mail.icon + ' ' + mail.sender.name + ' - ' + mail.title,
                    value: mail.context + '\n[' + new Date(mail.date).toDateString() + ']\n',
                    inline: false
                }])
            })

            button1.setLabel("↻")
            button1.setStyle(Discord.ButtonStyle.Primary)
            row0.addComponents(button3, button1, button0, button2)

            this.SetReadAllMessages(user.id)
        } else if (selectedIndex === 2) {
            embed.setTitle("📤 Elküldött levelek")

            const allMails = this.GetAllMails(user.id, MailFolder.outbox)
            allMails.forEach(mail => {
                embed.addFields([{
                    name: mail.icon + ' ' + mail.reciver.name + ' - ' + mail.title,
                    value: mail.context + '\n[' + new Date(mail.date).toDateString() + ']\n',
                    inline: false
                }])
            })

            button2.setLabel("↻")
            button2.setStyle(Discord.ButtonStyle.Primary)
            row0.addComponents(button3, button2, button0, button1)
        } else if (selectedIndex === 3) {
            embed.setTitle("Levél írása")

            /** @type {Mail} */
            let mail
            this.currentlyWritingEmails.forEach(wMail => {
                if (wMail.user.id === user.id) {
                    mail = wMail.mail
                }
            })

            embed.addFields([{
                name: 'Cím: "' + mail.title + '"',
                value: 'Üzenet: "' + mail.context + '"\n' + 'Fogadó: @' + mail.reciver.name
            }])
                .setFooter({
                    text: '.mail wt [cím] Cím beállítása\n' +
                        '.mail wc [üzenet] Üzenet beállítása\n' +
                        '.mail wr [@Felhasználó | Azonosító] Címzet beállítása'
                })

            const button4 = new Discord.ButtonBuilder()
                .setLabel("Küldés")
                .setCustomId("mailWriteSend")
                .setStyle(Discord.ButtonStyle.Success)
            const button5 = new Discord.ButtonBuilder()
                .setLabel("Elvetés")
                .setCustomId("mailWriteAbort")
                .setStyle(Discord.ButtonStyle.Danger)
            row0.addComponents(button4, button5)
        }
        return new MailMessage(embed, [row0])
    }

    /** @param {Discord.User} sender @param {Discord.User} reciver @param {Mail} mail */
    sendMail(sender, reciver, mail) {
        let newMail = mail
        newMail.sender = new MailUser(sender.username, sender.id)
        newMail.reciver = new MailUser(reciver.username, reciver.id)
        return this.sendMailOM(newMail)
    }

    /** @param {Mail} mail */
    sendMailOM(mail) {
        if (!this.database.dataMail[mail.reciver.id]) return false
        if (!this.database.dataMail[mail.sender.id]) return false
        if (!this.database.dataMail[mail.reciver.id].inbox) return false
        if (!this.database.dataMail[mail.sender.id].outbox) return false

        this.database.dataMail[mail.reciver.id].inbox[mail.id] = {}
        this.database.dataMail[mail.reciver.id].inbox[mail.id].sender = {}
        this.database.dataMail[mail.reciver.id].inbox[mail.id].sender.name = this.database.dataMail[mail.sender.id].username
        this.database.dataMail[mail.reciver.id].inbox[mail.id].sender.id = mail.sender.id
        this.database.dataMail[mail.reciver.id].inbox[mail.id].reciver = {}
        this.database.dataMail[mail.reciver.id].inbox[mail.id].reciver.name = this.database.dataMail[mail.reciver.id].username
        this.database.dataMail[mail.reciver.id].inbox[mail.id].reciver.id = mail.reciver.id
        this.database.dataMail[mail.reciver.id].inbox[mail.id].title = mail.title
        this.database.dataMail[mail.reciver.id].inbox[mail.id].context = mail.context
        this.database.dataMail[mail.reciver.id].inbox[mail.id].date = mail.date
        this.database.dataMail[mail.reciver.id].inbox[mail.id].readed = false
        this.database.dataMail[mail.reciver.id].inbox[mail.id].icon = "✉️"
        this.database.dataMail.mailIds += '|' + mail.id

        const newMailId = GenerateMailID()
        this.database.dataMail[mail.sender.id].outbox[mail.id] = {}
        this.database.dataMail[mail.sender.id].outbox[mail.id].sender = {}
        this.database.dataMail[mail.sender.id].outbox[mail.id].sender.name = this.database.dataMail[mail.sender.id].username
        this.database.dataMail[mail.sender.id].outbox[mail.id].sender.id = mail.sender.id
        this.database.dataMail[mail.sender.id].outbox[mail.id].reciver = {}
        this.database.dataMail[mail.sender.id].outbox[mail.id].reciver.name = this.database.dataMail[mail.reciver.id].username
        this.database.dataMail[mail.sender.id].outbox[mail.id].reciver.id = mail.reciver.id
        this.database.dataMail[mail.sender.id].outbox[mail.id].title = mail.title
        this.database.dataMail[mail.sender.id].outbox[mail.id].context = mail.context
        this.database.dataMail[mail.sender.id].outbox[mail.id].date = mail.date
        this.database.dataMail[mail.sender.id].outbox[mail.id].readed = true
        this.database.dataMail[mail.sender.id].outbox[mail.id].icon = "✉️"
        this.database.dataMail.mailIds += '|' + newMailId

        this.database.SaveDatabase()

        return true
    }

    GenerateMailID() {
        const allMailIds = this.GetAllMailIDs()
        let generatedMailId = 0
        while (allMailIds.includes(generatedMailId.toString()) === true) {
            generatedMailId += 1
        }
        return generatedMailId.toString()
    }

    /** @returns {string[]} */
    GetAllMailIDs() {
        return this.database.dataMail.mailIds.toString().split('|')
    }

    /** @param {string} userId @param {MailFolder} folder */
    GetAllMails(userId, folder) {
        if (!this.database.dataMail[userId]) return []
        if (!this.database.dataMail[userId].inbox) return []

        const allMailIds = this.GetAllMailIDs()
        /** @type {Mail[]} */
        let allMails = []

        for (let i = 0; i < allMailIds.length; i++) {
            const mailId = allMailIds[i]
            if (folder === MailFolder.inbox) {
                if (this.database.dataMail[userId].inbox[mailId]) {
                    allMails.push(this.GetMailFromRawJSON(this.database.dataMail[userId].inbox[mailId], mailId))
                }
            } else if (folder === MailFolder.outbox) {
                if (this.database.dataMail[userId].outbox[mailId]) {
                    allMails.push(this.GetMailFromRawJSON(this.database.dataMail[userId].outbox[mailId], mailId))
                }
            }
        }
        allMails = allMails.reverse()
        return allMails
    }

    /** @param {string} id */
    GetMailFromRawJSON(rawJSON, id) {
        return new Mail(id,
            new MailUser(rawJSON.sender.name, rawJSON.sender.id),
            new MailUser(rawJSON.reciver.name, rawJSON.reciver.id),
            rawJSON.title,
            rawJSON.context,
            rawJSON.date,
            rawJSON.readed,
            rawJSON.icon)
    }

    SetReadAllMessages(userId) {
        if (!this.database.dataMail[userId]) return
        if (!this.database.dataMail[userId].inbox) return

        const allMailIds = this.GetAllMailIDs()
        for (let i = 0; i < allMailIds.length; i++) {
            const mailId = allMailIds[i]
            if (this.database.dataMail[userId].inbox[mailId]) {
                this.database.dataMail[userId].inbox[mailId].readed = true
            }
        }

        this.database.SaveDatabase()
    }

    /** @param {Discord.ButtonInteraction<Discord.CacheType>} e */
    OnButtonClick(e) {
        if (e.component.customId === 'mailFolderMain') {
            const message = this.GetMailMessage(e.user, 0)
            e.update({ embeds: [message.embed], components: [message.actionRows[0]] })
            return true
        }
        
        if (e.component.customId === 'mailFolderInbox') {
            const message = this.GetMailMessage(e.user, 1)
            e.update({ embeds: [message.embed], components: [message.actionRows[0]] })
            return true
        }
        
        if (e.component.customId === 'mailFolderOutbox') {
            const message = this.GetMailMessage(e.user, 2)
            e.update({ embeds: [message.embed], components: [message.actionRows[0]] })
            return true
        }
        
        if (e.component.customId === 'mailWrite') {
            this.currentlyWritingEmails.push(
                new CurrentlyWritingMail(
                    e.user,
                    new Mail(
                        -1,
                        new MailUser(e.user.username, e.user.id),
                        new MailUser(e.user.username, e.user.id),
                        'Cím',
                        'Üzenet'
                    ),
                    e.message
                ))

            const message = this.GetMailMessage(e.user, 3)
            e.update({ embeds: [message.embed], components: [message.actionRows[0]] })
            return true
        }
        
        if (e.component.customId === 'mailWriteAbort') {
            const message = this.GetMailMessage(e.user)
            e.update({ embeds: [message.embed], components: [message.actionRows[0]] })
            this.currentlyWritingEmails.splice(this.GetCurrentlyEditingMailIndex(e.user.id), 1)
            return true
        }
        
        if (e.component.customId === 'mailWriteSend') {
            const editingMail = this.currentlyWritingEmails[this.GetCurrentlyEditingMailIndex(e.user.id)]
            let newMail = editingMail.mail
            newMail.date = Date.now()
            newMail.sender = new MailUser(editingMail.user.username, editingMail.user.id)
            newMail.id = this.GenerateMailID()
            const sended = this.sendMailOM(newMail)

            if (sended === true) {
                editingMail.message.channel.send('\\✔️ **A levél elküldve neki: ' + editingMail.mail.reciver.name + '**')

                const message = this.GetMailMessage(e.user)
                e.update({ embeds: [message.embed], components: [message.actionRows[0]] })
                this.currentlyWritingEmails.splice(this.GetCurrentlyEditingMailIndex(e.user.id), 1)
            } else {
                editingMail.message.channel.send('\\❌ **A levelet nem sikerült elküldeni**')
            }

            return true
        }

        return false
    }
}

class Mail {
    /**
     * @param {string} id
     * @param {MailUser} sender
     * @param {MailUser} reciver
     * @param {string} title
     * @param {string} context
     * @param {number} date
     * @param {boolean} readed
     * @param {string} icon
     */
    constructor(id, sender, reciver, title, context, date = Date.now(), readed = false, icon = "✉️") {
        this.id = id
        this.sender = sender
        this.reciver = reciver
        this.title = title
        this.context = context
        this.date = date
        this.readed = readed
        this.icon = icon
    }
}

const MailUserType = {
    unknown: 0,
    user: 1,
    system: 2
}

class MailUser {
    /**
     * @param {string} name
     * @param {string} id
     * @param {MailUserType} type
     */
    constructor(name, id, type = MailUserType.user) {
        this.name = name
        this.id = id
        this.type = type
    }
}

class MailMessage {
    /**
     * @param {Discord.EmbedBuilder} embed
     * @param {ActionRowBuilder[]} actionRows
     */
    constructor(embed, actionRows) {
        this.embed = embed
        this.actionRows = actionRows
    }
}

const MailFolder = {
    inbox: 0,
    outbox: 1
}

class CurrentlyWritingMail {
    /**
     * @param {Discord.User} user
     * @param {Mail} mail
     * @param {Discord.Message} message
     */
    constructor(user, mail, message) {
        this.user = user
        this.mail = mail
        this.message = message
    }
}

module.exports = { MailManager, Mail, CurrentlyWritingMail, MailUser }