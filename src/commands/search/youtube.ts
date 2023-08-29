import { Message } from 'eris';

import { reply } from 'lib/message';
import { BasicError } from 'lib/message/embeds';
import { getFlags } from 'lib/util/flags';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';

import ytsr from 'ytsr';


interface ExtFlags {
	query?: string;
}
interface ExtArgs extends BaseArgs {
	query: string | null;
}

export default class YouTubeCommand extends Command {
	constructor() {
		super({
			name: 'youtube',
			description: 'Searches YouTube for a video.',
			fullDescription:
				'Searches YouTube for a video using the provided search query.',
			usage: '(<search query>)',
			aliases: ['yt', 'ytsr', 'searchyt', 'ytsearch'],
		});
	}

	parseArgs(_message: Message, sliced: string) {
		const flags: ExtFlags = Object.fromEntries(getFlags(sliced).flags);
		return { query: flags.query || sliced } as ExtArgs;
	}

	async run(message: Message, args: ExtArgs): Promise<void> {
		if (!args.query) {
			reply(message, { embed: BasicError('Invalid/no search query.') });
			return;
		}

		const resp = await ytsr(args.query);
		const y = resp.items.filter((x) => x.type == 'video')[0];

		if (y.type != 'video') {
			reply(message, { embed: BasicError('No results.') });
		} else reply(message, y.url);
		return;
	}
}
