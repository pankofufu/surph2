import { prefix } from "@surph/config";
import { Message } from "eris";
import { getmedia } from "lib/media/message";

export default class Args {

    wantsMedia: boolean;
    message: Message;
    joined: string;
    command: string;

    static getCmd(val: string) {
        return val.split(' ')[0].slice(prefix.length, val[0].length).toLowerCase();
    }

    constructor(message: Message, wantsMedia?: boolean) {
        this.message = message; // nice one
        this.wantsMedia = wantsMedia ? true : false; // ok
        let xd = message.content.split(' ');
        this.command = Args.getCmd(xd[0]);
        xd.shift(); // why does .shift() return the FUCKING value?? and STILL shift it?? WHAT THE FUCK!??
        this.joined = xd.join(' ');
    }

    get arr() {
        return this.joined.split(' ');
    }

    get flags(): Map<string, any> {
        const flags: Map<string, any> = new Map();
        const parts = this.joined.split("-");
        for (let i = 0; i < parts.length; i++) {
            const flag = parts[i].trim();
            if (flag !== "") {
                const [name, value] = flag.split(" ");
                let parsedValue: string | number | boolean;
                if (value === "true" || value === "y" || value === "yes" || value === undefined) {
                    parsedValue = true;
                } else if (value === "false") {
                    parsedValue = false;
                } else if (!isNaN(Number(value))) {
                    parsedValue = Number(value);
                } else {
                    parsedValue = value;
                }
                flags.set(name, parsedValue);
            }
        }
        if (this.wantsMedia && flags.has('url')) {
            // look for media in messagse
            flags.set('url', getmedia(this.message));
        }
        return flags;
    }
}

/*const val = "%shift --audio";
const args = new Args(val);
console.log(args.flags);*/