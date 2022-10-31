const fs = require('fs')

/**
 * @param {string} name
 * @returns {boolean}
 */
 function ImgExists(name) {
    const avaliableImages = [
        '0000',
        '0200',
        '1000',
        '1100',
        '1110',
        '1200',
        '1230',
        '1300',
        '1330',
        '1901',
        '2000',
        '2100',
        '2200',
        '3000',
        '3200',
        '3300',
        '9310',
        '9320'
    ]
    try {
        if (avaliableImages.includes(name) == true) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}
function weatherSkytxt(skyTxt) {
    if (skyTxt === 'Mostly Cloudy') {
        return 'Többnyire felhős'
    } else if (skyTxt === 'Cloudy') {
        return 'Felhős'
    } else if (skyTxt === 'Clouds') {
        return 'Felhős'
    } else if (skyTxt === 'Partly Sunny') {
        return 'Részben derült'
    } else if (skyTxt === 'Sunny') {
        return 'Derült'
    } else if (skyTxt === 'Rain') {
        return 'Eső'
    } else if (skyTxt === 'Fog') {
        return 'Köd'
    } else if (skyTxt === 'Rain Showers') {
        return 'Zápor'
    } else if (skyTxt === 'Light Rain') {
        return 'Könnyű eső'
    } else if (skyTxt === 'Clear') {
        return 'Derült'
    } else if (skyTxt === 'T-Storms') {
        return 'Zivatar'
    } else if (skyTxt === 'Heavy T-Storms') {
        return 'Erős Zivatar'
    } else if (skyTxt === 'Snow') {
        return 'Havazás'
    } else if (skyTxt === 'Light Snow') {
        return 'Könnyű havazás'
    } else if (skyTxt === 'Mostly Sunny') {
        return 'Nagy részben derült'
    } else if (skyTxt === 'Light Rain and Snow') {
        return 'Havaseső'
    } else if (skyTxt === 'Mostly Clear') {
        return 'Nagy részben derült'
    } else if (skyTxt === 'Partly Cloudy') {
        return 'Nagy részben felhős'
    }

    return skyTxt
}
function weatherWindIcon(windValue) {
    if (windValue < 7) {
        return '\\〰️'
    } else if (windValue < 16) {
        return '\\🍃'
    } else if (windValue < 40) {
        return '\\💨'
    } else {
        return '\\🌪️'
    }
}
function weatherTempIcon(tempValue) {
    if (tempValue < 0) {
        return '\\❄️'
    } else if (tempValue < 10) {
        return '\\🥶'
    } else if (tempValue < 15) {
        return '\\😐'
    } else if (tempValue < 20) {
        return '\\😐'
    } else if (tempValue < 25) {
        return '\\🙂'
    } else if (tempValue < 30) {
        return '\\🥵'
    } else {
        return '\\🔥'
    }
}
function weatherMoonIcon(moonText) {
    if (moonText === 'New Moon') {
        return '\\🌑'
    } else if (moonText === 'Waxing Crescent') {
        return '\\🌒'
    } else if (moonText === 'First Quarter') {
        return '\\🌓'
    } else if (moonText === 'Waxing Gibbous') {
        return '\\🌔'
    } else if (moonText === 'Full Moon') {
        return '\\🌕'
    } else if (moonText === 'Waning Gibbous') {
        return '\\🌖'
    } else if (moonText === 'Third Quarter') {
        return '\\🌗'
    } else if (moonText === 'Waning Crescent') {
        return '\\🌘'
    }

    return '?'
}
function weatherMoonText(moonText) {
    if (moonText === 'New Moon') {
        return 'Újhold'
    } else if (moonText === 'Waxing Crescent') {
        return 'Sarlóhold'
    } else if (moonText === 'First Quarter') {
        return 'Első negyed'
    } else if (moonText === 'Waxing Gibbous') {
        return 'Dagadóhold'
    } else if (moonText === 'Full Moon') {
        return 'Telihold'
    } else if (moonText === 'Waning Gibbous') {
        return 'Csökkenőhold'
    } else if (moonText === 'Third Quarter') {
        return 'Utolsó negyed'
    } else if (moonText === 'Waning Crescent') {
        return 'Öreghold'
    }

    return '?'
}
function weatherHumidityIcon(humidityValue) {
    if (humidityValue < 40) {
        return '\\🌵'
    } else if (humidityValue < 60) {
        return '\\🙂'
    } else {
        return '\\🌫️'
    }
}
/**
 * @param {string} icon Emoji 
 * @returns {string}
 */
function weatherThumbnailUrl(icon) {
    let thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/globe-showing-europe-africa_1f30d.png'
    if (icon === '☁️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud_2601.png'
    } else if (icon === '🌥️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-large-cloud_1f325.png'
    } else if (icon === '⛅') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-cloud_26c5.png'
    } else if (icon === '🌤️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-small-cloud_1f324.png'
    } else if (icon === '☀️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun_2600.png'
    } else if (icon === '🌧️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud-with-rain_1f327.png'
    } else if (icon === '🌫️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/fog_1f32b.png'
    } else if (icon === '🌦️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-rain-cloud_1f326.png'
    } else if (icon === '🏙️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cityscape_1f3d9.png'
    } else if (icon === '🌃') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/night-with-stars_1f303.png'
    } else if (icon === '🌇') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sunset_1f307.png'
    } else if (icon === '🌆') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cityscape-at-dusk_1f306.png'
    } else if (icon === '⛈️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud-with-lightning-and-rain_26c8.png'
    } else if (icon === '🌨️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud-with-snow_1f328.png'
    }

    return thumbnailUrl
}
function DirectionNameToArrow(dirName) {
    if (dirName === "North") {
        return '⇓'
    } else if (dirName === "East") {
        return '⇐'
    } else if (dirName === "South") {
        return '⇑'
    } else if (dirName === "West") {
        return '⇒'
    } else if (dirName === "Northeast") {
        return '⇙'
    } else if (dirName === "Southeast") {
        return '⇖'
    } else if (dirName === "Southwest") {
        return '⇗'
    } else if (dirName === "Northwest") {
        return '⇘'
    }
    
    return '?'
}
function DirectionToArrow(degrees) {
    if (degrees >= 0 && degrees <= 22.5) {
        return '⇓'
    } else if (degrees <= 67.5) {
        return '⇙'
    } else if (degrees <= 112.5) {
        return '⇐'
    } else if (degrees <= 157.5) {
        return '⇖'
    } else if (degrees <= 202.5) {
        return '⇑'
    } else if (degrees <= 247.5) {
        return '⇗'
    } else if (degrees <= 292.5) {
        return '⇒'
    } else if (degrees <= 337.5) {
        return '⇘'
    } else {
        return '⇓'
    }
}
/** @param {number} unixValue */
function unixToTime(unixValue) {
    let date = new Date(unixValue * 1000)
    let hours = date.getHours()
    let minutes = "0" + date.getMinutes()
    var formattedTime = hours + ':' + minutes.substr(-2)
    return formattedTime
}
function weatherPressureIcon(pressureValue) {
    if (pressureValue < 980) {
        return '\\🔷'
    } else if (pressureValue < 1008) {
        return '\\🔹'
    } else if (pressureValue < 1019) {
        return '\\⬛'
    } else if (pressureValue < 1026) {
        return '\\🔸'
    } else {
        return '\\🔶'
    }
}

