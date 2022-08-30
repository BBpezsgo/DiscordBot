const ytdl = require('ytdl-core')
const Discord = require('discord.js')
const { Color } = require('../../functions/enums')
const { StatesManager } = require('../../functions/statesManager')

function musicGetLengthText(videoLengthSeconds) {
    let videoLengthMinutes = 0
    let videoLengthHours = 0
    for (let l = 0; videoLengthSeconds > 60; l += 1) {
        videoLengthMinutes += 1
        videoLengthSeconds -= 60
    }
    for (let l = 0; videoLengthMinutes > 60; l += 1) {
        videoLengthHours += 1
        videoLengthMinutes -= 60
    }

    let lengthText = '--:--'
    let hours = '' + videoLengthHours
    if (videoLengthHours < 10) {
        hours = '0' + hours
    }
    let minutes = '' + videoLengthMinutes
    if (videoLengthMinutes < 10) {
        minutes = '0' + minutes
    }
    let seconds = '' + videoLengthSeconds
    if (videoLengthSeconds < 10) {
        seconds = '0' + seconds
    }

    if (videoLengthHours === 0) {
        lengthText = minutes + ':' + seconds
    } else {
        lengthText = hours + ':' + minutes + ':' + seconds
    }

    return lengthText
}

class MusicPlayer {

    /**
     * @param {StatesManager} statesManager
     * @param {Discord.Client<boolean>} bot
     */
    constructor (statesManager, bot) {
        /** @type {string[]} */
        this.musicArray = []
        this.musicFinished = true
        /** @type {StatesManager} */
        this.statesManager = statesManager
        /** @type {Discord.Client<boolean>} */
        this.bot = bot
    }
    
    /**
     * @param {Discord.CommandInteraction<Discord.CacheType>} command
     * @param {boolean} privateCommand
     * @returns {boolean}
     */
    async PlayAudio(command) {
        const link = this.musicArray[this.musicArray.length - 1]

        this.musicFinished = false
        this.musicArray.shift()

        const stream = ytdl(link, { filter: 'audioonly' })
        const player = createAudioPlayer()

        /** @type {Discord.VoiceChannel} */
        const voiceChannel = await this.UserVoice(command.guildId, command.user.id)
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        })

        let resource = createAudioResource(stream)

        connection.subscribe(player)
        
        player.play(resource)

        const info = await ytdl.getInfo(link)

        /*const dispatcher = connection.play(stream)
            .on("finish", () => {
                this.musicFinished = true
                if (this.musicArray.length > 0) {
                    PlayAudio(command)
                }
            })
            .on("error", (error) => { log(ERROR + ': ' + error, 24) })
            .on("start", () => { statesManager.ytdlCurrentlyPlaying = true; log('') })
            .on("debug", (message) => { log(DEBUG + ': ytdl: ' + message) })
            .on("close", () => { statesManager.ytdlCurrentlyPlaying = false; log('') })
        */

        const embed = new Discord.EmbedBuilder()
            .setColor(Color.Purple)
            .setURL(info.videoDetails.video_url)
            .setAuthor({ name: command.member.displayName, iconURL: command.member.displayAvatarURL() })
            .setTitle(info.videoDetails.title)
            .setThumbnail(info.videoDetails.thumbnails[0].url)
            .addFields([
                { name: 'Csatorna', value: info.videoDetails.author.name, inline: true },
                { name: 'Hossz', value: musicGetLengthText(info.videoDetails.lengthSeconds), inline: true }
            ])
        if (command.replied == true) {
            command.editReply({ content: '> **\\✔️ Most hallható: \\🎧**', embeds: [embed] })
        } else {
            command.reply({ content: '> **\\✔️ Most hallható: \\🎧**', embeds: [embed] })
        }
        this.statesManager.ytdlCurrentlyPlayingText = info.videoDetails.title
        this.statesManager.ytdlCurrentlyPlayingUrl = link
        return true
    }
    
    /**
     * @param {Discord.CommandInteraction<Discord.CacheType>} command
     * @param {boolean} privateCommand
     * @param {string} link
     */
    async CommandMusic(command, link) {
        const userVoice = await this.UserVoice(command.guildId, command.user.id)
        if (userVoice != null) {
            if (link.startsWith('https://www.youtube.com/watch?v=')) {
                this.musicArray.unshift(link)
                await command.reply({ content: '> **\\➕ Hozzáadva a lejátszólistába! \\🎧**' })
                if (this.musicFinished) {
                    this.PlayAudio(command)
                }
            } else {
                command.reply({ content: '> **\\❌ Érvénytelen URL! \\🎧**' })
            }
        } else {
            command.reply({ content: '> **\\❗  Előbb jépj be egy hangcsatornába! \\🎧**' })
        }
    }

    /**
     * @param {Discord.CommandInteraction<Discord.CacheType>} command
     * @param {boolean} privateCommand
     */
    async CommandMusicList(command) {
        if (this.musicArray.length === 0 && this.statesManager.ytdlCurrentlyPlaying === false) {
            command.reply({ content: '> **A lejátszólista üres \\🎧**' })
        } else {
            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: command.member.displayName, iconURL: command.member.avatarURL() })
            embed.setColor(Color.Purple)
            await ytdl.getBasicInfo(this.statesManager.ytdlCurrentlyPlayingUrl).then(info => {
                embed.addFields([{ name: '\\🎧 Most hallható: ' + info.videoDetails.title, value: '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), inline: false}])
            })
            this.musicArray.forEach(async (_link) => {
                await ytdl.getBasicInfo(_link).then(info => {
                    embed.addFields([{ name: info.videoDetails.title, value: '  Hossz: ' + musicGetLengthText(info.videoDetails.lengthSeconds), inline: false }])
                })
            })
            command.reply({ content: '> **\\🔜 Lejátszólista: [' + this.musicArray.length + ']\\🎧**', embeds: [embed] })
        }
    }

    /**@param {Discord.CommandInteraction<Discord.CacheType>} command @param {boolean} privateCommand */
    async CommandSkip(command) {
        const userVoice = await this.UserVoice(command.guildId, command.user.id)
        if (userVoice != null) {
            this.musicFinished = true
            if (this.musicArray.length === 0) {
                command.reply({ content: '> **\\❌ Nincs következő zene! \\🎧**' })
                return
            }
            this.PlayAudio(command)
            command.reply({ content: '> **\\▶️ Zene átugorva! \\🎧**' })
        } else {
            command.reply({ content: '> **\\❗  Előbb jépj be egy hangcsatornába! \\🎧**' })
        }
    }

    /**
     * @param {string} guildId
     * @param {string} userId
     */
    async UserVoice(guildId, userId) {
        const guild = await this.bot.guilds.fetch(guildId)
        const member = await guild.members.fetch(userId)
        return member.voice.channel
    }
}

module.exports = MusicPlayer