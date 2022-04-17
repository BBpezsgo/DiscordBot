const Discord = require('discord.js')
const MoonPhase = require('moonphase-js')
const weather1 = require('weather-js')
const weather2 = require('nodejs-weather-app');
const fs = require('fs')
const request = require("request");
const { openweatherToken } = require('../config.json')

let dataToAvoidErrors_SunDatasRaw, dataToAvoidErrors_Dawn, dataToAvoidErrors_Dusk
if (fs.existsSync('./Helper/output.txt') == true) {
    dataToAvoidErrors_SunDatasRaw = fs.readFileSync('./Helper/output.txt').toString().split("|")
    dataToAvoidErrors_Dawn = sunDatasRaw[0]
    dataToAvoidErrors_Dusk = sunDatasRaw[3]
} else {
    dataToAvoidErrors_Dawn = ''
    dataToAvoidErrors_Dusk = ''
}
const Dawn = dataToAvoidErrors_Dawn
const Dusk = dataToAvoidErrors_Dusk

/**
 * @description msn data
 */
let weatherData0
/**
 * @description openweather data
 */
let weatherData1
/**
 * @description moon data
 */
let weatherData2

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
        let days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
        dayName = days[dayOfWeek];
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
    } else if (skyTxt === 'Partly Cloudy') {
        return '\\⛅'
    }

    return '\\🌍'
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
 * @param {string} name
 * @returns {boolean}
 */
