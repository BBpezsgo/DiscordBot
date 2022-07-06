function GetMinWidth() {
	var i = Math.ceil((window.screen.width - 182) * 0.55) - 6;
	return i;
}

/** @param {Window} window */
function LoadHelp(window) {
	return
	if (window.parent != window) {
		const helpFileName = window.location.pathname.split('/').reverse()[0]
		if (window.parent.topFrame.hl != helpFileName) {
			if (UrlExists("/help/" + helpFileName) == false) {
				window.document.getElementsByClassName('show-hide-part-button')[0].style.display = 'none'
			} else {
				window.document.getElementsByClassName('show-hide-part-button')[0].style.display = 'block'
				window.parent.topFrame.hl = helpFileName
				window.parent.helpFrame.location.href = "/help/" + helpFileName
			}
		}
	}
}

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

function resize(obj) {
	var minWidth = GetMinWidth();
	if (window.document.body.offsetWidth > minWidth) {
		obj.document.getElementById('autoWidth').style.width = "100%";
	}
	else {
		obj.document.getElementById('autoWidth').style.width = minWidth;
	}
	return true;
}

function resizeHelp(obj) {
	if (window.document.body.offsetWidth > 290) {
		obj.document.getElementById('autoWidth').style.width = "100%";
	}
	else {
		obj.document.getElementById('autoWidth').style.width = 290;
	}
	return true;
}

function elementDisplay(obj, tag, disStr) {
	try {
		if (!window.ActiveXObject) {
			items = obj.getElementsByName(tag);
			if (items.length > 0) {
				for (i = 0; i < items.length; i++) {
					items[i].style.display = disStr;
				}
			}
			else {
				obj.getElementById(tag).style.display = disStr;
			}
		}
		else {
			items = obj.all[tag];
			if (undefined != items.length && items.length > 0) {
				for (i = 0; i < items.length; i++) {
					items[i].style.display = disStr;
				}
			}
		}
	}
	catch (e) {
		return;
	}
}

function disableTag(obj, tag, type) {
	try {
		var items = obj.getElementsByTagName(tag);
	}
	catch (e) {
		return;
	}
	if (type == undefined) {
		for (var i = 0; i < items.length; i++) {
			items[i].disabled = true;
		}
	}
	else {
		for (var i = 0; i < items.length; i++) {
			if (items[i].type == type)
				items[i].disabled = true;
		}
	}
}

function LoadNext(FileName) {
	if (window.parent != window)
		window.parent.mainFrame.location.href = FileName;
	return true;
}