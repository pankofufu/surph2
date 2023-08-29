import { Message } from 'eris';

import { BaseArgs } from '../Args';
import Command, { CommandOptions } from './BaseCommand';

export default class SubCommand extends Command {
	default?: boolean;

	constructor(options: CommandOptions) {
		super(options);
	}

	run?(message: Message, args: BaseArgs): void | Promise<void>; // pls be true...

	onUserError?(message: Message, error: unknown): void | Promise<void>;
	onClientError?(message: Message, error: unknown): void | Promise<void>;
}
