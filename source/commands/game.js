class Game {
    constructor () {
        /** @type {GameMap} */
        this.gameMap = null
        
        /** @type {number} */
        this.gameCameraX = 0
        
        /** @type {number} */
        this.gameCameraY = 0
        
        /** @type {GameUserSettings[]} */
        this.gameUserSettings = []
        
        /** @type {savedGameMessage[]} */
        this.allGameMessages = []
    }
    
}

const Discord = require('discord.js')
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

const ColorRoles = {
	red: "850016210422464534",
	yellow: "850016458544250891",
	blue: "850016589155401758",
	orange: "850016531848888340",
	green: "850016722039078912",
	purple: "850016668352643072",
	invisible: "850016786186371122"
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
}

function distanceNearestPoint(x, y, points) {
    let z = -1
    points.forEach(point => {
        if (z === -1) {
            z = distance(x, y, point[0], point[1])
        } else {
            z = Math.min(z, distance(x, y, point[0], point[1]))
        }
    })
    return z
}

/**
 * @param {number} cameraX
 * @param {number} cameraY
 * @param {GameMap} gameMap
 * @param {boolean} isOnPhone
 */
function getView(cameraX, cameraY, gameMap, isOnPhone) {
    let viewText = ''
    let map = gameMap.map

    let viewWidth
    let viewHeight

    if (isOnPhone === true) {
        viewWidth = 15
        viewHeight = 18
    } else {
        viewWidth = 25
        viewHeight = 25
    }

    for (let y = 0; y < viewHeight; y++) {
        for (let x = 0; x < viewWidth; x++) {

            const xVal = x + cameraX
            const yVal = y + cameraY

            /**
             * @type {MapPoint}
             */
            let mapP
            for (let i = 0; i < map.length; i++) {
                if (map[i].x === xVal && map[i].y === yVal) {
                    mapP = map[i]
                    break;
                }
            }

            if (mapP === undefined) {
                mapP = new MapPoint(xVal, yVal, MapBiome.void, MapHeight.normal)
            }

            const height = mapP.height
            const biome = mapP.biome

            let newPixel = '\\⬛'

            if (biome === MapBiome.ocean) {
                newPixel = '\\🟦'
            } else if (biome === MapBiome.plain || biome === MapBiome.flowerPlain || biome === MapBiome.forest || biome === MapBiome.spruceForest) {
                newPixel = '\\🟩'
            } else if (biome === MapBiome.mountains) {
                newPixel = '\\🟫'
            } else if (biome === MapBiome.desertHills) {
                newPixel = '\\🟨'
            } else if (biome === MapBiome.desert || biome === MapBiome.beach) {
                newPixel = '\\🟨'
            }

            if (height === MapHeight.mountainSnow && biome !== MapBiome.desertHills) {
                newPixel = '\\⬜'
            }

            if (mapP.object == null) { } else {
                if (mapP.object.type == MapObjectType.plant) {
                    newPixel = '\\🌱'
                } else if (mapP.object.type == MapObjectType.bamboo) {
                    newPixel = '\\🎍'
                } else if (mapP.object.type == MapObjectType.tanabataTree) {
                    newPixel = '\\🎋'
                } else if (mapP.object.type == MapObjectType.rice) {
                    newPixel = '\\🌾'
                } else if (mapP.object.type == MapObjectType.mushroom) {
                    newPixel = '\\🍄'
                } else if (mapP.object.type == MapObjectType.sunflower) {
                    newPixel = '\\🌻'
                } else if (mapP.object.type == MapObjectType.blossom) {
                    newPixel = '\\🌼'
                } else if (mapP.object.type == MapObjectType.cherryBlossom) {
                    newPixel = '\\🌸'
                } else if (mapP.object.type == MapObjectType.hibiscus) {
                    newPixel = '\\🌺'
                } else if (mapP.object.type == MapObjectType.rose) {
                    newPixel = '\\🌹'
                } else if (mapP.object.type == MapObjectType.tulip) {
                    newPixel = '\\🌷'
                } else if (mapP.object.type == MapObjectType.palm) {
                    newPixel = '\\🌴'
                } else if (mapP.object.type == MapObjectType.spruce) {
                    newPixel = '\\🌲'
                } else if (mapP.object.type == MapObjectType.tree) {
                    newPixel = '\\🌳'
                } else if (mapP.object.type == MapObjectType.cactus) {
                    newPixel = '\\🌵'
                }
            }

            gameMap.players.forEach(player => {
                if (player.x === mapP.x && player.y === mapP.y) {
                    newPixel = '\\🧍'
                }
            })

            viewText += newPixel
        }
        viewText += '\n'
    }

    return viewText
}

