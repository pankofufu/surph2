//import Args from "@surph/src/classes/Args";
import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { reply } from "@surph/lib/message";
import SubCommand from "@surph/src/classes/Commands/SubCommand";

const subcommands: SubCommand[] = [
    {name: 'list', aliases: ['ls'], run(message, args) {
        reply(message, "hello from subcommand list");
    }}
]

export default class RemindCommand extends Command {
    constructor(){super({
        name: 'remind',
        aliases: ['reminder', 'remindme', 'alarm'],
        subcommands: subcommands
    })}

    run(message: Message): void | Promise<void> {
        // reply(message, 'What you gonna do for me today drake?');
        reply(message, 'hello from main reminder');
    }
}