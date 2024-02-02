const https = require('https')
const fs = require('fs')
const { JSDOM } = require('jsdom')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Path = require('path')

const baseUrl = 'https://www.met.hu'
const basePath = Path.join(CONFIG.paths.base, './cache/weather/')

const MaxTimeDifference = 1000 * 60
    * 10 // 10 minutes

async function Sleep(ms) {
    return new Promise((callback) => {
        setTimeout(() => {
            callback()
        }, ms)
    })
}

function SaveCache(cacheName, data) {
    if (!fs.existsSync(basePath)) { fs.mkdirSync(basePath, { recursive: true }) }
    SaveCacheRaw(cacheName, JSON.stringify({ date: Date.now(), data: data }, null, ' '))
}

/** @returns {{date: number, data: any}} */
function LoadCache(cacheName) {
    if (!fs.existsSync(basePath)) { fs.mkdirSync(basePath, { recursive: true }) }
    if (!fs.existsSync(Path.join(basePath, `${cacheName}.json`))) {
        fs.writeFileSync(Path.join(basePath, `${cacheName}.json`), JSON.stringify({ date: 0, data: null }, null, ' '), { encoding: 'utf-8' })
        return { date: 0, data: null }
    }
    return JSON.parse(fs.readFileSync(Path.join(basePath, `${cacheName}.json`), { encoding: 'utf-8' }))
}

function SaveCacheRaw(cacheName, rawData) {
    if (!fs.existsSync(basePath)) { fs.mkdirSync(basePath, { recursive: true }) }
    fs.writeFileSync(Path.join(basePath, `${cacheName}.json`), rawData)
}

const UrlPaths = {
    Warnings: {
        Main: baseUrl + '/en/idojaras/veszelyjelzes/index.php?c=',
        County: baseUrl + '/idojaras/veszelyjelzes/hover.php?lng=en&',
    },
    SnowReport: baseUrl + '/en/idojaras/aktualis_idojaras/hojelentes/main.php',
    MainWeather: baseUrl + '/en/idojaras/aktualis_idojaras/mert_adatok/main.php?v=Bekescsaba&c=tablazat'
}

const CountyDays = {
    'Today': 'wbex',
    'Tomorrow': 'wcex',
    'ThirdDay': 'wdex',
    'FourthDay': 'weex',
}

const CountyIDs = {
    'Baranya': 2,
    'BacsKiskun': 3,
    'Bekes': 4,
    'BorsodAbaujZemplen': 5,
    'CsongradCsanad': 6,
    'Fejer': 7,
    'GyorMosonSopron': 8,
    'HajduBihar': 9,
    'Heves': 10,
    'KomaromEsztergom': 11,
    'Nograd': 12,
    'Pest': 13,
    'Somogy': 14,
    'SzabolcsSzatmarBereg': 15,
    'JaszNagykunSzolnok': 16,
    'Tolna': 17,
    'Vas': 18,
    'Veszprem': 19,
    'Zala': 20
}

const Pages = {
    'Main': 'a',
    'Today': 'b',
    'Tomorrow': 'c',
    'ThirdDay': 'd',
    'FourthDay': 'e'
}

async function DownloadAsync(url) {
    return new Promise((callback) => {
        https.get(url, (res) => {
            let data = ''
            res.on('data', (d) => { data += d })
            res.on('end', () => { callback(data) })
        }).on('error', (e) => { console.error(e) })
    })
}

/**
 * @param {string} data
 */
