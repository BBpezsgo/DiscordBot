// @ts-check

/**
 * @type {('-' |
 * {
 *   id: string
 *   displayName: string
 *   index?: number
 *   childs?: {
 *     id: string
 *     displayName: string
 *     index?: number
 *     parentIndex?: number
 *   }[]
 * })[]}
 */
const items = [
    {
        id: 'status',
        displayName: str_menu.status,
    },
    {
        id: 'process',
        displayName: str_menu.process,
    },
    {
        id: 'log-error',
        displayName: str_menu.logErrors,
    },
    '-',
    {
        id: 'application',
        displayName: str_menu.application,
        childs: [
            {
                id: 'application',
                displayName: str_menu.application,
            },
            {
                id: 'application-commands',
                displayName: str_menu.commands,
            },
        ],
    },
    '-',
    {
        id: 'database',
        displayName: str_menu.database,
    },
    {
        id: 'firebase',
        displayName: str_menu.firebase,
    },
    '-',
    {
        id: 'cache-users',
        displayName: str_menu.cacheUsers,
    }
]

/** @param {(result: { id: string, iconUrl: string, name: string }[]) => void} callback */
function GetGuilds(callback) {
    var xmlHttp =  new XMLHttpRequest()
    xmlHttp.open('GET', '/dcbot/guilds.json')
    xmlHttp.onloadend = (e) => { if (xmlHttp.status == 200) callback(JSON.parse(xmlHttp.responseText)) }
    xmlHttp.send(null)
}

var map = new Array()

function menuInit() {
    let index = -1
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (typeof item === 'string') continue
        index++
        item.index = index
        if (item.childs) for (let j = 0; j < item.childs.length; j++) {
            const child = item.childs[j]
            index++
            child.parentIndex = item.index
            child.index = index
            item.childs[j] = child
        }
        items[i] = item
    }
}

/**
 * @param {{
*     id: string
 *    displayName: string
 *    index?: number
 *    childs?: {
 *        id: string;
 *        displayName: string
 *        index?: number
 *    }[]
 * }} item
 */
function AddElement(item) {
    let display = 'block'
    let className = "dot1"

    const haveIcon = ['application','cache-emojis','database','firebase','log-error','moderating','process','status','testing','cache-users'].includes(item.id)

    const newOL = document.createElement('ol')
    newOL.id = `ol${item.index}`
    newOL.className = className
    newOL.style.display = display
    newOL.onclick = (e) => {
        newA.click()
    }
    document.getElementsByTagName('menu')[0].appendChild(newOL)

    if (haveIcon) {
        const newIMG = document.createElement('img')
        newIMG.src = `/images/menu-icons/${item.id}.svg`
        newOL.appendChild(newIMG)
    }

    const newA = document.createElement('a')
    newA.id = `a${item.index}`
    newA.href = `/dcbot/view/${item.id}.html`
    newA.target = 'mainFrame'
    newA.className = 'L1'
    newA.setAttribute('data', `${item.index}`)
    newA.onclick = (e) => {
        /** @type {HTMLElement} */
        const target = e.target
        const index = Number.parseInt(target.getAttribute('data'))
        doClick(index)
    }
    newOL.title = item.displayName
    newOL.appendChild(newA)

    if (item.id === 'log-error') {
        const newIMG = document.createElement('div')
        newIMG.id = 'status-icon-error'
        newIMG.className = 'status-icon'
        newOL.appendChild(newIMG)
    }

    if (item.childs) for (let i = 0; i < item.childs.length; i++) {
        const child = item.childs[i]
        const childOL = AddElement(child)
        childOL.style.display = 'none'
    }

    return newOL
}

