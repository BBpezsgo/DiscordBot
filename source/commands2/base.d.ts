import { SlashCommandBuilder } from "discord.js"
import DiscordBot from "../discord-bot"

export type Command = {
    Data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    Execute(interaction: ChatInputCommandInteraction, ephemeral: boolean, sender: DiscordBot): Promise<void>
}