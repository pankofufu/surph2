import { prefix } from "@surph/config";
import { Message } from "eris";
import { getmedia } from "lib/media/message";
import Command from "./Commands/BaseCommand";
import { client } from "..";
import SubCommand from "./Commands/SubCommand";
import MediaCommand from "./Commands/MediaCommand";
import { MediaSubType } from "lib/util/flags";

export default class Args {
    mediaTypes?: MediaSubType[]

    message: Message;
    joined: string;

    command: Command | undefined;
    subcommand?: SubCommand;

    static getCmd(val: string): Command | undefined {
        let x=val.slice(prefix.length, val.length).toLowerCase();
        client.commands.forEach(command => {if(command.aliases?.includes(x)) x=command.name});
        return client.commands.get(x) || undefined;
    }

    static getSubcommand(val: string, command: Command): SubCommand | undefined {
        const subcommands = command.subcommands;
        if (!subcommands) return undefined;
        return subcommands.find((subcommand) => (subcommand.name === val || subcommand.aliases?.includes(val))) || undefined;
    }

    constructor(message: Message, command: MediaCommand | Command) {
        this.message = message; // nice one

        let xd = message.content.split(' ');

        this.command = Args.getCmd(xd[0].toLowerCase());
        if (!command) {this.joined = xd.join(' '); return;} // command DEFINITELY exists

        xd.shift(); /* why does .shift() return the FUCKING value?? 
                       and STILL shift it?? WHAT THE FUCK!?? */

        if (xd[0] /* if there's more after main command check for subcmd */) {
            this.subcommand = Args.getSubcommand(xd[0].toLowerCase(), command);
            if (this.subcommand) xd.shift(); // shift again to remove subcommand,
            //                                  but only if subcommand exists
        }

        if ((this.command as MediaCommand).media !== undefined ) this.mediaTypes = (this.command as MediaCommand).media;
        this.joined = xd.join(' ');
    }

    get arr() {
        return this.joined.split(' ');
    }

    get options(): Map<string, any> {
        const flags: Map<string, any> = new Map();
        const parts = this.joined.split("-");
        for (let i = 0; i < parts.length; i++) {
            const flag = parts[i].trim();
            if (flag !== "") {
                const [name, value] = flag.split(" ");
                let parsedValue: string | number | boolean;
                if (value === "true" || value === "y" || value === "yes" || value === undefined) {
                    parsedValue = true;
                } else if (value === "false") {
                    parsedValue = false;
                } else if (!isNaN(Number(value))) {
                    parsedValue = Number(value);
                } else {
                    parsedValue = value;
                }
                flags.set(name, parsedValue);
            }
        }
        if (this.mediaTypes && !flags.has('url')) {
            // look for media in messages
            const get = getmedia(this.message, this.mediaTypes);
            if (get) { flags.set('url', get.url); this.joined = get.replaced; /* url removed from content */ }
            
        }
        return flags;
    }
}