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
    const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
    dayName = days[dayOfWeek];
    return dayName
}
/**
 * @param {string} skyTxt 
 * @param {boolean} useMoon 
 * @returns {string} Emoji
 */
function weatherSkytextIcon(skyTxt, useMoon) {
    let skyIcon = ''
    if (skyTxt === 'Mostly Cloudy') {
        skyIcon = '\\🌥️'
    } else if (skyTxt === 'Cloudy') {
        skyIcon = '\\☁️'
    } else if (skyTxt === 'Partly Sunny') {
        skyIcon = '\\⛅'
    } else if (skyTxt === 'Sunny') {
        skyIcon = '\\☀️'
    } else if (skyTxt === 'Rain') {
        skyIcon = '\\🌧️'
    } else if (skyTxt === 'Fog') {
        skyIcon = '\\🌫️'
    } else if (skyTxt === 'Rain Showers') {
        skyIcon = '\\🌦️'
    } else if (skyTxt === 'Light Rain') {
        skyIcon = '\\🌦️'
    } else if (skyTxt === 'Clear') {
        skyIcon = '\\☀️';
        if (useMoon === true) {
            var hour = new Date().getHours()
            if (hour > 0 && hour < 6) {
                skyIcon = '\\🌙'
            } else if (hour < 15) {
                skyIcon = '\\☀️'
            } else if (hour < 16) {
                skyIcon = '\\🌙'
            } else {
                skyIcon = '\\🌙'
            } 
        }
    } else if (skyTxt === 'Mostly Clear') {
        skyIcon = '\\🌤️';
        if (useMoon === true) {
            var hour = new Date().getHours()
            if (hour > 0 && hour < 6) {
                skyIcon = '\\🌙'
            } else if (hour < 15) {
                skyIcon = '\\🌤️'
            } else if (hour < 16) {
                skyIcon = '\\🌙'
            } else {
                skyIcon = '\\🌙'
            }
        }
    } else if (skyTxt === 'T-Storms') {
        skyIcon = '\\⛈️'
    } else if (skyTxt === 'Snow') {
        skyIcon = '\\🌨️'
    } else if (skyTxt === 'Light Snow') {
        skyIcon = '\\🌨️'
    } else if (skyTxt === 'Mostly Sunny') {
        skyIcon = '\\🌤️'
    } else if (skyTxt === 'Light Rain and Snow') {
        skyIcon = '\\🌧️'
    } else if (skyTxt === 'Partly Cloudy') {
        skyIcon = '\\⛅'
    } else {
        skyIcon = '\\🌍'
    };
    return skyIcon
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
    let _skyTxt = ''
    _skyTxt = skyTxt
    if (skyTxt === 'Mostly Cloudy') {
        _skyTxt = 'Többnyire felhős';
    } else if (skyTxt === 'Cloudy') {
        _skyTxt = 'Felhős';
    } else if (skyTxt === 'Partly Sunny') {
        _skyTxt = 'Részben derült';
    } else if (skyTxt === 'Sunny') {
        _skyTxt = 'Derült';
    } else if (skyTxt === 'Rain') {
        _skyTxt = 'Eső';
    } else if (skyTxt === 'Fog') {
        _skyTxt = 'Köd';
    } else if (skyTxt === 'Rain Showers') {
        _skyTxt = 'Zápor';
    } else if (skyTxt === 'Light Rain') {
        _skyTxt = 'Könnyű eső';
    } else if (skyTxt === 'Clear') {
        _skyTxt = 'Derült';
    } else if (skyTxt === 'T-Storms') {
        _skyTxt = 'Vihar';
    } else if (skyTxt === 'Snow') {
        _skyTxt = 'Havazás';
    } else if (skyTxt === 'Light Snow') {
        _skyTxt = 'Könnyű havazás';
    } else if (skyTxt === 'Mostly Sunny') {
        _skyTxt = 'Nagy részben derült';
    } else if (skyTxt === 'Light Rain and Snow') {
        _skyTxt = 'Havaseső';
    } else if (skyTxt === 'Mostly Clear') {
        _skyTxt = 'Nagy részben derült';
    } else if (skyTxt === 'Partly Cloudy') {
        _skyTxt = 'Nagy részben felhős';
    }
    return _skyTxt
}
function weatherWindIcon(windValue) {
    let windIcon = ''
    if (windValue < 7) {
        windIcon = '\\〰️';
    } else if (windValue < 16) {
        windIcon = '\\🍃';
    } else if (windValue < 40) {
        windIcon = '\\💨';
    } else {
        windIcon = '\\🌪️';
    };
    return windIcon
}
function weatherTempIcon(tempValue) {
    let tempIcon = ''
    if (tempValue < 0) {
        tempIcon = '\\❄️';
    } else if (tempValue < 10) {
        tempIcon = '\\🥶';
    } else if (tempValue < 15) {
        tempIcon = '\\😐';
    } else if (tempValue < 20) {
        tempIcon = '\\😐';
    } else if (tempValue < 25) {
        tempIcon = '\\🙂';
    } else if (tempValue < 30) {
        tempIcon = '\\🥵';
    } else {
        tempIcon = '\\🔥';
    };
    return tempIcon
}
function weatherMoonIcon(moonText) {
    let moonIcon = moonText
    if (moonText === 'New Moon') {
        moonIcon = '\\🌑';
    } else if (moonText === 'Waxing Crescent') {
        moonIcon = '\\🌒';
    } else if (moonText === 'First Quarter') {
        moonIcon = '\\🌓';
    } else if (moonText === 'Waxing Gibbous') {
        moonIcon = '\\🌔';
    } else if (moonText === 'Full Moon') {
        moonIcon = '\\🌕';
    } else if (moonText === 'Waning Gibbous') {
        moonIcon = '\\🌖';
    } else if (moonText === 'Third Quarter') {
        moonIcon = '\\🌗';
    } else if (moonText === 'Waning Crescent') {
        moonIcon = '\\🌘';
    };
    return moonIcon
}
function weatherMoonText(moonText) {
    let moonTxt = moonText
    if (moonText === 'New Moon') {
        moonTxt = 'Újhold';
    } else if (moonText === 'Waxing Crescent') {
        moonTxt = 'Sarlóhold';
    } else if (moonText === 'First Quarter') {
        moonTxt = 'Első negyed';
    } else if (moonText === 'Waxing Gibbous') {
        moonTxt = 'Dagadóhold';
    } else if (moonText === 'Full Moon') {
        moonTxt = 'Telihold';
    } else if (moonText === 'Waning Gibbous') {
        moonTxt = 'Csökkenőhold';
    } else if (moonText === 'Third Quarter') {
        moonTxt = 'Utolsó negyed';
    } else if (moonText === 'Waning Crescent') {
        moonTxt = 'Öreghold';
    };
    return moonTxt
}
function weatherHumidityIcon(humidityValue) {
    let humidityIcon = ''
    if (humidityValue < 40) {
        humidityIcon = '\\🌵';
    } else if (humidityValue < 60) {
        humidityIcon = '\\🙂';
    } else {
        humidityIcon = '\\🌫️';
    }
    return humidityIcon
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
    };
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
    } else {
        return dirName
    }
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
    let pressureicon = ''
    if (pressureValue < 980) {
        pressureicon = '\\🔷';
    } else if (pressureValue < 1008) {
        pressureicon = '\\🔹';
    } else if (pressureValue < 1019) {
        pressureicon = '\\⬛';
    } else if (pressureValue < 1026) {
        pressureicon = '\\🔸';
    } else {
        pressureicon = '\\🔶';
    }
    return pressureicon
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
    }
    return '⚫'
}

