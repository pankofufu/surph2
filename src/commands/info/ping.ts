
import { Message } from 'eris';

import { Embeds, reply } from 'lib/message';

import { client } from 'src';
import Command from 'src/classes/Commands/BaseCommand';

import { hostname } from 'os';

export default class PingCommand extends Command {
	constructor() {
		super({
			name: 'ping',
			description: "Shows response time from Discord's gateway.",
			fullDescription:
				"Responds with the latency of connection to Discord's gateway API, and the server the bot is currently hosted on.",
		});
	}

	run(message: Message): void | Promise<void> {
		/*  shards take a while to come up  */
		reply(message, {
			embed: Embeds.Basic(
				`:ping_pong:  \`${client.shards.get(0)
					?.latency}ms\`\n:satellite:  \`${hostname()}\``,
			),
		});
	}
}
