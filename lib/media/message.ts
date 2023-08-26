import { Message } from "eris";
import { MediaSubType } from "lib/util/flags";
import path from "path";

const getrefmsg = (msg: Message) => {
    if (!msg.referencedMessage) return null;
    return msg.referencedMessage;
}
export const urlregex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
interface Media {
    url: string,
    replaced: string
} 
// todo: add choice of multiple attachments if found

interface GetMediaOptions {
    message: Message,
    content?: string,
    types: MediaSubType[],
    fromReference?: boolean,
    attachmentsOnly?: boolean
}

export const getmedia = (options: GetMediaOptions): Media | null => {
    let res: Media;
    let content: string;
    if (options.content) content = options.content;
    else content = options.message.content;

    const ref = getrefmsg(options.message);
    if (ref && !options.fromReference) { 
        const _options = options; 
        _options.message = ref; 
        return getmedia(_options) 
    }
    if (options.message.attachments.length !== 0) 
        res = {url: options.message.attachments[0].url, replaced: content};
    else {
        const match = options.message.content.match(urlregex);
        let matchURL: string | null = null;

        if (!match) return {url: '', replaced: content /* Nothing to replace, no matches */};
        match.every(url => { 
            if (options.types) options.types.every(type=>{
                if (type.includes(path.extname(url).slice(1))) matchURL = url;
                if (type.find( whitelisted => whitelisted.includes( new URL(url).hostname ) )) matchURL = url;
                return true; 
            }); else matchURL=url; // Allow URL if no media types at all
        });
        if (!matchURL) return null;

        res = {url: matchURL, replaced: content.replace(urlregex, '')};
    }

    return res;
}