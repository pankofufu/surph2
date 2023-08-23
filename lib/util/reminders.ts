import { DbReminder, getUser, pullDB, setUser } from "./db"
import { reply } from "../message";
import { client } from "@surph/src/index";
import { now } from "./time";

export const setReminder = async (uid:string, reminder: DbReminder) => {
    const user = await getUser(uid);
    user.reminders.push(reminder);
    await setUser(uid, user);
    watch(reminder);
    return;
}
export const delReminder = async (uid: string, mid: string) => {
    const user = await getUser(uid);
    user.reminders.every((r, i) => {
        if (r.ids.msg === mid) user.reminders.splice(i, 1);
    });
    const timeout = client.timeouts.find(t => t.mid === mid);
    if (timeout) clearTimeout(timeout.timeout);
    await setUser(uid, user);
    return;
}

const stopUserIntervals = (reminders: DbReminder[]) => {
    reminders.forEach((reminder) => {
        const timeout = client.timeouts.find(t => t.mid === reminder.ids.msg);
        if (timeout) clearTimeout(timeout.timeout);
    });
}
export const clearReminders = async (uid: string) => {
    const user = await getUser(uid);
    stopUserIntervals(user.reminders);
    user.reminders = [];
    await setUser(uid, user);
}

export interface ReminderTimeout {
    mid: string;
    timeout: NodeJS.Timeout;
}

const watch = async (reminder: DbReminder) => {
    if (((reminder.timestamp*1000) - (now()*1000)) > 2**31) { /* Reminder doesn't activate in the next 24 days
                                                                 and ideally the bot should be restarting daily */ return;}
    client.timeouts.push(
        {
            mid: reminder.ids.msg,
            timeout: setTimeout(async () => {
                /* Reminder finished polling */
                const ref = await client.getMessage(reminder.ids.channel, reminder.ids.msg);
                if (!ref) return; // cba
                reply(ref, 'YouTube shorts');
                await delReminder(reminder.ids.user, reminder.ids.msg);
            }, ((reminder.timestamp*1000) - (now()*1000)))
        } as ReminderTimeout);
    /* Started polling 1 reminder */
}

export const continueWatching = async () => {
    const db = await pullDB();
    db.forEach(user => {
        user.value.reminders.forEach(async (reminder) => {
            if ((reminder.timestamp*1000) < (now()*1000)) { await delReminder(reminder.ids.user, reminder.ids.msg); return; }
            if (client.timeouts.filter(x => x.mid === reminder.ids.msg)) return; // do not add if already watching (pls work)
            watch(reminder);
        });
    });
    /* Started polling all remidners */
}