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
export const getmedia = (msg: Message, mediaTypes: MediaSubType[], fromRef?: boolean): Media | null => {
    let res: Media;

    const ref = getrefmsg(msg);
    if (ref && !fromRef) { return getmedia(ref, mediaTypes, true) }
    if (msg.attachments.length !== 0) res = {url: msg.attachments[0].url, replaced: msg.content};
    else {
        const match = msg.content.match(urlregex);
        let matchURL: string | null = null;

        if (!match) return matchURL;
        match.every(url => { 
            mediaTypes.every(type=>{
                if (type.includes(path.extname(url).slice(1))) matchURL = url; 
                return true; 
            });
        });
        if (!matchURL) return null;

        res = {url: matchURL, replaced: msg.content.replace(urlregex, '')};
    }

    return res;
}