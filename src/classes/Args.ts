import { FlagsAndContent, getFlags } from "lib/util/flags";

export interface BaseArgsOptions {
    content: {before: string, after?: string};
    flags?: FlagsAndContent; // use as <interface args>
    subcommand?: string;
}

export class BaseArgs {
    content: {before: string, after?: string};
    flags?: FlagsAndContent; // use as <interface args>
    subcommand?: string;

    constructor(options: BaseArgsOptions) {
        this.content = options.content;
        this.flags = options.flags;
        this.subcommand = options.subcommand;
    }

}

export const DefaultArgs = (sliced: string) => new BaseArgs(
    { content: { before: sliced }, flags: getFlags(sliced) }
)