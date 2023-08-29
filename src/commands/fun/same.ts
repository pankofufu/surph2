import { Message } from 'eris';

import { ApiBufferResponse, APIError, req } from 'lib/api';
import { reply } from 'lib/message';
import { ErrorWithStack } from 'lib/message/embeds';
import { getFlags } from 'lib/util/flags';
import { now } from 'lib/util/time';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';

export default class SAMECommand extends Command {
	constructor() {
		super({
			name: 'same',
			description: 'Encodes text into a SAME (EAS) header.',
			fullDescription:
				"Encodes text into a SAME (EAS) header. For some reason I can't find any way to decode these without the requirement of them giving valid EAS info.",
			usage: '(<text>)',
			aliases: ['sameheader', 'eas', 'easencode'],
		});
	}

	parseArgs(message: Message, sliced: string): BaseArgs {
		const _flags = getFlags(sliced);

		let text = _flags.cleaned;
		if ((!text || text.length === 0) && message.referencedMessage)
			text = message.referencedMessage.content;

		return {
			content: { before: sliced, after: text },
		};
	}

	async run(message: Message, args: BaseArgs): Promise<void> {
		if (!args.content.after || args.content.after.length === 0) {
			reply(message, 'Nothing to translate.');
			return;
		}
		let res = await req('same', { text: args.content.after });
		if (res.type !== 'buf') {
			reply(message, {
				embed: ErrorWithStack(
					'Something went wrong.',
					(res.data as APIError).reason,
				),
			});
			return;
		}
		const data = res.data as ApiBufferResponse;
		await reply(message, {}, [
			{ name: `${now().toString()}${res.data.type}`, file: data.buf },
		]);
		return;
	}
}
