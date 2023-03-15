const { CliColor } = require("./enums")

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

        /** @type {{IsLoading: boolean, LoadingText: string, IsPlaying: boolean, PlayingText: string, PlayingUrl: string}} */
        this.Ytdl = {
            IsLoading: false,
            LoadingText: '',
            IsPlaying: false,
            PlayingText: '',
            PlayingUrl: ''
        }

        /** @type {{IsLoading: boolean, LoadingText: string, LoadingTextColor: string | null, Error: string}} */
        this.Shard = {
            IsLoading: false,
            LoadingText: '',
            LoadingTextColor: null,
            Error: ''
        }

        /** @type {{IsDone: boolean, Error: string, URL: string, ClientsTime: number[], Clients: Socket[], Requests: number[]}} */
        this.WebInterface = {
            IsDone: false,
            Error: '',
            URL: '',
            ClientsTime: [],
            Clients: [],
            Requests: []
        }

        /**@type {number} */
        this.heartbeat = 0
        /**@type {number} */
        this.hello = 0

        /** @type {{Created: number, Deleted: number, All: number}} */
        this.Commands = {
            Created: 0,
            Deleted: 0,
            All: 0
        }

        /** @type {{AllProcessed: boolean, LoadingText: string, LoadingText2: string}} */
        this.News = {
            AllProcessed: false,
            LoadingText: '',
            LoadingText2: ''
        }

        /** @type {{Text: string}} */
        this.WeatherReport = {
            Text: ''
        }

        /** @type {{Text: string, Service: string}} */
        this.MVMReport = {
            Text: '',
            Service: ''
        }

        /** @type {{Text: string}} */
        this.ExchangeReport = {
            Text: ''
        }

        /** @type {{SaveText: string, LoadText: string, ParsingText: string, BackupText: string}} */
        this.Database = {
            SaveText: '',
            LoadText: '',
            ParsingText: '',
            BackupText: ''
        }
    }

    /**@param {string} message */
    ProcessDebugMessage(message) {
        if (message.startsWith('Provided token: ')) {
        } else if (message.startsWith('Preparing to connect to the gateway...')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Preparing to connect...'
            this.Shard.LoadingTextColor = null
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Manager] Fetched Gateway Information')) {
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Manager] Session Limit Information')) {
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Manager] Spawning shards: ')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Spawning shards...'
            this.Shard.LoadingTextColor = null
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] [CONNECT]')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Connected'
            this.Shard.LoadingTextColor = CliColor.FgGreen
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] Setting a HELLO timeout for ')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = ' Setting a\'HELLO\' timeout...'
            this.Shard.Error = ''
            this.hello = 1
        } else if (message.startsWith('[WS => Shard 0] [CONNECTED] wss://gateway.discord.gg/?v=6&encoding=json in ')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Connected'
            this.Shard.LoadingTextColor = CliColor.FgGreen
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] Clearing the HELLO timeout.')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Clearing the \'HELLO\' timeout'
            this.Shard.Error = ''
            this.hello = 0
        } else if (message.startsWith('[WS => Shard 0] Setting a heartbeat interval for ')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = ' Setting\'heartbeat\'...'
            this.Shard.Error = ''
            this.heartbeat = 1
        } else if (message.startsWith('[WS => Shard 0] [IDENTIFY] Shard 0/1')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Identifying shard...'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] [READY] Session ')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Ready'
            this.Shard.LoadingTextColor = CliColor.FgGreen
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] [ReadyHeartbeat] Sending a heartbeat.')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = ' Sending a\'heartbeat\'...'
            this.Shard.Error = ''
            this.heartbeat = 2
        } else if (message.startsWith('[WS => Shard 0] Shard received all its guilds. Marking as fully ready.')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Finishing...'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] Heartbeat acknowledged, latency of ')) {
            this.ping = message.replace('[WS => Shard 0] Heartbeat acknowledged, latency of ', '')
            this.Shard.Error = ''
            this.heartbeat = 1
        } else if (message.startsWith('[WS => Shard 0] [HeartbeatTimer] Sending a heartbeat.')) {
            this.Shard.LoadingText = 'Sending a \'Heartbeat\''
            this.Shard.Error = ''
            this.heartbeat = 2
        } else if (message.startsWith('[WS => Manager] Couldn\'t reconnect or fetch information about the gate')) {
            this.Shard.Error = 'Couldn\'t reconnect or fetch information about the gate'
        } else if (message.startsWith('[WS => Manager] Possible network error occurred. Retrying in 5s...')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Reconnecting...'
            this.Shard.LoadingTextColor = CliColor.FgYellow
            this.Shard.Error = 'Possible network error occurred.'
        } else if (message.startsWith('[WS => Shard 0] [DESTROY]')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Shard destroyed'
            this.Shard.LoadingTextColor = CliColor.FgRed
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] Tried to send packet \'{')) {
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] Shard was destroyed but no WebSocket connection was present! Reconnecting...')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Reconnecting...'
            this.Shard.LoadingTextColor = CliColor.FgYellow
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Manager] Manager was destroyed. Called by:')) {
            this.Shard.IsLoading = false
            this.Shard.LoadingText = ''
            this.Shard.Error = 'Manager was destroyed.'
        } else if (message.startsWith('[WS => Shard 0] [CLOSE]')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Closing...'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] Clearing the heartbeat interval.')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Clearing the \'heartbeat\' interval'
            this.Shard.Error = ''
            this.heartbeat = 0
        } else if (message.startsWith('[WS => Shard 0] Session ID is present, attempting an immediate reconnect...')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Reconnecting...'
            this.Shard.LoadingTextColor = CliColor.FgYellow
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] WS State: CLOSED')) {
            this.Shard.IsLoading = false
            this.ping = 0
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] A connection object was found. Cleaning up before continuing.')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Cleaning up...'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] WS State: CONNECTING')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Connecting...'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] Failed to connect to the gateway, requeueing...')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Reconnecting...'
            this.Shard.Error = 'Failed to connect to the gateway, requeueing...'
        } else if (message.startsWith('[WS => Manager] Shard Queue Size: 1; continuing in 5 seconds...')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Resume...'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] [RESUME]')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Resume...'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] [RESUMED]')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Resumed'
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] [ResumeHeartbeat] Sending a heartbeat')) {
            this.Shard.LoadingText = 'Sending a \'Heartbeat\''
            this.Shard.IsLoading = true
            this.Shard.Error = ''
            this.heartbeat = 1
        } else if (message.startsWith('[WS => Shard 0] [INVALID SESSION] Resumable: false.')) {
            this.Shard.Error = '[INVALID SESSION]'
        } else if (message.startsWith('[WS => Shard 0] An open connection was found, attempting an immediate identify.')) {
            this.Shard.Error = ''
        } else if (message.startsWith('[WS => Shard 0] [RECONNECT] Discord asked us to reconnect')) {
            this.Shard.IsLoading = true
            this.Shard.LoadingText = 'Reconnecting...'
            this.Shard.LoadingTextColor = CliColor.FgYellow
            this.Shard.Error = ''
        } else if (message.startsWith('429 hit on route /gateway/bot')) {
        } else if (message.startsWith('[VOICE (') && message.includes(')]: [WS] >> {')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Communicating...'
        } else if (message.includes('Ready with authentication details:')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Loading...'
        } else if (message.startsWith('[VOICE (') && message.includes(')]: [WS] << {')) {
            this.Ytdl.IsLoading = false
            this.Ytdl.LoadingText = 'Ready'
        } else if (message.includes(')]: Sending voice state update: {')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Sending voice state update...'
        } else if (message.includes('received voice state update:')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Received voice state update'
        } else if (message.includes('connection? true')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Connected'
        } else if (message.includes('Setting sessionID')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Setting session ID'
        } else if (message.includes('Authenticated with sessionID')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Authenticated'
        } else if (message.includes('received voice server')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Voice server received'
        } else if (message.includes('voiceServer guild')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Loading...'
        } else if (message.includes(')]: Token "')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Loading...'
        } else if (message.includes('Endpoint resolved as')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Endpoint resolved'
        } else if (message.includes('Connect triggered')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Connect triggered'
        } else if (message.includes('connect requested')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Connect requested...'
        } else if (message.includes(')]: [WS] connecting,')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Connecting...'
        } else if (message.includes(')]: [WS] opened at gateway')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Opened at gateway...'
        } else if (message.includes(')]: Selecting the')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Csatlakozás...'
        } else if (message.includes(')]: [UDP] created socket')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'UDP socket created...'
        } else if (message.includes(' Sending IP discovery packet: ')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Sending IP discovery packet...'
        } else if (message.includes('Successfully sent IP discovery packet')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Successfully sent IP discovery packet...'
        } else if (message.includes(')]: [UDP] message: ')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Loading...'
        } else if (message.includes(')]: [UDP] << {')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Loading...'
        } else if (message.includes('Connection clean up')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Connection clean up...'
        } else if (message.includes('[WS] shutdown requested')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Shutdown requested...'
        } else if (message.includes('[WS] reset requested')) {
            this.Ytdl.IsLoading = true
            this.Ytdl.LoadingText = 'Reset requested...'
        } else if (message.includes('[WS] closed')) {
            this.Ytdl.IsLoading = false
            this.Ytdl.IsPlaying = false
            this.Ytdl.LoadingText = 'Closed...'
        } else if (message.includes(')]: Error [WS_NOT_OPEN]: Websocket not open to send')) {
        } else if (message.includes(')]: [UDP] >> ERROR: Error: send')) {
        } else {
        }
    }
}

module.exports = { StatesManager }