export function Log(message: string)
export function Start(startedInvisible: boolean, startedByUser: boolean)
export function Stop()
export function GetLogs(): SystemLog[]
export type SystemLog = {
    dateText: string
    groups: SystemLogGroup[]
}

export type SystemLogGroup = {
    isInvisible: string
    startedByUser: string
    startTime: string
    endTime: string
    logs: {
        time: string
        log: string
    }[]
    pings: {
        time: string
        ping: number
        quality: 'none' | 'good' | 'fair' | 'bad' | 'verybad'
    }[]
    closedByUser: boolean
    running: boolean
}
