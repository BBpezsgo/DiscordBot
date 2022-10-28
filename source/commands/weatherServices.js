const tokens = require('../config.json').tokens
const weather1 = require('weather-js')
const fs = require('fs')
const { CityBekescsaba } = require('./weatherFunctions')

const URLs = {
    OpenWeatherMap: {
        Weather: `http://api.openweathermap.org/data/2.5/weather?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&units=metric&appid=${tokens.openweathermap}`,
        Pollution: `http://api.openweathermap.org/data/2.5/air_pollution?lat=${CityBekescsaba.Lat}&lon=${CityBekescsaba.Lon}&appid=${tokens.openweathermap}`
    },
    NASA: {
        Mars: {
            Weather: `https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json&ver=1.0`,
            WeeklyImage: `https://mars.nasa.gov/rss/api/?feed=weekly_raws&category=mars2020&feedtype=json&num=1&page=0&tags=mars2020_featured_image&format=json`
        },
        Satellite: `https://api.nasa.gov/planetary/earth/assets?lon=${CityBekescsaba.Lon}&lat=${CityBekescsaba.Lat}&date=2014-02-01&dim=0.15&api_key=${tokens.nasa}`
    },
    AccuWeather: {
        Forecast: {
            Daily: {
                Day1: `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
                Day15: `http://dataservice.accuweather.com/forecasts/v1/daily/15day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
                Day5: `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
                Day10: `http://dataservice.accuweather.com/forecasts/v1/daily/10day/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`
            },
            Hourly: {
                Hour1: `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
                Hour12: `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
                Hour120: `http://dataservice.accuweather.com/forecasts/v1/hourly/120hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
                Hour24: `http://dataservice.accuweather.com/forecasts/v1/hourly/24hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`,
                Hour72: `http://dataservice.accuweather.com/forecasts/v1/hourly/72hour/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`
            }
        },
        CurrentConditions: `http://dataservice.accuweather.com/currentconditions/v1/${CityBekescsaba.AccuWeatherData.Key}?apikey=${tokens.accuweather}&metric=true`
    }
}

const request = require("request");

const ReadFromCache = true

/** @param {(result: ({
 *   location: {
 *     name: string;
 *     lat: string;
 *     long: string;
 *     timezone: string;
 *     alert: string;
 *     degreetype: string;
 *     imagerelativeurl: string;
 *   };
 *   current: {
 *     temperature: string;
 *     skycode: string;
 *     skytext: string;
 *     date: string;
 *     observationtime: string;
 *     observationpoint: string;
 *     feelslike: string;
 *     humidity: string;
 *     winddisplay: string;
 *     day: string;
 *     shortday: string;
 *     windspeed: string;
 *     imageUrl: string;
 *   };
 *   forecast: {
 *     low: string;
 *     high: string;
 *     skycodeday: string;
 *     skytextday: string;
 *     date: string;
 *     day: string;
 *     shortday: string;
 *     precip: string;
 *  }[];
 *  location?: undefined;
 *  current?: undefined;
 * }
 * |
 * {
 *   location: {
 *     name: string;
 *     lat: string;
 *     long: string;
 *     timezone: string;
 *     alert: string;
 *     degreetype: string;
 *     imagerelativeurl: string;
 *   };
 *   current: {
 *     temperature: string;
 *     skycode: string;
 *     skytext: string;
 *     date: string;
 *     observationtime: string;
 *     observationpoint: string;
 *     feelslike: string;
 *     humidity: string;
 *     winddisplay: string;
 *     day: string;
 *     shortday: string;
 *     windspeed: string;
 *     imageUrl: string;
 *   };
 *   forecast: {
 *     low: string;
 *     high: string;
 *     skycodeday: string;
 *     skytextday: string;
 *     date: string;
 *     day: string;
 *     shortday: string;
 *     precip: string;
 *   }[];
 * }
 * )[] | undefined, error: any | undefined) => void} callback */
const MsnWeather = function(callback) {
    if (ReadFromCache) {
        if (fs.existsSync('./weather-cache/msn-weather.json')) {
            callback(JSON.parse(fs.readFileSync('./weather-cache/msn-weather.json', { encoding: 'utf-8' })))
            return
        }
    }

    weather1.find({ search: 'Békéscsaba, HU', degreeType: 'C' }, function (error, msnWeather) {
        if (error) {
            callback(undefined, error)
            return
        }

        fs.writeFileSync('./weather-cache/msn-weather.json', JSON.stringify(msnWeather), { encoding: 'utf-8' })
        callback(msnWeather)
    })
}

/** @param {(result: {
 *   coord: {
 *       lon: number;
 *       lat: number;
 *   };
 *   weather: {
 *       id: number;
 *       main: string;
 *       description: string;
 *       icon: string;
 *   }[];
 *   base: string;
 *   main: {
 *       temp: number;
 *       feels_like: number;
 *       temp_min: number;
 *       temp_max: number;
 *       pressure: number;
 *       humidity: number;
 *       sea_level: number;
 *       grnd_level: number;
 *   };
 *   visibility: number;
 *   wind: {
 *       speed: number;
 *       deg: number;
 *       gust: number;
 *   };
 *   clouds: {
 *       all: number;
 *   };
 *   dt: number;
 *   sys: {
 *       country: string;
 *       sunrise: number;
 *       sunset: number;
 *   };
 *   timezone: number;
 *   id: number;
 *   name: string;
 *   cod: number;
 * } | undefined, error: string | undefined) => void} callback */
