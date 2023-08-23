import { prefix } from "@surph/config";
import type Event from "@surph/src/classes/Event";
import type { Message } from "eris";
import Args from "../classes/Args";

export default {
    name: 'messageCreate',
    async run(message: Message) {
        if (message.content.slice(0, prefix.length) !== prefix) return;

        const command = Args.getCmd(message.content.split(' ')[0]);
        if (!command) return;

        const args = new Args(message, command);

        try {
            const subcommand = args.subcommand;
            if (subcommand && subcommand.run) subcommand.run(message, args);
            else {
                if (command.preRun && (await command.preRun(message, args)) === false) return;
                if (command.run) await command.run(message, args);
                else throw new Error(`A command that doesn't run? Seriously?`);
            }
        } catch (e) {
            console.error(e); // fix this up later
        }

    },
} as Event;