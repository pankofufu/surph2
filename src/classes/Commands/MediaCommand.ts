import { Message } from "eris";
import Args from "../Args";
import Command from "./BaseCommand";

export default class MediaCommand extends Command {

    wantsMedia = true;
    
    preRun(message: Message, args: Args): boolean | Promise<boolean> {
        return true;
    }

}