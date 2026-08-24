const res = await fetch("https://www.youtube.com/@Gals_nataliagalvis", {
  headers: { "Accept-Language": "en" },
});
const html = await res.text();
const m =
  html.match(/"channelId":"(UC[^"]+)"/) ||
  html.match(/"externalId":"(UC[^"]+)"/);
console.log("channelId", m?.[1] ?? "not found");
const re = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
const ids = new Set();
let match;
while ((match = re.exec(html)) && ids.size < 10) ids.add(match[1]);
console.log("vids", [...ids]);
