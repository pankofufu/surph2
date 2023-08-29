import { Message } from 'eris';

import { TranslationResult, req } from 'lib/api';
import { reply } from 'lib/message';
import { TranslationEmbed } from 'lib/message/embeds';
import { getFlags } from 'lib/media/flags';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';


interface ExtFlags {
	to?: string;
}

interface ExtArgs extends BaseArgs {
	to?: string;
}

export default class TranslateCommand extends Command {
	constructor() {
		super({
			name: 'translate',
			description: 'Translates text using Google Translate.',
			usage: '?(--to <ISO-639>) (<text>)',
			aliases: ['tr', 'googletranslate', 'gtr'],
		});
	}

	parseArgs(message: Message, sliced: string): ExtArgs {
		const _flags = getFlags(sliced);
		const flags: ExtFlags = Object.fromEntries(_flags.flags);

		let text = _flags.cleaned;
		if ((!text || text.length === 0) && message.referencedMessage)
			text = message.referencedMessage.content;

		return {
			to: flags.to,
			content: { before: sliced, after: text },
		};
	}

	async run(message: Message, args: ExtArgs): Promise<void> {
		if (!args.content.after || args.content.after.length === 0) {
			reply(message, 'Nothing to translate.');
			return;
		}
		let res = await req('translate', {
			text: args.content.after,
			target: args.to || 'en',
		});
		if (res.type !== 'json') return; // error
		const translation = res.data as TranslationResult;
		reply(message, { embed: TranslationEmbed(translation) });
		return;
	}
}
