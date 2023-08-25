import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { reply } from "@surph/lib/message";
import { BaseArgs } from "@surph/src/classes/Args";
import { getmedia } from "lib/media/message";
import { Media } from "lib/util/flags";
import { APIError, ApiBufferResponse, req } from "@surph/lib/api";
import { getFlags } from "lib/util/flags";
import { BasicError, ErrorWithStack } from "lib/message/embeds";

interface ExtFlags {
    media?: string; // URL will be confusing because we will be using URLs in the music= command
    offset?: string; // All types have to be strings, and converted into other types in Args
}

interface ExtArgs extends BaseArgs {
    url: string | null;
    offset: number | null;
}

export default class EditCommand extends Command {

    constructor(){super({
        name: 'edit',
        aliases: ['destroy', 'veb', 'editvid', 'editvideo']
    })}

    parseArgs(message: Message, sliced: string) { // Remove %ping from content and then find args
        const _flags = getFlags(sliced);
        const flags: ExtFlags = Object.fromEntries(_flags.flags);

        /* Logic to get URL from message */
        const mediaObj = getmedia({
            message: message, types: [Media.Audio, Media.Image, Media.Video]
        });
        let media = flags.media || mediaObj?.url || undefined;
        /* Logic to get Shazam offset */
        let number = Number( flags.offset || sliced.split(' ').find(word=>!isNaN(Number(word))) );
        if (isNaN(number) || flags.offset === 'true' /* true means no value supplied */) number = 0;
        const parsed: ExtArgs = { content: { before: message.content, after: _flags.cleaned },
            url: media || '',
            offset: number
        };
        return parsed;
    }

    async run(message: Message, args: ExtArgs): Promise<void> {
        if (!args.url || args.url === '') { reply(message, {embed: BasicError('Invalid/no media to edit.')}); return; }
        const vebArgs = args.content.after;
        if (!vebArgs) { reply(message, {embed: BasicError('No args to edit media with.')}); return; }
        
        const res = await req('edit', {url: args.url, args: vebArgs});
        if (res.type !== 'buf') { reply(message, {embed: ErrorWithStack('Something went wrong.', (res.data as APIError).reason)}); return; };
        const data = res.data as ApiBufferResponse;
        await reply(message, {}, [{name: `result.${data.type}`, file: data.buf}]);
        
        return;
    }
}