export interface Dictionary<T> {
    [key: string]: T | undefined
}

export type ArchivedChannel = {
    id: string
    last_message_id: string | null
    type: number
    name: string
    position: number
    parent_id: string | null
    topic: string | null
    permission_overwrites: {
        id: string
        type: number
        allow: string
        deny: string
    }[]
    nsfw: boolean
    rate_limit_per_user?: number
    messages?: ArchivedMessage[]
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

export type ArchivedMessageChannel = ArchivedGuildMessageChannel | ArchivedMessageChannel2 | ArchivedMessageChannel3


export type ArchivedGuildMessageChannel = {
    id: string
    type: number
    name: string
    guild: {
        id: string
        name: string
    }
    messages: ArchivedMessage[]
}

export type ArchivedMessageChannel2 = {
    id: string
    type: number
    messages: ArchivedMessage[]
}

export type ArchivedMessageChannel3 = {
    id: string
    type: number
    recipients: string[]
    messages: ArchivedMessage[]
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