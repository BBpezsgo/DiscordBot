export namespace OpenWeatherMap {

    type PollutionResult = {
        coord: Coordinate
        list: PollutionItem[]
    }

    type PollutionItem = {
        main: {
            /** Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor. */
            aqi: 1 | 2 | 3 | 4 | 5
        }
        components: {
            /** Сoncentration of CO (Carbon monoxide), μg/m3 */
            co: number
            /** Сoncentration of NO (Nitrogen monoxide), μg/m3 */
            no: number
            /** Сoncentration of NO2 (Nitrogen dioxide), μg/m3 */
            no2: number
            /** Сoncentration of O3 (Ozone), μg/m3 */
            o3: number
            /** Сoncentration of SO2 (Sulphur dioxide), μg/m3 */
            so2: number
            /** Сoncentration of PM2.5 (Fine particles matter), μg/m3 */
            pm2_5: number
            /** Сoncentration of PM10 (Coarse particulate matter), μg/m3 */
            pm10: number
            /** Concentration of NH3 (Ammonia), μg/m3 */
            nh3: number
        }
        /** Date and time, Unix, UTC */
        dt: number
    }

    type WeatherResult = {
        coord: Coordinate
        weather: WeatherCondition[]
        base: string
        main: WeatherMain
        visibility: number
        wind: Wind
        rain: {
            "1h": number | undefined
            "3h": number | undefined
        } | undefined
        snow: {
            "1h": number | undefined
            "3h": number | undefined
        } | undefined
        clouds: {
            all: number
        }
        dt: number
        sys: {
            country: string
            sunrise: number
            sunset: number
        }
        timezone: number
        id: number
        name: string
    }

    type Forecast = {
        /** Internal parameter */
        cod: string
        /** Internal parameter */
        message: number
        /** A number of timestamps returned in the API response */
        cnt: number
        list: {
            /** Time of data forecasted, unix, UTC */
            dt: number
            main: WeatherMain & {
                /** Internal parameter */
                temp_kf: number
            }
            weather: WeatherCondition[]
            clouds: { all: number }
            wind: Wind
            /** Average visibility, metres. The maximum value of the visibility is 10km */
            visibility: number
            /** Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100% */
            pop: number
            rain: {
                /** Rain volume for last 3 hours, mm */
                "3h": number | undefined
            } | undefined
            snow: {
                /** Snow volume for last 3 hours */
                "3h": number | undefined
            } | undefined
            sys: {
                /** Part of the day (n - night, d - day) */
                pod: 'd' | 'n'
            }
            /** Time of data forecasted, ISO, UTC */
            dt_txt: string
        }[]
        city: {
            /** City ID. **Please note that built-in geocoder functionality has been deprecated.** */
            id: number
            /** City name. **Please note that built-in geocoder functionality has been deprecated.** */
            name: string
            coord: Coordinate
            /** Country code (GB, JP etc.). **Please note that built-in geocoder functionality has been deprecated.** */
            country: string
            /** City population */
            population: number
            /** Shift in seconds from UTC */
            timezone: number
            /** Sunrise time, Unix, UTC */
            sunrise: number
            /** Sunset time, Unix, UTC */
            sunset: number
        }
    }

    type Coordinate = {
        lon: number
        lat: number
    }

    type Wind = {
        /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour. */
        speed: number
        /** Wind direction, degrees (meteorological) */
        deg: number
        /** Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
        gust: number
    }

    type WeatherCondition = {
        /** Weather condition id */
        id: number
        /** Group of weather parameters (Rain, Snow, Extreme etc.) */
        main: string
        /** Weather condition within the group. You can get the output in your language. */
        description: string
        /** Weather icon id */
        icon: string
    }

    type WeatherMain = {
        temp: number
        /** This temperature parameter accounts for the human perception of weather. */
        feels_like: number
        /** Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. */
        temp_min: number
        /** Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. */
        temp_max: number
        /** Atmospheric pressure on the sea level by default, hPa */
        pressure: number
        /** Atmospheric pressure on the sea level, hPa */
        sea_level: number
        /** Atmospheric pressure on the ground level, hPa */
        grnd_level: number | undefined
        /** Humidity, % */
        humidity: number
    }
}

export function OpenweathermapWeather(): Promise<OpenWeatherMap.WeatherResult & { fromCache: boolean }>
export function OpenweathermapPollution(): Promise<OpenWeatherMap.PollutionResult>
export function OpenweathermapForecast(): Promise<OpenWeatherMap.Forecast & { fromCache: boolean }>
