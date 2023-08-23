//import Args from "@surph/src/classes/Args";
import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { Modals, Embeds, reply } from "@surph/lib/message";

export default class PingCommand extends Command {
    constructor(){super({
        name: 'ping'
    })}

    run(message: Message): void | Promise<void> {
        // reply(message, 'What you gonna do for me today drake?');
        reply(message, 'Pong (wip)');
    }
}