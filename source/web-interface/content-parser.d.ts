export type ParserElementType = 'TEXT' | 'URL' | 'PING' | 'EMOJI' | 'CHANNEL' | 'USER' | 'IMG' | 'VIDEO' | 'ROLE' | 'BR' | 'SPOILER' | 'BOLD' | 'ITALIC' | 'BLOCK' | 'SMALLCODE'

export type ParserElement<T = ParserElementType> = {
    type: T
    data: string
    details?: any
    attachmentID?: number
}

export class Parser {
    result: ParserElement[]

    constructor(text: string)
}