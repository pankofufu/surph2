import Args from "@surph/src/classes/Args";
import { Message } from "eris";
import { Colors, Embeds, reply } from "@surph/lib/message";
import MediaCommand from "@surph/src/classes/Commands/MediaCommand";
import { Media } from "lib/util/flags";
import { Shazam, req } from "@surph/lib/api";
import { ShazamEmbed } from "lib/message/embeds";

export default class ShazamCommand extends MediaCommand {
    constructor(){super({
        name: 'shazam',
        usage: '<attachment/url/reply to a message with media>',
        media: [Media.Video, Media.Audio]
    })}

    async run(message: Message, args: Args): Promise<void> {
        const url: string = args.options.get('url');
        if (!url) { reply(message, {embed: Embeds.Basic(`Invalid/no media provided.`, Colors.Red)}); return; }
        const res = await req('shazam', {url: url});
        if (res.type === 'err') return; // Implement later :)
        const {matches} = res.data as Shazam;
        if (matches.length == 0) return; // Implement later :)

        reply(message, {embed: ShazamEmbed(matches[0])});

    }
}