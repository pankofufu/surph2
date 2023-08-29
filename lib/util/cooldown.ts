import { settings } from 'config';

import { Guild, Message } from 'eris';

import { print } from './logger';
import { now } from './time';

import { client } from 'src';
import Command from 'src/classes/Commands/BaseCommand';


export interface TrackedCommand {
	command: Command;
	running: boolean;
	finishedAt?: number; // timestamp when it finished running
	//  to get the amount of time left for a cooldown,
	// do ( timeout - now() - finishedAt )
	message: Message;
	guild?: Guild;
}

export const setCooldown = (message: Message, command: Command) => {
	client.cooldowns.push({
		running: true,
		command: command,
		message: message,
		guild: message.guildID ? client.guilds.get(message.guildID) : undefined,
	});
};

export const leaseCooldown = (id: string) => {
	let index = client.cooldowns.findIndex((x) => id === x.message.id);
	const cooldown = client.cooldowns.find((x) => id === x.message.id);
	
	if (isNaN(index) || !cooldown) return print.info('Tried leasing non-existant cooldown');

	cooldown.finishedAt = now();
	cooldown.running = false;
	client.cooldowns[index] = cooldown;

	setTimeout(
		() => {
			let index = client.cooldowns.findIndex((x) => id === x.message.id); // Update in case high activity
			if (isNaN(index)) return;
			client.cooldowns.splice(index, 1);
		},
		(cooldown.command.timeout || settings.defaultTimeout) * 1000,
	);

	return;
};

export const getCooldown = (message: Message, command: Command) => {
	const cooldown = client.cooldowns.find(
		(x) =>
			x.command.name === command.name &&
			(x.message.author.id === message.author.id ||
				x.guild?.id === message.guildID),
	);

	if (cooldown) return cooldown;
	else return null;
};
