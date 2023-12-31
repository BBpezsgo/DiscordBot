export interface Dictionary<T> {
    [key: string]: T | undefined
}

export type ArchivedChannel = {
    id: string
    last_message_id?: string | null
    type: number
    name: string
    position?: number | null
    parent_id?: string | null
    topic?: string | null
    permission_overwrites: {
        id: string
        type: number
        allow: string
        deny: string
    }[]
    nsfw?: boolean | null
    rate_limit_per_user?: number | null
    messages?: ArchivedMessage[] | null
}

export type ArchivedEmoji = {
    name: string
    roles: unknown[]
    id: string
    require_colons: number
    managed: boolean
    animated: boolean
    available: boolean
    user_id: string
    image_path?: string
}

export type ArchivedMessage = null | {
    id: string
    date: string
    content: string
    attachment: {
        contentType: string
        url: string
        raw: any
    }
}

export type ArchivedMessageChannel =
    ArchivedGuildMessageChannel |
    ArchivedMessageChannel3

export type ArchivedBaseMessageChannel = {
    id: string
    type: number
    messages: ArchivedMessage[]
}

export type ArchivedGuildMessageChannel = ArchivedBaseMessageChannel & {
    name: string
    guild: {
        id: string
        name: string
    }
    recipients: undefined
}

export type ArchivedMessageChannel3 = ArchivedBaseMessageChannel & {
    name: undefined
    guild: undefined
    recipients: string[]
}

export type ArchivedGuild = {
    id: string
    name?: string
    AuditLog?: {
        id: string
        user_id: string
        action_type: number
        changes: {
            key: string
            old_value?: any
            new_value?: any
        }[]
    }[]
    Bans?: unknown[]
    Channels?: ArchivedChannel[]
    Emojis?: ArchivedEmoji[]
    Webhooks?: object[]
    IconPath?: string
}

export type ArchivedAccount = {
    id: string
    username: string
    discriminator: number
    flags: number
    avatarData: string
}

export type ArchivedUser = {
    id: string
    type: number
    nickname: null | string
    user: {
        id: string
        username: string
        avatar: null | string
        discriminator: string
        public_flags: number
    }
}

export function Users(): ArchivedUser[]
export function README(): string
export function Servers(): Promise<Dictionary<ArchivedGuild>>
export function Messages(): Promise<ArchivedMessageChannel[]>
export function Account(): ArchivedAccount