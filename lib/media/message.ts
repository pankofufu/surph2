import { Message } from 'eris';

import { MediaSubType } from 'lib/media/flags';

const getrefmsg = (msg: Message) => {
	if (!msg.referencedMessage) return null;
	return msg.referencedMessage;
};
export const urlregex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
interface Media {
	url: string;
	replaced: string;
}
// todo: add choice of multiple attachments if found

interface GetMediaOptions {
	message: Message;
	content?: string;
	types: MediaSubType[];
	fromReference?: boolean;
	attachmentsOnly?: boolean;
}

/*const checkmedia = (types: MediaSubType[], url: string, content: string) => {
	let match: string | undefined;

	for (const type of types) {
		if (type.includes(path.extname(url).slice(1))) {
			match = url;
			break; // Exit the loop early if a match is found
		}

		if (
			type.find((whitelisted) =>
				whitelisted.includes(new URL(url).hostname.replace('www.', '')),
			)
		) {
			match = url;
			break; // Exit the loop early if a match is found
		}
	}

	if (match) {
		return { url: match, replaced: content.replace(urlregex, '') };
	} else return null;
};*/

const allowed = (url: string, types: MediaSubType[]) =>
	types.some((type) =>
		type.some(
			(val) =>
				new URL(url.toLowerCase()).pathname.endsWith(val) || // path ends with value (could be extension)
				new URL(url.toLowerCase()).href // Fuck it man use the href
					.replace('www.', '')
					.includes(val), // hostname has value (could be domain)
		),
	);

const replace = (content: string) =>
	content
		.split(' ')
		.filter((word) => !urlregex.test(word))
		.join(' ');

export const getmedia = (options: GetMediaOptions): Media | null => {
	let content: string;
	if (options.content) content = options.content;
	else content = options.message.content;

	const ref = getrefmsg(options.message);
	if (ref && !options.fromReference) {
		const _options = options;
		_options.message = ref;
		_options.fromReference = true;
		return getmedia(_options);
	}

	if (options.message.attachments.length !== 0) {
		const url = options.message.attachments[0].url;
		if (!allowed(url, options.types)) return null;
		return { url: url, replaced: replace(content) };
	} else {
		const url = content.match(urlregex);
		if (!url || (url && !allowed(url[0], options.types))) return null;
		return { url: url[0] /* ok */, replaced: replace(content) };
	}
};
