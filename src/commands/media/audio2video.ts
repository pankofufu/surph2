import { Message } from 'eris';

import { APIError, ApiBufferResponse, req } from 'lib/api';
import { getmedia } from 'lib/media/message';
import { reply } from 'lib/message';
import { BasicError, ErrorWithStack } from 'lib/message/embeds';
import { Media, getFlags } from 'lib/media/flags';
import { now } from 'lib/util/time';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';

interface ExtFlags {
	url?: string;
}

interface ExtArgs extends BaseArgs {
	url: string | null;
}

export default class Audio2VideoCommand extends Command {
	constructor() {
		super({
			name: 'audio2video',
			aliases: ['a2v', 'aud2vid'],
			description: 'Makes a video from audio for Discord iOS users.',
			usage: '?(--url <media>)|(<media>)',
		});
	}

	parseArgs(message: Message, sliced: string) {
		/* FLOW:
		 * - Filter out URL from message
		 * - Then filter out args from new content that doesn't includes URL
		 */
		const _flags = getFlags(sliced);
		const flags: ExtFlags = Object.fromEntries(_flags.flags);

		/* Logic to get URL from message */
		const mediaObj = getmedia({
			message: message,
			types: [Media.Audio],
		});
		let media = flags.url || mediaObj?.url || undefined;
		const parsed: ExtArgs = {
			content: { before: message.content, after: _flags.cleaned },
			url: media || '',
		};
		return parsed;
	}

	async run(message: Message, args: ExtArgs): Promise<void> {
		if (!args.url || args.url === '') {
			reply(message, { embed: BasicError('Invalid/no media to use.') });
			return;
		}
		const res = await req('a2v', { url: args.url });
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
