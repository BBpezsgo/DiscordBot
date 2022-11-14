export namespace OpenWeatherMap {
    type WeatherResult = {
        coord: {
            lon: number;
            lat: number;
        };
        weather: {
            id: number;
            main: string;
            description: string;
            icon: string;
        }[];
        base: string;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            humidity: number;
            sea_level: number;
            grnd_level: number;
        };
        visibility: number;
        wind: {
            speed: number;
            deg: number;
            gust: number;
        };
        clouds: {
            all: number;
        };
        dt: number;
        sys: {
            country: string;
            sunrise: number;
            sunset: number;
        };
        timezone: number;
        id: number;
        name: string;
        cod: number;
    }

    type PollutionResult = {
        coord: {
            lon: number;
            lat: number;
        };
        list: {
            main: {
                aqi: number;
            };
            components: {
                co: number;
                no: number;
                no2: number;
                o3: number;
                so2: number;
                pm2_5: number;
                pm10: number;
                nh3: number;
            };
            dt: number;
        }[];
    }
}

export namespace NasaMars {
    type WeatherResult = {
        sols: {
            terrestrial_date: string;
            sol: string;
            ls: string;
            season: string;
            min_temp: number;
            max_temp: number;
            pressure: number;
            sunrise: string;
            sunset: string;
        }[];
    }

    type WeeklyImagesResult = {
        images: {
            extended: {
                mastAz: string;
                mastEl: string;
                sclk: string;
                scaleFactor: string;
                xyz: string;
                subframeRect: string;
            };
            sol: number;
            attitude: string;
            image_files: {
                medium: string;
                small: string;
                full_res: string;
                large: string;
            };
            imageid: string;
            camera: {
                filter_name: string;
                camera_vector: string;
                camera_model_component_list: string;
                camera_position: string;
                instrument: string;
                camera_model_type: string;
            };
            caption: string;
            sample_type: string;
            date_taken_mars: string;
            credit: string;
            date_taken_utc: string;
            json_link: string;
            link: string;
            drive: string;
            title: string;
            site: number;
            date_received: string;
        }[];
        per_page: string;
        total_results: number;
        type: string;
        page: number;
        mission: string;
        total_images: number;
    }
}

export namespace MSN {
    export type WeatherResult = {
        location: {
            name: string;
            lat: string;
            long: string;
            timezone: string;
            alert: string;
            degreetype: string;
            imagerelativeurl: string;
        }
        current: {
            temperature: string;
            skycode: string;
            skytext: string;
            date: string;
            observationtime: string;
            observationpoint: string;
            feelslike: string;
            humidity: string;
            winddisplay: string;
            day: string;
            shortday: string;
            windspeed: string;
            imageUrl: string;
        }
        forecast: {
            low: string;
            high: string;
            skycodeday: string;
            skytextday: string;
            date: string;
            day: string;
            shortday: string;
            precip: string;
        }[]
    }
}

export type ServiceCallback<T> = ( result: T | undefined, error: string | undefined ) => void

export function OpenweathermapWeather(callback: ServiceCallback<OpenWeatherMap.WeatherResult>): void;
export function OpenweathermapPollution(callback: ServiceCallback<OpenWeatherMap.PollutionResult>): void;
export function NasaMarsWeather(callback: ServiceCallback<NasaMars.WeatherResult>): void;
export function NasaMarsWeeklyImage(callback: ServiceCallback<NasaMars.WeeklyImagesResult>): void;
export function MsnWeather(callback: ServiceCallback<WeatherResult[]>): void;
export function AccuWeather(callback: ServiceCallback<any>): void;
export function OpenweathermapForecast(callback: ServiceCallback<any>): void;
