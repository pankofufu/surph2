import { Embed, User } from "eris"
import { Colors } from "@surph/lib/message";
import { DbReminder } from "lib/util/db";
import { OCRResult, TranslationResult, s_Match } from "../api";
import { ReadableStreamDefaultController } from "node:stream/web";

export const Basic = (text: string, color?: Colors) => {
    return {
        description: text,
        color: color || Colors.White
    } as Embed;
}

export const BasicError = (text: string) => {
    return {
        description: `:octagonal_sign:  ${text}`,
        color: Colors.Red
    }
}
export const ErrorWithStack = (text: string, stack: string) => {
    return {
        description: `:octagonal_sign:  ${text}\n\`\`\`${stack}\`\`\``,
        color: Colors.Red
    }
}

//                                                         Reminder      / Total reminders
const BaseReminder = (user: User, title: string, reminder: DbReminder, color: Colors, index?: number, total?: number) => {
    return {
        author: {name: user.username, icon_url: user.avatarURL},
        title: `Reminder${title!=='' ? ` ${title}` : ''}`,
        color: color,
        url: reminder.url,
        description: `\`\`\`${reminder.info}\`\`\``,
        footer: ((index!==undefined && total!==undefined) ? {text: `\`${index+1}\` out of \`${total}\` reminders`} : undefined), // Can't imagine codetags working in footer
        fields: [
            {name: 'Timestamps', value: `**Relative:** <t:${reminder.timestamp}:R>\n**Absolute:** <t:${reminder.timestamp}:d>`,  inline: true},
            {name: 'Reminder IDs', value: `**Message:** \`${reminder.ids.msg}\`\n**Timestamp:** \`${reminder.timestamp}\``, inline: true}
        ]

    } as Embed;
}

export const SetReminder = (user: User, reminder: DbReminder) => BaseReminder(user, 'set successfully', reminder, Colors.Green);
export const DueReminder = (user: User, reminder: DbReminder) => BaseReminder(user, 'due now', reminder, Colors.Yellow);
export const ListReminder = (user: User, reminder: DbReminder, index: number, total: number) => BaseReminder(user, '', reminder, Colors.White, index, total);


export const ShazamEmbed = (match: s_Match) => {
    return {
            title: match.metadata.title,
            url: match.weburl,
            author: { name: match.metadata.artist },
            color: Colors.ShazamBlue,
            image: {url: match.metadata.coverart},
            footer: { text: 'Powered by Shazam', 
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Shazam_icon.svg/2048px-Shazam_icon.svg.png' 
        }
    } as Embed;
}

export const TranslationEmbed = (translation: TranslationResult) => {
    return {
        description: `\`\`\`${translation.text}\`\`\``,
        color: Colors.TranslationBlue,
        thumbnail: {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png'},
        fields: [
            {name: 'From', value: `\`${translation.from}\``, inline: true},
            {name: 'To', value: `\`${translation.to}\``, inline: true}
        ]
    } as Embed;
}
export const OCREmbed = (ocr: OCRResult) => {
    return {
        description: `\`\`\`${ocr.text}\`\`\`\n**From** \`${ocr.lang}\``,
        color: Colors.Green,
        thumbnail: {url: 'https://cdn.discordapp.com/attachments/1138818819670933524/1141836922336063519/google-cloud-icon-400w.png'},
    } as Embed;
}