function ProcessData(data) {
    const dom = new JSDOM(data)
    const eventsListElement = dom.window.document.querySelector("body > div > div.content > div.left")
    const data_ = []
    eventsListElement.childNodes.forEach((child) => {
        if (child.nodeType === child.ELEMENT_NODE) {
            if (child.nodeName === 'TABLE') {
                /** @type {JSDOM.HTMLTableElement} */
                const x = child
                const caption = x.querySelector('caption:first-child').textContent
                const countyName = caption.replace('County ', '').trim()
                const tableBody = x.querySelector('tbody')
                const rows = tableBody.querySelectorAll('tr')
                const alerts = []
                for (let i = 0; i < rows.length; i++) {
                    if (i === 0) { continue }
                    const row = rows[i]
                    if (row.innerHTML === '<td colspan=3>&nbsp;No warnings issued</td>') { break }
                    /** @type {JSDOM.HTMLTableCellElement} */
                    const cell0 = row.querySelector('td:nth-child(1)')
                    /** @type {JSDOM.HTMLTableCellElement} */
                    const cell1 = row.querySelector('td:nth-child(2)')
                    /** @type {JSDOM.HTMLTableCellElement} */
                    const cell2 = row.querySelector('td:nth-child(3)')
                    /** @type {JSDOM.HTMLTableCellElement} */
                    const cell3 = row.querySelector('td:nth-child(4)')
    
                    alerts.push({
                        type: cell0.title,
                        degree: cell1.title.split(':')[1].trim(),
                        title: cell2.textContent,
                        description: cell3.textContent
                    })
                }

                data_.push({
                    countyName: countyName,
                    alerts: alerts
                })
            }
        }
    })
    return data_
}

/**
 * @param {string} data
 */
function ProcessCountyData(data) {
    let kiadva = '?'
    const alerts = []

    const xd2 = new JSDOM(data).window.document
    const kiadva0 = xd2.querySelector('body > div.kt-friss > div')
    if (kiadva0 !== null) {
        kiadva = kiadva0.textContent.replace('Kiadva: ', '').trim()
    }
    const table = xd2.querySelector('table')
    if (table !== null) {
        const rows = table.querySelectorAll('tr')
        for (let i = 0; i < rows.length; i++) {
            if (i === 0) { continue }
            const row = rows[i]
            /** @type {JSDOM.HTMLTableCellElement | null} */
            const Cell0 = row.querySelector('td:nth-child(1)')
            /** @type {JSDOM.HTMLTableCellElement | null} */
            const Cell1 = row.querySelector('td:nth-child(2)')
            /** @type {JSDOM.HTMLTableCellElement | null} */
            const Cell2 = row.querySelector('td:nth-child(3)')
            try {
                alerts.push({
                    typeIcon: Cell0.querySelector('img').src.split('/')[3],
                    degreeIcon: Cell1.querySelector('img').src.split('/')[3],
                    Name: Cell2.textContent,
                })
            } catch (e) { }
        }
    }
    return {
        kiadva: new Date(Date.parse(kiadva)),
        alerts: alerts
    }
}

async function CreateSnapshotAsync() {
    const snapshot = 'snapshot-' + Date.now() + '/'
    fs.mkdirSync(Path.join(basePath, snapshot))
    
    const Func0 = async function(page) {
        try {
            const data = await DownloadAsync(UrlPaths.Warnings.Main + page)
            fs.writeFileSync(Path.join(basePath, snapshot + 'page-' + page + '.html'), data, 'utf8')
            fs.writeFileSync(Path.join(basePath, snapshot + 'page-' + page + '.json'), JSON.stringify(ProcessData(data), undefined, ' '), 'utf8')    
        } catch (error) {
            fs.writeFileSync(Path.join(basePath, snapshot + 'page-' + page + '-error.json'), JSON.stringify(error, undefined, ' '), 'utf8')    
        }
    }
    
    const Func1 = async function(countyID) {
        try {
            const data = await DownloadAsync(UrlPaths.Warnings.County + 'id=' + CountyDays.Today + '&kod=' + countyID)
            fs.writeFileSync(Path.join(basePath, snapshot + 'county-' + countyID + '.html'), data, 'utf8')
            fs.writeFileSync(Path.join(basePath, snapshot + 'county-' + countyID + '.json'), JSON.stringify(ProcessCountyData(data), undefined, ' '), 'utf8')    
        } catch (error) {
            fs.writeFileSync(Path.join(basePath, snapshot + 'county-' + countyID + '-error.json'), JSON.stringify(error, undefined, ' '), 'utf8')    
        }
    }

    await Func0(Pages.Main)
    await Sleep(500)
    await Func0(Pages.Today)
    await Sleep(500)
    await Func0(Pages.Tomorrow)
    await Sleep(500)
    await Func0(Pages.ThirdDay)
    await Sleep(500)
    await Func0(Pages.FourthDay)
    await Sleep(500)

    for (let i = 2; i <= 20; i++) {
        await Func1(i)
        await Sleep(500)
    }

    console.log('Done')
}

