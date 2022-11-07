const https = require('https')
const fs = require('fs')
const { JSDOM } = require('jsdom')

const baseUrl = 'https://www.met.hu'
const basePath = './weather-cache/'

async function Sleep(ms) {
    return new Promise((callback) => {
        setTimeout(() => {
            callback()
        }, ms)
    })
}

const UrlPaths = {
    'Main': '/en/idojaras/veszelyjelzes/index.php?c=',
    'County': '/idojaras/veszelyjelzes/hover.php?lng=en&'
}

const CountyDays = {
    'Today': 'wbex',
    'Tomorrow': 'wcex',
    'ThirdDay': 'wdex',
    'FourthDay': 'weex',
}

const FsSettings = {encoding:'utf-8'}

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
            var data = ''
            res.on('data', (d) => { data += d })
            res.on('end', () => { callback(data) })
        }).on('error', (e) => { console.error(e) })
    })
}

function ProcessData(data) {
    const dom = new JSDOM(data)
    const eventsListElement = dom.window.document.querySelector("body > div > div.content > div.left")
    const data_ = []
    eventsListElement.childNodes.forEach((child) => {
        if (child.nodeType === child.ELEMENT_NODE) {
            if (child.nodeName === 'TABLE') {
                /** @type {HTMLTableElement} */
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
                    /** @type {HTMLTableCellElement} */
                    const cell0 = row.querySelector('td:nth-child(1)')
                    /** @type {HTMLTableCellElement} */
                    const cell1 = row.querySelector('td:nth-child(2)')
                    /** @type {HTMLTableCellElement} */
                    const cell2 = row.querySelector('td:nth-child(3)')
                    /** @type {HTMLTableCellElement} */
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

function ProcessCountyData(data) {
    var kiadva = '?'
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
            /** @type {HTMLTableCellElement | null} */
            const Cell0 = row.querySelector('td:nth-child(1)')
            /** @type {HTMLTableCellElement | null} */
            const Cell1 = row.querySelector('td:nth-child(2)')
            /** @type {HTMLTableCellElement | null} */
            const Cell2 = row.querySelector('td:nth-child(3)')
            try {
                alerts.push({
                    typeIcon: Cell0.querySelector('img').src.split('/')[3],
                    degreeIcon: Cell1.querySelector('img').src.split('/')[3],
                    Name: Cell2.textContent
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
    fs.mkdirSync(basePath + snapshot)
    
    const Func0 = async function(page) {
        try {
            const data = await DownloadAsync(baseUrl + UrlPaths.Main + page)
            fs.writeFileSync(basePath + snapshot + 'page-' + page + '.html', data, FsSettings)
            fs.writeFileSync(basePath + snapshot + 'page-' + page + '.json', JSON.stringify(ProcessData(data), undefined, ' '), FsSettings)    
        } catch (error) {
            fs.writeFileSync(basePath + snapshot + 'page-' + page + '-error.json', JSON.stringify(error, undefined, ' '), FsSettings)    
        }
    }
    
    const Func1 = async function(countyID) {
        try {
            const data = await DownloadAsync(baseUrl + UrlPaths.County + 'id=' + CountyDays.Today + '&kod=' + countyID)
            fs.writeFileSync(basePath + snapshot + 'county-' + countyID + '.html', data, FsSettings)
            fs.writeFileSync(basePath + snapshot + 'county-' + countyID + '.json', JSON.stringify(ProcessCountyData(data), undefined, ' '), FsSettings)    
        } catch (error) {
            fs.writeFileSync(basePath + snapshot + 'county-' + countyID + '-error.json', JSON.stringify(error, undefined, ' '), FsSettings)    
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
    const dataRaw = await DownloadAsync(baseUrl + UrlPaths.Main + Pages[page])
    const data = ProcessData(dataRaw)
    fs.writeFileSync(basePath + `${page}.json`, JSON.stringify({ url: baseUrl + UrlPaths.Main + Pages[page], data: data }, undefined, ' '), { encoding: 'utf-8' })
    return data
}

/** @param {string} countyID @param {string} day */
async function GetCountyAlerts(countyID, day) {
    const dataRaw = await DownloadAsync(baseUrl + UrlPaths.County + 'id=' + CountyDays[day] + '&kod=' + CountyIDs[countyID])
    const data = ProcessCountyData(dataRaw)
    fs.writeFileSync(basePath + `${countyID}-${day}.json`, JSON.stringify({ url: baseUrl + UrlPaths.County + 'id=' + CountyDays[day] + '&kod=' + CountyIDs[countyID], data: data }, undefined, ' '), { encoding: 'utf-8' })
    return data
}

module.exports = { CountyIDs, Pages, CountyDays,  GetMainAlerts, GetCountyAlerts }