/** @type {(string | number)[]} */
const menuList = [
    "Startpage", 0, 0, 'Startpage',
    "---", 0, 0, "---",
    "Account", 0, 1, "Account",
    "Account", 0, 2, "User",
    "Applications", 0, 2, 'Applications',
]

var map = []

function menuInit() {
    for (let n = 0; n < menuList.length; n += 4) {
        menuList[n + 1] = 1
    }
        
    let n = menuList.length - 4
    let url = ""
    let level = 0
    while (n >= 0) {
        if (menuList[n + 1] == 1 && (/**@type {number}*/(menuList[n + 2])) > 0) {
            url = /**@type {string}*/(menuList[n])
            level = /**@type {number}*/(menuList[n + 2])
        } else if ((/**@type {number}*/(menuList[n + 2])) > 0 && (/**@type {number}*/(menuList[n + 2])) < level) {
            menuList[n] = url
            menuList[n + 1] = 1
            level = /**@type {number}*/(menuList[n + 2])
        }
        n -= 4
    }
}

function menuDisplay() {
    let i = 0
    let className
    let display
    for (let n = 0; n < menuList.length; n += 4) {
        if (menuList[n + 1] != 1) {
            continue
        }
        if (menuList[n + 2] == 0) {
            className = "dot1"
            display = "block"
        } else if (((/**@type {number}*/(menuList[n + 2])) > 0) && (menuList[n + 4 + 2] > menuList[n + 2])) {
            className = "plus"
            if (menuList[n + 2] == 1) {
                display = "block"
            } else {
                display = "none"
            }
        } else {
            className = "dot2"
            display = "none"
        }
        
        const power = ((/**@type{number}*/(menuList[n + 2])) > 0) ? ((/**@type{number}*/(menuList[n + 2])) - 1) : 0
        
        if (menuList[n] === '---') {
            const newOL = document.createElement('hr')
            newOL.id = `hr${i}`
            document.getElementsByTagName('menu')[0].appendChild(newOL)
        } else {
            const haveIcon = ['Applications','Moderating','User','Startpage','Account'].includes(menuList[n].toString())

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
                newIMG.src = `/images/${menuList[n]}.svg`
                newOL.appendChild(newIMG)
            }

            const newA = document.createElement('a')
            newA.id = `a${i}`
            newA.href = `/archive/views/${menuList[n]}`
            newA.target = 'mainFrame'
            newA.className = 'L1'
            newA.setAttribute('data', `${i}-${n}`)
            newA.onclick = (e) => {
                /** @ts-ignore @type {HTMLAnchorElement} */
                const target = e.target
                doClick(Number.parseInt(target.getAttribute('data').split('-')[0]), Number.parseInt(menuList[target.getAttribute('data').split('-')[1]]).toString())
            }
            newA.textContent = menuList[n + 3].toString()
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
        map[map.length] = menuList[n + 2]
        i++
    }
}

function UnselectAll() {
    const l = menuList.length / 4 // document.getElementsByTagName('ol').length
    for (let i = 0; i < l; i++) {
        try {
            document.getElementById('ol' + i).classList.remove('selected')
        } catch (ex) {
            continue
        }
    }
}

function collapseAll() {
    const l = menuList.length / 4 //document.getElementsByTagName('ol').length
    for (let i = 0; i < l; i++) {
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
    for (let i = 0; i < document.links.length; i++) {
        document.links[i].className = "L1";
    }
}

function expandBranch(n) {
    let branch;
    let l = 0;
    let index;
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

    if (map[n] == 1) {
        document.getElementById('ol' + (n + 1)).classList.add('selected')
    } else {
        document.getElementById('ol' + n).classList.add('selected')
    }
}
