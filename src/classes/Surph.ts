import { Client } from "eris";
import { readdirSync } from "fs";
import { settings, token } from "@surph/config";  
import type Command from "@surph/src/classes/Commands/BaseCommand";
import type Event from "@surph/src/classes/Event";
import { __src } from "@surph/lib/util";
import { Modals } from "@surph/lib/message";
import { ReminderTimeout, continueWatching } from "lib/util/reminders";

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

    constructor() {
        super(`Bot ${token}`, settings.client);
        this.commands = new Map();
    }

    async run() {
        // You don't have to like it, but I gotta like it.
        readdirSync(`${__src}/listeners`).filter(fileFilter).forEach(async event => {
            const imported = (await import(`${__src}/listeners/${event}`)).default as Event;

            if (imported.once) this.once(imported.name, imported.run);
            else this.on(imported.name, imported.run);
        });
        readdirSync(`${__src}/commands`/* Should always have subdirs */).forEach(subdir => {
            readdirSync(`${__src}/commands/${subdir}`).filter(fileFilter).forEach(async command => {
                const imported = new (await import(`${__src}/commands/${subdir}/${command}`)).default as Event;
                this.commands.set(imported.name, imported);
            });
        });

        // Finally, start the bot
        await this.connect();
        await continueWatching(); // Reminders
    }

}