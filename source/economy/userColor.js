/**
 * @returns {import('discord.js').ColorResolvable}
 * @param { 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'black' | 'brown' | 'white' | 'orange' | import('discord.js').ColorResolvable } colorName
 */
function GetUserColor(colorName) {
    if (colorName == 'red') {
        return '#d12a2a'
    } else if (colorName === 'yellow') {
        return '#f2e338'
    } else if (colorName === 'green') {
        return '#2ca628'
    } else if (colorName === 'blue') {
        return '#1f3aa6'
    } else if (colorName === 'purple') {
        return '#8824a6'
    } else if (colorName === 'black') {
        return '#121212'
    } else if (colorName === 'brown') {
        return '#452e1b'
    } else if (colorName === 'white') {
        return '#fefefe'
    } else if (colorName === 'orange') {
        return '#fc9403'
    } else {
        return colorName
    }
}

module.exports = GetUserColor