/**
 * @param {GamePlayer} player
 * @returns {string}
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 * @param {Game} game
 */
function getPlayerStatText(player, isOnPhone, isInDebugMode, game) {
    let text = ''
    for (let v = 0; v < player.health; v++) {
        text += '\\❤️'
    }
    for (let v = 0; v < 10 - player.health; v++) {
        text += '\\🖤'
    }
    if (isInDebugMode === true) {
        text += ' | '
        if (player.direction === Direction.Up) {
            text += '⇑'
        } else if (player.direction === Direction.Right) {
            text += '⇒'
        } else if (player.direction === Direction.Down) {
            text += '⇓'
        } else if (player.direction === Direction.Left) {
            text += '⇐'
        }
        try {
            text += ' | '
            text += getMapPoint(player.x, player.y, game.gameMap).biome.toString()
        } catch (error) { }
        text += ' | cam: ' + game.gameCameraX + ' ' + game.gameCameraY
        text += ' | pos: ' + player.x + ' ' + player.y
    }
    text += '\n\\👊'
    text += '\n\n**Felszerelés:**\n'
    text += '\\👊|'
    player.tools.forEach(tool => {
        if (tool.type === ToolType.Axe) {
            text += '\\🪓'
        } else if (tool.type === ToolType.Fix) {
            if (tool.efficiency === 1) {
                text += '\\🔨'
            } else if (tool.efficiency === 2) {
                text += '\\🔧'
            }
        } else if (tool.type === ToolType.MeleeWeapon) {
            if (tool.efficiency === 1) {
                text += '\\🔪'
            } else if (tool.efficiency === 2) {
                text += '\\🗡️'
            }
        } else if (tool.type === ToolType.Pickaxe) {
            text += '\\⛏️'
        } else if (tool.type === ToolType.RangeWeapon) {
            text += '\\🏹'
        }
        text += '|'
    })
    if (text.endsWith('|')) {
        text = text.slice(0, text.length - 1)
    }
    player.items.forEach(item => {
        text += item.count + 'x '
        if (item.type === ItemType.Brick) {
            text += '\\🧱'
        } else if (item.type === ItemType.Gem) {
            text += '\\💎'
        } else if (item.type === ItemType.Grass) {
            text += '\\🌿'
        } else if (item.type === ItemType.Map) {
            text += '\\🗺️'
        } else if (item.type === ItemType.Sponge) {
            text += '\\🧽'
        } else if (item.type === ItemType.Stick) {
            text += '\\🥢'
        } else if (item.type === ItemType.Stone) {
            text += '\\🌑'
        } else if (item.type === ItemType.Whool) {
            text += '\\🧶'
        } else if (item.type === ItemType.Wood) {
            text += '\\📏'
        }
        text += '|'
    })

    return text
}

/**
 * @param {number} x
 * @param {number} y
 * @param {GameMap} map
 * @returns {MapPoint}
 */
function getMapPoint(x, y, map) {
    for (let i = 0; i < map.map.length; i++) {
        if (map.map[i].x === x && map.map[i].y === y) {
            return map.map[i]
        }
    }
}

/**
 * @param {Discord.User} user
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 * @param {Game} game
 */
