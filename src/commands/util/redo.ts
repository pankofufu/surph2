import { Message } from 'eris';

import { reply } from 'lib/message';
import { BasicError } from 'lib/message/embeds';

import { client } from 'src';
import Command from 'src/classes/Commands/BaseCommand';
import messageCreate from 'src/listeners/messageCreate';

export default class PingCommand extends Command {
	constructor() {
		super({
			name: 'redo',
			disableCache: true,
			aliases: ['!!', 'rerun', 're'],
			description: 'Runs your previous command again.',
		});
	}

	async run(message: Message): Promise<void> {
		const cachedMsg = client.messageCache.get(message.author.id);
		if (!cachedMsg) {
			reply(message, {
				embed: BasicError("You haven't ran a command I've cached yet."),
			});
			return;
		}

		messageCreate.run(cachedMsg);
		return;
	}
}
