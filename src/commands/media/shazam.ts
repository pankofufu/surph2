import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { Embeds, reply } from "@surph/lib/message";
import { hostname } from "os";
import { client } from "../..";
import { BaseArgs, getFlags } from "@surph/src/classes/Args";
import { BasicError } from "lib/message/embeds";
import { getmedia } from "lib/media/message";
import { Media } from "lib/util/flags";

interface ExtFlags {
    url?: string;
    offset?: string; // All types have to be strings, and converted into other types in Args
}

interface ExtArgs extends BaseArgs {
    url: string | null;
    offset: number | null;
}

export default class ShazamCommand extends Command {

    constructor(){super({
        name: 'shazam'
    })}

    parseArgs(message: Message, sliced: string) { // Remove %ping from content and then find args
        const flags: ExtFlags = Object.fromEntries(getFlags(sliced));

        /* Logic to get URL from message */
        const url = flags.url || getmedia(message, [Media.Audio, Media.Video])?.url || null;
        /* Logic to get Shazam offset */
        let number = Number( flags.offset || sliced.split(' ').find(word=>!isNaN(Number(word))) );
        if (isNaN(number) || flags.offset === 'true' /* true means no value supplied */) number = 0;

        const parsed: ExtArgs = { content: { before: message.content, after: sliced },
            url: url,
            offset: number
         };
        return parsed;
    }

    run(message: Message, args: ExtArgs): void | Promise<void> {
        if (!args.url) { reply(message, {embed: BasicError('No media supplied.')}); return; }
    }
}