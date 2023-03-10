export type CachedResult<T> = Promise<{ cache?: true } & T>

export function GST(fromCache = false): CachedResult<GSTResult[]>
export type GSTResult = {
    gstID: string
    startTime: string
    allKpIndex: {
        observedTime: string
        kpIndex: number
        source: string
    }[]
    linkedEvents:{
        activityID: string
    }[]
    link: string
}

export function IPS(fromCache = false): CachedResult<IPSResult[]>
export type IPSResult = {
    catalog: string
    activityID: string
    location: string
    eventTime: string
    link: string
    instruments: {
        displayName: string
    }[]
}

export function FLR(fromCache = false): CachedResult<FLRResult[]>
export type FLRResult = {
    flrID: string
    instruments: {
        displayName: string
    }[]
    beginTime: string
    peakTime: string
    endTime: string
    classType: string
    sourceLocation: string
    activeRegionNum: number
    linkedEvents: null | {
        activityID: string
    }[]
    link: string
}

export function Notifications(fromCache = false): CachedResult<NotificationResult[]>
export type NotificationResult = {
    messageType: 'FLR' | 'SEP' | 'CME' | 'IPS' | 'MPC' | 'GST' | 'RBE' | 'Report'
    messageID: string
    messageURL: string
    messageIssueTime: string
    messageBody: string
}