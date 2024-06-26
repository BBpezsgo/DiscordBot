/**
 * @param {string} url
 * @param {(data: string) => any} callback
 */
function GetData(url, callback)
{
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true) 
    xmlHttp.send(null)
}