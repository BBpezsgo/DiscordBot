export namespace MSN {
    export type WeatherResult = {
        location: {
            name: string
            lat: string
            long: string
            timezone: string
            alert: string
            degreetype: string
            imagerelativeurl: string
        }
        current: {
            temperature: string
            skycode: string
            skytext: string
            date: string
            observationtime: string
            observationpoint: string
            feelslike: string
            humidity: string
            winddisplay: string
            day: string
            shortday: string
            windspeed: string
            imageUrl: string
        }
        forecast: {
            low: string
            high: string
            skycodeday: string
            skytextday: string
            date: string
            day: string
            shortday: string
            precip: string
        }[]
    }
}

export type ServiceCallback<T> = ( result: T | undefined, error: string | undefined ) => void
export type ServiceCacheCallback<T> = ( isCache: boolean, result: T | undefined, error: string | undefined ) => void

export function MsnWeather(callback: ServiceCacheCallback<MSN.WeatherResult[]>): void
