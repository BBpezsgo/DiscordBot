const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const Discord = require('discord.js')
const { LogManager, LogMsg, MessageCodes } = require('../functions/log.js')
const { databaseManager } = require('../functions/databaseManager.js')
const { StatesManager } = require('../functions/statesManager')

const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + '\033[37m' + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + '\033[37m' + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + '\033[37m' + ']'
const SERVER = '[' + '\033[36m' + 'SERVER' + '\033[40m' + '' + '\033[37m' + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + '\033[37m' + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + '\033[37m' + ']'

class WebSocket {
    /**
     * @param {string} password
     * @param {string} ip
     * @param {number} port
     * @param {Discord.Client} client
     * @param {LogManager} logManager
     * @param {databaseManager} database
     * @param {StatesManager} statesManager
     */
    constructor(password, ip, port, client, logManager, database, StartBot, StopBot, statesManager) {
        this.password = password
        this.client = client
        this.StartBot = StartBot
        this.StopBot = StopBot

        this.logManager = logManager
        this.database = database

        this.statesManager = statesManager

        this.app = express()
        this.app.engine('hbs', engine({
            extname: '.hbs',
            defaultLayout: 'layout',
            layoutsDir: __dirname + '/layouts'
        }))
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.set('view engine', 'hbs')
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())

        this.registerRoots()

        this.app.get('/data/status', function(req, res) {
            var dataToSendToClient = {'message': 'error message from server'}
            res.send(JSON.stringify(dataToSendToClient))
         });

