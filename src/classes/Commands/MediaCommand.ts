import { Message } from "eris";
import Args from "../Args";
import Command, { CommandOptions } from "./BaseCommand";

export default class MediaCommand extends Command {

    constructor(options: CommandOptions) {
        if (!options.flags) options.flags = [];
        super(options);
    }
    
    preRun(message: Message, args: Args): boolean | Promise<boolean> {
        return true;
    }

}