import { Client } from "eris";
import { readdirSync } from "fs";
import { settings, token } from "@surph/config";  
import type Command from "@surph/src/classes/Commands/BaseCommand";
import type Event from "@surph/src/classes/Event";
import { __src, print } from "@surph/lib/util";
import { Modals } from "@surph/lib/message";
import { ReminderTimeout, continueWatching } from "lib/util/reminders";
import { TrackedCommand } from "@surph/lib/util";

const fileFilter = (file: string) => {
    if (
        file.endsWith('.map') ||
        file.endsWith('.d.ts')
    ) return false;
    else if (
        file.endsWith('.js') ||
        file.endsWith('.ts')
    ) return true;
    else return false;
}

export default class Surph extends Client {
    commands: Map<string, Command>;
    carousels: Array<Modals.ActiveCarousel> = [];
    dialogs: Array<Modals.ActiveDialog> = [];
    timeouts: Array<ReminderTimeout> = [];
    cooldowns: TrackedCommand[];

    constructor() {
        super(`Bot ${token}`, settings.client);
        this.commands = new Map();
        this.cooldowns = [];
    }

    async run() {
        // You don't have to like it, but I gotta like it.
        readdirSync(`${__src}/listeners`).filter(fileFilter).forEach(async _event => {
            const event = (await import(`${__src}/listeners/${_event}`)).default as Event;
            if (event.once) this.once(event.name, event.run);
            else this.on(event.name, event.run);
        });
        readdirSync(`${__src}/commands`/* Should always have subdirs */).forEach(subdir => {
            readdirSync(`${__src}/commands/${subdir}`).filter(fileFilter).forEach(async command => {
                const CommandClass = (await import(`${__src}/commands/${subdir}/${command}`)).default;
                const initialised: Command = new CommandClass();
                this.commands.set(initialised.name, initialised);
            });
        });

        // Finally, start the bot
        await this.connect();
        this.editStatus(settings.presence.status, settings.presence.activities);
        await continueWatching(); // Reminders
        print.success(`Started the bot`);
    }

}