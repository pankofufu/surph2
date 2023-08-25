import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message, TextChannel } from "eris";
import { Embeds, reply } from "@surph/lib/message";
import { hostname } from "os";
import { client } from "../..";
import { Media, getFlags } from "lib/util/flags";
import { BaseArgs } from "@surph/src/classes/Args";
import { OCRResult, TranslationResult, req } from "@surph/lib/api";
import { TranslationEmbed } from "lib/message/embeds";
import { getmedia } from "@surph/lib/media";

interface ExtFlags {
    to?: string;
    url?: string;
}

interface ExtArgs extends BaseArgs {
    to?: string;
    url: string | null;
}

export default class OCRTranslateCommand extends Command {
    constructor(){super({
        name: 'ocrtranslate',
        aliases: ['ocrtr', 'ocrgtr']
    })}

    parseArgs(message: Message, sliced: string) { // Remove %ping from content and then find args
        const flags: ExtFlags = Object.fromEntries(getFlags(sliced).flags);

        /* Logic to get URL from message */
        const url = flags.url || getmedia({message: message, types: [Media.Audio, Media.Video]})?.url || null;
        /* Logic to get Shazam offset */

        return {
            to: flags.to,
            url: url,
            content: { before: sliced, after: '' /* Fuck it */ }
        };
    }

    async run(message: Message, args: ExtArgs): Promise<void> {
        if (!args.url || args.url.length === 0) { reply(message, 'Invalid/no media to OCR.'); return; }
        let ocrRes = await req('ocr', {url: args.url /* API hasn't implemented source & target lang yet */});
        if (ocrRes.type !== 'json') return; // error OCRing
        const trRes = await req('translate', { text: (ocrRes.data as OCRResult).text, target: args.to });
        if (trRes.type !== 'json') return; // error translating

        const translation = trRes.data as TranslationResult;
        translation.from = (ocrRes.data as OCRResult).lang;
        await reply(message, {embed: TranslationEmbed(translation)});

        return;
    }
}