/**
 * @param {number[]} values 
 * @returns {number}
 */
function Average(values) {
    let returnValue = 0
    values.forEach(element => {
        returnValue += Number.parseFloat(element)
    })
    returnValue /= values.length
    return returnValue
}
/**
 * @param {number} value 
 * @returns {number}
 */
function GetReadableNumber(value) {
    return Math.floor(value * 10) / 10
}

function GetPollutionText(value) {
    if (value == 1) {
        return 'Nagyon Jó'
    } else if (value == 2) {
        return 'Jó'
    } else if (value == 3) {
        return 'Mérsékelt'
    } else if (value == 4) {
        return 'Silány'
    } else if (value == 5) {
        return 'Nagyon Rossz'
    }
    return ''
}

function GetPollutionIndex(type, value) {
    if (type == 0) { //CO
        return '⚫'
        if (value < 0) {
            return '🟢'
        } else if (value < 0) {
            return '🟡'
        } else if (value < 0) {
            return '🟠'
        } else {
            return '🔴'
        }
    } else if (type == 1) { //NO
        return '⚫'

        if (value < 0) {
            return '🟢'
        } else if (value < 0) {
            return '🟡'
        } else if (value < 0) {
            return '🟠'
        } else {
            return '🔴'
        }
    } else if (type == 2) { //NO2
        if (value < 0) {
            return '🟢'
        } else if (value < 25) {
            return '🟡'
        } else if (value < 75) {
            return '🟠'
        } else {
            return '🔴'
        }
    } else if (type == 3) { //O3
        if (value < 500) {
            return '🔵'
        } else if (value < 750) {
            return '🟣'
        } else {
            return '🟤'
        }
    } else if (type == 4) { //SO2
        if (value < 25) {
            return '🟢'
        } else if (value < 50) {
            return '🟡'
        } else if (value < 75) {
            return '🟠'
        } else {
            return '🔴'
        }
    } else if (type == 5) { //PM2.5
        if (value < 250) {
            return '🟢'
        } else if (value < 500) {
            return '🟡'
        } else if (value < 1000) {
            return '🟠'
        } else {
            return '🔴'
        }
    } else if (type == 6) { //PM10
        return '⚫'

        if (value < 0) {
            return '🟢'
        } else if (value < 0) {
            return '🟡'
        } else if (value < 0) {
            return '🟠'
        } else {
            return '🔴'
        }
    } else if (type == 7) { //NH3
        return '⚫'

        if (value < 0) {
            return '🟢'
        } else if (value < 0) {
            return '🟡'
        } else if (value < 0) {
            return '🟠'
        } else {
            return '🔴'
        }
    } else if (type == 8) { //Index
        if (value == 1) {
            return '🟢'
        } else if (value == 2) {
            return '🟡'
        } else if (value == 3) {
            return '🟠'
        } else if (value == 4) {
            return '🔴'
        } else if (value == 5) {
            return '⚠️'
        }
        return '⚫'
    }
    return '⚫'
}
/**@param {string} dayOfWeek @returns {string} */
function dayName(dayOfWeek) {
    while (dayOfWeek > 6) {
        dayOfWeek -= 7
    }
    while (dayOfWeek < 0) {
        dayOfWeek += 7
    }
    let dayName = '???'
    try {
        let days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']
        dayName = days[dayOfWeek]
    } catch { }
    return dayName
}
/**
 * @param {string} skyTxt 
 * @param {boolean} useMoon 
 * @returns {string} Emoji
 */