function getGameEmbed(user, isOnPhone, isInDebugMode, game) {
    const embed = new Discord.MessageEmbed()
        .setAuthor({name: user.username, iconURL: user.avatarURL()})
        .setTitle('Game')
        .setDescription(getView(game.gameCameraX, game.gameCameraY, game.gameMap, isOnPhone) +
            '\n' +
            getPlayerStatText(game.gameMap.players[0], isOnPhone, isInDebugMode, game))

    return embed
}

/**
 * @param {Table} parentNoise
 * @param {Table} overlayNoise
 * @return {Table}
 */
function combineNoises(parentNoise, overlayNoise) {
    /**
     * @type {Table}
     */
    let newNoise = new Table(parentNoise.width, parentNoise.height, [])

    for (let i = 0; i < parentNoise.points.length; i++) {
        const parentValue = parentNoise.points[i]
        const overlayValue = overlayNoise.points[i]

        const newValue = (parentValue + parentValue + overlayValue) / 3
        newNoise.push(newValue)
    }

    return newNoise
}

function createGame(width, height) {
    let newMap = new GameMap(width, height, generateMap(width, height), [])
    return newMap
}

function generateMap(width, height) {

    const heightScale = 4
    const biomeScale = 5
    const treesScale = 5
    const plantsScale = 3

    const heightNoise = combineNoises(generateNoise(width, height, heightScale), generateNoise(width, height, 1))
    const biomeNoise = generateNoise(width, height, biomeScale)
    const treesNoise = generateNoise(width, height, treesScale)
    const plantsNoise = generateNoise(width, height, plantsScale)

    /**
     * @type {MapPoint[]}
     */
    let newMap = []

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            /**
             * @type {MapObject}
             */
            let newObj = null

            const heightValue = heightNoise.valueAt(x, y) / heightScale
            const biomeValue = biomeNoise.valueAt(x, y) / biomeScale
            const treesValue = treesNoise.valueAt(x, y) / treesScale
            const plantsValue = plantsNoise.valueAt(x, y) / plantsScale

            /**
             * @type {MapPoint}
             */
            let newMapPoint

            if (heightValue < 0) {
                newMapPoint = new MapPoint(x, y, MapBiome.void, MapHeight.normal, null)
            } else if (heightValue < 1.2) {
                newMapPoint = new MapPoint(x, y, MapBiome.ocean, MapHeight.water, null)
            } else if (heightValue < 1.4) {
                newMapPoint = new MapPoint(x, y, MapBiome.beach, MapHeight.normal, null)
            } else if (heightValue < 3) {
                if (biomeValue < 2) {
                    if (treesValue < 2) {
                        newMapPoint = new MapPoint(x, y, MapBiome.forest, MapHeight.normal)
                    } else if (plantsValue < 3) {
                        newMapPoint = new MapPoint(x, y, MapBiome.flowerPlain, MapHeight.normal)
                    } else {
                        newMapPoint = new MapPoint(x, y, MapBiome.plain, MapHeight.normal)
                    }
                } else {
                    newMapPoint = new MapPoint(x, y, MapBiome.desert, MapHeight.normal)
                }
            } else if (heightValue < 4) {
                if (biomeValue < 2) {
                    if (treesValue < 2) {
                        newMapPoint = new MapPoint(x, y, MapBiome.spruceForest, MapHeight.mountain)
                    } else {
                        newMapPoint = new MapPoint(x, y, MapBiome.mountains, MapHeight.mountain)
                    }
                } else {
                    newMapPoint = new MapPoint(x, y, MapBiome.desertHills, MapHeight.mountain)
                }
            } else {
                if (biomeValue < 2) {
                    newMapPoint = new MapPoint(x, y, MapBiome.mountains, MapHeight.mountainSnow)
                } else {
                    newMapPoint = new MapPoint(x, y, MapBiome.desertHills, MapHeight.mountainSnow)
                }
            }

            if (newMapPoint.biome === MapBiome.desert) {
                if ((Math.random() * 10) < 0.1) {
                    newObj = new MapObject(MapObjectType.cactus, false, 2)
                }
            } else if (newMapPoint.biome === MapBiome.flowerPlain) {
                if ((Math.random() * 10) < 0.7) {
                    const randomValue = Math.random()
                    if (randomValue < 0.14) {
                        newObj = new MapObject(MapObjectType.plant, true, 1)
                    } else if (randomValue < 0.29) {
                        newObj = new MapObject(MapObjectType.blossom, true, 1)
                    } else if (randomValue < 0.43) {
                        newObj = new MapObject(MapObjectType.cherryBlossom, true, 1)
                    } else if (randomValue < 0.57) {
                        newObj = new MapObject(MapObjectType.hibiscus, true, 1)
                    } else if (randomValue < 0.71) {
                        newObj = new MapObject(MapObjectType.rose, true, 1)
                    } else if (randomValue < 0.86) {
                        newObj = new MapObject(MapObjectType.sunflower, true, 1)
                    } else {
                        newObj = new MapObject(MapObjectType.tulip, true, 1)
                    }
                }
            } else if (newMapPoint.biome === MapBiome.forest) {
                if (Math.random() < 0.1) {
                    newObj = new MapObject(MapObjectType.plant, true, 1)
                }
                if ((Math.random()) < 0.2) {
                    newObj = new MapObject(MapObjectType.tree, false, 3)
                }
            } else if (newMapPoint.biome === MapBiome.spruceForest) {
                if ((Math.random()) < 0.17) {
                    newObj = new MapObject(MapObjectType.spruce, false, 3)
                }
            } else if (newMapPoint.biome === MapBiome.beach) {
                if (Math.random() < 0.1) {
                    newObj = new MapObject(MapObjectType.rice, true, 1)
                }
                if ((Math.random()) < 0.07) {
                    newObj = new MapObject(MapObjectType.palm, false, 3)
                }
            } else if (newMapPoint.biome === MapBiome.mountains && newMapPoint.height === MapHeight.mountainSnow) {
                if (Math.random() < 0.01) {
                    newObj = new MapObject(MapObjectType.igloo, false, 5)
                }
            }

            newMapPoint.object = newObj
            newMap.push(newMapPoint)
        }
    }

    return newMap
}

