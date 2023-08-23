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