import { prefix } from "@surph/config";
import { Message } from "eris";
import { getmedia } from "lib/media/message";
import Command from "./Commands/BaseCommand";
import { client } from "..";
import { Flags } from "@surph/lib/util";
import SubCommand from "./Commands/SubCommand";

export default class Args {

    wantsMedia: boolean;
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

    constructor(message: Message, command: Command) {
        this.message = message; // nice one

        this.wantsMedia = (command.flags && command.flags.filter(flag=>flag in Flags.Media)) ? true : false; // ok

        let xd = message.content.split(' ');

        this.command = Args.getCmd(xd[0].toLowerCase());
        if (!command) {this.joined = xd.join(' '); return;} // command DEFINITELY exists

        xd.shift(); /* why does .shift() return the FUCKING value?? 
                       and STILL shift it?? WHAT THE FUCK!?? */

        if (xd[0] /* if there's more after main command check for subcmd */) this.subcommand = Args.getSubcommand(xd[0].toLowerCase(), command);

        xd.shift(); // shift again because we need to remove the subcommand
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
        if (this.wantsMedia && flags.has('url')) {
            // look for media in messagse
            const get = getmedia(this.message);
            
            if (get) { flags.set('url', get.url); this.joined = get.replaced; /* url removed from content */ }
            
        }
        return flags;
    }
}