function menuDisplay() {
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (typeof item === 'string') {
            const newOL = document.createElement('hr')
            newOL.id = `hr${i}`
            document.getElementsByTagName('menu')[0].appendChild(newOL)
            continue
        }

        AddElement(item)
    }

    GetGuilds(guilds => {
        guilds.forEach(guild => {
            const newOL = document.createElement('ol')
            newOL.id = `guild-ol${guild.id}`
            newOL.className = 'dot1'
            newOL.style.display = 'block'
            newOL.style.backgroundImage = 'url(\'' + guild.iconUrl + '\')'
            newOL.style.backgroundPosition = 'center'
            newOL.style.backgroundSize = 'cover'
            newOL.onclick = (e) => {
                newA.click()
            }
            document.getElementsByTagName('menu')[0].appendChild(newOL)
        
            const newA = document.createElement('a')
            newA.id = `guild-a${guild.id}`
            newA.href = `/dcbot/view/Moderating.html/Search?id=${guild.id}`
            newA.target = 'mainFrame'
            newA.className = 'L1'
            newA.setAttribute('data', `guild-${guild.id}`)
            newA.onclick = (e) => {
                collapseAll()
                UnselectAll()
                /** @type {HTMLElement} */
                const target = e.target
                const guild = target.getAttribute('data').split('-')[1]
                document.getElementById('guild-ol' + guild).classList.add('selected')
            }
            newOL.title = guild.name
            newOL.appendChild(newA)
        })
    })
}


function UnselectAll() {
    const elements = document.getElementsByClassName('selected')
    for (let i = 0; i < elements.length; i++) {
        const element = elements.item(i)
        element.classList.remove('selected')
    }
}

function collapseAll() {
    for (var i = 0; i < items.length; i++) {
        const item = items[i]
        if (typeof item === 'string') continue
        if (!item.childs) continue
        for (let j = 0; j < item.childs.length; j++) {
            const child = item.childs[j]
            try { document.getElementById('ol' + child.index).style.display = "none" }
            catch (error) { }
        }
        try {
            if (document.getElementById('ol' + item.index).classList.contains("minus")) {
                document.getElementById('ol' + item.index).className = "plus"
            }
        } catch (ex) {
            continue
        }
    }
    for (var i = 0; i < document.links.length; i++) {
        document.links[i].className = "L1"
    }
}

/** @param {number} i */
function expandBranch(i) {
    const item = GetItem(i)
    if (!item) return
    if (typeof item === 'string') return
    if (!item.childs) return
    for (let j = 0; j < item.childs.length; j++) {
        const child = item.childs[j]
        document.getElementById('ol' + child.index).style.display = 'block'
    }
}

/**
 * @returns {({
 *  id: string
 *  displayName: string
 *  index?: number
 *  parentIndex?: undefined
 *  childs?: {
 *   id: string
 *   displayName: string
 *   index?: number
 *   parentIndex?: number
 *  }[]
 * } | {
 *   id: string
 *   displayName: string
 *   index?: number
 *   parentIndex?: number
 *   childs?: undefined
 *  })}
 * @param {number} index
 */
function GetItem(index) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (typeof item === 'string') continue
        if (item.index === index) return item
        if (item.childs) for (let j = 0; j < item.childs.length; j++) {
            const child = item.childs[j]
            if (child.index === index) return child
        }
    }
}

/** @param {number} i */
function doClick(i) {
    const item = GetItem(i)
    if (!item) return
    if (typeof item === 'string') return

    collapseAll()
    UnselectAll()
    
    const obj = document.getElementById('ol' + item.index);
    if (obj.classList.contains("plus")) {
        document.getElementById('a' + (item.index + 1)).className = "L2"
    } else {
        document.getElementById('a' + item.index).className = "L2";
    }
    console.log('[Menu]', `doClick`, item)
    if (item.childs) {
        expandBranch(item.index)
        document.getElementById('ol' + (item.index + 1)).classList.add('selected')
    } else if (item.parentIndex) {
        expandBranch(item.parentIndex)
        document.getElementById('ol' + item.index).classList.add('selected')
    } else {
        document.getElementById('ol' + item.index).classList.add('selected')
    }

    if (!UrlExists(document.getElementById('a' + item.index).href)) {
        parent.window.frames["mainFrame"].src = ""
        parent.window.frames["mainFrame"].document.body.innerHTML = Page404
    }
}

const Page404 =
    `<table id="autoWidth" style="width: 100%;">` +
    `    <tbody>` +
    `        <tr>` +
    `           <td class="h1" colspan="3">` +
    `               The server is down` +
    `           </td>` +
    `        </tr>` +
    `    </tbody>` +
    `</table>`

/**
 * @param {string | URL} url
 */
function UrlExists(url) {
    try {
        var http = new XMLHttpRequest()
        http.open('HEAD', url, false)
        http.send()
        if (http.status != 404) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}