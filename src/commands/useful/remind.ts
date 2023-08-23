//import Args from "@surph/src/classes/Args";
import Command from "@surph/src/classes/Commands/BaseCommand";
import { Embed, Message, TextableChannel } from "eris";
import { Colors, reply } from "@surph/lib/message";
import { Time } from "@surph/lib/util";
import SubCommand from "@surph/src/classes/Commands/SubCommand";
import Args from "@surph/src/classes/Args";
import { Basic, ListReminder, SetReminder } from "lib/message/embeds";
import { inPast } from "lib/util/time";
import { delReminder, setReminder } from "lib/util/reminders";
import { getUser } from "lib/util/db";
import { Carousel } from "lib/message/modals";

const subcommands: SubCommand[] = [
    {name: 'list', aliases: ['ls'], async run(message, args) {
        let reminders = (await getUser(message.author.id)).reminders;
        let reminderEmbeds: Embed[] = [];
        if (reminders.length === 0) { reply(message, { embed: Basic('You have no reminders set.') }); return; }
        reminders.sort((a, b) => a.timestamp - b.timestamp);

        reminders.forEach((reminder, index) => {
            reminderEmbeds.push(ListReminder(message.author, reminder, index, reminders.length));
        });
        Carousel(message, reminderEmbeds);
    }},
    {name: 'delete', aliases: ['rm', 'del', 'remove'], async run(message, args) {
        const id = args.options.get('id') || args.arr[0];
        if (isNaN(Number(id))) { reply(message, {embed: Basic('Invalid/no reminder ID provided.', Colors.Red)}); return; };
        if (await delReminder(message.author.id, id) === null) { reply(message, {embed: Basic('Couldn\'t find reminder by ID.', Colors.Red)}); return; };
        message.addReaction('👌');
    },}
]

export default class RemindCommand extends Command {
    constructor(){super({
        name: 'remind',
        aliases: ['reminder', 'remindme', 'alarm'],
        subcommands: subcommands
    })}

    async run(message: Message, args: Args) {
        let time = Time.parse(args.joined); // Returns r2s formatted time for Discord
        if (!time) { reply(message, { embed: Basic(`**Invalid time**. Please provide a relative or absolute time.`, Colors.Red) }); return; }
        if(inPast(time.timestamp)) { reply(message, { embed: Basic(`**That time is in the past**. Please provide a relative or absolute time *that is in the future*.`, Colors.Red) }); return; }
        const reminderObj = { 
            info: time.clean, timestamp: time.timestamp, url: message.jumpLink,
            ids: {msg: message.id, user: message.author.id, channel: message.channel.id }
        };
        await setReminder(message.author.id, reminderObj);
        reply(message, {embed: SetReminder(message.author, reminderObj)})
    }
}