/** @param {string} page */
async function GetMainAlerts(page) {
    const dataRaw = await DownloadAsync(UrlPaths.Warnings.Main + Pages[page])
    const data = ProcessData(dataRaw)
    SaveCache(page, { url: UrlPaths.Warnings.Main + Pages[page], data: data })
    return data
}

/** @param {string} countyID @param {string} day */
async function GetCountyAlerts(countyID, day) {
    const dataRaw = await DownloadAsync(UrlPaths.Warnings.County + 'id=' + CountyDays[day] + '&kod=' + CountyIDs[countyID])
    const data = ProcessCountyData(dataRaw)
    SaveCache(`${countyID}-${day}`, { url: UrlPaths.Warnings.County + 'id=' + CountyDays[day] + '&kod=' + CountyIDs[countyID], data: data })
    return data
}

async function GetMainWeather(forceDownload = false) {
    const cache = LoadCache('main-weather')

    if (forceDownload) { }
    else if (Date.now() - cache.date < MaxTimeDifference)
    { return cache.data }

    const dataRaw = await DownloadAsync(UrlPaths.MainWeather)
    const doc_tbody = new JSDOM(dataRaw).window.document.body.querySelector('table.tbl-def1>tbody')
    const rows = doc_tbody.querySelectorAll('tr')
    let data = []
    rows.forEach((row, i) => {
        data[i] = {}
        data[i]['time'] = row.querySelector('th>a').textContent.trim()
        data[i]['time_stamp'] = new Date(data[i]['time']).getTime()
        row.querySelectorAll('td').forEach((c_, j) => {
            const cell = c_
            if (j === 0) {
                data[i]['temp'] = Number.parseInt(cell.textContent.trim())
            } else if (j === 2) {
                data[i]['wind_dir'] = cell.textContent.trim()
            } else if (j === 3) {
                data[i]['wind_sp'] = Number.parseInt(cell.textContent.trim())
            } else if (j === 4) {
                data[i]['gust'] = Number.parseInt(cell.textContent.trim())
            } else if (j === 5) {
                data[i]['pressure'] = Number.parseInt(cell.textContent.trim())
            } else if (j === 6) {
                data[i]['humidity'] = Number.parseInt(cell.textContent.trim())
            } else if (j === 7) {
                data[i]['precipitation'] = Number.parseFloat(cell.textContent.trim())
            }
        })
    })
    SaveCache(`main-weather`, data)
    return data
}

async function GetSnowReport(forceDownload = false) {
    const cache = LoadCache('snow-report')
    if (forceDownload) { }
    else if (Date.now() - cache.date < MaxTimeDifference)
    { return cache.data }
    const dataRaw = await DownloadAsync(UrlPaths.SnowReport)
    const tables = new JSDOM(dataRaw).window.document.body.querySelectorAll('.def-tbl.au, .def-tbl.mo')
    let data = []
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr')
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i]
            const cols = row.querySelectorAll('td')
            data[i-1] = {}
            data[i-1]['location'] = cols[0].textContent
            const depthInt = parseInt(cols[1].textContent)

            if(!isNaN(depthInt) && cols[1].textContent === '' + depthInt) {
                data[i-1]['depth'] = depthInt
            } else {
                data[i-1]['depth'] = cols[1].textContent
            }
        }
    })
    SaveCache('snow-report', data)
    return data
}

