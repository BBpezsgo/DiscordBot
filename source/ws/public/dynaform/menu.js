var menuList = new Array(
    //	url							display	level			string
    //	url:	url to visite when click on this menu item. it's not full path, but only filename.
    //		if it's not null, must be one and only; else if it's null, that means it has branches, and the actual url is the one of its first visitable branches.
    //	display: must be 0. 
    //	directory level: 0: directory has no branches;  1: directory level 1;  2:level 2;   and so on
    "Status", 0, 0, str_menu.status,
    "CacheEmojis", 0, 1, str_menu.cache,
    "CacheEmojis", 0, 2, str_menu.cacheEmojis,
    "CacheUsers", 0, 2, str_menu.cacheUsers,
    "CacheChannels", 0, 2, str_menu.cacheChannels,
    "CacheServers", 0, 2, str_menu.cacheServers,
    "Application", 0, 0, str_menu.application,
    "Process", 0, 0, str_menu.process,
    "Database", 0, 0, str_menu.database,
    "Moderating", 0, 0, str_menu.moderating,
    "LogError", 0, 1, str_menu.log,
    "LogError", 0, 2, str_menu.logErrors,
    "LogSystem", 0, 2, str_menu.logSystem,
    "LogHandlebars", 0, 2, str_menu.logHandlebars,


    "Testing", 0, 0, str_menu.testing,
);

var map = new Array();

function menuInit(option) {
    for (var i = 0; i < option.length; i++) {
        if (option[i] == 0) {
            continue;
        }
        for (var n = 0; n < menuList.length; n += 4) {
            if (true) { //if (menuList[n] == option[i]) {
                menuList[n + 1] = 1;
            }
        }
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
        }
        else if ((menuList[n + 2] > 0) && (menuList[n + 4 + 2] > menuList[n + 2])) {
            className = "plus";
            if (menuList[n + 2] == 1) {
                display = "block";
            }
            else {
                display = "none";
            }
        }
        else {
            className = "dot2";
            display = "none";
        }
        var power = (menuList[n + 2] > 0) ? (menuList[n + 2] - 1) : 0;
        document.write('<ol id=ol' + i + ' class=' + className + ' style="user-select: none; display:' + display + '; background-position:2px;PADDING-LEFT:2px;"><A id=a' + i + ' href="/userRpm/' + menuList[n] + '" target=mainFrame class=L1 onClick="doClick(' + i + ');">' + menuList[n + 3] + '</a></ol>');
        //added by zqq,07.11.1
        //map.push(menuList[n+2]);
        map[map.length] = menuList[n + 2];
        i++;
    }


}

function collapseAll() {
    for (var i = 0; ; i++) {
        try {
            if (map[i] > 1) {
                document.getElementById('ol' + i).style.display = "none";
            }
            if (document.getElementById('ol' + i).className == "minus") {
                document.getElementById('ol' + i).className = "plus";
            }
        } catch (ex) {
            break
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
        if (branch.className == "plus") {
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

/** @param {number} n */
function doClick(n) {
    collapseAll();
    obj = document.getElementById('ol' + n);
    if (obj.className == "plus") {
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