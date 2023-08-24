export const getFlags = (content: string): Map<string, any> => {
    const flags: Map<string, any> = new Map();
    const parts = content.split("-");
    for (let i = 0; i < parts.length; i++) {
        const flag = parts[i].trim();
        if (flag !== "") {

            // let [name, value] = flag.split(" ");
            let [name, value] = flag.split(/[= ]/); // experimental

            let parsedValue: string | number | boolean;
            if (
                (value && (value.toLowerCase() === "true" || value.toLowerCase() === "y" || value.toLowerCase() === "yes"))
                || value === undefined) {
                parsedValue = true;
            } else if (value.toLowerCase() == "no" || value.toLowerCase() === "false") {
                parsedValue = false;
            } else if (!isNaN(Number(value))) {
                parsedValue = Number(value);
            } else {
                parsedValue = value;
            }
            flags.set(name, parsedValue);
            }
    }
    return flags;
}

export interface BaseArgsOptions {
    content: {before: string, after?: string};
    flags?: {}; // use as <interface args>
    subcommand?: string;
}

export class BaseArgs {
    content: {before: string, after?: string};
    flags?: {}; // use as <interface args>
    subcommand?: string;

    constructor(options: BaseArgsOptions) {
        this.content = options.content;
        this.flags = options.flags;
        this.subcommand = options.subcommand;
    }

}

export const DefaultArgs = (sliced: string) => new BaseArgs({content: { before: sliced},flags: getFlags(sliced)})