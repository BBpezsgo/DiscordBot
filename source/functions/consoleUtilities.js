const EventEmitter = require('events')

/** @param {string} s */
function Get(s) {
    // mouse event
    // reuse the key array albeit its name
    // otherwise recompute as the mouse event is structured differently
    const modifier = s.charCodeAt(3)
    /** @type {import('./consoleUtilities').ConsoleKey} */
    var key = {}
    key.shift = !!(modifier & 4)
    key.meta = !!(modifier & 8)
    key.ctrl = !!(modifier & 16)
    key.x = s.charCodeAt(4) - 32
    key.y = s.charCodeAt(5) - 32
    key.button = null
    key.sequence = s
    key.buf = Buffer(key.sequence)
    if ((modifier & 96) === 96) {
        key.name = 'scroll'
        key.button = modifier & 1 ? 'down' : 'up'
    } else {
        key.name = modifier & 64 ? 'move' : 'click'
        switch (modifier & 3) {
            case 0: key.button = 'left'; break;
            case 1: key.button = 'middle'; break;
            case 2: key.button = 'right'; break;
            case 3: key.button = 'none'; break;
            default: return;
        }
    }
    return key
}

/** @param {string} s */
function IsMouse(raw) {
    return /^\u001b\[M/.test(raw)
}

class ConsoleUtilities extends EventEmitter {
    constructor() {
        super()
    }

    Listen() {
        process.stdin.on('data', function (b) {
            const s = b.toString('utf8')

            if (s === '\u0003') {
                this.emit('onKeyDown', s)
                return
            }

            if (IsMouse(s)) {
                const mouse = Get(s)
                this.emit('onMouse', mouse)
                return
            }

            this.emit('onKeyDown', s)
        })
    }
}

module.exports = { Get, IsMouse, ConsoleUtilities }