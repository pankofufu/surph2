import { FlagsAndContent, getFlags } from 'lib/media/flags';

export interface BaseArgsOptions {
	content: { before: string; after?: string };
	flags?: FlagsAndContent; // use as <interface args>
	subcommand?: { name: string; alias?: string };
}

export class BaseArgs {
	content: { before: string; after?: string };
	flags?: FlagsAndContent; // use as <interface args>
	subcommand?: { name?: string; alias?: string };

	constructor(options: BaseArgsOptions) {
		this.content = options.content;
		this.flags = options.flags;
		this.subcommand = options.subcommand;
	}
}

export const DefaultArgs = (sliced: string) =>
	new BaseArgs({ content: { before: sliced }, flags: getFlags(sliced) });
