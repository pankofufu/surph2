import * as fs from 'node:fs';
import { __src } from "../lib/util";
import BaseCommand from "./classes/Commands/BaseCommand";
//import BaseCommand from "./src/classes/Commands/BaseCommand"

const commands = new Map<string, BaseCommand>();

export class CommandHandler {

    async load() {
        const path = `${__src}/commands`;
        const folders = fs.readdirSync(path); // should return all folders
        folders.forEach(async (folder) => await this._loadFolder(folder));
    }

    async _loadFolder(folder: string) {
        console.log('Running');
        const path = `${__src}/commands/${folder}`;
        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const CommandModule = await import(`${path}/${file}`);
            console.log(CommandModule);
            const CommandClass = CommandModule.default;
            const commandInstance = new CommandClass();
            commands.set(commandInstance.name, commandInstance);
        }
        return;
    }
}

(async()=>{  
    await (new CommandHandler()).load();
    console.log(commands)  
})();