import { Message } from 'eris';

import { APIError, ApiBufferResponse, req } from 'lib/api';
import { reply } from 'lib/message';
import { ErrorWithStack } from 'lib/message/embeds';
import { now } from 'lib/util/time';

import Command from 'src/classes/Commands/BaseCommand';

const TRAVIS_URL = `https://cdn.discordapp.com/attachments/1138818819670933524/1146215326657298523/travismono.mp4`;
const TRAVIS_ARGS = `se,s=3.65, mute=true, speed=1.5, sfx=50`;

export default class TravisScottCommand extends Command {
	constructor() {
		super({
			name: 'travisscott',
			aliases: ['travis', 'trav', 'bigdog'],
			description: "Puts SFX over a Travis Scott vid."
		});
	}

	async run(message: Message): Promise<void> {
		const res = await req('edit', { 
			url: TRAVIS_URL, 
			args: TRAVIS_ARGS });
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
	}
}
