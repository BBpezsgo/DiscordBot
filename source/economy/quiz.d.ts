const Discord = require('discord.js')

export async function Quiz(client: Discord.Client, titleText: string, listOfOptionText: string, listOfOptionEmojis: string, addXpValue, removeXpValue, addToken, removeToken, image: Discord.MessageAttachment = undefined)
export function HasQuizStreakRole(member: Discord.GuildMember): boolean
export async function QuizDone(client: Discord.Client, quizMessageId: string, correctIndex: number)

export type QuizValue = {
    Score: number
    Token: number
}

export type QuizOption = {
    Emoji: string
    Text: string
}

export type Quiz = {
    Reward: QuizValue
    Penalty: QuizValue

    EndsAt: number

    Question: string
    Options: QuizOption[]
    ImageURL?: string
}

export type SendedQuiz = Quiz & {
    MessageID: string
}