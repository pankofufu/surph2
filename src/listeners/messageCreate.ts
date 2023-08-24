import { prefix } from "@surph/config";
import type Event from "@surph/src/classes/Event";
import { type Message } from "eris";
import { Emojis, reaction } from "lib/message/emojis";
import { client } from "..";
import { DefaultArgs } from "../classes/Args";

export default {
    name: 'messageCreate',
    async run(message: Message) {
        if (message.content.slice(0, prefix.length) !== prefix) return;

        const command = client.commands.get(message.content.split(' ')[0]
                                            .slice(prefix.length));
        if (!command) return;

        const sliced = message.content.slice( prefix.length+command.name.length +1 );
        const args = command.parseArgs?.(message, sliced) || DefaultArgs(sliced);
        const subcommand = args.subcommand ? command.subcommands?.get(args.subcommand) : undefined;

        try {
            const reactionTimeout = setTimeout(async()=>{reaction.add(Emojis.Loading, message)}, 2000);
            if (subcommand && subcommand.run) await subcommand.run(message, args);
            else if (command.run) await command.run(message, args);
            await reaction.remove(Emojis.Loading, message); clearInterval(reactionTimeout);
        } catch (e) {console.error(e);}
    },
} as Event;