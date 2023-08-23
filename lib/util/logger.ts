import * as colors from "colors"
const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
export const print = {
    success: (text: string) => {
        console.log(`${colors.green(`[${formattedTime}]`)} ${text}`)
    },
    info: (text: string) => {
        console.log(`${colors.dim(`[${formattedTime}]`)} ${text}`)
    },
    warn: (text: string) => {
        console.log(`${colors.yellow(`[${formattedTime}]`)} ${text}`)
    },
    error: (text: string) => {
        console.log(`${colors.red(`[${formattedTime}]`)} ${text}`)
    },
    fatal: (text: string) => {
        console.log(`${colors.bgRed(`[${formattedTime}]`)} ${colors.red(text)}`)
    }
}