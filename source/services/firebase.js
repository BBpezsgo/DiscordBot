// @ts-check

/** @type {import('../config').Config} */
const CONFIG = require('../config.json')
const { initializeApp, FirebaseError } = require('firebase/app')
const { getDatabase, ref, child, get, set } = require("firebase/database")

/**
 * @param {any} error
 */
function LogError(error) {
    if (typeof error !== 'object') { console.log(error); return }
    if (error instanceof FirebaseError) {
        console.error(error.name + ' - ' + error.code + ':', error.message, error.customData)
    } else {
        console.log(error)
    }
}

class DatabaseAPI {
    constructor() {
        this.app = initializeApp(CONFIG.firebase)
        this.database = getDatabase(this.app)
    }

    Get(path = '/') {
        return new Promise((resolve, reject) => {
            get(child(ref(this.database), path))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        resolve(snapshot.val())
                    } else {
                        reject('No data available')
                    }
                })
                .catch(reject)
                .finally(() => {
                    console.log('Done')
                    process.exit(0)
                })
        })
    }

    /**
     * @param {string} path
     * @param {any} value
     */
    Set(path, value) {
        return set(ref(this.database, path), value)
    }
}

module.exports = DatabaseAPI
