import type Command from "@surph/src/classes/Commands/BaseCommand";
import { reply } from "lib/util/message";

export default  {
    options: { name: 'ping' },
    async run(message, args) {
        console.log(args);
        reply(message, 'hello');
    },
} as Command