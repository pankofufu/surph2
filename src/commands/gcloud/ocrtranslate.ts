import { Message } from 'eris';

import { APIError, OCRResult, TranslationResult, req } from 'lib/api';
import { getmedia } from 'lib/media';
import { reply } from 'lib/message';
import { ErrorWithStack, TranslationEmbed } from 'lib/message/embeds';
import { Media, getFlags } from 'lib/media/flags';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';

interface ExtFlags {
	to?: string;
	url?: string;
}

interface ExtArgs extends BaseArgs {
	to?: string;
	url: string | null;
}

export default class OCRTranslateCommand extends Command {
	constructor() {
		super({
			name: 'ocrtranslate',
			description: 'OCRs an image and then translates the text.',
			usage: '?(--to <ISO-639 code>) (--url <media url>|<media>)',
			aliases: ['ocrtr', 'ocrgtr'],
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
		/* Logic to get Shazam offset */

		return {
			to: flags.to,
			url: url,
			content: { before: sliced, after: '' /* Fuck it */ },
		};
	}

	async run(message: Message, args: ExtArgs): Promise<void> {
		if (!args.url || args.url.length === 0) {
			reply(message, 'Invalid/no media to OCR.');
			return;
		}
		let ocrRes = await req('ocr', {
			url: args.url /* API hasn't implemented source & target lang yet */,
		});
		if (ocrRes.type !== 'json') {
			reply(message, {
				embed: ErrorWithStack(
					'Something went wrong.',
					(ocrRes.data as APIError).reason,
				),
			});
			return;
		}
		const trRes = await req('translate', {
			text: (ocrRes.data as OCRResult).text,
			target: args.to || 'en',
		});
		if (trRes.type !== 'json') {
			reply(message, {
				embed: ErrorWithStack(
					'Something went wrong.',
					(trRes.data as APIError).reason,
				),
			});
			return;
		}

		const translation = trRes.data as TranslationResult;
		translation.from = (ocrRes.data as OCRResult).lang;
		await reply(message, { embed: TranslationEmbed(translation) });

		return;
	}
}
