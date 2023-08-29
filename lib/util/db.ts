import { QuickDB } from 'quick.db';
const db = new QuickDB({ filePath: 'db.sqlite' });

export interface DbReminder {
	info: string;
	timestamp: number;
	url: string;
	ids: { channel: string; msg: string; user: string };
}

interface DbUser {
	reminders: DbReminder[];
}

// db functions like so:
// get_user() -> store to variable -> make changes -> update_user(changes)
export const getUser = async (id: string): Promise<DbUser> => {
	const user = await db.get(id);
	if (!user) return { reminders: [], aihistory: [] } as DbUser;
	else return user;
};
export const setUser = async (id: string, updated: DbUser): Promise<void> => {
	await db.set(id, updated);
	return;
};

export const pullDB = async (): Promise<{ id: string; value: DbUser }[]> => {
	return await db.all();
};
