// Appends a content hash to the stylesheet links in index.html (?v=...), so browsers
// never combine a fresh index.html with a stale cached CSS file after a deploy
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

for (const asset of ['/assets/css/styles.css', '/assets/fontawesome/css/fontawesome.min.css']) {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, asset))).digest('hex').slice(0, 8);
    const link = new RegExp('href="' + asset.replace(/[.]/g, '[.]') + '(\\?v=[0-9a-f]+)?"', 'g');
    html = html.replace(link, `href="${asset}?v=${hash}"`);
}

fs.writeFileSync(indexPath, html);
