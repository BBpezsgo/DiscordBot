const Discord = require('discord.js')
const MoonPhase = require('moonphase-js')
const fs = require('fs')
const SunCalc = require('suncalc')
const WeatherServices = require('./weatherServices')
const WeatherAlertsService = require('./weatherMet')

const seasons = {
    'late autumn': { name: 'Késő ősz', icon: '🍂' },
    'early winter': { name: 'Kora tél', icon: '❄️' },
    'mid winter': { name: 'Tél közepe', icon: '❄️' },
}
/**
 * @returns {Promise<string>}
 * @param {WeatherServices.MSN.WeatherResult} MsnWeather Msn weather data
 * @param {WeatherServices.OpenWeatherMap.WeatherResult} OpenweatherWeather Openweather weather data
 * @param {MoonPhase[]} data2 Moon data
 */
const CreateGraph = async function(MsnWeather, OpenweatherWeather, data2) {
    const { Canvas } = require('canvas')

    const tempMax = []
    const tempMin = []
    const precip = []
    const dataLabels = []
    var dataSize = 0
    /** @type {'LINE' | 'FILL'} */
    var dataType = 'LINE'
    /** @type {'LINE' | 'FILL'} */
    var currentDataType = dataType
    var currentDataLabelSuffix = ''

    var currentData = []

    for (let i = 0; i < MsnWeather.forecast.length; i++) {
        const Element = MsnWeather.forecast[i]
        
        const skyIcon = weatherSkytextIcon(Element.skytextday, false)
        const skyTxt = weatherSkytxt(Element.skytextday)

        const tempMinValue = Number.parseInt(Element.low)

        const tempMaxValue = Number.parseInt(Element.high)
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        var text = ''
        if (Element.precip !== undefined && Element.precip !== '0')
        { text += `\n\\☔ ${Element.precip} %` }
        text += `\n${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C`
        text += `\n${skyIcon} ${skyTxt}`

        const dayNameText = dayName(new Date().getDay() + i - 1)

        tempMax.push(tempMaxValue)
        tempMin.push(tempMinValue)
        precip.push(Number.parseInt(Element.precip))
        dataLabels.push(dayNameText)
        dataSize += 1
    }

    const DrawGraph = function () {
        const graph = {
            Top: 25,
            Left: 25,
            Bottom: 32,
            Right: 0,
            Height: 250,
            Width: 450
        }

        const GraphOffsetX = 25

        const canvas = new Canvas(graph.Width + graph.Left + graph.Right, graph.Height + graph.Top + graph.Bottom)
        const context = canvas.getContext('2d')

        graph.Right += graph.Width
        graph.Bottom += graph.Height

        context.clearRect(0, 0, canvas.height, canvas.width)

        // draw X and Y axis  
        context.beginPath();
        context.strokeStyle = "#fffc";
        context.moveTo(graph.Left, graph.Bottom);
        context.lineTo(graph.Right, graph.Bottom);
        context.lineTo(graph.Right, graph.Top);
        context.stroke();

        const DrawLine = function(fromX, fromY, toX, toY) {
            context.beginPath()
            context.moveTo(fromX, fromY)
            context.lineTo(toX, toY)
            context.stroke()
        }

        context.strokeStyle = "#fff4"
        DrawLine(graph.Left, graph.Top, graph.Right, graph.Top)

        DrawLine(graph.Left, (graph.Height) / 4 * 3 + graph.Top, graph.Right, (graph.Height) / 4 * 3 + graph.Top)

        DrawLine(graph.Left, (graph.Height) / 2 + graph.Top, graph.Right, (graph.Height) / 2 + graph.Top)

        DrawLine(graph.Left, (graph.Height) / 4 + graph.Top, graph.Right, (graph.Height) / 4 + graph.Top)

        context.strokeStyle = "#fffc";
        for (let i = 0; i < dataSize; i++) {
            const x = (graph.Right / dataSize * i + graph.Left) + GraphOffsetX
            DrawLine(x, graph.Bottom, x, graph.Bottom - 16)

            if (dataLabels[i] === undefined) { continue }
            context.font = "bold 12px Arial"
            context.fillStyle = '#fff'
            context.fillText(dataLabels[i], x - (context.measureText(dataLabels[i]).width / 2), graph.Bottom + 12)
        }

        // context.font = "bold 16px Arial"
        // context.fillStyle = '#fff'
        // context.fillText("Day of the week", graph.Left + (graph.Width / 2) - (context.measureText('Day of the week').width / 2), graph.Bottom + 50)
        // context.fillText("C°", graph.Right + 15, graph.Top + (graph.Height / 2))

        var largest = -100
        var smallest = 100

        /** @param {boolean} ClearPrev */
        const CalculateLimits = function(ClearPrev) {
            if (ClearPrev) {
                largest = -500
                smallest = 500
            }

            for (var i = 0; i < dataSize; i++) {
                if (currentData[i] > largest) {
                    largest = currentData[i]
                }
                if (currentData[i] < smallest) {
                    smallest = currentData[i]
                }
            }
        }
        const DrawDataLines = function() {
            if (currentDataType === 'LINE') {
                context.beginPath()
                context.lineJoin = "round"
                // add first point in the graph
                context.moveTo(graph.Left + GraphOffsetX, (graph.Height - currentData[0] / largest * graph.Height) + graph.Top)
                // loop over data and add points starting from the 2nd index in the array as the first has been added already  
                for (var i = 1; i < dataSize; i++) {
                    context.lineTo(graph.Right / dataSize * i + graph.Left + GraphOffsetX, (graph.Height - currentData[i] / largest * graph.Height) + graph.Top)
                }
                context.stroke()
            } else if (currentDataType === 'FILL') {
                context.beginPath()
                context.lineJoin = "round"
                context.moveTo(graph.Left + GraphOffsetX, (graph.Height - currentData[0] / largest * graph.Height) + graph.Top)
                for (var i = 1; i < dataSize; i++) {
                    context.lineTo(graph.Right / dataSize * i + graph.Left + GraphOffsetX, (graph.Height - currentData[i] / largest * graph.Height) + graph.Top)
                }
                context.lineTo(graph.Right / dataSize * (dataSize - 1) + graph.Left + GraphOffsetX, graph.Bottom) // bottom-right
                context.lineTo(graph.Left + GraphOffsetX, graph.Bottom) // bottom-left
              
                context.globalCompositeOperation = "destination-over" // draw behind
                context.fill()
                context.globalCompositeOperation = "source-over" // normal behavior
            }
        }
        const DrawDataPoints = function(radius) {
            context.beginPath()
            context.arc(graph.Left + GraphOffsetX, (graph.Height - currentData[0] / largest * graph.Height) + graph.Top, radius, 0, 2 * Math.PI, false)
            context.fill()
            context.closePath()

            // loop over data and add points starting from the 2nd index in the array as the first has been added already  
            for (var i = 1; i < dataSize; i++) {
                context.beginPath()
                context.arc(graph.Right / dataSize * i + graph.Left + GraphOffsetX, (graph.Height - currentData[i] / largest * graph.Height) + graph.Top, radius, 0, 2 * Math.PI, false)
                context.fill()
                context.closePath()
            }
        }
        const DrawDataLabels = function() {
            context.font = "bold 12px Arial"

            for (var i = 0; i < dataSize; i++) {
                const x = graph.Right / dataSize * i + graph.Left + GraphOffsetX
                const y = (graph.Height - currentData[i] / largest * graph.Height) + graph.Top

                if (y < graph.Height/2) {
                    context.fillText(currentData[i] + currentDataLabelSuffix, x, y+12+8)
                } else {
                    context.fillText(currentData[i] + currentDataLabelSuffix, x, y-12)
                }
            }

        }

        var currentColors = {
            Primary: '#fff',
            Secondary: '#fff7'
        }

        const DrawData = function() {
            currentDataType = 'LINE'
            context.lineWidth = 8
            context.strokeStyle = currentColors.Secondary
            DrawDataLines()
    
            currentDataType = 'LINE'
            context.lineWidth = 2
            context.strokeStyle = currentColors.Primary
            DrawDataLines()

            if (dataType === 'FILL') {
                currentDataType = 'FILL'
                context.fillStyle = currentColors.Secondary
                DrawDataLines()
            }
    
            context.fillStyle = currentColors.Secondary
            DrawDataPoints(8)
    
            context.fillStyle = currentColors.Primary
            DrawDataPoints(4)
    
            context.fillStyle = '#fff'
            DrawDataLabels()
        }
        
        dataType = 'FILL'
        currentData = precip
        currentColors.Primary = '#34bfdb'
        currentColors.Secondary = '#34bfdb40'
        currentDataLabelSuffix = '%'
        CalculateLimits(true)
        largest = 100
        smallest = 0
        DrawData()
        
        dataType = 'LINE'
        currentData = tempMax
        currentColors.Primary = '#ed4245'
        currentColors.Secondary = '#ed424540'
        currentDataLabelSuffix = ' C°'
        CalculateLimits(true)
        DrawData()
        
        dataType = 'LINE'
        currentData = tempMin
        currentColors.Primary = '#5865f2'
        currentColors.Secondary = '#5865f240'
        currentDataLabelSuffix = ' C°'
        CalculateLimits(false)
        DrawData()

        return { canvas: canvas, context: context }
    }

    return new Promise((callback) => {
        const out = fs.createWriteStream(__dirname + '/graph.png')
        const stream = DrawGraph().canvas.createPNGStream()
        stream.pipe(out)
        out.on('finish', () => callback(__dirname + '/graph.png'))
    })
}

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
    weatherSkytextImgName,
    MetAlert_DegreeIconNameToText,
    MetAlert_TypeIconNameToIcon,
    CityBekescsaba
} = require('../commands/weatherFunctions');

