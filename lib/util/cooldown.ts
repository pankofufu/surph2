import { Guild, Message } from "eris";
import Command from "@surph/src/classes/Commands/BaseCommand";
import { client } from "@surph/src/index";
import { settings } from "@surph/config";
import { now } from "./time";

export interface TrackedCommand {
    command: Command;
    running: boolean;
    finishedAt?: number; // timestamp when it finished running
                             //  to get the amount of time left for a cooldown,
                             // do ( timeout - now() - finishedAt )
    message: Message;
    guild?: Guild;
}

export const setCooldown = (message: Message, command: Command) => {
    client.cooldowns.push({
        running: true,
        command: command, 
        message: message, 
        guild: message.guildID ? client.guilds.get(message.guildID) : undefined
    });
}

export const leaseCooldown = (id: string) => {
    const index = client.cooldowns.findIndex(x=>id===x.message.id);
    const cooldown = client.cooldowns.find(x=>id===x.message.id);

    if (isNaN(index) || !cooldown) return;

    cooldown.finishedAt = now();
    client.cooldowns[index] = cooldown;
    setTimeout(()=>{ 
        client.cooldowns.splice(index, 1);
    }, (cooldown.command.timeout||settings.defaultTimeout)*1000 );

    return;
}

export const getCooldown = (message: Message, command: Command) => {

    const cooldown = client.cooldowns.find(x=>
        x.command.name === command.name &&
        ( (x.message.author.id === message.author.id) || (x.guild?.id === message.guildID) )
    )

    if (cooldown) return cooldown; else return null;
}