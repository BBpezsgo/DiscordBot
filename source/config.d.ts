export type Config = {
    perfix: string
    tokens: {
        "discord-old": string
        discord: string
        openweathermap: string
        nasa: string
        accuweather: string
        "newsdata.io": string
    }
    paths: {
        base: string
    }
    firebase: import('firebase/app').FirebaseOptions
}