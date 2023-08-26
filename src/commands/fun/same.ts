import Command from "@surph/src/classes/Commands/BaseCommand";
import { Message } from "eris";
import { reply } from "@surph/lib/message";
import { getFlags } from "lib/util/flags";
import { BaseArgs } from "@surph/src/classes/Args";

import { ApiBufferResponse, APIError, req } from "@surph/lib/api";

interface ExtFlags {
    text?: string;
}


export default class SAMECommand extends Command {
    constructor(){super({
        name: 'same',
		description: 'Encodes text into a SAME (EAS) header',
        aliases: ['sameheader', 'eas', 'easencode']
    })}

    parseArgs(message: Message, sliced: string): BaseArgs {
        const _flags = getFlags(sliced);
        const flags: ExtFlags = Object.fromEntries(_flags.flags);

        let text = flags.text || _flags.cleaned;
        if ((!text || text.length === 0) && message.referencedMessage) 
            text = message.referencedMessage.content;

        return {
            content: {before: sliced, after: text}
        };
    }

    async run(message: Message, args: BaseArgs): Promise<void> {
        if (!args.content.after || args.content.after.length === 0) { reply(message, 'Nothing to translate.'); return; }
        let res = await req('same', {text: args.content.after});
        if (res.type !== 'buf') return console.log((res.data as APIError).reason); // error
        const data = res.data as ApiBufferResponse;
        await reply(message, {}, [{name: `result.${data.type}`, file: data.buf}]);
		return;
    }
}
