const fs = require('fs')
const LogError = require('./errorLog').LogError
const Discord = require('discord.js')
const https = require('https')

const PATH = 'C:/Users/bazsi/Documents/GitHub/DiscordBot/source/cache/images/'

/**
 * @param {string | URL | https.RequestOptions} url
 */
function NormalizeURL(url) {
    if (!url) return null
    let result = url
    if (typeof result !== 'string') {
        result = result.toString()
    }
    result = result.replace(/\\/g, '_')
    result = result.replace(/\//g, '_')
    result = result.replace(/\?/g, '_')
    result = result.replace(/\,/g, '_')
    result = result.replace(/ /g, '_')
    result = result.replace(/\s/g, '_')
    result = result.replace(/\:/g, '_')
    return result
}

/**
 * @param {string} url
 */
function Save(url, data) {
    if (!fs.existsSync(PATH)) { fs.mkdirSync(PATH, { recursive: true }) }
    if (fs.existsSync(PATH + NormalizeURL(url))) { return false }
    try {
        fs.writeFileSync(PATH + NormalizeURL(url), data, 'binary')
        return true
    }
    catch (error) { LogError(error) }
    return false
}

/**
 * @param {string | https.RequestOptions | URL} url
 */
function DownloadAndSave(url) {
    if (!fs.existsSync(PATH)) { fs.mkdirSync(PATH, { recursive: true }) }
    if (fs.existsSync(PATH + NormalizeURL(url))) { return }
    https.get(url, res => {
        res.pipe(fs.createWriteStream(PATH + NormalizeURL(url), 'binary'))
    })
}

/**
 * @param {string | https.RequestOptions | URL} url
 */
function DownloadAndOverride(url) {
    if (!fs.existsSync(PATH)) { fs.mkdirSync(PATH, { recursive: true }) }
    https.get(url, res => {
        res.pipe(fs.createWriteStream(PATH + NormalizeURL(url), 'binary'))
    })
}

/**
 * @param {string | https.RequestOptions | URL} url
 * @returns {Promise<void>}
 */
function DownloadAndSaveAsync(url) {
    return new Promise(resolve => {
        if (!fs.existsSync(PATH)) { fs.mkdirSync(PATH, { recursive: true }) }
        if (fs.existsSync(PATH + NormalizeURL(url))) {
            resolve()
            return
        }
        https.get(url, res => {
            res.pipe(fs.createWriteStream(PATH + NormalizeURL(url), 'binary'))
            res.on('end', resolve)
        }).on('error', LogError)
    })
}

/**
 * @param {string | https.RequestOptions | URL} url
 */
function DownloadAndOverrideAsync(url) {
    return new Promise(resolve => {
        if (!fs.existsSync(PATH)) { fs.mkdirSync(PATH, { recursive: true }) }
        https.get(url, res => {
            res.pipe(fs.createWriteStream(PATH + NormalizeURL(url), 'binary'))
            res.on('end', resolve)
        }).on('error', LogError)
    })
}

/**
 * @param {string} url
 */
function Override(url, data) {
    if (!fs.existsSync(PATH)) { fs.mkdirSync(PATH, { recursive: true }) }
    try { fs.writeFileSync(PATH + NormalizeURL(url), data, 'binary') }
    catch (error) { LogError(error) }
}

/**
 * @param {string} url
 */
function Load(url) {
    if (!fs.existsSync(PATH)) { return }
    try { return fs.readFileSync(PATH + NormalizeURL(url), 'binary') }
    catch (error) { LogError(error) }
    return null
}

/**
 * @param {Discord.Client} client
 * @returns {Promise<void>}
 */
function DownloadEverything(client) {
    return new Promise(resolve => {
        if (!client) {
            resolve()
            return
        }

        client.users.cache.forEach(async user => {
            const url = user.avatarURL()
            if (url) {
                await DownloadAndSaveAsync(url)
            }
        })

        client.guilds.cache.forEach(async guild => {
            const url = guild.iconURL()
            if (url) {
                await DownloadAndSaveAsync(url)
            }
        })
    })
}

module.exports = {
    Save,
    Load,
    Override,
    DownloadAndSave,
    DownloadAndOverride,
    DownloadAndSaveAsync,
    DownloadAndOverrideAsync,
    DownloadEverything,
}