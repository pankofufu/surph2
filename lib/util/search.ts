import { client } from "@surph/src/index";
export const search = (alias: string) => {
    const keyvalsearch = Array.from(client.commands).find(
        keyval => keyval[1].aliases && keyval[1].aliases.includes(alias)
    )
    return keyvalsearch ? keyvalsearch[1] : null;
}