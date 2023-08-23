import { req } from "@surph/lib/api"
import { Err, Shazam } from "@surph/lib/api";

(async () => {
    const r = await req('shazam', { url: 'https://cdn.discordapp.com/attachments/1021908533039599636/1142196273882091671/obsidic.mp4' });
    if (r.type === 'err') {
        console.log('[ERROR]', (r.data as Err).reason);
        return;
    }
    console.log(
        (r.data as Shazam).matches[0].metadata.artists
    );
})();