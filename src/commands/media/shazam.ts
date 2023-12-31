import { Message } from 'eris';

import { APIError, Shazam, req } from 'lib/api';
import { Colors, reply } from 'lib/message';
import { getmedia } from 'lib/media/message';
import {
	Basic,
	BasicError,
	ErrorWithStack,
	ShazamEmbed,
} from 'lib/message/embeds';
import { Media, getFlags } from 'lib/media/flags';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';

interface ExtFlags {
	url?: string;
	offset?: string; // All types have to be strings, and converted into other types in Args
}

interface ExtArgs extends BaseArgs {
	url: string | null;
	offset: number | null;
}

export default class ShazamCommand extends Command {
	constructor() {
		super({
			name: 'shazam',
			description: 'Matches music from media using Shazam.',
			fullDescription:
				'Uses a WASM version of Shazam to match a song from video/audio.\nThanks to NULLderef for ripping the WASM and providing code that makes it usable.',
			usage: '?(--offset <number>) ?(--url <media>)|(<media>)',
			aliases: ['findsong', 'songfind', 'matchsong', 'shz'],
		});
	}

	parseArgs(message: Message, sliced: string) {
		// Remove %ping from content and then find args
		const flags: ExtFlags = Object.fromEntries(getFlags(sliced).flags);

		/* Logic to get URL from message */
		const url =
			flags.url ||
			getmedia({ message: message, types: [Media.Audio, Media.Video] })
				?.url ||
			null;
		/* Logic to get Shazam offset */
		let number = Number(
			flags.offset ||
				sliced.split(' ').find((word) => !isNaN(Number(word))),
		);
		if (
			isNaN(number) ||
			flags.offset === 'true' /* true means no value supplied */
		)
			number = 0;

		const parsed: ExtArgs = {
			content: { before: message.content, after: sliced },
			url: url,
			offset: number,
		};
		return parsed;
	}

	async run(message: Message, args: ExtArgs): Promise<void> {
		if (!args.url) {
			reply(message, {
				embed: BasicError('Invalid/no media supplied.'),
			});
			return;
		}
		const res = await req('shazam', { url: args.url });
		if (res.type !== 'json') {
			reply(message, {
				embed: ErrorWithStack(
					'Something went wrong.',
					(res.data as APIError).reason,
				),
			});
			return;
		}
		const matches = (res.data as Shazam).matches;
		if (!matches || (matches && matches.length == 0)) {
			reply(message, {
				embed: Basic('No matches found.', Colors.ShazamBlue),
			});
			return;
		}

		reply(message, { embed: ShazamEmbed(matches[0]) });
		return;
	}
}
