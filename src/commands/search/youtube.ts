import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { reply } from "@surph/lib/message";
import ytsr from "ytsr";
import { BasicError } from "lib/message/embeds";
import { BaseArgs } from "@surph/src/classes/Args";
import { getFlags } from "lib/util/flags";

interface ExtFlags {
    query?: string;
}
interface ExtArgs extends BaseArgs {
    query: string | null;
}

export default class YouTubeCommand extends Command {
    constructor(){super({
        name: 'youtube',
        aliases: ['yt', 'ytsr', 'searchyt', 'ytsearch']
    })}

    parseArgs(message: Message, sliced: string) {
        const flags: ExtFlags = Object.fromEntries(getFlags(sliced).flags);
        return {query: flags.query || sliced} as ExtArgs;
    }

    async run(message: Message, args: ExtArgs): Promise<void> {
        if (!args.query) { reply(message, { embed: BasicError('Invalid/no search query.') }); return; }

        const resp = await ytsr(args.query);
        const y = resp.items.filter((x) => x.type == 'video')[0];

        if (y.type != "video") { reply(message, { embed: BasicError('No results.') }); }
        else reply(message, y.url);
        return;

    }
}