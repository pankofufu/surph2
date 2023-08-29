import Command from '@surph/src/classes/Commands/BaseCommand';
import { Message } from 'eris';
import { reply } from '@surph/lib/message';
import { BaseArgs } from '@surph/src/classes/Args';
import { BasicError, ErrorWithStack, OCREmbed } from 'lib/message/embeds';
import { getmedia } from 'lib/media/message';
import { Media, getFlags } from 'lib/util/flags';
import { APIError, OCRResult, req } from '@surph/lib/api';

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
			usage: '(--url <media url>|<media>)',
			aliases: ['i2t', 'scanimg', 'imagetext'],
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

		const parsed: ExtArgs = {
			content: { before: message.content, after: sliced },
			url: url,
		};
		return parsed;
	}

	async run(message: Message, args: ExtArgs): Promise<void> {
		if (!args.url) {
			await reply(message, {
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
		await reply(message, { embed: OCREmbed(res) });
		return;
	}
}