        this.server = this.app.listen(port, ip, () => {
            this.logManager.Log(SERVER + ': ' + 'Listening on http://' + this.server.address().address + ":" + this.server.address().port, true, null, MessageCodes.HandlebarsFinishLoading)
            this.statesManager.handlebarsDone = true
            this.statesManager.handlebarsURL = 'http://' + this.server.address().address + ":" + this.server.address().port
        })
        this.server.on('error', (err) => {
            if (err.message.startsWith('listen EADDRNOTAVAIL: address not available')) {
                this.statesManager.handlebarsErrorMessage = 'Address not available';
            } else {
                this.statesManager.handlebarsErrorMessage = err.message;
            }
        })
        this.server.on('checkContinue', () => {
            this.logManager.Log(DEBUG + ': ' + "Check continue", true)
        })
        this.server.on('checkExpectation', () => {
            this.logManager.Log(DEBUG + ': ' + "Check expectation", true)
        })
        this.server.on('clientError', (err, socket) => {
            this.logManager.Log(ERROR + ': ' + err, true)
        })
        this.server.on('close', () => {
            this.statesManager.handlebarsDone = false
            this.statesManager.handlebarsURL = ''
            this.logManager.Log(SERVER + ': ' + "Closed", true)
        })
        this.server.on('connect', (req, socket, head) => {
            this.logManager.Log(DEBUG + ': ' + "connect", true)
        })
        this.server.on('connection', (socket) => {
            this.statesManager.handlebarsClients.push(socket)
            this.statesManager.handlebarsClientsTime.push(10)
        })
        this.server.on('request', () => {
            this.statesManager.handlebarsRequiests.push(10)
        })
        this.server.on('upgrade', (req, socket, head) => {
            this.logManager.Log(DEBUG + ': ' + "upgrade", true)
        })
    }

    checkPassword(_password) {
        return (_password == this.password)
    }

    GetClientStats() {
        if (this.client.user != undefined) {
            return { username: this.client.user.username, avatar: this.client.user.avatarURL(), discriminator: this.client.user.discriminator, ping: this.client.ws.ping, status: 'online', enStart: 'none', enStop: 'block' }
        } else {
            return { username: "Username", avatar: "defaultAvatar.png", discriminator: "0000", ping: 0, status: 'offline', enStart: 'block', enStop: 'none' }
        }
    }

    registerRoots() {
        this.app.get('/', (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            const _password = req.query.password

            if (_password == undefined) {
                res.render('login', {})
                return
            }

            if (!this.checkPassword(_password)) {
                res.render('error', {})
                return
            }

            const view = req.query.view

            if (view == 0) {
                var servers = []
                this.client.guilds.cache.forEach(s => {
                    //s.id
                    //s.createdAt
                    //s.joinedAt
                    //s.ownerID
                    //s.fetch
                    servers.push({ id: s.id, iconUrl: s.iconURL() })
                })

                var users = []
                this.client.users.cache.forEach(u => {
                    //u.bot
                    //u.createdAt
                    //u.id
                    //u.fetch
                    if (u.id != "738030244367433770") {
                        users.push({ id: u.id, username: u.username, avatar: u.avatarURL(), status: 'offline', selected: 0, bannerColor: "#00000000", discriminator: u.discriminator })
                    }
                })

                var logs = []
                this.logManager.logs.forEach(log => {
                    if (log.priv == false) {
                        logs.push({ message: log.message, time: log.time, type: log.type })
                    }
                });

                logs = logs.reverse()

                res.render('botView', {
                    title: 'Ügyintéző Dashboard',
                    token: _password,
                    users,
                    servers,
                    client: this.GetClientStats(),
                    logs
                })
            } else if (view == 1) {
                var servers = []
                this.client.guilds.cache.forEach(s => {
                    servers.push({ id: s.id, iconUrl: s.iconURL() })
                })

                var _selectedServer = null
                if (req.query.server != undefined) {
                    const s = this.client.guilds.cache.get(req.query.server)
                    var _selectedServer = { id: s.id, name: s.name, banner: s.bannerURL() }
                }

                var users = []
                this.client.users.cache.forEach(u => {
                    if (u.id != "738030244367433770") {
                        users.push({ id: u.id, username: u.username, avatar: u.avatarURL(), status: 'offline', selected: 0, bannerColor: "#00000000", discriminator: u.discriminator })
                    }
                })

                var _selectedChannel = null
                var _selectedUser = null
                var _messages = []
                if (req.query.user != undefined) {
                    const u = this.client.users.cache.get(req.query.user.toString())
                    _selectedUser = { id: u.id, username: u.username, avatar: u.avatarURL(), status: 'offline', channel: null, actions: { deleteDM: '0', createDM: '0' } }
                    const c = u.dmChannel
                    if (c != undefined) {
                        _selectedChannel = { id: c.id, userId: u.id, username: u.username }
                        _selectedUser.channel = _selectedChannel
                        c.messages.cache.forEach(m => {
                            _messages.push({ id: m.id, context: m.content, time: dateToHumanTime(m.createdAt), author: { id: m.author.id, username: m.author.username, avatar: m.author.avatarURL() } })
                        })
                        _selectedUser.actions.createDM = ''
                        _selectedUser.actions.name = 'deleteUserDM'
                    } else {
                        _selectedUser.actions.deleteDM = ''
                        _selectedUser.actions.name = 'createUserDM'
                    }
                }

                if (_selectedUser != null) {

                    for (let i = 0; i < users.length; i++) {
                        const c = users[i]
                        if (c.id == _selectedUser.id) {
                            c.selected = 1
                            break
                        }
                    }
                }

                res.render('discordView', {
                    title: 'Ügyintéző Dashboard',
                    token: _password,
                    users,
                    servers,
                    selectedServer: _selectedServer,
                    selectedUser: _selectedUser,
                    client: this.GetClientStats(),
                    messages: _messages
                })
            } else if (view == 2) {
                var servers = []
                this.client.guilds.cache.forEach(s => {
                    servers.push({ id: s.id, iconUrl: s.iconURL() })
                })

                var _selectedServer = null
                if (req.query.server != undefined) {
                    const s = this.client.guilds.cache.get(req.query.server)
                    var _selectedServer = { id: s.id, name: s.name, banner: s.bannerURL() }
                }

                var chans = []
                if (_selectedServer != null) {
                    let _p = 0
                    this.client.guilds.cache.get(_selectedServer.id).channels.cache.forEach(c => {
                        if (c.type == "GUILD_NEWS" || c.type == "GUILD_TEXT" || c.type == "GUILD_STORE") {
                            if (c.parent == undefined) {
                                chans.push({ id: c.id, name: c.name, type: c.type, selected: 0, pos: -100 + c.rawPosition, channelType: 'channel' })
                            } else {
                                chans.push({ id: c.id, name: c.name, type: c.type, selected: 0, pos: _p + (c.rawPosition / 100) + c.parent.rawPosition, channelType: 'channel' })
                            }
                        } else if (c.type == "GUILD_CATEGORY") {
                            chans.push({ id: 0, name: c.name, type: c.type, selected: 0, pos: _p + c.rawPosition, channelType: 'group' })
                        }
                    })
                }

                chans.sort(function (a, b) { return a.pos - b.pos });

                var _selectedChannel = null
                var _messages = []
                var _members = []
                if (req.query.channel != undefined) {
                    const c = this.client.channels.cache.get(req.query.channel.toString())
                    if (c != undefined) {
                        _selectedChannel = { id: c.id, name: c.name, type: c.type }
                        if (c.type == "GUILD_TEXT") {
                            /**
                             * @type {Discord.TextChannel}
                             */
                            const cT = c
                            _selectedChannel = { id: c.id, name: c.name, type: c.type, description: cT.topic }
                            cT.messages.cache.forEach(m => {
                                _messages.push({ id: m.id, context: m.content, time: dateToHumanTime(m.createdAt), author: { id: m.author.id, username: m.author.username, avatar: m.author.avatarURL() } })
                            })
                            cT.members.forEach(u => {
                                _members.push({ id: u.id, displayName: u.displayName, avatar: u.user.avatarURL(), displayColor: u.displayHexColor, status: 'offline' })
                            })
                        }
                    }
                }

                if (_selectedChannel != null) {

                    for (let i = 0; i < chans.length; i++) {
                        const c = chans[i]
                        if (c.id == _selectedChannel.id) {
                            c.selected = 1
                            break
                        }
                    }
                }

                var _title = "?"
                if (_selectedChannel == null) {
                    _title = "Ügyintéző Dashboard"
                } else {
                    _title = _selectedChannel.name
                }

                res.render('serverView', {
                    title: _title,
                    token: _password,
                    channels: chans,
                    servers,
                    selectedServer: _selectedServer,
                    selectedChannel: _selectedChannel,
                    client: this.GetClientStats(),
                    messages: _messages,
                    members: _members
                })
            } else if (view == 3) {
                var userId = req.query.user
                var _dataBasic, _dataBackpacks, __score;

                if (userId != undefined) {
                    _dataBasic = this.database.dataBasic[userId]
                    _dataBackpacks = this.database.dataBackpacks[userId]
                    var __score = _dataBasic.score
                }

                var _rankName = xpRankText(__score)
                var next = xpRankNext(__score)
                var _scorePercent = __score / next * 100
                var _rankIcon = xpRankIcon(__score)

                var _score = {rankName: _rankName, rankIcon: _rankIcon, percent: _scorePercent}

                res.render('databaseIframe', {
                    token: _password,
                    dataBasic: _dataBasic,
                    dataBackpacks: _dataBackpacks,
                    score: _score
                })
            } else if (view == 5) {
                res.render('statusPanel', {
                    token: _password,
                    client: this.GetClientStats()
                })
            }
        })

        this.app.post('/sendMessage', (req, res) => {
            var _pass = req.body.token
            var text = req.body.text
            var channelId = req.body.channel

            if (!this.checkPassword(_pass)) { return }

            var chan = this.client.channels.cache.get(channelId)

            if (chan) {
                chan.send(text)
            }

            res.render('serverView', {
                title: chan.name,
                token: _pass,
                chans
            })
        })

        this.app.post('/sendMessageUser', (req, res) => {
            var _pass = req.body.token
            var text = req.body.text
            var userId = req.body.user

            if (!this.checkPassword(_pass)) { return }

            var chan = this.client.users.cache.get(userId).dmChannel

            if (chan) {
                chan.send(text)
            }

            res.render('serverView', {
                title: 'Ügyintéző Dashboard',
                token: _pass
            })
        })

        this.app.post('/fetchChannelMessages', (req, res) => {
            var _pass = req.body.token
            var channelId = req.body.id

            if (!this.checkPassword(_pass)) {
                res.status(401).send("Unauthorized")
                return
            }

            var chan = this.client.channels.cache.get(channelId)

            if (!chan) { 
                res.status(500).send("Internal Server Error")
                return
            }

            chan.messages.fetch()

            res.status(200).send("OK")
        })

        this.app.post('/deleteUserDM', (req, res) => {
            var _pass = req.body.token
            var userId = req.body.id

            if (!this.checkPassword(_pass)) { return }

            var user = this.client.users.cache.get(userId)

            if (!user) { return }

            user.deleteDM()
        })

        this.app.post('/createUserDM', (req, res) => {
            var _pass = req.body.token
            var userId = req.body.id

            if (!this.checkPassword(_pass)) { return }

            var user = this.client.users.cache.get(userId)

            if (!user) { return }

            user.createDM()
        })

        this.app.post('/fetchUser', (req, res) => {
            var _pass = req.body.token
            var userId = req.body.id

            if (!this.checkPassword(_pass)) { return }

            var user = this.client.users.cache.get(userId)

            if (!user) { return }

            user.fetch()
        })

        this.app.post('/startBot', (req, res) => {
            var _pass = req.body.token

            if (!this.checkPassword(_pass)) { return }

            this.StartBot()
        })

        this.app.post('/stopBot', (req, res) => {
            var _pass = req.body.token

            if (!this.checkPassword(_pass)) { return }

            this.StopBot()
        })
    }
}

