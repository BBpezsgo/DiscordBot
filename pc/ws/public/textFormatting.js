
var elms = document.getElementsByClassName("styledtext")

function StartFormattings() {
    for (let i = 0; i < elms.length; i++) {
        styleText(elms[i]);
    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/**@param {Element} elmnt */
function styleText(elmnt) {
    var elmntObj = (document.getElementById(elmnt) || elmnt);
    var elmntTxt = elmntObj.innerHTML;
    elmntTxt = replaceAll(elmntTxt, "[*][*][*]", "BOLDITALICTEXT")
    elmntTxt = replaceAll(elmntTxt, "[*][*]", "BOLDTEXT")
    elmntTxt = replaceAll(elmntTxt, "[*]", 'ITALICTEXT')
    elmntTxt = replaceAll(elmntTxt, "[|][|]", 'SPOILERTEXT')
    elmntTxt = pyMode(elmntTxt);
    elmntTxt = replaceAll(elmntTxt, "BOLDITALICTEXT", "")
    elmntTxt = replaceAll(elmntTxt, "BOLDTEXT", "")
    elmntTxt = replaceAll(elmntTxt, "ITALICTEXT", "")
    elmntTxt = replaceAll(elmntTxt, "__", "")
    elmntTxt = replaceAll(elmntTxt, "~~", "")
    elmntTxt = replaceAll(elmntTxt, "SPOILERTEXT", "")
    elmntObj.innerHTML = elmntTxt;

    function extract(str, start, end, func, repl) {
        var s, e, d = "", a = [];
        while (str.search(start) > -1) {
            s = str.search(start);
            e = str.indexOf(end, s);
            if (e == -1) { e = str.length; }
            if (repl) {
                a.push(func(str.substring(s, e + (end.length))));
                str = str.substring(0, s) + repl + str.substr(e + (end.length));
            } else {
                d += str.substring(0, s);
                d += func(str.substring(s, e + (end.length)));
                str = str.substr(e + (end.length));
            }
        }
        this.rest = d + str;
        this.arr = a;
    }

    function pyMode(txt) {
        var rest = txt, done = "", esc = [], i, cc, tt = "", mypos, y;
        var strikeoutPos, boldPos, italicPos, italicboldPos, underlinedPos, spoilerPos;
        for (i = 0; i < rest.length; i++) {
            cc = rest.substr(i, 1);
            if (cc == "\\") {
                esc.push(rest.substr(i, 2));
                cc = "W3JSESCAPE";
                i++;
            }
            tt += cc;
        }
        rest = tt;
        y = 1;

        while (y == 1) {
            boldPos = getPos(rest, "BOLDTEXT", "BOLDTEXT", boldMode);
            italicPos = getPos(rest, 'ITALICTEXT', 'ITALICTEXT', italicMode);
            italicboldPos = getPos(rest, 'BOLDITALICTEXT', "BOLDITALICTEXT", italicboldMode);
            underlinedPos = getPos(rest, '__', "__", underlineMode);
            strikeoutPos = getPos(rest, '~~', "~~", strikeoutMode);
            spoilerPos = getPos(rest, 'SPOILERTEXT', "SPOILERTEXT", spoilerMode);
            if (Math.max(spoilerPos[0], strikeoutPos[0], boldPos[0], italicPos[0], italicboldPos[0], underlinedPos[0]) == -1) { break; }
            mypos = getMinPos(spoilerPos, strikeoutPos, boldPos, italicPos, italicboldPos, underlinedPos);
            if (mypos[0] == -1) { break; }
            if (mypos[0] > -1) {
                done += rest.substring(0, mypos[0]);
                done += mypos[2](rest.substring(mypos[0], mypos[1]));
                rest = rest.substr(mypos[1]);
            }
        }
        rest = done + rest;
        for (i = 0; i < esc.length; i++) {
            rest = rest.replace("W3JSESCAPE", esc[i]);
        }
        return rest;
    }
    function italicMode(txt) {
        return "<em>" + txt + "</em>";
    }
    function boldMode(txt) {
        return "<strong>" + txt + "</strong>";
    }
    function italicboldMode(txt) {
        return "<strong><em>" + txt + "</em></strong>";
    }
    function underlineMode(txt) {
        return "<u>" + txt + "</u>";
    }
    function strikeoutMode(txt) {
        return "<del>" + txt + "</del>";
    }
    function spoilerMode(txt) {
        return "<div class=\"formattedTextSpoiler\" onclick=\"this.className = 'formattedTextSpoiler formattedTextSpoilerShown'\">" + txt + "</div>";
    }
    function getMinPos() {
        var i, arr = [];
        for (i = 0; i < arguments.length; i++) {
            if (arguments[i][0] > -1) {
                if (arr.length == 0 || arguments[i][0] < arr[0]) { arr = arguments[i]; }
            }
        }
        if (arr.length == 0) { arr = arguments[i]; }
        return arr;
    }

    function getPos(txt, start, end, func) {
        var s, e;
        s = txt.search(start);
        e = txt.indexOf(end, s + (end.length));
        if (e == -1) { e = txt.length; }
        return [s, e + (end.length), func];
    }
}