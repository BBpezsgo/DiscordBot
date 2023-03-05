const MenuList = [
    {
        url: "Status",
        displayLevel: 0,
        directoryLevel: 0,
        name: str_menu.status,
    },
    {
        url: "Process",
        displayLevel: 0,
        directoryLevel: 0,
        name: str_menu.process,
    },
    {
        url: "LogError",
        displayLevel: 0,
        directoryLevel: 1,
        name: str_menu.log,
    },
    {
        url: "LogError",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.logErrors,
    },
    {
        url: "LogSystem",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.logSystem,
    },
    {
        url: "LogHandlebars",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.logHandlebars,
    },
    {
        url: "CacheEmojis",
        displayLevel: 0,
        directoryLevel: 1,
        name: str_menu.cache,
    },
    {
        url: "CacheEmojis",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.cacheEmojis,
    },
    {
        url: "CacheUsers",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.cacheUsers,
    },
    {
        url: "CacheChannels",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.cacheChannels,
    },
    {
        url: "CacheServers",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.cacheServers,
    },
    {
        url: "Application",
        displayLevel: 0,
        directoryLevel: 1,
        name: str_menu.application,
    },
    {
        url: "Application",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.application,
    },
    {
        url: "ApplicationCommands",
        displayLevel: 0,
        directoryLevel: 2,
        name: str_menu.commands,
    },
    {
        url: "Moderating",
        displayLevel: 0,
        directoryLevel: 0,
        name: str_menu.moderating,
    },
    {
        url: "Database",
        displayLevel: 0,
        directoryLevel: 0,
        name: str_menu.database,
    },
    {
        url: "Testing",
        displayLevel: 0,
        directoryLevel: 0,
        name: str_menu.testing,
    }
]

const menuList = new Array(
    //	url							display	level			string
    //	url:	url to visite when click on this menu item. it's not full path, but only filename.
    //		if it's not null, must be one and only; else if it's null, that means it has branches, and the actual url is the one of its first visitable branches.
    //	display: must be 0. 
    //	directory level: 0: directory has no branches;  1: directory level 1;  2:level 2;   and so on
    
    // Status
    "status", 0, 0, str_menu.status,
    // Process
    "process", 0, 0, str_menu.process,
    // Logs
    "log-error", 0, 0, str_menu.logErrors,
    // "log-system", 0, 2, str_menu.logSystem,
    // "log-handlebars", 0, 2, str_menu.logHandlebars,
    "---", 0, 0, "---",

    // Cache
    "cache-emojis", 0, 1, str_menu.cache,
    "cache-emojis", 0, 2, str_menu.cacheEmojis,
    "cache-users", 0, 2, str_menu.cacheUsers,
    "cache-channels", 0, 2, str_menu.cacheChannels,
    "cache-servers", 0, 2, str_menu.cacheServers,
    // Application
    "application", 0, 1, str_menu.application,
    "application", 0, 2, str_menu.application,
    "application-commands", 0, 2, str_menu.commands,
    // Moderating
    // "moderating", 0, 0, str_menu.moderating,

    "---", 0, 0, "---",

    // Database
    "database", 0, 0, str_menu.database,

    // "---", 0, 0, "---",

    // Testing
    // "testing", 0, 0, str_menu.testing,
)

/** @param {(result: { id: string, iconUrl: string, name: string }[]) => void} callback */
function GetGuilds(callback) {
    var xmlHttp =  new XMLHttpRequest()
    xmlHttp.open('GET', '/dcbot/guilds.json')
    xmlHttp.onloadend = (e) => { if (xmlHttp.status == 200) callback(JSON.parse(xmlHttp.responseText)) }
    xmlHttp.send(null)
}

var map = new Array()

function menuInit() {
    for (var n = 0; n < menuList.length; n += 4) {
        menuList[n + 1] = 1
    }
        
    n = menuList.length - 4;
    var url = "";
    var level = 0;
    while (n >= 0) {
        if (menuList[n + 1] == 1 && menuList[n + 2] > 0) {
            url = menuList[n];
            level = menuList[n + 2];
        }
        else if (menuList[n + 2] > 0 && menuList[n + 2] < level) {
            menuList[n] = url;
            menuList[n + 1] = 1;
            level = menuList[n + 2];
        }
        n -= 4;
    }
}

