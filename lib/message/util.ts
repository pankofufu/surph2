import { AdvancedMessageContent, FileContent, Message, MessageContent } from "eris";

export const reply = async (message: Message, content: MessageContent, files?: FileContent[]) => {
    if (typeof content === 'string') content = {content: content} as AdvancedMessageContent;
    content.allowedMentions = { repliedUser: true };
    content.messageReference = { messageID: message.id };

    return message.channel.createMessage(content, files);
}