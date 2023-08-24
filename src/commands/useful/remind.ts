//import Args from "@surph/src/classes/Args";
import Command from "@surph/src/classes/Commands/BaseCommand";
import { Embed, Message, TextableChannel } from "eris";
import { Colors, reply } from "@surph/lib/message";
import { Time } from "@surph/lib/util";
import SubCommand from "@surph/src/classes/Commands/SubCommand";
import { BaseArgs } from "@surph/src/classes/Args";
import { Basic, ListReminder, SetReminder } from "lib/message/embeds";
import { inPast } from "lib/util/time";
import { delReminder, setReminder } from "lib/util/reminders";
import { DbReminder, getUser } from "lib/util/db";
import { Carousel } from "lib/message/modals";
import { DefaultArgs } from "src/classes/Args";

interface DeleteReminderArgs extends BaseArgs {
    reminderID: string;
}

const subcommands: SubCommand[] = [
    {name: 'list', aliases: ['ls'], async run(message) {
        let reminders = (await getUser(message.author.id)).reminders;
        let reminderEmbeds: Embed[] = [];
        if (reminders.length === 0) { reply(message, { embed: Basic('You have no reminders set.') }); return; }
        reminders.sort((a, b) => a.timestamp - b.timestamp);

        reminders.forEach((reminder, index) => {
            reminderEmbeds.push(ListReminder(message.author, reminder, index, reminders.length));
        });
        Carousel(message, reminderEmbeds);
    }},
    {name: 'delete', aliases: ['rm', 'del', 'remove'], async run(message, args: DeleteReminderArgs) {
        const id = args.reminderID;
        if (isNaN(Number(id))) { reply(message, {embed: Basic('Invalid/no reminder ID provided.', Colors.Red)}); return; };
        if (await delReminder(message.author.id, id) === null) { reply(message, {embed: Basic('Couldn\'t find reminder by ID.', Colors.Red)}); return; };
        message.addReaction('👌');
    }}
]

interface ExtFlags {
    time?: string;
    info?: string; // All types have to be strings, and converted into other types in Args
}

interface ExtArgs extends BaseArgs {
    time: number | null; // timestamp
}

export default class RemindCommand extends Command {
    constructor(){super({
        name: 'remind',
        aliases: ['reminder', 'remindme', 'alarm'],
        subcommands: subcommands
    })}

    parseArgs(message: Message, sliced: string): ExtArgs {
        let subcommand: string | null;
        const firstArg = sliced.split(' ')[0].toLowerCase();
        if (this.getSubcommand && this.getSubcommand(firstArg)) subcommand = firstArg;
        else subcommand = null;
        const time = Time.parse(sliced);
        return {
            time: time?.timestamp || null,
            content: {before: message.content, after: time?.clean} // use args.content.after as reminder info
        }
    }

    async run(message: Message, args: ExtArgs) {
        if (!args.time) { reply(message, { embed: Basic(`**Invalid time**. Please provide a relative or absolute time.`, Colors.Red) }); return; }
        if(inPast(args.time)) { reply(message, { embed: Basic(`**That time is in the past**. Please provide a relative or absolute time *that is in the future*.`, Colors.Red) }); return; }
        
        const reminderObj: DbReminder = { 
            info: args.content.after || '...', timestamp: args.time, url: message.jumpLink,
            ids: {msg: message.id, user: message.author.id, channel: message.channel.id }
        };
        await setReminder(message.author.id, reminderObj);
        reply(message, {embed: SetReminder(message.author, reminderObj)})
    }
}