/**
 * @param {Discord.User} user
 * @param {Game} game
 */
function connectTogame(user, game) {
    if (game.gameMap !== null) {
        if (getPlayerIndex(user.id, game) === -1) {
            const spawnpoint = getSpawnPoint(game.gameMap)
            game.gameMap.players.push(new GamePlayer(spawnpoint[0], spawnpoint[1], user, 10, Direction.Up, 0, [new GameTool(ToolType.Axe, 100, 1)]))
            return true
        }
    }

    return false
}

/**
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @returns {Table}
 */
function generateNoise(width, height, scale) {
    /**
     * @type {number[][]}
     */
    const points = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (Math.random() * 100 < 10) {
                points.push([x * scale, y * scale])
            }
        }
    }

    /**
     * @type {Table}
     */
    let noise = new Table(width, height, [])

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (distanceNearestPoint(x, y, points) > -1) {
                noise.push(distanceNearestPoint(x, y, points))
            } else {
                noise.push(0)
            }
        }
    }

    return noise
}

/**
 * @param {string} userId
 * @param {Game} game
 */
function getPlayerIndex(userId, game) {
    let index = -1

    if (game.gameMap == null) {
        return index;
    }

    for (let i = 0; i < game.gameMap.players.length; i++) {
        const player = game.gameMap.players[i]
        if (player.ownerUser.id === userId) {
            index = i
            break;
        }
    }

    return index
}

/**
 * @param {GamePlayer} player
 * @param {ItemType} item
 * @param {number} count
 */
