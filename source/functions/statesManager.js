class StatesManager {
    constructor() {
        /**@type {boolean} */
        this.botLoaded = false
        /**@type {boolean} */
        this.botReady = false
        /**@type {number} */
        this.ping = 0
        /**@type {string} */
        this.loadingProgressText = 'Betöltés...'
        /**
         * @type {string}
         * Error; Warning; Close; Destroyed; Invalid Session; All Ready; Ready; Reconnecting; Disconnect; Resume
         */
        this.botLoadingState = ''

        /**@type {boolean} */
        this.ytdlCurrentlyLoading = false
        /**@type {string} */
        this.ytdloadingText = ''
        /**@type {boolean} */
        this.ytdlCurrentlyPlaying = false
        /**@type {string} */
        this.ytdlCurrentlyPlayingText = ''
        /**@type {string} */
        this.ytdlCurrentlyPlayingUrl = ''

        /**@type {boolean} */
        this.shardCurrentlyLoading = false
        /**@type {string} */
        this.shardCurrentlyLoadingText = ''
        /**@type {string} */
        this.shardErrorText = ''

        /**@type {boolean} */
        this.stateCurrentlyConnected = false
        /**@type {boolean} */
        this.stateCurrentlyShard = false
        /**@type {boolean} */
        this.stateCurrentlyHearthbeat = false

        /**@type {boolean} */
        this.handlebarsDone = false
        /**@type {string} */
        this.handlebarsErrorMessage = ''
        /**@type {string} */
        this.handlebarsURL = ''
        /**@type {[number]} */
        this.handlebarsClientsTime = []
        /**@type {[Socket]} */
        this.handlebarsClients = []
        /**@type {[number]} [lifetime] */
        this.handlebarsRequiests = []

        /**@type {number} */
        this.heartbeat = 0
        /**@type {number} */
        this.hello = 0

        /**@type {number} */
        this.commandCreatedCount = 0
        this.commandAllCommandCount = 0

        /**@type {boolean} */
        this.allNewsProcessed = false
        /**@type {string} */
        this.newsLoadingText = ''
        /**@type {string} */
        this.newsLoadingText2 = ''

        /**@type {string} */
        this.dailyWeatherReportLoadingText = ''

        /**@type {string} */
        this.databaseSaveText = ''
        /**@type {string} */
        this.databaseLoadText = ''
        /**@type {string} */
        this.databaseParsingText = ''
        /**@type {string} */
        this.databaseBackupText = ''
    }

    /**@param {string} message */
    ProcessDebugMessage(message) {
        if (message.startsWith('Provided token: ')) {
        } else if (message.startsWith('Preparing to connect to the gateway...')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Csatlakozás...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Manager] Fetched Gateway Information')) {
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Manager] Session Limit Information')) {
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Manager] Spawning shards: ')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Shard-ok létrehozása...'
            this.stateCurrentlyShard = false
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] [CONNECT]')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Csatlakozva'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] Setting a HELLO timeout for ')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = '\'HELLO\' időtúllépés beállítása...'
            this.shardErrorText = ''
            this.hello = 1
        } else if (message.startsWith('[WS => Shard 0] [CONNECTED] wss://gateway.discord.gg/?v=6&encoding=json in ')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Csatlakozva a szerverhez'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] Clearing the HELLO timeout.')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = '\'HELLO\' időtúllépés törölve'
            this.shardErrorText = ''
            this.hello = 0
        } else if (message.startsWith('[WS => Shard 0] Setting a heartbeat interval for ')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = '\'heartbeat\' beállítása...'
            this.stateCurrentlyHearthbeat = false
            this.shardErrorText = ''
            this.heartbeat = 1
        } else if (message.startsWith('[WS => Shard 0] [IDENTIFY] Shard 0/1')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Shard ellenőrizve...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] [READY] Session ')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'A Szerver kész'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] [ReadyHeartbeat] Sending a heartbeat.')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = '\'heartbeat\' küldése...'
            this.stateCurrentlyHearthbeat = false
            this.shardErrorText = ''
            this.heartbeat = 2
        } else if (message.startsWith('[WS => Shard 0] Shard received all its guilds. Marking as fully ready.')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Befejezés...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] Heartbeat acknowledged, latency of ')) {
            this.ping = message.replace('[WS => Shard 0] Heartbeat acknowledged, latency of ', '')
            this.stateCurrentlyShard = true
            this.stateCurrentlyHearthbeat = true
            this.shardErrorText = ''
            this.heartbeat = 1
        } else if (message.startsWith('[WS => Shard 0] [HeartbeatTimer] Sending a heartbeat.')) {
            this.shardCurrentlyLoadingText = '\'Heartbeat\' küldése'
            this.stateCurrentlyHearthbeat = true
            this.shardErrorText = ''
            this.heartbeat = 2
        } else if (message.startsWith('[WS => Manager] Couldn\'t reconnect or fetch information about the gate')) {
            this.shardErrorText = 'Couldn\'t reconnect or fetch information about the gate'
        } else if (message.startsWith('[WS => Manager] Possible network error occurred. Retrying in 5s...')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Újracsatlakozás...'
            this.stateCurrentlyShard = false
            this.shardErrorText = 'Possible network error occurred.'
        } else if (message.startsWith('[WS => Shard 0] [DESTROY]')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Shard törölve'
            this.stateCurrentlyShard = false
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] Tried to send packet \'{')) {
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] Shard was destroyed but no WebSocket connection was present! Reconnecting...')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Újracsatlakozás...'
            this.stateCurrentlyShard = false
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Manager] Manager was destroyed. Called by:')) {
            this.shardCurrentlyLoading = false
            this.shardCurrentlyLoadingText = ''
            this.shardErrorText = 'Manager was destroyed.'
        } else if (message.startsWith('[WS => Shard 0] [CLOSE]')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Kilépés...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] Clearing the heartbeat interval.')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = '\'heartbeat\' időtúllépés törölve'
            this.stateCurrentlyHearthbeat = false
            this.shardErrorText = ''
            this.heartbeat = 0
        } else if (message.startsWith('[WS => Shard 0] Session ID is present, attempting an immediate reconnect...')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Újracsatlakozás...'
            this.stateCurrentlyShard = false
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] WS State: CLOSED')) {
            this.shardCurrentlyLoading = false
            this.ping = 0
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] A connection object was found. Cleaning up before continuing.')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Tisztítás...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] WS State: CONNECTING')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Csatlakozás...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] Failed to connect to the gateway, requeueing...')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Újracsatlakozás...'
            this.stateCurrentlyShard = false
            this.shardErrorText = 'Failed to connect to the gateway, requeueing...'
        } else if (message.startsWith('[WS => Manager] Shard Queue Size: 1; continuing in 5 seconds...')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Folytatás...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] [RESUME]')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Folytatás...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] [RESUMED]')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Folytatás...'
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] [ResumeHeartbeat] Sending a heartbeat')) {
            this.shardCurrentlyLoadingText = '\'Heartbeat\' küldése'
            this.shardCurrentlyLoading = true
            this.shardErrorText = ''
            this.heartbeat = 1
        } else if (message.startsWith('[WS => Shard 0] [INVALID SESSION] Resumable: false.')) {
            this.shardErrorText = '[INVALID SESSION]'
        } else if (message.startsWith('[WS => Shard 0] An open connection was found, attempting an immediate identify.')) {
            this.shardErrorText = ''
        } else if (message.startsWith('[WS => Shard 0] [RECONNECT] Discord asked us to reconnect')) {
            this.shardCurrentlyLoading = true
            this.shardCurrentlyLoadingText = 'Újracsatlakozás...'
            this.stateCurrentlyShard = false
            this.shardErrorText = ''
        } else if (message.startsWith('429 hit on route /gateway/bot')) {
        } else if (message.startsWith('[VOICE (') && message.includes(')]: [WS] >> {')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Kommunikálás a szerverrel...'
        } else if (message.includes('Ready with authentication details:')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Hitelesítés kész'
        } else if (message.startsWith('[VOICE (') && message.includes(')]: [WS] << {')) {
            this.ytdlCurrentlyLoading = false
            this.ytdloadingText = 'Kész!'
        } else if (message.includes(')]: Sending voice state update: {')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Hangállapot-frissítés küldése...'
        } else if (message.includes('received voice state update:')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Hangállapot-frissítés kész'
        } else if (message.includes('connection? true')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Kapcsolat: kész'
        } else if (message.includes('Setting sessionID')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Szerver azonosító kész'
        } else if (message.includes('Authenticated with sessionID')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... A szerver azonosítóval hitelesítve'
        } else if (message.includes('received voice server')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Fogadott hangszerver'
        } else if (message.includes('voiceServer guild')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés...'
        } else if (message.includes(')]: Token "')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés...'
        } else if (message.includes('Endpoint resolved as')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Végpont feloldva'
        } else if (message.includes('Connect triggered')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Csatlakozás előkészítve'
        } else if (message.includes('connect requested')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Csatlakozás...'
        } else if (message.includes(')]: [WS] connecting,')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Csatlakozás...'
        } else if (message.includes(')]: [WS] opened at gateway')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Csatlakozás...'
        } else if (message.includes(')]: Selecting the')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Csatlakozás...'
        } else if (message.includes(')]: [UDP] created socket')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Csatlakozás...'
        } else if (message.includes(' Sending IP discovery packet: ')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés... Csatlakozás...'
        } else if (message.includes('Successfully sent IP discovery packet')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés...'
        } else if (message.includes(')]: [UDP] message: ')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Betöltés...'
        } else if (message.includes(')]: [UDP] << {')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Videó betöltése...'
        } else if (message.includes('Connection clean up')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Lecsatlakozás...'
        } else if (message.includes('[WS] shutdown requested')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Lecsatlakozás...'
        } else if (message.includes('[WS] reset requested')) {
            this.ytdlCurrentlyLoading = true
            this.ytdloadingText = 'Lecsatlakozás...'
        } else if (message.includes('[WS] closed')) {
            this.ytdlCurrentlyLoading = false
            this.ytdlCurrentlyPlaying = false
            this.ytdloadingText = 'Betöltés...'
        } else if (message.includes(')]: Error [WS_NOT_OPEN]: Websocket not open to send')) {
        } else if (message.includes(')]: [UDP] >> ERROR: Error: send')) {
        } else {
        }
    }
}

module.exports = { StatesManager }