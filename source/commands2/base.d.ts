import * as Discord from "discord.js"
import DiscordBot from "../discord-bot"

type InteractionListener<TEvent> = (interaction: TEvent, sender: DiscordBot) => (Promise<any> | false)

export type GeneralListener = {
    readonly OnButton?: InteractionListener<Discord.ButtonInteraction>
    readonly OnSelectMenu?: InteractionListener<Discord.AnySelectMenuInteraction>
    readonly OnMessageContextMenu?: InteractionListener<Discord.MessageContextMenuCommandInteraction>
}

export type NoCommandListener = {
    readonly Command?: undefined
    readonly OnCommand?: undefined
}

export type YesCommandListener = {
    readonly Command: Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    readonly OnCommand(interaction: Discord.ChatInputCommandInteraction, ephemeral: boolean, sender: DiscordBot): Promise<any>
}

export type Command = { Guild: string | null } & GeneralListener & ( NoCommandListener | YesCommandListener )
