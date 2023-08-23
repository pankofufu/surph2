/* Basic exports */
export interface Err {reason: string;}

interface s_Metadata {
    title: string;
    artists: Array<{name: string}>;
    isrc: string;
    artist: string;
    openin: unknown; // only has apple music support so it's useless, don't bother type checking
    coverart: string;
}
interface s_Match {
    key: string;
    trackId: string;
    offset: number; // how far into the song the match is
    metadata: s_Metadata;
    type: string;
    adamId: string; // apple music ID
    weburl: string;
}
export interface Shazam {
    matches: s_Match[];
    recordingIntermission: number;
}