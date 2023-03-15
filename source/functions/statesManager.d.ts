const { CliColor } = require("./enums")

export interface MapThing<T> {
    [id: string]: T
}

export class StatesManager {
    botLoaded: boolean
    botReady: boolean
    ping: number
    /**@type {string} */
    loadingProgressText: string
    /**
     * Error; Warning; Close; Destroyed; Invalid Session; All Ready; Ready; Reconnecting; Disconnect; Resume
     */
    botLoadingState: string

    Ytdl: {
        IsLoading: boolean
        LoadingText: string
        IsPlaying: boolean
        PlayingText: string
        PlayingUrl: string
    }

    Shard: {
        IsLoading: boolean
        LoadingText: string
        LoadingTextColor: string | null
        Error: string
    }

    WebInterface: MapThing<{
        IsDone: boolean
        Error: string
        URL: string
        ClientsTime: number[]
        Clients: Socket[]
        Requests: number[]
    }>

    heartbeat: number
    hello: number

    Commands: {
        Created: number
        Deleted: number
        All: number
    }

    News: {
        AllProcessed: boolean
        LoadingText: string
        LoadingText2: string
    }

    WeatherReport: {
        Text: string
    }

    MVMReport: {
        Text: string;
        Service: string
    }

    ExchangeReport: {
        Text: string
    }

    Database: {
        SaveText: string
        LoadText: string
        ParsingText: string
        BackupText: string
    }

    ProcessDebugMessage(message: string)
}

module.exports = { StatesManager }