// Appends a content hash (?v=...) to asset URLs in the generated pages, so browsers never combine a fresh
// page with a stale cached CSS file after a deploy, and social networks (LinkedIn, Facebook, X),
// which cache preview images by URL, pick up a changed og-image
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = ['index.html', 'en/index.html'];
const assets = [
    '/assets/css/styles.css',
    '/assets/fontawesome/css/fontawesome.min.css',
    '/assets/images/og-image.png',
    '/assets/images/og-image-en.png'
];

for (const page of pages) {
    const pagePath = path.join(root, page);
    let html = fs.readFileSync(pagePath, 'utf8');

    for (const asset of assets) {
        const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, asset))).digest('hex').slice(0, 8);
        // Matches both relative links (href="/assets/...") and absolute meta URLs (content="https://dev.goffa.cz/assets/...")
        const url = new RegExp('="((?:https://dev[.]goffa[.]cz)?' + asset.replace(/[.]/g, '[.]') + ')(\\?v=[0-9a-f]+)?"', 'g');
        html = html.replace(url, `="$1?v=${hash}"`);
    }

    fs.writeFileSync(pagePath, html);
}
