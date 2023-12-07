const Discord = require('discord.js')

export async function Quiz(client: Discord.Client, titleText: string, listOfOptionText: string, listOfOptionEmojis: string, addXpValue, removeXpValue, addToken, removeToken, image: Discord.Attachment = null)
export function HasQuizStreakRole(member: Discord.GuildMember): boolean
export async function QuizDone(client: Discord.Client, quizMessageId: string, correctIndex: number)
export async function QuizDoneTest(client: Discord.Client, command: Discord.ChatInputCommandInteraction<Discord.CacheType>)
export function OnSelectMenu(e: Discord.StringSelectMenuInteraction<Discord.CacheType>): boolean

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
    Debug: object
    MessageID: string
}

export type QuizReaction = {
    User: {
        ID: string
        Name: string
        AnswerStreak: boolean
        WantToMultiply: boolean
    }
    Reaction: string
}

export type FinishedQuiz = SendedQuiz & {
    Reactions: QuizReaction[]
    Correct: QuizOption | null
}