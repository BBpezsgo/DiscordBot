class WordleManager {
    /** @param {string} word @param {string} userId */
    constructor (word, userId) {
        /** @type {string} */
        this.word = word
        /** @type {string} */
        this.userId = userId
        /** @type {string[]} */
        this.lettersAnswered = []
    }
}