import { Message } from 'eris';

import { APIError, OCRResult, req } from 'lib/api';
import { getmedia } from 'lib/media/message';
import { reply } from 'lib/message';
import { BasicError, ErrorWithStack, OCREmbed } from 'lib/message/embeds';
import { Media, getFlags } from 'lib/media/flags';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';

interface ExtFlags {
	url?: string;
}

interface ExtArgs extends BaseArgs {
	url: string | null;
}

export default class OCRCommand extends Command {
	constructor() {
		super({
			name: 'ocr',
			description: 'Scans the text from an image using Google OCR.',
			usage: '?(--url <media>)|(<media>)',
			aliases: ['i2t', 'scanimg', 'imagetext'],
		});
	}

	parseArgs(message: Message, sliced: string) {
		// Remove %ping from content and then find args
		const flags: ExtFlags = Object.fromEntries(getFlags(sliced).flags);

		/* Logic to get URL from message */
		const url =
			flags.url ||
			getmedia({ message: message, types: [Media.Image] })?.url ||
			null;

		const parsed: ExtArgs = {
			content: { before: message.content, after: sliced },
			url: url,
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
		const apiReq = await req('ocr', { url: args.url });
		if (apiReq.type !== 'json') {
			reply(message, {
				embed: ErrorWithStack(
					'Something went wrong.',
					(apiReq.data as APIError).reason,
				),
			});
			return;
		}
		const res = apiReq.data as OCRResult;
		reply(message, { embed: OCREmbed(res) });
		return;
	}
}
