const fs = require('fs')
const Path = require('path')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')

/**
 * @param {{hashes:{id:string;hash:string;}[]}} hashes
 */
function SaveHash(hashes) {
    fs.writeFileSync(Path.join(CONFIG.paths.base, 'user-hash.json'), JSON.stringify(hashes), { encoding: 'utf-8' })
}

/**
 * @returns {{hashes:{id:string;hash:string;}[]}}
 */
function LoadHash() {
    return JSON.parse(fs.readFileSync(Path.join(CONFIG.paths.base, 'user-hash.json'), { encoding: 'utf-8' }))
}

/** @param {string} userID */
function GetHash(userID) {
    const hashes = LoadHash()

    for (let i = 0; i < hashes.hashes.length; i++) {
        const hash = hashes.hashes[i];
        if (hash.id == userID) {
            return hash.hash
        }
    }

    return null
}

/** @param {string} hash */
function GetID(hash) {
    const hashes = LoadHash()

    for (let i = 0; i < hashes.hashes.length; i++) {
        const hash_ = hashes.hashes[i];
        if (hash_.hash == hash) {
            return hash_.id
        }
    }

    return null
}

function GenerateRandomString() {
    const length = 5
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function GenerateHash() {
    let iterations = 50
    while (true) {
        const newHash = GenerateRandomString()
        if (GetID(newHash) == null) {
            return newHash
        }
        iterations--
        if (iterations <= 0) {
            break
        }
    }
    return null
}

/** @param {string} userID */
function AddNewUser(userID) {
    const hash = GenerateHash()
    if (hash == null) { return }

    const hashes = LoadHash()
    hashes.hashes.push({id: userID, hash: hash})
    SaveHash(hashes)
}

/** @param {string} userID */
function RemoveAllUser(userID) {
    let iterations = 50
    while (RemoveUser(userID)) {
        iterations--
        if (iterations <= 0) {
            break
        }
    }
}

/** @param {string} userID */
function RemoveUser(userID) {
    const hashes = LoadHash()
    let removeIndex = -1
    for (let i = 0; i < hashes.hashes.length; i++) {
        const hash = hashes.hashes[i];
        if (hash.id == userID) {
            removeIndex = i
            break
        }
    }
    if (removeIndex > -1) {
        hashes.hashes.splice(removeIndex, 1)
        SaveHash(hashes)
        return true
    }
    return false
}

module.exports = { AddNewUser, GetID, GetHash, RemoveAllUser }