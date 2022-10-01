const { DatabaseManager } = require('./databaseManager')

/** @param {DatabaseManager} database */
function MarketOnStart(database) {    
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

    const marketLastDay = (database.dataMarket.day == undefined) ? dayOfYear : dayOfYear
    database.dataMarket.day = dayOfYear

    if (database.dataMarket.prices == undefined || dayOfYear - marketLastDay >= 3) {
        database.dataMarket.prices =
        {
            'token': (Math.floor(Math.random() * 1000) + 5000),
            'coupon': (Math.floor(Math.random() * 1000) + 4000),
            'jewel': (Math.floor(Math.random() * 100) + 11000)
        }
    }
}

module.exports = { MarketOnStart }