import { prefix } from "@surph/config";
import type Event from "@surph/src/classes/Event";
import type { Message } from "eris";
import Args from "../classes/Args";
import { client } from "..";

export default {
    name: 'messageCreate',
    async run(message: Message) {
        if (message.content.slice(0, prefix.length) !== prefix) return;
        const command = client.commands.get(Args.getCmd(
            message.content.split(' ')[0]
        ));
        if (!command) return console.log('We REALLY don\'t have that command');

        const args = new Args(message, (false /* Implement check for flags here */));

        try {
            if (command.preRun && (await command.preRun(message, args)) === false) return;
            if (command.run) await command.run(message, args);
            else throw new Error(`A command that doesn't run? Seriously?`);
        } catch (e) {
            console.error(e); // fix this up later
        }

    },
} as Event;