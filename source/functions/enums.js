
const ChannelId = {
    Quiz: "799340273431478303"
}

const fontColor = '\033[37m'

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

const Color = {
    Error: "#ed4245",
    ErrorLight: "#f57531",
    Warning: "#faa81a",
    Done: "#3ba55d",
    White: "#dcddde",
    Silver: "#b9bbbe",
    Gray: "#8e9297",
    DimGray: "#72767d",
    Highlight: "#5865f2",
    Purple: "#9b59b6",
    Pink: "#e91e63",
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

const activitiesDesktop = [
    { name: 'Nothing 2', type: 'PLAYING' },
    { name: 'Visual Studio', type: 'PLAYING' },
    { name: 'Unity', type: 'PLAYING' },
]

const activitiesMobile = [
    { name: 'Photon PUN documentation', type: 3, browser: "DISCORD IOS" },
    { name: 'Discord Devolper Portal', type: 3, browser: "DISCORD IOS" },
    { name: 'Node.js documentation', type: 3, browser: "DISCORD IOS" },
    { name: 'Unity tutorials', type: 3, browser: "DISCORD IOS" },
]

const usersWithTax = [
    '726127512521932880', '591218715803254784', '494126778336411648',
    '575727604708016128', '583709720834080768', '415078291574226955',
    '750748417373896825', '504304776033468438', '551299555698671627'
]

module.exports = { INFO, ERROR, WARNING, SHARD, DEBUG, DONE, Color, ColorRoles, activitiesDesktop, activitiesMobile, usersWithTax, ChannelId }