function addItemToPlayer(player, item, count) {
    let thisIsNewItem = true
    player.items.forEach(_item => {
        if (_item.type === item) {
            thisIsNewItem = false
            _item.count += count
        }
    })
    if (thisIsNewItem === true) {
        player.items.push(new GameItem(item, count))
    }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {gameMap} map
 * @returns {boolean}
 */
function playerCanMoveToHere(x, y, map) {
    let canMove = true
    map.map.forEach(mapP => {
        if (mapP.x === x && mapP.y === y) {
            if (mapP.object == null) { } else {
                if (mapP.object.walkable === false) {
                    canMove = false
                }
            }
            if (mapP.biome === MapBiome.ocean || mapP.biome === MapBiome.void) {
                canMove = false
            }

            map.players.forEach(player => {
                if (player.x === x && player.y === y) {
                    canMove = false
                }
            })
        }
    })
    return canMove
}

/**
 * @param {boolean} isOnPhone
 * @param {Discord.User} user
 * @param {Game} game
 */
function gameResetCameraPos(isOnPhone, user, game) {
    const playerIndex = getPlayerIndex(user.id, game)

    if (isOnPhone === true) {
        game.gameCameraX = Math.max(Math.min(game.gameMap.players[playerIndex].x - 7, 50), 0)
        game.gameCameraY = Math.max(Math.min(game.gameMap.players[playerIndex].y - 9, 50), 0)
    } else {
        game.gameCameraX = Math.max(Math.min(game.gameMap.players[playerIndex].x - 12, 50), 0)
        game.gameCameraY = Math.max(Math.min(game.gameMap.players[playerIndex].y - 12, 50), 0)
    }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {NoisePoint[]} noise
 * @returns {number}
 */
function getValueAt(x, y, noise) {
    /**
     * @type {number}
     */
    let val = null
    noise.forEach(noiseP => {
        if (noiseP.x === x && noiseP.y === y) {
            val = noiseP.value
        }
    })
    return val
}

/**
 * @param {GameMap} map
 * @param {GameMap} map
 * @returns {number[]} [x,y]
 */
function getSpawnPoint(map) {
    let x = 5
    let y = 5
    while (playerCanMoveToHere(x, y, map) === false) {
        x += 1
        y += 1
        if (x > map.width) {
            x = 6
            y = 5
        }
        if (y > map.height) {
            x = 6
            y = 5
        }
    }
    return [x, y]
}

/**
 * @param {Discord.User} user
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 * @param {Game} game
 */
function getGameMessage(user, isOnPhone, isInDebugMode, game) {
    const playerIndex = getPlayerIndex(user.id, game)
    const playerDirection = game.gameMap.players[playerIndex].direction

    const buttonW = new MessageButton()
        .setLabel("  ↑  ")
        .setCustomId("gameW")
        .setStyle("SECONDARY");
    const buttonA = new MessageButton()
        .setLabel(" ←")
        .setCustomId("gameA")
        .setStyle("SECONDARY");
    const buttonS = new MessageButton()
        .setLabel("  ↓  ")
        .setCustomId("gameS")
        .setStyle("SECONDARY");
    const buttonD = new MessageButton()
        .setLabel(" →")
        .setCustomId("gameD")
        .setStyle("SECONDARY");
    const buttonHit = new MessageButton()
        .setLabel("👊")
        .setCustomId("gameHit")
        .setStyle("SECONDARY");
    const buttonUse = new MessageButton()
        .setLabel("🤚")
        .setCustomId("gameUse")
        .setStyle("SECONDARY");
    const buttonSwitchPhone = new MessageButton()
        .setLabel("📱 Telefonon vagyok")
        .setCustomId("gameSwitchPhone")
        .setStyle("SECONDARY");
    const buttonSwitchDebug = new MessageButton()
        .setLabel("📟")
        .setCustomId("gameSwitchDebug")
        .setStyle("SECONDARY");
    const buttonRestart = new MessageButton()
        .setLabel("↺")
        .setCustomId("gameRestart")
        .setStyle("DANGER");



    if (playerDirection === Direction.Up) {
        buttonW.setStyle("PRIMARY")
    } else if (playerDirection === Direction.Left) {
        buttonA.setStyle("PRIMARY")
    } else if (playerDirection === Direction.Down) {
        buttonS.setStyle("PRIMARY")
    } else if (playerDirection === Direction.Right) {
        buttonD.setStyle("PRIMARY")
    }

    if (isOnPhone === true) {
        buttonSwitchPhone.setLabel("🖥️")
    } else {
        buttonSwitchPhone.setLabel("📱 Telefonon vagyok")
    }

    if (getGameUserSettings(user.id, game).isInDebugMode === true) {
        buttonSwitchDebug.setStyle("PRIMARY")
    } else {
        buttonSwitchDebug.setStyle("SECONDARY")
    }

    const row0 = new MessageActionRow()
        .addComponents(buttonUse, buttonW, buttonHit, buttonSwitchPhone)
    const row1 = new MessageActionRow()
        .addComponents(buttonA, buttonS, buttonD, buttonSwitchDebug, buttonRestart)

    return new GameMessage(getGameEmbed(user, isOnPhone, isInDebugMode, game), [row0, row1])
}

/**
 * @param {Discord.User} user
 * @param {Discord.Message} message
 * @param {boolean} isOnPhone
 * @param {boolean} isInDebugMode
 * @param {Discord.ButtonInteraction<Discord.CacheType>} integration
 * @param {Game} game
 */
function resetGameMessage(user, message, isOnPhone, isInDebugMode, integration, game) {
    for (let i = 0; i < game.allGameMessages.length; i++) {
        const savedGameMsg = game.allGameMessages[i];

        const _message = getGameMessage(savedGameMsg.user, isOnPhone, isInDebugMode, game)
        savedGameMsg.message.edit({ embeds: [_message.embed], components: _message.actionRows })
        integration.update({ embeds: [_message.embed], components: _message.actionRows })
    }
}

function getGameUserSettings(userId, game) {
    for (let i = 0; i < game.gameUserSettings.length; i++) {
        const userSettings = game.gameUserSettings[i];
        if (userSettings.userId === userId) {
            return userSettings
        }
    }
    return null
}

class Table {
    /**
     * @param {number} width
     * @param {number} height
     * @param {number[]} points
     */
    constructor(width, height, points) {
        this.width = width;
        this.height = height;
        this.points = points;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    valueAt(x, y) {
        return this.points[y * this.width + x];
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} value
     */
    setValue(x, y, value) {
        this.points[y * this.width + x] = value;
    }

    /**
     * @param {number} value
     */
    push(value) {
        this.points.push(value);
    }
}

class NoisePoint {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} value 
     */
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    /*
        get xValue() {
            return this.x;
        }
    
        get yValue() {
            return this.y;
        }
    
        get zValue() {
            return this.value;
        }
        */
}

const MapBiome = {
    void: 'void',
    plain: 'plains',
    desert: 'desert',
    ocean: 'ocean',
    beach: 'beach',
    mountains: 'mountains',
    desertHills: 'deserthills',
    flowerPlain: 'flowerplains',
    spruceForest: 'spruceforest',
    forest: 'forest'
}

const MapHeight = {
    water: 0,
    normal: 1,
    mountain: 2,
    mountainSnow: 3
}

const MapObjectType = {
    plant: 0, //🌱
    bamboo: 1, //🎍
    tanabataTree: 2, //🎋
    rice: 3, //🌾
    mushroom: 4, //🍄
    sunflower: 5, //🌻
    blossom: 6, //🌼
    cherryBlossom: 7, //🌸
    hibiscus: 8, //🌺
    rose: 9, //🌹
    tulip: 10, //🌷
    palm: 11, //🌴
    spruce: 12, //🌲
    tree: 13, //🌳
    cactus: 14, //🌵
    igloo: 15, //🍙
}

const Direction = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3
}

const ToolType = {
    Fix: 0,
    Pickaxe: 1,
    Axe: 2,
    MeleeWeapon: 3,
    RangeWeapon: 4
}

const ItemType = {
    Wood: 0, //📏
    Whool: 1, //🧶
    Grass: 2, //🌿
    Sponge: 3, //🧽
    Stone: 4, //🌑
    Gem: 5, //💎
    Stick: 6, //🥢
    Brick: 7, //🧱
    Map: 8 //🗺️
}

class GameItem {
    /**
     * @param {ItemType} type
     * @param {number} count
     */
    constructor(type, count) {
        this.type = type;
        this.count = count;
    }
}

class GameTool {
    /**
     * @param {ToolType} type
     * @param {number} health
     * @param {number} maxHealth
     * @param {number} efficiency
     */
    constructor(type, health, efficiency) {
        this.type = type;
        this.health = health;
        this.maxHealth = health;
        this.efficiency = efficiency;
    }
}

class GameMap {
    /**
     * @param {number} width
     * @param {number} height
     * @param {MapPoint[]} map
     * @param {GamePlayer[]} players
     */
    constructor(width, height, map, players) {
        this.width = width;
        this.height = height;
        this.map = map;
        this.players = players;
    }
}

class MapPoint {
    /**
     * @param {number} x
     * @param {number} y
     * @param {MapBiome} biome
     * @param {MapHeight} height
     * @param {MapObject} object
     */
    constructor(x, y, biome, height, object) {
        this.x = x;
        this.y = y;
        this.biome = biome;
        this.height = height;
        this.object = object;
    }
    /*
        get xValue() {
            return this.x;
        }
    
        get yValue() {
            return this.y;
        }
    
        get biomeValue() {
            return this.biome;
        }
    
        get heightValue() {
            return this.height;
        }
    
        get objectValue() {
            return this.object;
        }
        */
}

class MapObject {
    /**
     * @param {MapObjectType} type
     * @param {boolean} walkable
     * @param {number} breakValue
     */
    constructor(type, walkable, breakValue) {
        this.type = type;
        this.walkable = walkable;
        this.breakValue = breakValue;
    }
    /*
        get typeValue() {
            return this.type;
        }
        */
}

class GamePlayer {
    /**
     * @param {number} x
     * @param {number} y
     * @param {Discord.User} ownerUser
     * @param {number} health
     * @param {Direction} direction
     * @param {number} selectedToolIndex
     * @param {GameTool[]} tools
     * @param {GameItem[]} items
     * @param {boolean} aggreeToRestart
     */
    constructor(x, y, ownerUser, health = 10, direction = 0, selectedToolIndex = 0, tools = [], items = [], aggreeToRestart = false) {
        this.x = x;
        this.y = y;
        this.ownerUser = ownerUser;
        this.health = health;
        this.direction = direction;
        this.selectedToolIndex = selectedToolIndex;
        this.tools = tools;
        this.items = items;
        this.aggreeToRestart = false;
    }
}

class GameMessage {
    /**
     * @param {Discord.MessageEmbed} embed
     * @param {MessageActionRow[]} actionRows
     */
    constructor(embed, actionRows) {
        this.embed = embed;
        this.actionRows = actionRows;
    }
}

class GameUserSettings {
    /**
     * @param {string} userId
     * @param {boolean} isOnPhone
     * @param {boolean} isInDebugMode
     */
    constructor(userId, isOnPhone = false, isInDebugMode = false) {
        this.userId = userId;
        this.isOnPhone = isOnPhone;
        this.isInDebugMode = isInDebugMode;
    }
}

class savedGameMessage {
    /**
     * @param {Discord.Message} message
     * @param {Discord.User]} user
     */
    constructor(message, user) {
        this.message = message;
        this.user = user;
    }
}

module.exports = {
    playerCanMoveToHere,
    gameResetCameraPos,
    resetGameMessage,
    addItemToPlayer,
    getGameUserSettings,
    createGame,
    connectTogame,
    MapPoint,
    Game,
    savedGameMessage,
    GameUserSettings,
    GameMessage,
    GamePlayer,
    MapObject,
    GameTool,
    GameItem,
    ItemType,
    ToolType,
    Direction,
    MapObjectType,
    MapHeight,
    MapBiome,
    NoisePoint,
    Table,
    getGameMessage,
    getMapPoint
}