// Appends a content hash (?v=...) to asset URLs in index.html, so browsers never combine a fresh
// index.html with a stale cached CSS file after a deploy, and social networks (LinkedIn, Facebook, X),
// which cache preview images by URL, pick up a changed og-image.png
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const assets = [
    '/assets/css/styles.css',
    '/assets/fontawesome/css/fontawesome.min.css',
    '/assets/images/og-image.png'
];

for (const asset of assets) {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, asset))).digest('hex').slice(0, 8);
    // Matches both relative links (href="/assets/...") and absolute meta URLs (content="https://dev.goffa.cz/assets/...")
    const url = new RegExp('="((?:https://dev[.]goffa[.]cz)?' + asset.replace(/[.]/g, '[.]') + ')(\\?v=[0-9a-f]+)?"', 'g');
    html = html.replace(url, `="$1?v=${hash}"`);
}

fs.writeFileSync(indexPath, html);
