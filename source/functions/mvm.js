const https = require('https')
const fs = require('fs')
const jsdom = require('jsdom')

function ParseData(text) {
    const c = new jsdom.JSDOM(text)
    /** @type {HTMLTableElement} */
    const table = c.window.document.body.firstChild.firstChild
    const tBody = table.tBodies.item(0)
    var data = []
    for (let i = 0; i < tBody.rows.length; i++) {
        const row = tBody.rows.item(i)
        if (row.innerHTML === '<td colspan="3">Nem található bejegyzés.</td>') { break }
        const road = row.cells.item(0).textContent + ''
        const houses = row.cells.item(1).textContent + ''
        const time = row.cells.item(2).textContent + ''
        data.push({
            road: road,
            houses: houses,
            time: time
        })
    }
    return data
}

const ONE_DAY = (1000 * 60 * 60 * 24)
const start = new Date(Date.now())
const end = new Date(Date.now() + ONE_DAY*2)

function DateToCorrectString(date) { return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}` }

const authRequiredRes = "<?xml version='1.0' encoding='UTF-8'?>\n<partial-response id=\"j_id1\"><redirect url=\"/aram/pages/online/aramszunet.jsf\"></redirect></partial-response>"

/** @param {{viewState:string;cookies:never[]} | null} authValues */
function Get(authValues = null) {
    /*authValues = [
        "f5_cspm=1234;",
        "f5avraaaaaaaaaaaaaaaa_session_=IPJJNOAEMMAGGMNICEPFEFEEFPMCHHGEAAHMIDMLBBBEGABPMMEDDNNEGANMNHJLKCBDAELMBIHFPKKLCJPAEOIJOAGDJDDOBFEJJBEKCFOIFPMKPOMCLKHBKENHLGBF;",
        "f5avraaaaaaaaaaaaaaaa_session_=PDGHEAGDJPFAEOJOONPNOCKMGKFIIFNJMEPKEAMKOCAPKGNNPOJOJBAHIDFMANEIELKDIDICNIHEPCAEDAAANGAEAMLPDFENPEBEENODAOCKEACNHNKBOKIHONEOLJDN;",
        "f5_cspm=1234;",
        "JSESSIONID=9BB932E09004574DB7A02E2A250CD06C;",
        "TS01b114c6=01b458a3075b18ebfc4fb3a478f8887ebb27f9af713f8e554bd18ab2d47083ff728c95ad3f96d97678e10532810123ad35b1e8e9174b91e89625e261f94325cd2583f35763;",
        "BIGipServer~NKM~pool-nkmaram-prod=rd5o00000000000000000000ffff0a020115o17018;",
        "cookieAccept=true;",
        ".ASPXANONYMOUS=ttSviLhL2QEkAAAAYmE4NzllMzUtNjZlYi00MmNkLTlhYzItMzUzMzJjYzc5OTgw-jREidpa-0LuY7shhJowoj-Pj7w1;",
        "BIGipServer~NKM~pool-www_443=rd5o00000000000000000000ffff0a640211o443;",
        "f5avraaaaaaaaaaaaaaaa_session_=HPGKFONCIDPLGELOFLHLEKLBNMBDPFNIBPJOJOJJEJLDKANELJELAAILBFHIGEIAPNCDLHDDNPMCCJCLDJAAPADNANKKCAPDJJGCHPLMIHPCHMLKIJBJKJELPMDGAMOD;",
        "ASP.NET_SessionId=yv4gcthkwlpmmqhg3pv4vuz3;",
        "TS01be2081=01b458a307909ce3e888879b04d454442367267400b11cf742485f218ab4d433c263730307eff387de0304f4d74bf7624d8d9095a83b8c37906aba3ab67078ce0584c75e672b4ef53b9711f88a8e93700933ba2beb5607d762f81e1e91670319f4c25c108aef7876c6e9bdf31450140f3339774dd5c134286441618a3c897023c7b356c142e858d55543473401bf5f5c686e8ca707baf003c2c0c96ad38d0eeaa31d07c3af;",
        "f5avr0551801961aaaaaaaaaaaaaaaa_cspm_=EOBHIOAEIKAGOINIAIAOCKEEMNKCLHGECIHAKDNLABBEGABPNMEDDFNEGALMNHJLKCBCAELMHFDGHAOICJPAEOIJANMFMDJIHFALJPPJCFOIFPMLFHHJJMBBKENHLGID"
    ]*/
    console.log('MVM Get')
    return new Promise(((callback) => {
        if (!fs.existsSync('./cache/mvm/')) { fs.mkdirSync('./cache/mvm/') }
        if (false) {
            if (fs.existsSync('./cache/mvm/mvm.json')) {
                callback(JSON.parse(fs.readFileSync('./cache/mvm/mvm.json', { encoding: 'utf-8' })))
                return
            }
        }

        const formData =
            'javax.faces.partial.ajax=true&' +
            'javax.faces.source=aramszunetForm%3Aj_idt30&' +
            'javax.faces.partial.execute=aramszunetForm&' +
            'javax.faces.partial.render=aramszunetForm%3Agmap+aramszunetForm%3AaramszunetTable+aramszunetForm%3Afilters&' +
            'aramszunetForm%3Aj_idt30=aramszunetForm%3Aj_idt30&' +
            'aramszunetForm=aramszunetForm&' +
            'aramszunetForm%3Atelepules_focus=&' +
            'aramszunetForm%3Atelepules_input=B%C3%A9k%C3%A9scsaba&' +
            `aramszunetForm%3AstartDate_input=${DateToCorrectString(start)}&` +
            `aramszunetForm%3AendDate_input=${DateToCorrectString(end)}&` +
            'aramszunetForm%3AaramszunetTable_rppDD=10&' +
            `javax.faces.ViewState=${(authValues === null) ? "-0000000000000000000:-0000000000000000000" : authValues.viewState}`

        const req = https.request({
            host: 'www.mvmnext.hu',
            path: '/aram/pages/online/aramszunet.jsf',
            headers: {
                "accept": "application/xml, text/xml, */*; q=0.01",
                "accept-language": "en,hu-HU;q=0.9,hu;q=0.8",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "faces-request": "partial/ajax",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": (authValues === null) ? null : authValues.cookies.join(' '),
                "Referer": "https://www.mvmnext.hu/",
                "Referrer-Policy": "strict-origin"
            },
            method: 'POST'
        }, (res) => {
            var data = ''
            res.on('data', (chunk) => {
                data += chunk.toString()
            })
            res.on('end', async () => {
                // fs.writeFileSync('./cache/mvm/raw.html', data, 'utf-8')
                // fs.writeFileSync('./cache/mvm/raw.json', JSON.stringify(data), 'utf-8')
                // fs.writeFileSync('./cache/mvm/res.json', JSON.stringify(res.headers), 'utf-8')

                if (data === authRequiredRes) {
                    if (authValues !== null) {
                        throw new Error('MVM Auth Failed')
                    }
                    const newAuthValues = await Authorize()
                    var newAuthValues2 = {
                        viewState: newAuthValues.viewState,
                        cookies: []
                    }
                    for (let i = 0; i < newAuthValues.cookies.length; i++) {
                        var element = newAuthValues.cookies[i]
                        if (element.endsWith(';') !== true) {
                            element = element + ';'
                        }
                        newAuthValues2.cookies.push(element.split(';')[0] + ';')
                    }
                    Get(newAuthValues2)
                        .then((a) => { callback(a) })
                        .catch((err) => { throw err })
                    return
                }
                const dom = new jsdom.JSDOM(data)
                const a = dom.window.document.body.firstElementChild.firstElementChild.childNodes[2].innerHTML
                const parsedData = ParseData(a)
                fs.writeFileSync('./cache/mvm/data.json', JSON.stringify(parsedData, null, ' '), 'utf-8')
                callback(parsedData)
            })
        })

        req.on('error', (error) => {
            throw error
        })

        req.end(formData)
    }))
}

/** @returns {Promise<{viewState:string,cookies:string[]}>} */
function Authorize() {
    console.log('MVM Auth')
    return new Promise(((callback) => {
        if (!fs.existsSync('./cache/mvm/')) { fs.mkdirSync('./cache/mvm/') }
        
        const req = https.request({
            host: 'www.mvmnext.hu',
            path: '/aram/pages/online/aramszunet.jsf',
            headers: {
                
            },
            method: 'GET'
        }, (res) => {
            var data = ''
            res.on('data', (chunk) => {
                data += chunk.toString()
            })
            res.on('end', () => {
                // fs.writeFileSync('./cache/mvm/auth-raw.html', data, 'utf-8')
                // fs.writeFileSync('./cache/mvm/auth-raw.json', JSON.stringify(data), 'utf-8')
                // fs.writeFileSync('./cache/mvm/auth-cookies.json', JSON.stringify(res.headers['set-cookie']), 'utf-8')
                const dom = new jsdom.JSDOM(data)
                const viewState = dom.window.document.getElementById('j_id1:javax.faces.ViewState:0').value
                const setCookie = res.headers['set-cookie']
                if (setCookie === undefined) {
                    throw new Error('MVM Auth failed')
                }
                callback({ viewState: viewState, cookies: setCookie })
            })
        })

        req.on('error', (error) => {
            throw error
        })

        req.end()
    }))
}

module.exports = { Get }
