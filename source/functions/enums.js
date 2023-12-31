const { ActivityType } = require('discord.js')

const ChannelId = {
    Quiz: "799340273431478303",
    IncomingNews: "902894789874311198",
    ProcessedNews: "746266528508411935"
}

const fontColor = '\x1b[37m'

const CliColor = {
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",

    FgDefault: fontColor
}

const INFO = '[' + CliColor.FgBlue + 'INFO' + CliColor.BgBlack + '' + CliColor.FgWhite + ']'
const ERROR = '[' + CliColor.FgRed + 'ERROR' + CliColor.BgBlack + '' + CliColor.FgWhite + ']'
const WARNING = '[' + CliColor.FgYellow + 'WARNING' + CliColor.BgBlack + '' + CliColor.FgWhite + ']'
const SHARD = '[' + CliColor.FgMagenta + 'SHARD' + CliColor.BgBlack + '' + CliColor.FgWhite + ']'
const DEBUG = '[' + CliColor.FgBlack + 'DEBUG' + CliColor.BgBlack + '' + CliColor.FgWhite + ']'
const DONE = '[' + CliColor.FgGreen + 'DONE' + CliColor.BgBlack + '' + CliColor.FgWhite + ']'

const Discord = require('discord.js')

const Color = {
    /** @type {Discord.ColorResolvable} */
    Error: "#ed4245",
    /** @type {Discord.ColorResolvable} */
    ErrorLight: "#f57531",
    /** @type {Discord.ColorResolvable} */
    Warning: "#faa81a",
    /** @type {Discord.ColorResolvable} */
    Done: "#3ba55d",
    /** @type {Discord.ColorResolvable} */
    White: "#dcddde",
    /** @type {Discord.ColorResolvable} */
    Silver: "#b9bbbe",
    /** @type {Discord.ColorResolvable} */
    Gray: "#8e9297",
    /** @type {Discord.ColorResolvable} */
    DimGray: "#72767d",
    /** @type {Discord.ColorResolvable} */
    Highlight: "#5865f2",
    /** @type {Discord.ColorResolvable} */
    Purple: "#9b59b6",
    /** @type {Discord.ColorResolvable} */
    Pink: "#e91e63",
    /** @type {Discord.ColorResolvable} */
    DarkPink: "#ad1457"
}

const ColorRoles = {
    red: "850016210422464534",
    yellow: "850016458544250891",
    blue: "850016589155401758",
    orange: "850016531848888340",
    green: "850016722039078912",
    purple: "850016668352643072",
    invisible: "850016786186371122"
}

/** @type {import('discord.js').ActivityOptions[]} */
const activitiesDesktop = [
    { name: 'Bruh', type: ActivityType.Custom, state: 'Bruh' },
    // { name: 'Visual Studio', type: ActivityType.Playing },
    // { name: 'Unity', type: ActivityType.Playing },
]

/** @type {import('discord.js').ActivityOptions[]} */
const activitiesMobile = [
    { name: 'Photon PUN documentation', type: ActivityType.Watching, browser: "DISCORD IOS" },
    { name: 'Discord Guide', type: ActivityType.Watching, browser: "DISCORD IOS" },
    { name: 'Node.js documentation', type: ActivityType.Watching, browser: "DISCORD IOS" },
    { name: 'Unity tutorials', type: ActivityType.Watching, browser: "DISCORD IOS" },
]

const usersWithTax = [
    '415078291574226955', '726127512521932880', '575727604708016128',
    '591218715803254784'
]

const WsStatus = [
    'READY',
    'CONNECTING',
    'RECONNECTING',
    'IDLE',
    'NEARLY',
    'DISCONNECTED',
    'WAITING_FOR_GUILDS',
    'IDENTIFYING',
    'RESUMING'
]

const WsStatusText = [
    'Ready',
    'Connecting...',
    'Reconnecting...',
    'Idle',
    'Nearly',
    'Disconnected',
    'Waiting for guilds...',
    'Identifying...',
    'Resuming...'
]

const NsfwLevel = {
    0: 'Default',
    1: 'Explicit',
    2: 'Safe',
    3: 'Age restricted',
}

const MFALevel = {
    0: 'None',
    1: 'Elevated',
}

const VerificationLevel = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    VERY_HIGH: 'Very high',
}

module.exports = { VerificationLevel, MFALevel, NsfwLevel, WsStatusText, WsStatus, INFO, ERROR, WARNING, SHARD, DEBUG, DONE, Color, ColorRoles, activitiesDesktop, activitiesMobile, usersWithTax, ChannelId, CliColor }