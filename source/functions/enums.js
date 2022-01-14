
const INFO = '[' + '\033[34m' + 'INFO' + '\033[40m' + '' + '\033[37m' + ']'
const ERROR = '[' + '\033[31m' + 'ERROR' + '\033[40m' + '' + '\033[37m' + ']'
const WARNING = '[' + '\033[33m' + 'WARNING' + '\033[40m' + '' + '\033[37m' + ']'
const SHARD = '[' + '\033[35m' + 'SHARD' + '\033[40m' + '' + '\033[37m' + ']'
const DEBUG = '[' + '\033[30m' + 'DEBUG' + '\033[40m' + '' + '\033[37m' + ']'
const DONE = '[' + '\033[32m' + 'DONE' + '\033[40m' + '' + '\033[37m' + ']'

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

const activitiesDesktop = [
    "GTA V",
    "Minecraft",
    "Fortnite",
    "Mindustry",
    "GTA IV",
    "CS:GO",
    "Terrira",
    "Crossout",
    "Apex Legends",
    "Factorio",
    "World of Tanks",
    "Warthunder",
    "Warzone 2100",
    "Genshin Impact",
    "Valoriant"
]

const activitiesMobile = [
    "Manga",
    "Discord.js documentation",
    "Reddit",
    "Twitter",
    "Facebook",
    "Instagram",
    "Wiki"
]

const usersWithTax = [
    '726127512521932880', '591218715803254784', '494126778336411648',
    '575727604708016128', '583709720834080768', '415078291574226955',
    '750748417373896825', '504304776033468438', '551299555698671627'
]

module.exports = {INFO, ERROR, WARNING, SHARD, DEBUG, DONE, Color, activitiesDesktop, activitiesMobile, usersWithTax}