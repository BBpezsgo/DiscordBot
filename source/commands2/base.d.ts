import * as Discord from "discord.js"
import DiscordBot from "../discord-bot"

export type Command = {
    Data: Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    Execute(interaction: Discord.ChatInputCommandInteraction, ephemeral: boolean, sender: DiscordBot): Promise<void>
    Guild: string | null
    OnButton?(interaction: Discord.ButtonInteraction, sender: DiscordBot): (Promise<void> | false)
    OnSelectMenu?(interaction: Discord.AnySelectMenuInteraction, sender: DiscordBot): (Promise<void> | false)
}