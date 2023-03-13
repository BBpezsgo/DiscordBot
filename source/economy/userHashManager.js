const fs = require('fs')
const Path = require('path')
/** @type {import('../config').Config} */
const CONFIG = require('../config.json')

/** @param {{hashes:{id:string;hash:string;}[];}} hashes */
function SaveHash(hashes) {
    var rawData = JSON.stringify(hashes)
    fs.writeFileSync(Path.join(CONFIG.paths.base, 'user-hash.json'), rawData, { encoding: 'utf-8' })
}

function LoadHash() {
    var rawData = fs.readFileSync(Path.join(CONFIG.paths.base, 'user-hash.json'), { encoding: 'utf-8' })
    /** @type {{hashes:{id:string;hash:string;}[];}} */
    var data = JSON.parse(rawData)
    return data
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
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function GenerateHash() {
    var iterations = 50
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
    var hash = GenerateHash()
    if (hash == null) { return }

    var hashes = LoadHash()
    hashes.hashes.push({id: userID, hash: hash})
    SaveHash(hashes)
}

/** @param {string} userID */
function RemoveAllUser(userID) {
    var iterations = 50
    while (RemoveUser(userID)) {
        iterations--
        if (iterations <= 0) {
            break
        }
    }
}

/** @param {string} userID */
function RemoveUser(userID) {
    var hashes = LoadHash()
    var removeIndex = -1
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