const Discord = require('discord.js')
const MoonPhase = require('moonphase-js')
const fs = require('fs')
const SunCalc = require('suncalc')
const Openweathermap = require('../services/Openweathermap')
const NASA = require('../services/NASA')
const WeatherAlertsService = require('../services/weatherMet')
const LogError = require('../functions/errorLog')

const seasons = {
    'early autumn': { name: 'Kora ősz', icon: '🍂' },
    'mid autumn': { name: 'Ősz', icon: '🍂' },
    'late autumn': { name: 'Késő ősz', icon: '🍂' },

    'early winter': { name: 'Kora tél', icon: '❄️' },
    'mid winter': { name: 'Tél', icon: '❄️' },
    'late winter': { name: 'Késő tél', icon: '❄️' },

    'early spring': { name: 'Kora tavasz', icon: '🌱' },
    'mid spring': { name: 'Tavasz', icon: '🌱' },
    'late spring': { name: 'Késő tavasz', icon: '🌱' },
}

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
        
        const tempMinValue = Number.parseInt(Element.low)
        const tempMaxValue = Number.parseInt(Element.high)
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
        
        /** @param {number} i Data index @param {number[]} dataList */
        const GetPoint = function(i, dataList) {
            const min = Math.min(smallest, 0)
            const max = largest
            var dataPercent = (dataList[i] - min) / (max - min)

            const p = {
                x: graph.Right / dataList.length * i + graph.Left + GraphOffsetX,
                y: graph.Height - (dataPercent * graph.Height) + graph.Top
            }
            return p
        }

        const DrawDataLines = function() {
            if (currentDataType === 'LINE') {
                context.beginPath()
                context.lineJoin = "round"
                // add first point in the graph
                context.moveTo(GetPoint(0, currentData).x, GetPoint(0, currentData).y)
                // loop over data and add points starting from the 2nd index in the array as the first has been added already  
                for (var i = 1; i < dataSize; i++) {
                    context.lineTo(GetPoint(i, currentData).x, GetPoint(i, currentData).y)
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
            context.arc(GetPoint(0, currentData).x, GetPoint(0, currentData).y, radius, 0, 2 * Math.PI, false)
            context.fill()
            context.closePath()

            // loop over data and add points starting from the 2nd index in the array as the first has been added already  
            for (var i = 1; i < dataSize; i++) {
                context.beginPath()
                context.arc(GetPoint(i, currentData).x, GetPoint(i, currentData).y, radius, 0, 2 * Math.PI, false)
                context.fill()
                context.closePath()
            }
        }
        const DrawDataLabels = function() {
            context.font = "bold 12px Arial"

            for (var i = 0; i < dataSize; i++) {
                const p = GetPoint(i, currentData)

                if (p.y < graph.Height/2) {
                    context.fillText(currentData[i] + currentDataLabelSuffix, p.x, p.y+12+8)
                } else {
                    context.fillText(currentData[i] + currentDataLabelSuffix, p.x, p.y-12)
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
    unixToTime,
    weatherSkytextImgName,
    
    weatherSkytxt,
    weatherWindIcon,
    weatherTempIcon,
    weatherMoonIcon,
    weatherMoonText,
    weatherHumidityIcon,
    weatherThumbnailUrl,
    DirectionNameToArrow,
    weatherPressureIcon,
    Average,
    GetReadableNumber,
    GetPollutionIndex,
    GetPollutionText,
    dayName,
    weatherSkytextIcon,
    MetAlert_DegreeIconNames,
    MetAlert_TypeIcons,
    MetAlert_TypeNames,
    CityBekescsaba
} = require('../commands/weatherFunctions');

const EmojiPrefix = ''

const ToUnix=(date)=>{return Math.round(date.getTime()/1000)}
const AverageUnix=(unix1,unix2)=>{return Math.round((unix1+unix2)/2)}

/**
 @param {Openweathermap.OpenWeatherMap.WeatherResult} OpenweatherWeather
 @param {MoonPhase[]} Moon
 @param {Openweathermap.OpenWeatherMap.PollutionItem | undefined} OpenweatherPollution
 @param {WeatherAlertsService.MET.ResultCounty[]} MetAlerts
 @param {WeatherAlertsService.MET.ResultSnowReport} MetSnowReport
 @param {boolean} msnIsCache
 @param {boolean} openweathermapWeatherIsCache
 */
function getEmbedEarth(OpenweatherWeather, Moon, OpenweatherPollution, MetAlerts, msnIsCache, openweathermapWeatherIsCache, MetSnowReport) {
    const embed = new Discord.EmbedBuilder()
        .setColor('#00AE86')
        .setAuthor({ name: 'Békéscsaba', url: 'https://openweathermap.org/city/' + OpenweatherWeather.id, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_32x32.png' })

    {
        embed.setTitle(`**${weatherSkytxt(OpenweatherWeather.weather[0].description)}** ||${OpenweatherWeather.weather[0].id}||`)

        const humidityValue = OpenweatherWeather.main.humidity

        const windValue = GetReadableNumber(OpenweatherWeather.wind.speed * 3.6)

        const tempValue = GetReadableNumber(OpenweatherWeather.main.temp)

        const tempMinValue = GetReadableNumber(OpenweatherWeather.main.temp_min)
        const tempMaxValue = GetReadableNumber(OpenweatherWeather.main.temp_max)

        const pressure = (OpenweatherWeather.main.grnd_level) ? OpenweatherWeather.main.grnd_level : OpenweatherWeather.main.pressure

        const tempFeelslikeValue = Math.floor(OpenweatherWeather.main.feels_like)

        // const windDirection = DirectionNameToArrow(current.winddisplay.toString().split(' ')[2])

        const times = SunCalc.getTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)
        const moonTimes = SunCalc.getMoonTimes(new Date(Date.now()), CityBekescsaba.Lat, CityBekescsaba.Lon)

        var description = ''
        description += '\n' + `${EmojiPrefix}☁️ ${OpenweatherWeather.clouds.all} % felhősség`
        
        description += '\n' + `${EmojiPrefix}${weatherHumidityIcon(humidityValue)} ${humidityValue} % páratartalom`
        description += '\n' + `${EmojiPrefix}${weatherTempIcon(tempFeelslikeValue)} ${tempMinValue} - ${tempValue} - ${tempMaxValue} °C (Hőérzet: ${tempFeelslikeValue} °C)`
        description += '\n' + `${EmojiPrefix}${weatherWindIcon(windValue)} ${windValue} km/h szél`
        description += '\n' + `${EmojiPrefix}🌬️ ${GetReadableNumber(OpenweatherWeather.wind.gust * 3.6)} km/h széllökés`
        description += '\n' + `${EmojiPrefix}${weatherPressureIcon(pressure)} ${pressure} pHa légnyomás`
        
        if (OpenweatherWeather.visibility !== 10000) {
            if (OpenweatherWeather.visibility < 1000) {
                description += '\n' + `${EmojiPrefix}👁️ ${OpenweatherWeather.visibility} m látótávolság`
            } else {
                description += '\n' + `${EmojiPrefix}👁️ ${Math.round(OpenweatherWeather.visibility / 1000)} km látótávolság`
            }
        }

        var snowDepth = null
        for (let i = 0; i < MetSnowReport.length; i++) {
            if (MetSnowReport[i].location === 'Békéscsaba') {
                snowDepth = MetSnowReport[i].depth
                break
            }           
        }
        if (OpenweatherWeather.rain) {
            if (OpenweatherWeather.rain['1h']) {
                description += '\n' + `${EmojiPrefix}🌊 ${OpenweatherWeather.rain['1h']} mm eső az elmúlt 1 órában`
            }
            if (OpenweatherWeather.rain['3h']) {
                description += '\n' + `${EmojiPrefix}🌊 ${OpenweatherWeather.rain['3h']} mm eső az elmúlt 3 órában`
            }
        }

        if (snowDepth !== null) {
            if (snowDepth === 'patches') {
                description += '\n' + `${EmojiPrefix}⛄ Helyenként hófoltok`
            } else if (snowDepth !== 0) {
                description += '\n' + `${EmojiPrefix}⛄ ${snowDepth} cm hó`
            }
        }

        if (OpenweatherWeather.snow) {
            if (OpenweatherWeather.snow['1h']) {
                description += '\n' + `${EmojiPrefix}⛄ ${OpenweatherWeather.snow['1h']} mm hó az elmúlt 1 órában`
            }
            if (OpenweatherWeather.snow['3h']) {
                description += '\n' + `${EmojiPrefix}⛄ ${OpenweatherWeather.snow['3h']} mm hó az elmúlt 3 órában`
            }
        }

        console.log(MetAlerts[0])
        if (MetAlerts[0] !== null) {
            if (MetAlerts[0].alerts.length > 0) {
                description += '\n' + '\n🔔 **Riasztások:**\n'
                
                for (let i = 0; i < MetAlerts[0].alerts.length; i++) {
                    const alert = MetAlerts[0].alerts[i]
                    var result = ''
                    
                    if (MetAlert_TypeIcons[alert.typeIcon] !== undefined) {
                        result += `${EmojiPrefix}${MetAlert_TypeIcons[alert.typeIcon]} `
                    } else {
                        result += `||${alert.typeIcon}|| `
                    }
                    
                    if (MetAlert_DegreeIconNames[alert.degreeIcon] !== undefined) {
                        result += `${MetAlert_DegreeIconNames[alert.degreeIcon]} `
                    } else {
                        result += `||${alert.degreeIcon}|| `
                    }

                    if (MetAlert_TypeNames[alert.Name.toLowerCase()] !== undefined) {
                        result += MetAlert_TypeNames[alert.Name.toLowerCase()].toLowerCase()
                    } else {
                        result += alert.Name.toLowerCase()
                    }

                    description += '\n' + result
                }
            }
        }

        if (OpenweatherPollution) {
            description += '\n' + `\n😷 **Levegőminőség:**\n`

            description += '\n' + `Levőminőség: ${EmojiPrefix}${GetPollutionIndex(8, OpenweatherPollution.main.aqi)} ${GetPollutionText(OpenweatherPollution.main.aqi)}`
        
            description += '\n' + `CO: ${EmojiPrefix}${GetPollutionIndex(0, OpenweatherPollution.components.co)} ${OpenweatherPollution.components.co} μg/m³`
            description += '\n' + `NO: ${EmojiPrefix}${GetPollutionIndex(1, OpenweatherPollution.components.no)} ${OpenweatherPollution.components.no}μg/m³`
            description += '\n' + `NO₂: ${EmojiPrefix}${GetPollutionIndex(2, OpenweatherPollution.components.no2)} ${OpenweatherPollution.components.no2}μg/m³`
            description += '\n' + `O₃: ${EmojiPrefix}${GetPollutionIndex(3, OpenweatherPollution.components.o3)} ${OpenweatherPollution.components.o3}μg/m³`
            description += '\n' + `SO₂: ${EmojiPrefix}${GetPollutionIndex(4, OpenweatherPollution.components.so2)} ${OpenweatherPollution.components.so2}μg/m³`
            description += '\n' + `PM₂.₅: ${EmojiPrefix}${GetPollutionIndex(5, OpenweatherPollution.components.pm2_5)} ${OpenweatherPollution.components.pm2_5}μg/m³`
            description += '\n' + `PM₁₀: ${EmojiPrefix}${GetPollutionIndex(6, OpenweatherPollution.components.pm10)} ${OpenweatherPollution.components.pm10}μg/m³`
            description += '\n' + `NH₃: ${EmojiPrefix}${GetPollutionIndex(7, OpenweatherPollution.components.nh3)} ${OpenweatherPollution.components.nh3}g/m³`
        }

        try {
            description +=
                '\n\n☀️ **Nap:**\n\n' +

                `${EmojiPrefix}🌇 Hajnal: <t:${ToUnix(times.dawn)}:R>\n` +
                `${EmojiPrefix}🌇 Napkelte: <t:${AverageUnix(OpenweatherWeather.sys.sunrise, ToUnix(times.sunrise))}:R>\n` +
                `${EmojiPrefix}🌞 Dél: <t:${ToUnix(times.solarNoon)}:R>\n` +
                `${EmojiPrefix}📷 "Golden Hour": <t:${ToUnix(times.goldenHour)}:R>\n` +
                `${EmojiPrefix}🌆 Napnyugta: <t:${AverageUnix(OpenweatherWeather.sys.sunset, ToUnix(times.sunset))}:R>\n` +
                `${EmojiPrefix}🌆 Szürkület: <t:${ToUnix(times.dusk)}:R>\n` +
                `${EmojiPrefix}🌃 Éjjfél: <t:${ToUnix(times.nadir) + 86400}:R>`            
        } catch (error) {
            LogError(error)
        }

        description +=
            '\n\n🌙 **Hold:**\n\n'
        description += `${EmojiPrefix}${weatherMoonIcon(Moon[1].phaseName())} ${weatherMoonText(Moon[1].phaseName())} (${Math.floor(Moon[1].illum * 100)} %-a látható)\n`
        
        if (moonTimes.rise !== undefined)
        { description += `${EmojiPrefix}⬆️ Holdkelte: <t:${ToUnix(moonTimes.rise)}:R>\n` }
        if (moonTimes.set !== undefined)
        { description += `${EmojiPrefix}⬇️ Holdnyugta: <t:${ToUnix(moonTimes.set)}:R>\n` }

        if (moonTimes.alwaysUp)
        { description += `A Hold ma mindig a **horizont felett lesz**\n` }
        if (moonTimes.alwaysDown)
        { description += `A Hold ma mindig a **horizont alatt lesz**\n` }
        // description += '\n🗓️ **Előrejelzés:**'
        embed.setDescription(description)
        
        /*
        const skyImgName = weatherSkytextImgName(current.skytext, unixToTime(OpenweatherWeather.sys.sunset).split(':')[0], unixToTime(OpenweatherWeather.sys.sunrise).split(':')[0], OpenweatherWeather.clouds.all)
        
        if (ImgExists(skyImgName) === true)
        { embed.setImage('https://raw.githubusercontent.com/BBpezsgo/DiscordBot/main/source/commands/weatherImages/' + skyImgName + '.jpg') }
        else
        { embed.addFields([{ name: 'ImgCode', value: skyImgName, inline: false }]) }
        */
    }

    /*
    for (let i = 0; i < MsnWeather.forecast.length; i++) {
        const Element = MsnWeather.forecast[i]
        
        const skyIcon = weatherSkytextIcon(Element.skytextday, false)
        const skyTxt = weatherSkytxt(Element.skytextday)

        const tempMinValue = Element.low

        const tempMaxValue = Element.high
        const tempMaxIcon = weatherTempIcon(tempMaxValue)

        var text = ''

        if (Element.precip !== undefined && Element.precip !== '0')
        { text += `\n${EmojiPrefix}☔ ${Element.precip} %` }

        text += `\n${EmojiPrefix}${tempMaxIcon} ${tempMinValue} - ${tempMaxValue} °C`
        
        text += `\n${EmojiPrefix}${skyIcon} ${skyTxt}`

        const dayNameText = dayName(new Date().getDay() + i - 1)

        if (i > 1 && i < MetAlerts.length) {
            if (MetAlerts[i-1] !== null) {
                if (MetAlerts[i-1].alerts.length > 0) {
                    
                    for (let j = 0; j < MetAlerts[i-1].alerts.length; j++) {
                        const alert = MetAlerts[i-1].alerts[j]
                        var result = ''
                        
                        if (MetAlert_TypeIcons[alert.typeIcon] !== undefined) {
                            result += `${EmojiPrefix}${MetAlert_TypeIcons[alert.typeIcon]} `
                        } else {
                            result += `||${alert.typeIcon}|| `
                        }
                        
                        if (MetAlert_DegreeIconNames[alert.degreeIcon] !== undefined) {
                            result += `${MetAlert_DegreeIconNames[alert.degreeIcon]} `
                        } else {
                            result += `||${alert.degreeIcon}|| `
                        }

                        if (MetAlert_TypeNames[alert.Name.toLowerCase()] !== undefined) {
                            result += MetAlert_TypeNames[alert.Name.toLowerCase()].toLowerCase()
                        } else {
                            result += alert.Name.toLowerCase()
                        }

                        text += '\n' + result
                    }
                }
            }
        }

        embed.addFields([{
            name: dayNameText,
            value: text.trim(),
            inline: true
        }])
    }
    */

    /*
    embed.addFields({
        name: '\n📈 Grafikon:',
        value: 'Minimum-, maximum hőmérséklet és csapadék',
        inline: false
    })
    */

    embed.setTimestamp(Date.parse(OpenweatherWeather.dt))    
    // embed.setThumbnail('attachment://graph.png')
    embed.setThumbnail(weatherThumbnailUrl(weatherSkytextIcon(OpenweatherWeather.weather[0].id, true)))
    const MsnFooter = ((msnIsCache === true) ? '📁' : '') + 'weather.service.msn.com'
    const OpenweathermapFooter = ((openweathermapWeatherIsCache === true) ? '📁' : '') + 'openweathermap.org'
    embed.setFooter({ text: `${OpenweathermapFooter}` })
    embed.setImage('attachment://graph.png')
    return embed
}

function GetMarsPressureIcon(pressure, averagePressure) {
    if (averagePressure == 0) {
        return ''
    } else {
        if (pressure-5 > averagePressure) {
            return `${EmojiPrefix}🔺 `
        } else if (pressure+5 < averagePressure) {
            return `${EmojiPrefix}🔻 `
        }
        return `${EmojiPrefix}◼️ `
    }
}

function GetSeason(season) {
    var seasonName = season
    if (seasons[seasonName] != undefined) {
        seasonName = `${EmojiPrefix}${seasons[seasonName].icon} ${seasons[seasonName].name}`
    }
    return seasonName
}

/** @param {string} date YYYY-MM-DD */
function DateToDate(date) {
    var newDate = new Date()
    newDate.setFullYear(date.split('-')[0], Number.parseInt(date.split('-')[1]) - 1, date.split('-')[2])
    return newDate
}

/** @param {NASA.NasaMars.WeatherResult} data @param {NASA.NasaMars.WeeklyImagesResult} weeklyImage */
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
    } catch (ex) {
        LogError(ex)
    }

    const latestSol = data.sols[data.sols.length - 1]
    
    embed
        .setTitle(`sol ${latestSol.sol}`)
        .setDescription(
            `${EmojiPrefix}🌡️ ${latestSol.min_temp} - ${latestSol.max_temp} °C\n` +
            `${GetMarsPressureIcon(latestSol.pressure, averagePressure)} ${latestSol.pressure} pHa légnyomás\n` +
            `${GetSeason(latestSol.season)}\n` +
            `${EmojiPrefix}🌍 Földi dátum: <t:${ToUnix(DateToDate(latestSol.terrestrial_date))}:d> ||${latestSol.terrestrial_date}||` +

            '\n\n☀️ **Nap:**\n\n' +

            `${EmojiPrefix}🌇 Napkelte: ${latestSol.sunrise}\n` +
            `${EmojiPrefix}🌆 Napnyugta: ${latestSol.sunset}\n\n` +

            '🗓️ **Előző sol-ok:**')

    data.sols.forEach(sol => {
        if (latestSol.sol != sol.sol) {
            embed.addFields([{
                name: 'Sol ' + sol.sol,
                value: `${EmojiPrefix}🌡️ ` + sol.min_temp + ' - ' + sol.max_temp + ' C°\n' + 
                    GetSeason(sol.season),
                inline: true
            }])
        }
    })

    embed
        .setTimestamp(DateToDate(latestSol.terrestrial_date))
        .setFooter({ text: 'Mars 2020' })
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

        Openweathermap.OpenweathermapWeather()
            .then(openweathermapWeather => {
                Openweathermap.OpenweathermapPollution()
                    .then(async openweathermapPollution => {
                        const MoonPhases = [
                            new MoonPhase(addDays(new Date(year, month, day), -1)),
                            new MoonPhase(new Date(year, month, day)),
                            new MoonPhase(addDays(new Date(year, month, day), 1)),
                            new MoonPhase(addDays(new Date(year, month, day), 2)),
                            new MoonPhase(addDays(new Date(year, month, day), 3))
                        ]
    
                        /** @type {WeatherAlertsService.MET.ResultCounty[]} */
                        var alerts = []
    
                        try
                        { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'Today')) }
                        catch (e)
                        { alerts.push(null) }
    
                        try
                        { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'Tomorrow')) }
                        catch (e)
                        { alerts.push(null) }
    
                        try
                        { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'ThirdDay')) }
                        catch (e)
                        { alerts.push(null) }
    
                        try
                        { alerts.push(await WeatherAlertsService.GetCountyAlerts('Bekes', 'FourthDay')) }
                        catch (e)
                        { alerts.push(null) }
    
                        const embed = getEmbedEarth(openweathermapWeather, MoonPhases, openweathermapPollution.list[0], alerts, false, openweathermapWeather.fromCache, await WeatherAlertsService.GetSnowReport())
                        /*
                        try {
                            const attachmentPath = await CreateGraph(msnWeather[0], openweathermapWeather, MoonPhases)
                            command.editReply({ embeds: [embed],
                                files: [{
                                    attachment: attachmentPath,
                                    name: 'graph.png'
                                }]
                            })
                        } catch (error) {
                            LogError(error)
                            command.editReply({ embeds: [embed] })
                        }
                        */
                        command.editReply({ embeds: [embed] })
                    })
                    .catch(openweathermapPollutionError => {
                        LogError(openweathermapPollutionError)
                        command.editReply({ content: '> \\❌ ' + openweathermapPollutionError })
                    })
            })
            .catch(openweathermapWeatherError => {
                LogError(openweathermapWeatherError)
                command.editReply({ content: '> \\❌ ' + openweathermapWeatherError })
            })
    } else {
        NASA.NasaMarsWeather()
            .then(weatherData => {
                NASA.NasaMarsWeeklyImage()
                    .then(bodyImage => {
                        command.editReply({ embeds: [ getEmbedMars(weatherData, bodyImage)] })
                    })
                    .catch(error => {
                        LogError(error)
                        command.editReply({ content: '> \\❌ ' + error })
                    })
            })
            .catch(error => {
                LogError(error)
                command.editReply({ content: '> \\❌ ' + error })
            })
    }
}
