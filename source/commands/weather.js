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

const {
    ImgExists,
    weatherSkytxt,
    weatherWindIcon,
    weatherTempIcon,
    weatherMoonIcon,
    weatherMoonText,
    weatherHumidityIcon,
    weatherThumbnailUrl,
    DirectionNameToArrow,
    unixToTime,
    weatherPressureIcon,
    Average,
    GetReadableNumber,
    GetPollutionIndex,
    GetPollutionText,
    dayName,
    weatherSkytextIcon,
    weatherSkytextImgName
} = require('../commands/weatherFunctions')

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

/**
 * @param {any} data0 msn data
 * @param {any} data1 openweather data
 * @param {any[]} data2 moon data
 * @returns {Discord.MessageEmbed}
 */
function getEmbedEarth(data0, data1, data2, index, data3) {
    var current = data0[0].current;
    const embed = new Discord.MessageEmbed()
        .setColor('#00AE86')
        .setAuthor({ name: current.observationpoint.replace(', Hungary', '') + ' ' + current.date.toString().replace('-', '.').replace('-', '.') + '. [' + dayName(new Date().getDay()) + '] ' + current.observationtime.replace(':00:00', ':00 -kor'), url: 'https://openweathermap.org/city/' + data1.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png'});

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

        embed
            .setTitle(`**${skyTxt}** ||(${data1.weather[0].description})|||| (${data1.weather[0].id})||`)
            .setDescription(
                `\\☁️ ${data1.clouds.all} %\n` +
                `\\☔ ${data0[0].forecast[1].precip} % csapadék\n` +
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

                '**Előrejelzés:**')
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
                `\\☔ ${data0[0].forecast[1].precip} %\n` +
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
                `\\☔ ${data0[0].forecast[2].precip} %\n` +
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
                `\\☔ ${data0[0].forecast[3].precip} %\n` +
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
                `\\☔ ${data0[0].forecast[4].precip} %\n` +
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
