import { StatesManager } from "./statesManager"
import * as Discord from "discord.js"

export type UserInDatabase = {
    username: string
}

export interface Users<T> {
    [userId: string]: T
}

export type DataBasic = UserInDatabase & {
    score: number
    money: number
    day: number
    color: string
    customname: string
    privateCommands: boolean
}

export type DataMarket = {
    day: number
    prices:
    {
        token: number
        coupon: number
        jewel: number
    }
}

export type DataBackpack = UserInDatabase & {
    crates: number
    gifts: number
    getGift: number
    tickets: number
    luckyCards: {
        small: number
        medium: number
        large: number
    }
    quizTokens: number
    jewel: number
}

export type DataPoll = {
    messageIds: string
    messages: {
        [id: string]: {
            title: string
            optionTexts: string[]
            optionIcons: string[]
            optionValues: number[]
            userIds: any[]
        }
    }
}

export type MailAccount = {
    id: string
    name: string
}

export type Mail = {
    sender: MailAccount
    reciver: MailAccount
    title: string
    context: string
    date: number
    readed: boolean
    icon: string
}

export type DataMail = {
    mailIds: string
} & Users<UserInDatabase & {
    inbox: { [index: string]: Mail }
    outbox: { [index: string]: Mail }
}>

export type DataUsername = UserInDatabase & {
    avatarURL: string
}

export type DataBot = {
    day: number
}

export type DataStickers = UserInDatabase & {
    stickersMeme: number
    stickersMusic: number
    stickersYoutube: number
    stickersMessage: number
    stickersCommand: number
    stickersTip: number
}

export type DataUserstats = {
    name: string
    memes: number
    musics: number
    youtubevideos: number
    messages: number
    chars: number
    commands: number
}

export type DataBusiness = UserInDatabase & ({
    businessIndex: number
    businessName: string
    businessLevel: number
    businessUses: {
        date: string
        day: number
    }
} | {
    businessIndex: 0
})

export class DatabaseManager {
    databaseFolderPath: string
    backupFolderPath: string

    dataBasic: Users<DataBasic>
    dataBackpacks: Users<DataBackpack>
    dataUsernames: Users<DataUsername>
    dataStickers: Users<DataStickers>
    dataUserstats: Users<DataUserstats>
    dataBusinesses: Users<DataBusiness>

    dataMarket: DataMarket
    dataPolls: DataPoll
    dataMail: DataMail
    dataBot: DataBot

    statesManager: StatesManager

    constructor(
        /**
         * ```js
         * this.databaseFolderPath + 'dataFilename.json'
         * ``` 
         */
        databaseFolderPath: string,
        /**
         * ```js
         * this.backupFolderPath + 'dataFilename.json'
         * ``` 
         */
        backupFolderPath: string,
        statesManager: StatesManager)

    SaveUserToMemoryAll(user: Discord.User, username: string)

    SaveDatabase()
    LoadDatabase()
    BackupDatabase()

    UserstatsSendMeme(user: Discord.User)
    UserstatsSendMusic(user: Discord.User)
    UserstatsSendYoutube(user: Discord.User)
    UserstatsSendMessage(user: Discord.User)
    UserstatsSendChars(user: Discord.User, text: string)
    UserstatsSendCommand(user: Discord.User)
    UserstatsAddUserToMemory(user: Discord.User)
}

