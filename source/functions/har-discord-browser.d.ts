export type Message = {
    id: string
    type: number
    content: string
    channel_id: string
    author: User
    attachments: Attachment[]
    embeds: Embed[]
    mentions: Mention[]
    mention_roles: unknown[]
    pinned: number
    mention_everyone: number
    tts: number
    timestamp: string
    edited_timestamp: string | null
    flags: number
    components: unknown[]
    reactions: Reaction[]
}

export type Mention = {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    flags: number
    banner: unknown | null
    accent_color: unknown | null
    global_name: unknown | null
    avatar_decoration: unknown | null
    display_name: string | null
    banner_color: unknown | null
}

export type Attachment = {
    id: string
    filename: string
    size: number
    url: string
    proxy_url?: string
    width?: number
    height?: number
}

export type Reaction = {
    emoji: {
        id: string
        name: string
        animated: boolean
    } | {
        id: null
        name: string
    }
    count: number
    count_details: {
        burst: number
        normal: number
    }
    burst_colors: unknown[]
    me_burst: boolean
    me: boolean
    burst_count: number
}

export type BaseEmbed = {
    url?: string
    title?: string
    description?: string
    color?: number
    author?: {
        name?: string
        url?: string
    }
    thumbnail?: {
        url: string
        width: number
        height: number
        proxy_url?: string
    }
    fields?: {
        name: string
        value: string
        inline: boolean
    }[]
}

export type Embed = BaseEmbed & ({
    type: 'video'
    provider?: {
        name: string
        url?: string
    }
    video?: {
        url: string
        width: number
        height: number
        proxy_url?: string
    }
} | {
    type: 'gifv',
    provider: {
        name: string
        url?: string
    }
    video: {
        url: string
        width: number
        height: number
        proxy_url?: string
    }
} | {
    type: 'link'
    provider: {
        name: string
    }
} | {
    type: 'image'
} | {
    type: 'rich'
})

export type User = {
    id: string
    username: string
    global_name: unknown | null
    avatar: string | null
    discriminator: string
    public_flags: number
    avatar_decoration: unknown | null
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
    
    message: undefined
} | {
    message: string
    code: number
    
    type: undefined
    expires_at: undefined
    guild: undefined
    channel: undefined
    inviter: undefined
    approximate_member_count: undefined
    approximate_presence_count: undefined
}

export type CollectedGuild = {
    id: string
    name: string
    splash?: unknown
    banner?: unknown
    description: null | string
    icon: string
    features: string[]
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