function menuDisplay() {
    var i = 0;
    var className;
    for (var n = 0; n < menuList.length; n += 4) {
        if (menuList[n + 1] != 1) {
            continue;
        }
        if (menuList[n + 2] == 0) {
            className = "dot1";
            display = "block";
        } else if ((menuList[n + 2] > 0) && (menuList[n + 4 + 2] > menuList[n + 2])) {
            className = "plus";
            if (menuList[n + 2] == 1) {
                display = "block";
            }
            else {
                display = "none";
            }
        } else {
            className = "dot2";
            display = "none";
        }
        var power = (menuList[n + 2] > 0) ? (menuList[n + 2] - 1) : 0;
        
        if (menuList[n] === '---') {
            const newOL = document.createElement('hr')
            newOL.id = `hr${i}`
            document.getElementsByTagName('menu')[0].appendChild(newOL)
        } else {
            const haveIcon = ['application','cache-emojis','database','log-error','moderating','process','status','testing'].includes(menuList[n])

            const newOL = document.createElement('ol')
            newOL.id = `ol${i}`
            newOL.className = className
            newOL.style.display = display
            newOL.onclick = (e) => {
                newA.click()
            }
            document.getElementsByTagName('menu')[0].appendChild(newOL)

            if (haveIcon) {
                const newIMG = document.createElement('img')
                newIMG.src = `/images/menu-icons/${menuList[n]}.svg`
                newOL.appendChild(newIMG)
            }

            const newA = document.createElement('a')
            newA.id = `a${i}`
            newA.href = `/dcbot/view/${menuList[n]}.html`
            newA.target = 'mainFrame'
            newA.className = 'L1'
            newA.setAttribute('data', `${i}-${n}`)
            newA.onclick = (e) => {
                /** @type {HTMLAnchorElement} */
                const target = e.target
                doClick(Number.parseInt(target.getAttribute('data').split('-')[0]), Number.parseInt(menuList[target.getAttribute('data').split('-')[1]]))
            }
            newOL.title = menuList[n + 3]
            newOL.appendChild(newA)

            if (menuList[n] === 'log-error') {
                const newIMG = document.createElement('div')
                newIMG.id = 'status-icon-error'
                newIMG.className = 'status-icon'
                newOL.appendChild(newIMG)
            }
        }

        //added by zqq,07.11.1
        //map.push(menuList[n+2]);
        map[map.length] = menuList[n + 2];
        i++;
    }

    GetGuilds(guilds => {
        if (guilds.length > 0) {
            const newOL = document.createElement('hr')
            newOL.id = `hr${i}`
            document.getElementsByTagName('menu')[0].appendChild(newOL)
        }
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

                /** @type {HTMLAnchorElement} */
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
    const l = menuList.length / 4 //document.getElementsByTagName('ol').length
    for (var i = 0; i < l; i++) {
        try {
            if (map[i] > 1) {
                document.getElementById('ol' + i).style.display = "none";
            }
            if (document.getElementById('ol' + i).classList.contains("minus")) {
                document.getElementById('ol' + i).className = "plus";
            }
        } catch (ex) {
            continue
        }
    }
    for (var i = 0; i < document.links.length; i++) {
        document.links[i].className = "L1";
    }
}

function expandBranch(n) {
    var branch;
    var l = 0;
    var index;
    while (l != 1) {
        branch = document.getElementById('ol' + n);
        l = map[n];
        index = n;
        if (branch.classList.contains("plus")) {
            branch.className = "minus";
        }
        else {
            while (1) {
                if (map[index] != l - 1)
                    index--;
                else
                    break;
            }
            branch = document.getElementById('ol' + index);
            branch.className = "minus";
        }
        n = index;
        l = map[n];
        while (1) {
            index++;
            if (index >= map.length) {
                break;
            }
            branch = document.getElementById('ol' + index);
            if (map[index] == (l + 1)) {
                branch.style.display = "block";
            }
            else if (map[index] <= l) {
                break;
            }
        }
    }
}

/** @param {number} n @param {string} menuName */
function doClick(n, menuName) {
    collapseAll();
    UnselectAll();
    
    const obj = document.getElementById('ol' + n);
    if (obj.classList.contains("plus")) {
        document.getElementById('a' + (n + 1)).className = "L2";
    }
    else {
        document.getElementById('a' + n).className = "L2";
    }
    if (map[n] > 0) {
        expandBranch(n);
    }

    if (!UrlExists(document.getElementById('a' + n).href)) {
        parent.window.frames["mainFrame"].src = ""
        parent.window.frames["mainFrame"].document.body.innerHTML = Page404
    }

    if (map[n] == 1) {
        document.getElementById('ol' + (n + 1)).classList.add('selected')
    } else {
        document.getElementById('ol' + n).classList.add('selected')
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

function UrlExists(url) {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}