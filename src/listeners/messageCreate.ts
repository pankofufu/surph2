import { prefix } from "@surph/config";
import type Event from "@surph/src/classes/Event";
import { type Message } from "eris";
import { Emojis, reaction } from "lib/message/emojis";
import { client } from "..";
import { DefaultArgs } from "../classes/Args";
import { print } from "lib/util/logger";
import { reply } from "lib/message/util";
import { ErrorWithStack } from "lib/message/embeds";

const search = (alias: string) => {
    const keyvalsearch = Array.from(client.commands).find(
        keyval => keyval[1].aliases && keyval[1].aliases.includes(alias)
    )
    return keyvalsearch ? keyvalsearch[1] : null;
}

export default {
    name: 'messageCreate',
    async run(message: Message) {
        if (message.content.slice(0, prefix.length) !== prefix) return;

        const q = message.content.split(' ')[0]
                  .slice(prefix.length).toLowerCase();

        const command = client.commands.get(q) || search(q);
        if (!command) return;
        
        print.info(`Command issued: ${prefix}${command.name} - issued by ${message.author.username}`);

        const sliced = message.content.slice( prefix.length+q.length ).trimStart();
        let args = command.parseArgs?.(message, sliced) || DefaultArgs(sliced);
        const subcommand = args.subcommand?.name ? command.subcommands?.get(args.subcommand.name) : undefined;
        if (subcommand && args.subcommand) {
            args = subcommand.parseArgs?.(message, (sliced.slice(args.subcommand.alias?.length || subcommand.name.length).trimStart()) ) || DefaultArgs(sliced);}

        try {
            const reactionTimeout = setTimeout(()=>{reaction.add(Emojis.Loading, message)}, 2000);
            if (subcommand && subcommand.run) await subcommand.run(message, args);
            else if (command.run) await command.run(message, args);
            clearInterval(reactionTimeout); await reaction.remove(Emojis.Loading, message);
                                            // Surprisingly no error if reaction doesn't exist
        } catch (e) {
            const stack = (e as Error).stack;
            reply(message, {embed: ErrorWithStack(
                (e as Error).message, 
                stack?.substring(stack.indexOf("\n") + 1) || 'Unknown error - check console for details')
                });
            console.error(e);
        }
    },
} as Event;