function weatherSkytextIcon(skyTxt, useMoon) {
    if (skyTxt === 'Mostly Cloudy') {
        return '\\☁️'
    } else if (skyTxt === 'Cloudy') {
        return '\\☁️'
    } else if (skyTxt === 'Clouds') {
        return '\\☁️'
    } else if (skyTxt === 'Partly Sunny') {
        return '\\⛅'
    } else if (skyTxt === 'Sunny') {
        return '\\☀️'
    } else if (skyTxt === 'Rain') {
        return '\\🌧️'
    } else if (skyTxt === 'Fog') {
        return '\\🌫️'
    } else if (skyTxt === 'Rain Showers') {
        return '\\🌧️'
    } else if (skyTxt === 'Light Rain') {
        return '\\🌦️'
    } else if (skyTxt === 'Clear') {
        if (useMoon === true) {
            var hour = new Date().getHours()
            if (hour > 0 && hour < 6) {
                return '\\🌙'
            } else if (hour < 15) {
                return '\\☀️'
            } else if (hour < 16) {
                return '\\🌙'
            } else {
                return '\\🌙'
            } 
        }
        return '\\☀️'
    } else if (skyTxt === 'Mostly Clear') {
        if (useMoon === true) {
            var hour = new Date().getHours()
            if (hour > 0 && hour < 6) {
                return '\\🌙'
            } else if (hour < 15) {
                return '\\🌤️'
            } else if (hour < 16) {
                return '\\🌙'
            } else {
                return '\\🌙'
            }
        }
        return '\\🌤️'
    } else if (skyTxt === 'T-Storms') {
        return '\\⛈️'
    } else if (skyTxt === 'Snow') {
        return '\\🌨️'
    } else if (skyTxt === 'Light Snow') {
        return '\\🌨️'
    } else if (skyTxt === 'Mostly Sunny') {
        return '\\🌤️'
    } else if (skyTxt === 'Light Rain and Snow') {
        return '\\🌧️'
    } else if (skyTxt === 'Heavy T-Storms') {
        return '\\⛈️'
    } else if (skyTxt === 'Partly Cloudy') {
        return '\\⛅'
    }

    return '\\🌍'
}
/**
 * @param {number} i0 
 * @param {number} i1 
 * @param {number} i2 
 * @param {number} i3 
 * @returns {string}
 */
function IsToString(i0, i1, i2, i3) {
    const is = [i0, i1, i2, i3]
    return is[0].toString() + '' + is[1].toString() + '' + is[2].toString() + '' + is[3].toString()
}
/**
 * 
 * @param {string} skyTxt
 * @param {number} sunset
 * @param {number} sunrise
 * @param {number} clouds
 */
