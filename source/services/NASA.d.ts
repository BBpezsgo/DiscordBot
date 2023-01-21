export namespace NasaMars {
    type WeatherResult = {
        sols: {
            terrestrial_date: string
            sol: string
            ls: string
            season: string
            min_temp: number
            max_temp: number
            pressure: number
            sunrise: string
            sunset: string
        }[]
    }

    type WeeklyImagesResult = {
        images: {
            extended: {
                mastAz: string
                mastEl: string
                sclk: string
                scaleFactor: string
                xyz: string
                subframeRect: string
            }
            sol: number
            attitude: string
            image_files: {
                medium: string
                small: string
                full_res: string
                large: string
            }
            imageid: string
            camera: {
                filter_name: string
                camera_vector: string
                camera_model_component_list: string
                camera_position: string
                instrument: string
                camera_model_type: string
            }
            caption: string
            sample_type: string
            date_taken_mars: string
            credit: string
            date_taken_utc: string
            json_link: string
            link: string
            drive: string
            title: string
            site: number
            date_received: string
        }[]
        per_page: string
        total_results: number
        type: string
        page: number
        mission: string
        total_images: number
    }
}

export function NasaMarsWeather(): Promise<NasaMars.WeatherResult>
export function NasaMarsWeeklyImage(): Promise<NasaMars.WeeklyImagesResult>
