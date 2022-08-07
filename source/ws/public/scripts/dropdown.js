/** @param {Element} sender */
function dropdownClick(sender) {
    hideDropdowns()
    document.getElementById('dropdown-content-' + sender.id.split('-')[1]).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        hideDropdowns()
    }
}

function hideDropdowns() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}