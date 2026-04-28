import { google } from "googleapis"; // Wait I don't have this.
// I can just fetch from standard youtube search page and grep the id!
async function main() {
    for (const name of ["马龙 乒乓球", "樊振东 乒乓球", "张继科 乒乓球", "许昕 乒乓球", "王楚钦 乒乓球", "孙颖莎 乒乓球"]) {
        const res = await fetch(`https://m.youtube.com/results?search_query=${encodeURIComponent(name)}`);
        const text = await res.text();
        const match = text.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
        console.log(name, match ? match[1] : "NOT FOUND");
    }
}
main();
