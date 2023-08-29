import { Message } from 'eris';

import { APIError, ApiBufferResponse, req } from 'lib/api';
import { getmedia } from 'lib/media/message';
import { reply } from 'lib/message';
import { BasicError, ErrorWithStack } from 'lib/message/embeds';
import { Media, getFlags } from 'lib/media/flags';
import { now } from 'lib/util/time';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';

const GANON_SONG = `https://www.youtube.com/watch?v=nnvEbHX7Itc`;
const GANON_ARGS = `volume=4, pitch=-60, music=${GANON_SONG}, deepfry=100, hue=40`;

interface ExtFlags {
	url?: string;
}

interface ExtArgs extends BaseArgs {
	url: string | null;
}

export default class GanondorfCommand extends Command {
	constructor() {
		super({
			name: 'ganondorf',
			description: 'Turns a video into Ganondorf.',
			usage: '?(--url <media>)|(<media>)',
			aliases: ['ganon']
		});
	}

	parseArgs(message: Message, sliced: string) {
		// Remove %ping from content and then find args
		const _flags = getFlags(sliced);
		const flags: ExtFlags = Object.fromEntries(_flags.flags);

		/* Logic to get URL from message */
		const mediaObj = getmedia({
			message: message,
			types: [Media.Audio, Media.Image, Media.Video],
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
			reply(message, { embed: BasicError('Invalid/no media to edit.') });
			return;
		}

		const res = await req('edit', { url: args.url, args: GANON_ARGS });
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
