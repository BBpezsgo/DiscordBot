const Discord = require('discord.js')
const {
    Color,
    ChannelId
} = require('../functions/enums.js')
const Types = require('./quiz')

/**@param {number} days @returns {number} */
function DaysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000
}

/**
 * @param {string} imageURL
 * @param {string} titleText
 * @param {string} listOfOptionText
 * @param {string} listOfOptionEmojis
 * @returns {Types.Quiz}
 */
function GenerateQuiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, imageURL = undefined) {
    /** @type {Types.Quiz} */
    const result = {
        Question: titleText,
        ImageURL: imageURL,
        Reward: {
            Score: addXpValue,
            Token: addToken,
        },
        Penalty: {
            Score: removeXpValue,
            Token: removeToken,
        },
        Options: [],
        EndsAt: Date.now() + DaysToMilliseconds(2)
    }

    const optionEmojis = listOfOptionEmojis.toString().split(';')
    const optionTexts = listOfOptionText.toString().split(';')

    for (let i = 0; i < optionEmojis.length; i++) {
        result.Options.push({
            Text: optionTexts[i],
            Emoji: optionEmojis[i],
        })
    }

    return result
}

/**
 * @param {Discord.Client} client
 * @param {any} image
 * @param {string} titleText
 * @param {string} listOfOptionText
 * @param {string} listOfOptionEmojis
 */
async function Quiz(client, titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, image = undefined) {
    const quiz = GenerateQuiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, image?.url)
    
    const embed = GetEmbed(quiz)

    /** @type {Discord.GuildTextBasedChannel} */
    const quizChannel = client.channels.cache.get(ChannelId.Quiz)
    const sentQuiz = await quizChannel.send({ embeds: [embed] })
    if (sentQuiz) {
        await sentQuiz.react('🎯')
        for (let i = 0; i < quiz.Options.length; i++) {
            const emoji = quiz.Options[i].Emoji
            if (emoji.includes('<')) {
                await sentQuiz.react(emoji.split(':')[2].replace('>', ''))
            } else {
                await sentQuiz.react(emoji)
            }
        }  
        await quizChannel.send('> <@&799342836931231775>')      
    }
}

/**
 * @param {Types.Quiz} quiz
 */
