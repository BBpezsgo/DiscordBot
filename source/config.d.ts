export type Config = {
    perfix: string
    tokens: {
        "discord-old": string
        discord: string
        openweathermap: string
        nasa: string
        accuweather: string
    }
    paths: {
        base: string
        webInterface: string
    }
}