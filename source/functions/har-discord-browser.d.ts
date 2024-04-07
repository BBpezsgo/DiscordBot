export type Message = {
    id: string
    type: number
    content: string
    channel_id: string
    author: CollectedUser
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

export type CollectedUser = {
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
    name?: string
    splash?: unknown
    banner?: unknown
    description?: string
    icon?: string
    features?: string[]
    verification_level?: number
    vanity_url_code?: unknown
    premium_subscription_count?: number
    nsfw?: string
    nsfw_level?: number
    memberCount?: number
    channels?: {
        [key: string]: {
            id: string
            name: string
            type: number
        }
    }
    entitlements?: {

    },
    'scheduled-events'?: {

    },
    integrations?: {
        message: string
        code: number
    }
}

export type CollectedChannel = {
    messages: Message[],
    id: string,
    guild_id?: string,
    name?: string
    type?: number
}

export type CollectedUser2 = {
    profile: {
        user: {
            id: string
            username: string
            global_name: string
            avatar: string
            avatar_decoration_data: null
            discriminator: string
            public_flags: number
            flags: number
            banner: null
            banner_color: string
            accent_color: number
            bio: string
        },
        connected_accounts: {
            type: string
            id: string
            name: string
            verified: boolean
            metadata: any
        }[]
        premium_since: null
        premium_type: null
        premium_guild_since: null
        profile_themes_experiment_bucket: number
        user_profile: {
            bio: string
            accent_color: number
            pronouns: string
        },
        badges: {
            id: string
            description: string
            icon: string
            link?: string
        }[]
        guild_badges: any[],
        mutual_guilds: any[],
        legacy_username: string
    } | {
        message: string
        code: number
    }
}

export type CollectedMe = any

export function Load(): {
    channels: { [key: string]: CollectedChannel }
    invitations: CollectedInvitation[]
    users: {
        "@me": CollectedMe,
        [id: string]: CollectedUser2
    }
    guilds: { [key: string]: CollectedGuild }
}

export function Guilds(): string[]
export function Guild(id: string): null | CollectedGuild

export function Channels(): string[]
export function Channel(id: string): null | CollectedChannel
export function DMChannel(userId: string): null | CollectedChannel

export function Invitations(cache: boolean = true): CollectedInvitation[]

export function Users(): string[]
export function User(id: string): CollectedUser2
