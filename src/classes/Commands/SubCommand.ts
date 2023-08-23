import type { Message } from "eris";
import type Args from "../Args";
import Command, { CommandOptions } from "./BaseCommand";

export default class SubCommand extends Command {

    default?: boolean;

    constructor(options: CommandOptions) {
        super(options)
    }

    preRun?(message: Message, args: Args): boolean | Promise<boolean>;
    run?(message: Message, args: Args): void | Promise<void>; // pls be true...

    onUserError?(message: Message, error: unknown): void | Promise<void>;
    onClientError?(message: Message, error: unknown): void | Promise<void>;

}