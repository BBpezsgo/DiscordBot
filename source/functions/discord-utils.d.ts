import * as Discord from 'discord.js'
import * as Har from './har-discord-browser'
import * as Archive from './archive-browser'

export class Guild {
    public readonly Id: string
    public readonly Client: Discord.Client

    constructor(id: string, client: Discord.Client)

    async Load(): null | {
        id: string
        name?: string
        banner?: string | unknown
        available: boolean
        bans?: Discord.GuildBanManager | unknown[]
        createdAt?: Date
        commands?: Discord.GuildApplicationCommandManager
        afkChannelId?: string
        afkTimeout?: number
        description?: string
        emojis?: Discord.GuildEmojiManager | Archive.ArchivedEmoji[]
        features?: string[]
        icon?: string
        joinedAt?: Date
        large?: boolean
        memberCount?: number
        mfaLevel?: Discord.GuildMFALevel
        nsfwLevel?: Discord.GuildNSFWLevel | number
        ownerId?: string
        partnered?: boolean
        premiumSubscriptionCount?: number
        roles?: Discord.RoleManager
        verificationLevel?: Discord.GuildVerificationLevel | number
        auditLog?: { id: string; user_id: string; action_type: number; changes: { key: string; old_value?: any; new_value?: any; }[] }[]
        webhooks?: object[]
        channels?: Discord.GuildChannelManager | { [key: string]: { id: string; name: string; type: number; } } | Archive.ArchivedChannel[]
        splash?: string | unknown
        vanityURLCode?: string | unknown
    }
}

export class Channel {
    public readonly Id: string
    public readonly Client: Discord.Client

    constructor(id: string, client: Discord.Client)

    async Load(): null | {
        id: string
        type: Discord.ChannelType.DM | Discord.ChannelType.GroupDM
        createdAt?: Date
        url?: StringDiscord.SelectMenuComponent
    } | {
        id: string
        type: Discord.ChannelType.GuildVoice | Discord.ChannelType.GuildStageVoice
        createdAt?: Date
        url?: string
        guildId?: string
        manageable: boolean
        members?: Discord.Collection<string, Discord.GuildMember>
        name?: string
        parentId?: string
        viewable: boolean
        nsfw?: boolean
        position?: number
        topic?: string
        permissionOverwrites?: Discord.PermissionOverwriteManager | { id: string; type: number; allow: string; deny: string; }[]
        lastMessageId?: string
        rateLimitPerUser?: number
        messages?: Discord.GuildMessageManager | Har.Message[] | { id: string; date: string; content: string; attachment: { contentType: string; url: string; raw: any; }; }[]
        bitrate?: number
        joinable: boolean
        userLimit?: number
    } | {
        id: string
        type: Discord.ChannelType.GuildText | Discord.ChannelType.GuildAnnouncement | Discord.ChannelType.AnnouncementThread | Discord.ChannelType.PublicThread | Discord.ChannelType.PrivateThread
        createdAt?: Date
        url?: string
        guildId?: string
        manageable: boolean
        members?: Discord.Collection<string, Discord.GuildMember>
        name?: string
        parentId?: string
        viewable: boolean
        nsfw?: boolean
        position?: number
        topic?: string
        permissionOverwrites?: Discord.PermissionOverwriteManager | { id: string; type: number; allow: string; deny: string; }[]
        lastMessageId?: string
        rateLimitPerUser?: number
        messages?: Discord.GuildMessageManager | Har.Message[] | { id: string; date: string; content: string; attachment: { contentType: string; url: string; raw: any; }; }[]
    } | {
        id: string
        type: Discord.ChannelType.GuildCategory | Discord.ChannelType.GuildForum
        createdAt?: Date
        url?: string
        guildId?: string
        manageable: boolean
        members?: Discord.Collection<string, Discord.GuildMember>
        name?: string
        parentId?: string
        viewable: boolean
        nsfw?: boolean
        position?: number
        topic?: string
        permissionOverwrites?: Discord.PermissionOverwriteManager | { id: string; type: number; allow: string; deny: string; }[]
    }
}
