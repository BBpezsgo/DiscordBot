export namespace AccuWeather {
    export type CurrentResult = {
        LocalObservationDateTime: string
        EpochTime: number
        WeatherText: string
        WeatherIcon: number
        LocalSource: {
            Id: number
            Name: number
            WeatherCode: number
        }
        HasPrecipitation: boolean
        PrecipitationType: string
        IsDayTime: boolean
        Temperature: Value
        RealFeelTemperature: Value
        RealFeelTemperatureShade: Value
        RelativeHumidity: number
        IndoorRelativeHumidity: number
        DewPoint: Value
        Wind: {
            Direction: {
                Degrees: number
                Localized: string
                English: string
            }
            Speed: Value
        }
        WindGust: { Speed: Value }
        UVIndex: number
        UVIndexText: string
        Visibility: Value
        ObstructionsToVisibility: string
        CloudCover: number
        Ceiling: Value
        Pressure: Value
        PressureTendency: {
            LocalizedText: string
            Code: string
        }
        Past24HourTemperatureDeparture: Value
        ApparentTemperature: Value
        WindChillTemperature: Value
        WetBulbTemperature: Value
        Precip1hr: Value
        PrecipitationSummary: {
            Precipitation: Value
            PastHour: Value
            Past3Hours: Value
            Past6Hours: Value
            Past9Hours: Value
            Past12Hours: Value
            Past18Hours: Value
            Past24Hours: Value
        }
        TemperatureSummary: {
            Past6HourRange: { Minimum: Value, Maximum: Value }
            Past12HourRange: { Minimum: Value, Maximum: Value }
            Past24HourRange: { Minimum: Value, Maximum: Value }
        }
        MobileLink: string
        Link: string
    }
    
    export type Value = {
        Metric: {
            Value: number
            Unit: string
            UnitType: number
        }
        Imperial: {
            Value: number
            Unit: string
            UnitType: number
        }
    }
}
export type ServiceCallback<T> = ( result: T | undefined, error: string | undefined ) => void
export type ServiceCacheCallback<T> = ( isCache: boolean, result: T | undefined, error: string | undefined ) => void

export function AccuWeatherForecast(callback: ServiceCallback<object>): void
export function AccuWeatherCurrent(callback: ServiceCallback<AccuWeather.CurrentResult[]>): void
