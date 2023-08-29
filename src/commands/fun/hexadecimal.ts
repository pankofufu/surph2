import { Message } from 'eris';
import { decode, encode } from 'lib/api';

import { reply } from 'lib/message';
import { HexEmbed } from 'lib/message/embeds';

import { BaseArgs } from 'src/classes/Args';
import Command from 'src/classes/Commands/BaseCommand';
import SubCommand from 'src/classes/Commands/SubCommand';

const subcommands: SubCommand[] = [
	{
		name: 'decode',
		aliases: ['d'],
		parseArgs(message, sliced) {
			return { content: { before: message.content, after: sliced } };
		},
		async run(message, args: BaseArgs) {
			if (!args.content.after) { reply(message, 'no args'); return; };
			reply(message, { embed: HexEmbed(decode(args.content.after))}); return;
		},
		description: 'Decode text from hexadecimal.',
		usage: '?(0x)(<hexadecimal>)'
	},

	{
		name: 'encode',
		aliases: ['e'],
		parseArgs(message, sliced) {
			return { content: { before: message.content, after: sliced } };
		},
		async run(message, args: BaseArgs) {
			if (!args.content.after) { reply(message, 'no args'); return; };
			reply(message, { embed: HexEmbed(encode(args.content.after))}); return;
		},
		description: 'Encode text into hexadecimal.',
		usage: '(<text>)',
	},
];

export default class RemindCommand extends Command {
	constructor() {
		super({
			name: 'hexadecimal',
			description: 'Encode and decode hexadecimal values.',
			aliases: ['hex'],
			subcommands: subcommands,
		});
	}

	parseArgs(message: Message, sliced: string): BaseArgs {
		let subcommand: string | undefined;

		const firstArg = sliced.split(' ')[0].toLowerCase();

		this.subcommands?.forEach((sub) => {
			if (
				sub.name === firstArg ||
				(sub.aliases && sub.aliases.includes(firstArg))
			) {
				subcommand = sub.name;
				return true;
			} else return false;
		});

		return {
			subcommand: { name: subcommand, alias: firstArg },
			content: { before: message.content, after: sliced }
		};
	}

	async run() {
		return; // Shouldn't be accessible
	}
}
