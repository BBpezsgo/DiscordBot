const https = require('https')
const jsdom = require('jsdom')

function ParseData(text) {
    const c = new jsdom.JSDOM(text)
    /** @type {HTMLTableElement} */
    const table = c.window.document.body.firstChild.firstChild
    const tBody = table.tBodies.item(0)
    var data = []
    for (let i = 0; i < tBody.rows.length; i++) {
        const row = tBody.rows.item(i)
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

const cookie = "f5_cspm=1234; f5avraaaaaaaaaaaaaaaa_session_=CGKEBHFNJOGAOJGLOBAIEPHPGJBGHOICHCEMABOPGFMIDPKNAIELBMMGAEGHDGMMKFEDMNNFEBHKGPGGOLAALOOCKNCGPNJJOIBPJPOPEKIHKCKPIHLJDHADMHLPOICE; f5avraaaaaaaaaaaaaaaa_session_=PDGHEAGDJPFAEOJOONPNOCKMGKFIIFNJMEPKEAMKOCAPKGNNPOJOJBAHIDFMANEIELKDIDICNIHEPCAEDAAANGAEAMLPDFENPEBEENODAOCKEACNHNKBOKIHONEOLJDN; f5_cspm=1234; JSESSIONID=A101AC4F7D6BEC02AC4279FC7CCFE176; TS01b114c6=01b458a307db3dea399284fd488c4ede397cd373f33f8e554bd18ab2d47083ff728c95ad3f96d97678e10532810123ad35b1e8e917c64e113be79ef4ded98edd133d6a0742; BIGipServer~NKM~pool-nkmaram-prod=rd5o00000000000000000000ffff0a020115o17018; cookieAccept=true; TS01be2081=01b458a307364bbdb4d325c95e75ae74d0905f3533dfd71692c3abefcfdda8e1df4f4c19bb874e3f4ce41ce74572cd128cb912f9bb5818b87a86ad39aa32dfc3b5c3d2122599786ca8a55183e0a97bb494dc594f8adf798e9be6029a726197637e359cddc332adb45c674cadb577093b723372df6f"

function Get() {
    return new Promise((callback => {
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
            'javax.faces.ViewState=6751913777512065158%3A7040039777374174289'

        https.request({
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
            "cookie": cookie,
            "Referer": "https://www.mvmnext.hu/",
            "Referrer-Policy": "strict-origin"
          },
          method: 'POST'
        }, (res) => {
            var data = ''
            res.on('data', (chunk) => {
                data += chunk.toString()
            })
            res.on('end', () => {
                const dom = new jsdom.JSDOM(data)
                const a = dom.window.document.body.firstElementChild.firstElementChild.childNodes[2].innerHTML
                callback(ParseData(a))
            })
        })
        .end(formData)
    })) 
}

module.exports = { Get }
