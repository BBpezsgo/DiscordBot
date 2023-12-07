const Discord = require('discord.js')
const Har = require('./har-discord-browser')
const Archive = require('./archive-browser')

class Guild {
    /**
     * @param {string} id
     * @param {Discord.Client} client
     */
    constructor(id, client) {
        this.Id = id
        this.Client = client
    }

    async Load() {
        const onlineGuild = this.Client.guilds.cache.get(this.Id)
        const harGuild = Har.Guilds()[this.Id]
        const archivedGuild = (await Archive.Servers())[this.Id]
        if (!onlineGuild && !harGuild && !archivedGuild) {
            return null
        }
        return {
            id: this.Id,
            name: (onlineGuild?.name) ?? (harGuild?.name) ?? (archivedGuild?.name),
            banner: (onlineGuild?.banner) ?? (harGuild?.banner),
            available: (onlineGuild?.available) ?? false,
            bans: (onlineGuild?.bans) ?? (archivedGuild?.Bans),
            createdAt: (onlineGuild?.createdAt),
            commands: (onlineGuild?.commands),
            afkChannelId: (onlineGuild?.afkChannelId),
            afkTimeout: (onlineGuild?.afkTimeout),
            description: (onlineGuild?.description) ?? (harGuild?.description),
            emojis: (onlineGuild?.emojis) ?? (archivedGuild?.Emojis),
            features: (onlineGuild?.features) ?? (harGuild?.features),
            icon: (onlineGuild?.icon) ?? (harGuild?.icon) ?? (archivedGuild?.IconPath),
            joinedAt: (onlineGuild?.joinedAt),
            large: (onlineGuild?.large),
            memberCount: (onlineGuild?.memberCount) ?? (harGuild?.memberCount),
            mfaLevel: (onlineGuild?.mfaLevel),
            nsfwLevel: (onlineGuild?.nsfwLevel) ?? (harGuild?.nsfw_level),
            ownerId: (onlineGuild?.ownerId),
            partnered: (onlineGuild?.partnered),
            premiumSubscriptionCount: (onlineGuild?.premiumSubscriptionCount) ?? (harGuild?.premium_subscription_count),
            roles: (onlineGuild?.roles),
            verificationLevel: (onlineGuild?.verificationLevel) ?? (harGuild?.verification_level),
            auditLog: (archivedGuild?.AuditLog),
            webhooks: (archivedGuild?.Webhooks),
            channels: (onlineGuild?.channels) ?? (harGuild?.channels) ?? (archivedGuild?.Channels),
            splash: (onlineGuild?.splash) ?? (harGuild?.splash),
            vanityURLCode: (onlineGuild?.vanityURLCode) ?? (harGuild?.vanity_url_code),
        }
    }
}

class Channel {
    /**
     * @param {string} id
     * @param {Discord.Client} client
     */
    constructor(id, client) {
        this.Id = id
        this.Client = client
    }

