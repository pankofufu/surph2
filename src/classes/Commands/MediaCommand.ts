import { Message } from "eris";
import Args from "../Args";
import Command, { CommandOptions } from "./BaseCommand";
import { MediaSubType, MediaType } from "@surph/lib/util";

interface MediaCommandOptions extends CommandOptions {
    media: MediaSubType[];
}

export default class MediaCommand extends Command {

    media: MediaSubType[];

    constructor(options: MediaCommandOptions) {
        super(options as CommandOptions);
        this.media = options.media;
    }
    
    preRun(message: Message, args: Args): boolean | Promise<boolean> {
        return true;
    }

}