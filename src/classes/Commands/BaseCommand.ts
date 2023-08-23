import type { Message } from "eris";
import type Args from "../Args";
import SubCommand from "./SubCommand";

export interface CommandOptions {
    name: string;
    description?: string;
    usage?: string;
    aliases?: string[];
    subcommands?: SubCommand[];
    timeout?: number;
    args?: Record<string, any>;
}

export default class Command {

    name: string;
    description?: string;
    usage?: string;
    aliases?: string[];
    subcommands?: SubCommand[];
    timeout?: number;
    args?: Record<string, any>;

    constructor(options: CommandOptions) {
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.aliases = options.aliases;
        this.subcommands = options.subcommands;
        this.timeout = options.timeout;
        this.args = options.args;
    }

    static _preRun(message: Message, args: Args, command: Command) {
        /* TODO: Default pre-run managing timeouts and what-not */
    }

    preRun?(message: Message, args: Args): boolean | Promise<boolean>;
    run?(message: Message, args: Args): void | Promise<void>; // pls be true...

    onUserError?(message: Message, error: unknown): void | Promise<void>;
    onClientError?(message: Message, error: unknown): void | Promise<void>;

}