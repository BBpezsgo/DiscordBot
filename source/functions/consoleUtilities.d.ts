import EventEmitter from "events"

export type ConsoleMouse = {
    shift: boolean
    meta: boolean
    ctrl: boolean
    x: number
    y: number
    button: null | 'down' | 'up' | 'left' | 'middle' | 'right' | 'none'
    sequence: string
    buf: any
    name: 'scroll' | 'move' | 'click'
}

export interface ConsoleUtilities {
    on(event: 'onKeyDown', listener: (key: string) => void): this
    on(event: 'onMouse', listener: (mouse: ConsoleMouse) => void): this
    on(event: string, listener: () => void): this
}

export class ConsoleUtilities extends EventEmitter {
    Listen(): void
    /** Enables "mouse reporting" */
    EnableMouse(): void
    /** Disables "mouse reporting" */
    DisableMouse(): void
}
