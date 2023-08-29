import { prefix, settings } from 'config';

import { Message } from 'eris';

import { BasicError, ErrorWithStack } from 'lib/message/embeds';
import { Emojis, reaction } from 'lib/message/emojis';
import { escape } from 'lib/message/markdown';
import { reply } from 'lib/message/util';

import { getCooldown, leaseCooldown, setCooldown } from 'lib/util/cooldown';
import { print } from 'lib/util/logger';
import { search } from 'lib/util/search';
import { now } from 'lib/util/time';

import { client } from 'src';
import { DefaultArgs } from 'src/classes/Args';
import Event from 'src/classes/Event';


export default {
	name: 'messageCreate',
	async run(message: Message) {
		if (message.content.slice(0, prefix.length) !== prefix) return;

		const q = message.content
			.split(' ')[0]
			.slice(prefix.length)
			.toLowerCase();

		const command = client.commands.get(q) || search(q);
		if (!command) return;

		print.info(
			`Command issued: ${prefix}${command.name} - issued by ${message.author.username}`,
		);

		const cooldown = getCooldown(message, command);
		if (cooldown) {
			const timeLeft = Math.max(
				0,
				(command.timeout || settings.defaultTimeout) -
					(now() - (cooldown.finishedAt || now())),
			);
			if (cooldown.running)
				reply(message, {
					embed: BasicError(
						`This command is currently running.\nSee: ${cooldown.message.jumpLink}`,
					),
				});
			else
				reply(message, {
					embed: BasicError(
						`This command is on cooldown.${
							cooldown.finishedAt
								? `\nPlease wait ${timeLeft+1} seconds to use this command again.`
								: ``
						}`,
					),
				});
			return;
		}

		const sliced = message.content
			.slice(prefix.length + q.length)
			.trimStart();
		
		let args = command.parseArgs?.(message, escape.all(sliced)) || DefaultArgs(escape.all(sliced));
		const subcommand = args.subcommand?.name
			? command.subcommands?.get(args.subcommand.name)
			: undefined;
		if (subcommand && args.subcommand) {
			args =
				subcommand.parseArgs?.(
					message,
					escape.all( sliced
						.slice(
							args.subcommand.alias?.length ||
								subcommand.name.length,
						)
						.trimStart() ),
				) || DefaultArgs(escape.all(sliced));
		}

		setCooldown(message, command);
		try {
			const reactionTimeout = setTimeout(() => {
				reaction.add(Emojis.Loading, message);
			}, 2000);
			if (subcommand && subcommand.run)
				await subcommand.run(message, args);
			else if (command.run) await command.run(message, args);
			clearInterval(reactionTimeout);
			await reaction.remove(Emojis.Loading, message);
			// Surprisingly no error if reaction doesn't exist
			leaseCooldown(message.id); // awaiting so the command will run through and THEN lease when it's done
		} catch (e) {
			const stack = (e as Error).stack;
			reply(message, {
				embed: ErrorWithStack(
					(e as Error).message,
					stack?.substring(stack.indexOf('\n') + 1) ||
						'Unknown error - check console for details',
				),
			});
			console.error(e);
		}
	},
} as Event;
