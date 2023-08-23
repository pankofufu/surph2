export enum Media {
    Video = 'Video',
    Audio = 'Audio',
    Image = 'Image',
}
export enum Text {
    URL = 'URL',
    Text = 'Text'
}

export type FlagType = Media | Text;