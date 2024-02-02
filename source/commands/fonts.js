const fs = require('fs')
const Path = require('path')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const Discord = require('discord.js')

/**@param {string} str @param {number} fontIndex */
function StringToFont(str, fontIndex) {
    const raw = fs.readFileSync(Path.join(CONFIG.paths.base, './commands/fontData.txt')).toString('utf-8')
    const rawList = raw.split('\n')
    /**@type {string[][]} */
    const fonts = []
    rawList.forEach(font => fonts.push([...font]))

    let inputStr = str
    
    for (let i = 0; i < fonts[0].length; i++) {
        const defaultChar = fonts[0][i]
        for (let x = 0; x < inputStr.length; x++) {
            inputStr = inputStr.replace(defaultChar, fonts[fontIndex][i])
        }
    }

    return inputStr
}

/** @param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
function CommandFont(command, privateCommand) {
    const x = Number.parseInt(command.options.get('font').value.toString())
    const y = command.options.get('text').value.toString()
    command.reply({content: StringToFont(y, x), ephemeral: privateCommand})
}

function GetFonts() {
    const raw = fs.readFileSync(Path.join(CONFIG.paths.base, './commands/fontData.txt')).toString('utf-8')
    const rawList = raw.split('\n')
    /**@type {string[][]} */
    const fonts = []
    rawList.forEach(font => fonts.push([...font]))
    return fonts
}

module.exports =  { CommandFont , GetFonts, StringToFont }
