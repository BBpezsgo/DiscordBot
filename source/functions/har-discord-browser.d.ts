export type Message = {
    id: string
    type: number
    content: string
    channel_id: string
    author: User
    attachments: unknown[]
    embeds: unknown[]
    mentions: unknown[]
    mention_roles: unknown[]
    pinned: number
    mention_everyone: number
    tts: number
    timestamp: string
    edited_timestamp: string | null
    flags: number
    components: unknown[]
}

export type User = {
    id: string
    username: string
    global_name: unknown
    avatar: string
    discriminator: string
    public_flags: number
    avatar_decoration: unknown
    bot?: boolean
}

export type Invitation = {
    code: string
    type: number
    expires_at: null | unknown
    guild: {
      id: string
      name: string
      splash?: unknown
      banner?: unknown
      description: null | string
      icon: string
      features: unknown[]
      verification_level: number
      vanity_url_code: null | unknown
      premium_subscription_count: number
      nsfw: string
      nsfw_level: null
    },
    channel: {
        id: string
        name: string
        type: number
    }
    inviter: User
    approximate_member_count: number
    approximate_presence_count: number
} | {
    message: string
    code: number
}

export type CollectedGuild = {
    id: string
    name: string
    splash?: unknown
    banner?: unknown
    description: null | string
    icon: string
    features: unknown[]
    verification_level: number
    vanity_url_code: null | unknown
    premium_subscription_count: number
    nsfw: string
    nsfw_level: number | null
    memberCount: number
    channels: {
        [key: string]: {
            id: string
            name: string
            type: number
        }
    }
}

export type Channel = {
    messages: Message[],
    id: string,
    guild_id?: string,
    name?: string
    type?: number
}

export function Load(): {
    channels: { [key: string]: Channel }
    invitations: Invitation[]
}

export function Guilds(cache: boolean = true): { [key: string]: CollectedGuild }

export function Invitations(cache: boolean = true): Invitation[]