/**
 * @param {any} data0 msn data
 * @param {any} data1 openweather data
 * @param {any[]} data2 moon data
 * @param {number} index 0 | 1 | 2 | 3
 * @returns {Discord.MessageEmbed}
 */
function getEmbed(data0, data1, data2, index, data3) {
    var current = data0[0].current;
    const embed = new Discord.MessageEmbed()
        .setColor(0x00AE86)
        .setAuthor(current.observationpoint.replace(', Hungary', '') + ' ' + current.date.toString().replace('-', '.').replace('-', '.') + '. [' + dayName(new Date().getDay()) + '] ' + current.observationtime.replace(':00:00', ':00 -kor'));

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

        let weatherMessage = ''
        weatherMessage = data1.sys.message
        let weatherMessageIcon = '\\📢'
        if (weatherMessage === undefined) {
            weatherMessageIcon = '\\➖'
            weatherMessage = 'Nincs üzenet'
        }

        embed
            .setTitle(`**${skyTxt}**`)
            .setDescription(`\\💧 ${data0[0].forecast[1].precip} %\n` +
                `\\☁️ ${data1.clouds.all} %\n` +
                `${humidityIcon} ${humidityValue} % páratartalom\n` +
                `${tempIcon} ${tempMinValue} - ${tempValue} - ${tempMaxValue} °C (Hőérzet: ${tempFeelslikeValue} °C)\n` +
                `${windIcon} ${windDirection} (${data1.wind.deg}°) ${windValue} km/h szél\n` +
                `\\🌬️ ${windGustValue} km/h széllökés\n` +
                `${weatherPressureIcon(data1.main.pressure)} ${data1.main.pressure} pHa\n` +
                `\\👁️ ${visibilityValue} km\n` +
                `${alertIcon} ${alert}\n` +
                `${weatherMessageIcon} ${weatherMessage}\n\n` +
                `${moonIcon} ${moonText} (${Math.floor(data2[1].illum * 100)} %-a látható)\n\n` +
                `\\🌇 ${Dawn}\n` +
                `\\🏙️ ${unixToTime(data1.sys.sunrise)}\n` +
                `\\🌆 ${unixToTime(data1.sys.sunset)}\n` +
                `\\🌃 ${Dusk}` +
                '\n**Levegőminőség:**\n' +
                'CO: \\' + GetPollutionIndex(0, data3.co) + ' ' + data3.co + ' μg/m³' +
                '\nNO: \\' + GetPollutionIndex(1, data3.no) + ' ' + data3.no + ' μg/m³' +
                '\nNO₂: \\' + GetPollutionIndex(2, data3.no2) + ' ' + data3.no2 + ' μg/m³' +
                '\nO₃: \\' + GetPollutionIndex(3, data3.o3) + ' ' + data3.o3 + ' μg/m³' +
                '\nSO₂: \\' + GetPollutionIndex(4, data3.so2) + ' ' + data3.so2 + ' μg/m³' +
                '\nPM₂.₅: \\' + GetPollutionIndex(5, data3.pm2_5) + ' ' + data3.pm2_5 + ' μg/m³' +
                '\nPM₁₀: \\' + GetPollutionIndex(6, data3.pm10) + ' ' + data3.pm10 + ' μg/m³' +
                '\nNH₃: \\' + GetPollutionIndex(7, data3.nh3) + ' ' + data3.nh3 + ' μg/m³' +
                '\n\n**Előrejelzés:**')
        if (ImgExists(skyImgName) === true) {
            const attachment = new Discord.MessageAttachment('./commands/weatherImages/' + skyImgName + '.jpg', skyImgName + '.jpg');
            embed
                .attachFiles(attachment)
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

        embed.addField(dayName(new Date().getDay() - 1),
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
            .addField(dayName(new Date().getDay()),
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
        .setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(current.skytext, true).replace('\\', '')))
        .setFooter('• weather.service.msn.com : openweathermap.org\n • weather-js : nodejs-weather-app : moonphase-js', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/microsoft/17/information-source_2139.png')
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
* @param {Discord.Channel} channel
* @param {Discord.User} sender
*/
module.exports = async (channel, sender) => {

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

    const searchFor = 'Békéscsaba, HU'

    /**
     * @type {Discord.Message}
     */
    const msg = await channel.send('> \\⌛ **Betöltés...**')

    try {
        await weather1.find({ search: searchFor, degreeType: 'C' }, function (err, result) {
            if (err) {
                msg.edit('> \\❌ **MSN Error:** ' + err.toString())
                return
            }
            weather2.getWeather("bekescsaba").then(async val => {
                let url = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=46.678889&lon=21.090833&appid=' + openweatherToken

                request(url, function (err, response, body) {
                    if (err) {
                        msg.edit('> \\❌ **OpenWeatherMap Error:** ' + err.toString)
                    } else {
                        //try {
                            let weather = JSON.parse(body)
                            weatherData0 = result
                            weatherData1 = val
                            weatherData2 = m
                            const weatherData3 = weather.list[0].components
                            let embed = getEmbed(weatherData0, weatherData1, weatherData2, 3, weatherData3)
                            channel.send({embeds: [ embed ]})
                            msg.delete();
                        //} catch (error) {
                        //    msg.edit('> \\❌ **OpenWeatherMap Error:** ' + error.toString())
                        //}
                    }
                })
            });
        });
    } catch (error) {
        msg.edit('> \\❌ **MSN Error:** ' + error.toString())
    }
}