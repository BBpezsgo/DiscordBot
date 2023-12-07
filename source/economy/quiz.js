const Discord = require('discord.js')
const {
    Color,
    ChannelId
} = require('../functions/enums.js')
const Types = require('./quiz')
const LogError = require('../functions/errorLog.js').LogError
const { ToUnix } = require('../functions/utils.js')

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
 * @param {string} titleText
 * @param {string} listOfOptionText
 * @param {string} listOfOptionEmojis
 * @param {any} addXpValue
 * @param {any} removeXpValue
 * @param {any} addToken
 * @param {any} removeToken
 * @param {Discord.Attachment} image
 */
async function Quiz(client, titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, image = undefined) {
    const quiz = GenerateQuiz(titleText, listOfOptionText, listOfOptionEmojis, addXpValue, removeXpValue, addToken, removeToken, image?.url)
    
    const embed = GetEmbed(quiz)

    /** @ts-ignore @type {Discord.GuildTextBasedChannel} */
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
            `☑️  **${quiz.Reward.Score}🍺** és **${quiz.Penalty.Token}🎫**\n` +
            `❌ **-${quiz.Penalty.Score}🍺** és **-${quiz.Penalty.Token}🎫**\n` +
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
    /** @ts-ignore @type {Discord.TextChannel} */
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

/**
 * @param {Discord.Client} client
 */
async function GetLastQuizMessage(client) {
    /** @ts-ignore @type {Discord.GuildTextBasedChannel} */
    const channel = client.channels.cache.get(ChannelId.Quiz)
    const messages = await channel.messages.fetch({ limit: 5 })
    for (let i = 0; i < messages.size; i++) {
        const message = messages.at(i)
        if (message.embeds.length == 0) { continue }
        const embed = message.embeds[0]
        if (embed.title !== 'Quiz!') { continue }

        return message
    }
    return null
}

/**
 * @param {Discord.Client} client
 */
async function GetLastQuiz(client) {
    const message = await GetLastQuizMessage(client)

    if (message.embeds.length == 0) { return }

    const embed = message.embeds[0]

    const lines = embed.description.split('\n')

    let firstLine = lines[0]
    let secondLine = lines[1]

    const CleanLine = function(line) {
        return line
            .replace(':ballot_box_with_check:', '')
            .replace(':x:', '')
            .replace(/\\/g, '')
            .replace(/\*/g, '')
            .replace(':beer:', '')
            .replace(':ticket:', '')
            .replace('☑️', '')
            .replace('❌', '')
            .replace('🍺', '')
            .replace('🎫', '')
            .trim()
    }

    firstLine = CleanLine(firstLine)
    secondLine = CleanLine(secondLine)

    let Debug = {
        FirstLine: lines[0],
        SecondLine: lines[1],
        
        FirstLineCleaned: firstLine,
        SecondLineCleaned: secondLine,
        
        FirstLineSplitted: firstLine.replace(' és ', '|').split('|'),
        SecondLineSplitted: secondLine.replace(' és ', '|').split('|'),
    }

    const awardAdd0 = firstLine.replace(' és ', '|').split('|')[0]
    const awardAdd1 = firstLine.replace(' és ', '|').split('|')[1]
    const awardRemove0 = secondLine.replace(' és ', '|').split('|')[0].replace('-', '')
    const awardRemove1 = secondLine.replace(' és ', '|').split('|')[1].replace('-', '')
    
    const optionsRaw = embed.fields[0].value.trim().split('\n')
    const options = []
    for (let j = 0; j < optionsRaw.length; j++) {
        const optionRaw = optionsRaw[j].substring(2)
        const left = optionRaw.split('  ')[0]
        const right = optionRaw.split('  ')[1]
        options.push({
            Emoji: left,
            Text: right,
        })
    }

    /** @type {Types.SendedQuiz} */
    const quiz = {
        Debug,
        EndsAt: Number.parseInt(embed.timestamp),
        Question: embed.fields[0].name,
        Reward: {
            Score: Number.parseInt(awardAdd0),
            Token: Number.parseInt(awardAdd1),
        },
        Penalty: {
            Score: Number.parseInt(awardRemove0),
            Token: Number.parseInt(awardRemove1),
        },
        Options: options,
        MessageID: message.id,
    }

    return quiz
}

/**
 * @param {Discord.Client} client
 * @param {number} correctAnswer
 */
async function GetLastFinishedQuiz(client, correctAnswer = null) {
    const message = await GetLastQuizMessage(client)
    /** @ts-ignore @type {Types.FinishedQuiz} */
    const quiz = await GetLastQuiz(client)
    quiz.Reactions = [ ]
    
    const partialMultiplyReaction = message.reactions.resolve('🎯')
    const multiplyReaction = await partialMultiplyReaction.fetch()
    const usersWantToMultiply = await multiplyReaction.users.fetch()

    for (let j = 0; j < quiz.Options.length; j++) {
        const option = quiz.Options[j]
        const partialReaction = message.reactions.resolve(option.Emoji)
        const reaction = await partialReaction.fetch()
        const users = await reaction.users.fetch()
        for (let k = 0; k < users.size; k++) {
            const user = users.at(k)
            if (user.bot) { continue }
            const hasAnswerStreak = (await message.guild.members.fetch(user.id)).roles.cache.hasAny(
                '929443006627586078',
                '929443558040166461',
                '929443627527180288',
                '929443673077329961'
            )
            quiz.Reactions.push({
                Reaction: reaction.emoji.name,
                User: {
                    ID: user.id,
                    Name: user.username,
                    AnswerStreak: hasAnswerStreak,
                    WantToMultiply: usersWantToMultiply.has(user.id),
                }
            })
        }
    }

    if (correctAnswer !== null) {
        quiz.Correct = quiz.Options[correctAnswer]
    } else {
        quiz.Correct = null
    }

    return quiz
}

/**
 * @param {Discord.Client} client
 * @param {Discord.ChatInputCommandInteraction<Discord.CacheType>} command
 */
async function QuizDoneTest(client, command) {
    command.deferReply()

    const quiz = await GetLastFinishedQuiz(client)

    const selectMenuOptions = []
    for (let i = 0; i < quiz.Options.length; i++) {
        const option = quiz.Options[i]
        selectMenuOptions.push(
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji(option.Emoji)
                .setLabel(option.Text)
                .setValue(i.toString())
        )
    }

    /** @type {Discord.APIEmbed} */
    const embed = {
        title: 'Finishing Quiz',
        description: quiz.Question,
        color: Discord.resolveColor(Color.Pink),
        fields: [
            {
                name: 'Info',
                value: `> ☑️ ${quiz.Reward.Score} 🍺 & ${quiz.Reward.Token} 🎫\n` +
                       `> ❌ -${quiz.Penalty.Score} 🍺 & -${quiz.Penalty.Token} 🎫\n` +
                       `> Ends in <t:${ToUnix(new Date(quiz.EndsAt))}:R>`,
                inline: true,
            },
        ],
    }

    const reactionsField = {
        name: 'Reactions',
        value: '',
        inline: false,
    }
    for (const yeah of quiz.Reactions) {
        reactionsField.value += `<@${yeah.User.ID}> - ${yeah.Reaction} ${((yeah.User.WantToMultiply && yeah.User.AnswerStreak) ? '🎯' : '')}\n`
    }
    reactionsField.value = reactionsField.value.trimEnd()
    embed.fields.push(reactionsField)

    command.editReply({
        // content: '```json\n' + JSON.stringify(quiz, null, ' ') + '\n```',
        embeds: [ embed ],
        components: [
            // @ts-ignore
            new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('quizdone-correct-answer')
                        .setPlaceholder('Helyes válasz')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(selectMenuOptions)
                )
        ]
    })
}

