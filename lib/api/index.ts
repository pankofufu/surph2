/* TODO
   - Make Response class. Has property 'type' that defines what values you get back.
   - Type is JSON, you get a JSON back. Type is media, you get media back.
   - Use flags to figure out what you're expecting from user, and what you're sending to server.
*/
import { api } from "@surph/config";
import path from "path";

type ApiResponseType = 'buf' | 'json' | 'err'
type ApiResponseDataType = Record<string, any> | ApiBufferResponse;
export interface ApiBufferResponse { type: string, buf: Buffer };
export interface ApiResponse {
    type: ApiResponseType;
    data: ApiResponseDataType;
}

const encode = (text: string): string => {
    return Array.from(new TextEncoder().encode(text))
        .map(byte => byte.toString(16).padStart(2, '0')).join('');
}

type Endpoints = 'shazam' | 'edit' | 'translate' | 'ocr' | 'download';

export const req = async (endpoint: Endpoints, obj: object): Promise<ApiResponse> => {
    try {

        let args = `?`;

        for (const [key, value] of Object.entries(obj)) {
            args += `${key}=${(
                key == 'url' || !isNaN(parseInt(value))
            ) ? encodeURI(value) : encode(value)}&`;
            // hex encode anything that isn't a URL
        }
        const url = `http://${api}/${endpoint}${args}`.slice(0, -1);
        const send = await fetch(url, { method: 'POST' });
        if (send.status != 200) { /*signale.warn('Fetcher: ' + await send.text());*/ return {type: 'err',  data: {reason: await send.text()}} }
        const mediaHeader = send.headers.get('content-disposition');
        if (mediaHeader) {
            const buffer = Buffer.from(new Uint8Array(await send.arrayBuffer()));
            return { type: 'buf', data: { type: path.extname(mediaHeader), buf: buffer } };
        } else {
            const json = await send.json();
            return { type: 'json', data: json };
        }
    }
    catch (e) {
        return { type: 'err', data: { reason: `${e}` } };
    }
}

export * from './types'; // Re-export types