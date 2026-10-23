// Notifies Bing, Seznam and other IndexNow search engines about the URLs in sitemap.xml
// (run via `npm run indexnow` after a deploy is live)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const host = 'dev.goffa.cz';

// The key is the name of the <key>.txt file in the repository root (it has to be served at https://host/<key>.txt)
const keyFile = fs.readdirSync(root).find(file => /^[0-9a-f]{32}\.txt$/.test(file));
if (!keyFile) {
    throw new Error('IndexNow key file (<32 hex chars>.txt) not found in the repository root');
}
const key = path.basename(keyFile, '.txt');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: `https://${host}/${keyFile}`, urlList })
}).then(response => {
    console.log(`IndexNow: HTTP ${response.status} for ${urlList.join(', ')}`);
    if (!response.ok) {
        process.exitCode = 1;
    }
});
