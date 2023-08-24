import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message, TextChannel } from "eris";
import { Embeds, reply } from "@surph/lib/message";
import { hostname } from "os";
import { client } from "../..";
import { getFlags } from "lib/util/flags";
import { BaseArgs } from "@surph/src/classes/Args";
import { TranslationResult, req } from "@surph/lib/api";
import { TranslationEmbed } from "lib/message/embeds";

interface ExtFlags {
    to?: string;
}

interface ExtArgs extends BaseArgs {
    to?: string;
}

export default class TranslateCommand extends Command {
    constructor(){super({
        name: 'translate',
        aliases: ['tr', 'googletranslate', 'gtr']
    })}

    parseArgs(message: Message, sliced: string): ExtArgs {
        const _flags = getFlags(sliced);
        const flags: ExtFlags = Object.fromEntries(_flags.flags);

        let text = _flags.cleaned;
        if ((!text || text.length === 0) && message.referencedMessage) 
            text = message.referencedMessage.content;

        return {
            to: flags.to,
            content: {before: sliced, after: text}
        };
    }

    async run(message: Message, args: ExtArgs): Promise<void> {
        if (!args.content.after || args.content.after.length === 0) { reply(message, 'Nothing to translate.'); return; }
        let res = await req('translate', {text: args.content.after, target: args.to || 'en'});
        if (res.type !== 'json') return; // error
        const translation = res.data as TranslationResult;
        await reply(message, {embed: TranslationEmbed(translation)});
        return;
    }
}