import { Message } from "eris";

const getrefmsg = (msg: Message) => {
    if (!msg.referencedMessage) return null;
    return msg.referencedMessage;
}
export const urlregex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
export const getmedia = (msg: Message, fromRef?: boolean): {url:string,replaced:string} | null => {
    const ref = getrefmsg(msg);
    if (ref && !fromRef) { return getmedia(ref, true) }
    if (msg.attachments.length != 0) return {url: msg.attachments[0].url, replaced: msg.content}; // todo: add option to pick from multiple attachments
        //                                                             like a flag: --choose 1 or -c 1
    else {
        const match = msg.content.match(urlregex);
        if (!match) return null;
        return {url: match[0], replaced: msg.content.replace(urlregex, '')};
    }
}