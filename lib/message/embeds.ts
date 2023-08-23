import { Embed } from "eris"
import { Colors } from ".";

export const Basic = (text: string) => {
    return {
        description: text,
        color: Colors.White
    } as Embed;
}