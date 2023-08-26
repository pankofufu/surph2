import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { reply } from "@surph/lib/message";
import { BaseArgs } from "@surph/src/classes/Args";
import { BasicError, ErrorWithStack } from "lib/message/embeds";
import { getmedia } from "lib/media/message";
import { _Text, getFlags } from "lib/util/flags";
import { APIError, req } from "@surph/lib/api";

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
        description: 'Downloads from sites like YouTube.',
        usage: '?(--audio <boolean>) (--url <url>||<url>)',
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
        if (res.type !== 'buf') { reply(message, {embed: ErrorWithStack('Something went wrong.', (res.data as APIError).reason)}); return; };
        await reply(message, {}, [{name: `result.${res.data.type}`, file: res.data.buf}]);
        return;
    }
}