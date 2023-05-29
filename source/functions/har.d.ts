/** This object represents list of exported pages. */
export type Page = {
    /** Date and time stamp for the beginning of the page load (ISO 8601 - YYYY-MM-DDThh:mm:ss.sTZD, e.g. 2009-07-24T19:20:30.45+01:00). */
    startedDateTime: string
    /** Unique identifier of a page within the `log`. Entries use it to refer the parent page. */
    id: string
    /** Page title. */
    title: string
    /** Detailed timing info about page load. */
    pageTimings: {
        onContentLoad: number
        onLoad: number
        comment?: string
    }
    /** (new in 1.2) - A comment provided by the user or the application. */
    comment?: string
}

export type Entry = {
    cache: object
    request: Request
    response: Response
    serverIPAddress: string
    connection?: string
    /** Date and time stamp of the request start (ISO 8601 - YYYY-MM-DDThh:mm:ss.sTZD). */
    startedDateTime: string
    time: number
    timings: {
        blocked: number,
        dns: number,
        ssl: number,
        connect: number,
        send: number,
        wait: number,
        receive: number,

        _blocked_queueing: number
    }

    _fromCache?: 'disk' | 'memory' | string
    _initiator: {
        type: 'script' | 'parser' | string
        stack: {
            callFrames: {
                functionName: string
                scriptId: string
                url: string
                lineNumber: number
                columnNumber: number
            }[]
        }
    }
    _priority: 'Low' | 'High' | 'VeryHigh' | null
    _resourceType: 'xhr' | 'other' | 'script' | 'websocket' | 'stylesheet' | 'document' | 'font' | 'image' | 'preflight' | 'fetch' | string
    _webSocketMessages?: WebSocketMessage[]
}

export type WebSocketMessage = {
    type: 'receive' |'send'
    time: number
    opcode: number
    data: string
}

export type Header = {
    name: string
    value: string
    comment?: string
}


export type Query = {
    name: string
    value: string
    comment?: string
}

export type Cookie = {
    name: string
    value: string
    path?: string
    domain?: string
    expires?: string
    httpOnly?: boolean
    secure?: boolean
    sameSite?: string
    comment?: string
}

export type Request = {
    method: 'GET' | 'POST' | 'PUT' | string,
    url: string
    httpVersion: string
    headers: Header[]
    queryString: Query[]
    cookies: Cookie[]
    headersSize: number
    bodySize: number
    postData: {

    }
    comment?: string
}

export type Response = {
    status: number
    statusText: string
    httpVersion: string
    headers: Header[]
    cookies: Cookie[]
    content: {
        size: number
        mimeType: string
        text: string
    },
    redirectURL: string
    headersSize: number
    bodySize: number
    comment?: string

    _transferSize: number
    _error: null | unknown
}

export type HAR = {
    /** This object represents the root of exported data. */
    log: {
        /** Version number of the format. If empty, string "1.1" is assumed by default. */
        version: string
        /** Name and version info of the log creator application. */
        creator: {
            /** Name of the application/browser used to export the log. */
            name: string
            /** Version of the application/browser used to export the log. */
            version: string
            /** (new in 1.2) - A comment provided by the user or the application. */
            comment?: string
        }
        /** Name and version info of used browser. */
        browser?: object
        /** List of all exported (tracked) pages. Leave out this field if the application does not support grouping by pages. */
        pages?: Page[]
        /** List of all exported (tracked) requests. */
        entries: Entry[],
        /** (new in 1.2) - A comment provided by the user or the application. */
        comment?: string
    }
}

export function Load(path: string): HAR