import { prefix } from "@surph/config";
import type Event from "@surph/src/classes/Event";
import { type Message } from "eris";
import { Emojis, reaction } from "lib/message/emojis";
import { client } from "..";
import { DefaultArgs } from "../classes/Args";
import Command from "../classes/Commands/BaseCommand";

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

        const sliced = message.content.slice( prefix.length+q.length +1 );
        const args = command.parseArgs?.(message, sliced) || DefaultArgs(sliced);
        const subcommand = args.subcommand ? command.subcommands?.get(args.subcommand) : undefined;

        try {
            const reactionTimeout = setTimeout(()=>{reaction.add(Emojis.Loading, message)}, 2000);
            if (subcommand && subcommand.run) await subcommand.run(message, args);
            else if (command.run) await command.run(message, args);
            clearInterval(reactionTimeout); await reaction.remove(Emojis.Loading, message);
                                            // Surprisingly no error if reaction doesn't exist
        } catch (e) {console.error(e);}
    },
} as Event;