import { prefix } from "@surph/config";
import type Event from "@surph/src/classes/Event";
import type { Message } from "eris";
import Args from "../classes/Args";
import { Emojis, reaction } from "lib/message/emojis";

export default {
    name: 'messageCreate',
    async run(message: Message) {
        if (message.content.slice(0, prefix.length) !== prefix) return;

        const command = Args.getCmd(message.content.split(' ')[0]);
        if (!command) return;

        const args = new Args(message, command);

        try {
            const reactionTimeout = setTimeout(async ()=>{ await reaction.add(Emojis.Loading, message) }, 1500);
            const subcommand = args.subcommand;
            if (subcommand) {
                if (subcommand.preRun && (await subcommand.preRun(message, args)) === false) return;
                if (subcommand.run) await subcommand.run(message, args);
                clearTimeout(reactionTimeout);
            }
            else {
                if (command.preRun && (await command.preRun(message, args)) === false) return;
                if (command.run) await command.run(message, args);
                else throw new Error(`A command that doesn't run? Seriously?`);
                
                clearTimeout(reactionTimeout);
            }
        } catch (e) {
            console.error(e); // fix this up later
        }

    },
} as Event;