    async Load() {
        const onlineChannel = this.Client.channels.cache.get(this.Id)
        const harChannel = Har.Guilds()[this.Id]?.channels[this.Id]
        const harChannel2 = Har.Load().channels[this.Id]
        const archivedGuild = (await Archive.Servers())[this.Id]
        if (!onlineChannel && !harChannel && !harChannel2 && !archivedGuild) {
            return null
        }
        let archivedChannel = null
        if (archivedGuild) {
            for (const item of archivedGuild.Channels) {
                if (item.id !== this.Id) { continue }
                archivedChannel = item
                break
            }
        }
        const type = (onlineChannel?.type) ?? (harChannel2?.type) ?? (harChannel?.type) ?? (archivedChannel?.type)
        if (!type) {
            return null
        }
        if (onlineChannel.isDMBased()) {
            return {
                id: this.Id,
                type: type,
                createdAt: (onlineChannel?.createdAt),
                url: (onlineChannel?.url),
            }
        }
        if (onlineChannel.isVoiceBased()) {
            return {
                id: this.Id,
                type: type,
                createdAt: (onlineChannel?.createdAt),
                url: (onlineChannel?.url),
                guildId: (onlineChannel?.guildId) ?? (harChannel2?.guild_id),
                manageable: (onlineChannel?.manageable) ?? false,
                members: (onlineChannel?.members),
                name: (onlineChannel?.name) ?? (harChannel2?.name) ?? (archivedChannel?.name),
                parentId: (onlineChannel?.parentId) ?? (archivedChannel?.parent_id),
                viewable: (onlineChannel?.viewable) ?? true,
                rateLimitPerUser: (onlineChannel?.rateLimitPerUser) ?? (archivedChannel?.rate_limit_per_user),
                messages: (onlineChannel?.messages) ?? (harChannel2?.messages) ?? (archivedChannel?.messages),
                lastMessageId: (onlineChannel?.lastMessageId) ?? (archivedChannel?.last_message_id),
                bitrate: (onlineChannel?.bitrate),
                joinable: (onlineChannel?.joinable) ?? false,
                userLimit: (onlineChannel?.userLimit),
                nsfw: (onlineChannel?.nsfw) ?? (archivedChannel?.nsfw),
                permissionOverwrites: (onlineChannel?.permissionOverwrites) ?? (archivedChannel?.permission_overwrites),
                position: (archivedChannel?.position),
                topic: (archivedChannel?.topic),
            }
        }
        if (onlineChannel.isTextBased()) {
            return {
                id: this.Id,
                type: type,
                createdAt: (onlineChannel?.createdAt),
                url: (onlineChannel?.url),
                guildId: (onlineChannel?.guildId) ?? (harChannel2?.guild_id),
                manageable: (onlineChannel?.manageable) ?? false,
                members: (onlineChannel?.members),
                name: (onlineChannel?.name) ?? (harChannel2?.name) ?? (archivedChannel?.name),
                parentId: (onlineChannel?.parentId) ?? (archivedChannel?.parent_id),
                viewable: (onlineChannel?.viewable) ?? true,
                rateLimitPerUser: (onlineChannel?.rateLimitPerUser) ?? (archivedChannel?.rate_limit_per_user),
                messages: (onlineChannel?.messages) ?? (harChannel2?.messages) ?? (archivedChannel?.messages),
                lastMessageId: (onlineChannel?.lastMessageId) ?? (archivedChannel?.last_message_id),
                // @ts-ignore
                nsfw: (onlineChannel?.nsfw) ?? (archivedChannel?.nsfw),
                permissionOverwrites: (archivedChannel?.permission_overwrites),
                // @ts-ignore
                position: (onlineChannel?.position) ?? (archivedChannel?.position),
                // @ts-ignore
                topic: (onlineChannel?.topic) ?? (archivedChannel?.topic),
            }
        }
        return {
            id: this.Id,
            type: type,
            createdAt: (onlineChannel?.createdAt),
            url: (onlineChannel?.url),
            guildId: (onlineChannel?.guildId) ?? (harChannel2?.guild_id),
            manageable: (onlineChannel?.manageable) ?? false,
            members: (onlineChannel?.members),
            name: (onlineChannel?.name) ?? (harChannel2?.name) ?? (archivedChannel?.name),
            parentId: (onlineChannel?.parentId) ?? (archivedChannel?.parent_id),
            viewable: (onlineChannel?.viewable) ?? true,
            // @ts-ignore
            nsfw: (onlineChannel?.nsfw) ?? (archivedChannel?.nsfw),
            permissionOverwrites: (onlineChannel?.permissionOverwrites) ?? (archivedChannel?.permission_overwrites),
            // @ts-ignore
            position: (onlineChannel?.position) ?? (archivedChannel?.position),
            // @ts-ignore
            topic: (onlineChannel?.topic) ?? (archivedChannel?.topic),
        }
    }
}

module.exports = {
    Guild,
    Channel,
}
