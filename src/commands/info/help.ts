import { BaseArgs } from "@surph/src/classes/Args";
import Command from "@surph/src/classes/Commands/BaseCommand"
import { Message } from "eris";
import { reply } from "lib/message/util";
import { client } from "../..";
import { BasicError, CommandInfoEmbed, HelpEmbed } from "lib/message/embeds";

interface HelpArgs extends BaseArgs {
    command?: string;
    _subcommand?: string;
}

export default class HelpCommand extends Command {
    constructor(){super({
        name: 'help',
        description: 'This command.',
        fullDescription: 'Tells you about the bot and lists all the commands it currently has available.',
        usage: '?(<command name>) ?(<subcommand name>)',
        aliases: ['about'],
    })}

    parseArgs(_message: Message, sliced: string): HelpArgs {
        let subcommand;
        if (sliced.split(' ').length > 1) subcommand = sliced.split(' ')[1].toLowerCase();
        return {
            command: sliced.split(' ')[0].toLowerCase(), 
            _subcommand: subcommand,
            content: {before: _message.content, after: sliced}};
    }

    async run(message: Message, args: HelpArgs) {
        if (args.command) {
            const command = client.commands.get(args.command);
            if (!command) {
                reply(message, { embed: BasicError(`I couldn\'t find the command \`${args.command}\`.\nRun *just* this command without any args to see all the commands the bot has.`) });
                return;
            }

            if (args._subcommand) {
                const subcommand = command.subcommands?.get(args._subcommand);
                if (!subcommand) reply(message, {embed: CommandInfoEmbed(command)}); // Just give base command info
                else reply(message, {embed: CommandInfoEmbed(subcommand, `${command.name} ${subcommand.name}`)});
                return;
            }
            
            reply(message, {embed: CommandInfoEmbed(command)});
            return;
        }

        reply(message, { embed: HelpEmbed() });
        return;

    }
}