function GetEmbed(quiz) {
    let optionText = ''
    for (let i = 0; i < quiz.Options.length; i++) {
        optionText += `> ${quiz.Options[i].Emoji}  ${quiz.Options[i].Text.trim()}\n`
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(Color.Pink)
        .setTitle('Quiz!')
        .setDescription(
            `\\✔️  **${quiz.Reward.Score}\\🍺** és **${quiz.Penalty.Token}\\🎫**\n` +
            `\\❌ **-${quiz.Penalty.Score}\\🍺** és **-${quiz.Penalty.Token}\\🎫**\n` +
            `Ha van **\`Quiz - Answer Streak\`** rangod, bejelölheted a 🎯 opciót is, hogy a fenti értékek számodra megduplázódjanak.`
        )
        .addFields([{
            name: quiz.Question,
            value: optionText
        }])
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/direct-hit_1f3af.png')
        .setFooter({ text: "Vége:" })
        .setTimestamp(quiz.EndsAt)
    if (quiz.ImageURL) {
        embed.setImage(quiz.ImageURL)
    }

    return embed
}

/**
 * @param {Discord.GuildMember} member
 * @returns {boolean}
 */
function HasQuizStreakRole(member) {
    const roles = ['929443006627586078', '929443558040166461', '929443627527180288', '929443673077329961']
    return member.roles.cache.some(role => roles.includes(role.id))
}

/**
 * @param {Discord.Client} client
 * @param {string} quizMessageId
 * @param {number} correctIndex
 */
async function QuizDone(client, quizMessageId, correctIndex) {
    /**@type {Discord.TextChannel} */
    const channel = client.channels.cache.get(ChannelId.Quiz)
    channel.messages.fetch({ limit: 10 }).then(async (messages) => {
        const message = messages.get(quizMessageId)
        /**@type {string[]} */
        const answersEmoji = []
        const variableHAHA = message.embeds[0].fields[0].value.split('\n')
        variableHAHA.forEach(element => {
            const gfgfdgdfgdf = element.replace('>', '').trimStart().split(' ')[0]
            if (gfgfdgdfgdf.includes('🎯')) { } else {
                answersEmoji.push(gfgfdgdfgdf)
            }
        })
        const correctAnswer = message.embeds[0].fields[0].value.split('\n')[correctIndex].replace('>', '').trimStart()
        const correctAnswerEmoji = correctAnswer.split(' ')[0]
        const correctAnswerText = correctAnswer.replace(correctAnswerEmoji, '').trimStart()
        const awardAdd0 = message.embeds[0].description.split('\n')[0].replace('✔️', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[0].replace('🍺', '')
        const awardAdd1 = message.embeds[0].description.split('\n')[0].replace('✔️', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[1].replace('🎫', '')
        const awardRemove0 = message.embeds[0].description.split('\n')[1].replace('❌', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[0].replace('🍺', '').replace('-', '')
        const awardRemove1 = message.embeds[0].description.split('\n')[1].replace('❌', '').replace(/\\/g, '').trimStart().replace(/\*/g, '').replace(' és ', '|').split('|')[1].replace('🎫', '').replace('-', '')

        message.reactions.resolve('🎯').users.fetch().then(async (userList0) => {
            /**@type {string[]} */
            const usersWithCorrectAnswer = []
            /**@type {string[]} */
            const usersWithWrongAnswer = []
            const usersWithMultiplier = userList0.map((user) => user.id)

            const members = client.guilds.cache.get('737954264386764812').members
            let finalText = '**A helyes válasz: ' + correctAnswerEmoji + ' ' + correctAnswerText + '**'

            for (let i = 0; i < answersEmoji.length; i++) {
                const currentAnswerEmoji = answersEmoji[i]
                await message.reactions.resolve(currentAnswerEmoji).users.fetch().then(async (userList1) => {
                    const users = userList1.map((user) => user.id)
                    for (let j = 0; j < users.length; j++) {
                        const userId = users[j]
                        if (userId == client.user.id) { continue }

                        //const members = await client.guilds.cache.get('737954264386764812').members.fetch({ limit: 20 })
                        const member = await client.guilds.cache.get('737954264386764812').members.fetch({ user: userId })

                        if (currentAnswerEmoji == correctAnswerEmoji) {
                            usersWithCorrectAnswer.push(userId)
                            if (usersWithMultiplier.includes(userId) && HasQuizStreakRole(member)) {
                                finalText += '\n> <@!' + userId + '> nyert ' + (parseInt(awardAdd0) * 2) + ' \\\uD83C\uDF7At és ' + (parseInt(awardAdd1) * 2) + ' \\🎫t'
                            } else {
                                finalText += '\n> <@!' + userId + '> nyert ' + (awardAdd0) + ' \\\uD83C\uDF7At és ' + (awardAdd1) + ' \\🎫t'
                            }
                        } else {
                            usersWithWrongAnswer.push(userId)
                            if (usersWithMultiplier.includes(userId) && HasQuizStreakRole(member)) {
                                finalText += '\n> <@!' + userId + '> veszített ' + (parseInt(awardRemove0) * 2) + ' \\\uD83C\uDF7At és ' + (parseInt(awardRemove1) * 2) + ' \\🎫t'
                            } else {
                                finalText += '\n> <@!' + userId + '> veszített ' + (awardRemove0) + ' \\\uD83C\uDF7At és ' + (awardRemove1) + ' \\🎫t'
                            }
                        }
                    }
                })
            }
            client.channels.cache.get(ChannelId.Quiz).send(finalText)
        })
    })
}

module.exports = {
    Quiz,
    QuizDone,
    HasQuizStreakRole,
}