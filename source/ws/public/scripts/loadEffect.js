const allLoadingElements = document.getElementsByClassName('loading-effect')
if (location.href.includes('#noReload')) {
    for (var i = 0; i < allLoadingElements.length; i++) {
        const element = allLoadingElements.item(i)
        element.classList.add('loading-effect-loaded-instant')
    }
} else {
    var i = 0
    const interval = setInterval(() => {
        if (i >= allLoadingElements.length) {
            clearInterval(interval)
        } else {
            const element = allLoadingElements.item(i)
            element.classList.add('loading-effect-loaded')
            i++
        }
    }, 50)
}