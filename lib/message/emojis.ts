import { client } from "@surph/src/index";
import { Message } from "eris";

export enum Emojis {
    Loading = 'loading:1081977500319613039'
}

export const reaction = {
    add: async (emoji: Emojis, msg: Message) => { await msg.addReaction(emoji); },
    remove: async (emoji: Emojis, msg: Message) => { await msg.removeReaction(emoji, client.user.id); }
}