/**
 * @param {Discord.StringSelectMenuInteraction<Discord.CacheType>} e
 */
function OnSelectMenu(e) {
    if (e.customId !== 'quizdone-correct-answer') return false
    if (e.deferred) {
        LogError("Interaction already deferred (quiz.OnSelectMenu)")
        return
    }
    e.deferReply()
    GetLastFinishedQuiz(e.client, Number.parseInt(e.values[0]))
        .then(async quiz => {
            let finalText = '**A helyes válasz: ' + quiz.Correct.Emoji + ' ' + quiz.Correct.Text + '**'

            const usersReacted = [ ]
            for (let i = 0; i < quiz.Reactions.length; i++) {
                const reaction = quiz.Reactions[i]
                if (usersReacted.includes(reaction.User.ID)) { continue }
                if (reaction.Reaction === quiz.Correct.Emoji) {
                    if (reaction.User.AnswerStreak && reaction.User.WantToMultiply) {
                        finalText += '\n> <@!' + reaction.User.ID + '> nyert ' + (parseInt(quiz.Reward.Score) * 2) + ' \uD83C\uDF7At és ' + (parseInt(quiz.Reward.Token) * 2) + ' 🎫t'
                    } else {
                        finalText += '\n> <@!' + reaction.User.ID + '> nyert ' + (quiz.Reward.Score) + ' \uD83C\uDF7At és ' + (quiz.Reward.Token) + ' 🎫t'
                    }
                } else {
                    if (reaction.User.AnswerStreak && reaction.User.WantToMultiply) {
                        finalText += '\n> <@!' + reaction.User.ID + '> veszített ' + (parseInt(quiz.Penalty.Score) * 2) + ' \uD83C\uDF7At és ' + (parseInt(quiz.Penalty.Token) * 2) + ' 🎫t'
                    } else {
                        finalText += '\n> <@!' + reaction.User.ID + '> veszített ' + (quiz.Penalty.Score) + ' \uD83C\uDF7At és ' + (quiz.Penalty.Token) + ' 🎫t'
                    }
                }
            }

            /** @ts-ignore @type {Discord.GuildTextBasedChannel} */
            const channel = e.client.channels.cache.get(ChannelId.Quiz)
            channel.send(finalText)
                .then(() => {
                    e.editReply('> \\✔️ **OK**')
                })
                .catch(LogError)
        })
        .catch(LogError)

    return true
}

module.exports = {
    Quiz,
    QuizDone,
    HasQuizStreakRole,
    QuizDoneTest,
    OnSelectMenu,
}