const OpenweathermapWeather = function(callback) {
    if (ReadFromCache) {
        if (fs.existsSync('./weather-cache/openweathermap-weather.json')) {
            callback(JSON.parse(fs.readFileSync('./weather-cache/openweathermap-weather.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.OpenWeatherMap.Weather, function (err, res, body) {
            if (err) {
                callback(undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(undefined, `**HTTP Error:** No body recived`)
                return
            }

            fs.writeFileSync('./weather-cache/openweathermap-weather.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {(result: {
 *   coord: {
 *     lon: number;
 *     lat: number;
 *   };
 *   list: {
 *     main: {
 *       aqi: number;
 *     };
 *     components: {
 *       co: number;
 *       no: number;
 *       no2: number;
 *       o3: number;
 *       so2: number;
 *       pm2_5: number;
 *       pm10: number;
 *       nh3: number;
 *     };
 *     dt: number;
 *   }[];
 * } | undefined, error: string | undefined) => void} callback */
const OpenweathermapPollution = function(callback) {
    if (ReadFromCache) {
        if (fs.existsSync('./weather-cache/openweathermap-pollution.json')) {
            callback(JSON.parse(fs.readFileSync('./weather-cache/openweathermap-pollution.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.OpenWeatherMap.Pollution, function (err, res, body) {
            if (err) {
                callback(undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(undefined, `**HTTP Error:** No body recived`)
                return
            }

            fs.writeFileSync('./weather-cache/openweathermap-pollution.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {(result: {
  *   sols: {
  *     terrestrial_date: string;
  *     sol: string;
  *     ls: string;
  *     season: string;
  *     min_temp: number;
  *     max_temp: number;
  *     pressure: number;
  *     sunrise: string;
  *     sunset: string;
  *   }[];
  * } | undefined, error: string | undefined) => void} callback */
const NasaMarsWeather = function(callback) {
    if (ReadFromCache) {
        if (fs.existsSync('./weather-cache/nasa-mars-weather.json')) {
            callback(JSON.parse(fs.readFileSync('./weather-cache/nasa-mars-weather.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.NASA.Mars.Weather, function (err, res, body) {
            if (err) {
                callback(undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(undefined, `**HTTP Error:** No body recived`)
                return
            }

            fs.writeFileSync('./weather-cache/nasa-mars-weather.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

/** @param {(result: {
 *   images: {
 *     extended: {
 *          mastAz: string;
 *          mastEl: string;
 *           sclk: string;
 *           scaleFactor: string;
 *           xyz: string;
 *           subframeRect: string;
 *     };
 *     sol: number;
 *     attitude: string;
 *     image_files: {
 *       medium: string;
 *       small: string;
 *       full_res: string;
 *       large: string;
 *     };
 *     imageid: string;
 *     camera: {
 *       filter_name: string;
 *       camera_vector: string;
 *       camera_model_component_list: string;
 *       camera_position: string;
 *       instrument: string;
 *       camera_model_type: string;
 *     };
 *     caption: string;
 *     sample_type: string;
 *     date_taken_mars: string;
 *     credit: string;
 *     date_taken_utc: string;
 *     json_link: string;
 *     link: string;
 *     drive: string;
 *     title: string;
 *     site: number;
 *     date_received: string;
 *   }[];
 *   per_page: string;
 *   total_results: number;
 *   type: string;
 *   page: number;
 *   mission: string;
 *   total_images: number;
 * } | undefined, error: string | undefined) => void} callback */
const NasaMarsWeeklyImage = function(callback) {
    if (ReadFromCache) {
        if (fs.existsSync('./weather-cache/nasa-mars-image.json')) {
            callback(JSON.parse(fs.readFileSync('./weather-cache/nasa-mars-image.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.NASA.Mars.WeeklyImage, function (err, res, body) {
            if (err) {
                callback(undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(undefined, `**HTTP Error:** No body recived`)
                return
            }

            fs.writeFileSync('./weather-cache/nasa-mars-image.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

const AccuWeather = function(callback) {
    if (ReadFromCache) {
        if (fs.existsSync('./weather-cache/accu-weather.json')) {
            callback(JSON.parse(fs.readFileSync('./weather-cache/accu-weather.json', { encoding: 'utf-8' })))
            return
        }
    }

    try {
        request(URLs.AccuWeather.Forecast.Day1, function (err, res, body) {
            if (err) {
                callback(undefined, '**HTTP Error:** ' + err)
                return
            }
            if (res.statusCode !== 200) {
                callback(undefined, `**HTTP Error ${res.statusCode}:** ${res.statusMessage}`)
                return
            }
            if (body === undefined || body == null) {
                callback(undefined, `**HTTP Error:** No body recived`)
                return
            }

            const RateLimitRemaining = res.headers["RateLimit-Remaining"]

            fs.writeFileSync('./weather-cache/accu-weather.json', body, { encoding: 'utf-8' })
            callback(JSON.parse(body))
        })
    } catch (err) {
        callback(undefined, '**HTTP Requiest Error:** ' + err)
    }
}

module.exports = { NasaMarsWeather, NasaMarsWeeklyImage, OpenweathermapPollution, OpenweathermapWeather, MsnWeather }
