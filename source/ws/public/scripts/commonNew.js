function GetMinWidth() {
	var i = Math.ceil((window.screen.width - 182) * 0.55) - 6;
	return i;
}

function LoadHelp() { }

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

function resize() { return true }

function resizeHelp() { return true }

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
	catch (e) { }
}

function disableTag(obj, tag, type) {
	try {
		var items = obj.getElementsByTagName(tag);
	}
	catch (e) {
		return
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
	{ window.parent.mainFrame.location.href = FileName }
	return true
}