const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + '\033[37m' + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + '\033[37m' + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + '\033[37m' + ']'
const SHARD = '[' + '\033[35m' + 'SHARD' + '\033[40m' + '' + '\033[37m' + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + '\033[37m' + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + '\033[37m' + ']'
const SERVER = '[' + '\033[36m' + 'SERVER' + '\033[40m' + '' + '\033[37m' + ']'

const groupNames = {
    shard: "shard",
    manager: "manager",
    ytdl: "ytdl",
    client: "client"
}

/**
 * @param {string} message
 * @returns {TranslateResult}
 */
function TranslateMessage(message) {
    if (message.startsWith('Provided token: ')) {
        return new TranslateResult(message, message.replace("Provided token: ", "Biztosított token: "), DEBUG, true, groupNames.client)
    } else {
        if (message.startsWith('Preparing to connect to the gateway...')) {
            return new TranslateResult(message, "Csatlakozás...", DEBUG, false, groupNames.client, new Status(0))
        } else if (message.startsWith('[WS => Manager] Fetched Gateway Information')) {
            return null
        } else if (message.startsWith('[WS => Manager] Session Limit Information')) {
            return null
        } else if (message.startsWith('[WS => Shard 0] [CONNECTED] Took')) {
            return new TranslateResult(message, "Csatlakozva " + message.replace('[WS => Shard 0] [CONNECTED] Took ', '') + ' alatt', SHARD, false, groupNames.shard, new Status(40))
        } else if (message.startsWith('[WS => Manager] Spawning shards: ')) {
            return new TranslateResult(message, "Shard-ok létrehozása...", DEBUG, false, groupNames.manager, new Status(20))
        } else if (message.startsWith('[WS => Shard 0] [CONNECT]')) {
            return new TranslateResult(message, "Csatlakozás...", SHARD, false, groupNames.shard, new Status(10))
        } else if (message.startsWith('[WS => Shard 0] Setting a HELLO timeout for ')) {
            return new TranslateResult(message, message.replace("[WS => Shard 0] Setting a HELLO timeout for ", "HELLO időtúllépés beállítása: "), SHARD, false, groupNames.shard, new Status(30))
        } else if (message.startsWith('[WS => Shard 0] [CONNECTED] wss://gateway.discord.gg/?v=6&encoding=json in ')) {
            return new TranslateResult(message, "Csatlakozva", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] Clearing the HELLO timeout.')) {
            return new TranslateResult(message, "HELLO időtúllépés törölve", SHARD, false, groupNames.shard, new Status(50))
        } else if (message.startsWith('[WS => Shard 0] Setting a heartbeat interval for ')) {
            return new TranslateResult(message, message.replace("[WS => Shard 0] Setting a heartbeat interval for ", "Heartbeat időtúllépés beállítása: "), SHARD, false, groupNames.shard, new Status(60))
        } else if (message.startsWith('[WS => Shard 0] [IDENTIFY] Shard 0/1')) {
            return new TranslateResult(message, "Shard ellenőrizve", SHARD, false, groupNames.shard, new Status(70))
        } else if (message.startsWith('[WS => Shard 0] [READY] Session ')) {
            return new TranslateResult(message, message.replace("[WS => Shard 0] [READY] Session ", "Kész. Session: "), SHARD, false, groupNames.shard, new Status(80))
        } else if (message.startsWith('[WS => Shard 0] [ReadyHeartbeat] Sending a heartbeat.')) {
            return new TranslateResult(message, "Heartbeat küldése", SHARD, false, groupNames.shard, new Status(90))
        } else if (message.startsWith('[WS => Shard 0] Shard received all its guilds. Marking as fully ready.')) {
            return new TranslateResult(message, "Befejezés", SHARD, false, groupNames.shard, new Status(100))
        } else if (message.startsWith('[WS => Shard 0] Heartbeat acknowledged, latency of ')) {
            ping = message.replace('[WS => Shard 0] Heartbeat acknowledged, latency of ', '').replace('ms.', '')
            return new TranslateResult(message, "Heartbeat nyugtázva: " + ping + "ms", SHARD, true, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] [HeartbeatTimer] Sending a heartbeat.')) {
            return new TranslateResult(message, "Heartbeat küldése", SHARD, true, groupNames.shard)
        } else if (message.startsWith('[WS => Manager] Couldn\'t reconnect or fetch information about the gate')) {
            return new TranslateResult(message, "Nem sikerült újracsatlakozni, vagy lekérni a gate-ra vonatkozó információkat", ERROR, false, groupNames.manager)
        } else if (message.startsWith('[WS => Manager] Possible network error occurred. Retrying in 5s...')) {
            return new TranslateResult(message, "Lehetséges hálózati hiba történt. Újrapróbálkozás 5 másodperc múlva...", DEBUG, false, groupNames.manager)
        } else if (message.startsWith('[WS => Shard 0] [DESTROY]')) {
            return new TranslateResult(message, "A shard megsemmisült", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] Tried to send packet \'{')) {
            return new TranslateResult(message, "Nem sikerült elküldeni a csomagot.", ERROR, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] Shard was destroyed but no WebSocket connection was present! Reconnecting...')) {
            return new TranslateResult(message, "A shard megsemmisült, de nem volt WebSocket kapcsolat! Újracsatlakozás...", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Manager] Manager was destroyed. Called by:')) {
            return new TranslateResult(message, "A kezelő megsemmisült", DEBUG, false, groupNames.manager)
        } else if (message.startsWith('[WS => Shard 0] [CLOSE]')) {
            return new TranslateResult(message, "Kilépés", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] Clearing the heartbeat interval.')) {
            return new TranslateResult(message, "Heartbeat időtúllépés törlése", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] Session id is present, attempting an immediate reconnect...')) {
            return new TranslateResult(message, "A szerver-azonosító jelen van, azonnali újracsatlakozás megpróbálása...", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] WS State: CLOSED')) {
            return new TranslateResult(message, "WebSocket állapota: Zárva", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] A connection object was found. Cleaning up before continuing.')) {
            return new TranslateResult(message, "Kapcsolódási objektum található. Tisztítás a folytatás előtt...", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] WS State: CONNECTING')) {
            return new TranslateResult(message, "WebSocket állapota: Csatlakozás", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] Failed to connect to the gateway, requeueing...')) {
            return new TranslateResult(message, "Nem sikerült csatlakozni, újrapróbálkozás...", WARNING, false, groupNames.shard)
        } else if (message.startsWith('[WS => Manager] Shard Queue Size: 1; continuing in 5 seconds...')) {
            return new TranslateResult(message, "Shard Sor Mérete: 1; folytatás 5s múlva...", DEBUG, false, groupNames.manager)
        } else if (message.startsWith('[WS => Shard 0] [RESUME]')) {
            return new TranslateResult(message, "Folytatás", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] [RESUMED]')) {
            return new TranslateResult(message, "Folytatva", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] [RESUMED]')) {
            return new TranslateResult(message, "Folytatva", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] WS_CLOSE_REQUESTED')) {
            return new TranslateResult(message, "Bezárás megkezdeményezve", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] [INVALID SESSION] Resumable: false.')) {
            return new TranslateResult(message, "Érvénytelen session. Nem folytatható.", ERROR, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] An open connection was found, attempting an immediate identify.')) {
            return new TranslateResult(message, "Egy nyitott csatlakozást észleltünk, azonnali azonosítás megpróbálása...", SHARD, false, groupNames.shard)
        } else if (message.startsWith('[WS => Shard 0] [RECONNECT] Discord asked us to reconnect')) {
            return new TranslateResult(message, "Újracsatlakozás... A Discord arra kért minket, hogy csatlakozzunk újra.", SHARD, false, groupNames.shard)
        } else if (message.startsWith('429 hit on route /gateway/bot')) {
            return new TranslateResult(message, "Shard spam!", ERROR, false, groupNames.client)
        } else if (message.startsWith('[VOICE (') && message.includes(')]: [WS] >> {')) {
            return new TranslateResult(message, "Kommunikálás a szerverrel...", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('Ready with authentication details:')) {
            return new TranslateResult(message, "Hitelesítés kész", DEBUG, false, groupNames.ytdl)
        } else if (message.startsWith('[VOICE (') && message.includes(')]: [WS] << {')) {
            return null
        } else if (message.includes(')]: Sending voice state update: {')) {
            return new TranslateResult(message, "Hangállapot-frissítés küldése", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('received voice state update:')) {
            return new TranslateResult(message, "Hangállapot-frissítés kész", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('connection? true')) {
            return new TranslateResult(message, "Kapcsolat: Kész", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('Setting sessionID')) {
            return new TranslateResult(message, "Szerver azonosító kész", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('Authenticated with sessionID')) {
            return new TranslateResult(message, "A szerver azonosítóval hitelesítve", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('received voice server')) {
            return new TranslateResult(message, "Fogadott hangszerver", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('voiceServer guild')) {
            return new TranslateResult(message, "voiceServer guild", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: Token "')) {
            return null
        } else if (message.includes('Endpoint resolved as')) {
            return new TranslateResult(message, "Végpont feloldva", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('Connect triggered')) {
            return new TranslateResult(message, "Csatlakozás előkészítve", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('connect requested')) {
            return new TranslateResult(message, "Csatlakozás kérése", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: [WS] connecting,')) {
            return new TranslateResult(message, "Csatlakozás...", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: [WS] opened at gateway')) {
            return new TranslateResult(message, "[WS] opened at gateway", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: Selecting the')) {
            return new TranslateResult(message, "Selecting the [...]", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: [UDP] created socket')) {
            return new TranslateResult(message, "UDP csatlakozás kész", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(' Sending IP discovery packet: ')) {
            return new TranslateResult(message, "Sending IP discovery packet...", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('Successfully sent IP discovery packet')) {
            return new TranslateResult(message, "Successfully sent IP discovery packet", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: [UDP] message: ')) {
            return new TranslateResult(message, "[UDP] message", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: [UDP] << {')) {
            return new TranslateResult(message, "Videó betöltése...", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('Connection clean up')) {
            return new TranslateResult(message, "A kapcsolat tisztítása...", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('[WS] shutdown requested')) {
            return new TranslateResult(message, "Lecsatlakozás kérése", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('[WS] reset requested')) {
            return new TranslateResult(message, "Visszaállítás kérése", DEBUG, false, groupNames.ytdl)
        } else if (message.includes('[WS] closed')) {
            return new TranslateResult(message, "Zárva", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: Error [WS_NOT_OPEN]: Websocket not open to send')) {
            return new TranslateResult(message, "A Websocket nem nyitott küldésre", DEBUG, false, groupNames.ytdl)
        } else if (message.includes(')]: [UDP] >> ERROR: Error: send')) {
            return new TranslateResult(message, "UDP küldési hiba", DEBUG, false, groupNames.ytdl)
        } else {
            return new TranslateResult(message, message, DEBUG, false, "?")
        }
    };
}

class TranslateResult {
    /**
     * @param {string} originalText
     * @param {string} translatedText
     * @param {string} messagePrefix
     * @param {boolean} secret
     * @param {string} loadingGroup For example: 'shard', 'ytdl', etc.
     * @param {Status} status
     */
    constructor (originalText, translatedText, messagePrefix, secret, loadingGroup, status = null) {
        this.originalText = originalText
        this.translatedText = translatedText
        this.messagePrefix = messagePrefix
        this.secret = secret
        this.loadingGroup = loadingGroup
        this.status = status
    }
}

class Status {
    /**
     * @param {number} percent
     */
    constructor (percent) {
        this.percent = percent
    }
}

module.exports = { TranslateMessage, TranslateResult }