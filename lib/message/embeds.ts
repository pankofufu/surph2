import { prefix } from 'config';

import { Embed, EmbedField, User } from 'eris';

import { OCRResult, TranslationResult, s_Match } from '../api';
import { Colors } from 'lib/message';
import { DbReminder } from 'lib/util/db';

import { client } from 'src';
import Command from 'src/classes/Commands/BaseCommand';

import npm_package from '../../package.json';


export const Basic = (text: string, color?: Colors) => {
	return {
		description: text,
		color: color || Colors.White,
	} as Embed;
};

export const BasicError = (text: string) => {
	return {
		description: `:octagonal_sign:  ${text}`,
		color: Colors.Red,
	};
};
export const ErrorWithStack = (text: string, stack: string) => {
	return {
		description: `:octagonal_sign:  ${text}\n\`\`\`${stack}\`\`\``,
		color: Colors.Red,
	};
};

//                                                         Reminder      / Total reminders
const BaseReminder = (
	user: User,
	title: string,
	reminder: DbReminder,
	color: Colors,
	index?: number,
	total?: number,
) => {
	return {
		author: { name: user.username, icon_url: user.avatarURL },
		title: `Reminder${title !== '' ? ` ${title}` : ''}`,
		color: color,
		url: reminder.url,
		description: `\`\`\`${reminder.info}\`\`\``,
		footer:
			index !== undefined && total !== undefined
				? { text: `${index + 1} out of ${total} reminders` }
				: undefined, // Can't imagine codetags working in footer
		fields: [
			{
				name: 'Timestamps',
				value: `**Relative:** <t:${reminder.timestamp}:R>\n**Absolute:** <t:${reminder.timestamp}:d>`,
				inline: true,
			},
			{
				name: 'Reminder IDs',
				value: `**Message:** \`${reminder.ids.msg}\`\n**Timestamp:** \`${reminder.timestamp}\``,
				inline: true,
			},
		],
	} as Embed;
};

export const SetReminder = (user: User, reminder: DbReminder) =>
	BaseReminder(user, 'set successfully', reminder, Colors.Green);
export const DueReminder = (user: User, reminder: DbReminder) =>
	BaseReminder(user, 'due now', reminder, Colors.Yellow);
export const ListReminder = (
	user: User,
	reminder: DbReminder,
	index: number,
	total: number,
) => BaseReminder(user, '', reminder, Colors.White, index, total);

export const ShazamEmbed = (match: s_Match) => {
	return {
		title: match.metadata.title,
		url: match.weburl,
		author: { name: match.metadata.artist },
		color: Colors.ShazamBlue,
		image: { url: match.metadata.coverart },
		footer: {
			text: 'Powered by Shazam',
			icon_url:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Shazam_icon.svg/2048px-Shazam_icon.svg.png',
		},
	} as Embed;
};

export const TranslationEmbed = (translation: TranslationResult) => {
	return {
		description: `\`\`\`${translation.text}\`\`\``,
		color: Colors.TranslationBlue,
		thumbnail: {
			url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png',
		},
		fields: [
			{ name: 'From', value: `\`${translation.from}\``, inline: true },
			{ name: 'To', value: `\`${translation.to}\``, inline: true },
		],
	} as Embed;
};
export const OCREmbed = (ocr: OCRResult) => {
	return {
		description: `\`\`\`${ocr.text}\`\`\`\n**From** \`${ocr.lang}\``,
		color: Colors.Green,
		thumbnail: {
			url: 'https://cdn.discordapp.com/attachments/1138818819670933524/1141836922336063519/google-cloud-icon-400w.png',
		},
	} as Embed;
};

export const HelpEmbed = () => {
	let commandStrings: string[] = [];
	client.commands.forEach((command) => {
		commandStrings.push(
			`**\`${prefix}${command.name}\`** - ${
				command.description || 'No description.'
			}`,
		);
	});

	return {
		title: 'About Surph',
		description:
			'**Surph is a Discord bot coded by `vvda` in their spare time.** They absolutely hate maintaining this project with a burning passion, yet they continue to do so. The bot uses Eris to communicate with Discord and is built with TypeScript, thanks to the help of many packages online.',
		color: Colors.SurphYellow, // I forgor hex value
		fields: [{ name: 'Commands', value: commandStrings.join('\n') }],
		thumbnail: {
			url: 'https://cdn.discordapp.com/attachments/1021908533039599636/1145110771148275772/surp.png',
		},
		footer: { text: `Version ${npm_package.version}` },
	} as Embed;
};

export const HelpSyntaxEmbed = () => {
	return {
		title: 'Command Usage Syntax',
		description: `
Each part of a message usage syntax is wrapped in \`(\` and \`)\`.
If that part is optional, it starts with \`?\` and will look like so:
\`\`\`xl
?(<info>)
\`\`\`
If something is to be substituted with content, it's wrapped in \`<\` and \`>\`.
For example, if a command wants media as an argument:
\`\`\`xl
?(--url <url>)|(<media>)
\`\`\`
Where \`<media>\` is a URL or media attached to your message.
If that's not viable, there is a \`--url\` flag supported on most messages.
- The bot will prioritise looking for media from another message if you reply to one.
- The \`|\` in between the parts  means \`or\`, which means you can use either."
`.trim(),
		color: Colors.SurphYellow
	} as Embed;
};

export const CommandInfoEmbed = (command: Command, name?: string) => {
	let fields: EmbedField[] = [];

	if (command.usage)
		fields.push({
			name: 'Usage',
			value: `\`\`\`md\n${prefix}${command.name} ${command.usage}\`\`\``,
		});
	if (command.aliases)
		fields.push({
			name: 'Aliases',
			value: `\`\`\`${command.aliases.join(', ')}\`\`\``,
			inline: true,
		});
	if (command.subcommands)
		fields.push({
			name: 'Aliases',
			value: `\`\`\`${Array.from(command.subcommands.keys()).join(
				', ',
			)}\`\`\``,
			inline: true,
		});

	return {
		title: name || command.name,
		color: Colors.White,
		description:
			command.fullDescription ||
			command.description ||
			'No info is available about this command.',
		fields: fields,
	} as Embed;
};

export const HexEmbed = (text: string) => {
	return {
		description: `\`\`\`${text}\`\`\``,
		color: Colors.White,
		thumbnail: {
			url: 'https://cdn.discordapp.com/attachments/1138818819670933524/1146179020732502156/hex.png',
		},
	} as Embed;
};