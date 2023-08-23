import { ActionRow, ComponentInteraction, Embed, Message } from "eris";
import { reply } from "../index";
import { client } from "@surph/src/index";

export const DialogComponents = (disabled: boolean): ActionRow => {
    return {
        type: 1,
        components: [
            { custom_id: 'yes', /* Confirm */ type: 2, style: 1, label: 'Yes', disabled: disabled },
            { custom_id: 'no', /* Cancel */ type: 2, style: 2, label: 'No', disabled: disabled }
        ]
    }
}

export interface ActiveDialog {
    embed: Embed;
    message: Message;

    onConfirm: ((interaction: ComponentInteraction)=>void) | ((interaction: ComponentInteraction)=>Promise<void>);
    onCancel: ((interaction: ComponentInteraction)=>void) | ((interaction: ComponentInteraction)=>Promise<void>);
    timeout?: NodeJS.Timeout;
}

export const Dialog = async (options: ActiveDialog) => {
    const sentmsg = await reply(options.message, 
        {
            embed: options.embed,
            components: [DialogComponents(false)]
        }
    )
    client.dialogs.push({
        embed: options.embed, 
        message: options.message, 
        onConfirm: options.onConfirm,
        onCancel: options.onCancel,

        timeout: setTimeout(()=>{ 
            client.dialogs.filter((dialog, index) => {
                if (dialog.message.id === options.message.id) {
                    client.carousels.splice(index, 1); 
                    sentmsg.edit({components: []});
                    return true
                }
                else return false;
            }) }, 30000)

    } as ActiveDialog);
}