const Descriptions = {
    'ts1.gif': {
        icon: '',
        description: 'Figyelem! Zivatar alakulhat ki. Elsődleges veszélyforrást a villámlás jelent, emellett esetenként szélerősödés, jégeső előfordulhat!',
    },
    'ts2.gif': {
        icon: '',
        description: 'Veszély! Hevesebb zivatarok kialakulására lehet számítani. A villámlások mellett kockázatot jelent a zivatarokat kísérő szél, jégeső is!',
    },
    'ts3.gif': {
        icon: '',
        description: 'Fokozott veszély! Heves zivatarok várhatók! A zivatarokat kísérő szél, jégeső is jelentős kockázatot jelent!',
    },
    'rainstorm1.gif': {
        icon: '',
        description: 'Intenzív záporból, zivatarból rövid idő alatt 25-30 mm-t meghaladó csapadék hullhat.',
    },
    'rainstorm2.gif': {
        icon: '',
        description: 'Intenzív záporból, zivatarból rövid idő alatt 50 mm-t meghaladó csapadék hullhat.',
    },
    'wind1.gif': {
        icon: '',
        description: 'A várt legerősebb széllökések meghaladhatják a 70 km/h-t.',
    },
    'wind2.gif': {
        icon: '',
        description: 'A várt legerősebb széllökések meghaladhatják a 90 km/h-t.',
    },
    'wind3.gif': {
        icon: '',
        description: 'A várt legerősebb széllökések meghaladhatják a 110 km/h-t.',
    },
    'fzra1.gif': {
        icon: '',
        description: 'Gyenge ónos eső. A várt csapadékmennyiség általában néhány tized (> 0,1) mm.',
    },
    'fzra2.gif': {
        icon: '',
        description: 'Tartós (több órás) ónos eső. A várt csapadékmennyiség meghaladhatja az 1 mm-t.',
    },
    'fzra3.gif': {
        icon: '',
        description: 'Tartós (több órás) ónos eső. A várt csapadékmennyiség meghaladhatja az 5 mm-t.',
    },
    'snowdrift1.gif': {
        icon: '',
        description: 'Gyenge hófúvás. A friss hóval fedett területeken a szél alacsony hótorlaszokat emelhet.',
    },
    'snowdrift2.gif': {
        icon: '',
        description: 'Hófúvás. A friss hóval fedett területeken a viharos szél magas hótorlaszokat emelhet.',
    },
    'snowdrift3.gif': {
        icon: '',
        description: 'Erős hófúvás. A friss hóval fedett területeken a viharos szél több helyen jelentős hóakadályokat emel.',
    },
    'rain1.gif': {
        icon: '',
        description: '24 óra alatt több mint 20 mm csapadék hullhat.',
    },
    'rain2.gif': {
        icon: '',
        description: '24 óra alatt több mint 30 mm csapadék hullhat.',
    },
    'rain3.gif': {
        icon: '',
        description: '24 óra alatt több mint 50 mm csapadék hullhat.',
    },
    'snow1.gif': {
        icon: '',
        description: '12 óra alatt 5 cm-t meghaladó friss hó hullhat.',
    },
    'snow2.gif': {
        icon: '',
        description: '24 óra alatt 20 cm-t meghaladó friss hó hullhat.',
    },
    'snow3.gif': {
        icon: '',
        description: '24 óra alatt 30 cm-t meghaladó friss hó hullhat.',
    },
    'coldx1.gif': {
        icon: '',
        description: 'A hőmérséklet -15 °C alá csökkenhet.',
    },
    'coldx2.gif': {
        icon: '',
        description: 'A hőmérséklet -20 °C alá csökkenhet.',
    },
    'coldx3.gif': {
        icon: '',
        description: 'A hőmérséklet -25 °C alá csökkenhet.',
    },
    'hotx1.gif': {
        icon: '',
        description: 'A napi középhőmérséklet 25 °C felett alakulhat.',
    },
    'hotx2.gif': {
        icon: '',
        description: 'A napi középhőmérséklet 27 °C felett alakulhat.',
    },
    'hotx3.gif': {
        icon: '',
        description: 'A napi középhőmérséklet 29 °C felett alakulhat.',
    },
    'fog1.gif': {
        icon: '',
        description: 'Tartós (> 6 óra) sűrű köd (látástávolság pár száz méter) várható.',
    },
}

module.exports = {
    CountyIDs,
    Pages,
    CountyDays,
    GetMainAlerts,
    GetCountyAlerts,
    GetMainWeather,
    GetSnowReport,
    Descriptions,
}