/**@param {Date} date @returns {string}*/
function dateToHumanTime(date) {
    const minutes = date.getMinutes()
    const hours = date.getHours()
    const days = date.getDate()
    const months = date.getMonth()
    const years = date.getFullYear()

    const currentDate = new Date(Date.now())

    if (days < currentDate.getDate()) {
        const days2 = currentDate.getDate() - days
        if (days2 == 1) {
            return "tegnap " + OneNumberToTwoNumber(hours) + ":" + OneNumberToTwoNumber(minutes) + "-kor"
        } else if (days2 == 2) {
            return "tegnapelőtt " + OneNumberToTwoNumber(hours) + ":" + OneNumberToTwoNumber(minutes) + "-kor"
        } else {
            return years + "." + months + "." + days + "."
        }
    } else {
        return "ma " + OneNumberToTwoNumber(hours) + ":" + OneNumberToTwoNumber(minutes) + "-kor"
    }
}

/**@param {number} number @returns {string} */
function OneNumberToTwoNumber(number) {
    if (number < 10) {
        return "0" + number
    } else {
        return number.toString()
    }
}

function xpRankIcon(score) {
    let rank = ''
    if (score < 1000) {
        rank = '🔰' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/japanese-symbol-for-beginner_1f530.png'
    } else if (score < 5000) {
        rank = 'Ⓜ️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-latin-capital-letter-m_24c2.png'
    } else if (score < 10000) {
        rank = '📛' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/name-badge_1f4db.png'
    } else if (score < 50000) {
        rank = '💠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/diamond-shape-with-a-dot-inside_1f4a0.png'
    } else if (score < 80000) {
        rank = '⚜️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/fleur-de-lis_269c.png'
    } else if (score < 100000) {
        rank = '🔱' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/trident-emblem_1f531.png'
    } else if (score < 140000) {
        rank = '㊗️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-congratulation_3297.png'
    } else if (score < 180000) {
        rank = '🉐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-advantage_1f250.png'
    } else if (score < 250000) {
        rank = '🉑' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/circled-ideograph-accept_1f251.png'
    } else if (score < 350000) {
        rank = '💫' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/dizzy-symbol_1f4ab.png'
    } else if (score < 500000) {
        rank = '🌠' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/shooting-star_1f320.png'
    } else if (score < 780000) {
        rank = '☄️' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/comet_2604.png'
    } else if (score < 1000000) {
        rank = '🪐' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/ringed-planet_1fa90.png'
    } else if (score < 1500000) {
        rank = '🌀' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/cyclone_1f300.png'
    } else if (score < 1800000) {
        rank = '🌌' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/milky-way_1f30c.png'
    } else {
        rank = '🧿' //'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png'
    }
    return rank
}
function xpRankText(score) {
    let rankName = ''
    if (score < 1000) {
        rankName = 'Ujjonc'
    } else if (score < 5000) {
        rankName = 'Zöldfülű'
    } else if (score < 10000) {
        rankName = 'Felfedező'
    } else if (score < 50000) {
        rankName = 'Haladó'
    } else if (score < 80000) {
        rankName = 'Törzsvendég'
    } else if (score < 100000) {
        rankName = 'Állampolgár'
    } else if (score < 140000) {
        rankName = 'Csoportvezető'
    } else if (score < 180000) {
        rankName = 'Csoportvezér'
    } else if (score < 250000) {
        rankName = 'Vezér'
    } else if (score < 350000) {
        rankName = 'Polgárelnök'
    } else if (score < 500000) {
        rankName = 'Miniszterelnök'
    } else if (score < 780000) {
        rankName = 'Elnök'
    } else if (score < 1000000) {
        rankName = 'Világdiktátor'
    } else if (score < 1500000) {
        rankName = 'Galaxis hódító'
    } else if (score < 1800000) {
        rankName = 'Univerzum birtokló'
    } else {
        rankName = 'Isten'
    }
    return rankName
}
function xpRankPrevoius(score) {
    let prevoius = 0
    if (score < 1000) {
        prevoius = 0
    } else if (score < 5000) {
        prevoius = 1000
    } else if (score < 10000) {
        prevoius = 5000
    } else if (score < 50000) {
        prevoius = 10000
    } else if (score < 80000) {
        prevoius = 50000
    } else if (score < 100000) {
        prevoius = 80000
    } else if (score < 140000) {
        prevoius = 100000
    } else if (score < 180000) {
        prevoius = 140000
    } else if (score < 250000) {
        prevoius = 180000
    } else if (score < 350000) {
        prevoius = 250000
    } else if (score < 500000) {
        prevoius = 350000
    } else if (score < 780000) {
        prevoius = 500000
    } else if (score < 1000000) {
        prevoius = 780000
    } else if (score < 1500000) {
        prevoius = 1000000
    } else if (score < 1800000) {
        prevoius = 1500000
    }
    return prevoius
}
function xpRankNext(score) {
    let next = 0
    if (score < 1000) {
        next = 1000
    } else if (score < 5000) {
        next = 5000
    } else if (score < 10000) {
        next = 10000
    } else if (score < 50000) {
        next = 50000
    } else if (score < 80000) {
        next = 80000
    } else if (score < 100000) {
        next = 100000
    } else if (score < 140000) {
        next = 140000
    } else if (score < 180000) {
        next = 180000
    } else if (score < 250000) {
        next = 250000
    } else if (score < 350000) {
        next = 350000
    } else if (score < 500000) {
        next = 500000
    } else if (score < 780000) {
        next = 780000
    } else if (score < 1000000) {
        next = 1000000
    } else if (score < 1500000) {
        next = 1500000
    } else if (score < 1800000) {
        next = 1800000
    }
    return next
}
function abbrev(num) {
    if (!num || isNaN(num)) return "0";
    if (typeof num === "string") num = parseInt(num);
    let decPlaces = Math.pow(10, 1);
    var abbrev = ["E", "m", "M", "b", "B", "tr", "TR", "qa", "QA", "qi", "QI", "sx", "SX", "sp", "SP"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= num) {
            num = Math.round((num * decPlaces) / size) / decPlaces;
            if (num == 1000 && i < abbrev.length - 1) {
                num = 1;
                i++;
            }
            num += abbrev[i];
            break;
        }
    }
    return num;
}

module.exports = WebSocket
