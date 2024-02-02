/**
 * @param {string} url
 * @param {(data: string) => any} callback
 */
function GetData(url, callback)
{
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) callback(xmlHttp.responseText)
            else console.error(url, xmlHttp.status, xmlHttp.responseText)
        }
    }
    xmlHttp.open("GET", url, true) 
    xmlHttp.send(null)
}

/**
 * @returns {HTMLElement}
 */
function CreateElement(html) {
    const container = document.createElement('div')
    container.innerHTML = html
    // @ts-ignore
    return container.firstElementChild
}

/**
 * @param {string} userID
 * @param {MouseEvent} e
 * @param {string | undefined} containerID
 */
function UserPopup(userID, e, containerID = undefined) {
    /** @ts-ignore @type {HTMLElement} */
    const clickedElement = e.target
    const oldElement = document.getElementById('user-popup')
    if (oldElement) oldElement.remove()
    GetData(`/dcbot/user-popup.html?id=${userID}`, data => {
        const element = (containerID ? document.getElementById(containerID) : document.body).appendChild(CreateElement(data))
        const offsetX = (containerID ? document.getElementById(containerID).scrollLeft : 0)
        const offsetY = (containerID ? document.getElementById(containerID).scrollTop : 0)
        element.style.left = (clickedElement.getBoundingClientRect().left + offsetX) + 'px'
        element.style.top = (clickedElement.getBoundingClientRect().top + offsetY) + 'px'
        const a = document.getElementById(containerID).getBoundingClientRect().width
    })
}

window.addEventListener('click', e => {
    const element = document.getElementById('user-popup')
    // @ts-ignore
    if (element?.contains(e.target)) return
    element?.remove()
})
