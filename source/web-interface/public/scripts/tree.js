setTimeout(() => {
    const toggler = document.getElementsByClassName("caret");
    const togglerAll = document.getElementsByClassName("caret-all")[0];
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", (e) => {
            e.target.classList.toggle("caret-down")

            togglerAll.classList.remove("caret-up")
            togglerAll.classList.remove("caret-down")

            const childs = document.getElementsByClassName(e.target.id)
            for (let i = 0; i < childs.length; i++) {
                const element = childs[i]
                element.classList.toggle("nested-show")
            }
        });
    }

    togglerAll.addEventListener("click", (e) => {
        if (togglerAll.classList.contains("caret-down")) {
            togglerAll.classList.remove("caret-down")
            togglerAll.classList.add("caret-up")

            const childs = document.getElementsByClassName("nested")
            for (let i = 0; i < childs.length; i++) {
                const element = childs[i]
                element.classList.remove("nested-show")
            }

            for (let j = 0; j < toggler.length; j++) {
                const element = toggler[j];
                element.classList.remove("caret-down")
            }
        } else {
            togglerAll.classList.add("caret-down")
            togglerAll.classList.remove("caret-up")

            const childs = document.getElementsByClassName("nested")
            for (let i = 0; i < childs.length; i++) {
                const element = childs[i]
                element.classList.add("nested-show")
            }

            for (let j = 0; j < toggler.length; j++) {
                const element = toggler[j];
                element.classList.add("caret-down")
            }
        }
    });
}, 1000);

/** @param {string} id */
function OnCaretClick(id) {
    document.getElementById(id).click()
}