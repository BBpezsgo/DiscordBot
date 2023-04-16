// @ts-check

/**
 * @param {string} url
 * @param {Event} event
 * @param {(result: string) => void | null} callback
 * @param {string | null} errorLabelID
 */
function Post(url, event, callback = null, errorLabelID = null) {
    event.srcElement.classList.add('disabled')
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            event.srcElement.classList.remove('disabled')
            if (xmlHttp.status === 404) {
                console.warn('404')
                if (errorLabelID) {
                    const errorLabel = document.getElementById(errorLabelID)
                    errorLabel.innerHTML = `<b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP POST</a>: ${xmlHttp.status}</b>`
                }
                return
            }
            try {
                const res = JSON.parse(xmlHttp.responseText)
                if (res.message === 'ok' || res.message === 'kind of okay') {
                    console.log('Success:', res.details)
                    if (callback) {
                        callback(xmlHttp.responseText)
                    }
                } else if (res.rawError) {
                    console.warn(JSON.stringify(res, null, ' '))
                    if (errorLabelID) {
                        const errorLabel = document.getElementById(errorLabelID)
                        var details = ''
                        if (res.rawError.errors) {
                            details = `: ${JSON.stringify(res.rawError.errors)}`
                        }
                        errorLabel.innerHTML =
                            `
                            <b><a href='${res.url}' target='_blank'>HTTP ${res.method}</a>: ${res.status}</b><br>
                            ${res.rawError.message} (code: ${res.rawError.code})${details}
                            `
                    }
                } else {
                    console.warn('HTTP POST', xmlHttp)
                    if (errorLabelID) {
                        const errorLabel = document.getElementById(errorLabelID)
                        errorLabel.innerHTML =
                            `
                            <b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP POST</a>: Invalid Response</b><br>
                            ${JSON.stringify(res)}
                            `
                    }
                }
            } catch (error) {
                if (errorLabelID) {
                    const errorLabel = document.getElementById(errorLabelID)
                    errorLabel.innerHTML =
                        `
                        <b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP POST</a>: Error</b><br>
                        ${xmlHttp.response}
                        `
                }
            }
        }
    }
    xmlHttp.open('POST', url, true)
    xmlHttp.send(null)
}

/**
 * @param {string} url
 * @param {Event} event
 * @param {(result: string) => void | null} callback
 * @param {string | null} errorLabelID
 */
function Get(url, event, callback = null, errorLabelID = null) {
    event.srcElement.classList.add('disabled')
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            event.srcElement.classList.remove('disabled')
            if (xmlHttp.status === 404) {
                console.warn('404')
                if (errorLabelID) {
                    const errorLabel = document.getElementById(errorLabelID)
                    errorLabel.innerHTML = `<b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP GET</a>: ${xmlHttp.status}</b>`
                }
                return
            }
            try {
                const res = JSON.parse(xmlHttp.responseText)
                if (res.message === 'ok' || res.message === 'kind of okay') {
                    console.log('Success:', res.details)
                    if (callback) {
                        callback(xmlHttp.responseText)
                    }
                } else if (res.rawError) {
                    console.warn(JSON.stringify(res, null, ' '))
                    if (errorLabelID) {
                        const errorLabel = document.getElementById(errorLabelID)
                        var details = ''
                        if (res.rawError.errors) {
                            details = `: ${JSON.stringify(res.rawError.errors)}`
                        }
                        errorLabel.innerHTML =
                            `
                            <b><a href='${res.url}' target='_blank'>HTTP ${res.method}</a>: ${res.status}</b><br>
                            ${res.rawError.message} (code: ${res.rawError.code})${details}
                            `
                    }
                } else {
                    console.warn('HTTP GET', xmlHttp)
                    if (errorLabelID) {
                        const errorLabel = document.getElementById(errorLabelID)
                        errorLabel.innerHTML =
                            `
                            <b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP GET</a>: Invalid Response</b><br>
                            ${JSON.stringify(res)}
                            `
                    }
                }
            } catch (error) {
                if (errorLabelID) {
                    const errorLabel = document.getElementById(errorLabelID)
                    errorLabel.innerHTML =
                        `
                        <b><a href='${xmlHttp.responseURL}' target='_blank'>HTTP GET</a>: Error</b><br>
                        ${xmlHttp.response}
                        `
                }
            }
        }
    }
    xmlHttp.open('GET', url, true)
    xmlHttp.send(null)
}