function ImgExists(name) {
    try {
        if (fs.existsSync('./commands/weatherImages/' + name + '.jpg')) {
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
        return 'Többnyire felhős';
    } else if (skyTxt === 'Cloudy') {
        return 'Felhős';
    } else if (skyTxt === 'Partly Sunny') {
        return 'Részben derült';
    } else if (skyTxt === 'Sunny') {
        return 'Derült';
    } else if (skyTxt === 'Rain') {
        return 'Eső';
    } else if (skyTxt === 'Fog') {
        return 'Köd';
    } else if (skyTxt === 'Rain Showers') {
        return 'Zápor';
    } else if (skyTxt === 'Light Rain') {
        return 'Könnyű eső';
    } else if (skyTxt === 'Clear') {
        return 'Derült';
    } else if (skyTxt === 'T-Storms') {
        return 'Vihar';
    } else if (skyTxt === 'Snow') {
        return 'Havazás';
    } else if (skyTxt === 'Light Snow') {
        return 'Könnyű havazás';
    } else if (skyTxt === 'Mostly Sunny') {
        return 'Nagy részben derült';
    } else if (skyTxt === 'Light Rain and Snow') {
        return 'Havaseső';
    } else if (skyTxt === 'Mostly Clear') {
        return 'Nagy részben derült';
    } else if (skyTxt === 'Partly Cloudy') {
        return 'Nagy részben felhős';
    }

    return skyTxt
}
function weatherWindIcon(windValue) {
    if (windValue < 7) {
        return '\\〰️';
    } else if (windValue < 16) {
        return '\\🍃';
    } else if (windValue < 40) {
        return '\\💨';
    } else {
        return '\\🌪️';
    }
}
function weatherTempIcon(tempValue) {
    if (tempValue < 0) {
        return '\\❄️';
    } else if (tempValue < 10) {
        return '\\🥶';
    } else if (tempValue < 15) {
        return '\\😐';
    } else if (tempValue < 20) {
        return '\\😐';
    } else if (tempValue < 25) {
        return '\\🙂';
    } else if (tempValue < 30) {
        return '\\🥵';
    } else {
        return '\\🔥';
    }
}
function weatherMoonIcon(moonText) {
    if (moonText === 'New Moon') {
        return '\\🌑';
    } else if (moonText === 'Waxing Crescent') {
        return '\\🌒';
    } else if (moonText === 'First Quarter') {
        return '\\🌓';
    } else if (moonText === 'Waxing Gibbous') {
        return '\\🌔';
    } else if (moonText === 'Full Moon') {
        return '\\🌕';
    } else if (moonText === 'Waning Gibbous') {
        return '\\🌖';
    } else if (moonText === 'Third Quarter') {
        return '\\🌗';
    } else if (moonText === 'Waning Crescent') {
        return '\\🌘';
    }

    return '?'
}
function weatherMoonText(moonText) {
    if (moonText === 'New Moon') {
        return 'Újhold';
    } else if (moonText === 'Waxing Crescent') {
        return 'Sarlóhold';
    } else if (moonText === 'First Quarter') {
        return 'Első negyed';
    } else if (moonText === 'Waxing Gibbous') {
        return 'Dagadóhold';
    } else if (moonText === 'Full Moon') {
        return 'Telihold';
    } else if (moonText === 'Waning Gibbous') {
        return 'Csökkenőhold';
    } else if (moonText === 'Third Quarter') {
        return 'Utolsó negyed';
    } else if (moonText === 'Waning Crescent') {
        return 'Öreghold';
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
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud_2601.png';
    } else if (icon === '🌥️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-large-cloud_1f325.png';
    } else if (icon === '⛅') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-cloud_26c5.png';
    } else if (icon === '🌤️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-small-cloud_1f324.png';
    } else if (icon === '☀️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun_2600.png';
    } else if (icon === '🌧️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud-with-rain_1f327.png';
    } else if (icon === '🌫️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/fog_1f32b.png';
    } else if (icon === '🌦️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sun-behind-rain-cloud_1f326.png';
    } else if (icon === '🏙️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cityscape_1f3d9.png';
    } else if (icon === '🌃') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/night-with-stars_1f303.png';
    } else if (icon === '🌇') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/sunset_1f307.png';
    } else if (icon === '🌆') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cityscape-at-dusk_1f306.png';
    } else if (icon === '⛈️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud-with-lightning-and-rain_26c8.png';
    } else if (icon === '🌨️') {
        thumbnailUrl = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/cloud-with-snow_1f328.png';
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
/**
* @param {number} unixValue
*/
function unixToTime(unixValue) {
    let date = new Date(unixValue * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime
}
function weatherPressureIcon(pressureValue) {
    if (pressureValue < 980) {
        return '\\🔷';
    } else if (pressureValue < 1008) {
        return '\\🔹';
    } else if (pressureValue < 1019) {
        return '\\⬛';
    } else if (pressureValue < 1026) {
        return '\\🔸';
    } else {
        return '\\🔶';
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
    });
    returnValue /= values.length
    return returnValue
}
/**
 * @param {number} value 
 * @returns {number}
 */
function GetReadableNumber(value) {
    return Math.floor(value * 10) / 10;
}

function GetPollutionText(value) {
    if (value == 1) {
        return 'Good'
    } else if (value == 2) {
        return 'Fair'
    } else if (value == 3) {
        return 'Moderate'
    } else if (value == 4) {
        return 'Poor'
    } else if (value == 5) {
        return 'Very Poor'
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

/**
 * @param {any} data0 msn data
 * @param {any} data1 openweather data
 * @param {any[]} data2 moon data
 * @returns {Discord.MessageEmbed}
 */
function getEmbedEarth(data0, data1, data2, index, data3) {
    var current = data0[0].current;
    const embed = new Discord.MessageEmbed()
        .setColor(0x00AE86)
        .setAuthor({ name: current.observationpoint.replace(', Hungary', '') + ' ' + current.date.toString().replace('-', '.').replace('-', '.') + '. [' + dayName(new Date().getDay()) + '] ' + current.observationtime.replace(':00:00', ':00 -kor')});

    { //Ma
        let skyTxt = current.skytext
        const skyImgName = weatherSkytextImgName(skyTxt, unixToTime(data1.sys.sunset).split(':')[0], unixToTime(data1.sys.sunrise).split(':')[0], data1.clouds.all)
        skyTxt = weatherSkytxt(skyTxt)

        const humidityValue = Average([current.humidity, data1.main.humidity])
        const humidityIcon = weatherHumidityIcon(humidityValue)

        const windValue = GetReadableNumber(Average([data1.wind.speed * 3.6, parseInt(current.windspeed.replace(' km/h', ''))]))
        const windIcon = weatherWindIcon(windValue)

        const windGustValue = GetReadableNumber(data1.wind.gust * 3.6)

        const tempValue = GetReadableNumber(Average([current.temperature, data1.main.temp]))

        const tempMinValue = GetReadableNumber(Average([data0[0].forecast[1].low, data1.main.temp_min]))
        const tempMaxValue = GetReadableNumber(Average([data0[0].forecast[1].high, data1.main.temp_max]))

        const tempFeelslikeValue = Math.floor(Average([current.feelslike, data1.main.feels_like]))

        const tempIcon = weatherTempIcon(tempFeelslikeValue)

        const moonIcon = weatherMoonIcon(data2[1].phaseName())
        const moonText = weatherMoonText(data2[1].phaseName())

        const windDirection = DirectionNameToArrow(current.winddisplay.toString().split(' ')[2])

        const visibilityValue = Math.floor(data1.visibility / 1000)

        let alert = ''
        alert = data0[0].location.alert
        let alertIcon = '\\⚠️'
        if (alert.length === 0) {
            alertIcon = '\\✔️'
            alert = 'Nincs figyelmeztetés'
        }

        embed
            .setTitle(`**${skyTxt}** ||(${data1.weather[0].description})|||| (${data1.weather[0].id})||`)
            .setDescription(
                `\\☁️ ${data1.clouds.all} %\n` +
                `\\💧 ${data0[0].forecast[1].precip} % csapadék\n` +
                `${humidityIcon} ${humidityValue} % páratartalom\n` +
                `${tempIcon} ${tempMinValue} - ${tempValue} - ${tempMaxValue} °C (Hőérzet: ${tempFeelslikeValue} °C)\n` +
                `${windIcon} ${windDirection} (${data1.wind.deg}°) ${windValue} km/h szél\n` +
                `\\🌬️ ${windGustValue} km/h széllökés\n` +
                `${weatherPressureIcon(data1.main.pressure)} ${data1.main.pressure} pHa légnyomás\n` +
                `\\👁️ ${visibilityValue} km látótávolság\n` +

                '\n\n**Levegőminőség:**\n\n' +

                'Levőminőség index: \\' + GetPollutionIndex(8, data3.main.aqi) + ' ' + GetPollutionText(data3.main.aqi) +

                '\n\nCO: \\' + GetPollutionIndex(0, data3.components.co) + ' ' + data3.components.co + ' μg/m³' +
                '\nNO: \\' + GetPollutionIndex(1, data3.components.no) + ' ' + data3.components.no + ' μg/m³' +
                '\nNO₂: \\' + GetPollutionIndex(2, data3.components.no2) + ' ' + data3.components.no2 + ' μg/m³' +
                '\nO₃: \\' + GetPollutionIndex(3, data3.components.o3) + ' ' + data3.components.o3 + ' μg/m³' +
                '\nSO₂: \\' + GetPollutionIndex(4, data3.components.so2) + ' ' + data3.components.so2 + ' μg/m³' +
                '\nPM₂.₅: \\' + GetPollutionIndex(5, data3.components.pm2_5) + ' ' + data3.components.pm2_5 + ' μg/m³' +
                '\nPM₁₀: \\' + GetPollutionIndex(6, data3.components.pm10) + ' ' + data3.components.pm10 + ' μg/m³' +
                '\nNH₃: \\' + GetPollutionIndex(7, data3.components.nh3) + ' ' + data3.components.nh3 + ' μg/m³' +
                
                '\n\n**Egyéb:**\n\n' +

                `${moonIcon} ${moonText} (${Math.floor(data2[1].illum * 100)} %-a látható)\n` +
                `\\🌇 ${unixToTime(data1.sys.sunrise)}\n` +
                `\\🌆 ${unixToTime(data1.sys.sunset)}\n\n` +
                `${alertIcon} ${alert}` +

                '\n\n**Előrejelzés:**')
        if (ImgExists(skyImgName) === true) {
            embed
                .setImage('attachment://' + skyImgName + '.jpg')
        } else {
            embed
                .addField('ImgCode', skyImgName, false)
        }
    }
    { //Tegnap
        let skyTxt = data0[0].forecast[0].skytextday;
        const skyIcon = weatherSkytextIcon(skyTxt, false);
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[0].low;

        const tempMaxValue = data0[0].forecast[0].high;
        const tempMaxIcon = weatherTempIcon(tempMaxValue);

        embed
            .addField(dayName(new Date().getDay() - 1),
                `\\💧 - %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[0].phaseName())} ${weatherMoonText(data2[0].phaseName())}`,
                true)
    }
    { //Ma2
        let skyTxt = data0[0].forecast[1].skytextday;
        const skyIcon = weatherSkytextIcon(skyTxt, false);
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[1].low;

        const tempMaxValue = data0[0].forecast[1].high;
        const tempMaxIcon = weatherTempIcon(tempMaxValue);

        embed
            .addField(dayName(new Date().getDay()) + ' (ma)',
                `\\💧 ${data0[0].forecast[1].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[1].phaseName())} ${weatherMoonText(data2[1].phaseName())}`,
                true)
    }
    { //Holnap
        let skyTxt = data0[0].forecast[2].skytextday;
        const skyIcon = weatherSkytextIcon(skyTxt, false);
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[2].low;

        const tempMaxValue = data0[0].forecast[2].high;
        const tempMaxIcon = weatherTempIcon(tempMaxValue);

        embed
            .addField(dayName(new Date().getDay() + 1),
                `\\💧 ${data0[0].forecast[2].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[2].phaseName())} ${weatherMoonText(data2[2].phaseName())}`,
                true)
    }
    { //Holnap után
        let skyTxt = data0[0].forecast[3].skytextday;
        const skyIcon = weatherSkytextIcon(skyTxt, false);
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[3].low;

        const tempMaxValue = data0[0].forecast[3].high;
        const tempMaxIcon = weatherTempIcon(tempMaxValue);

        embed
            .addField(dayName(new Date().getDay() + 2),
                `\\💧 ${data0[0].forecast[3].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[3].phaseName())} ${weatherMoonText(data2[3].phaseName())}`,
                true)
    }
    { //Holnap után-után
        let skyTxt = data0[0].forecast[4].skytextday;
        const skyIcon = weatherSkytextIcon(skyTxt, false);
        skyTxt = weatherSkytxt(skyTxt)

        const tempMinValue = data0[0].forecast[4].low;

        const tempMaxValue = data0[0].forecast[4].high;
        const tempMaxIcon = weatherTempIcon(tempMaxValue);

        embed
            .addField(dayName(new Date().getDay() + 3),
                `\\💧 ${data0[0].forecast[4].precip} %\n` +
                `${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C\n` +
                `${skyIcon} ${skyTxt}\n` +
                `${weatherMoonIcon(data2[4].phaseName())} ${weatherMoonText(data2[4].phaseName())}`,
                true)
    }

    embed
        .setTimestamp(current.date + 'T' + current.observationtime)
        .setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(current.skytext, true).replace('\\', '')))
        .setFooter({ text: '• weather.service.msn.com : openweathermap.org\n• weather-js : nodejs-weather-app : moonphase-js', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/information_2139-fe0f.png'})
    return embed
}

/**
 * @param {Date} date 
 * @param {number} days 
 * @returns {Date}
 */
function addDays(date, days) {
    date.setDate(date.getDate() + days)
    return date
}

/**
 * @param {Discord.CommandInteraction<Discord.CacheType>} command
 * @param {boolean} privateCommand
*/
module.exports = async (command, privateCommand) => {

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const m = [
        new MoonPhase(addDays(new Date(year, month, day), -1)),
        new MoonPhase(new Date(year, month, day)),
        new MoonPhase(addDays(new Date(year, month, day), 1)),
        new MoonPhase(addDays(new Date(year, month, day), 2)),
        new MoonPhase(addDays(new Date(year, month, day), 3))
    ]

    await command.deferReply({ ephemeral: privateCommand })

    try {
        await weather1.find({ search: 'Békéscsaba, HU', degreeType: 'C' }, function (err, result) {
            if (err) {
                command.editReply({ content: '> \\❌ **MSN Error:** ' + err.toString() })
                return
            }
            weather2.getWeather("bekescsaba").then(async val => {
                let url = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=46.678889&lon=21.090833&appid=' + openweatherToken

                request(url, function (err, response, body) {
                    if (err) {
                        command.editReply({ content: '> \\❌ **OpenWeatherMap Error:** ' + err.toString })
                    } else {
                        let weather = JSON.parse(body)
                        weatherData0 = result
                        weatherData1 = val
                        weatherData2 = m
                        const weatherData3 = weather.list[0]
                        let embed = getEmbedEarth(weatherData0, weatherData1, weatherData2, 3, weatherData3)
                        
                        const skyImgName = weatherSkytextImgName(weatherData0[0].current.skytext, unixToTime(weatherData1.sys.sunset).split(':')[0], unixToTime(weatherData1.sys.sunrise).split(':')[0], weatherData1.clouds.all)
                        if (ImgExists(skyImgName) === true) {
                            const attachment = new Discord.MessageAttachment('./commands/weatherImages/' + skyImgName + '.jpg', skyImgName + '.jpg');
                            command.editReply({ embeds: [embed], files: [attachment] })
                        } else {
                            command.editReply({ embeds: [embed] })
                        }
                    }
                })
            });
        });
    } catch (error) {
        command.editReply({ content: '> \\❌ **MSN Error:** ' + error.toString() })
    }
}
