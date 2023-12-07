const Discord = require('discord.js')
const { Color } = require('../functions/enums')
const { ToUnix } = require('../functions/utils')

/** @type {import("./base").Command} */
const Command = {
	Data: new Discord.SlashCommandBuilder()
		.setName('ping'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     */
	async Execute(interaction, ephemeral, sender) {
        const client = interaction.client
        var WsStatus = "Unknown"
        if (client.ws.status === 0) {
            WsStatus = "Kész"
        } else if (client.ws.status === 1) {
            WsStatus = "Csatlakozás"
        } else if (client.ws.status === 2) {
            WsStatus = "Újracsatlakozás"
        } else if (client.ws.status === 3) {
            WsStatus = "Tétlen"
        } else if (client.ws.status === 4) {
            WsStatus = "Majdnem kész"
        } else if (client.ws.status === 5) {
            WsStatus = "Lecsatlakozba"
        } else if (client.ws.status === 6) {
            WsStatus = "Várakozás guild-okra"
        } else if (client.ws.status === 7) {
            WsStatus = "Azonosítás"
        } else if (client.ws.status === 8) {
            WsStatus = "Folytatás"
        }
        const embed = new Discord.EmbedBuilder()
            .setTitle('Pong!')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/ping-pong_1f3d3.png')
            .setColor(Color.Highlight)
            .addFields([
                {
                    name: '\\🤖 BOT:',
                    value:
                    `> Készen áll: <t:${ToUnix(new Date(client.readyTimestamp))}:T> óta`
                },
                {
                    name: '\\📡 WebSocket:',
                    value:
                    '> Ping: ' + client.ws.ping + ' ms\n' +
                '> Státusz: ' + WsStatus
                }
            ])
        if (client.shard != null) {
            embed.addFields([{
                name: 'Shard:',
                value:
                '> Fő port: ' + client.shard.parentPort + '\n' +
                '> Mód: ' + client.shard.mode
            }])
        }
        await interaction.reply({
            embeds: [ embed ],
            ephemeral,
        })
	},
    Guild: null,
}

module.exports = Command