function weatherSkytextImgName(skyTxt, sunset, sunrise, clouds) {
    /**
     * @description 0 = sunrise; 1 = daytime; 2 = sunset; 3 = night
     */
    let time = 1
    /**
     * @description 0 = clear; 1 = partly clear; 2 = partly cloudly; 3 = cloudly
     */
    let cloud = 0
    /**
     * @description 0 = no rain; 1 = rain; 2 = storm; 3 = snow;
     */
    let rain = 0
    let fog = 0

    const hour = new Date().getHours()

    if (hour > sunset + 1) {
        time = 3
    } else if (hour > sunset - 1) {
        time = 2
    } else if (hour > sunrise + 1) {
        time = 0
    } else if (hour > sunrise - 1) {
        time = 1
    } else {
        time = 3
    }

    if (skyTxt === 'Mostly Cloudy') {
        cloud = 2
    } else if (skyTxt === 'Cloudy') {
        cloud = 3
    } else if (skyTxt === 'Partly Cloudy') {
        cloud = 1
    } else if (skyTxt === 'Partly Sunny') {
        cloud = 1
    } else if (skyTxt === 'Sunny') {
        cloud = 0
    } else if (skyTxt === 'Clear') {
        cloud = 0
    } else if (skyTxt === 'Mostly Clear') {
        cloud = 1
    } else if (skyTxt === 'Mostly Sunny') {
        cloud = 1
    }

    if (skyTxt === 'Rain') {
        rain = 1
    } else if (skyTxt === 'Rain Showers') {
        rain = 1
    } else if (skyTxt === 'Light Rain') {
        rain = 1
    } else if (skyTxt === 'Light Rain and Snow') {
        rain = 3
    } else if (skyTxt === 'T-Storms') {
        rain = 2
    } else if (skyTxt === 'Heavy T-Storms') {
        rain = 2
    } else if (skyTxt === 'Snow') {
        rain = 3
    } else if (skyTxt === 'Light Snow') {
        rain = 3
    }

    cloud = Math.floor((cloud + (clouds / 100 * 3)) / 2)

    if (skyTxt === 'Fog') {
        fog = 1
    }


    return IsToString(time, cloud, rain, fog)
}

const CityBekescsaba = {
    ID: '722437',
    Lat: 46.677227,
    Lon: 21.089993,
    AccuWeatherData: {
        "Version": 1,
        "Key": "187162",
        "Type": "City",
        "Rank": 51,
        "LocalizedName": "Békéscsaba",
        "EnglishName": "Békéscsaba",
        "PrimaryPostalCode": "",
        "Region": {
            "ID": "EUR",
            "LocalizedName": "Europe",
            "EnglishName": "Europe"
        },
        "Country": {
            "ID": "HU",
            "LocalizedName": "Hungary",
            "EnglishName": "Hungary"
        },
        "AdministrativeArea": {
            "ID": "BC",
            "LocalizedName": "Békéscsaba",
            "EnglishName": "Békéscsaba",
            "Level": 1,
            "LocalizedType": "City with county rights",
            "EnglishType": "City with county rights",
            "CountryID": "HU"
        },
        "TimeZone": {
            "Code": "CEST",
            "Name": "Europe/Budapest",
            "GmtOffset": 2,
            "IsDaylightSaving": true,
            "NextOffsetChange": "2022-10-30T01:00:00Z"
        },
        "GeoPosition": {
            "Latitude": 46.684,
            "Longitude": 21.088,
            "Elevation": {
                "Metric": {
                    "Value": 90,
                    "Unit": "m",
                    "UnitType": 5
                },
                "Imperial": {
                    "Value": 295,
                    "Unit": "ft",
                    "UnitType": 0
                }
            }
        },
        "IsAlias": false,
        "SupplementalAdminAreas": [],
        "DataSets": [
            "AirQualityCurrentConditions",
            "AirQualityForecasts",
            "Alerts",
            "DailyPollenForecast",
            "ForecastConfidence",
            "FutureRadar",
            "MinuteCast",
            "Radar"
        ]
    }
}

function MetAlert_TypeIconNameToIcon(IconName) {
    if (IconName === 'fog1.gif')
    { return '🌫️' }
    return null
}

function MetAlert_DegreeIconNameToText(IconName) {
    if (IconName === 'w1.gif')
    { return 'Mérsékelt' }
    return null
}

module.exports = {
    ImgExists,
    weatherSkytxt,
    weatherWindIcon,
    weatherTempIcon,
    weatherMoonIcon,
    weatherMoonText,
    weatherHumidityIcon,
    weatherThumbnailUrl,
    DirectionNameToArrow,
    DirectionToArrow,
    unixToTime,
    weatherPressureIcon,
    Average,
    GetReadableNumber,
    GetPollutionIndex,
    GetPollutionText,
    dayName,
    weatherSkytextIcon,
    weatherSkytextImgName,
    MetAlert_TypeIconNameToIcon,
    MetAlert_DegreeIconNameToText,
    CityBekescsaba
}