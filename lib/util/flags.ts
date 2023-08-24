export type MediaSubType = string[];
export type MediaType = {
    Video: string[];
    Audio: string[];
    Image: string[];
};

export const Media: MediaType = {
    Video: ["mp4", "mov", "mkv", "webm"],
    Audio: ["mp3", "wav", "m4a", "flac"],
    Image: ["jpg", "jpeg", "png"]
};

export type TextSubType = string[];
export type TextType = {
    URL: string[];
}
export const _Text: TextType = {
    URL: /* Allowed URLs: */ ['youtube.com', 'youtu.be', 'soundcloud.com', 'twitter.com', 'x.com']
}

export interface FlagsAndContent {
    flags: Map<string, any>;
    cleaned: string;
}

export const getFlags = (content: string): FlagsAndContent => {
    const flags: Map<string, any> = new Map();
    const flagRegex = /--(\w+)\s*([^-\s]*)/g;
    let cleaned = content.replace(flagRegex, '').trim();

    const matches = content.matchAll(flagRegex);
    for (const match of matches) {
        const [fullMatch, name, _value] = match;

        let value: string;
        if (_value.length !== 0) value = _value.replace(/^=/, '');
        else value = _value;

        let parsedValue: string | number | boolean;
        if (value.length === 0 || value.toLowerCase() === 'true' || value.toLowerCase() === 'y' || value.toLowerCase() === 'yes') {
            parsedValue = true;
        } else if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
            parsedValue = false;
        } else if (!isNaN(Number(value))) {
            parsedValue = Number(value);
        } else {
            parsedValue = value;
        }
        flags.set(name, parsedValue);
    }

    return {
        flags,
        cleaned,
    };
}