import { settings } from 'config';

import { Message } from 'eris';

import { BaseArgs } from '../Args';
import SubCommand from './SubCommand';


export interface CommandOptions {
	name: string;
	description?: string;
	fullDescription?: string;
	usage?: string;
	aliases?: string[];
	subcommands?: SubCommand[];
	timeout?: number;
}

export default class Command {
	name: string;
	description?: string;
	fullDescription?: string;
	usage?: string;
	aliases?: string[];
	subcommands?: Map<string, SubCommand>;
	timeout?: number;

	constructor(options: CommandOptions) {
		this.name = options.name;
		this.description = options.description;
		this.fullDescription = options.fullDescription;
		this.usage = options.usage;
		this.aliases = options.aliases;

		this.timeout = options.timeout || settings.defaultTimeout;

		if (options.subcommands) {
			this.subcommands = new Map();
			options.subcommands.forEach(
				(subcommand: SubCommand) =>
					this.subcommands?.set(subcommand.name, subcommand),
			);
		}
	}

	/*static check(message: Message, args: BaseArgs, command: Command) {
        // TODO: Default before run function managing timeouts and what-not
    }*/

	parseArgs?(message: Message, sliced: string): BaseArgs;
	run?(message: Message, args: BaseArgs): void | Promise<void>; // pls be true...

	onUserError?(message: Message, error: unknown): void | Promise<void>;
	onClientError?(message: Message, error: unknown): void | Promise<void>;
}
