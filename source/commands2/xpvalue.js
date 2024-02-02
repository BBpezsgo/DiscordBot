/** @type {import("./base").Command} */
const Command = {
    OnMessageContextMenu: (e, sender) => {
        if (e.commandName !== 'Xp érték') { return false }

        const { calculateAddXp } = require('../economy/xpFunctions')
        const messageXpValue = calculateAddXp(e.targetMessage)
        if (messageXpValue.total == 0) {
            return e.reply({
                content: '> Ez az üzenet semmi \\🍺t se ér', ephemeral: true
            })
        } else {
            return e.reply({
                content:
                    '> Ez az üzenet **' + messageXpValue.total + '**\\🍺t ér:' + '\n' +
                    '>  Alap érték: ' + messageXpValue.messageBasicReward + '\\🍺' + '\n' +
                    '>  \\📄 Fájl bónusz: ' + messageXpValue.messageAttachmentBonus + '\\🍺' + '\n' +
                    '>  \\➰ Hossz bónusz: ' + messageXpValue.messageLengthBonus + '\\🍺' + '\n' +
                    '>  \\🙂 Emoji bónusz: ' + messageXpValue.messageEmojiBonus + '\\🍺' + '\n' +
                    '>  \\🔗 Link bónusz: ' + messageXpValue.otherBonuses + '\\🍺' + '\n' +
                    '>  \\💄 Egyedi emoji bónusz: ' + messageXpValue.messageCustomEmojiBonus + '\\🍺',
                ephemeral: true
            })
        }
    },
    Guild: null,
}

module.exports = Command