const ToUnix=(date)=>{return Math.round(date.getTime()/1000)}
const AverageUnix=(unix1,unix2)=>{return Math.round((unix1+unix2)/2)}

/**
 * @param {WeatherServices.MSN.WeatherResult} MsnWeather Msn weather data
 * @param {WeatherServices.OpenWeatherMap.WeatherResult} OpenweatherWeather Openweather weather data
 * @param {MoonPhase[]} data2 Moon data
 * @param {WeatherServices.OpenWeatherMap.PollutionResult} OpenweatherPollution Openweather pollution data
 * @param {WeatherAlertsService.MET.ResultCounty | null} MetAlerts
 */
function getEmbedEarth(MsnWeather, OpenweatherWeather, data2, OpenweatherPollution, MetAlerts) {
    const current = MsnWeather.current
    const embed = new Discord.EmbedBuilder()
        .setColor('#00AE86')
        .setAuthor({ name: current.observationpoint.replace(', Hungary', ''), url: 'https://openweathermap.org/city/' + OpenweatherWeather.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    {
        const skyTxt = weatherSkytxt(current.skytext)
        embed.setTitle(`**${skyTxt}** ||(${OpenweatherWeather.weather[0].description})|||| (${OpenweatherWeather.weather[0].id})||`)

        const humidityValue = Average([current.humidity, OpenweatherWeather.main.humidity])
        const humidityIcon = weatherHumidityIcon(humidityValue)

        const windValue = GetReadableNumber(Average([OpenweatherWeather.wind.speed * 3.6, parseInt(current.windspeed.replace(' km/h', ''))]))

        const windGustValue = GetReadableNumber(OpenweatherWeather.wind.gust * 3.6)

        const tempValue = GetReadableNumber(Average([current.temperature, OpenweatherWeather.main.temp]))

        const tempMinValue = GetReadableNumber(Average([MsnWeather.forecast[1].low, OpenweatherWeather.main.temp_min]))
        const tempMaxValue = GetReadableNumber(Average([MsnWeather.forecast[1].high, OpenweatherWeather.main.temp_max]))

        const tempFeelslikeValue = Math.floor(Average([current.feelslike, OpenweatherWeather.main.feels_like]))

        const windDirection = DirectionNameToArrow(current.winddisplay.toString().split(' ')[2])

        const visibilityValue = Math.floor(OpenweatherWeather.visibility / 1000)

        const times = SunCalc.getTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)
        const moonTimes = SunCalc.getMoonTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)
                
        var description = ''
        description += '\n' + `\\☁️ ${OpenweatherWeather.clouds.all} % felhősség`
        if (MsnWeather.forecast[1].precip !== '0')
        { description += '\n' + `\\☔ ${MsnWeather.forecast[1].precip} % csapadék` }
        description += '\n' + `${humidityIcon} ${humidityValue} % páratartalom`
        description += '\n' + `${weatherTempIcon(tempFeelslikeValue)} ${tempMinValue} - ${tempValue} - ${tempMaxValue} °C (Hőérzet: ${tempFeelslikeValue} °C)`
        description += '\n' + `${weatherWindIcon(windValue)} ${windDirection} (${OpenweatherWeather.wind.deg}°) ${windValue} km/h szél`
        description += '\n' + `\\🌬️ ${windGustValue} km/h széllökés`
        description += '\n' + `${weatherPressureIcon(OpenweatherWeather.main.pressure)} ${OpenweatherWeather.main.pressure} pHa légnyomás`
        
        if (visibilityValue !== 10)
        { description += '\n' + `\\👁️ ${visibilityValue} km látótávolság` }

        if (MetAlerts !== undefined && MetAlerts !== null) {
            if (MetAlerts.alerts.length > 0) {
                description += '\n' + '\n🔔 **Riasztások:**\n'
                
                for (let i = 0; i < MetAlerts.alerts.length; i++) {
                    const alert = MetAlerts.alerts[i]
                    const alertIcon = MetAlert_TypeIconNameToIcon(alert.typeIcon)
                    const alertDegree = MetAlert_DegreeIconNameToText(alert.degreeIcon)
                    var result = ''
                    
                    if (alertIcon !== null) {
                        result += `\\${alertIcon} `
                    } else {
                        result += `||${alert.typeIcon}|| `
                    }
                    
                    if (alertDegree !== null) {
                        result += `${alertDegree} `
                    } else {
                        result += `||${alert.degreeIcon}|| `
                    }

                    result += alert.Name.toLowerCase()

                    description += '\n' + result
                }
            }
        }

        if (OpenweatherPollution !== undefined) {
            description += '\n' + '\n😷 **Levegőminőség:**\n'

            description += '\n' + `Levőminőség: \\${GetPollutionIndex(8, OpenweatherPollution.main.aqi)} ${GetPollutionText(OpenweatherPollution.main.aqi)}`
        
            description += '\n' + `CO: \\${GetPollutionIndex(0, OpenweatherPollution.components.co)} ${OpenweatherPollution.components.co} μg/m³`
            description += '\n' + `NO: \\${GetPollutionIndex(1, OpenweatherPollution.components.no)} ${OpenweatherPollution.components.no}μg/m³`
            description += '\n' + `NO₂: \\${GetPollutionIndex(2, OpenweatherPollution.components.no2)} ${OpenweatherPollution.components.no2}μg/m³`
            description += '\n' + `O₃: \\${GetPollutionIndex(3, OpenweatherPollution.components.o3)} ${OpenweatherPollution.components.o3}μg/m³`
            description += '\n' + `SO₂: \\${GetPollutionIndex(4, OpenweatherPollution.components.so2)} ${OpenweatherPollution.components.so2}μg/m³`
            description += '\n' + `PM₂.₅: \\${GetPollutionIndex(5, OpenweatherPollution.components.pm2_5)} ${OpenweatherPollution.components.pm2_5}μg/m³`
            description += '\n' + `PM₁₀: \\${GetPollutionIndex(6, OpenweatherPollution.components.pm10)} ${OpenweatherPollution.components.pm10}μg/m³`
            description += '\n' + `NH₃: \\${GetPollutionIndex(7, OpenweatherPollution.components.nh3)} ${OpenweatherPollution.components.nh3}g/m³`
        }

        try {                
            description +=
                '\n\n☀️ **Nap:**\n\n' +

                `\\🌇 Hajnal: <t:${ToUnix(times.dawn)}:R>\n` +
                `\\🌇 Napkelte: <t:${AverageUnix(OpenweatherWeather.sys.sunrise, ToUnix(times.sunrise))}:R>\n` +
                `\\🌞 Dél: <t:${ToUnix(times.solarNoon)}:R>\n` +
                `\\📷 "Golden Hour": <t:${ToUnix(times.goldenHour)}:R>\n` +
                `\\🌆 Napnyugta: <t:${AverageUnix(OpenweatherWeather.sys.sunset, ToUnix(times.sunset))}:R>\n` +
                `\\🌆 Szürkület: <t:${ToUnix(times.dusk)}:R>\n` +
                `\\🌃 Éjjfél: <t:${ToUnix(times.nadir) + 86400}:R>`            
        } catch (error) { }

        description +=
            '\n\n🌕 **Hold:**\n\n'
        description += `${weatherMoonIcon(data2[1].phaseName())} ${weatherMoonText(data2[1].phaseName())} (${Math.floor(data2[1].illum * 100)} %-a látható)\n`
        
        if (moonTimes.rise !== undefined)
        { description += `Holdkelte: <t:${ToUnix(moonTimes.rise)}:R>\n` }
        if (moonTimes.set !== undefined)
        { description += `Holdnyugta: <t:${ToUnix(moonTimes.set)}:R>\n` }

        if (moonTimes.alwaysUp)
        { description += `A Hold ma mindig a **horizont felett lesz**\n` }
        if (moonTimes.alwaysDown)
        { description += `A Hold ma mindig a **horizont alatt lesz**\n` }
        description += '\n🗓️ **Előrejelzés:**'
        embed.setDescription(description)
        
        /*
        const skyImgName = weatherSkytextImgName(current.skytext, unixToTime(OpenweatherWeather.sys.sunset).split(':')[0], unixToTime(OpenweatherWeather.sys.sunrise).split(':')[0], OpenweatherWeather.clouds.all)
        
        if (ImgExists(skyImgName) === true)
        { embed.setImage('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/' + skyImgName + '.jpg') }
        else
        { embed.addFields([{ name: 'ImgCode', value: skyImgName, inline: false }]) }
        */
    }

    for (let i = 0; i < MsnWeather.forecast.length; i++) {
        const Element = MsnWeather.forecast[i]
        
        const skyIcon = weatherSkytextIcon(Element.skytextday, false)
        const skyTxt = weatherSkytxt(Element.skytextday)

        const tempMinValue = Element.low

        const tempMaxValue = Element.high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        var text = ''
        if (Element.precip !== undefined && Element.precip !== '0')
        { text += `\n\\☔ ${Element.precip} %` }
        text += `\n${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C`
        text += `\n${skyIcon} ${skyTxt}`

        const dayNameText = dayName(new Date().getDay() + i - 1)
        embed.addFields([{
            name: dayNameText,
            value: text.trim(),
            inline: true
        }])
    }

    embed.addFields({
        name: '📈 Grafikon:',
        value: 'Minimum-, maximum hőmérséklet és csapadék',
        inline: false
    })

    embed.setTimestamp(Date.parse(current.date + 'T' + current.observationtime))    
    // embed.setThumbnail('attachment://graph.png')
    embed.setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(current.skytext, true).replace('\\', '')))
    embed.setFooter({ text: '• weather.service.msn.com • openweathermap.org' })
    embed.setImage('attachment://graph.png')
    return embed
}

