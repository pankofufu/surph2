import type { Flags } from "@surph/lib/util";
import type { Message } from "eris";
import type Args from "../Args";

export interface CommandOptions {
    name: string;
    description?: string;
    usage?: string;
    aliases?: string[];
    timeout?: number;
    flags?: Flags[];
    args?: Record<string, any>;
}

export const _preRun = async (message: Message, args: Args, command: Command): Promise<boolean> => {
    /* TODO: Default pre run
       - Add timeout
       - Add permission looking based on command
    */
    return true;
}

export default class Command {

    options!: CommandOptions;

    preRun?(message: Message, args: Args): boolean | Promise<boolean>;
    run?(message: Message, args: Args): void | Promise<void>; // pls be true...

    onUserError?(message: Message, error: unknown): void | Promise<void>;
    onClientError?(message: Message, error: unknown): void | Promise<void>;

}