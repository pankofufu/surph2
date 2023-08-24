import type { Message } from "eris";
import {BaseArgs} from "../Args";
import SubCommand from "./SubCommand";

export interface CommandOptions {
    name: string;
    description?: string;
    usage?: string;
    aliases?: string[];
    subcommands?: SubCommand[];
    timeout?: number;
}

export default class Command {

    name: string;
    description?: string;
    usage?: string;
    aliases?: string[];
    subcommands?: SubCommand[];
    timeout?: number;

    constructor(options: CommandOptions) {
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.aliases = options.aliases;
        this.subcommands = options.subcommands;
        this.timeout = options.timeout;
    }

    static check(message: Message, args: BaseArgs, command: Command) {
        /* TODO: Default before run function managing timeouts and what-not */
    }

    getSubcommand?(name: string) {
        return this.subcommands?.find(sub=>
            sub.name === name ||
            ( sub.aliases && sub.aliases.includes( name ) )
        )
    }

    parseArgs?(message: Message, sliced: string): BaseArgs;
    run?(message: Message, args: BaseArgs): void | Promise<void>; // pls be true...

    onUserError?(message: Message, error: unknown): void | Promise<void>;
    onClientError?(message: Message, error: unknown): void | Promise<void>;

}