function GetMarsPressureIcon(pressure, averagePressure) {
    if (averagePressure == 0) {
        return ''
    } else {
        if (pressure-5 > averagePressure) {
            return '\\🔺 '
        } else if (pressure+5 < averagePressure) {
            return '\\🔻 '
        }
        return '\\◼️ '
    }
}

function GetSeason(season) {
    var seasonName = season
    if (seasons[seasonName] != undefined) {
        seasonName = `\\${seasons[seasonName].icon} ${seasons[seasonName].name}`
    }
    return seasonName
}

/** @param {string} date YYYY-MM-DD */
function DateToDate(date) {
    var newDate = new Date()
    newDate.setFullYear(date.split('-')[0], Number.parseInt(date.split('-')[1]) - 1, date.split('-')[2])
    return newDate
}

/** @param {WeatherServices.NasaMars.WeatherResult} data @param {WeatherServices.NasaMars.WeeklyImagesResult} weeklyImage */
function getEmbedMars(data, weeklyImage) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#fd875f')
        .setAuthor({ name: 'Jezero Kráter', url: 'https://mars.nasa.gov/mars2020/weather/', iconURL: 'https://mars.nasa.gov/mars2020/favicon-16x16.png' })

    var averagePressure = 0
    try {
        var text = ""
        if (fs.existsSync('./pressures.txt')) {
            text = fs.readFileSync('./pressures.txt', 'utf-8')
        }
        var lines = text.split('\n')
        var solsLogged = []
        lines.forEach(line => {
            if (line.length > 0) {
                solsLogged.push(line.split(' ')[0])
            }
        });
        data.sols.forEach(sol => {
            if (!solsLogged.includes(sol.sol)) {
                text += sol.sol + ' ' + sol.pressure + '\n'
                solsLogged.push(sol.sol)
            }
        })
        fs.writeFileSync('./pressures.txt', text, 'utf-8')
        var lines = text.split('\n')
        var n = 0
        lines.forEach(line => {
            if (line.length > 0) {
                averagePressure += Number.parseFloat(line.split(' ')[1])
                n += 1
            }
        })
        averagePressure = averagePressure / n        
    } catch (ex) { }

    const latestSol = data.sols[data.sols.length - 1]
    
    embed
        .setTitle(`sol ${latestSol.sol}`)
        .setDescription(
            `\\🌡️ ${latestSol.min_temp} - ${latestSol.max_temp} °C\n` +
            `${GetMarsPressureIcon(latestSol.pressure, averagePressure)} ${latestSol.pressure} pHa légnyomás\n` +
            `${GetSeason(latestSol.season)}\n` +
            `\\🌍 Földi dátum: ${latestSol.terrestrial_date}` +

            '\n\n☀️ **Nap:**\n\n' +

            `\\🌇 Napkelte: ${latestSol.sunrise}\n` +
            `\\🌆 Napnyugta: ${latestSol.sunset}\n\n` +

            '\\🗓️ **Előző sol-ok:**')

    data.sols.forEach(sol => {
        if (latestSol.sol != sol.sol) {
            embed.addFields([{
                name: 'Sol ' + sol.sol,
                value: '\\🌡️ ' + sol.min_temp + ' - ' + sol.max_temp + ' C°\n' + 
                    GetSeason(sol.season),
                inline: true
            }])
        }
    })

    embed
        .setTimestamp(DateToDate(latestSol.terrestrial_date))
        .setFooter({ text: '• Mars 2020' })
        .setImage('https://i.cdn29.hu/apix_collect_c/primary/1311/mars131114_20131114_122345_original_1150x645_cover.jpg')
    
    if (weeklyImage != null) {
        const imageList = weeklyImage.images[0]
        if (imageList != undefined) {
            embed.setImage(imageList.image_files.medium)
        }
    }
    
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

