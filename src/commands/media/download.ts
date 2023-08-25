import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { Colors, Embeds, reply } from "@surph/lib/message";
import { hostname } from "os";
import { client } from "../..";
import { BaseArgs } from "@surph/src/classes/Args";
import { Basic, BasicError, ShazamEmbed } from "lib/message/embeds";
import { getmedia } from "lib/media/message";
import { Media, _Text, getFlags } from "lib/util/flags";
import { req } from "@surph/lib/api";

interface ExtFlags {
    url?: string;
    audio?: boolean; // What?
}

interface ExtArgs extends BaseArgs {
    url: string | null;
    audio?: boolean;
}

export default class DownloadCommand extends Command {

    constructor(){super({
        name: 'download',
        aliases: ['dl']
    })}

    parseArgs(message: Message, sliced: string) { // Remove %ping from content and then find args
        const flags: ExtFlags = Object.fromEntries(getFlags(sliced).flags);

        /* Logic to get URL from message */
        const url = flags.url || getmedia({message: message, types: [_Text.URL]})?.url || null;

        const parsed: ExtArgs = { content: { before: message.content, after: sliced },
            url: url,
            audio: flags.audio || false
         };
        return parsed;
    }

    async run(message: Message, args: ExtArgs): Promise<void> {
        if (!args.url) { await reply(message, {embed: BasicError('Invalid/no media supplied.')}); return; }
        const res = await req('download', {url: args.url, audio: (args.audio ? 1 : 0)});
        //await reply(message, {embed: ShazamEmbed(matches[0])});
        return;
    }
}