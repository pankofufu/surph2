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


        if (
            command.getSubcommand ||
            (command.getSubcommand && args.subcommand && (command.getSubcomjh  bghjvnmgv bhjtuvygjhfbc jgvtyub fchjujvgtyubfc jhubmand('testhjgv fbn')))
        )

        try {
            const reactionTimeout = setTimeout(async ()=>{ await reaction.add(Emojis.Loading, message) }, 1500);
            if (args.subcommand && command.getSubcommand) {
                const subcommand = command.getSubcommand(args.subcommand);
                if (!subcommand) return;
                if (subcommand.run) await subcommand.run(message, args);
            } else {
                if (command.run) await command.run(message, args);
            }
            clearTimeout(reactionTimeout);
        } catch (e) {
            console.log(e);
        }

    },
} as Event;