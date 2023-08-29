import { DbReminder, getUser, pullDB, setUser } from './db';
import { reply } from '../message';
import { DueReminder } from 'lib/message/embeds';
import { inPast, now } from './time';

import { client } from 'src';


export const setReminder = async (uid: string, reminder: DbReminder) => {
	const user = await getUser(uid);
	user.reminders.push(reminder);
	await setUser(uid, user);
	watch(reminder);
	return;
};
export const delReminder = async (
	uid: string,
	mid: string,
): Promise<null | void> => {
	const user = await getUser(uid);
	const exists = user.reminders.every((r) => {
		if (r.ids.msg === mid || r.timestamp === Number(mid)) {
			user.reminders = user.reminders.filter(
				(reminder) =>
					reminder.ids.msg !== mid ||
					reminder.timestamp == Number(mid),
			);
			return true;
		} else return false;
	});
	if (!exists) return null;

	const timeout =
		client.timeouts.find((t) => t.mid === mid) ||
		client.timeouts.find((t) => t.timestamp == Number(mid));
	if (timeout) clearTimeout(timeout.timeout);

	await setUser(uid, user);
	return;
};

const stopUserIntervals = (reminders: DbReminder[]) => {
	reminders.forEach((reminder) => {
		const timeout = client.timeouts.find((t) => t.mid === reminder.ids.msg);
		if (timeout) clearTimeout(timeout.timeout);
	});
};
export const clearReminders = async (uid: string) => {
	const user = await getUser(uid);
	stopUserIntervals(user.reminders);
	user.reminders = [];
	await setUser(uid, user);
};

export interface ReminderTimeout {
	mid: string;
	timestamp: number;
	timeout: NodeJS.Timeout;
}

const watch = async (reminder: DbReminder) => {
	if ((reminder.timestamp * 1000) - (now() * 1000) > (2 ** 31)) {
		// Reminder doesn't activate in the next 24 days
		// and ideally the bot should be restarting daily
		return;
	}
	client.timeouts.push({
		mid: reminder.ids.msg,
		timestamp: reminder.timestamp,
		timeout: setTimeout(
			async () => {
				const ref = await client.getMessage(
					reminder.ids.channel,
					reminder.ids.msg,
				);
				if (!ref) return;
				reply(ref, { embed: DueReminder(ref.author, reminder) });
				await delReminder(reminder.ids.user, reminder.ids.msg);
			},
			reminder.timestamp * 1000 - now() * 1000,
		),
	} as ReminderTimeout);
	/* Started polling 1 reminder */
};

export const continueWatching = async () => {
	const db = await pullDB();
	db.forEach((user) => {
		user.value.reminders.forEach(async (reminder) => {
			if (inPast(reminder.timestamp)) {
				await delReminder(reminder.ids.user, reminder.ids.msg);
				return;
			}
			if (client.timeouts.filter((x) => x.mid === reminder.ids.msg))
				return; // do not add if already watching (pls work)
			watch(reminder);
		});
	});
};
