/**
 * @param {string} url
 * @param {Event} event
 * @param {(result: string) => void | undefined} callback
 * @param {string | undefined} errorLabelID
 */
function Post(url, event, callback, errorLabelID) {
    event.srcElement.classList.add('disabled')
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            event.srcElement.classList.remove('disabled')
            if (xmlHttp.status === 404) {
                console.warn('404')
                if (errorLabelID !== undefined) {
                    const errorLabel = document.getElementById(errorLabelID)
                    errorLabel.innerHTML = `<b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP POST</a>: ${xmlHttp.status}</b>`
                }
                return
            }
            try {
                const res = JSON.parse(xmlHttp.responseText)
                if (res.message === 'ok') {
                    console.log('Success')
                    if (callback !== undefined) {
                        callback(xmlHttp.responseText)
                    }
                } else if (res.rawError !== undefined) {
                    console.warn(JSON.stringify(res, null, ' '))
                    if (errorLabelID !== undefined) {
                        const errorLabel = document.getElementById(errorLabelID)
                        var details = ''
                        if (res.rawError.errors !== undefined) {
                            details = `: ${JSON.stringify(res.rawError.errors)}`
                        }
                        errorLabel.innerHTML =
                            `
                            <b><a href='${res.url}' target='_blank'>HTTP ${res.method}</a>: ${res.status}</b><br>
                            ${res.rawError.message} (code: ${res.rawError.code})${details}
                            `
                    }
                } else {
                    if (errorLabelID !== undefined) {
                        const errorLabel = document.getElementById(errorLabelID)
                        errorLabel.innerHTML =
                            `
                            <b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP POST</a>: Invalid Response</b><br>
                            ${JSON.stringify(res)}
                            `
                    }
                }
            } catch (error) {
                if (errorLabelID !== undefined) {
                    const errorLabel = document.getElementById(errorLabelID)
                    errorLabel.innerHTML =
                        `
                        <b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP POST</a>: Invalid Response</b><br>
                        ${xmlHttp.response}
                        `
                }
            }
        }
    }
    xmlHttp.open('POST', url, true)
    xmlHttp.send(null)
}