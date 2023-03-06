export type ConsoleKey = {
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

export function Get(raw: string): ConsoleKey
export function IsMouse(raw: string): boolean