/** @param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
module.exports = async (command, privateCommand, earth = true) => {
    await command.deferReply({ ephemeral: privateCommand })

    if (earth == true) {        
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()

        WeatherServices.MsnWeather((msnWeather, msnWeatherError) => {
            if (msnWeatherError) {
                command.editReply({ content: '> \\❌ **MSN Error:** ' + msnWeatherError })
                return
            }
            WeatherServices.OpenweathermapWeather((openweathermapWeather, openweathermapWeatherError) => {
                if (openweathermapWeatherError) {
                    command.editReply({ content: '> \\❌ ' + openweathermapWeatherError })
                    return
                }
                WeatherServices.OpenweathermapPollution(async (openweathermapPollution, openweathermapPollutionError) => {
                    if (openweathermapPollutionError) {
                        command.editReply({ content: '> \\❌ ' + openweathermapPollutionError })
                        return
                    }

                    const MoonPhases = [
                        new MoonPhase(addDays(new Date(year, month, day), -1)),
                        new MoonPhase(new Date(year, month, day)),
                        new MoonPhase(addDays(new Date(year, month, day), 1)),
                        new MoonPhase(addDays(new Date(year, month, day), 2)),
                        new MoonPhase(addDays(new Date(year, month, day), 3))
                    ]

                    /** @type {WeatherAlertsService.MET.ResultCounty} */
                    var alerts = null
                    try {
                        alerts = await WeatherAlertsService.GetCountyAlerts('Bekes')
                    } catch (e) { }

                    const embed = getEmbedEarth(msnWeather[0], openweathermapWeather, MoonPhases, openweathermapPollution.list[0], alerts)
                    try {
                        const attachmentPath = await CreateGraph(msnWeather[0], openweathermapWeather, MoonPhases)
                        command.editReply({ embeds: [embed],
                            files: [{
                                attachment: attachmentPath,
                                name: 'graph.png'
                            }]
                        })
                    } catch (error) {
                        command.editReply({ embeds: [embed] })
                    }
                })
            })
        })
    } else {
        WeatherServices.NasaMarsWeather((weatherData, weatherError) => {
            if (weatherError) {
                command.editReply({ content: '> \\❌ ' + weatherError })
                return
            }

            WeatherServices.NasaMarsWeeklyImage((bodyImage, imageError) => {
                command.editReply({ embeds: [ getEmbedMars(weatherData, bodyImage)] })
            })
        })
    }
}
