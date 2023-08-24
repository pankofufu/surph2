import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { Embeds, reply } from "@surph/lib/message";
import { hostname } from "os";
import { client } from "../..";

export default class PingCommand extends Command {
    constructor(){super({
        name: 'ping'
    })}

    run(message: Message): void | Promise<void> {
                                                          /*  shards take a while to come up  */
        reply(message, {embed: Embeds.Basic(`:ping_pong:  \`${client.shards.get(0)?.latency}ms\`\n:satellite:  \`${hostname()}\``)});
    }
}